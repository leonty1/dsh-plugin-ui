/** Qoder palette skin: token layer, structure CSS, and the Appearance preview row that picks one. */
import { useEffect, useState } from 'react'
import clsx from './clsx.js'
import { FONT_FACE_CSS, PALETTE_LAYERS, PALETTE_NAMES } from './generated-palettes.js'
import skinCss from './skin.css'
import css from './palette.module.css'

/** Storage key carrying the chosen palette; `none` disables the skin. */
const STORAGE_KEY = 'dsh-plugin-ui.palette'

/** Installed on first run so the plugin delivers the Qoder look without setup. */
const DEFAULT_PALETTE = 'forest'

const SKIN_STYLE_ID = 'dsh-plugin-ui-structure'
const FONT_STYLE_ID = 'dsh-plugin-ui-fonts'

/** @returns the stored palette, or the default when none was stored. */
function storedPalette() {
  const value = localStorage.getItem(STORAGE_KEY)
  return value === 'none' || PALETTE_NAMES.includes(value) ? value : DEFAULT_PALETTE
}

/** Copy for one palette choice. @param t - plugin dictionary. @returns the row label. */
export function paletteLabel(id, t) {
  return id === 'none' ? t('palette.none') : t(`palette.${id}`)
}

/** @param on - whether the structure overrides are shown. */
function showSkinCss(on) {
  const existing = document.getElementById(SKIN_STYLE_ID)
  if (!on) {
    existing?.remove()
    return
  }
  if (existing !== null) return
  const style = document.createElement('style')
  style.id = SKIN_STYLE_ID
  style.textContent = skinCss
  document.head.append(style)
}

/** Inline Inter subsets because plugin files are not served over the web route. */
function installFonts() {
  if (document.getElementById(FONT_STYLE_ID) !== null) return
  const style = document.createElement('style')
  style.id = FONT_STYLE_ID
  style.textContent = FONT_FACE_CSS
  document.head.append(style)
}

/**
 * Owns one palette layer over the app's own light/dark preference. The layer
 * carries color tokens and geometry, so turning the skin off restores both.
 * @param ctx - client context carrying the theme service.
 * @returns the current choice, the write path, and the install/teardown pair.
 */
export function createPaletteController(ctx) {
  let current = storedPalette()
  let layer
  const listeners = new Set()
  const notify = () => { for (const listener of listeners) listener() }
  const apply = id => {
    current = id
    // "Original colors" only drops the color layer; the structure and fonts
    // stay, so the plugin layout survives every palette choice. The marker lets
    // skin.css retint surfaces the layer cannot reach, such as darwin's sidebar
    // atmosphere, without touching Original colors.
    document.body.toggleAttribute('data-dsh-palette', id !== 'none')
    showSkinCss(true)
    installFonts()
    layer?.()
    layer = id === 'none' ? undefined : ctx.theme.overrideTokens('dsh-plugin-ui', PALETTE_LAYERS[id])
  }
  return {
    get: () => current,
    choose(id) {
      if (id !== 'none' && !PALETTE_NAMES.includes(id)) return
      localStorage.setItem(STORAGE_KEY, id)
      apply(id)
      notify()
    },
    /** @param listener - called after every {@link choose}. @returns the unsubscribe. */
    subscribe(listener) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    install() {
      apply(current)
      return () => {
        layer?.()
        layer = undefined
        document.body.removeAttribute('data-dsh-palette')
        showSkinCss(false)
      }
    },
  }
}

/** Neutral preview for “Original colors”, whose colors come from the app rather than a layer. */
const NONE_COLORS = {
  light: { bg: '#fff', side: '#e5e5e5', border: '#e5e5e5', accent: '#4d6bfe', ink: '#141414' },
  dark: { bg: '#171717', side: '#333', border: '#333', accent: '#6b8aff', ink: '#e5e5e5' },
}

/** @param id - palette id or `none`. @param scheme - the app's active color scheme. @returns preview colors. */
function paletteColors(id, scheme) {
  if (id === 'none') return NONE_COLORS[scheme]
  const layer = PALETTE_LAYERS[id]
  return {
    bg: layer['--dsw-alias-bg-base']?.[scheme],
    side: layer['--dsw-alias-border-l2']?.[scheme],
    border: layer['--dsw-alias-border-l2']?.[scheme],
    accent: layer['--dsw-alias-brand-primary']?.[scheme],
    ink: layer['--dsw-alias-label-primary']?.[scheme],
  }
}

/** Follow the resolved light/dark scheme so previews match the current appearance. */
function useColorScheme(ctx) {
  const read = () => ctx.theme.getTheme().active?.colorScheme ?? 'light'
  const [scheme, setScheme] = useState(read)
  useEffect(() => {
    const update = () => { setScheme(read()) }
    update()
    const off = ctx.on('theme/change', update)
    return () => { off?.() }
  }, [ctx])
  return scheme
}

/**
 * One Appearance row: title and hint over a preview card per palette. Each
 * card samples the palette's own background, sidebar, accent, and ink under
 * the current light/dark scheme, and clicking it applies that palette.
 * @param props - plugin dictionary, palette controller, and client context.
 * @returns the palette preview row.
 */
export function PaletteSettings({ t, controller, ctx }) {
  const [pair, setPair] = useState(() => controller.get())
  const scheme = useColorScheme(ctx)
  useEffect(() => {
    const update = () => { setPair(controller.get()) }
    update()
    return controller.subscribe(update)
  }, [controller])
  const choose = id => { controller.choose(id) }
  return <div className={css.section}>
    <div className={css.head}>
      <div className={css.title}>{t('palette.title')}</div>
      <div className={css.desc}>{t('palette.hint')}</div>
    </div>
    <div className={css.grid} role="radiogroup" aria-label={t('palette.title')}>
      {['none', ...PALETTE_NAMES].map(id => {
        const colors = paletteColors(id, scheme)
        const active = pair === id
        return <button key={id} type="button" role="radio" aria-checked={active}
          className={clsx(css.card, active && css.cardActive)}
          onClick={() => { choose(id) }}>
          <span className={css.preview} style={{ background: colors.bg, borderColor: colors.border }}>
            <span className={css.side} style={{ background: colors.side, borderColor: colors.border }}>
              <span className={css.line} style={{ background: colors.ink }} />
              <span className={css.lineShort} style={{ background: colors.ink }} />
            </span>
            <span className={css.main}>
              <span className={css.accent} style={{ background: colors.accent }} />
              <span className={css.line} style={{ background: colors.ink }} />
              <span className={css.lineShort} style={{ background: colors.ink }} />
            </span>
          </span>
          <span className={css.label}>{paletteLabel(id, t)}</span>
        </button>
      })}
    </div>
  </div>
}
