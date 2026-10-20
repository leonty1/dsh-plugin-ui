/** General-settings rows for the two sidebar quick-action seats. */
import { useMemo, useRef, useState } from 'react'
import { IconChevronDownOutlineRegular, Menu } from '@deepseek-ai/dsh-client-ui-primitives'
import { quickActionLabel, useQuickActionCatalog } from './quick-actions-catalog.jsx'
import css from './quick-actions-settings.module.css'

/** One seat's row: its current action, the live catalog, and where a choice lands. */
function SeatRow({ seat, title, description, items, labelFor, onSelect }) {
  const [open, setOpen] = useState(false)
  const pill = useRef(null)
  const chosen = id => {
    pill.current?.focus({ preventScroll: true })
    setOpen(false)
    onSelect(id === '' ? null : id)
  }
  const anchor = <button ref={pill} type="button" className={css.selector}
    aria-haspopup="menu" aria-expanded={open}
    onClick={() => { setOpen(value => !value) }}>
    {labelFor(seat)}
    <IconChevronDownOutlineRegular className={css.chevron} />
  </button>
  return <div className={css.row}>
    <div className={css.rowText}>
      <div className={css.title}>{title}</div>
      <div className={css.desc}>{description}</div>
    </div>
    <Menu open={open} onClose={() => { setOpen(false) }} align="end" portal
      items={items} onSelect={chosen} anchor={anchor} />
  </div>
}

/**
 * Configure the two quick-action seats. Built-in actions and list-slot
 * contributions from installed client plugins share one catalog; the sidebar
 * row reads the same store, so a change lands there immediately.
 */
export function QuickActionsSettings({ t, useStore, actions, ctx }) {
  const seats = useStore(state => state.seats)
  const catalog = useQuickActionCatalog(ctx, t)
  const items = useMemo(() => {
    const builtins = catalog.filter(action => action.builtin)
    const external = catalog.filter(action => !action.builtin)
    return [
      ...builtins.map(action => ({ id: action.id, label: action.label })),
      ...(external.length === 0 ? [] : [
        { type: 'label', id: 'account.quickActionExternal', text: t('account.quickActionExternal') },
        ...external.map(action => ({ id: action.id, label: action.label })),
      ]),
      { id: '', label: t('account.emptyChoice') },
    ]
  }, [catalog, t])
  const labelFor = seat => seat === null ? t('account.emptyChoice') : quickActionLabel(seat, catalog, t)
  return <>
    {seats.map((seat, index) => <SeatRow
      key={index}
      seat={seat ?? null}
      title={t('account.quickActionSeat', { index: index + 1 })}
      description={t('account.quickActionSeatDescription', { index: index + 1 })}
      items={items}
      labelFor={labelFor}
      onSelect={next => { actions.setSeat(index === 0 ? 0 : 1, next) }}
    />)}
  </>
}
