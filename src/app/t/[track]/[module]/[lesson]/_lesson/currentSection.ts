/**
 * Which section the reader is in, given where each heading currently sits.
 *
 * Pure and separate from the component on purpose. The rail's behaviour cannot be exercised in a
 * headless pane — a page the compositor never paints dispatches no `scroll` events, and both
 * `requestAnimationFrame` and `IntersectionObserver` stay suspended there — so the part that can be
 * wrong is tested here instead, and the component keeps nothing but the listener.
 *
 * `tops` are viewport-relative heading offsets in document order, the way
 * `getBoundingClientRect().top` returns them: positive below the line, negative once scrolled past.
 */
export function currentSection(tops: number[], line: number): number {
  if (tops.length === 0) return -1;
  let current = 0;
  for (let i = 0; i < tops.length; i += 1) {
    if (tops[i] <= line) current = i;
    // Headings are in document order, so the first one still below the line ends the search.
    else break;
  }
  return current;
}

/** The line headings are measured against: a little below the top of the viewport. */
export const SECTION_LINE = 0.28;
