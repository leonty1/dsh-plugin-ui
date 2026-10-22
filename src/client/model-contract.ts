/** Injected face the composer model seat reads from the Host's shared model directory. */
import type { ModelDirectoryState } from '@deepseek-ai/dsh-client-ui-model-selection/client'
import type { ModelSelection, RemoteResult } from '@deepseek-ai/dsh-api-remotes/client'

/** A snapshot store is the minimal face useSyncExternalStore needs. */
interface SnapshotStore<T> {
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => T
}

export interface ModelSelectInjected {
  available: boolean
  directory: SnapshotStore<ModelDirectoryState>
  load: () => void
  select: (selection: ModelSelection) => Promise<RemoteResult<void> | undefined>
}
