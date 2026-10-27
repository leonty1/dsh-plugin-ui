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
const SCOPE_KEY = 'dsh-plugin-ui.wallpaper.scope'

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

/** The ground reaches both floating cards by default; scoped, it stays inside
 *  the workspace and the rail keeps its own fill. */
const SCOPES = ['all', 'workspace']

/** What the rotation and the shuffle move through: pictures and gradients,
 *  never a flat sheet of colour. */
const ROTATABLE = WALLPAPERS.filter(preset => preset.group !== 'plain')

/** @returns the persisted ground settings, with defaults for anything absent. */
function stored() {
  const glass = Number(localStorage.getItem(GLASS_KEY) ?? '0.5')
  const wallpaper = localStorage.getItem(WALLPAPER_KEY) ?? 'white'
  const custom = localStorage.getItem(CUSTOM_KEY) ?? ''
  const every = Number(localStorage.getItem(ROTATE_KEY) ?? '0')
  const rotatedAt = Number(localStorage.getItem(ROTATED_AT_KEY) ?? '0')
  const scope = localStorage.getItem(SCOPE_KEY) ?? 'all'
  return {
    glass: Number.isFinite(glass) ? Math.min(Math.max(glass, 0), 1) : 0.5,
    wallpaper,
    custom,
    every: Number.isFinite(every) && every > 0 ? every : 0,
    rotatedAt: Number.isFinite(rotatedAt) ? rotatedAt : 0,
    scope: SCOPES.includes(scope) ? scope : 'all',
  }
}

/**
 * @returns the CSS background-image value for the active wallpaper, or
 * undefined when the ground is clear. Photo presets carry a data URL; gradient
 * and plain presets carry the image value itself, so `url()` only wraps the
 * former.
 */
function activeImage(state) {
  if (state.wallpaper === 'custom' && state.custom !== '') return `url(${state.custom})`
  if (state.wallpaper === 'none') return undefined
  const preset = WALLPAPERS.find(w => w.id === state.wallpaper)
  if (preset === undefined) return undefined
  return preset.css === undefined ? `url(${preset.dataUrl})` : preset.css
}

/** @returns the ground's background-image value, with none for a clear ground. */
function wallpaperUrl(state) {
  return activeImage(state) ?? 'none'
}

/** Publish the ground as body-scoped variables; skin.css consumes them. */
function apply(state) {
  const body = document.body
  body.setAttribute('data-dsh-ground-scope', state.scope)
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
  let timer
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
    localStorage.setItem(SCOPE_KEY, next.scope)
    apply(next)
    notify()
  }
  /** Step to the next rotatable preset, wrapping; a custom or empty ground
   * starts the cycle at the first preset. */
  const advance = () => {
    const ids = ROTATABLE.map(preset => preset.id)
    const at = ids.indexOf(current.wallpaper)
    write({ ...current, wallpaper: ids[(at + 1) % ids.length], rotatedAt: Date.now() })
  }
  /** Compared against a stored timestamp rather than counted down locally, so
   * time the window spent closed still counts — reopening after a day lands on
   * a new wallpaper instead of restarting the interval. */
  const tick = () => {
    if (current.every <= 0) return
    // A ground with no picture — a store from before the picker dropped the
    // none tile, or a cleared custom picture — stays put under rotation:
    // cycling past it would replace a ground the user emptied on purpose.
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
    setScope(scope) {
      if (!SCOPES.includes(scope)) return
      write({ ...current, scope })
    },
    /** Jump to a random picture or gradient, the way a shuffle does. */
    shuffle() {
      const pool = ROTATABLE.length > 1
        ? ROTATABLE.filter(preset => preset.id !== current.wallpaper)
        : ROTATABLE
      const pick = pool[Math.floor(Math.random() * pool.length)]
      if (pick === undefined) return
      write({ ...current, wallpaper: pick.id, rotatedAt: Date.now() })
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    install() {
      apply(current)
      tick()
      timer = setInterval(tick, 30000)
      return () => {
        clearInterval(timer)
        document.body.removeAttribute('data-dsh-glass')
        document.body.removeAttribute('data-dsh-ground-scope')
      }
    },
  }
}

/** Shuffle glyph: two paths crossing, the way macOS marks a random pick. */
export function ShuffleGlyph({ size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M1.6 4.2h1.9c1 0 1.9.5 2.5 1.3l2.5 3.5c.6.8 1.5 1.3 2.5 1.3h1.4M1.6 11.8h1.9c1 0 1.9-.5 2.5-1.3M8.4 6.2c.6-.8 1.5-1.3 2.5-1.3h3.4M13.4 2.6l1.8 2.3-1.8 2.3M13.4 8.8l1.8 2.3-1.8 2.3"
      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
}

/**
 * The Skin palette section's ground rows: a frosted-glass opacity slider and
 * the wallpaper picker. The picker follows the macOS Wallpaper pane: a large
 * preview with the rotation card beside it, then one shelf per kind of ground.
 * Both write through the controller and re-render on its events.
 * @param props - ground controller, dictionary, and client context.
 * @returns the ground settings rows.
 */
export function GroundSettings({ controller, ctx, t }) {
  const [state, setState] = useState(() => controller.get())
  const [expanded, setExpanded] = useState({ gradient: false, photo: false })
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
  const image = activeImage(state)
  const shelf = group => WALLPAPERS.filter(preset => preset.group === group)
  /** One swatch card: the wallpaper's own pixels as the picture, its name under. */
  const swatch = (id, label, picture, active) => <button key={id} type="button" role="radio"
    aria-checked={active}
    className={clsx(css.card, css.groundCard, active && css.cardActive)}
    onClick={() => { controller.setWallpaper(id) }}>
    <span className={css.groundSwatch} style={{ backgroundImage: picture }} />
    <span className={css.label}>{label}</span>
  </button>
  /** One shelf: a caption carrying the count, and the cards it holds. */
  const group = (key, title) => {
    const items = shelf(key)
    const open = expanded[key]
    const visible = open ? items : items.slice(0, 4)
    return <div className={css.groundShelf}>
      <div className={css.groundShelfHead}>
        <span className={css.groundGroupLabel}>{title}</span>
        {items.length > 4 && <button type="button" className={css.groundMore}
          onClick={() => { setExpanded(current => ({ ...current, [key]: !current[key] })) }}>
          {open ? t('palette.showLess') : `${t('palette.showAll')} (${items.length})`}
        </button>}
      </div>
      <div className={css.groundGrid} role="radiogroup" aria-label={title}>
        {visible.map(preset => swatch(preset.id, preset.label,
          preset.css === undefined ? `url(${preset.dataUrl})` : preset.css,
          state.wallpaper === preset.id))}
      </div>
    </div>
  }
  // The ground is three blocks: the frost slider keeps the section's two-column
  // rhythm, the wallpaper picker takes the macOS shape (preview, control card,
  // then the shelves), and the custom picture sits in the picker's own header
  // rather than taking a slot in the grid.
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
      <div className={css.groundHead}>
        <div className={css.head}>
          <div className={css.title}>{t('palette.wallpaper')}</div>
          <div className={css.desc}>{t('palette.wallpaperHint')}</div>
        </div>
        <label className={clsx(css.chip, css.customChip, custom && css.chipActive)}>
          {custom ? t('palette.wallpaperCustomSet') : t('palette.wallpaperCustom')}
          <input type="file" accept="image/*" hidden onChange={pickCustom} />
        </label>
      </div>
      <div className={css.wallHero}>
        <div className={clsx(css.wallPreview, image === undefined && css.wallPreviewNone)}
          style={image === undefined ? undefined : { backgroundImage: image }}>
          <button type="button" className={css.wallShuffle} aria-label={t('palette.shuffle')}
            onClick={() => { controller.shuffle() }}>
            <ShuffleGlyph />
          </button>
        </div>
        <div className={css.wallCard}>
          <div className={css.wallCardTop}>
            <div className={css.wallCardRow}>
              <button type="button" className={clsx(css.chip, css.wallChip)}
                onClick={() => { controller.shuffle() }}>
                <ShuffleGlyph />
                <span>{t('palette.shuffle')}</span>
              </button>
              <span className={css.wallSelectWrap}>
                <select className={css.wallSelect} value={state.every} aria-label={t('palette.rotate')}
                  onChange={event => { controller.setEvery(Number(event.target.value)) }}>
                  {ROTATE_CHOICES.map(([minutes, key]) =>
                    <option key={minutes} value={minutes}>{t(key)}</option>)}
                </select>
                <span className={css.wallSelectChevron} aria-hidden="true" />
              </span>
            </div>
            <div className={css.wallNote}>
              {t('palette.rotatesThrough')} {ROTATABLE.length} {t('palette.wallpaperUnit')}
            </div>
          </div>
          <div className={css.wallDivider} />
          <div className={css.wallScope}>
            <span className={css.wallScopeLabel}>{t('palette.scopeAll')}</span>
            <button type="button" role="switch" aria-checked={state.scope === 'all'}
              className={clsx(css.switch, state.scope === 'all' && css.switchOn)}
              onClick={() => { controller.setScope(state.scope === 'all' ? 'workspace' : 'all') }}>
              <span className={css.switchKnob} />
            </button>
          </div>
        </div>
      </div>
      {group('plain', t('palette.wallpaperGroupPlain'))}
      {group('gradient', t('palette.wallpaperGroupColor'))}
      {group('photo', t('palette.wallpaperGroupPhoto'))}
    </div>
  </div>
}
