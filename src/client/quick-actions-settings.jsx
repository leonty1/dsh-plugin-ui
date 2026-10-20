/** General-settings rows for the two sidebar quick-action seats. */
import { useRef, useState } from 'react'
import { IconChevronDownOutlineRegular, Menu } from '@deepseek-ai/dsh-client-ui-primitives'
import css from './quick-actions-settings.module.css'

/** One seat's row: its current action, its localized labels, and where a choice lands. */
function SeatRow({ seat, title, description, labels, onSelect }) {
  const [open, setOpen] = useState(false)
  const pill = useRef(null)
  const labelFor = id => id === 'settings' ? labels.settings : labels.empty
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
      items={[{ id: 'settings', label: labels.settings }, { id: '', label: labels.empty }]}
      onSelect={chosen} anchor={anchor} />
  </div>
}

/**
 * Configure the two quick-action seats; the sidebar row reads the same store,
 * so a change lands there immediately.
 */
export function QuickActionsSettings({ t, useStore, actions }) {
  const seats = useStore(state => state.seats)
  return <>
    {seats.map((seat, index) => <SeatRow
      key={index}
      seat={seat ?? null}
      title={t('account.quickActionSeat', { index: index + 1 })}
      description={t('account.quickActionSeatDescription', { index: index + 1 })}
      labels={{ settings: t('account.settingsChoice'), empty: t('account.emptyChoice') }}
      onSelect={next => { actions.setSeat(index === 0 ? 0 : 1, next) }}
    />)}
  </>
}
