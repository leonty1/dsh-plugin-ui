/** Ambient module shapes for the client bundle's untyped imports. */

/** esbuild loader hands CSS modules a class-name map. */
declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

/** The minimal class joiner lives in plain JS. */
declare module '*/clsx.js' {
  export default function clsx(...parts: unknown[]): string
}

/**
 * The dictionary module lives in plain JS with a JSDoc `ModelKey` typedef;
 * `allowJs` would pull the whole file into the program, so restate the one
 * exported type here instead. Keep in sync with src/client/locales.js.
 */
declare module '*/locales.js' {
  export type ModelKey =
    | 'provider.account' | 'command.label' | 'command.description' | 'option.loadError'
    | 'trigger.fallback' | 'trigger.loading' | 'trigger.selectAria' | 'trigger.aria'
    | 'trigger.ariaEffort' | 'menu.aria' | 'menu.model' | 'menu.effort'
    | 'effort.providerDefault' | 'effort.off' | 'effort.none' | 'effort.minimal'
    | 'effort.low' | 'effort.medium' | 'effort.high' | 'effort.max'
    | 'effort.hint.off' | 'effort.hint.none' | 'effort.hint.minimal' | 'effort.hint.low'
    | 'effort.hint.medium' | 'effort.hint.high' | 'effort.hint.max'
    | 'status.loading' | 'error.action' | 'error.sessionInUse'
    | 'action.reload' | 'retry' | 'warning.groupLoad'
    | 'search.placeholder' | 'search.clear' | 'search.empty' | 'empty.models'
}
