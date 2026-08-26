'use server';

import { getConcept, getLesson, getModule, getPractice, getTrack } from '@/lib/content/load';
import type { ConceptLabel, LabelBundle, OriginLabel } from './model';

/**
 * Questions live in state (client-side); their titles live in content (server-side). This is the
 * one bridge between them: the inbox reads its rows, then asks for the labels of exactly the
 * concepts and origins it found. Shipping all 1,490 concepts to the browser to avoid one round
 * trip would be the worse trade.
 *
 * A row whose concept no longer exists is labelled honestly rather than dropped — the question
 * was still asked.
 */
export async function lookupLabels(conceptIds: string[], origins: string[]): Promise<LabelBundle> {
  return {
    concepts: unique(conceptIds).map(conceptLabel),
    origins: unique(origins).map(originLabel),
  };
}

function unique(xs: string[]): string[] {
  return [...new Set(xs.filter((x) => typeof x === 'string' && x.length > 0))];
}

function conceptLabel(id: string): ConceptLabel {
  const c = getConcept(id);
  if (!c) {
    return {
      id,
      title: id,
      oneLine: '',
      href: null,
      moduleTitle: '',
      trackTitle: '',
      trackId: '',
      known: false,
    };
  }
  return {
    id,
    title: c.title,
    oneLine: c.oneLine ?? '',
    href: `/c/${id}`,
    moduleTitle: getModule(c.moduleId)?.title ?? '',
    trackTitle: getTrack(c.trackId)?.title ?? '',
    trackId: c.trackId,
    known: true,
  };
}

/** Accepts an app path ("/t/x/y/z") or a bare content id, and resolves whichever it can. */
function originLabel(key: string): OriginLabel {
  const raw = key.trim();
  const segments = raw.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  const last = segments[segments.length - 1] ?? '';

  for (const candidate of [last, raw]) {
    if (!candidate) continue;

    const lesson = getLesson(candidate);
    if (lesson) {
      const trackTitle = getTrack(lesson.trackId)?.title ?? lesson.trackId;
      const moduleTitle = getModule(lesson.moduleId)?.title ?? lesson.moduleId;
      return {
        key,
        href: `/t/${lesson.trackId}/${lesson.moduleId}/${lesson.lesson.id}`,
        label: `${lesson.lesson.title} — ${moduleTitle}, ${trackTitle}`,
        kind: 'lesson',
      };
    }

    const mod = getModule(candidate);
    if (mod) {
      const trackTitle = getTrack(mod.trackId)?.title ?? mod.trackId;
      return { key, href: `/t/${mod.trackId}/${mod.id}`, label: `${mod.title} — ${trackTitle}`, kind: 'module' };
    }

    const practice = getPractice(candidate);
    if (practice) {
      return { key, href: `/p/${practice.id}`, label: `${practice.title} (practice)`, kind: 'practice' };
    }

    const concept = getConcept(candidate);
    if (concept) {
      return { key, href: `/c/${concept.id}`, label: concept.title, kind: 'concept' };
    }

    const track = getTrack(candidate);
    if (track) {
      return { key, href: `/t/${track.id}`, label: track.title, kind: 'track' };
    }
  }

  // An internal path we cannot name is still a place we can return you to.
  if (raw.startsWith('/') && !raw.startsWith('//')) {
    return { key, href: raw, label: raw, kind: 'path' };
  }
  return { key, href: null, label: raw, kind: 'unknown' };
}
