/**
 * Runs a strict type check over the client sources.
 *
 * The plugin has no local `typescript` dependency — esbuild only strips types,
 * so nothing in the normal build ever proves they line up. This wrapper finds
 * the compiler in the checkout that owns the types (`@deepseek-ai/*` packages
 * are resolved from there too) or in the local node_modules, and runs it with
 * the repo's tsconfig.
 */
import { createRequire } from 'node:module'
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))

/** Probe order: the local install first, then the host checkout that owns the types. */
const ROOTS = [
  root,
  process.env.DSH_CHECKOUT ?? '/Users/tongyi/dsh-lty',
]

/** @returns the tsc entry point, or undefined when no TypeScript install is reachable. */
function findTsc() {
  for (const base of ROOTS) {
    const require = createRequire(join(base, 'noop.js'))
    try {
      return require.resolve('typescript/bin/tsc')
    } catch { /* try the next root */ }
    const flat = join(base, 'node_modules', 'typescript', 'bin', 'tsc')
    if (existsSync(flat)) return flat
  }
  return undefined
}

const tsc = findTsc()
if (tsc === undefined) {
  console.error('typecheck: no TypeScript install found; checked', ROOTS.join(', '))
  process.exit(1)
}
execFileSync(process.execPath, [tsc, '--noEmit', '--project', join(root, 'tsconfig.json')], {
  stdio: 'inherit',
  cwd: root,
})
console.log('typecheck: OK')
