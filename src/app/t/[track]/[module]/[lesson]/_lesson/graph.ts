import { getConcept, getModule, getTrack } from '@/lib/content/load';

/**
 * Turning ids into things a reader can act on. Server-only: the loaders read the filesystem.
 * A ref that cannot be resolved is reported as missing rather than dropped — a dangling id is a
 * content bug and hiding it is how content bugs survive.
 */

/**
 * An adjacent lesson in reading order. `boundary` says whether stepping there leaves the module or
 * the track, which is what decides whether the end of a lesson offers "Continue" or "Build it".
 */
export interface Neighbour {
  href: string;
  title: string;
  moduleTitle: string;
  trackTitle: string;
  boundary: 'module' | 'track' | null;
}

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
