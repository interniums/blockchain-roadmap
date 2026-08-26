import type { Metadata } from 'next';
import Link from 'next/link';
import { graph, stats } from '@/lib/content/load';
import { can, WEB_NOTICE } from '@/lib/capabilities';
import type { Tier, Volatility } from '@/lib/content/types';
import { SourceTable, type Freshness, type SourceRow } from './_components/SourceTable';

export const metadata: Metadata = {
  title: 'Sources · Chainpath',
  description: 'Every source behind the curriculum, with tier, publisher and re-verify state.',
};

/** §12: stable 365 days · evolving 120 · hot 45, measured from verifiedAt. */
const WINDOW: Record<Volatility, number> = { stable: 365, evolving: 120, hot: 45 };
/** Lower rank = shorter window. A source inherits the tightest window of anything citing it. */
const VOL_RANK: Record<Volatility, number> = { hot: 0, evolving: 1, stable: 2 };
const DUE_SOON_DAYS = 30;

function isoDay(value: unknown): string | null {
  if (!value) return null;
  const s = value instanceof Date ? value.toISOString() : String(value);
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(s.trim());
  return m ? m[1] : null;
}

function dayNumber(iso: string): number {
  return Math.floor(Date.parse(`${iso}T00:00:00Z`) / 86_400_000);
}

function addDays(iso: string, days: number): string {
  return new Date((dayNumber(iso) + days) * 86_400_000).toISOString().slice(0, 10);
}

function isExternal(url: string): boolean {
  return /^https?:\/\//i.test(url.trim());
}

/** A handful of "sources" are in-repo research files, not links. Say so rather than faking a host. */
function hostOf(url: string): string {
  if (!isExternal(url)) return 'in this repo';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//i, '').split('/')[0] || 'unknown';
  }
}

interface Built {
  rows: SourceRow[];
  conceptTitles: Record<string, string>;
  counts: Record<Freshness, number>;
  tierCounts: Record<Tier, number>;
  vendorCount: number;
  uncitedCount: number;
  todayISO: string;
}

function build(): Built {
  const g = graph();
  const todayISO = new Date().toISOString().slice(0, 10);
  const today = dayNumber(todayISO);

  // A source has no track of its own — it gets one from every concept that cites it.
  const citedBy = new Map<string, string[]>();
  const conceptTitles: Record<string, string> = {};
  for (const [cid, c] of g.conceptById) {
    for (const sid of c.sources ?? []) {
      if (!g.sourceById.has(sid)) continue;
      const list = citedBy.get(sid) ?? [];
      list.push(cid);
      citedBy.set(sid, list);
      conceptTitles[cid] = c.title;
    }
  }

  const counts: Record<Freshness, number> = {
    'never-verified': 0, overdue: 0, 'due-soon': 0, current: 0, unscheduled: 0,
  };
  const tierCounts: Record<Tier, number> = {
    spec: 0, 'canonical-docs': 0, 'primary-analysis': 0, secondary: 0,
  };
  let vendorCount = 0;
  let uncitedCount = 0;

  const rows: SourceRow[] = [];
  for (const [id, s] of g.sourceById) {
    const cites = (citedBy.get(id) ?? []).sort((a, b) =>
      (conceptTitles[a] ?? a).localeCompare(conceptTitles[b] ?? b));

    const trackIds = [...new Set(
      cites.map((cid) => g.conceptHome.get(cid)?.trackId).filter((t): t is string => Boolean(t)),
    )].sort();

    let volatility: Volatility | null = null;
    for (const cid of cites) {
      const v = g.conceptById.get(cid)?.volatility;
      if (!v) continue;
      if (volatility === null || VOL_RANK[v] < VOL_RANK[volatility]) volatility = v;
    }

    const verifiedAt = isoDay(s.verifiedAt);
    const windowDays = volatility ? WINDOW[volatility] : null;
    const dueAt = verifiedAt && windowDays ? addDays(verifiedAt, windowDays) : null;
    const daysLeft = dueAt ? dayNumber(dueAt) - today : null;

    let freshness: Freshness;
    if (!verifiedAt) freshness = 'never-verified';
    else if (daysLeft === null) freshness = 'unscheduled';
    else if (daysLeft < 0) freshness = 'overdue';
    else if (daysLeft <= DUE_SOON_DAYS) freshness = 'due-soon';
    else freshness = 'current';

    counts[freshness] += 1;
    tierCounts[s.tier] += 1;
    if (s.vendor) vendorCount += 1;
    if (cites.length === 0) uncitedCount += 1;

    rows.push({
      id,
      title: s.title,
      url: s.url,
      host: hostOf(s.url),
      tier: s.tier,
      external: isExternal(s.url),
      vendor: Boolean(s.vendor),
      publishedAt: s.publishedAt ? String(s.publishedAt) : null,
      verifiedAt,
      volatility,
      windowDays,
      dueAt,
      daysLeft,
      freshness,
      trackIds,
      cites,
    });
  }

  rows.sort((a, b) => a.title.localeCompare(b.title));
  return { rows, conceptTitles, counts, tierCounts, vendorCount, uncitedCount, todayISO };
}

const LIBRARY = [
  { href: '/sources', label: 'Sources' },
  { href: '/glossary', label: 'Glossary' },
  { href: '/questions', label: 'Questions' },
];

export default function SourcesPage() {
  const { rows, conceptTitles, counts, tierCounts, vendorCount, uncitedCount, todayISO } = build();
  const s = stats();
  const tracks = graph().tracks.map((t) => ({ id: t.id, title: `${String(t.number).padStart(2, '0')} ${t.title}` }));
  const needsWork = counts['never-verified'] + counts.overdue;

  return (
    <div className="mx-auto flex w-full max-w-[1560px] gap-8 px-6 py-6">
      <aside className="hidden w-[190px] shrink-0 lg:block">
        <nav aria-label="Library" className="sticky top-6 text-[13px]">
          <Link href="/m" className="block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)] hover:text-[var(--color-accent)]">
            ← Roadmap
          </Link>
          <p className="mt-2 text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">Library</p>
          <ul className="mt-1 flex flex-col gap-0.5">
            {LIBRARY.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={l.href === '/sources' ? 'page' : undefined}
                  className={`block rounded px-2 py-1 ${
                    l.href === '/sources'
                      ? 'bg-[var(--color-surface-2)] text-[var(--color-ink)]'
                      : 'text-[var(--color-ink-2)] hover:text-[var(--color-accent)]'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">Corpus</p>
          <dl className="mt-1 flex flex-col gap-1 text-[12px] text-[var(--color-ink-2)]">
            <div className="flex justify-between gap-2"><dt>Sources</dt><dd className="font-mono text-[var(--color-ink)]">{s.sources}</dd></div>
            <div className="flex justify-between gap-2"><dt>Spec</dt><dd className="font-mono">{tierCounts.spec}</dd></div>
            <div className="flex justify-between gap-2"><dt>Canonical docs</dt><dd className="font-mono">{tierCounts['canonical-docs']}</dd></div>
            <div className="flex justify-between gap-2"><dt>Primary analysis</dt><dd className="font-mono">{tierCounts['primary-analysis']}</dd></div>
            <div className="flex justify-between gap-2"><dt>Secondary</dt><dd className="font-mono">{tierCounts.secondary}</dd></div>
            <div className="flex justify-between gap-2"><dt>Vendor-published</dt><dd className="font-mono">{vendorCount}</dd></div>
          </dl>

          <p className="mt-6 text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">Re-verify queue</p>
          <dl className="mt-1 flex flex-col gap-1 text-[12px] text-[var(--color-ink-2)]">
            <div className="flex justify-between gap-2"><dt>Never verified</dt><dd className="font-mono text-[var(--color-danger)]">{counts['never-verified']}</dd></div>
            <div className="flex justify-between gap-2"><dt>Past window</dt><dd className="font-mono text-[var(--color-danger)]">{counts.overdue}</dd></div>
            <div className="flex justify-between gap-2"><dt>Due ≤ 30d</dt><dd className="font-mono text-[var(--color-warn)]">{counts['due-soon']}</dd></div>
            <div className="flex justify-between gap-2"><dt>Current</dt><dd className="font-mono text-[var(--color-good)]">{counts.current}</dd></div>
            <div className="flex justify-between gap-2"><dt>Unscheduled</dt><dd className="font-mono">{counts.unscheduled}</dd></div>
          </dl>
        </nav>
      </aside>

      <main className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">Library</p>
        <h1 className="mt-1 text-[26px] font-semibold tracking-tight">Sources</h1>
        <p className="mt-2 max-w-[78ch] text-[14px] text-[var(--color-ink-2)]">
          Every source the curriculum cites — {s.sources} of them behind {s.concepts} concepts. Tier says how much
          weight a claim may rest on it: <strong className="font-semibold">spec</strong> and{' '}
          <strong className="font-semibold">canonical docs</strong> can carry a claim, primary analysis and secondary
          may only support one. <strong className="font-semibold">Vendor</strong> marks a source published by the
          vendor of the thing it describes — fine for capability, useless for comparison.
        </p>
        <p className="mt-2 max-w-[78ch] text-[14px] text-[var(--color-ink-2)]">
          The freshness board turns content rot into a queue you can work.{' '}
          {needsWork === 0 ? (
            <>Right now nothing is past its window and everything carries a stamp.</>
          ) : counts.overdue === 0 ? (
            <>
              Right now <strong className="font-semibold text-[var(--color-ink)]">{counts['never-verified']}</strong>{' '}
              sources carry no <span className="font-mono">verifiedAt</span> stamp at all. Nothing is past its window
              yet — the whole corpus was stamped on the same day, so the first real wave comes 45 days out.
            </>
          ) : (
            <>
              Right now <strong className="font-semibold text-[var(--color-ink)]">{needsWork}</strong> sources need
              attention — {counts['never-verified']} were never stamped and {counts.overdue} are past their window.
            </>
          )}
        </p>

        <nav aria-label="Library" className="mt-4 flex gap-3 text-[13px] lg:hidden">
          {LIBRARY.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={l.href === '/sources' ? 'page' : undefined}
              className={l.href === '/sources' ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-2)] hover:text-[var(--color-accent)]'}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-5">
          <SourceTable
            rows={rows}
            tracks={tracks}
            conceptTitles={conceptTitles}
            todayISO={todayISO}
            canReverify={can.reverifySources}
            reverifyNotice={WEB_NOTICE}
          />
        </div>

        <section aria-labelledby="how-freshness" className="mt-10 max-w-[78ch] border-t border-[var(--color-rule)] pt-5">
          <h2 id="how-freshness" className="text-[15px] font-semibold">How the window is computed</h2>
          <ul className="mt-2 flex flex-col gap-1.5 text-[13px] text-[var(--color-ink-2)]">
            <li>
              Volatility lives on the concept, not the source. A source inherits the{' '}
              <em>tightest</em> volatility of any concept citing it — hot beats evolving beats stable.
            </li>
            <li>
              Windows: <span className="font-mono">stable 365d</span> ·{' '}
              <span className="font-mono">evolving 120d</span> · <span className="font-mono">hot 45d</span>, counted
              from <span className="font-mono">verifiedAt</span>.
            </li>
            <li>
              A source no concept cites has no volatility and so no window. It is listed as{' '}
              <em>unscheduled</em> rather than quietly counted as current. {uncitedCount} sources are cited by nothing
              at all — a citation gap rather than a freshness one, and worth working from the{' '}
              <em>Not cited by any concept</em> track filter.
            </li>
            <li>Being past the window never fails the build. It puts the source on this board.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
