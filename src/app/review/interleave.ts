import type { ReviewItem } from './types';

/**
 * Deterministic round-robin. Repeatedly takes from the largest remaining bucket whose key differs
 * from the one just taken, so consecutive items come from different units wherever the queue allows.
 * Deterministic on purpose: no Math.random, so the same queue orders the same way on server and client.
 */
export function spread<T>(items: T[], keyOf: (item: T) => string): T[] {
  const buckets = new Map<string, T[]>();
  for (const item of items) {
    const key = keyOf(item) || '·';
    const bucket = buckets.get(key);
    if (bucket) bucket.push(item);
    else buckets.set(key, [item]);
  }

  const out: T[] = [];
  let last: string | null = null;
  while (out.length < items.length) {
    const live = [...buckets.entries()].filter(([, v]) => v.length).map(([k]) => k);
    if (!live.length) break;
    live.sort((a, b) => {
      const diff = (buckets.get(b)?.length ?? 0) - (buckets.get(a)?.length ?? 0);
      return diff !== 0 ? diff : a.localeCompare(b);
    });
    const pick = live.find((k) => k !== last) ?? live[0];
    const bucket = buckets.get(pick);
    if (!bucket?.length) break;
    out.push(bucket.shift() as T);
    last = pick;
  }
  return out;
}

/**
 * Interleaving, section 11: the queue deliberately mixes concepts across tracks rather than
 * blocking by unit. Modules are spread inside each track first, then the tracks themselves are
 * spread, so you rarely get two items from the same module — or the same track — back to back.
 *
 * This costs fluency in the moment and buys retention and transfer. The UI says so out loud, once.
 */
export function interleave(items: ReviewItem[]): ReviewItem[] {
  const byTrack = new Map<string, ReviewItem[]>();
  for (const item of items) {
    const list = byTrack.get(item.trackId);
    if (list) list.push(item);
    else byTrack.set(item.trackId, [item]);
  }
  const evened: ReviewItem[] = [];
  for (const [, list] of byTrack) evened.push(...spread(list, (i) => i.moduleId));
  return spread(evened, (i) => i.trackId);
}

/** How many distinct tracks the queue draws from — nothing to interleave when it is 1. */
export function trackCount(items: ReviewItem[]): number {
  return new Set(items.map((i) => i.trackId)).size;
}
