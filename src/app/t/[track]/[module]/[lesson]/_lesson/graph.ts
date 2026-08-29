import { getConcept, getModule, getTrack } from '@/lib/content/load';
import type { ConceptView, Source } from '@/lib/content/types';

/**
 * Turning ids into things a reader can act on. Server-only: the loaders read the filesystem.
 * A ref that cannot be resolved is reported as missing rather than dropped — a dangling id is a
 * content bug and hiding it is how content bugs survive.
 */

export interface ConceptRef {
  id: string;
  title: string;
  oneLine?: string;
  trackId: string;
  trackTitle: string;
  trackNumber: number;
  moduleId: string;
  moduleTitle: string;
  missing: boolean;
}

export function conceptRef(id: string): ConceptRef {
  const c = getConcept(id);
  if (!c) {
    return {
      id, title: id, trackId: '', trackTitle: '', trackNumber: 0,
      moduleId: '', moduleTitle: '', missing: true,
    };
  }
  const track = getTrack(c.trackId);
  const mod = getModule(c.moduleId);
  return {
    id: c.id,
    title: c.title,
    oneLine: c.oneLine,
    trackId: c.trackId,
    trackTitle: track?.title ?? c.trackId,
    trackNumber: track?.number ?? 0,
    moduleId: c.moduleId,
    moduleTitle: mod?.title ?? c.moduleId,
    missing: false,
  };
}

const TIER_ORDER = ['spec', 'canonical-docs', 'primary-analysis', 'secondary'];

export interface SourceEntry {
  source: Source;
  /** concept titles that cite it — a source is never shown floating free of its claim */
  cited: string[];
  host: string;
}

/** Deduped across the lesson's concepts, strongest tier first. */
export function sourcesFor(taught: ConceptView[], resolve: (id: string) => Source | undefined): {
  entries: SourceEntry[];
  unresolved: string[];
} {
  const map = new Map<string, SourceEntry>();
  const unresolved: string[] = [];
  for (const c of taught) {
    for (const id of c.sources ?? []) {
      const existing = map.get(id);
      if (existing) {
        if (!existing.cited.includes(c.title)) existing.cited.push(c.title);
        continue;
      }
      const s = resolve(id);
      if (!s) {
        if (!unresolved.includes(id)) unresolved.push(id);
        continue;
      }
      let host = '';
      try {
        host = new URL(s.url).hostname.replace(/^www\./, '');
      } catch {
        host = s.url;
      }
      map.set(id, { source: s, cited: [c.title], host });
    }
  }
  const entries = [...map.values()].sort((a, b) => {
    const t = TIER_ORDER.indexOf(a.source.tier) - TIER_ORDER.indexOf(b.source.tier);
    return t !== 0 ? t : a.source.title.localeCompare(b.source.title);
  });
  return { entries, unresolved };
}
