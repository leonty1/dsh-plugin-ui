/**
 * Fails on free variables in the client sources.
 *
 * tsconfig.json only includes *.ts/*.tsx, so the .jsx components — where every
 * render path in this plugin lives — were never type-checked. Two shipped bugs
 * (`groundState` read outside its scope, then `ground` read inside
 * quickSettingsView without being a parameter) each threw a ReferenceError
 * during render, unmounted the account row, and took the settings gear with
 * it. Neither was visible to tsc, esbuild, or the skin contract.
 *
 * This runs the same compiler with checkJs over the .jsx sources and fails on
 * exactly two diagnostic codes — TS2304 (Cannot find name) and TS2552 (Cannot
 * find name, did you mean) — which is the entire class of those bugs. Every
 * other diagnostic is reported as a count but does not fail the run, because
 * the jsx sources carry pre-existing noise (@deepseek-ai modules without
 * declarations, JSDoc nits) that is unrelated to scope.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const ROOTS = [root, process.env.DSH_CHECKOUT ?? '/Users/tongyi/dsh-lty']

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
  console.error('check-scope: no TypeScript install found; checked', ROOTS.join(', '))
  process.exit(1)
}

// A throwaway project that widens the repo's settings to the jsx sources while
// keeping its paths/lib, so module resolution matches the real typecheck.
const scratch = mkdtempSync(join(tmpdir(), 'dpui-scope-'))
const project = join(scratch, 'tsconfig.json')
writeFileSync(project, JSON.stringify({
  extends: join(root, 'tsconfig.json'),
  compilerOptions: {
    allowJs: true,
    checkJs: true,
    strict: false,
    noImplicitAny: false,
    noEmit: true,
  },
  include: [
    join(root, 'src', 'client', '**', '*.jsx'),
    join(root, 'src', 'client', '**', '*.js'),
    join(root, 'types', '*.d.ts'),
  ],
}, null, 2))

let output = ''
try {
  output = execFileSync(process.execPath, [tsc, '--noEmit', '--project', project], {
    cwd: root,
    encoding: 'utf8',
  })
} catch (error) {
  output = `${error.stdout ?? ''}${error.stderr ?? ''}`
} finally {
  rmSync(scratch, { recursive: true, force: true })
}

const diagnostics = output.split('\n').filter(line => /error TS\d+/.test(line))
const scopeErrors = diagnostics.filter(line => /error TS(?:2304|2552)/.test(line))

if (scopeErrors.length > 0) {
  for (const line of scopeErrors) console.error(`FAIL: ${line.replace(`${root}/`, '')}`)
  console.error(`check-scope: ${scopeErrors.length} unresolved identifier(s) — a free variable here throws at render and unmounts the component`)
  process.exit(1)
}

const other = diagnostics.length
console.log(other === 0
  ? 'check-scope: OK (jsx sources are scope-clean)'
  : `check-scope: OK (no free variables; ${other} unrelated diagnostic(s) ignored)`)
