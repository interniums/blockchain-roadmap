'use server';

import { getConcept, getLesson, getTrack, getModule } from '@/lib/content/load';
import type { ConceptLabel, ReviewItem } from './types';

/**
 * The review queue comes from the state store (client side); the prose for each item comes from
 * the content graph (server side, filesystem). These two actions are the join.
 *
 * A concept id can survive in the schedule after the curriculum drops or renames it. Those are
 * reported back as `dropped` rather than silently filtered — a queue that quietly shrinks is a lie.
 *
 * Nothing here carries a date. The order arrives from the store already sorted by how likely the
 * memory is to have gone, and that ordering is the only thing the screen is allowed to know.
 */

export async function loadReviewItems(
  queued: { conceptId: string; reps: number }[],
): Promise<{ items: ReviewItem[]; dropped: string[] }> {
  const items: ReviewItem[] = [];
  const dropped: string[] = [];

  for (const row of queued) {
    const c = getConcept(row.conceptId);
    if (!c) {
      dropped.push(row.conceptId);
      continue;
    }
    const track = getTrack(c.trackId);
    const module_ = getModule(c.moduleId);

    const lessonId = c.lessons[0];
    const entry = lessonId ? getLesson(lessonId) : undefined;
    const reread = entry
      ? { href: `/t/${entry.trackId}/${entry.moduleId}/${entry.lesson.id}`, label: entry.lesson.title }
      : null;

    const m = c.misconceptions?.[0];
    const deepens = (c.related ?? []).filter((e) => e.type === 'deepens').length;

    items.push({
      conceptId: c.id,
      title: c.title,
      oneLine: c.oneLine,
      statement: c.statement?.trim() ? c.statement.trim() : null,
      trackId: c.trackId,
      trackTitle: track?.title ?? c.trackId,
      moduleId: c.moduleId,
      moduleTitle: module_?.title ?? c.moduleId,
      conceptHref: `/c/${c.id}`,
      misconception: m ? { belief: m.belief, reality: m.reality } : null,
      reread,
      prereqCount: c.requires.length + deepens,
      reps: row.reps,
    });
  }

  return { items, dropped };
}

/** Titles for the prerequisites a review credited. Ids with no concept behind them are skipped. */
export async function loadConceptLabels(ids: string[]): Promise<ConceptLabel[]> {
  const out: ConceptLabel[] = [];
  for (const id of ids) {
    const c = getConcept(id);
    if (!c) continue;
    out.push({
      conceptId: id,
      title: c.title,
      href: `/c/${id}`,
      trackTitle: getTrack(c.trackId)?.title ?? c.trackId,
    });
  }
  return out;
}
