/** Produce dist artifacts from source and the Qoder design baseline; dist is committed. */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'
import { WALLPAPER_PRESETS } from './wallpapers.mjs'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const source = JSON.parse(readFileSync(join(root, 'design', 'dsh-theme-definitions.json'), 'utf8'))
const palette = JSON.parse(readFileSync(join(root, 'design', 'qoder-palette.json'), 'utf8')).palette

/**
 * Aliases DSH uses for a different visual role than their name suggests, bound
 * to the Qoder role that matches the control. A pair binds one role per scheme
 * where Qoder's light and dark ramps sit at different steps.
 */
const ROLE_BINDINGS = {
  '--dsw-alias-button-info-fill': 'primary',
  '--dsw-alias-button-info-hover': 'primary-hover',
  '--dsw-alias-bg-layer-1': 'bg-base',
  '--dsw-alias-bg-layer-2': 'bg-elevated',
  '--dsw-alias-bg-layer-3': 'bg-elevated',
  '--dsw-alias-markdown-code-block': 'bg-elevated',
  '--dsw-alias-markdown-code-block-banner': { light: 'fill-tertiary', dark: 'fill-secondary' },
  '--dsw-alias-markdown-inline-code': 'fill-tertiary',
  '--dsw-alias-markdown-tag': 'fill-tertiary',
  '--dsw-alias-bg-module-platform': { light: 'fill-tertiary', dark: 'fill' },
  '--dsw-alias-interactive-bg-hover-solid': { light: 'fill-tertiary', dark: 'fill-secondary' },
  '--dsw-alias-button-floating-hover': { light: 'fill-tertiary', dark: 'fill-secondary' },
  '--dsw-alias-button-ghost-active-fill': { light: 'fill-secondary', dark: 'fill' },
  '--dsw-alias-markdown-citation': { light: 'border-tertiary', dark: 'border' },
  '--dsw-alias-label-document-preview': 'text-secondary',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': 'primary',
  '--dsw-specific-sidebar-fill': 'bg-base',
  '--dsw-specific-bubble': 'primary-bg',
  '--dsw-specific-input-major': { light: 'bg-base', dark: 'bg-elevated' },
  '--dsw-specific-selector': { light: 'fill-tertiary', dark: 'fill' },
  '--dsw-specific-sidebar-nav-item-active': { light: 'fill-secondary', dark: 'fill' },
  '--dsw-specific-sidebar-nav-item-hover': { light: 'fill-tertiary', dark: 'fill-secondary' },
}

/**
 * Tokens whose official value is a scheme-invariant alpha or a fixed contrast
 * ink, and whose Qoder counterpart would break them: DSH paints skeletons with
 * a 4-8% wash, toast labels stay white on an always-dark toast, and
 * markdown-placeholder is a surface, not ink. Dropping them lets every palette
 * inherit the official value.
 */
const INHERITED = [
  '--dsw-alias-bg-multi-select',
  '--dsw-alias-bg-skeleton',
  '--dsw-alias-toast-label',
  '--dsw-alias-markdown-placeholder',
]

/** Qoder's four named light/dark pairs. */
const PALETTES = [
  ['forest', 'forest-light', 'forest-dark'],
  ['mint', 'mint-light', 'mint-dark'],
  ['bee', 'bee-light', 'bee-dark'],
  ['parchment', 'light-parchment', 'parchment-dark'],
]

/** Qoder's geometry and type, scheme-invariant. */
const STRUCTURE = {
  '--dsw-radius-xs': '2px',
  '--dsw-radius-sm': '4px',
  '--dsw-radius-md': '6px',
  '--dsw-radius-lg': '8px',
  '--dsw-radius-xl': '12px',
  '--dsw-radius-panel': '16px',
  '--dsh-font-family-text': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif',
  '--dsh-font-family-code': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
}

/** @font-face rules with inlined subsets: plugin files are not served over the web route. */
const fontFace = ['400', '500', '600'].map(weight => `@font-face{font-family:Inter;font-style:normal;font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${readFileSync(join(root, 'assets', 'fonts', `inter-latin-${weight}.woff2`)).toString('base64')})}`).join('')

/** Wallpapers for the sidebar/workspace ground: photos inlined as data URLs
 * (plugin files are not served), gradients carried as plain CSS. */
const WALLPAPER_DIR = join(root, 'assets', 'wallpapers')
const wallpapers = WALLPAPER_PRESETS.map(preset => preset.file === undefined
  ? { id: preset.id, label: preset.label, css: preset.css }
  : {
      id: preset.id,
      label: preset.label,
      dataUrl: `data:image/jpeg;base64,${readFileSync(join(WALLPAPER_DIR, preset.file)).toString('base64')}`,
    })

const layers = PALETTES.map(([pair, lightId, darkId]) => {
  const light = source[`qoder-${lightId}`]
  const dark = source[`qoder-${darkId}`]
  if (light === undefined || dark === undefined) throw new Error(`design/dsh-theme-definitions.json lacks the ${pair} pair`)
  const names = [...new Set([...Object.keys(light.tokens), ...Object.keys(dark.tokens)])]
  const tokens = Object.fromEntries(names.map(name => [name, {
    light: light.tokens[name]?.light ?? dark.tokens[name]?.light,
    dark: dark.tokens[name]?.dark ?? light.tokens[name]?.dark,
  }]))
  for (const name of INHERITED) delete tokens[name]
  for (const [alias, roles] of Object.entries(ROLE_BINDINGS)) {
    const [lightRole, darkRole] = typeof roles === 'string' ? [roles, roles] : [roles.light, roles.dark]
    tokens[alias] = { light: palette[lightId][lightRole], dark: palette[darkId][darkRole] }
  }
  // Menu surfaces keep the official 94% macOS alpha over the palette's raised
  // pane; blur-backed menus keep the official translucency so page content
  // still shows through; selection mirrors the official 40% blue with the skin
  // accent, and the option badge uses a light wash of the same accent.
  tokens['--dsw-specific-menu'] = {
    light: `color-mix(in srgb, ${palette[lightId]['bg-elevated']} 94%, transparent)`,
    dark: `color-mix(in srgb, ${palette[darkId]['bg-elevated']} 94%, transparent)`,
  }
  tokens['--dsw-menu-surface-fill'] = {
    light: `color-mix(in srgb, ${palette[lightId]['bg-elevated']} 58%, transparent)`,
    dark: `color-mix(in srgb, ${palette[darkId]['bg-elevated']} 45%, transparent)`,
  }
  tokens['--dsw-alias-bg-document-selection'] = {
    light: `color-mix(in srgb, ${palette[lightId].primary} 40%, transparent)`,
    dark: `color-mix(in srgb, ${palette[darkId].primary} 40%, transparent)`,
  }
  tokens['--dsw-specific-sidebar-nav-item-active-accent'] = {
    light: `color-mix(in srgb, ${palette[lightId].primary} 14%, transparent)`,
    dark: `color-mix(in srgb, ${palette[darkId].primary} 14%, transparent)`,
  }
  // Qoder's palette carries one flat #fff base for every light skin, so the
  // role binding left the sidebar white while the document took the palette
  // tint. The sidebar is document surface; dark keeps its recessed fill.
  tokens['--dsw-specific-sidebar-fill'].light = tokens['--dsw-alias-bg-base'].light
  for (const [name, value] of Object.entries(STRUCTURE)) tokens[name] = { light: value, dark: value }
  return [pair, tokens]
})

writeFileSync(join(root, 'src', 'client', 'generated-palettes.js'),
  `/** Generated by scripts/build.mjs from design/*.json; do not edit. */\nexport const PALETTE_LAYERS = ${JSON.stringify(Object.fromEntries(layers))}\nexport const PALETTE_NAMES = ${JSON.stringify(PALETTES.map(([pair]) => pair))}\nexport const FONT_FACE_CSS = ${JSON.stringify(fontFace)}\nexport const WALLPAPERS = ${JSON.stringify(wallpapers)}\n`)

/**
 * Scoped CSS modules: prefix every class selector with a per-file namespace and
 * inject the stylesheet once. The component imports the default Proxy, so
 * `css.option` resolves to the same generated class the selector carries.
 */
const cssModules = {
  name: 'plugin-ui-css-modules',
  setup(build) {
    build.onResolve({ filter: /\.module\.css$/ }, args => ({
      path: join(args.resolveDir, args.path),
      namespace: 'plugin-ui-css-module',
    }))
    build.onLoad({ filter: /.*/, namespace: 'plugin-ui-css-module' }, args => {
      const name = basename(args.path).replace(/\.module\.css$/, '').replace(/[^a-zA-Z0-9_-]/g, '-')
      const prefix = `dpui-${name}-`
      const scoped = readFileSync(args.path, 'utf8').replace(/\.([a-zA-Z_][\w-]*)/g, `.${prefix}$1`)
      const styleId = `dsh-plugin-ui-${name}`
      return {
        contents: `
const styleId = ${JSON.stringify(styleId)}
if (typeof document !== 'undefined' && document.getElementById(styleId) === null) {
  const style = document.createElement('style')
  style.id = styleId
  style.textContent = ${JSON.stringify(scoped)}
  document.head.append(style)
}
export default new Proxy({}, { get: (_target, key) => typeof key === 'string' ? ${JSON.stringify(prefix)} + key : undefined })
`,
        loader: 'js',
      }
    })
  },
}

const result = await build({
  entryPoints: [join(root, 'src', 'client', 'entry.jsx')],
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'browser',
  target: 'es2022',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  loader: { '.css': 'text' },
  external: [
    'react',
    'react/jsx-runtime',
    'react-dom',
    'react-dom/client',
    '@deepseek-ai/cordis',
    '@deepseek-ai/dsh-client-store',
    '@deepseek-ai/dsh-client-ui-slots',
    '@deepseek-ai/dsh-client-ui-primitives',
    '@deepseek-ai/dsh-client-ui-dockkit',
  ],
  plugins: [cssModules],
  logLevel: 'warning',
})

const bundle = result.outputFiles[0].text
mkdirSync(join(root, 'dist'), { recursive: true })
writeFileSync(join(root, 'dist', 'client.js'), `window.__ModuleLoader__.load({
  id: 'dsh-plugin-ui',
  factory(require) {
    const module = { exports: {} }
    const exports = module.exports
    ;(function (module, exports, require) {
${bundle}
    })(module, exports, require)
    return module.exports
  },
})
`)
copyFileSync(join(root, 'src', 'index.js'), join(root, 'dist', 'index.js'))

const bindings = layers.reduce((total, [, tokens]) => total + Object.keys(tokens).length, 0)
console.log(`dsh-plugin-ui: ${layers.length} palette layers, ${bindings} token bindings (both modes), ${bundle.length} bytes bundled -> dist/client.js`)
