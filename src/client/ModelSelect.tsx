/**
 * ModelSelect: the composer's named model seat (`conversation.input.model`).
 * One card carries the whole decision, in reading order: the provider-grouped
 * model list (each row showing the catalog's one-line description when it has
 * one), and the current model's reasoning efforts as a segmented radio row. Picking a model
 * keeps the card open so its effort row is the next click; picking an effort
 * closes it. The trigger (313:14108's ToggleButton) shows both outcomes: model
 * name + effort in the caption tone.
 * Model catalogs above four entries show search, which retains focus while
 * ↑/↓ cycle the highlighted result; Enter and Tab accept it. Smaller model
 * catalogs move focus between rows. Escape and Shift+Tab close back to the
 * trigger. The card opens on the model in use. Provider headings paint their
 * background only while pinned by scrolling. Clearing a query restores the
 * full list and search focus. Selecting restores trigger focus without a ring
 * until the trigger loses focus or the menu reopens. Model names match a
 * case-insensitive ordered subsequence within each provider group, ranked by
 * prefix, alignment score, then catalog order. Data and submission ride the
 * same per-session ModelDirectory as the /model popup; exact-model reasoning
 * metadata and the selected effort come from the Host rather than a
 * client-owned vocabulary. A rejected selection announces through the shared
 * transient Toast anchored to the composer card; the in-menu strip with
 * Retry remains the catalog-load surface. While the directory's pending
 * selection is unsettled, the trigger shows a spinner in place of its
 * chevron, and each row whose value that selection carries shows one in place
 * of its check mark.
 */
import { MenuGroup, MenuSurface, observeStickyMenuGroups } from '@deepseek-ai/dsh-client-ui-primitives'
import {
  useEffect, useId, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore,
  type CSSProperties, type KeyboardEvent, type FocusEvent,
} from 'react'
import { createPortal } from 'react-dom'
import clsx from './clsx.js'
import type { ModelReasoningEffort, ModelSelection } from '@deepseek-ai/dsh-api-remotes/client'
import {
  IconCheckOutlineRegular, IconChevronDownOutlineRegular, IconCloseFillRegular,
  IconDataOutlineRegular, IconWarningOutlineRegular, Input, rankByName, StateDot, Toast,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type { ModelSelectInjected } from './model-contract.ts'
import css from './ModelSelect.module.css'
import { orderModelProviders } from './provider-order.ts'

/**
 * The plugin registers its composer-seat copy under its own namespace
 * (`plugin-ui.model`), so the key union is declared here instead of borrowing
 * the host's `model` namespace: this dictionary carries keys the host's does
 * not (the effort levels and their hints), and merging into `model` itself
 * would collide with ui-model-selection's declaration.
 */
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'plugin-ui.model': import('./locales.js').ModelKey
  }
}

/** The plugin's own seat copy: the framework `t` seat narrowed to our keys. */
type ModelLocale = PropsLocale<'plugin-ui.model'>

/** One dynamic effort row; undefined means preserve the provider default. */
interface EffortChoice {
  key: string
  effort: string | undefined
  label: string
}

/** Known effort ids, in the localized key form they carry in the dictionary. */
const EFFORT_KEYS = ['off', 'none', 'minimal', 'low', 'medium', 'high', 'max'] as const

/** The localized label key for a known effort id, or undefined otherwise. */
function effortLabelKey(id: string | undefined): `effort.${typeof EFFORT_KEYS[number]}` | undefined {
  const key = id?.toLowerCase() as typeof EFFORT_KEYS[number] | undefined
  return key !== undefined && (EFFORT_KEYS as readonly string[]).includes(key) ? `effort.${key}` : undefined
}

/** The localized hint key for a known effort id, or undefined otherwise. */
function effortHintKey(id: string | undefined): `effort.hint.${typeof EFFORT_KEYS[number]}` | undefined {
  const label = effortLabelKey(id)
  if (label === undefined) return undefined
  const suffix = label.slice('effort.'.length) as typeof EFFORT_KEYS[number]
  return `effort.hint.${suffix}`
}

/** Localized level name, falling back to the provider's label. */
function effortLabelFor(t: ModelLocale['t'], id: string | undefined, fallback: string): string {
  const key = effortLabelKey(id)
  return key === undefined ? fallback : t(key)
}

/** Localized one-line hint, falling back to the provider's description. */
function effortHintFor(t: ModelLocale['t'], id: string | undefined, fallback: string | undefined): string | undefined {
  const key = effortHintKey(id)
  return key === undefined ? fallback : t(key)
}

/** Viewport clearance for both portaled cards. */
const PLACE_MARGIN = 12

/** Gap between the list card and the effort card, and above the trigger. */
const PLACE_GAP = 8

/**
 * Durations of the post-pick gesture, mirroring the animations in
 * ModelSelect.module.css (`dpui-segment-slide`, `dpui-card-fold`). The level
 * reads first, then the cards withdraw toward the composer.
 */
const PICK_MS = 260
const FOLD_MS = 220

/** @returns whether a placement already lands on this point (sub-pixel noise aside). */
function samePoint(current: CSSProperties | null, left: number, top: number): boolean {
  return current !== null && Math.abs((current.left as number) - left) < 0.5
    && Math.abs((current.top as number) - top) < 0.5
}

/** Unplaced portal card: hidden but laid out at a fixed origin so offsetWidth/offsetHeight are real (Menu primitive's measure pass). */
const MEASURE_STYLE: CSSProperties = { visibility: 'hidden', left: 0, top: 0 }

/**
 * Render the composer model seat.
 * @param props - owner share (locked) + injected face (shared directory
 * store/verbs) + the standard locale seat.
 * @returns the trigger and, while open, the single model/effort card.
 */
export function ModelSelect(
  { locked, available, directory, load, select, t }:
  ModelSelectInjected & { locked: boolean } & ModelLocale,
) {
  const state = useSyncExternalStore(
    fn => directory.subscribe(fn),
    () => directory.getSnapshot(),
  )
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const [selectionFocus, setSelectionFocus] = useState(false)
  // The in-menu error strip serves catalog loads (its Retry re-runs the
  // load); a rejected SELECTION announces through the transient toast
  // instead, so the strip renders only while the latest failure-capable
  // action was a load.
  const lastActionRef = useRef<'load' | 'select'>('load')
  const [toast, setToast] = useState<{ seq: number; text: string } | null>(null)
  const toastSeq = useRef(0)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const searchRef = useRef<HTMLInputElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const detailRef = useRef<HTMLDivElement | null>(null)
  const groupsRef = useRef<HTMLDivElement | null>(null)
  const [menuPos, setMenuPos] = useState<CSSProperties | null>(null)
  // The effort card follows the row the pointer last visited and falls back to
  // the model in use. It stays put when the pointer leaves the list: the card
  // itself is the next click target, and snapping back mid-reach would apply
  // the level to a different model than the one being read.
  const [preview, setPreview] = useState<{ provider: string; model: string } | null>(null)
  // Pointer entry fires again for the same row whenever the cursor crosses a
  // child element, and a fresh object would re-render the list every time.
  // Compare by value so only a real row change reaches the render path.
  const hoverRow = (provider: string, model: string): void => {
    setPreview(current => current !== null && current.provider === provider && current.model === model
      ? current
      : { provider, model })
  }
  const [detailPos, setDetailPos] = useState<CSSProperties | null>(null)
  // 'idle' renders normally; 'pick' plays the level's slide-in; 'fold' plays
  // the card's collapse into the composer; the card unmounts after it. The
  // two durations mirror ModelSelect.module.css: the pick animation must
  // finish before the collapse starts, or the thumb gets cut off mid-travel.
  const [fold, setFold] = useState<'idle' | 'pick' | 'fold'>('idle')
  // The level whose slide-in is playing; only that button gets the pick class.
  const [pickedEffort, setPickedEffort] = useState<string | undefined>(undefined)
  const foldTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  const playFold = (): void => {
    for (const timer of foldTimers.current) clearTimeout(timer)
    foldTimers.current = [
      setTimeout(() => { setFold('fold') }, PICK_MS),
      setTimeout(() => { setFold('idle'); close() }, PICK_MS + FOLD_MS),
    ]
  }
  useEffect(() => () => { for (const timer of foldTimers.current) clearTimeout(timer) }, [])
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const id = useId()

  const groups = useMemo(() => orderModelProviders(state.groups), [state.groups])
  const choices = useMemo(() => groups.flatMap(group =>
    group.models.map(model => ({
      group,
      model,
      selection: {
        provider: group.id,
        model: model.id,
        ...model.reasoning?.defaultEffort === undefined
          ? {}
          : { reasoningEffort: model.reasoning.defaultEffort },
      } satisfies ModelSelection,
    }))), [groups])
  const showSearch = choices.length > 4
  const filteredGroups = useMemo(() => groups.map(group => ({
    ...group, models: rankByName(group.models, showSearch ? query.trim() : ''),
  })).filter(group => group.models.length > 0), [groups, query, showSearch])
  const visibleModels = useMemo(() => filteredGroups.flatMap(group => group.models.map(model => ({
    provider: group.id, model: model.id,
  }))), [filteredGroups])
  const currentVisibleIndex = visibleModels.findIndex(model =>
    model.provider === state.current?.provider && model.model === state.current.model)
  const activeModelIndex = Math.min(highlightedIndex ?? Math.max(0, currentVisibleIndex), visibleModels.length - 1)
  const selectedIndex = state.current === null
    ? -1
    : choices.findIndex(c => c.selection.provider === state.current?.provider && c.selection.model === state.current.model)
  const currentChoice = choices[selectedIndex]
  const reasoning = currentChoice?.model.reasoning
  const effectiveEffort = state.current?.reasoningEffort ?? reasoning?.defaultEffort
  // The annotation card is a hover affordance: it appears when the pointer
  // lands on a row and stays while it moves across the list. Opening the menu
  // shows the list alone — the current model's description is already on the
  // trigger and the effort row costs the list a whole column of width before
  // the user has asked for it.
  const shownChoice = preview === null
    ? undefined
    : choices.find(choice => choice.group.id === preview.provider && choice.model.id === preview.model)
  const shownReasoning = shownChoice?.model.reasoning
  const shownEffort = shownChoice === currentChoice
    ? effectiveEffort
    : shownReasoning?.defaultEffort
  const effortChoices = useMemo<readonly EffortChoice[]>(() => shownReasoning === undefined
    ? []
    : [
      ...shownReasoning.defaultEffort === undefined
        ? [{ key: 'provider-default', effort: undefined, label: t('effort.providerDefault') }]
        : [],
      ...shownReasoning.efforts.map((effort: ModelReasoningEffort) => ({
        key: `effort:${effort.id}`,
        effort: effort.id,
        label: effortLabelFor(t, effort.id, effort.name),
      })),
    ], [shownReasoning, t])
  const providerDescription = shownReasoning?.efforts.find(level => level.id === shownEffort)?.description
  const effortDescription = effortHintFor(t, shownEffort, providerDescription)
  const { pending } = state
  const busy = pending !== null
  // The trigger reports what the user just picked, not what the Host has
  // confirmed yet: `pending` carries the full selection and is published
  // synchronously by the directory, while `current` only moves once the round
  // trip lands. Without this the caption would flash the previous model for
  // the length of the request right after the click that chose the new one.
  const shownSelection = pending ?? state.current
  const shownIndex = shownSelection === null
    ? -1
    : choices.findIndex(c => c.selection.provider === shownSelection.provider && c.selection.model === shownSelection.model)
  const triggerChoice = choices[shownIndex] ?? currentChoice
  const triggerReasoning = triggerChoice?.model.reasoning
  const triggerEffort = shownSelection === null
    ? undefined
    : shownSelection.reasoningEffort ?? triggerReasoning?.defaultEffort
  const triggerEffortLabel = triggerChoice === undefined
    ? undefined
    : triggerReasoning === undefined
      ? state.retainedEffort
      : triggerEffort === undefined
        ? t('effort.providerDefault')
        : effortLabelFor(t, triggerEffort, triggerReasoning.efforts.find(level => level.id === triggerEffort)?.name ?? triggerEffort)

  const reload = (): void => {
    lastActionRef.current = 'load'
    load()
  }

  useEffect(() => {
    if (!open) return
    const closeOutside = (event: MouseEvent): void => {
      // The portaled card is outside the trigger subtree; check both.
      if (rootRef.current?.contains(event.target as Node) === true) return
      if (menuRef.current?.contains(event.target as Node) === true) return
      if (detailRef.current?.contains(event.target as Node) === true) return
      setOpen(false)
    }
    document.addEventListener('mousedown', closeOutside)
    return () => { document.removeEventListener('mousedown', closeOutside) }
  }, [open])

  useLayoutEffect(() => {
    if (!showSearch) {
      setQuery('')
      setHighlightedIndex(null)
    }
  }, [showSearch])

  // Focus lands inside the card only when the trigger cannot carry it: a first
  // pick (no model in use) opens on the search field or the first row, and a
  // catalog arriving mid-open moves focus out of a field that is going away.
  const focusIntent = useRef<'first' | null>(null)
  const previousShowSearch = useRef(showSearch)
  useEffect(() => {
    const changedSearchMode = previousShowSearch.current !== showSearch
    previousShowSearch.current = showSearch
    if (!open || (focusIntent.current === null && !changedSearchMode)) return
    focusIntent.current = null
    if (showSearch) {
      searchRef.current?.focus()
      return
    }
    const checked = menuRef.current?.querySelector<HTMLElement>('[role="menuitemradio"][aria-checked="true"]:not([disabled])')
    // Rows a selection in flight disabled cannot take the keyboard; the
    // trigger does, so the card's keys still reach the menu.
    ;(checked ?? itemRefs.current.find(item => item !== null && !item.disabled) ?? triggerRef.current)?.focus()
  }, [open, showSearch])

  useEffect(() => {
    const viewport = groupsRef.current
    if (viewport === null) return
    return observeStickyMenuGroups(viewport)
  }, [available, open, filteredGroups])

  // True while the highlight was last moved by the pointer. A pointer pick
  // never scrolls the list: the row under the cursor is already the active
  // one, and scrolling would slide a different row into the next click.
  const pointerPicked = useRef(false)

  useLayoutEffect(() => {
    if (open && activeModelIndex >= 0 && !pointerPicked.current) {
      itemRefs.current[activeModelIndex]?.scrollIntoView({ block: 'nearest' })
    }
  }, [open, activeModelIndex, visibleModels])

  // Portaled placement (the Menu primitive's portal rules: fixed from the
  // anchor rect, measured before paint, clamped inside the viewport): above
  // the trigger, right edges aligned. The list re-places only when its content
  // changes size, the query filters it, or the window moves — a selection in
  // flight must not move the card out from under the pointer.
  /* jscpd:ignore-start -- deliberate mirror of ui-primitives useAnchoredPosition:
     that hook only places from the anchor's LEFT edge, while this card aligns
     right edges (x = rect.right - width), so the measure-and-clamp plumbing repeats. */
  useLayoutEffect(() => {
    if (!open) { setMenuPos(null); setDetailPos(null); return }
    const place = (): void => {
      /* v8 ignore next 2 -- the trigger ref is attached whenever the menu is open. */
      const rect = triggerRef.current?.getBoundingClientRect()
      if (rect === undefined) return
      const lw = menuRef.current?.offsetWidth ?? 0
      const lh = menuRef.current?.offsetHeight ?? 0
      let x = rect.right - lw
      let y = rect.top - PLACE_GAP - lh
      if (lw > 0) x = Math.min(Math.max(x, PLACE_MARGIN), window.innerWidth - lw - PLACE_MARGIN)
      if (lh > 0) y = Math.min(Math.max(y, PLACE_MARGIN), window.innerHeight - lh - PLACE_MARGIN)
      setMenuPos(current => samePoint(current, x, y) ? current : { left: x, top: y })
    }
    // First run measures the hidden pre-render (same commit as `open`), so
    // the card lands placed before anything paints.
    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open, query, visibleModels.length])

  // The effort card follows the row the pointer last visited — content and
  // position alike. Its top edge lines up with that row's top (the model
  // name), so the card reads as the row's own annotation; it still opens
  // leftward (the list sits against the composer's right edge), flips right
  // when the window leaves no room, and clamps inside the viewport. Before
  // any row is hovered it anchors to the model in use; afterwards it stays
  // on the last hovered row even once the pointer leaves the list, because
  // the card itself is the next click target and snapping away mid-reach
  // would apply the level to a different model than the one being read.
  // Live rects keep a card resize from moving the list and keep the anchor
  // glued to the row while the list scrolls.
  useLayoutEffect(() => {
    if (!open || menuPos === null || preview === null) { setDetailPos(null); return }
    const place = (): void => {
      const list = menuRef.current?.getBoundingClientRect()
      /* v8 ignore next 2 -- the list is mounted and placed before this runs. */
      if (list === undefined) return
      const dw = detailRef.current?.offsetWidth ?? 0
      const dh = detailRef.current?.offsetHeight ?? 0
      let dx = list.left - PLACE_GAP - dw
      if (dx < PLACE_MARGIN) dx = list.right + PLACE_GAP
      const x = Math.min(Math.max(dx, PLACE_MARGIN), window.innerWidth - dw - PLACE_MARGIN)
      // The card is anchored to the row under the pointer: its top edge lines
      // up with that row's top, so the annotation reads as belonging to it.
      const anchorIndex = visibleModels.findIndex(model =>
        model.provider === preview.provider && model.model === preview.model)
      const rowRect = anchorIndex >= 0 ? itemRefs.current[anchorIndex]?.getBoundingClientRect() : undefined
      const y = Math.min(Math.max(rowRect?.top ?? list.bottom - dh, PLACE_MARGIN), window.innerHeight - dh - PLACE_MARGIN)
      setDetailPos(current => samePoint(current, x, y) ? current : { left: x, top: y })
    }
    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open, menuPos, shownChoice, shownReasoning, preview, visibleModels])
  /* jscpd:ignore-end */

  if (!available) return null

  const show = (): void => {
    setSelectionFocus(false)
    triggerRef.current?.focus()
    setQuery('')
    setHighlightedIndex(null)
    pointerPicked.current = false
    setPreview(null)
    setFold('idle')
    if (currentChoice === undefined) focusIntent.current = 'first'
    setOpen(true)
    reload()
  }

  const changeQuery = (next: string): void => {
    setQuery(next)
    setHighlightedIndex(0)
  }

  const close = (restoreFocus = false): void => {
    setOpen(false)
    setPreview(null)
    setFold('idle')
    if (restoreFocus) queueMicrotask(() => { triggerRef.current?.focus() })
  }

  const closeAfterSelection = (): void => {
    setSelectionFocus(true)
    close(true)
  }

  // The ring is read from the live card rather than the ref cache: a focus
  // change re-renders the rows, and a cache written by the previous commit can
  // hold nodes the browser has already dropped.
  const moveFocus = (offset: number): void => {
    // Keyboard stepping must keep the ring in view; a pointer pick must not.
    pointerPicked.current = false
    const items = [menuRef.current, detailRef.current].flatMap(root =>
      Array.from(root?.querySelectorAll<HTMLButtonElement>('[data-ring]') ?? []))
    if (items.length === 0) return
    const active = items.findIndex(item => item === document.activeElement)
    // Focus outside the rows (the trigger, which keeps it while the menu
    // opens) enters at the end the step comes from: the first row forward,
    // the last row backward.
    const next = active === -1
      ? (offset > 0 ? 0 : items.length - 1)
      : (active + offset + items.length) % items.length
    items[next]?.focus()
  }

  const onRootKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.nativeEvent.isComposing) return
    if (event.key === 'Escape' && open) {
      event.preventDefault()
      close(true)
      return
    }
    if (!open) return
    // Search keeps its own ↑/↓: they cycle the highlighted result and hand
    // focus back to the field, so typing and stepping never leave the box.
    const inSearch = showSearch && event.target instanceof HTMLInputElement
    if (inSearch && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault()
      if (!busy && visibleModels.length > 0) {
        pointerPicked.current = false
        const direction = event.key === 'ArrowDown' ? 1 : -1
        setHighlightedIndex((activeModelIndex + direction + visibleModels.length) % visibleModels.length)
        searchRef.current?.focus()
      }
      return
    }
    if (inSearch && (event.key === 'Enter' || (event.key === 'Tab' && !event.shiftKey))) {
      if (event.key === 'Tab' && visibleModels.length === 0) return
      event.preventDefault()
      const highlighted = visibleModels[activeModelIndex]
      if (!busy && highlighted !== undefined) choose(highlighted)
      return
    }
    // Tab settles like Enter and Shift+Tab leaves like Escape, so the menu's
    // keys mean what they mean in the composer. Both are consumed: the card
    // keeps the browser's focus traversal out while it is open.
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        event.preventDefault()
        close(true)
        return
      }
      // Settling activates the row the keyboard is on; with focus still on the
      // trigger, Tab enters the menu at the value in use instead. Any other
      // control inside the card (a retry button) keeps the browser's traversal,
      // so the keystroke stays unconsumed there.
      const focused = document.activeElement
      const rows = itemRefs.current.filter((item): item is HTMLButtonElement => item !== null)
      if (focused instanceof HTMLButtonElement && rows.includes(focused)) {
        event.preventDefault()
        focused.click()
        return
      }
      if (focused !== triggerRef.current) return
      event.preventDefault()
      if (showSearch) {
        setHighlightedIndex(null)
        searchRef.current?.focus()
        return
      }
      const checked = menuRef.current?.querySelector<HTMLElement>('[role="menuitemradio"][aria-checked="true"]:not([disabled])')
      ;(checked ?? rows.find(item => !item.disabled))?.focus()
      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      moveFocus(event.key === 'ArrowDown' ? 1 : -1)
    }
  }

  const onBlur = (event: FocusEvent<HTMLDivElement>): void => {
    if (event.relatedTarget instanceof Node && (
      rootRef.current?.contains(event.relatedTarget) === true
      || menuRef.current?.contains(event.relatedTarget) === true
      || detailRef.current?.contains(event.relatedTarget) === true
    )) return
    close()
  }

  // Every click on the card is the card's last decision. The pick plays its
  // slide-in on the level, then both cards fold away, and only then does the
  // selection submit — the animation covers the round trip, so nothing waits
  // on the network and nothing can sit open for a beat and then disappear.
  // Folding runs on timers instead of an unmount handler because the fold is
  // a React state: closing during it would drop the cards mid-animation.
  const settleSelection = (result: Awaited<ReturnType<ModelSelectInjected['select']>>): void => {
    if (result === undefined || result.ok) return
    const { error } = result
    toastSeq.current += 1
    setToast({
      seq: toastSeq.current,
      text: error.code === 'session/writer-held'
        ? t('error.sessionInUse')
        : t('error.action', { message: `${error.code}: ${error.message}` }),
    })
  }

  const submitAfterFold = (selection: ModelSelection): void => {
    lastActionRef.current = 'select'
    setSelectionFocus(true)
    void select(selection).then(settleSelection)
  }

  const choose = (selection: ModelSelection): void => {
    if (state.current?.provider === selection.provider && state.current.model === selection.model) {
      closeAfterSelection()
      return
    }
    setFold('pick')
    playFold()
    submitAfterFold(selection)
  }

  const chooseEffort = (effort: string | undefined): void => {
    if (shownChoice === undefined) return
    const provider = shownChoice.group.id
    const model = shownChoice.model.id
    if (state.current?.provider === provider && state.current?.model === model && effectiveEffort === effort) {
      closeAfterSelection()
      return
    }
    setFold('pick')
    setPickedEffort(effort)
    playFold()
    submitAfterFold({ provider, model, ...effort === undefined ? {} : { reasoningEffort: effort } })
  }

  const waiting = triggerChoice === undefined && state.status === 'loading'
  const modelLabel = waiting
    ? t('trigger.loading')
    : triggerChoice?.model.name
      ?? t('trigger.fallback')
  const triggerLabel = triggerEffortLabel === undefined ? modelLabel : `${modelLabel} · ${triggerEffortLabel}`
  const triggerAria = waiting
    ? t('trigger.loading')
    : triggerChoice === undefined
      ? t('trigger.selectAria')
      : triggerEffortLabel === undefined
        ? t('trigger.aria', { model: modelLabel })
        : t('trigger.ariaEffort', { model: modelLabel, effort: triggerEffortLabel })
  itemRefs.current = []
  let itemIndex = 0
  let modelIndex = 0
  const itemRef = () => {
    const at = itemIndex++
    return (node: HTMLButtonElement | null) => { itemRefs.current[at] = node }
  }

  return (
    <div
      ref={rootRef}
      className={css.root}
      onKeyDown={onRootKeyDown}
      onBlur={onBlur}
      onMouseDown={(event) => {
        // WebKit blurs a focused row before click unless the button's mousedown keeps focus.
        if (event.target instanceof Element && event.target.closest('button') !== null) event.preventDefault()
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={css.trigger}
        aria-label={triggerAria}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-menu` : undefined}
        title={triggerLabel}
        aria-busy={busy}
        data-selection-focus={selectionFocus ? '' : undefined}
        onBlur={() => { setSelectionFocus(false) }}
        disabled={locked}
        onClick={() => {
          if (open) {
            close(true)
          } else {
            show()
          }
        }}
      >
        <IconDataOutlineRegular className={css.triggerIcon} size={16} />
        <span className={css.triggerLabel}>{modelLabel}</span>
        {triggerEffortLabel !== undefined && <span className={css.triggerEffort}>{triggerEffortLabel}</span>}
        {busy
          ? <StateDot state="ongoing" />
          : <IconChevronDownOutlineRegular className={clsx(css.chevron, open && css.chevronOpen)} />}
      </button>

      {/* Portaled to body (Menu primitive's portal mode) so the sidebar and
          column overflow clips cannot crop the card; synthetic events still
          bubble through this React subtree, keeping onKeyDown/onBlur live. */}
      {open && createPortal(
        <MenuSurface
          ref={menuRef}
          id={`${id}-menu`}
          className={clsx(css.menu, fold === 'fold' && css.menuFold)}
          style={menuPos ?? MEASURE_STYLE}
          role="group"
          aria-label={t('menu.aria')}
          aria-busy={state.status === 'loading' || busy}
        >
          {showSearch && <div className={css.searchRow}>
            <Input
              ref={searchRef}
              className={clsx(css.search, query !== '' && css.searchWithQuery)}
              type="text"
              role="searchbox"
              aria-label={t('search.placeholder')}
              aria-controls={`${id}-models`}
              aria-activedescendant={activeModelIndex < 0 ? undefined : `${id}-model-${activeModelIndex}`}
              placeholder={t('search.placeholder')}
              value={query}
              readOnly={busy}
              onChange={(event) => { changeQuery(event.target.value) }}
            />
            {query !== '' && (
              <button
                type="button"
                className={css.searchClear}
                aria-label={t('search.clear')}
                disabled={busy}
                onClick={() => {
                  changeQuery('')
                  searchRef.current?.focus()
                }}
              >
                <IconCloseFillRegular />
              </button>
            )}
          </div>}
          {/* The refresh strip only stands in for an empty card; once rows are
              on screen it would push them down mid-selection, so the trigger's
              own spinner carries the in-flight state instead. */}
          {state.status === 'loading' && filteredGroups.length === 0 && (
            <div className={css.status}>{t('status.loading')}</div>
          )}
          {state.error !== null && lastActionRef.current === 'load' && (
            <div className={css.error}>
              <span>{t('error.action', { message: state.error })}</span>
              <button type="button" className={css.retry} onClick={reload}>{t('retry')}</button>
            </div>
          )}
          {state.failures.map(failure => (
            <div className={css.warning} key={failure.id}>
              <span>{t('warning.groupLoad', { name: failure.id === 'deepseek-account' ? t('provider.account') : failure.name, message: failure.message })}</span>
              <button type="button" className={css.retry} onClick={reload}>{t('retry')}</button>
            </div>
          ))}
          <div
            ref={groupsRef}
            id={`${id}-models`}
            className={clsx(css.groups, 'scrollable')}
            role="menu"
            aria-label={t('menu.model')}
            hidden={filteredGroups.length === 0}
          >
            {filteredGroups.map((group) => {
              return (
                <MenuGroup key={group.id} label={group.id === 'deepseek-account' ? t('provider.account') : group.name}>
                  {group.models.map((model) => {
                    const index = modelIndex++
                    const selected = state.current?.provider === group.id && state.current.model === model.id
                    return (
                      <button
                        ref={itemRef()}
                        type="button"
                        role="menuitemradio"
                        data-ring=""
                        aria-checked={selected}
                        id={`${id}-model-${index}`}
                        tabIndex={showSearch ? -1 : 0}
                        onFocus={() => { setHighlightedIndex(index) }}
                        onPointerEnter={() => { pointerPicked.current = true; hoverRow(group.id, model.id) }}
                        data-highlighted={index === activeModelIndex ? '' : undefined}
                        className={clsx(
                          css.option, css.modelOption, selected && css.selected, index === activeModelIndex && css.optionActive,
                        )}
                        onMouseMove={busy || index === activeModelIndex ? undefined : () => {
                          if (showSearch) setHighlightedIndex(index)
                          else itemRefs.current[index]?.focus()
                        }}
                        key={model.id}
                        title={model.name}
                        disabled={busy || fold !== 'idle'}
                        onClick={() => { choose({ provider: group.id, model: model.id }) }}
                      >
                        <span className={css.optionCopy}>
                          <span className={css.modelName}>{model.name}</span>
                        </span>
                        <span className={css.check}>
                          {pending?.provider === group.id && pending.model === model.id
                            ? <StateDot state="ongoing" />
                            : selected ? <IconCheckOutlineRegular /> : null}
                        </span>
                      </button>
                    )
                  })}
                </MenuGroup>
              )
            })}
          </div>
          {state.status === 'ready' && filteredGroups.length === 0 && (
            <div className={css.empty} role="status">{t(choices.length === 0 ? 'empty.models' : 'search.empty')}</div>
          )}


        </MenuSurface>,
        document.body,
      )}
      {/* The effort card states the levels the previewed model actually
            advertises; content and anchor both follow the hovered row. */}
      {open && shownChoice !== undefined && createPortal(
        <MenuSurface
          ref={detailRef}
          className={clsx(css.detail, fold === 'fold' && css.detailFold)}
          style={detailPos ?? MEASURE_STYLE}
          role="group"
          aria-label={t('menu.effort')}
          aria-busy={busy}
        >
          <div className={css.detailTitle}>{shownChoice?.model.name ?? modelLabel}</div>
          {shownChoice?.model.description !== undefined && (
            <p className={css.detailDescription}>{shownChoice.model.description}</p>
          )}
          {shownReasoning !== undefined && <>
            <div className={css.sectionLabel}>
              <span>{t('menu.effort')}</span>
              {effortDescription !== undefined && <span className={css.sectionHint}>{effortDescription}</span>}
            </div>
            <div className={css.segment} role="radiogroup" aria-label={t('menu.effort')}>
              {effortChoices.map((level) => {
                const active = shownEffort === level.effort
                return (
                  <button
                    ref={itemRef()}
                    type="button"
                    role="radio"
                    data-ring=""
                    aria-checked={active}
                    className={clsx(
                      css.segmentItem,
                      active && css.segmentItemActive,
                      fold === 'pick' && level.effort === pickedEffort && css.segmentItemPicked,
                    )}
                    key={level.key}
                    disabled={busy || fold !== 'idle'}
                    onClick={() => { chooseEffort(level.effort) }}
                  >
                    {pending !== null && pending.provider === shownChoice?.group.id
                      && pending.model === shownChoice?.model.id && pending.reasoningEffort === level.effort
                      ? <StateDot state="ongoing" />
                      : level.label}
                  </button>
                )
              })}
            </div>
          </>}
        </MenuSurface>,
        document.body,
      )}
      {toast !== null && (
        <Toast
          key={toast.seq}
          text={toast.text}
          icon={<IconWarningOutlineRegular />}
          anchor={rootRef.current?.closest<HTMLElement>('[data-composer-card]') ?? null}
          onDone={() => { setToast(null) }}
        />
      )}
    </div>
  )
}
