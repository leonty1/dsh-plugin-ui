/** Qoder palette skin: token layer, structure CSS, and the General-settings row that picks one. */
import { useState } from 'react'
import { IconChevronDownOutlineRegular, Menu } from '@deepseek-ai/dsh-client-ui-primitives'
import { FONT_FACE_CSS, PALETTE_LAYERS, PALETTE_NAMES } from './generated-palettes.js'
import skinCss from './skin.css'
import css from './quick-actions-settings.module.css'

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
  const apply = id => {
    current = id
    showSkinCss(id !== 'none')
    if (id === 'none') {
      layer?.()
      layer = undefined
      return
    }
    installFonts()
    layer?.()
    layer = ctx.theme.overrideTokens('dsh-plugin-ui', PALETTE_LAYERS[id])
  }
  return {
    get: () => current,
    choose(id) {
      if (id !== 'none' && !PALETTE_NAMES.includes(id)) return
      localStorage.setItem(STORAGE_KEY, id)
      apply(id)
    },
    install() {
      apply(current)
      return () => {
        layer?.()
        layer = undefined
        showSkinCss(false)
      }
    },
  }
}

/**
 * One General-settings row: title and hint on the left, a pill naming the
 * current palette on the right.
 * @param props - plugin dictionary and the palette controller.
 * @returns the preference row.
 */
export function PaletteSettings({ t, controller }) {
  const [pair, setPair] = useState(() => controller.get())
  const [open, setOpen] = useState(false)
  const choose = id => {
    controller.choose(id)
    setPair(id)
    setOpen(false)
  }
  const anchor = <button type="button" className={css.selector}
    aria-haspopup="menu" aria-expanded={open}
    onClick={() => { setOpen(value => !value) }}>
    {paletteLabel(pair, t)}
    <IconChevronDownOutlineRegular className={css.chevron} />
  </button>
  return <div className={css.row}>
    <div className={css.rowText}>
      <div className={css.title}>{t('palette.title')}</div>
      <div className={css.desc}>{t('palette.hint')}</div>
    </div>
    <Menu open={open} onClose={() => { setOpen(false) }} align="end" portal
      selectedId={pair}
      items={['none', ...PALETTE_NAMES].map(id => ({ id, label: paletteLabel(id, t) }))}
      onSelect={choose} anchor={anchor} />
  </div>
}
