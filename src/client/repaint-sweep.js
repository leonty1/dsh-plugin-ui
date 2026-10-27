/** First-paint repaint sweep. The rc.3 renderer can drop the conversation
 * column's plain-text raster on its first paint — chips, KaTeX and other
 * own-layer elements keep rendering while body text vanishes wholesale, and
 * the window stays broken while nothing schedules a frame (verified live
 * 2026-10-27 via reload + CDP: chips empty, paragraphs gone, one 1px scroll
 * round-trip healed it and the heal held through 30s of idle). The sweep
 * nudges the scroller at boot and after content changes; the ±1px round trip
 * happens inside a single task, so it never paints and never jumps. */

const SCROLLER = '[data-conversation-scroll]'
const REGION = '[class*="_regionArea"]'

/** Scroll an element 1px and back within one task. At the scroll edge the
 * first write clamps to no change, so fall back to the other direction to
 * guarantee a real position change — that change is what re-rasters. */
function nudge(el) {
  if (!el) return
  const y = el.scrollTop
  el.scrollTop = y + 1
  if (el.scrollTop === y) el.scrollTop = Math.max(0, y - 1)
  el.scrollTop = y
}

/**
 * Schedule the sweeps and watch for later content changes.
 * @returns the disposer that clears every timer and observer.
 */
export function installRepaintSweep() {
  const timers = []
  let disposed = false
  let pending = 0
  let last = 0
  const sweep = () => {
    last = Date.now()
    nudge(document.querySelector(SCROLLER))
    nudge(document.querySelector(REGION))
  }
  // Boot retries: the scroller and the session content mount late, and the
  // drop lands at first paint — sweep a few times before assuming health.
  for (const delay of [2000, 6000, 12000, 25000]) {
    timers.push(setTimeout(() => { if (!disposed) sweep() }, delay))
  }
  // Session switches and streamed tokens can drop text again after boot;
  // debounce mutations and keep the sweep to at most one per 1.5s.
  const observer = new MutationObserver(() => {
    if (disposed || Date.now() - last < 1500) return
    clearTimeout(pending)
    pending = setTimeout(() => { if (!disposed) sweep() }, 800)
  })
  const attach = () => {
    if (disposed) return
    if (document.body) observer.observe(document.body, { childList: true, subtree: true })
    else timers.push(setTimeout(attach, 1000))
  }
  attach()
  return () => {
    disposed = true
    for (const timer of timers) clearTimeout(timer)
    clearTimeout(pending)
    observer.disconnect()
  }
}
