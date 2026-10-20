/** Sidebar account launcher: identity row, quick-action seats, quick settings, and sign-in/out. */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import {
  Button, IconCloseOutlineRegular, IconEllipsisOutlineMedium, IconLoadingOutlineRegular,
  IconPaperPlaneOutlineMedium, IconSettingsOutlineMedium, IconUserOutlineMedium, Menu, Modal, Tooltip,
} from '@deepseek-ai/dsh-client-ui-primitives'
import { applyQuickSetting, quickSettingsItems, quickSettingsView } from './quick-settings.jsx'
import { BUILTIN_QUICK_ACTIONS, QUICK_ACTION_SLOT } from './quick-actions.js'
import { builtinQuickActionIcon } from './quick-actions-catalog.jsx'
import css from './account.module.css'

/** Build the small account state store shared by the launcher and its dialogs. */
export function createAccountStore(ctx) {
  let snapshot = { view: undefined, profile: undefined, failed: false }
  let revision = 0
  let disposed = false
  const listeners = new Set()
  const publish = next => {
    snapshot = next
    for (const listener of listeners) listener()
  }
  const client = () => ({
    version: '0.1.0',
    locale: ctx.locale.getSnapshot().active,
    timezoneOffsetSeconds: -new Date().getTimezoneOffset() * 60,
  })
  const refresh = async () => {
    if (snapshot.view?.status !== 'credential-stored') return
    const generation = revision
    try {
      const result = await ctx.remote.account.getProfile(client())
      if (disposed || generation !== revision) return
      if (result.ok) publish({ ...snapshot, profile: result.value })
    } catch {
      // The launcher keeps the signed-in label; the detail read is best effort.
    }
  }
  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    refresh,
    start() {
      const stream = ctx.remote.$stream({
        name: 'account',
        open: signal => ctx.remote.account.watch(signal),
        ended: () => new Error('account stream ended'),
      })
      ctx.effect(() => () => { disposed = true; return stream.dispose() }, 'dsh-plugin-ui: account stream')
      void (async () => {
        for await (const frame of stream) {
          revision += 1
          publish({ view: frame.value, profile: undefined, failed: false })
          frame.accept()
          void refresh()
        }
      })().catch(() => {
        if (!disposed) publish({ ...snapshot, failed: true })
      })
    },
    async signIn() {
      const transport = globalThis.__DSH_TRANSPORT__
      const origin = transport?.streamBaseUrl !== undefined
        ? new URL(transport.streamBaseUrl).origin
        : window.location.origin
      const result = await ctx.remote.account.startSignIn(client(), origin, 'desktop')
      if (!result.ok) throw new Error('account start failed')
    },
    async cancelSignIn(id) {
      const result = await ctx.remote.account.cancelSignIn(id)
      if (!result.ok) throw new Error('account cancel failed')
    },
    async hasRunningTasks() {
      const result = await ctx.remote.account.hasRunningAccountTasks()
      if (!result.ok) throw new Error('account task query failed')
      return result.value
    },
    async signOut() {
      const result = await ctx.remote.account.signOut(client())
      if (!result.ok) throw new Error('account sign out failed')
    },
  }
}

/** Read a store handle through React's external-store contract. */
function useSnapshot(store) {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
}

/** Follow theme and locale writes made anywhere in the app. */
function useQuickView(ctx) {
  const [view, setView] = useState(() => quickSettingsView(ctx))
  useEffect(() => {
    const update = () => { setView(quickSettingsView(ctx)) }
    update()
    const offTheme = ctx.on('theme/change', update)
    const offLocale = ctx.locale.subscribe(update)
    return () => { offTheme?.(); offLocale?.() }
  }, [ctx])
  return view
}

/** Account picture with the official icon fallback; a broken remote image falls back too. */
function Avatar({ url }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => { setFailed(false) }, [url])
  if (url !== undefined && url !== null && url !== '' && !failed) {
    return <img className={css.avatarImage} src={url} alt="" onError={() => { setFailed(true) }} />
  }
  return <IconUserOutlineMedium size={16} />
}

/** Official sign-out glyph: a door with an arrow leaving it. */
function LogoutIcon() {
  return <span style={{ width: 16, height: 16, position: 'relative' }} aria-hidden="true">
    <svg style={{ position: 'absolute', left: 1.168, top: 1.214 }} width="13.664" height="13.571"
      viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.9961 1.40039C3.37842 1.40039 2.96028 1.40039 2.63867 1.42871C2.32631 1.45627 2.17171 1.50666 2.06641 1.56543C1.85606 1.68288 1.68189 1.85605 1.56446 2.06641C1.50569 2.17173 1.45625 2.32627 1.42871 2.63867C1.40036 2.9603 1.39942 3.37827 1.39942 3.9961L1.39942 9.5752C1.39942 10.193 1.40036 10.611 1.42871 10.9326C1.45625 11.245 1.50569 11.3996 1.56445 11.5049C1.68188 11.7153 1.85605 11.8884 2.06641 12.0059C2.17171 12.0646 2.32631 12.115 2.63867 12.1426C2.96028 12.1709 3.37842 12.1709 3.9961 12.1709V13.5713C3.4033 13.5713 2.91297 13.5721 2.51563 13.5371C2.10906 13.5013 1.73277 13.4233 1.38379 13.2285C0.946838 12.9845 0.585697 12.6235 0.341799 12.1865C0.14725 11.8377 0.0700118 11.4621 0.0341815 11.0557C-0.000847399 10.6583 1.58129e-06 10.1681 1.85029e-06 9.5752L2.09416e-06 3.9961C1.83027e-06 3.40325 -0.000846367 2.91297 0.0341818 2.51563C0.0700164 2.10924 0.147239 1.73362 0.341799 1.38477C0.585703 0.947758 0.946825 0.586744 1.38379 0.342775C1.73277 0.148001 2.10906 0.0700381 2.51563 0.0341813C2.91297 -0.000823893 3.40331 1.37805e-06 3.9961 1.71712e-06L3.9961 1.40039Z" fill="currentColor" />
      <path d="M13.6426 6.51953C13.6705 6.6957 13.6705 6.8756 13.6426 7.05176C13.5902 7.38188 13.4302 7.64112 13.2539 7.86035C13.0857 8.06937 12.8546 8.29971 12.6006 8.55371L9.3086 11.8447L8.31836 10.8545L11.6104 7.56348C11.637 7.53681 11.6628 7.51104 11.6875 7.48633H3.74317V6.08594H11.6885C11.6635 6.06088 11.6374 6.03487 11.6104 6.00781L8.31836 2.7168L9.3086 1.72656L12.6006 5.01758C12.8547 5.27169 13.0857 5.50185 13.2539 5.71094C13.4303 5.93018 13.5902 6.18939 13.6426 6.51953Z" fill="currentColor" />
    </svg>
  </span>
}

/**
 * One configurable seat: the quick-settings menu, a built-in action, an
 * external slot contribution, or an empty column.
 */
function QuickActionSeat({ seat, t, view, onQuickSelect, onAllSettings, onBuiltin, renderSlot }) {
  const [open, setOpen] = useState(false)
  if (seat === null || seat === undefined) {
    return <span className={css.seatSpacer} aria-hidden="true" />
  }
  if (seat === 'settings') {
    return <Menu open={open} side="top" align="end" portal autoFocus
      listClassName={css.list}
      items={quickSettingsItems(view, t)}
      onClose={() => { setOpen(false) }}
      onSelect={(id) => {
        if (id === 'all-settings') { setOpen(false); onAllSettings() }
        else onQuickSelect(id)
      }}
      anchor={<button type="button" className={css.seat} aria-label={t('account.settingsAction')}
        aria-haspopup="menu" aria-expanded={open}
        onClick={() => { setOpen(value => !value) }}>
        <span className={css.seatIcon}><IconSettingsOutlineMedium size={14} /></span>
      </button>} />
  }
  const builtin = BUILTIN_QUICK_ACTIONS.find(action => action.id === seat)
  if (builtin !== undefined) {
    const label = t(builtin.labelKey)
    return <Tooltip label={label} side="top" align="end" delayMs={500} portal>
      <button type="button" className={css.seat} aria-label={label} onClick={() => { onBuiltin(seat) }}>
        <span className={css.seatIcon}>{builtinQuickActionIcon(seat)}</span>
      </button>
    </Tooltip>
  }
  return <span className={css.externalSeat} data-quick-action={seat}>
    {renderSlot?.(QUICK_ACTION_SLOT, { size: 14 }, { only: seat })}
  </span>
}

/** The seat pair; each seat owns its menu so two settings seats stay independent. */
function QuickActionsRow({ seats, ...seatProps }) {
  return <span className={css.seats}>
    {seats.map((seat, index) => <QuickActionSeat key={index} seat={seat} {...seatProps} />)}
  </span>
}

/** Copy-link sign-in dialog over the live account attempt. */
function SignInDialog({ t, account, store, close }) {
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const [copyResult, setCopyResult] = useState(null)
  const attempt = account.view?.attempt
  const phase = attempt?.phase
  const active = busy || phase === 'initializing' || phase === 'waiting-browser'
    || phase === 'exchanging' || phase === 'committing'
  const waiting = active && !failed
  const expired = phase === 'expired'
  const error = failed || phase === 'failed'
  useEffect(() => { setCopyResult(null) }, [attempt?.id, attempt?.authorizeUrl])
  useEffect(() => {
    if (copyResult === null) return
    const timer = setTimeout(() => { setCopyResult(null) }, 2000)
    return () => { clearTimeout(timer) }
  }, [copyResult])
  useEffect(() => {
    if (account.view?.status === 'credential-stored') close()
  }, [account.view?.status, close])
  const run = async action => {
    setBusy(true)
    setFailed(false)
    try { await action() } catch { setFailed(true) } finally { setBusy(false) }
  }
  const dismiss = () => {
    if (busy || phase === 'committing') return
    if (active && attempt !== undefined) void run(async () => { await store.cancelSignIn(attempt.id); close() })
    else close()
  }
  const retry = async () => {
    if (active && attempt !== undefined) await store.cancelSignIn(attempt.id)
    await store.signIn()
  }
  const copyLink = async url => {
    try {
      await navigator.clipboard.writeText(url)
      setCopyResult(t('account.copied'))
    } catch { setCopyResult(t('account.copyFailed')) }
  }
  const title = error ? t('account.failed') : active ? t('account.waitingTitle')
    : expired ? t('account.expired') : t('account.signInTitle')
  const authorizeUrl = attempt?.authorizeUrl
  return <Modal open headless title={title} onClose={dismiss} className={css.dialog}>
    <div className={css.dialogContent}>
      <div className={css.dialogHeader}>
        <h2 className={css.dialogTitle}>{title}</h2>
        <button type="button" className={css.dialogClose} aria-label={t('account.close')} onClick={dismiss}>
          <IconCloseOutlineRegular size={14} />
        </button>
      </div>
      <p className={css.dialogDescription}>
        {waiting
          ? <>{t('account.waiting')}{authorizeUrl !== undefined && <>
            {' '}<button type="button" className={css.link}
              onClick={() => { void copyLink(authorizeUrl) }}>
              {copyResult ?? t('account.copyLink')}
            </button>
          </>}</>
          : error ? t('account.failed') : expired ? t('account.expired') : t('account.signInDescription')}
      </p>
    </div>
    <div className={css.dialogActions}>
      <Button variant="outline" className={css.secondaryButton} disabled={busy || phase === 'committing'}
        onClick={dismiss}>{t('account.cancel')}</Button>
      <Button variant="primary" className={css.primaryButton}
        disabled={busy || phase === 'committing' || waiting}
        onClick={() => { void run(retry) }}>
        {waiting ? <IconLoadingOutlineRegular className={css.spinner} /> : t(error || expired ? 'account.retry' : 'account.signIn')}
      </Button>
    </div>
  </Modal>
}

/** Confirmation for a sign-out that may interrupt running tasks. */
function SignOutDialog({ t, running, busy, close, confirm }) {
  return <Modal open headless title={t('account.signOutTitle')} onClose={close} className={css.dialog}>
    <div className={css.dialogContent}>
      <div className={css.dialogHeader}>
        <h2 className={css.dialogTitle}>{t('account.signOutTitle')}</h2>
        <button type="button" className={css.dialogClose} aria-label={t('account.close')} onClick={close}>
          <IconCloseOutlineRegular size={14} />
        </button>
      </div>
      <p className={css.dialogDescription}>
        {running === 'unknown' ? t('account.signOutUnknown')
          : running ? t('account.signOutRunning') : t('account.signOutDescription')}
      </p>
    </div>
    <div className={css.dialogActions}>
      <Button variant="outline" className={css.secondaryButton} disabled={busy} onClick={close}>{t('account.cancel')}</Button>
      <Button variant="primary" className={css.primaryButton} disabled={busy}
        onClick={() => { void confirm() }}>{t('account.signOut')}</Button>
    </div>
  </Modal>
}

/**
 * The sidebar account launcher replacing the official one while this plugin is
 * active. Signed-out and signed-in states share one identity row; the avatar
 * menu carries the official items, and quick settings live on the gear seat.
 */
export function AccountMenu({
  t, ctx, useStore, actions, wide, settingsShortcut, openSettings, accountStore, settingsOpen,
  uiWorkspace, layout, renderSlot,
}) {
  const seats = useStore(state => state.seats)
  const account = useSnapshot(accountStore)
  const view = useQuickView(ctx)
  const anchor = useRef(null)
  const trigger = useRef(null)
  const [open, setOpen] = useState(false)
  const [loginVisible, setLoginVisible] = useState(false)
  const [signOutState, setSignOutState] = useState(undefined)
  const [busy, setBusy] = useState(false)
  const signedIn = account.view?.status === 'credential-stored'
  const profile = account.profile
  const name = profile?.status === 'ready' ? profile.value.name ?? profile.value.contact ?? null : null
  const label = signedIn ? (profile === undefined ? null : name ?? t('account.signedIn')) : t('account.more')
  const settingsWasOpen = useRef(false)
  useEffect(() => {
    if (settingsOpen && !settingsWasOpen.current) void accountStore.refresh()
    settingsWasOpen.current = settingsOpen
  }, [accountStore, settingsOpen])
  const quickSelect = id => { applyQuickSetting(ctx, id) }
  const openSettingsPage = () => {
    setOpen(false)
    queueMicrotask(() => { trigger.current?.focus({ preventScroll: true }) })
    openSettings()
  }
  const runBuiltin = id => {
    if (id === 'new-session') { uiWorkspace?.startSession(); return }
    if (id === 'plugins') { layout?.selectPanel('plugins'); return }
    if (id === 'schedules') { layout?.selectPanel('schedules'); return }
    if (id === 'theme') {
      const scheme = ctx.theme.getTheme().active.colorScheme
      ctx.theme.setTheme(scheme === 'dark' ? 'light' : 'dark')
      return
    }
    if (id === 'sidebar') { layout?.toggleSidebar(); return }
    if (id === 'all-settings') openSettingsPage()
  }
  const requestSignOut = async () => {
    setOpen(false)
    setBusy(true)
    try {
      const running = await accountStore.hasRunningTasks()
      if (!running) {
        await accountStore.signOut()
        return
      }
      setSignOutState(true)
    } catch {
      setSignOutState('unknown')
    } finally {
      setBusy(false)
    }
  }
  const confirmSignOut = async () => {
    setBusy(true)
    try {
      await accountStore.signOut()
      setSignOutState(undefined)
    } catch {
      setSignOutState('unknown')
    } finally {
      setBusy(false)
    }
  }
  const openLink = url => { window.open(url, '_blank', 'noopener,noreferrer') }
  const contactUs = () => {
    const config = globalThis.__DSH_CONTACT_CONFIG__
    openLink(config?.contactFormUrl ?? 'https://github.com/deepseek-ai/deepseek-harness/issues/new/choose')
  }
  const items = [
    { id: 'settings', label: t('account.settings'), icon: <IconSettingsOutlineMedium size={16} />,
      ...(settingsShortcut === undefined ? {} : { shortcut: settingsShortcut }) },
    { id: 'contact', label: t('account.contact'), icon: <IconPaperPlaneOutlineMedium size={16} /> },
    ...(signedIn
      ? [{ id: 'signout', label: t('account.signOut'), icon: <LogoutIcon />, disabled: busy }]
      : [{ id: 'signin', label: t('account.signIn'), icon: <IconUserOutlineMedium size={16} /> }]),
  ]
  return <div ref={anchor} className={css.root}>
    <Menu open={open} side="top" portal autoFocus className={css.anchor}
      listClassName={signedIn ? undefined : css.signedOutMenu}
      anchor={<div className={css.triggerRow}>
        <button ref={trigger} type="button" className={css.trigger} data-collapsed={!wide} data-signed-out={!signedIn}
          aria-label={t('account.menu')} aria-haspopup="menu" aria-expanded={open}
          onClick={() => { setOpen(value => !value) }}>
          {signedIn
            ? <span className={css.avatar}>
              <Avatar url={profile?.status === 'ready' ? profile.value.avatarUrl : null} />
            </span>
            : <IconEllipsisOutlineMedium size={14} />}
          {wide && <span className={css.label}>{label}</span>}
        </button>
        {wide && <QuickActionsRow seats={seats} t={t} view={view} renderSlot={renderSlot}
          onQuickSelect={quickSelect} onAllSettings={openSettingsPage} onBuiltin={runBuiltin} />}
      </div>}
      items={items}
      onClose={() => { setOpen(false) }}
      onSelect={(id) => {
        if (id === 'settings') openSettingsPage()
        else if (id === 'contact') { setOpen(false); contactUs() }
        else if (id === 'signin') { setOpen(false); setLoginVisible(true); void accountStore.signIn().catch(() => undefined) }
        else if (id === 'signout') void requestSignOut()
      }} />
    {loginVisible && <SignInDialog t={t} account={account} store={accountStore} close={() => { setLoginVisible(false) }} />}
    {signOutState !== undefined && <SignOutDialog t={t} running={signOutState} busy={busy}
      close={() => { setSignOutState(undefined) }} confirm={confirmSignOut} />}
  </div>
}
