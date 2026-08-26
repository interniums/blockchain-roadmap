/**
 * Shapes passed from the server action (content graph) to the client session.
 * Kept in their own module because a `'use server'` file may only export async functions.
 */

export interface ReviewItem {
  conceptId: string;
  title: string;
  oneLine: string;
  /** Some concepts have only a one-line. The UI says so rather than pretending. */
  statement: string | null;
  trackId: string;
  trackTitle: string;
  moduleId: string;
  moduleTitle: string;
  conceptHref: string;
  misconception: { belief: string; reality: string } | null;
  /** Where a full re-read would happen, when one is warranted. */
  reread: { href: string; label: string; outlineOnly: boolean } | null;
  /** requires + deepens, depth 1. Used to explain honestly why credit was or was not possible. */
  prereqCount: number;
  reps: number;
  dueAt: number;
}

export interface ConceptLabel {
  conceptId: string;
  title: string;
  href: string;
  trackTitle: string;
}

export type Rating = 1 | 2 | 3 | 4;
export type Confidence = 1 | 2 | 3;
