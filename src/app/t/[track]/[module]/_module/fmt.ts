/**
 * Formatting for the state the module screen shows. Pure — no directive, so both the
 * server sections and the client leaves can use it.
 *
 * Everything here refuses to invent precision: a timestamp is a date, a mastery is a
 * percentage of a number the scheduler actually holds, and "no record" is its own answer.
 */

export function whenShort(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function whenLong(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function masteryPct(mastery: number): number {
  return Math.round(mastery * 100);
}

const DAY = 86_400_000;

/** Relative, coarse, and never a countdown you could fail. */
export function dueLabel(due: number, now = Date.now()): string {
  const days = Math.round((due - now) / DAY);
  if (days <= 0) return 'due now';
  if (days === 1) return 'due tomorrow';
  if (days < 30) return `due in ${days} days`;
  const months = Math.round(days / 30);
  return `due in ${months} month${months === 1 ? '' : 's'}`;
}
