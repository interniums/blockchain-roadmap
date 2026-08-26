import { getConcept, getModule, getTrack } from '@/lib/content/load';
import type { ConceptView, Source } from '@/lib/content/types';

/**
 * Turning ids into things a reader can act on. Server-only: the loaders read the filesystem.
 * A ref that cannot be resolved is reported as missing rather than dropped — a dangling id is a
 * content bug and hiding it is how content bugs survive.
 */

export type Via = 'requires' | 'pays-off';

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
  via?: Via;
}

export function conceptRef(id: string, via?: Via): ConceptRef {
  const c = getConcept(id);
  if (!c) {
    return {
      id, title: id, trackId: '', trackTitle: '', trackNumber: 0,
      moduleId: '', moduleTitle: '', missing: true, via,
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
    via,
  };
}

export interface TrackGroup {
  trackId: string;
  trackTitle: string;
  trackNumber: number;
  crossTrack: boolean;
  refs: ConceptRef[];
}

/** Same track first (that is the reader's thread), then the rest by track number. */
export function groupByTrack(refs: ConceptRef[], currentTrackId: string): TrackGroup[] {
  const byTrack = new Map<string, TrackGroup>();
  for (const r of refs) {
    const key = r.trackId || '—';
    const g = byTrack.get(key) ?? {
      trackId: r.trackId,
      trackTitle: r.trackTitle || 'Unresolved',
      trackNumber: r.trackNumber,
      crossTrack: r.trackId !== currentTrackId,
      refs: [],
    };
    g.refs.push(r);
    byTrack.set(key, g);
  }
  const groups = [...byTrack.values()];
  for (const g of groups) g.refs.sort((a, b) => a.title.localeCompare(b.title));
  return groups.sort((a, b) => {
    if (a.crossTrack !== b.crossTrack) return a.crossTrack ? 1 : -1;
    return a.trackNumber - b.trackNumber;
  });
}

/**
 * Everything downstream of what this lesson teaches: concepts that `requires` one of them,
 * plus the authored `paysOffIn` hints. Concepts this lesson itself teaches are excluded —
 * a lesson does not lead to itself.
 */
export function usedLater(taught: ConceptView[]): ConceptRef[] {
  const taughtIds = new Set(taught.map((c) => c.id));
  const seen = new Map<string, Via>();
  for (const c of taught) {
    for (const id of c.requiredBy) if (!taughtIds.has(id)) seen.set(id, 'requires');
    for (const id of c.paysOffIn ?? []) if (!taughtIds.has(id) && !seen.has(id)) seen.set(id, 'pays-off');
  }
  return [...seen].map(([id, via]) => conceptRef(id, via));
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
