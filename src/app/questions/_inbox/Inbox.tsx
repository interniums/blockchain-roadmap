'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AskQuestion } from '@/components/question';
import { ageWords, daysBetween, formatStamp } from '@/components/question/age';
import { store } from '@/lib/state/client';
import { lookupLabels } from '../labels';
import type { ConceptLabel, OriginLabel } from '../model';
import { QuestionCard } from './QuestionCard';
import { readParked, writeParked } from './park';
import { counts, groupRows, matches, type Filter, type Row, type Sort } from './rows';

type Phase = 'loading' | 'ready' | 'error';

interface Snapshot {
  rows: Row[];
  concepts: Map<string, ConceptLabel>;
  origins: Map<string, OriginLabel>;
  /** One clock for the whole render, so every age on screen is measured from the same instant. */
  at: number;
}

/**
 * Questions come from state, their labels from content. Both are read here, once, and the
 * component only ever renders what came back — there is no optimistic count anywhere.
 */
async function snapshot(): Promise<Snapshot> {
  const rows = await store.questions();
  const parked = await readParked();
  const withPark: Row[] = rows.map((q) => ({ ...q, parked: parked[q.id] === true }));
  const bundle = withPark.length
    ? await lookupLabels(
        withPark.flatMap((r) => r.conceptIds),
        withPark.map((r) => r.raisedFrom ?? '').filter(Boolean),
      )
    : { concepts: [], origins: [] };
  return {
    rows: withPark,
    concepts: new Map(bundle.concepts.map((c) => [c.id, c])),
    origins: new Map(bundle.origins.map((o) => [o.key, o])),
    at: Date.now(),
  };
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'parked', label: 'Parked' },
  { value: 'answered', label: 'Answered' },
  { value: 'all', label: 'Everything' },
];

/**
 * The open-loop inbox. Everything on this screen is your own state, read after mount — so the
 * first paint is a stated loading line rather than a zero that would read as "you have none".
 */
export function Inbox() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Row[]>([]);
  const [concepts, setConcepts] = useState<Map<string, ConceptLabel>>(new Map());
  const [origins, setOrigins] = useState<Map<string, OriginLabel>>(new Map());
  const [now, setNow] = useState(0);
  const [filter, setFilter] = useState<Filter>('open');
  const [sort, setSort] = useState<Sort>('newest');
  const [status, setStatus] = useState('');

  const apply = useCallback((snap: Snapshot, announce?: string) => {
    setConcepts(snap.concepts);
    setOrigins(snap.origins);
    setItems(snap.rows);
    setNow(snap.at);
    setPhase('ready');
    if (announce) setStatus(announce);
  }, []);

  const fail = useCallback((e: unknown) => {
    setError(e instanceof Error ? e.message : 'Could not read your questions.');
    setPhase('error');
  }, []);

  // Reads happen after mount and land through the promise, so an unmount mid-read is a no-op
  // rather than a stray state write.
  useEffect(() => {
    let live = true;
    snapshot()
      .then((s) => { if (live) apply(s); })
      .catch((e) => { if (live) fail(e); });
    return () => { live = false; };
  }, [apply, fail]);

  const reload = useCallback((announce?: string) => {
    snapshot().then((s) => apply(s, announce)).catch(fail);
  }, [apply, fail]);

  const handleAnswer = useCallback(async (id: number, answer: string) => {
    await store.answerQuestion(id, answer);
    const at = Date.now();
    let wasParked = false;
    setItems((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        wasParked = r.parked;
        return { ...r, answer, status: 'answered', resolvedAt: at, parked: false };
      }),
    );
    if (wasParked) await writeParked(id, false);
    setStatus('Answer saved in your own words. The question is closed and the answer is kept.');
  }, []);

  const handlePark = useCallback(async (id: number, parked: boolean) => {
    await writeParked(id, parked);
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, parked } : r)));
    setStatus(parked ? 'Parked. It leaves the open view but keeps ageing.' : 'Reopened. It is back in the open view.');
  }, []);

  const tally = useMemo(() => counts(items), [items]);
  const visible = useMemo(() => items.filter((r) => matches(r, filter)), [items, filter]);
  const groups = useMemo(() => groupRows(visible, sort), [visible, sort]);

  if (phase === 'loading') {
    return (
      <p aria-live="polite" className="rounded border border-dashed border-[var(--color-rule)] p-4 text-[13px] text-[var(--color-ink-2)]">
        Reading your questions…
      </p>
    );
  }

  if (phase === 'error') {
    return (
      <div role="alert" className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] p-4">
        <p className="text-[14px] text-[var(--color-ink)]">The question store did not answer.</p>
        <p className="mt-1 text-[13px] text-[var(--color-ink-2)]">{error}</p>
        <button
          type="button"
          onClick={() => { setPhase('loading'); reload(); }}
          className="mt-3 rounded border border-[var(--color-rule)] px-2.5 py-1 text-[13px] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          Try again
        </button>
      </div>
    );
  }

  const oldestDays = tally.oldestOpen === null ? null : daysBetween(tally.oldestOpen, now);

  return (
    <div>
      <p aria-live="polite" className="sr-only">
        {status}
      </p>

      {items.length === 0 ? (
        <EmptyInbox onCaptured={() => reload('Question captured.')} />
      ) : (
        <>
          <section
            aria-label="Inbox state"
            className="flex flex-wrap items-baseline gap-x-6 gap-y-2 rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-4 py-3"
          >
            <Tally value={tally.open} label="open" />
            <Tally value={tally.parked} label="parked" />
            <Tally value={tally.answered} label="answered" />
            <p className="text-[12.5px] text-[var(--color-ink-3)]">
              {oldestDays === null ? (
                <>No open loop right now — every question you asked has an answer or a park.</>
              ) : (
                <>
                  Oldest open loop: <span className="text-[var(--color-ink-2)]">{ageWords(oldestDays)}</span>{' '}
                  ({formatStamp(tally.oldestOpen)})
                </>
              )}
            </p>
          </section>

          <div className="mt-3 flex flex-wrap items-end gap-x-5 gap-y-3 rounded border border-[var(--color-rule)] bg-[var(--color-surface)] p-3">
            <div>
              <label htmlFor="q-state" className="mb-1 block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
                Showing
              </label>
              <select
                id="q-state"
                value={filter}
                onChange={(e) => setFilter(e.target.value as Filter)}
                className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-2 py-1 text-[13px] text-[var(--color-ink)]"
              >
                {FILTERS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="q-sort" className="mb-1 block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
                Order
              </label>
              <select
                id="q-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-2 py-1 text-[13px] text-[var(--color-ink)]"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
            <div className="ml-auto">
              <AskQuestion
                raisedFrom="/questions"
                where="the inbox"
                onCaptured={() => reload('Question captured.')}
              />
            </div>
          </div>

          {!store.durable && (
            <p className="mt-3 rounded border border-[var(--color-rule)] bg-[var(--color-warn-soft)] px-3 py-2 text-[12.5px] leading-relaxed text-[var(--color-warn)]">
              These questions live in this browser only. They persist here and answering works, but they do not
              follow you to another device, and clearing site data erases them.
            </p>
          )}

          {groups.length === 0 ? (
            <p className="mt-4 rounded border border-dashed border-[var(--color-rule)] p-4 text-[13px] text-[var(--color-ink-2)]">
              Nothing {filter === 'all' ? 'here' : `is ${filter}`} right now. You have {tally.open} open,{' '}
              {tally.parked} parked and {tally.answered} answered —{' '}
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="text-[var(--color-accent)] hover:underline"
              >
                show everything
              </button>
              .
            </p>
          ) : (
            <div className="mt-5 flex flex-col gap-7">
              {groups.map((g) => {
                const label = concepts.get(g.key) ?? null;
                return (
                  <section key={g.key || '__none'} aria-label={label?.title ?? 'Not tied to a concept'}>
                    <header className="border-b border-[var(--color-rule)] pb-1.5">
                      <h3 className="text-[15px] font-semibold">
                        {label?.href ? (
                          <Link href={label.href} className="hover:text-[var(--color-accent)]">
                            {label.title}
                          </Link>
                        ) : (
                          <span>{g.key ? label?.title ?? g.key : 'Not tied to a concept'}</span>
                        )}
                      </h3>
                      <p className="mt-0.5 text-[12.5px] text-[var(--color-ink-3)]">
                        {g.rows.length} {g.rows.length === 1 ? 'question' : 'questions'}
                        {label?.known && (label.moduleTitle || label.trackTitle) && (
                          <> · {[label.moduleTitle, label.trackTitle].filter(Boolean).join(' · ')}</>
                        )}
                        {g.key && !label?.known && <> · this concept id is no longer in the curriculum</>}
                        {!g.key && <> · asked away from a concept page</>}
                      </p>
                    </header>
                    <div className="mt-3 flex flex-col gap-3">
                      {g.rows.map((r) => (
                        <QuestionCard
                          key={r.id}
                          row={r}
                          concept={label}
                          extras={r.conceptIds.slice(1).map((id) => concepts.get(id)).filter((c): c is ConceptLabel => !!c)}
                          origin={r.raisedFrom ? origins.get(r.raisedFrom) ?? null : null}
                          now={now}
                          onAnswer={handleAnswer}
                          onPark={handlePark}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Tally({ value, label }: { value: number; label: string }) {
  return (
    <p className="flex items-baseline gap-1.5">
      <span className={`text-[22px] leading-none tabular-nums ${value === 0 ? 'text-[var(--color-ink-3)]' : 'text-[var(--color-ink)]'}`}>
        {value}
      </span>
      <span className="text-[12.5px] text-[var(--color-ink-2)]">{label}</span>
    </p>
  );
}

/** Fresh install. Says what is true: nothing has been recorded, and where recordings come from. */
function EmptyInbox({ onCaptured }: { onCaptured: () => void }) {
  return (
    <section aria-labelledby="q-empty" className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] p-5">
      <h2 id="q-empty" className="text-[16px] font-semibold">
        Nothing recorded yet
      </h2>
      <p className="mt-2 max-w-[70ch] text-[14px] leading-6 text-[var(--color-ink-2)]">
        This inbox is empty because no question has been captured — not because you have none, and not
        because anything was lost. It fills from reading: select the line that made you stop, press{' '}
        <kbd className="rounded border border-[var(--color-rule)] bg-[var(--color-surface-2)] px-1 font-mono text-[12px]">?</kbd>{' '}
        and keep going. The question is stamped with the concept you were on and with the page you were reading,
        so it can lead you back months later.
      </p>
      <ul className="mt-3 flex max-w-[70ch] flex-col gap-1.5 text-[13.5px] text-[var(--color-ink-2)]">
        <li>· From a lesson — the usual way, and the only one that needs no typing about context.</li>
        <li>· From a concept page, when the statement raises something the lesson did not.</li>
        <li>· From here, for the question that arrives away from the page that caused it.</li>
      </ul>
      <div className="mt-4">
        <AskQuestion raisedFrom="/questions" where="the inbox" hotkey onCaptured={onCaptured} variant="rail" />
      </div>
      {!store.durable && (
        <p className="mt-4 max-w-[70ch] rounded border border-[var(--color-rule)] bg-[var(--color-warn-soft)] px-3 py-2 text-[12.5px] leading-relaxed text-[var(--color-warn)]">
          One thing to know before you start: this copy keeps questions in this browser only. Nothing syncs, and
          clearing site data erases them.
        </p>
      )}
    </section>
  );
}
