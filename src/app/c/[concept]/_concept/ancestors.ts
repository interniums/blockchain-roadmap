/**
 * Which concepts a passing review of this one could credit, read straight off the graph.
 *
 * Mirrors the scheduler's rule (requires|deepens, depth ≤ 2) so the page can say something
 * true when a review credits nothing: "it stands on nothing" and "none of them are in your
 * review system yet" are different facts, and only the graph knows which one applies.
 *
 * Server-only: it walks the content graph.
 */
import { getConcept } from '@/lib/content/load';

export const CREDIT_DEPTH = 2;

export function creditAncestors(rootId: string, maxDepth = CREDIT_DEPTH): string[] {
  const out: string[] = [];
  const seen = new Set<string>([rootId]);
  let frontier = [rootId];

  for (let depth = 1; depth <= maxDepth; depth++) {
    const next: string[] = [];
    for (const id of frontier) {
      const c = getConcept(id);
      if (!c) continue;
      const up = [
        ...c.requires,
        ...c.related.filter((e) => e.type === 'deepens').map((e) => e.to),
      ];
      for (const to of up) {
        if (seen.has(to)) continue;
        seen.add(to);
        out.push(to);
        next.push(to);
      }
    }
    frontier = next;
    if (frontier.length === 0) break;
  }
  return out;
}

/** Every concept id this page names, deduped — one batched `masteryFor` covers the screen. */
export function scopeIdsFor(conceptId: string, ids: string[]): string[] {
  return [...new Set([conceptId, ...ids, ...creditAncestors(conceptId)])];
}

/** id -> title for everything in scope. The client never loads the content graph. */
export function titlesFor(ids: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const id of ids) {
    const title = getConcept(id)?.title;
    if (title) out[id] = title;
  }
  return out;
}
