/**
 * Guards the cross-platform contract: Windows-only rules never touch macOS
 * rendering. Three invariants, all previously checked by hand after every
 * merge:
 *
 * a) every rule that references the plugin's Windows-only custom properties
 *    (--dpui-*) is darwin-guarded, so macOS never resolves them;
 * b) darwin-guarded rules paint through tokens only — a hex literal would
 *    freeze one palette and drift from the generated layers;
 * c) the mac-reachable rule set (every rule except the darwin-guarded ones)
 *    in dist/client.js is byte-identical to the committed HEAD, so a Windows
 *    edit can never silently change what macOS resolves.
 */
import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const GUARD = "html:not([data-platform='darwin'])"

/** @returns the CSS with comments removed and whitespace normalized per rule. */
function rules(css) {
  return (css.replace(/\/\*.*?\*\//gs, '')
    .match(/[^{}]+\{[^{}]*\}/g) ?? [])
    .map(rule => rule.replace(/\s+/g, ' ').trim())
}

/**
 * The bundle is JS with the skin inlined as one template literal, so a whole
 * -file rule pass would read function bodies as CSS. Extract just that
 * literal: esbuild emits it as `var skin_default = \`...\``.
 * @returns the skin CSS embedded in the bundle.
 */
function skinLiteral(bundle) {
  const start = bundle.indexOf('var skin_default = `')
  if (start < 0) throw new Error('skin literal not found in bundle')
  const from = start + 'var skin_default = `'.length
  const end = bundle.indexOf('`', from)
  if (end < 0) throw new Error('unterminated skin literal')
  return bundle.slice(from, end)
}

const source = rules(readFileSync('src/client/skin.css', 'utf8'))
const dist = readFileSync('dist/client.js', 'utf8')
const distRules = rules(skinLiteral(dist))
let failures = 0
const fail = message => { failures++; console.error(`FAIL: ${message}`) }

// a) --dpui-rail and the sidebar-fill redefinition are the Windows color
//    vocabulary; any rule using them must be guarded. The --dpui-sidebar-*
//    typography variables are intentionally shared: both platforms consume
//    them for row sizing, so they are not part of the color contract.
const WINDOWS_COLOR = /--dpui-rail|--dsw-specific-sidebar-fill\s*:/
for (const rule of source) {
  if (WINDOWS_COLOR.test(rule) && !rule.includes(GUARD)) {
    fail(`unguarded Windows color rule: ${rule.slice(0, 80)}`)
  }
}

// b) Guarded rules are comment-stripped above; any hex left is a real literal.
const guarded = source.filter(rule => rule.includes(GUARD))
for (const rule of guarded) {
  const hex = rule.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []
  if (hex.length > 0) fail(`hardcoded color in a guarded rule: ${hex.join(', ')}`)
}

// c) The mac-reachable dist rules must match HEAD exactly — except skin
//    chrome, which may evolve: rules guarded by the Windows block, by the
//    palette attribute (html[data-dsh-palette]), or by the darwin+palette
//    combination (html[data-platform='darwin'] ... data-dsh-palette). Those
//    all disappear when "Original colors" is chosen, so the official
//    rendering stays frozen; everything else is byte-compared to HEAD.
const WIN_GUARD = GUARD
const PALETTE_GUARD = 'data-dsh-palette'
const SKIN_GUARDS = ['data-dsh-palette', "html:not([data-platform='darwin'])"]
/** @returns whether a rule only applies under a skin, so Original colors never resolves it. */
const themed = rule => SKIN_GUARDS.some(guard => rule.includes(guard))
const macReachable = list => list.filter(rule => !rule.includes(WIN_GUARD)).sort()
const current = macReachable(distRules)
for (const rule of current) {
  if (rule.includes('--dpui-rail') && !themed(rule)) {
    fail(`unguarded skin rule: ${rule.slice(0, 80)}`)
  }
}
if (process.env.SKIP_BASELINE !== '1') {
  const head = execSync('git show HEAD:dist/client.js').toString()
  const baseline = macReachable(rules(skinLiteral(head)))
  const core = list => list.filter(rule => !themed(rule))
  const added = core(current).filter(rule => !core(baseline).includes(rule))
  const removed = core(baseline).filter(rule => !core(current).includes(rule))
  for (const rule of added) fail(`mac-reachable rule added: ${rule.slice(0, 80)}`)
  for (const rule of removed) fail(`mac-reachable rule removed: ${rule.slice(0, 80)}`)
  const countCurrent = core(current).length
  const countBaseline = core(baseline).length
  if (added.length === 0 && removed.length === 0 && countCurrent !== countBaseline) {
    fail(`core rule count changed: ${countBaseline} -> ${countCurrent}`)
  }
}

console.log(failures === 0
  ? `verify-skin: OK (${guarded.length} guarded rules in skin.css, ${current.length} mac-reachable rules in dist)`
  : `verify-skin: ${failures} failure(s)`)
process.exit(failures === 0 ? 0 : 1)
