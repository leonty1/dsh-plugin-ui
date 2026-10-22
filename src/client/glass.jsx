/** Ground treatment: frosted blur on the sidebar and workspace columns, over
 * an optional wallpaper. Settings live in the Skin palette section of
 * General settings; values persist in localStorage and publish as CSS
 * variables on document.body. Layout is untouched — this is surface only. */
import { useEffect, useState } from 'react'
import clsx from './clsx.js'
import { WALLPAPERS } from './generated-palettes.js'

const GLASS_KEY = 'dsh-plugin-ui.glass'
const WALLPAPER_KEY = 'dsh-plugin-ui.wallpaper'
const CUSTOM_KEY = 'dsh-plugin-ui.wallpaper.custom'

/** Built-in wallpaper choices; the custom entry rides on top when set. */
export const GROUND_PRESETS = [{ id: 'none', label: 'None' }, ...WALLPAPERS.map(w => ({ id: w.id, label: w.label }))]

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

/** @returns the CSS url() value for the active wallpaper, or none. */
function wallpaperUrl(state) {
  if (state.wallpaper === 'custom' && state.custom !== '') return `url(${state.custom})`
  const preset = WALLPAPERS.find(w => w.id === state.wallpaper)
  return preset === undefined ? 'none' : `url(${preset.dataUrl})`
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
export function GroundSettings({ controller, ctx }) {
  void ctx
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
  return <div className={clsx('dpui-ground-section')}>
    <label className="dpui-ground-row">
      <span className="dpui-ground-label">毛玻璃</span>
      <input type="range" min="0" max="1" step="0.05" value={state.glass}
        onChange={event => { controller.setGlass(Number(event.target.value)) }} />
    </label>
    <div className="dpui-ground-row" role="radiogroup" aria-label="壁纸">
      {GROUND_PRESETS.map(preset => (
        <button key={preset.id} type="button" role="radio"
          aria-checked={state.wallpaper === preset.id}
          className={clsx('dpui-ground-chip', state.wallpaper === preset.id && 'dpui-ground-chipActive')}
          onClick={() => { controller.setWallpaper(preset.id) }}>
          {preset.label}
        </button>
      ))}
      <label className={clsx('dpui-ground-chip', state.wallpaper === 'custom' && 'dpui-ground-chipActive')}>
        {state.wallpaper === 'custom' ? '自定义 ✓' : '自定义…'}
        <input type="file" accept="image/*" hidden onChange={pickCustom} />
      </label>
    </div>
  </div>
}
