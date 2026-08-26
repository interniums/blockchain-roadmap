'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Tier, Volatility } from '@/lib/content/types';

/** Computed on the server so the client never needs a clock or the filesystem. */
export type Freshness = 'never-verified' | 'overdue' | 'due-soon' | 'current' | 'unscheduled';

export interface SourceRow {
  id: string;
  title: string;
  url: string;
  host: string;
  tier: Tier;
  /** false for in-repo paths — those must not render as outbound links */
  external: boolean;
  vendor: boolean;
  publishedAt: string | null;
  verifiedAt: string | null;
  /** tightest volatility among the concepts that cite this source */
  volatility: Volatility | null;
  windowDays: number | null;
  dueAt: string | null;
  /** negative = overdue by that many days */
  daysLeft: number | null;
  freshness: Freshness;
  trackIds: string[];
  cites: string[];
}

export interface SourceTableProps {
  rows: SourceRow[];
  tracks: { id: string; title: string }[];
  conceptTitles: Record<string, string>;
  todayISO: string;
  canReverify: boolean;
  reverifyNotice: string;
}

const TIERS: Tier[] = ['spec', 'canonical-docs', 'primary-analysis', 'secondary'];

const TIER_LABEL: Record<Tier, string> = {
  spec: 'spec',
  'canonical-docs': 'canonical docs',
  'primary-analysis': 'primary analysis',
  secondary: 'secondary',
};

const TIER_RANK: Record<Tier, number> = {
  spec: 0,
  'canonical-docs': 1,
  'primary-analysis': 2,
  secondary: 3,
};

const TIER_TONE: Record<Tier, string> = {
  spec: 'border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent-soft)]',
  'canonical-docs': 'border-[var(--color-good)] text-[var(--color-good)]',
  'primary-analysis': 'border-[var(--color-rule)] text-[var(--color-ink-2)]',
  secondary: 'border-[var(--color-warn)] text-[var(--color-warn)]',
};

const FRESHNESS_ORDER: Freshness[] = ['never-verified', 'overdue', 'due-soon', 'current', 'unscheduled'];

const FRESHNESS_LABEL: Record<Freshness, string> = {
  'never-verified': 'Never verified',
  overdue: 'Past re-verify window',
  'due-soon': 'Due within 30 days',
  current: 'Current',
  unscheduled: 'Unscheduled',
};

const FRESHNESS_BLURB: Record<Freshness, string> = {
  'never-verified': 'No verifiedAt stamp at all. Nobody has confirmed these against the live source, so no window can start.',
  overdue: 'Past verifiedAt + the window its volatility allows. Work this queue first.',
  'due-soon': 'Inside 30 days of falling out of window. Nothing is wrong yet.',
  current: 'Verified inside its window. No action.',
  unscheduled: 'No concept cites these, so no volatility sets a window. An uncited source is content debt, not a freshness problem.',
};

const FRESHNESS_TONE: Record<Freshness, string> = {
  'never-verified': 'border-[var(--color-danger)] text-[var(--color-danger)]',
  overdue: 'border-[var(--color-danger)] text-[var(--color-danger)]',
  'due-soon': 'border-[var(--color-warn)] text-[var(--color-warn)]',
  current: 'border-[var(--color-good)] text-[var(--color-good)]',
  unscheduled: 'border-[var(--color-rule)] text-[var(--color-ink-3)]',
};

type SortKey = 'title' | 'tier' | 'host' | 'due' | 'cites';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'due', label: 'Re-verify urgency' },
  { key: 'title', label: 'Title (A–Z)' },
  { key: 'tier', label: 'Tier' },
  { key: 'host', label: 'Publisher' },
  { key: 'cites', label: 'Most cited' },
];

function Chip({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded border px-1.5 py-px text-[11px] leading-[18px] ${className}`}>
      {children}
    </span>
  );
}

function dueText(r: SourceRow): string {
  if (r.freshness === 'never-verified') return 'never verified';
  if (r.freshness === 'unscheduled') return 'no window';
  if (r.daysLeft === null || r.dueAt === null) return '—';
  if (r.daysLeft < 0) return `${r.dueAt} · ${Math.abs(r.daysLeft)}d overdue`;
  return `${r.dueAt} · in ${r.daysLeft}d`;
}

export function SourceTable({
  rows, tracks, conceptTitles, todayISO, canReverify, reverifyNotice,
}: SourceTableProps) {
  const noticeId = useId();
  const [view, setView] = useState<'all' | 'freshness'>('all');
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [track, setTrack] = useState<string>('all');
  const [freshness, setFreshness] = useState<'all' | Freshness>('all');
  const [vendorOnly, setVendorOnly] = useState(false);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<SortKey>('due');
  const [openRow, setOpenRow] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = rows.filter((r) => {
      if (tiers.length > 0 && !tiers.includes(r.tier)) return false;
      if (track === 'uncited') { if (r.cites.length > 0) return false; }
      else if (track !== 'all' && !r.trackIds.includes(track)) return false;
      if (freshness !== 'all' && r.freshness !== freshness) return false;
      if (vendorOnly && !r.vendor) return false;
      if (needle && !`${r.title} ${r.host} ${r.id}`.toLowerCase().includes(needle)) return false;
      return true;
    });
    const urgency = (r: SourceRow) =>
      FRESHNESS_ORDER.indexOf(r.freshness) * 100000 + (r.daysLeft ?? 0);
    out.sort((a, b) => {
      switch (sort) {
        case 'title': return a.title.localeCompare(b.title);
        case 'tier': return TIER_RANK[a.tier] - TIER_RANK[b.tier] || a.title.localeCompare(b.title);
        case 'host': return a.host.localeCompare(b.host) || a.title.localeCompare(b.title);
        case 'cites': return b.cites.length - a.cites.length || a.title.localeCompare(b.title);
        default: return urgency(a) - urgency(b) || a.title.localeCompare(b.title);
      }
    });
    return out;
  }, [rows, tiers, track, freshness, vendorOnly, q, sort]);

  const grouped = useMemo(() => {
    const m = new Map<Freshness, SourceRow[]>();
    for (const f of FRESHNESS_ORDER) m.set(f, []);
    for (const r of filtered) m.get(r.freshness)!.push(r);
    return m;
  }, [filtered]);

  const filtersActive =
    tiers.length > 0 || track !== 'all' || freshness !== 'all' || vendorOnly || q.trim() !== '';

  function toggleTier(t: Tier) {
    setTiers((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function reset() {
    setTiers([]); setTrack('all'); setFreshness('all'); setVendorOnly(false); setQ('');
  }

  return (
    <div>
      {!canReverify && (
        <p
          id={noticeId}
          className="mb-4 rounded border border-[var(--color-rule)] bg-[var(--color-warn-soft)] px-3 py-2 text-[13px] text-[var(--color-warn)]"
        >
          <strong className="font-semibold">Re-verify is off in this mode.</strong> {reverifyNotice}{' '}
          Every source link below still opens, so you can read and check by hand — only stamping{' '}
          <code className="font-mono">verifiedAt</code> back into the content files is unavailable.
        </p>
      )}

      <div className="mb-3 flex gap-1 border-b border-[var(--color-rule)]" role="tablist" aria-label="Source views">
        {(['all', 'freshness'] as const).map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={`-mb-px border-b-2 px-3 py-1.5 text-[13px] ${
              view === v
                ? 'border-[var(--color-accent)] text-[var(--color-ink)]'
                : 'border-transparent text-[var(--color-ink-3)] hover:text-[var(--color-ink)]'
            }`}
          >
            {v === 'all' ? 'All sources' : 'Freshness board'}
          </button>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-end gap-x-5 gap-y-3 rounded border border-[var(--color-rule)] bg-[var(--color-surface)] p-3">
        <fieldset className="border-0 p-0">
          <legend className="mb-1 text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">Tier</legend>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {TIERS.map((t) => (
              <label key={t} className="flex items-center gap-1.5 text-[13px]">
                <input type="checkbox" checked={tiers.includes(t)} onChange={() => toggleTier(t)} />
                {TIER_LABEL[t]}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="src-track" className="mb-1 block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
            Track
          </label>
          <select
            id="src-track"
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-2 py-1 text-[13px]"
          >
            <option value="all">Any track</option>
            <option value="uncited">Not cited by any concept</option>
            {tracks.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="src-fresh" className="mb-1 block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
            Freshness
          </label>
          <select
            id="src-fresh"
            value={freshness}
            onChange={(e) => setFreshness(e.target.value as 'all' | Freshness)}
            className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-2 py-1 text-[13px]"
          >
            <option value="all">Any state</option>
            {FRESHNESS_ORDER.map((f) => <option key={f} value={f}>{FRESHNESS_LABEL[f]}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="src-sort" className="mb-1 block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
            Sort
          </label>
          <select
            id="src-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-2 py-1 text-[13px]"
          >
            {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>

        <div className="min-w-[200px] flex-1">
          <label htmlFor="src-q" className="mb-1 block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
            Find
          </label>
          <input
            id="src-q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="title, publisher or id"
            className="w-full rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-2 py-1 text-[13px]"
          />
        </div>

        <label className="flex items-center gap-1.5 pb-1 text-[13px]">
          <input type="checkbox" checked={vendorOnly} onChange={(e) => setVendorOnly(e.target.checked)} />
          Vendor-published only
        </label>

        <button
          type="button"
          onClick={reset}
          disabled={!filtersActive}
          className="rounded border border-[var(--color-rule)] px-2 py-1 text-[13px] text-[var(--color-ink-2)] hover:text-[var(--color-ink)] disabled:opacity-40"
        >
          Reset
        </button>
      </div>

      <p aria-live="polite" className="mb-3 text-[13px] text-[var(--color-ink-2)]">
        Showing <strong className="font-semibold text-[var(--color-ink)]">{filtered.length}</strong> of {rows.length} sources.
        {' '}Windows computed against <span className="font-mono">{todayISO}</span>.
        {filtered.length === 0 && ' Nothing matches these filters — widen them or reset.'}
      </p>

      {view === 'all' ? (
        <Table
          rows={filtered}
          conceptTitles={conceptTitles}
          canReverify={canReverify}
          noticeId={canReverify ? undefined : noticeId}
          openRow={openRow}
          setOpenRow={setOpenRow}
          caption="Every source, with tier, publisher, dates and re-verify state."
        />
      ) : (
        <div className="flex flex-col gap-8">
          {FRESHNESS_ORDER.map((f) => {
            const list = grouped.get(f) ?? [];
            return (
              <section key={f} aria-labelledby={`fresh-${f}`}>
                <h2 id={`fresh-${f}`} className="flex items-baseline gap-2 text-[15px] font-semibold">
                  <Chip className={FRESHNESS_TONE[f]}>{FRESHNESS_LABEL[f]}</Chip>
                  <span className="text-[var(--color-ink-3)]">{list.length}</span>
                </h2>
                <p className="mt-1 mb-2 max-w-[70ch] text-[13px] text-[var(--color-ink-2)]">{FRESHNESS_BLURB[f]}</p>
                {list.length === 0 ? (
                  <p className="rounded border border-dashed border-[var(--color-rule)] px-3 py-2 text-[13px] text-[var(--color-ink-3)]">
                    Nothing in this bucket{filtersActive ? ' under the current filters' : ''}.
                  </p>
                ) : (
                  <Table
                    rows={list}
                    conceptTitles={conceptTitles}
                    canReverify={canReverify}
                    noticeId={canReverify ? undefined : noticeId}
                    openRow={openRow}
                    setOpenRow={setOpenRow}
                    caption={`${FRESHNESS_LABEL[f]} — ${list.length} sources.`}
                  />
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Table({
  rows, conceptTitles, canReverify, noticeId, openRow, setOpenRow, caption,
}: {
  rows: SourceRow[];
  conceptTitles: Record<string, string>;
  canReverify: boolean;
  noticeId?: string;
  openRow: string | null;
  setOpenRow: (id: string | null) => void;
  caption: string;
}) {
  if (rows.length === 0) return null;
  return (
    <div className="overflow-x-auto rounded border border-[var(--color-rule)] bg-[var(--color-surface)]">
      <table className="w-full min-w-[1080px] border-collapse text-[13px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-[var(--color-rule)] text-left text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
            <th scope="col" className="px-3 py-2 font-normal">Source</th>
            <th scope="col" className="px-3 py-2 font-normal">Tier</th>
            <th scope="col" className="px-3 py-2 font-normal">Publisher</th>
            <th scope="col" className="px-3 py-2 font-normal">Published</th>
            <th scope="col" className="px-3 py-2 font-normal">Verified</th>
            <th scope="col" className="px-3 py-2 font-normal">Re-verify due</th>
            <th scope="col" className="px-3 py-2 font-normal">Cited by</th>
            <th scope="col" className="px-3 py-2 font-normal">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const open = openRow === r.id;
            return (
              <Row
                key={r.id}
                r={r}
                open={open}
                onToggle={() => setOpenRow(open ? null : r.id)}
                conceptTitles={conceptTitles}
                canReverify={canReverify}
                noticeId={noticeId}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Row({
  r, open, onToggle, conceptTitles, canReverify, noticeId,
}: {
  r: SourceRow;
  open: boolean;
  onToggle: () => void;
  conceptTitles: Record<string, string>;
  canReverify: boolean;
  noticeId?: string;
}) {
  return (
    <>
      <tr id={r.id} className="scroll-mt-24 border-b border-[var(--color-rule)] align-top">
        <th scope="row" className="max-w-[340px] px-3 py-2 text-left font-normal">
          {r.external ? (
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium text-[var(--color-ink)] underline decoration-[var(--color-rule)] underline-offset-2 hover:text-[var(--color-accent)]"
            >
              {r.title}
              <span aria-hidden="true"> ↗</span>
              <span className="sr-only"> (opens the source in a new tab)</span>
            </a>
          ) : (
            <>
              <span className="font-medium text-[var(--color-ink)]">{r.title}</span>
              <span className="mt-0.5 block text-[11px] text-[var(--color-ink-3)]">
                Not a URL — lives in this repo at{' '}
                <span className="font-mono">{r.url}</span>
              </span>
            </>
          )}
          <span className="mt-0.5 block font-mono text-[11px] text-[var(--color-ink-3)]">{r.id}</span>
        </th>
        <td className="px-3 py-2">
          <Chip className={TIER_TONE[r.tier]}>{TIER_LABEL[r.tier]}</Chip>
        </td>
        <td className="px-3 py-2 text-[var(--color-ink-2)]">
          <span className="block">{r.host}</span>
          {r.vendor && (
            <Chip className="mt-0.5 border-[var(--color-warn)] text-[var(--color-warn)]">
              vendor
            </Chip>
          )}
        </td>
        <td className="whitespace-nowrap px-3 py-2 font-mono text-[12px] text-[var(--color-ink-2)]">
          {r.publishedAt ?? '—'}
        </td>
        <td className="whitespace-nowrap px-3 py-2 font-mono text-[12px] text-[var(--color-ink-2)]">
          {r.verifiedAt ?? <span className="text-[var(--color-danger)]">never</span>}
        </td>
        <td className="whitespace-nowrap px-3 py-2">
          <Chip className={FRESHNESS_TONE[r.freshness]}>{dueText(r)}</Chip>
          {r.volatility && (
            <span className="mt-0.5 block text-[11px] text-[var(--color-ink-3)]">
              {r.volatility} · {r.windowDays}d window
            </span>
          )}
        </td>
        <td className="px-3 py-2">
          {r.cites.length === 0 ? (
            <span className="text-[var(--color-ink-3)]">no concept cites this</span>
          ) : (
            <details className="max-w-[280px]">
              <summary className="cursor-pointer text-[var(--color-ink-2)]">
                {r.cites.length} concept{r.cites.length === 1 ? '' : 's'}
              </summary>
              <ul className="mt-1 flex flex-col gap-0.5">
                {r.cites.map((cid) => (
                  <li key={cid}>
                    <Link href={`/c/${cid}`} className="text-[var(--color-accent)] hover:underline">
                      {conceptTitles[cid] ?? cid}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </td>
        <td className="px-3 py-2">
          <button
            type="button"
            disabled={!canReverify}
            aria-describedby={noticeId}
            aria-expanded={canReverify ? open : undefined}
            title={canReverify ? undefined : 'Needs the local install'}
            onClick={canReverify ? onToggle : undefined}
            className="whitespace-nowrap rounded border border-[var(--color-rule)] px-2 py-1 text-[12px] text-[var(--color-ink-2)] hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Re-verify
          </button>
        </td>
      </tr>
      {canReverify && open && (
        <tr className="border-b border-[var(--color-rule)] bg-[var(--color-surface-2)]">
          <td colSpan={8} className="px-3 py-3">
            <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-[var(--color-ink-3)]">
              Re-verify · {r.id}
            </p>
            <ol className="ml-4 list-decimal text-[13px] text-[var(--color-ink-2)]">
              <li>
                Open{' '}
                {r.external ? (
                  <a href={r.url} target="_blank" rel="noreferrer noopener" className="text-[var(--color-accent)] underline">
                    {r.url}
                  </a>
                ) : (
                  <span className="font-mono">{r.url}</span>
                )}
              </li>
              <li>Confirm every claim citing it still holds, or amend the claim.</li>
              <li>
                Stamp <code className="font-mono">verifiedAt: {new Date().toISOString().slice(0, 10)}</code> on this
                source in the content files.
              </li>
            </ol>
            <p className="mt-2 text-[12px] text-[var(--color-warn)]">
              Step 3 is manual for now — writing the stamp back through this screen is not built yet, so nothing here
              has edited your content.
            </p>
          </td>
        </tr>
      )}
    </>
  );
}
