/**
 * Indexes the concept page needs that the shared content API does not expose:
 * the full concept id list, practices per concept, and the authored sibling order
 * inside a home module.
 *
 * Built once per process from the public loader, memoised, server-only.
 */
import { allTracks, getConcept, getModulesOf, getPracticesOf, getTrack } from '@/lib/content/load';

export interface Derived {
  /** Every concept id in the corpus, in track > module > authored order. */
  conceptIds: string[];
  /** conceptId -> practice ids that exercise it. */
  practices: Map<string, string[]>;
  /** moduleId -> concept ids homed there, in authored order. */
  homeOrder: Map<string, string[]>;
}

let cache: Derived | null = null;

export function derived(): Derived {
  if (cache) return cache;

  const conceptIds: string[] = [];
  const homeOrder = new Map<string, string[]>();
  const practices = new Map<string, string[]>();
  const seen = new Set<string>();

  for (const track of allTracks()) {
    for (const mod of getModulesOf(track.id)) {
      const homed: string[] = [];
      for (const id of mod.teaches ?? []) {
        if (seen.has(id)) continue;
        seen.add(id);
        conceptIds.push(id);
        if (getConcept(id)?.moduleId === mod.id) homed.push(id);
      }
      homeOrder.set(mod.id, homed);

      for (const p of getPracticesOf(mod.id)) {
        for (const id of p.concepts ?? []) {
          const list = practices.get(id) ?? [];
          list.push(p.id);
          practices.set(id, list);
        }
      }
    }
  }

  cache = { conceptIds, practices, homeOrder };
  return cache;
}

/** Previous / next concept inside the same home module, in authored order. */
export function conceptSiblings(conceptId: string, moduleId: string) {
  const order = derived().homeOrder.get(moduleId) ?? [];
  const i = order.indexOf(conceptId);
  return {
    prev: i > 0 ? order[i - 1] : null,
    next: i >= 0 && i < order.length - 1 ? order[i + 1] : null,
  };
}

export function trackTitle(trackId: string): string {
  return getTrack(trackId)?.title ?? trackId;
}
