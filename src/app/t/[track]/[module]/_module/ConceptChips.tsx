'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { store } from '@/lib/state/client';
import type { Mastery } from '@/lib/state/store';
import type { ConceptRef } from './derive';
import { masteryPct } from './fmt';

/**
 * Concepts introduced here, each carrying your mastery of it. Four distinct states, and the
 * difference between the middle two is the whole point:
 *
 *   no record      — you have never answered anything about it. Not a zero score; no score.
 *   credited       — its stability came mostly from reviewing things built on top of it,
 *                    not from being retrieved. Shown, because it is the one number that
 *                    flatters you if you hide it.
 *   reviewed       — a percentage that means something.
 */
function MasteryMark({ m }: { m: Mastery | undefined }) {
  // Nothing enters the schedule except by being answered, so there is no "in the queue but never
  // retrieved" state to render — a concept either has a record or it does not.
  if (!m || m.reps === 0) {
    return <span className="text-[11px] text-[var(--color-ink-3)]">no record</span>;
  }
  const mostlyCredited = m.creditedShare >= 0.5;
  return (
    <span
      className={`text-[11px] tabular-nums ${mostlyCredited ? 'text-[var(--color-warn)]' : 'text-[var(--color-ink-2)]'}`}
      title={`${m.reps} review${m.reps === 1 ? '' : 's'} · ${Math.round(m.creditedShare * 100)}% of its strength came from prerequisite credit rather than from being asked`}
    >
      {masteryPct(m.mastery)}%{mostlyCredited ? ' · mostly credited' : ''}
    </span>
  );
}

export function ConceptChips({
  concepts, unplaced,
}: { concepts: ConceptRef[]; unplaced: string[] }) {
  const idsKey = concepts.filter((c) => c.resolved).map((c) => c.id).join(',');
  const [byId, setById] = useState<Map<string, Mastery> | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!idsKey) return;
    let live = true;
    store.masteryFor(idsKey.split(','))
      .then((rows) => { if (live) setById(new Map(rows.map((r) => [r.conceptId, r]))); })
      .catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, [idsKey]);

  if (concepts.length === 0) {
    return (
      <p className="text-[13px] text-[var(--color-ink-3)]">
        This module declares no concepts of its own.
      </p>
    );
  }

  const orphan = new Set(unplaced);
  const known = byId ? [...byId.values()] : [];
  const reviewed = known.filter((m) => m.reps > 0);
  const credited = reviewed.filter((m) => m.creditedShare >= 0.5);

  return (
    <>
      <ul className="flex flex-wrap gap-1.5">
        {concepts.map((c) => {
          const isOrphan = orphan.has(c.id);
          if (!c.resolved) {
            return (
              <li key={c.id}>
                <span
                  title="No concept record with this id — a content gap."
                  className="inline-flex items-center gap-1 rounded border border-dashed border-[var(--color-rule)] px-2 py-1 text-[12.5px] text-[var(--color-ink-3)]"
                >
                  {c.id}
                  <span className="text-[10px] uppercase tracking-wide">unwritten</span>
                </span>
              </li>
            );
          }
          if (!c.href) {
            return (
              <li key={c.id}>
                <span
                  title={c.oneLine}
                  className="inline-flex items-center gap-1.5 rounded border border-dashed border-[var(--color-rule)] px-2 py-1 text-[12.5px] text-[var(--color-ink-3)]"
                >
                  {c.title}
                  <span className="text-[10px] uppercase tracking-wide text-[var(--color-warn)]">
                    no lesson teaches it
                  </span>
                </span>
              </li>
            );
          }
          return (
            <li key={c.id}>
              <Link
                href={c.href}
                title={c.oneLine}
                className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 text-[12.5px] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] ${
                  isOrphan
                    ? 'border-dashed border-[var(--color-rule)] text-[var(--color-ink-3)]'
                    : 'border-[var(--color-rule)] bg-[var(--color-surface)] text-[var(--color-ink-2)]'
                }`}
              >
                {c.title}
                {isOrphan && (
                  <span className="text-[10px] uppercase tracking-wide text-[var(--color-warn)]">
                    no lesson
                  </span>
                )}
                {byId && !failed && <MasteryMark m={byId.get(c.id)} />}
              </Link>
            </li>
          );
        })}
      </ul>

      <p aria-live="polite" className="mt-3 max-w-[68ch] text-[12px] text-[var(--color-ink-3)]">
        {failed
          ? 'Mastery could not be read from the store, so no chip above claims one.'
          : !byId
            ? 'Reading your mastery of these concepts…'
            : reviewed.length === 0
              ? 'Nothing recorded yet — you have not answered anything about these concepts. That is what an untouched module looks like, not a score of zero.'
              : `${reviewed.length} of ${concepts.length} answered at least once${
                credited.length > 0
                  ? ` · ${credited.length} held up mostly by prerequisite credit rather than by being asked`
                  : ''
              }.`}
      </p>
    </>
  );
}
