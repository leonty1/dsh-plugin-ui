/** Ground treatment: frosted blur on the sidebar and workspace columns, over
 * an optional wallpaper. Settings live in the Skin palette section of
 * General settings; values persist in localStorage and publish as CSS
 * variables on document.body. Layout is untouched — this is surface only. */
import { useEffect, useState } from 'react'
import clsx from './clsx.js'
import css from './palette.module.css'
import { WALLPAPERS } from './generated-palettes.js'

const GLASS_KEY = 'dsh-plugin-ui.glass'
const WALLPAPER_KEY = 'dsh-plugin-ui.wallpaper'
const CUSTOM_KEY = 'dsh-plugin-ui.wallpaper.custom'

/** @returns the persisted ground settings, with defaults for anything absent. */
function stored() {
  const glass = Number(localStorage.getItem(GLASS_KEY) ?? '0.5')
  const wallpaper = localStorage.getItem(WALLPAPER_KEY) ?? 'none'
  const custom = localStorage.getItem(CUSTOM_KEY) ?? ''
  return {
    glass: Number.isFinite(glass) ? Math.min(Math.max(glass, 0), 1) : 0.5,
    wallpaper,
    custom,
  }
}

/**
 * @returns the CSS background-image value for the active wallpaper, or none.
 * Photo presets carry a data URL; gradient presets carry the image value
 * itself, so `url()` only wraps the former.
 */
function wallpaperUrl(state) {
  if (state.wallpaper === 'custom' && state.custom !== '') return `url(${state.custom})`
  const preset = WALLPAPERS.find(w => w.id === state.wallpaper)
  if (preset === undefined) return 'none'
  return preset.css === undefined ? `url(${preset.dataUrl})` : preset.css
}

/** Publish the ground as body-scoped variables; skin.css consumes them. */
function apply(state) {
  const body = document.body
  // Frosted glass needs a surface behind it: wallpaper first, else the plain
  // glass tint over the default ground.
  if (state.glass > 0 || state.wallpaper !== 'none') {
    body.setAttribute('data-dsh-glass', '')
    body.style.setProperty('--dpui-glass-opacity', String(state.glass))
    body.style.setProperty('--dpui-ground-image', wallpaperUrl(state))
  } else {
    body.removeAttribute('data-dsh-glass')
  }
}

/**
 * Owns the ground settings: get/choose/persist, plus the install pair that
 * applies and reverts the body attributes. Reuses the palette controller's
 * listener set shape so the settings row can re-render on change.
 * @returns the ground controller.
 */
export function createGroundController() {
  let current = stored()
  const listeners = new Set()
  const notify = () => { for (const listener of listeners) listener() }
  const write = next => {
    current = next
    localStorage.setItem(GLASS_KEY, String(next.glass))
    localStorage.setItem(WALLPAPER_KEY, next.wallpaper)
    if (next.custom === '') localStorage.removeItem(CUSTOM_KEY)
    else localStorage.setItem(CUSTOM_KEY, next.custom)
    apply(next)
    notify()
  }
  return {
    get: () => current,
    setGlass(opacity) { write({ ...current, glass: opacity }) },
    setWallpaper(id) { write({ ...current, wallpaper: id }) },
    setCustom(dataUrl) { write({ ...current, wallpaper: dataUrl === '' ? 'none' : 'custom', custom: dataUrl }) },
    subscribe(listener) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    install() {
      apply(current)
      return () => { document.body.removeAttribute('data-dsh-glass') }
    },
  }
}

/**
 * The Skin palette section's ground rows: a frosted-glass opacity slider and
 * the wallpaper picker (built-ins plus a custom file input). Both write
 * through the controller and re-render on its events.
 * @param props - ground controller, dictionary, and client context.
 * @returns the ground settings rows.
 */
export function GroundSettings({ controller, ctx, t }) {
  const [state, setState] = useState(() => controller.get())
  useEffect(() => {
    const update = () => { setState(controller.get()) }
    update()
    return controller.subscribe(update)
  }, [controller])
  const pickCustom = (event) => {
    const file = event.target.files?.[0]
    if (file === undefined) return
    const reader = new FileReader()
    reader.onload = () => { controller.setCustom(String(reader.result)) }
    reader.readAsDataURL(file)
    event.target.value = ''
  }
  const presets = [{ id: 'none', label: t('palette.wallpaperNone'), image: undefined },
    ...WALLPAPERS.map(w => ({
      id: w.id,
      label: w.label,
      image: w.css === undefined ? `url(${w.dataUrl})` : w.css,
    }))]
  // Two blocks: the glass slider keeps the section's two-column rhythm, while
  // the wallpaper grid sits under its own head the way the palette grid above
  // it does — sixteen swatches read as pictures, and a right-hand column could
  // not hold them at the palette cards' own scale.
  const custom = state.wallpaper === 'custom' && state.custom !== ''
  return <div className={css.section}>
    <div className={css.row}>
      <div className={css.head}>
        <div className={css.title}>{t('account.glass')}</div>
        <div className={css.desc}>{t('palette.glassHint')}</div>
      </div>
      <input className={css.slider} type="range" min="0" max="1" step="0.05" value={state.glass}
        aria-label={t('account.glass')}
        onChange={event => { controller.setGlass(Number(event.target.value)) }} />
    </div>
    <div className={css.groundBlock}>
      <div className={css.head}>
        <div className={css.title}>{t('palette.wallpaper')}</div>
        <div className={css.desc}>{t('palette.wallpaperHint')}</div>
      </div>
      <div className={css.groundGrid} role="radiogroup" aria-label={t('palette.wallpaper')}>
        {presets.map(preset => {
          const active = state.wallpaper === preset.id
          return <button key={preset.id} type="button" role="radio" aria-checked={active}
            className={clsx(css.card, active && css.cardActive)}
            onClick={() => { controller.setWallpaper(preset.id) }}>
            <span className={clsx(css.groundSwatch, preset.image === undefined && css.groundSwatchNone)}
              style={preset.image === undefined ? undefined : { backgroundImage: preset.image }} />
            <span className={css.label}>{preset.label}</span>
          </button>
        })}
        <label className={clsx(css.card, custom && css.cardActive)}>
          <span className={clsx(css.groundSwatch, !custom && css.groundSwatchCustom)}
            style={custom ? { backgroundImage: `url(${state.custom})` } : undefined}>
            {custom ? null : '+'}
          </span>
          <span className={css.label}>{custom ? t('palette.wallpaperCustomSet') : t('palette.wallpaperCustom')}</span>
          <input type="file" accept="image/*" hidden onChange={pickCustom} />
        </label>
      </div>
    </div>
  </div>
}
