/** Injected face the composer model seat reads from the Host's shared model directory. */
export interface ModelSelectInjected {
  available: boolean
  directory: {
    subscribe: (listener: () => void) => () => void
    getSnapshot: () => any
  }
  load: () => void
  select: (selection: any) => Promise<any>
}
