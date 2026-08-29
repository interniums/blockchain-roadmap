/**
 * The source re-verification worklist, as a terminal report.
 *
 * This used to be a screen at /sources. It was deleted because every one of its organising axes
 * was a clock — never-verified, overdue, due-soon, days-left — and the app shows the learner no
 * clock. The learner and the maintainer are the same person here, which is exactly why the two
 * surfaces have to separate: the maintainer's backlog must not appear on the learner's front door.
 *
 * Run it when you are doing content maintenance:  npx tsx scripts/source-audit.ts
 */
import { graph } from '../src/lib/content/load';
import type { Tier, Volatility } from '../src/lib/content/types';

/** stable 365 days · evolving 120 · hot 45, measured from verifiedAt. */
const WINDOW: Record<Volatility, number> = { stable: 365, evolving: 120, hot: 45 };
/** Lower rank = shorter window. A source inherits the tightest window of anything citing it. */
const VOL_RANK: Record<Volatility, number> = { hot: 0, evolving: 1, stable: 2 };
const DUE_SOON_DAYS = 30;

type State = 'never-verified' | 'overdue' | 'due-soon' | 'current' | 'uncited';

function isoDay(value: unknown): string | null {
  if (!value) return null;
  const s = value instanceof Date ? value.toISOString() : String(value);
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(s.trim());
  return m ? m[1] : null;
}
const dayNumber = (iso: string) => Math.floor(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);

interface Row {
  id: string;
  title: string;
  url: string;
  tier: Tier;
  vendor: boolean;
  verifiedAt: string | null;
  volatility: Volatility | null;
  daysLeft: number | null;
  state: State;
  citedBy: number;
}

function build(today: number): Row[] {
  const g = graph();

  // A source has no volatility of its own — it inherits the tightest one of anything citing it.
  const citedBy = new Map<string, string[]>();
  for (const [cid, c] of g.conceptById) {
    for (const sid of c.sources ?? []) {
      if (!g.sourceById.has(sid)) continue;
      citedBy.set(sid, [...(citedBy.get(sid) ?? []), cid]);
    }
  }

  const rows: Row[] = [];
  for (const [id, s] of g.sourceById) {
    const cites = citedBy.get(id) ?? [];

    let volatility: Volatility | null = null;
    for (const cid of cites) {
      const v = g.conceptById.get(cid)?.volatility;
      if (!v) continue;
      if (volatility === null || VOL_RANK[v] < VOL_RANK[volatility]) volatility = v;
    }

    const verifiedAt = isoDay(s.verifiedAt);
    const windowDays = volatility ? WINDOW[volatility] : null;
    const daysLeft =
      verifiedAt && windowDays ? dayNumber(verifiedAt) + windowDays - today : null;

    let state: State;
    if (cites.length === 0) state = 'uncited';
    else if (!verifiedAt) state = 'never-verified';
    else if (daysLeft === null) state = 'current';
    else if (daysLeft < 0) state = 'overdue';
    else if (daysLeft <= DUE_SOON_DAYS) state = 'due-soon';
    else state = 'current';

    rows.push({
      id, title: s.title, url: s.url, tier: s.tier, vendor: Boolean(s.vendor),
      verifiedAt, volatility, daysLeft, state, citedBy: cites.length,
    });
  }
  return rows;
}

const ORDER: State[] = ['never-verified', 'overdue', 'due-soon', 'uncited', 'current'];
const WHY: Record<State, string> = {
  'never-verified': 'Cited, but no verifiedAt stamp at all — no window can even start.',
  overdue: 'Past verifiedAt + the window its volatility allows. Work this list first.',
  'due-soon': `Falls due within ${DUE_SOON_DAYS} days.`,
  uncited: 'No concept cites it. Content debt, not a freshness problem.',
  current: 'Inside its window.',
};

const today = Math.floor(Date.now() / 86_400_000);
const rows = build(today);
const byState = new Map<State, Row[]>();
for (const r of rows) byState.set(r.state, [...(byState.get(r.state) ?? []), r]);

console.log(`\nSOURCE AUDIT — ${rows.length} sources, ${new Date(today * 86_400_000).toISOString().slice(0, 10)}\n`);
for (const state of ORDER) {
  const list = (byState.get(state) ?? []).sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0));
  console.log(`${state.toUpperCase().padEnd(16)} ${String(list.length).padStart(5)}   ${WHY[state]}`);
}

const work = ORDER.slice(0, 3).flatMap((s) => byState.get(s) ?? []);
if (work.length) {
  console.log(`\n--- the worklist (${work.length}) ---`);
  for (const r of work.sort((a, b) => (a.daysLeft ?? -9999) - (b.daysLeft ?? -9999))) {
    const when = r.daysLeft === null ? 'never verified' : r.daysLeft < 0 ? `${-r.daysLeft}d overdue` : `${r.daysLeft}d left`;
    console.log(`  ${when.padEnd(16)} ${r.tier.padEnd(17)} ${r.vendor ? 'vendor ' : '       '} ${r.title}`);
    console.log(`  ${''.padEnd(16)} ${r.url}`);
  }
} else {
  console.log('\nNothing needs re-verifying.');
}
console.log('');
