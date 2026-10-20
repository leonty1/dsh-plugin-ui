/**
 * Client entry: Qoder palette skin, the single-card model/effort seat, and —
 * in the Desktop renderer — the account row with quick settings.
 */
import { ModelSelect } from './ModelSelect.tsx'
import { AccountMenu, createAccountStore } from './account.jsx'
import { QuickActionsSettings } from './quick-actions-settings.jsx'
import { createQuickActionsStore, QUICK_ACTION_SLOT } from './quick-actions.js'
import { createPaletteController, PaletteSettings } from './palette.jsx'
import { en, modelEn, modelZh, zh } from './locales.js'

/** Services required for every face; account services are injected separately. */
export const inject = ['slots', 'locale', 'theme']

const UI_NS = 'plugin-ui'
const MODEL_NS = 'plugin-ui.model'

/**
 * Client plugin body.
 * @param ctx - client root context.
 */
export function apply(ctx) {
  ctx.effect(() => ctx.locale.register(UI_NS, { zh, en }), 'dsh-plugin-ui: dictionaries')
  ctx.effect(() => ctx.locale.register(MODEL_NS, { zh: modelZh, en: modelEn }),
    'dsh-plugin-ui: model dictionaries')

  const palette = createPaletteController(ctx)
  ctx.effect(() => palette.install(), 'dsh-plugin-ui: palette layer')
  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item', id: 'plugin-ui.palette', order: 10.5,
    locale: UI_NS, inject: () => ({ controller: palette, ctx }),
  }, PaletteSettings))

  // `remote.session` is required by the directory's own Host calls, which run
  // on this injecting context.
  ctx.inject(['slots', 'modelDirectories', 'sessions', 'remote', 'remote.session'], scope => {
    const models = scope.modelDirectories
    const sessions = scope.sessions
    scope.slots.inject('conversation.input.model', () => scope.slots.register({
      name: 'conversation.input.model', locale: MODEL_NS, priority: -1,
      inject: sessionId => {
        const directory = models.directoryFor(sessionId)
        const available = sessions.subagentAddress(sessionId) === undefined
        return {
          available,
          directory: directory.store,
          load: () => { if (available) directory.load().catch(() => { /* surfaced on the store */ }) },
          select: selection => available ? directory.select(selection) : Promise.resolve(undefined),
        }
      },
    }, ModelSelect))
  })

  // The account launcher only exists in the Desktop renderer; the Web shell
  // signs in through its own browser flow and keeps the official seat.
  if (!('dshDesktop' in globalThis)) return

  ctx.inject(['slots', 'remote', 'remote.account', 'uiWorkspace', 'layout'], scope => {
    const quickActions = createQuickActionsStore()
    const accountStore = createAccountStore(scope)
    accountStore.start()
    scope.slots.inject('settings.launcher', () => scope.slots.register({
      name: 'settings.launcher', locale: UI_NS, store: quickActions, priority: -1,
      children: { [QUICK_ACTION_SLOT]: { kind: 'list', scope: 'root' } },
      inject: () => ({
        ctx: scope, accountStore,
        uiWorkspace: scope.get('uiWorkspace'), layout: scope.get('layout'),
      }),
    }, AccountMenu))
    scope.slots.inject('settings.general.item', () => scope.slots.register({
      name: 'settings.general.item', id: 'plugin-ui.quick-actions', order: 12,
      locale: UI_NS, store: quickActions, inject: () => ({ ctx: scope }),
    }, QuickActionsSettings))
  })
}
