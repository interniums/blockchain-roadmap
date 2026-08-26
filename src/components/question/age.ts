/**
 * Age, in words. The plan is explicit: a three-month-old question is a signal, so the age is
 * always shown — but it is shown as information, never as a scold. No streaks, no "days since",
 * no red. The bucket notes say what an old loop probably means, and one of the meanings is
 * "this did not matter", which is a legitimate outcome.
 */

const DAY = 86_400_000;

export type AgeKey = 'week' | 'weeks' | 'months' | 'stale';

export interface AgeBucket {
  key: AgeKey;
  label: string;
  note: string;
}

export const AGE_BUCKETS: AgeBucket[] = [
  { key: 'week', label: 'This week', note: 'Still warm. You are probably one lesson away from it.' },
  { key: 'weeks', label: '1–4 weeks', note: 'Normal. Most get answered by reaching the lesson that covers them.' },
  { key: 'months', label: '1–3 months', note: 'Worth a deliberate look — the curriculum may not cover it at all.' },
  { key: 'stale', label: 'Over 3 months', note: 'A signal in itself: either it does not matter, or it is the thing you keep stepping around.' },
];

/** Whole days between two epoch stamps, floored, never negative. */
export function daysBetween(from: number, to: number): number {
  return Math.max(0, Math.floor((to - from) / DAY));
}

export function bucketFor(days: number): AgeBucket {
  if (days < 7) return AGE_BUCKETS[0];
  if (days < 28) return AGE_BUCKETS[1];
  if (days < 91) return AGE_BUCKETS[2];
  return AGE_BUCKETS[3];
}

/** "today" · "3 days" · "5 weeks" · "4 months" · "2 years". Coarse on purpose. */
export function ageWords(days: number): string {
  if (days === 0) return 'today';
  if (days === 1) return '1 day';
  if (days < 21) return `${days} days`;
  if (days < 60) return `${Math.round(days / 7)} weeks`;
  if (days < 365) return `${Math.round(days / 30)} months`;
  const years = Math.floor(days / 365);
  return years <= 1 ? 'over a year' : `${years} years`;
}

/** "asked 3 days ago" / "asked today". */
export function askedWords(days: number): string {
  return days === 0 ? 'asked today' : `asked ${ageWords(days)} ago`;
}

const STAMP = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/** Client-side only (local timezone). Safe because the inbox reads state after mount. */
export function formatStamp(ms: number | null): string {
  if (!ms) return '—';
  return STAMP.format(new Date(ms));
}

export function wordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}
