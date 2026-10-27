/**
 * Exercises the ground controller's rotation clock.
 *
 * Time-based behaviour is the one part of this plugin that cannot be checked by
 * looking at the window: a wrong interval, a missed catch-up, or a wrap that
 * skips a preset all look identical to "it works" until the day it doesn't.
 * The controller is bundled in isolation (only the CSS module is stubbed) and
 * driven with a controllable clock and a stand-in localStorage.
 */
import { build } from 'esbuild'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))

const pnpm = '/Users/tongyi/dsh-lty/node_modules/.pnpm'
const react = join(pnpm, 'react@18.3.1/node_modules/react')

const stubCss = {
  name: 'stub-css',
  setup(build) {
    build.onResolve({ filter: /\.css$/ }, args => ({ path: args.path, namespace: 'css-stub' }))
    build.onLoad({ filter: /.*/, namespace: 'css-stub' }, () => ({
      contents: 'export default new Proxy({}, { get: (_t, key) => "c-" + String(key) })',
      loader: 'js',
    }))
  },
}

const result = await build({
  entryPoints: [join(root, 'src/client/glass.jsx')],
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'node',
  target: 'node20',
  jsx: 'automatic',
  logLevel: 'silent',
  plugins: [stubCss],
  alias: { react, 'react/jsx-runtime': join(react, 'jsx-runtime.js') },
})

/* ---- stand-ins for the browser environment ---- */
const store = new Map()
globalThis.localStorage = {
  getItem: key => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => { store.set(key, String(value)) },
  removeItem: key => { store.delete(key) },
}
const touched = []
globalThis.document = {
  body: {
    setAttribute: name => { touched.push(['set', name]) },
    removeAttribute: name => { touched.push(['remove', name]) },
    style: { setProperty: (name, value) => { touched.push(['var', name, value]) } },
  },
}

const nodeRequire = createRequire(import.meta.url)
const module = { exports: {} }
new Function('module', 'exports', 'require', result.outputFiles[0].text)(module, module.exports, nodeRequire)
const { createGroundController, ROTATE_CHOICES } = module.exports

// Read the generated module as text: it is ESM inside a CJS package, which Node
// refuses to classify on a bare import from this script.
const catalog = [...readFileSync(join(root, 'src/client/generated-palettes.js'), 'utf8')
  .matchAll(/\{"id":"([a-z0-9-]+)","label":"[^"]*","group":"([a-z]+)"/g)]
  .map(m => ({ id: m[1], group: m[2] }))
const presets = catalog.map(preset => preset.id)
// Rotation moves through pictures and gradients; the flat colours are a
// deliberate opt-out, so they never enter the cycle.
const rotatable = catalog.filter(preset => preset.group !== 'plain').map(preset => preset.id)
const REALTIME = Date.now
let clock = 1_700_000_000_000
Date.now = () => clock

const failures = []
const expect = (label, actual, wanted) => {
  if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
    failures.push(`${label}: got ${JSON.stringify(actual)}, wanted ${JSON.stringify(wanted)}`)
  }
}
/** Fresh controller over a given stored state. */
const boot = (seed) => {
  store.clear()
  for (const [key, value] of Object.entries(seed)) store.set(key, String(value))
  return createGroundController()
}
const MIN = 60_000

// 1. a fresh install has rotation off and does not move on its own
{
  const ground = boot({})
  const stop = ground.install()
  expect('default rotation', ground.get().every, 0)
  clock += 90 * MIN
  expect('no rotation while off', ground.get().wallpaper, 'none')
  stop()
}

// 2. turning rotation on starts the clock from now, not from the epoch
{
  const ground = boot({})
  const stop = ground.install()
  ground.setEvery(30)
  expect('interval stored', ground.get().every, 30)
  clock += 29 * MIN
  expect('not yet due', ground.get().wallpaper, 'none')
  stop()
}

// 3. a due rotation steps to the next preset in the same order the picker shows
{
  const ground = boot({})
  ground.setEvery(360)
  ground.setWallpaper(rotatable[3])
  const stop = ground.install()
  clock += 361 * MIN
  stop()
  // install() already caught up on a later boot only; drive it through a new boot
  const next = boot({ 'dsh-plugin-ui.wallpaper.every': 360, 'dsh-plugin-ui.wallpaper': rotatable[3],
    'dsh-plugin-ui.wallpaper.rotatedAt': clock - 361 * MIN })
  next.install()()
  expect('advances to next preset', next.get().wallpaper, rotatable[4])
}

// 4. the last preset wraps to the first
{
  const last = rotatable[rotatable.length - 1]
  const ground = boot({ 'dsh-plugin-ui.wallpaper.every': 1440, 'dsh-plugin-ui.wallpaper': last,
    'dsh-plugin-ui.wallpaper.rotatedAt': clock - 1441 * MIN })
  ground.install()()
  expect('wraps to first preset', ground.get().wallpaper, rotatable[0])
}

// 5. time the window spent closed still counts
{
  const ground = boot({ 'dsh-plugin-ui.wallpaper.every': 1440, 'dsh-plugin-ui.wallpaper': rotatable[0],
    'dsh-plugin-ui.wallpaper.rotatedAt': clock - 3 * 1440 * MIN })
  ground.install()()
  expect('catches up after downtime', ground.get().wallpaper, rotatable[1])
}

// 6. "none" is an opt-out, not a preset to be cycled past
{
  const ground = boot({ 'dsh-plugin-ui.wallpaper.every': 60, 'dsh-plugin-ui.wallpaper': 'none',
    'dsh-plugin-ui.wallpaper.rotatedAt': clock - 120 * MIN })
  ground.install()()
  expect('none stays put', ground.get().wallpaper, 'none')
}

// 7. picking a wallpaper by hand restarts the interval
{
  const ground = boot({ 'dsh-plugin-ui.wallpaper.every': 60, 'dsh-plugin-ui.wallpaper': presets[2],
    'dsh-plugin-ui.wallpaper.rotatedAt': clock - 59 * MIN })
  ground.setWallpaper(presets[5])
  expect('manual pick resets the clock', ground.get().rotatedAt, clock)
  expect('manual pick applied', ground.get().wallpaper, presets[5])
}

// 8. every interval the picker offers is a positive number of minutes
{
  const bad = ROTATE_CHOICES.filter(([minutes, key]) => typeof key !== 'string' || !(minutes >= 0))
  expect('interval table well formed', bad, [])
}

Date.now = REALTIME
console.log(failures.length === 0
  ? `rotate-smoke: OK (${presets.length} presets, ${rotatable.length} in the rotation, ${ROTATE_CHOICES.length} intervals)`
  : `rotate-smoke: FAIL\n${failures.map(f => ' - ' + f).join('\n')}`)
process.exit(failures.length === 0 ? 0 : 1)
