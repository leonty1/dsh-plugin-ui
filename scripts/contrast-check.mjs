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
for (const m of skin.matchAll(/--dpui-(frost-floor|frost-elevation|frost-ceiling|sidebar-elevation):\s*([0-9.]+)/g)) {
  declared[m[1]] = Number(m[2])
}
for (const key of ['frost-floor', 'frost-elevation', 'frost-ceiling', 'sidebar-elevation']) {
  if (declared[key] === undefined) {
    console.error(`contrast-check: skin.css declares no --dpui-${key}`)
    process.exit(1)
  }
}
/** The card curve: plate alpha plus one elevation, clamped to [floor, ceiling]. */
const cardAlpha = opacity =>
  Math.min(declared['frost-ceiling'],
    Math.max(declared['frost-floor'], (1 - opacity) + declared['frost-elevation']))
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
  { name: 'newSession', token: '--dsw-alias-bg-layer-1', column: 'sidebar' },
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
for (const [layer, tokens] of Object.entries(PALETTE_LAYERS)) {
  for (const mode of ['light', 'dark']) {
    const base = parse(tokens['--dsw-alias-bg-base'][mode])
    const text = parse(tokens['--dsw-alias-label-primary'][mode])
    if (base === null || text === null) continue
    for (const surface of SURFACES) {
      const fill = parse(tokens[surface.token][mode])
      if (fill === null) continue
      let layerWorst = { ratio: Infinity }
      for (const opacity of OPACITIES) {
        for (const ground of GROUNDS) {
          const plateAlpha = surface.column === 'sidebar' ? sidebarAlpha(opacity) : 1 - opacity
          const column = over(base, plateAlpha, ground)
          const card = over(fill, cardAlpha(opacity), column)
          const ratio = contrast(text, card)
          const at = { ratio, layer, mode, surface: surface.name, opacity,
            ground: ground[0] === 255 ? 'white' : 'black' }
          if (ratio < layerWorst.ratio) layerWorst = at
          if (ratio < worst.ratio) worst = at
        }
      }
      rows.push(layerWorst)
    }
  }
}

const failing = rows.filter(row => row.ratio < AA)
const lowest = rows.reduce((min, row) => (row.ratio < min.ratio ? row : min), rows[0])
console.log(`contrast-check: ${rows.length} cases, lowest ${lowest.ratio.toFixed(2)}:1 `
  + `(${lowest.layer}/${lowest.mode}/${lowest.surface} over a ${lowest.ground} ground at glass ${lowest.opacity})`)

if (failing.length > 0) {
  console.error('contrast-check: below AA\n'
    + failing.map(row => ` - ${row.layer}/${row.mode}/${row.surface}: `
      + `${row.ratio.toFixed(2)}:1 over ${row.ground} at ${row.opacity}`).join('\n'))
  process.exit(1)
}
