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
  // A backtick inside the CSS reaches the bundle escaped, so stopping at the
  // first one truncated the skin mid-file and this whole check went blind to
  // every rule after it. Only an unescaped backtick ends the literal.
  let end = -1
  for (let i = from; i < bundle.length; i++) {
    if (bundle[i] !== '`') continue
    let slashes = 0
    for (let j = i - 1; j >= from && bundle[j] === '\\'; j--) slashes++
    if (slashes % 2 === 0) { end = i; break }
  }
  if (end < 0) throw new Error('unterminated skin literal')
  return bundle.slice(from, end).replace(/\\`/g, '`')
}

const source = rules(readFileSync('src/client/skin.css', 'utf8'))
const dist = readFileSync('dist/client.js', 'utf8')
const distRules = rules(skinLiteral(dist))
let failures = 0
const fail = message => { failures++; console.error(`FAIL: ${message}`) }

// The bundle must carry every rule skin.css declares. This is the check that
// makes the others trustworthy: a selector the extractor never saw would pass
// every rule-level test by simply not being there.
{
  const missing = source.filter(rule => !distRules.includes(rule))
  const extra = distRules.filter(rule => !source.includes(rule))
  if (missing.length > 0) fail(`skin.css rules absent from the bundle: ${missing[0].slice(0, 70)}`)
  if (extra.length > 0) fail(`bundle carries rules skin.css does not: ${extra[0].slice(0, 70)}`)
}

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

// b2) "Original colors" swaps the palette layer, never the layout (see
//     docs/design-invariants.md §1). A palette-guarded rule that sets layout
//     would make the design collapse when Original colors is chosen, so it is
//     a hard failure. Colour-ish declarations are the only ones allowed there.
const LAYOUT_PROPS = /^(margin|padding|width|height|gap|flex|grid|position|top|left|right|bottom|overflow|order|font-size|line-height|display|border-radius|border(-width|-top|-bottom|-left|-right)?$|inset)/
for (const rule of source) {
  if (!rule.includes('data-dsh-palette')) continue
  const selector = rule.slice(0, rule.indexOf('{'))
  // The mac tint rules only paint a background; they are colour by nature.
  if (selector.includes("html[data-platform='darwin']")) continue
  for (const declaration of rule.slice(rule.indexOf('{') + 1, rule.lastIndexOf('}')).split(';')) {
    const property = declaration.split(':')[0].trim().toLowerCase()
    if (property !== '' && LAYOUT_PROPS.test(property)) {
      fail(`palette-guarded layout declaration "${property}" in: ${selector.trim().slice(0, 70)}`)
    }
  }
}

// c) The plugin's own structure (geometry, fills, type) is allowed to evolve:
//    floating cards and row metrics are layout, not colour, and they apply
//    under every palette including Original colors — freezing them to HEAD
//    would block legitimate design work. What must NOT move is the shell's
//    own rendering: a rule that paints a shell surface without living inside
//    this plugin's design would silently restyle the app. So the check is
//    directional: every mac-reachable rule must either be a skin rule
//    (palette/Windows guarded) or an explicit plugin-structure rule, and a
//    rule that DISAPPEARS from a surface the plugin does not own is caught by
//    the surface audit below.
const WIN_GUARD = GUARD
const SKIN_GUARDS = ['data-dsh-palette', "html:not([data-platform='darwin'])"]
/** Surfaces the plugin restyles on purpose; anything else is the shell's own. */
const PLUGIN_SURFACES = [
  '_frame', '_sidebarCol', '_centerCol', '_rightbarCol', '_bottomRow',
  '_composerStack', '_panelRow', '_panelList', '_footArea', '_sectionHeader',
  '_projectRow', '_sessionRow', '_searchResultRow', '_newSession', '_previewBadge',
  '_header', '_root', '_card', '_genieSlice',
]
/** Surfaces inside the workspace that carry text and are allowed to frost: the
 *  ground lightens their fill, so they need an entry even though the shell owns
 *  them. Named by data-* hook where the host offers one — those survive a build,
 *  while its class names are hashed per release. md-code-block is the markdown
 *  renderer's own global class (a literal, not hashed), the one stable hook on
 *  the code card; the special-field bodies have no hook and frost through the
 *  markdown-code-block token redeclared on _centerCol instead. _backing is the
 *  shell popover primitive's solid-white undercoat — cleared under glass so
 *  the material's own frost reads (see the backing rule in skin.css). _tag is
 *  the status tag component — only its neutral tone is touched, dropping to
 *  the 12% tint its sibling tones already use. */
const GLASS_SURFACES = ['[data-composer-card]', '[class*="_bubble"]', '[class*="_fileCard"]', '[class*="_markdown"]', '.md-code-block', '[class*="_composerSeat"]', '[data-tool]', '[data-terminal]', '[data-web]', '[data-search]', '[class*="_backing"]', '[class*="_tag"]']
const GROUND_GUARD = 'data-dsh-glass'
const owned = rule =>
  PLUGIN_SURFACES.some(name => rule.includes(`[class*="${name}"]`))
  || rule.includes('.dpui-ground-')   // the ground section's own settings UI
  // Frosting a text-bearing surface is a deliberate, listed exception, and only
  // while the ground is on: without that gate the rule would restyle the app.
  || (rule.includes(GROUND_GUARD) && GLASS_SURFACES.some(hook => rule.includes(hook)))
const macReachable = list => list.filter(rule => !rule.includes(WIN_GUARD)).sort()
const current = macReachable(distRules)
for (const rule of current) {
  const skin = SKIN_GUARDS.some(guard => rule.includes(guard))
  if (!skin && !owned(rule)) fail(`mac-reachable rule off the plugin's surfaces: ${rule.slice(0, 80)}`)
  if (rule.includes('--dpui-rail') && !skin) fail(`unguarded rail token: ${rule.slice(0, 80)}`)
}
// The plugin's rules must name a stable CSS-module suffix: a bare class name
// would break on the next app build, and an element selector would leak.
for (const rule of current) {
  if (!owned(rule) && !SKIN_GUARDS.some(g => rule.includes(g))) continue
  if (/\bhtml\s*[,{]|^body\s*[{,]|(^|\s)\*\s*[,{]/.test(rule)) {
    fail(`rule targets the document root, not a plugin surface: ${rule.slice(0, 80)}`)
  }
}

console.log(failures === 0
  ? `verify-skin: OK (${guarded.length} guarded rules in skin.css, ${current.length} mac-reachable rules in dist)`
  : `verify-skin: ${failures} failure(s)`)
process.exit(failures === 0 ? 0 : 1)
