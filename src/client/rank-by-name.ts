/**
 * Local replacement for the `rankByName` helper that the host primitives
 * bundle stopped exporting in DSH 0.2.3 (the official picker moved to a fuzzy
 * scorer that is not exported either). The plugin keeps this dependency-free
 * rank so the composer seat preserves its own ordering semantics without
 * reaching into a host internal.
 */

/** Anything the menu ranks carries a display name and a stable id. */
type Named = { readonly name?: string; readonly id: string }

/**
 * Order entries by how well their name matches the query, dropping the ones
 * that do not match at all. An empty query keeps the input order untouched.
 * @param items - Entries in display order; ranked by `name` (falling back to `id`).
 * @param query - Search text, compared case-insensitively.
 * @returns a new array of the matching entries, best match first.
 */
export function rankByName<T extends Named>(items: readonly T[], query: string): T[] {
  const needle = query.trim().toLowerCase()
  if (needle === '') return [...items]
  const scored: Array<{ item: T; rank: number; index: number }> = []
  for (let index = 0; index < items.length; index++) {
    const item = items[index]!
    const name = (item.name ?? item.id).toLowerCase()
    const rank = matchRank(name, needle)
    if (rank !== null) scored.push({ item, rank, index })
  }
  return scored
    .toSorted((left, right) => left.rank - right.rank || left.index - right.index)
    .map(entry => entry.item)
}

/**
 * Rank a single name against the needle: 0 for a prefix, 1 for a match right
 * after a word boundary, 2 for any other substring, and `null` for no match.
 */
function matchRank(name: string, needle: string): number | null {
  const at = name.indexOf(needle)
  if (at === -1) return null
  if (at === 0) return 0
  if (/[\s\-_./·]/.test(name[at - 1] ?? '')) return 1
  return 2
}
