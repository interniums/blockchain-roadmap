/**
 * Pure, client-safe helpers for saying a Mastery row out loud.
 *
 * Deliberately verbal. A bare "0%" is the easiest lie on this page: it reads as failure
 * when the truth is usually "never asked". The three standings below keep those apart.
 */
import type { Mastery } from '@/lib/state/store';

const DAY = 86_400_000;

/** No row at all · a row with no retrieval yet · a row you have actually produced. */
export type Standing = 'untracked' | 'unproven' | 'reviewed';

export function standingOf(m: Mastery | undefined): Standing {
  // `due === null` is the store's signal that no review row exists for this concept.
  if (!m || m.due === null) return 'untracked';
  if (m.reps === 0) return 'unproven';
  return 'reviewed';
}

export const pct = (n: number) => Math.round(n * 100);

/**
 * A measured mastery that rounds to zero is not the same as no measurement, and this page
 * shows both — so a collapsed-but-real number reads as "<1%" and never as a blank zero.
 */
export const masteryText = (n: number) => (n > 0 && pct(n) === 0 ? '<1%' : `${pct(n)}%`);

/**
 * The readiness bands from the plan (§11). Named, never used to lock anything —
 * they describe how much a prerequisite can be leaned on, not what you may open.
 */
export type Band = 'shaky' | 'reachable' | 'solid';
export function bandOf(mastery: number): Band {
  if (mastery >= 0.8) return 'solid';
  if (mastery >= 0.4) return 'reachable';
  return 'shaky';
}
export const BAND_TONE: Record<Band, string> = {
  shaky: 'var(--color-warn)',
  reachable: 'var(--color-accent)',
  solid: 'var(--color-good)',
};

/** How much of the scheduler's confidence was borrowed rather than earned by retrieval. */
export type CreditLevel = 'none' | 'trace' | 'some' | 'most';
export function creditLevel(share: number): CreditLevel {
  if (share >= 0.5) return 'most';
  if (share >= 0.15) return 'some';
  if (share > 0) return 'trace';
  return 'none';
}

const FMT = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
/** Only ever called after mount — the server never formats a date this page shows. */
export const onDate = (ms: number) => FMT.format(new Date(ms));

/**
 * "due now" / "due in 4 hours" / "due in 3 days" / "9 days overdue".
 * A statement of when the scheduler wants this back, never a countdown and never a streak.
 */
export function dueWords(due: number, now: number): string {
  const ms = due - now;
  if (ms <= 0) {
    const late = Math.floor(-ms / DAY);
    return late >= 2 ? `${late} days overdue` : 'due now';
  }
  if (ms < DAY) {
    const hours = Math.round(ms / (60 * 60 * 1000));
    return hours <= 1 ? 'due within the hour' : `due in ${hours} hours`;
  }
  const days = Math.round(ms / DAY);
  return days === 1 ? 'due tomorrow' : `due in ${days} days`;
}

export const RATINGS = [
  { value: 1 as const, label: 'Again', gloss: 'Could not produce it' },
  { value: 2 as const, label: 'Hard', gloss: 'Got there, slowly' },
  { value: 3 as const, label: 'Good', gloss: 'Produced it' },
  { value: 4 as const, label: 'Easy', gloss: 'Instant' },
];

export const CONFIDENCES = [
  { value: 1 as const, label: 'Low' },
  { value: 2 as const, label: 'Medium' },
  { value: 3 as const, label: 'High' },
];

/**
 * Reading the clock is impure, so render never does it. Event handlers stamp the moment
 * a write happened and everything relative is measured from that stamp.
 */
export const stampNow = (): number => Date.now();
