/** Sidebar account launcher: identity row, quick-action seats, quick settings, and sign-in/out. */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import {
  Button, IconClockOutlineMedium, IconCloseOutlineRegular, IconEllipsisOutlineMedium, IconLoadingOutlineRegular,
  IconPaperPlaneOutlineMedium, IconRightUpOutlineMedium, IconSettingsOutlineMedium,
  IconSlidersTwoOutlineMedium, IconUserOutlineMedium, Menu, Modal,
} from '@deepseek-ai/dsh-client-ui-primitives'
import { applyQuickSetting, quickSettingsItems, quickSettingsView } from './quick-settings.jsx'
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

/**
 * One of the two configurable seats. The settings seat opens the same quick
 * settings as the account menu; an empty seat keeps its column.
 */
function QuickActionsRow({ t, seats, view, onQuickSelect, onAllSettings }) {
  const [open, setOpen] = useState(false)
  return <span className={css.seats}>
    {seats.map((seat, index) => seat === 'settings'
      ? <Menu key={index} open={open} side="top" align="end" portal autoFocus
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
      : <span key={index} className={css.seatSpacer} aria-hidden="true" />)}
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
 * active. Signed-out and signed-in states share one identity row; quick
 * settings are available from the account menu and the gear seat.
 */
export function AccountMenu({
  t, ctx, useStore, actions, wide, settingsShortcut, openSettings, accountStore, settingsOpen,
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
  const allSettings = () => {
    setOpen(false)
    queueMicrotask(() => { trigger.current?.focus({ preventScroll: true }) })
    openSettings()
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
  const quick = quickSettingsItems(view, t)
  const items = [
    { type: 'label', id: 'quick-label', text: t('account.quickSettings') },
    ...quick.map(item => item.id === 'all-settings'
      ? { ...item, icon: <IconSlidersTwoOutlineMedium size={16} />, ...(settingsShortcut === undefined ? {} : { shortcut: settingsShortcut }) }
      : item),
    { type: 'separator', id: 'quick-end' },
    { id: 'contact', label: t('account.contact'), icon: <IconPaperPlaneOutlineMedium size={16} /> },
    { id: 'changelog', label: t('account.changelog'), icon: <IconClockOutlineMedium size={16} /> },
    { id: 'mobile', label: t('account.mobile'), icon: <IconRightUpOutlineMedium size={16} /> },
    { id: 'about', label: t('account.about'), icon: <IconRightUpOutlineMedium size={16} /> },
  ]
  return <div ref={anchor} className={css.root}>
    <Menu open={open} side="top" portal autoFocus listClassName={css.list} className={css.anchor}
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
        {wide && <QuickActionsRow t={t} seats={seats} view={view}
          onQuickSelect={quickSelect} onAllSettings={allSettings} />}
      </div>}
      items={items}
      footer={signedIn
        ? [{ id: 'signout', label: t('account.signOut'), icon: <IconUserOutlineMedium size={16} />, danger: true, disabled: busy }]
        : [{ id: 'signin', label: t('account.signIn'), icon: <IconUserOutlineMedium size={16} /> }]}
      onClose={() => { setOpen(false) }}
      onSelect={(id) => {
        if (id === 'all-settings') allSettings()
        else if (applyQuickSetting(ctx, id)) return
        else if (id === 'contact') { setOpen(false); openLink('https://github.com/deepseek-ai/deepseek-harness/issues/new/choose') }
        else if (id === 'changelog') { setOpen(false); openLink('https://deepseek-harness.github.io/deepseek-harness/changelog/') }
        else if (id === 'mobile' || id === 'about') { setOpen(false); openLink('https://github.com/deepseek-ai/deepseek-harness') }
        else if (id === 'signin') { setOpen(false); setLoginVisible(true); void accountStore.signIn().catch(() => undefined) }
        else if (id === 'signout') void requestSignOut()
      }} />
    {loginVisible && <SignInDialog t={t} account={account} store={accountStore} close={() => { setLoginVisible(false) }} />}
    {signOutState !== undefined && <SignOutDialog t={t} running={signOutState} busy={busy}
      close={() => { setSignOutState(undefined) }} confirm={confirmSignOut} />}
  </div>
}
