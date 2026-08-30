import { getConcept, getModule, getTrack } from '@/lib/content/load';
import type { Source } from '@/lib/content/types';

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

export interface SourceEntry {
  source: Source;
  /** the citation numeral the prose prints for it — the rail and the marks must agree */
  n: number;
  host: string;
}

/**
 * The lesson's own sources, in the order its frontmatter declares them.
 *
 * This used to be built from the concepts the lesson TEACHES, via their `sources` — which is a
 * different set. Measured across the corpus: frontmatter median 10, concept-derived median 3, and
 * a median of 7 cited sources absent from the rail entirely, affecting 632 of 635 lessons. So most
 * inline citations pointed at a rail that did not list them.
 *
 * Frontmatter order is deliberately preserved rather than sorted by tier: the numerals in the
 * prose are indices into this list, and re-sorting here would make ¹ point at the wrong row.
 */
export function sourcesFor(
  ids: string[],
  resolve: (id: string) => Source | undefined,
): { entries: SourceEntry[]; unresolved: string[] } {
  const entries: SourceEntry[] = [];
  const unresolved: string[] = [];
  let n = 0;
  for (const id of ids) {
    n += 1;
    const s = resolve(id);
    if (!s) { unresolved.push(id); continue; }
    let host = '';
    try {
      host = new URL(s.url).hostname.replace(/^www\./, '');
    } catch {
      host = s.url;
    }
    entries.push({ source: s, n, host });
  }
  return { entries, unresolved };
}
