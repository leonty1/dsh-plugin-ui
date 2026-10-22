/** Quick-settings rows shared by the account menu and the settings seat. */
import {
  IconDarkOutlineMedium, IconEnhanceOutlineMedium, IconFollowsystemOutlineMedium, IconGlobeOutlineMedium,
  IconLightOutlineMedium, IconSettingsOutlineMedium, IconSparkleMedium,
} from '@deepseek-ai/dsh-client-ui-primitives'
import { PALETTE_NAMES } from './generated-palettes.js'
import { PaletteIcon } from './palette-icons.jsx'
import { paletteLabel } from './palette.jsx'

/** Pixel sizes the quick menu offers, each with its dictionary key. */
export const SIZE_CHOICES = [[12, 'account.sizeSmall'], [14, 'account.sizeMedium'], [16, 'account.sizeLarge']]

/** Frosted-glass levels the quick menu offers: opacity fraction + label key. */
export const GLASS_CHOICES = [
  [0, 'account.glassOff'],
  [0.35, 'account.glassLow'],
  [0.6, 'account.glassMedium'],
  [0.85, 'account.glassHigh'],
]

/** The current value of each group. */
export function quickSettingsView(ctx, palette) {
  const theme = ctx.theme.getTheme()
  return {
    locale: ctx.locale.getSnapshot(),
    preference: theme.preference,
    textSize: theme.fontSizes.text,
    palette: palette?.get(),
    glass: ground?.get().glass,
  }
}

/** A row label with the current choice marked; the official Menu has no per-row check slot in submenus. */
function marked(label, selected) {
  return selected ? `✓ ${label}` : label
}

/**
 * Build the quick-settings rows. Each group is one top-level row carrying its
 * options as a one-level submenu, the deepest cascade the shared Menu renders.
 * @param view - values each group marks.
 * @param t - plugin dictionary copy.
 * @returns the group rows plus the entry into the full dialog.
 */
export function quickSettingsItems(view, t, ground) {
  const language = view.locale.locales.map(item => ({
    id: `locale:${item.id}`,
    label: marked(item.label, item.id === view.locale.active),
  }))
  const modes = [
    { id: 'mode:light', label: marked(t('account.themeLight'), view.preference === 'light'), icon: <IconLightOutlineMedium size={16} /> },
    { id: 'mode:dark', label: marked(t('account.themeDark'), view.preference === 'dark'), icon: <IconDarkOutlineMedium size={16} /> },
    { id: 'mode:system', label: marked(t('account.themeSystem'), view.preference === 'system'), icon: <IconFollowsystemOutlineMedium size={16} /> },
  ]
  const sizes = SIZE_CHOICES.map(([px, key]) => ({
    id: `size:${px}`,
    label: marked(t(key), px === view.textSize),
  }))
  // The palette group mirrors the Appearance cards, so a Qoder skin is one
  // submenu away from the seats; it renders only while a controller is injected.
  const palettes = ['none', ...PALETTE_NAMES].map(id => ({
    id: `palette:${id}`,
    label: marked(paletteLabel(id, t), id === view.palette),
    icon: <PaletteIcon id={id} size={14} />,
  }))
  return [
    { id: 'language', label: t('account.language'), icon: <IconGlobeOutlineMedium size={16} />, submenu: language },
    { id: 'mode', label: t('account.appearanceMode'), icon: <IconDarkOutlineMedium size={16} />, submenu: modes },
    ...(view.palette === undefined ? [] : [{
      id: 'palette', label: t('palette.title'), icon: <IconSparkleMedium size={16} />, submenu: palettes,
    }]),
    ...(ground === undefined ? [] : [{
      id: 'glass', label: t('account.glass'), icon: <IconEnhanceOutlineMedium size={16} />,
      submenu: GLASS_CHOICES.map(([value, key]) => ({
        id: `glass:${value}`,
        label: marked(t(key), view.glass === value),
      })),
    }]),
    { id: 'text-size', label: t('account.textSize'), icon: <IconEnhanceOutlineMedium size={16} />, submenu: sizes },
    {
      id: 'all-settings',
      label: t('account.allSettings'),
      icon: <IconSettingsOutlineMedium size={16} />,
    },
  ]
}

/**
 * Apply one quick-settings row.
 * @param ctx - client context carrying theme and locale.
 * @param id - row id in the group's `kind:value` form.
 * @param palette - palette controller behind the Appearance cards.
 * @returns whether the row named a quick setting; unowned ids stay the caller's.
 */
export function applyQuickSetting(ctx, id, palette, ground) {
  if (id.startsWith('mode:')) {
    ctx.theme.setTheme(id.slice('mode:'.length))
    return true
  }
  if (id.startsWith('palette:') && palette !== undefined) {
    palette.choose(id.slice('palette:'.length))
    return true
  }
  const size = /^size:(\d+)$/.exec(id)
  if (size !== null) {
    ctx.theme.setFontSize('text', Number(size[1]))
    return true
  }
  if (id.startsWith('locale:')) {
    ctx.locale.setLocale(id.slice('locale:'.length))
    return true
  }
  if (id.startsWith('glass:') && ground !== undefined) {
    ground.setGlass(Number(id.slice('glass:'.length)))
    return true
  }
  return false
}
