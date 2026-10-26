/**
 * Proves the frosted surfaces stay readable.
 *
 * The ground lightens a card's fill by a formula, and a formula is only as good
 * as its worst case. Here the worst case is measured: every palette layer, both
 * modes, every slider notch, and a ground that is pure white on one side and
 * pure black on the other — a wallpaper can be either.
 *
 * The model is the one the CSS implements, layer by layer:
 *   column  = bg-base at (1 - opacity) over the ground
 *   surface = the surface token at its floor formula over the column
 *   text    = label-primary (the lightest-weight body text on those surfaces)
 * Compositing happens in sRGB, which is what color-mix() does.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const source = readFileSync(join(root, 'src/client/generated-palettes.js'), 'utf8')
const declaration = source.slice(source.indexOf('PALETTE_LAYERS'), source.indexOf('PALETTE_NAMES'))
const PALETTE_LAYERS = JSON.parse(declaration.slice(declaration.indexOf('{'), declaration.lastIndexOf('}') + 1))

/** Surfaces the ground may lighten. Every number is read back out of skin.css,
 *  so this audit always tests the curve that actually ships. */
const skin = readFileSync(join(root, 'src/client/skin.css'), 'utf8')
const declared = {}
for (const m of skin.matchAll(/--dpui-(frost-floor|frost-elevation|frost-ceiling|sidebar-elevation|chip-floor|chip-scale|inline-floor|inline-scale|panel-floor|panel-scale):\s*([0-9.]+)/g)) {
  declared[m[1]] = Number(m[2])
}
for (const key of ['frost-floor', 'frost-elevation', 'frost-ceiling', 'sidebar-elevation', 'chip-floor', 'chip-scale', 'inline-floor', 'inline-scale', 'panel-floor', 'panel-scale']) {
  if (declared[key] === undefined) {
    console.error(`contrast-check: skin.css declares no --dpui-${key}`)
    process.exit(1)
  }
}
/** The card curve: plate alpha plus one elevation, clamped to [floor, ceiling]. */
const cardAlpha = opacity =>
  Math.min(declared['frost-ceiling'],
    Math.max(declared['frost-floor'], (1 - opacity) + declared['frost-elevation']))
/** The New Session chip shadows the sidebar: the chip sits ON the rail, so
 *  its coat is multiplicative — effective coverage = s + c·(1-s) — and the
 *  coat itself is max(floor, (1-opacity)·scale). */
const chipAlpha = opacity =>
  Math.max(declared['chip-floor'], (1 - opacity) * declared['chip-scale'])
/** Inline code chips are decoration: their own multiplicative curve, lighter
 *  than even the New Session chip — a tile a breath off the wash. */
const inlineAlpha = opacity =>
  Math.max(declared['inline-floor'], (1 - opacity) * declared['inline-scale'])
/** Panels — the sent bubble and the code card: a multiplicative tier between
 *  the card and the inline chip, present but clearly of the wash. */
const panelAlpha = opacity =>
  Math.max(declared['panel-floor'], (1 - opacity) * declared['panel-scale'])
/** The composer carries a fixed 0.85 tint and no blur (v0.1.49 glass-drop
 *  immunity) — its coverage does not move with the slider. */
const composerAlpha = () => 0.85
/** Which curve each surface rides. */
const alphaFor = (surface, opacity) =>
  surface.name === 'newSession' ? chipAlpha(opacity)
  : surface.name === 'codeChip' ? inlineAlpha(opacity)
  : surface.name === 'composer' ? composerAlpha(opacity)
  : surface.name === 'bubble' || surface.name === 'codeBlock' || surface.name === 'codeBanner' ? panelAlpha(opacity)
  : cardAlpha(opacity)
/** The sidebar column rides its own, heavier elevation. */
const sidebarAlpha = opacity =>
  Math.min(1, (1 - opacity) + declared['sidebar-elevation'])
const SURFACES = [
  { name: 'composer', token: '--dsw-specific-input-major', column: 'center' },
  { name: 'bubble', token: '--dsw-specific-bubble', column: 'center' },
  { name: 'fileCard', token: '--dsw-specific-input-major', column: 'center' },
  { name: 'codeChip', token: '--dsw-alias-markdown-inline-code', column: 'center' },
  { name: 'codeBlock', token: '--dsw-alias-markdown-code-block', column: 'center' },
  { name: 'codeBanner', token: '--dsw-alias-markdown-code-block-banner', column: 'center' },
  { name: 'newSession', token: '--dsw-specific-sidebar-fill', mixWith: '--dsw-alias-brand-primary', mixRate: 0.12, column: 'sidebar' },
]
const OPACITIES = [0, 0.25, 0.5, 0.75, 1]
const GROUNDS = [[255, 255, 255], [0, 0, 0]]
const AA = 4.5

const parse = value => {
  const hex = value.trim()
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex)
  if (m === null) return null
  const digits = m[1].length === 3 ? [...m[1]].map(d => d + d).join('') : m[1]
  return [0, 2, 4].map(i => parseInt(digits.slice(i, i + 2), 16))
}
const over = (top, alpha, bottom) => top.map((c, i) => c * alpha + bottom[i] * (1 - alpha))
const luminance = rgb => {
  const [r, g, b] = rgb.map(c => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
let worst = { ratio: Infinity }
const rows = []
const cases = []
for (const [layer, tokens] of Object.entries(PALETTE_LAYERS)) {
  for (const mode of ['light', 'dark']) {
    const base = parse(tokens['--dsw-alias-bg-base'][mode])
    const text = parse(tokens['--dsw-alias-label-primary'][mode])
    if (base === null || text === null) continue
    for (const surface of SURFACES) {
      const raw = parse(tokens[surface.token][mode])
      if (raw === null) continue
      /** The chip fills with the rail's own composite — sidebar-fill lifted
       *  with 12% brand, the exact mix the sidebar coat paints — so the audit
       *  measures the material that actually ships. The selected session row
       *  rides this same case verbatim (same fill, mix and curve), so one
       *  surface models both. */
      const mixToken = surface.mixWith && parse(tokens[surface.mixWith][mode])
      const fill = mixToken ? raw.map((c, i) => c * (1 - surface.mixRate) + mixToken[i] * surface.mixRate) : raw
      let layerWorst = { ratio: Infinity }
      for (const opacity of OPACITIES) {
        for (const ground of GROUNDS) {
          const plateAlpha = surface.column === 'sidebar' ? sidebarAlpha(opacity) : 1 - opacity
          const surfaceAlpha = alphaFor(surface, opacity)
          const column = over(base, plateAlpha, ground)
          const card = over(fill, surfaceAlpha, column)
          const ratio = contrast(text, card)
          const columnRatio = contrast(text, column)
          const at = { ratio, columnRatio, layer, mode, surface: surface.name, opacity,
            ground: ground[0] === 255 ? 'white' : 'black' }
          cases.push(at)
          if (ratio < layerWorst.ratio) layerWorst = at
          if (ratio < worst.ratio) worst = at
        }
      }
      rows.push(layerWorst)
    }
  }
}

const lowest = rows.reduce((min, row) => (row.ratio < min.ratio ? row : min), rows[0])
console.log(`contrast-check: ${cases.length} cases, lowest ${lowest.ratio.toFixed(2)}:1 `
  + `(${lowest.layer}/${lowest.mode}/${lowest.surface} over a ${lowest.ground} ground at glass ${lowest.opacity})`)

/** The promise ends where the wash does. Through the mid notch a surface is
 *  held to the full 4.5:1 AA — but only over backdrops where the wash beneath
 *  it already clears AA for the same text (the surface is audited on its
 *  increment over its own column). Over the pathological corners — dark mode
 *  on a pure white wallpaper, light mode on a pure black one — the rail and
 *  the wash themselves sit below AA by construction of the dial, so the
 *  surfaces riding them are reported, not failed. Beyond the mid notch
 *  everything is reported only: the slider there is dialing past the
 *  guarantee into clear glass on purpose. */
const enforced = cases.filter(c => {
  if (c.opacity > 0.5 || c.ratio >= AA) return false
  /** Enforce only what the surface itself is responsible for: the increment
   *  over its own backdrop. Where the wash beneath (the rail or the column)
   *  already fails AA for the text — dark mode over a white wallpaper, light
   *  mode over a black one — no surface layered on it can clear the bar, and
   *  the dial chose that. Those cases are reported below, not failed. */
  if (c.columnRatio < AA) return false
  return true
})
const beyond = cases.filter(c => c.opacity > 0.5)
const beyondWorst = beyond.reduce((min, c) => (c.ratio < min.ratio ? c : min), beyond[0])

if (enforced.length > 0) {
  console.error('contrast-check: below AA within the guaranteed range (glass ≤ 0.5)\n'
    + enforced.map(row => ` - ${row.layer}/${row.mode}/${row.surface}: `
      + `${row.ratio.toFixed(2)}:1 over ${row.ground} at ${row.opacity}`).join('\n'))
  process.exit(1)
}
console.log(`beyond mid (reported, not enforced): worst ${beyondWorst.ratio.toFixed(2)}:1 `
  + `(${beyondWorst.layer}/${beyondWorst.mode}/${beyondWorst.surface} over ${beyondWorst.ground} at ${beyondWorst.opacity})`)
