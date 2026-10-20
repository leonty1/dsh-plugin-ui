/** The two configurable quick-action seats at the right edge of the sidebar account row. */
import { defineStore } from '@deepseek-ai/dsh-client-store'

/** Quick action one seat can carry; null leaves the seat empty. */
export const QUICK_ACTION_CHOICES = ['settings', null]

/** Storage key carrying the seat pair, persisted whole by the store. */
export const QUICK_ACTIONS_PERSIST = 'dsh-plugin-ui.quick-actions.v1'

/** The right seat defaults to Settings; the left seat stays an empty placeholder. */
export const DEFAULT_QUICK_ACTIONS = [null, 'settings']

/**
 * Declares the quick-action seat state, persisted to localStorage.
 * @returns the store handle shared by the sidebar row and the settings page.
 */
export function createQuickActionsStore() {
  return defineStore({
    init: () => ({ seats: [...DEFAULT_QUICK_ACTIONS] }),
    persist: QUICK_ACTIONS_PERSIST,
    actions: {
      setSeat: (draft, index, id) => {
        draft.seats[index] = id
      },
    },
  })
}
