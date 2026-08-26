import type { Volatility } from '@/lib/content/types';

/** Re-verify windows, from plan §12. */
export const WINDOW_DAYS: Record<Volatility, number> = {
  stable: 365,
  evolving: 120,
  hot: 45,
};

export const VOLATILITY_LABEL: Record<Volatility, string> = {
  stable: 'Stable',
  evolving: 'Evolving',
  hot: 'Hot',
};

export const VOLATILITY_MEANS: Record<Volatility, string> = {
  stable:
    'The ground under this does not move. Re-verified on a 365-day window; a year-old citation here is still a good citation.',
  evolving:
    'This changes on the timescale of releases. Re-verified on a 120-day window — check the version and the numbers against the sources before you rely on them.',
  hot:
    'This is live ground. Re-verified on a 45-day window because it has moved recently and can move again.',
};

/** Written out in full for `hot`, because trusting the page is the decision at stake. */
export const HOT_WARNING =
  'Treat every number, version and named EIP above as true only as of the verification dates in the sources rail — not as permanent. If the last verification is old, open the cited source before you act on this. The statement is the claim under review; the sources are the evidence for it.';

const MS_DAY = 86_400_000;

export function parseDate(value?: string): Date | null {
  if (!value) return null;
  const normalised = value.length === 7 ? `${value}-01` : value;
  const d = new Date(`${normalised}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export interface Freshness {
  dueOn: string | null;
  overdueDays: number | null;
}

/**
 * Freshness is computed at build time from `verifiedAt` plus the concept's window.
 * Stated as such on the page — a baked date presented as "today" would be a lie.
 */
export function freshness(verifiedAt: string | undefined, volatility: Volatility, now: Date): Freshness {
  const verified = parseDate(verifiedAt);
  if (!verified) return { dueOn: null, overdueDays: null };
  const due = new Date(verified.getTime() + WINDOW_DAYS[volatility] * MS_DAY);
  const overdue = Math.floor((now.getTime() - due.getTime()) / MS_DAY);
  return {
    dueOn: due.toISOString().slice(0, 10),
    overdueDays: overdue > 0 ? overdue : null,
  };
}
