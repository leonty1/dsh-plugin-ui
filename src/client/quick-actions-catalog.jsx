/** Built-in quick actions plus the list-slot entries other plugins contribute. */
import { useEffect, useMemo, useState } from 'react'
import { resolveSlotLabel } from '@deepseek-ai/dsh-client-ui-slots'
import {
  IconClockOutlineMedium, IconCordisPluginOutlineMedium, IconLightOutlineMedium,
  IconNewChatOutlineMedium, IconPanelLeftOutlineMedium, IconSettingsOutlineMedium,
  IconSlidersTwoOutlineMedium,
} from '@deepseek-ai/dsh-client-ui-primitives'
import { BUILTIN_QUICK_ACTIONS, QUICK_ACTION_SLOT } from './quick-actions.js'

/** Seat glyphs; an external entry supplies its own through the slot component. */
const BUILTIN_ICONS = {
  settings: <IconSettingsOutlineMedium size={14} />,
  'new-session': <IconNewChatOutlineMedium size={14} />,
  plugins: <IconCordisPluginOutlineMedium size={14} />,
  schedules: <IconClockOutlineMedium size={14} />,
  theme: <IconLightOutlineMedium size={14} />,
  sidebar: <IconPanelLeftOutlineMedium size={14} />,
  'all-settings': <IconSlidersTwoOutlineMedium size={14} />,
}

const BUILTIN_IDS = new Set(BUILTIN_QUICK_ACTIONS.map(action => action.id))

/** @param {string} id - built-in action id. @returns the seat glyph. */
export function builtinQuickActionIcon(id) {
  return BUILTIN_ICONS[id]
}

/**
 * Slot contributions currently registered by other client plugins, already
 * sorted by their list order. Reserved built-in ids are ignored so a plugin
 * cannot shadow a shipped action.
 * @param ctx - client context.
 * @returns visible external actions.
 */
export function externalQuickActions(ctx) {
  return ctx.slots.entriesOfSlot(QUICK_ACTION_SLOT)
    .map(({ options }) => ({
      id: options.id,
      label: options.label ?? options.id,
      order: options.order ?? 0,
    }))
    .filter(action => !BUILTIN_IDS.has(action.id))
    .sort((a, b) => a.order - b.order)
}

/**
 * Live catalog: the built-ins followed by every external contribution. The
 * settings dropdown re-renders when another plugin registers or withdraws.
 * @param ctx - client context.
 * @param t - plugin dictionary.
 * @returns selectable actions.
 */
export function useQuickActionCatalog(ctx, t) {
  const [external, setExternal] = useState(() => externalQuickActions(ctx))
  useEffect(() => {
    const update = () => { setExternal(externalQuickActions(ctx)) }
    update()
    const off = ctx.slots.subscribe(QUICK_ACTION_SLOT, update)
    return () => { off?.() }
  }, [ctx])
  return useMemo(() => [
    ...BUILTIN_QUICK_ACTIONS.map(action => ({
      id: action.id, label: t(action.labelKey), builtin: true, icon: BUILTIN_ICONS[action.id],
    })),
    ...external.map(action => ({ ...action, label: resolveSlotLabel(action.label) ?? action.id })),
  ], [external, t])
}

/**
 * @param id - stored seat id.
 * @param catalog - resolved action catalog.
 * @param t - plugin dictionary.
 * @returns the localized label, or the empty-choice copy for an unknown id.
 */
export function quickActionLabel(id, catalog, t) {
  return catalog.find(action => action.id === id)?.label ?? t('account.emptyChoice')
}
