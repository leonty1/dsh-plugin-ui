/**
 * Palette-row glyphs: one thematic 16px mark per skin, drawn with the product
 * icon set's 1.3px current-color stroke so a palette choice sits beside the
 * light/dark/system glyphs without breaking their rhythm. “Original colors”
 * keeps the app's own palette, so it gets a contrast disc rather than a skin
 * motif.
 */

/** @type {Record<string, import('react').ReactNode>} */
const GLYPHS = {
  none: <>
    <circle cx="8" cy="8" r="6" />
    <path d="M8 2a6 6 0 0 1 0 12V2Z" fill="currentColor" stroke="none" />
  </>,
  /** Forest: a two-tier conifer, unmistakable even at 14px. */
  forest: <>
    <path d="M8 1.6 12 6.9H4L8 1.6Z" />
    <path d="M8 5.6 13.2 11.6H2.8L8 5.6Z" />
    <path d="M8 11.6v2.6" />
  </>,
  /** Mint: a sprig leaf with its stem, cool and herbal. */
  mint: <>
    <path d="M13.5 2.5C13.5 7.2 9.9 11 5.3 11c-1.5 0-2.8-1.2-2.8-2.7C2.5 4.4 7 2.5 13.5 2.5Z" />
    <path d="M12.6 3.4 3.2 12.8" />
  </>,
  /** Bee: a bee with wings, stripes, and antennae — the skin's literal mascot. */
  bee: <>
    <ellipse cx="8" cy="9.3" rx="2.8" ry="3.5" />
    <circle cx="8" cy="5" r="1.5" />
    <path d="M7.1 3.9 6.5 2.6M8.9 3.9 9.5 2.6" />
    <ellipse cx="5.3" cy="7.1" rx="2.3" ry="1.2" transform="rotate(-32 5.3 7.1)" />
    <ellipse cx="10.7" cy="7.1" rx="2.3" ry="1.2" transform="rotate(32 10.7 7.1)" />
    <path d="M5.6 8.6h4.8M6.3 10.9h3.4" />
  </>,
  /** Parchment: a page with a folded corner and two ruled lines. */
  parchment: <>
    <path d="M9.3 1.9H4.5a1.6 1.6 0 0 0-1.6 1.6v8.9a1.6 1.6 0 0 0 1.6 1.6h7a1.6 1.6 0 0 0 1.6-1.6V5.5L9.3 1.9Z" />
    <path d="M9.2 2.1v3.4h3.5" />
    <path d="M5 8.9h4.6M5 11.2h3" />
  </>,
}

/**
 * @param props.id - palette id or `none`.
 * @param props.size - rendered pixel size; the menu cell caps it at 14px.
 * @returns the row glyph, or nothing for an unknown palette id.
 */
export function PaletteIcon({ id, size = 14 }) {
  const glyph = GLYPHS[id]
  if (glyph === undefined) return null
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">{glyph}</svg>
}
