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
const ROTATE_KEY = 'dsh-plugin-ui.wallpaper.every'
const ROTATED_AT_KEY = 'dsh-plugin-ui.wallpaper.rotatedAt'

/** Rotation intervals in minutes: [value, locale key]. 0 turns rotation off. */
export const ROTATE_CHOICES = [
  [0, 'palette.rotateOff'],
  [30, 'palette.rotate30m'],
  [60, 'palette.rotate1h'],
  [360, 'palette.rotate6h'],
  [720, 'palette.rotate12h'],
  [1440, 'palette.rotate1d'],
  [10080, 'palette.rotate1w'],
]

/** @returns the persisted ground settings, with defaults for anything absent. */
function stored() {
  const glass = Number(localStorage.getItem(GLASS_KEY) ?? '0.5')
  const wallpaper = localStorage.getItem(WALLPAPER_KEY) ?? 'none'
  const custom = localStorage.getItem(CUSTOM_KEY) ?? ''
  const every = Number(localStorage.getItem(ROTATE_KEY) ?? '0')
  const rotatedAt = Number(localStorage.getItem(ROTATED_AT_KEY) ?? '0')
  return {
    glass: Number.isFinite(glass) ? Math.min(Math.max(glass, 0), 1) : 0.5,
    wallpaper,
    custom,
    every: Number.isFinite(every) && every > 0 ? every : 0,
    rotatedAt: Number.isFinite(rotatedAt) ? rotatedAt : 0,
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

const WATCHDOG_INTERVAL = 5 * 60000

/**
 * Chromium occasionally drops every backdrop-filter layer at once — the tint
 * keeps painting but the blur goes missing, so frost shows crisp bleed-through
 * — without any crash or log. Rebuilding the layers heals it: park each
 * blurred element on `none` for one painted frame, then let the stylesheet
 * take the value back. The double rAF is what makes the "off" state actually
 * reach the screen: one rAF would cancel it before the frame paints.
 */
function nudgeBlurs() {
  // One painted frame of unblurred frost is invisible to the eye, but don't
  // sweep while an overlay is mid-interaction anyway.
  if (document.querySelector('[role=dialog],[role=menu],.dpui-account-list')) return
  const blurred = []
  for (const el of document.body.querySelectorAll('*')) {
    if (getComputedStyle(el).backdropFilter !== 'none') blurred.push(el)
  }
  if (blurred.length === 0) return
  for (const el of blurred) el.style.backdropFilter = 'none'
  requestAnimationFrame(() => requestAnimationFrame(() => {
    for (const el of blurred) el.style.removeProperty('backdrop-filter')
  }))
}

/** @returns a stop function for the periodic blur sweep. */
function startBlurWatchdog() {
  let pending
  const sweep = () => { if (!document.hidden) nudgeBlurs() }
  const onVisibility = () => { pending = setTimeout(sweep, 500) }
  const interval = setInterval(sweep, WATCHDOG_INTERVAL)
  document.addEventListener('visibilitychange', onVisibility)
  return () => {
    clearInterval(interval)
    clearTimeout(pending)
    document.removeEventListener('visibilitychange', onVisibility)
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
  let timer
  let stopWatchdog
  const listeners = new Set()
  const notify = () => { for (const listener of listeners) listener() }
  const write = next => {
    current = next
    localStorage.setItem(GLASS_KEY, String(next.glass))
    localStorage.setItem(WALLPAPER_KEY, next.wallpaper)
    if (next.custom === '') localStorage.removeItem(CUSTOM_KEY)
    else localStorage.setItem(CUSTOM_KEY, next.custom)
    if (next.every > 0) localStorage.setItem(ROTATE_KEY, String(next.every))
    else localStorage.removeItem(ROTATE_KEY)
    localStorage.setItem(ROTATED_AT_KEY, String(next.rotatedAt))
    apply(next)
    notify()
  }
  /** Step to the next built-in preset, wrapping; a custom or empty ground
   * starts the cycle at the first preset. */
  const advance = () => {
    const ids = WALLPAPERS.map(preset => preset.id)
    const at = ids.indexOf(current.wallpaper)
    write({ ...current, wallpaper: ids[(at + 1) % ids.length], rotatedAt: Date.now() })
  }
  /** Compared against a stored timestamp rather than counted down locally, so
   * time the window spent closed still counts — reopening after a day lands on
   * a new wallpaper instead of restarting the interval. */
  const tick = () => {
    if (current.every <= 0) return
    // Picking "none" while rotation is on is a deliberate opt-out; cycling
    // straight past it would make that choice impossible to keep.
    if (current.wallpaper === 'none') return
    if (Date.now() - current.rotatedAt < current.every * 60000) return
    advance()
  }
  return {
    get: () => current,
    setGlass(opacity) { write({ ...current, glass: opacity }) },
    setWallpaper(id) { write({ ...current, wallpaper: id, rotatedAt: Date.now() }) },
    setCustom(dataUrl) {
      write({
        ...current,
        wallpaper: dataUrl === '' ? 'none' : 'custom',
        custom: dataUrl,
        rotatedAt: Date.now(),
      })
    },
    setEvery(minutes) {
      write({ ...current, every: minutes, rotatedAt: Date.now() })
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    install() {
      apply(current)
      tick()
      timer = setInterval(tick, 30000)
      stopWatchdog = startBlurWatchdog()
      return () => {
        clearInterval(timer)
        stopWatchdog()
        document.body.removeAttribute('data-dsh-glass')
      }
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
  const custom = state.wallpaper === 'custom' && state.custom !== ''
  const gradients = WALLPAPERS.filter(preset => preset.css !== undefined)
  const photos = WALLPAPERS.filter(preset => preset.css === undefined)
  /** One swatch card: the wallpaper's own pixels as the picture, its name under. */
  const swatch = (id, label, image, active) => <button key={id} type="button" role="radio"
    aria-checked={active}
    className={clsx(css.card, css.groundCard, active && css.cardActive)}
    onClick={() => { controller.setWallpaper(id) }}>
    <span className={clsx(css.groundSwatch, image === undefined && css.groundSwatchNone)}
      style={image === undefined ? undefined : { backgroundImage: image }} />
    <span className={css.label}>{label}</span>
  </button>
  // The ground is three blocks: the frost slider keeps the section's two-column
  // rhythm, the wallpaper picker sets its swatches in labelled groups so sixteen
  // presets stay scannable, and the rotation row returns to the two-column
  // rhythm because it is a single choice like the slider above it.
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
      <div className={css.groundGroups} role="radiogroup" aria-label={t('palette.wallpaper')}>
      <div className={css.groundGrid}>
        {swatch('none', t('palette.wallpaperNone'), undefined, state.wallpaper === 'none')}
        <label className={clsx(css.card, css.groundCard, custom && css.cardActive)}>
          <span className={clsx(css.groundSwatch, !custom && css.groundSwatchCustom)}
            style={custom ? { backgroundImage: `url(${state.custom})` } : undefined}>
            {custom ? null : '+'}
          </span>
          <span className={css.label}>{custom ? t('palette.wallpaperCustomSet') : t('palette.wallpaperCustom')}</span>
          <input type="file" accept="image/*" hidden onChange={pickCustom} />
        </label>
      </div>
      <div className={css.groundGroupLabel}>{t('palette.wallpaperGroupColor')}</div>
      <div className={css.groundGrid}>
        {gradients.map(preset => swatch(preset.id, preset.label, preset.css, state.wallpaper === preset.id))}
      </div>
      <div className={css.groundGroupLabel}>{t('palette.wallpaperGroupPhoto')}</div>
      <div className={css.groundGrid}>
        {photos.map(preset => swatch(preset.id, preset.label, `url(${preset.dataUrl})`, state.wallpaper === preset.id))}
      </div>
      </div>
    </div>
    <div className={css.row}>
      <div className={css.head}>
        <div className={css.title}>{t('palette.rotate')}</div>
        <div className={css.desc}>{t('palette.rotateHint')}</div>
      </div>
      <div className={css.chipRow} role="radiogroup" aria-label={t('palette.rotate')}>
        {ROTATE_CHOICES.map(([minutes, key]) => <button key={minutes} type="button" role="radio"
          aria-checked={state.every === minutes}
          className={clsx(css.chip, state.every === minutes && css.chipActive)}
          onClick={() => { controller.setEvery(minutes) }}>{t(key)}</button>)}
      </div>
    </div>
  </div>
}
