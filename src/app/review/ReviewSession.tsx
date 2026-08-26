'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { can } from '@/lib/capabilities';
import { store, stateIsDurable } from '@/lib/state/client';
import { interleave, trackCount } from './interleave';
import { ItemView, type ItemStage } from './ItemView';
import { OutcomeView, type CreditedView, type Outcome } from './OutcomeView';
import { loadConceptLabels, loadReviewItems } from './queue';
import type { Confidence, Rating, ReviewItem } from './types';
import { Kbd, Label, Panel, PrimaryButton, QuietLink, whenLabel } from './ui';

type Phase = 'loading' | 'error' | 'empty' | 'start' | 'item' | 'outcome' | 'done';
type EndReason = 'time' | 'queue' | 'stopped';

/** Bounded on purpose: a long absence must not be able to dump a backlog on the screen. */
const MAX_ITEMS = 150;
const YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const CAPS = [5, 10, 20];
const DEFAULT_CAP = 10;

interface Done {
  item: ReviewItem;
  rating: Rating;
  confidence: Confidence;
  confidentlyWrong: boolean;
}

const errText = (e: unknown) => (e instanceof Error ? e.message : String(e));

function reReadNote(item: ReviewItem): string {
  const on = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const where = item.reread ? `Re-read: ${item.reread.label}.` : 'No lesson teaches it yet — start from the sources.';
  return `Confidently wrong in review on ${on}. Graded Again while certain, so this needs a full re-read rather than a shorter interval. ${where}`;
}

export function ReviewSession({ poolSize }: { poolSize: number }) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [itemStage, setItemStage] = useState<ItemStage>('prompt');
  const [fatal, setFatal] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [queue, setQueue] = useState<ReviewItem[]>([]);
  const [index, setIndex] = useState(0);
  const [dueCount, setDueCount] = useState(0);
  const [studied, setStudied] = useState(0);
  const [dropped, setDropped] = useState<string[]>([]);
  const [nextDueAt, setNextDueAt] = useState<number | null>(null);

  const [capMin, setCapMin] = useState(DEFAULT_CAP);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  /** Sampled clock. Render never calls Date.now() itself — that would be impure and could tear. */
  const [nowTs, setNowTs] = useState(0);

  const [pendingRating, setPendingRating] = useState<Rating | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [reviewed, setReviewed] = useState<Done[]>([]);
  const [endReason, setEndReason] = useState<EndReason>('queue');
  const [remainingDue, setRemainingDue] = useState<number | null>(null);

  const [announcement, setAnnouncement] = useState('');
  const startRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  // ---- boot -------------------------------------------------------------------------------
  const load = useCallback(async () => {
    try {
      const summary = await store.summary();
      const due = await store.dueConcepts(Date.now(), MAX_ITEMS);
      const { items, dropped: gone } = await loadReviewItems(
        due.map((d) => ({ conceptId: d.conceptId, due: d.due, reps: d.reps })),
      );
      setStudied(summary.conceptsStudied);
      setDueCount(summary.dueCount);
      setDropped(gone);
      if (!items.length) {
        const upcoming = await store.dueConcepts(Date.now() + YEAR_MS, 1);
        setNextDueAt(upcoming[0]?.due ?? null);
        setAnnouncement('Nothing is due.');
        setPhase('empty');
        return;
      }
      setQueue(interleave(items));
      setAnnouncement(`${summary.dueCount} due. Choose how long you have, then start.`);
      setPhase('start');
    } catch (e) {
      setFatal(errText(e));
      setPhase('error');
    }
  }, []);

  /** Re-fetch the queue: the loading state first, then the read. Safe to call from an event. */
  const boot = useCallback(() => {
    setPhase('loading');
    setFatal(null);
    setAnnouncement('Reading the schedule.');
    void load();
  }, [load]);

  useEffect(() => {
    // The store is an external system and this is the read-on-mount. Every setState inside `load`
    // happens after an await, so nothing is set synchronously here despite what the rule sees.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  // ---- the clock --------------------------------------------------------------------------
  // Sampled every 20s rather than every second: the cap is a boundary, not a countdown to watch.
  useEffect(() => {
    if (phase !== 'item' && phase !== 'outcome') return;
    const id = window.setInterval(() => setNowTs(Date.now()), 20_000);
    return () => window.clearInterval(id);
  }, [phase]);

  const capMs = capMin * 60_000;
  const minutesLeft = useMemo(
    () => (startedAt === null ? null : Math.max(0, Math.ceil((capMs - (nowTs - startedAt)) / 60_000))),
    [nowTs, startedAt, capMs],
  );
  /** What the last clock sample says — used in render. */
  const pastCap = startedAt !== null && nowTs - startedAt >= capMs;
  /** The real check, only ever called from an event handler. */
  const timeUp = () => startedAt !== null && Date.now() - startedAt >= capMs;

  // ---- transitions ------------------------------------------------------------------------
  const finish = useCallback(async (reason: EndReason) => {
    setEndReason(reason);
    setPhase('done');
    setAnnouncement('Session finished.');
    try {
      const summary = await store.summary();
      setRemainingDue(summary.dueCount);
    } catch {
      setRemainingDue(null);
    }
  }, []);

  const startSession = () => {
    const t = Date.now();
    setStartedAt(t);
    setNowTs(t);
    setIndex(0);
    setReviewed([]);
    setOutcome(null);
    setPendingRating(null);
    setSaveError(null);
    setItemStage('prompt');
    setPhase('item');
    setAnnouncement('Session started. First concept.');
  };

  const reveal = () => {
    setItemStage('revealed');
    setAnnouncement('Statement revealed. Grade the recall you gave.');
  };

  const grade = (rating: Rating) => {
    setPendingRating(rating);
    setItemStage('confidence');
    setAnnouncement('Graded. Now how confident were you before the reveal?');
  };

  const chooseConfidence = useCallback(
    async (confidence: Confidence) => {
      const item = queue[index];
      const rating = pendingRating;
      if (!item || rating === null) return;
      setItemStage('saving');
      setSaveError(null);
      try {
        const result = await store.recordReview(item.conceptId, rating, confidence);
        // The scheduler's own rule is that a failing grade credits nothing (creditFactor returns 0
        // for Again). The store still reports ancestors in `credited` on an Again, but their
        // stability is unchanged — so showing them here would claim a refresh that did not happen.
        const rawCredited = rating === 1 ? [] : result.credited;
        const creditedIds = rawCredited.map((c) => c.conceptId);
        const labels = creditedIds.length ? await loadConceptLabels(creditedIds) : [];
        const mastery = await store.masteryFor([item.conceptId, ...creditedIds]);

        const byId = new Map(mastery.map((m) => [m.conceptId, m]));
        const labelById = new Map(labels.map((l) => [l.conceptId, l]));
        const credited: CreditedView[] = [];
        for (const c of rawCredited) {
          const label = labelById.get(c.conceptId);
          if (!label) continue;
          const m = byId.get(c.conceptId);
          credited.push({
            label,
            depth: c.depth,
            creditedShare: m?.creditedShare ?? 0,
            mastery: m?.mastery ?? 0,
          });
        }

        const self = byId.get(item.conceptId);
        const confidentlyWrong = rating === 1 && confidence === 3;
        let noteSaved: boolean | null = null;
        let noteError: string | null = null;
        if (confidentlyWrong) {
          try {
            await store.addNote('concept', item.conceptId, reReadNote(item));
            noteSaved = true;
          } catch (e) {
            noteSaved = false;
            noteError = errText(e);
          }
        }

        setOutcome({
          item,
          rating,
          confidence,
          nextDue: result.nextDue,
          credited,
          mastery: self?.mastery ?? 0,
          creditedShare: self?.creditedShare ?? 0,
          confidentlyWrong,
          noteSaved,
          noteError,
          creditComputed: stateIsDurable,
        });
        setReviewed((prev) => [...prev, { item, rating, confidence, confidentlyWrong }]);
        setNowTs(Date.now());
        setPhase('outcome');
        setAnnouncement(
          credited.length
            ? `Recorded. It also refreshed ${credited.length} ${credited.length === 1 ? 'prerequisite' : 'prerequisites'}.`
            : 'Recorded. Nothing was credited underneath it.',
        );
      } catch (e) {
        setSaveError(errText(e));
        setItemStage('confidence');
      }
    },
    [queue, index, pendingRating],
  );

  const advance = useCallback(async () => {
    setOutcome(null);
    setPendingRating(null);
    setSaveError(null);
    const next = index + 1;
    if (next >= queue.length) {
      await finish('queue');
      return;
    }
    if (timeUp()) {
      await finish('time');
      return;
    }
    setIndex(next);
    setNowTs(Date.now());
    setItemStage('prompt');
    setPhase('item');
    setAnnouncement('Next concept.');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, queue.length, finish, startedAt, capMs]);

  // ---- keyboard ---------------------------------------------------------------------------
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))) return;

      if (phase === 'item') {
        if (itemStage === 'prompt' && (e.key === ' ' || e.key === 'Spacebar')) {
          if (t?.tagName === 'BUTTON') return; // the focused button already handles space
          e.preventDefault();
          reveal();
          return;
        }
        if (itemStage === 'revealed' && ['1', '2', '3', '4'].includes(e.key)) {
          e.preventDefault();
          grade(Number(e.key) as Rating);
          return;
        }
        if (itemStage === 'confidence' && ['1', '2', '3'].includes(e.key)) {
          e.preventDefault();
          void chooseConfidence(Number(e.key) as Confidence);
          return;
        }
      }
      if (phase === 'outcome' && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        void advance();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, itemStage, chooseConfidence, advance]);

  useEffect(() => {
    if (phase === 'start') startRef.current?.focus();
    if (phase === 'done') doneRef.current?.focus();
  }, [phase]);

  // ---- shared bits ------------------------------------------------------------------------
  const live = (
    <p aria-live="polite" className="sr-only">
      {announcement}
    </p>
  );

  const deviceNotice = !can.persistProgress && (
    <Panel tone="warn" className="mt-4">
      <p className="text-[13px] leading-relaxed text-[var(--color-ink-2)]">
        <strong className="font-semibold text-[var(--color-ink)]">This copy stores review history in
        this browser only.</strong>{' '}
        It is not synced and it does not survive a cleared cache or a different machine. Scheduling here uses
        a simplified rule with no prerequisite credit — the FSRS scheduler and the credit graph run in the
        local install.
      </p>
    </Panel>
  );

  const droppedNotice = dropped.length > 0 && (
    <p className="mt-3 text-[12.5px] leading-relaxed text-[var(--color-ink-3)]">
      {dropped.length} scheduled {dropped.length === 1 ? 'concept is' : 'concepts are'} no longer in the
      curriculum ({dropped.slice(0, 3).join(', ')}
      {dropped.length > 3 ? ', …' : ''}) and cannot be shown. They stay in your history; they are not
      counted in the queue below.
    </p>
  );

  // ---- render -----------------------------------------------------------------------------
  if (phase === 'loading') {
    return (
      <div className="mt-10">
        {live}
        <p role="status" className="text-[14px] text-[var(--color-ink-2)]">
          Reading the schedule…
        </p>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="mt-10">
        {live}
        <Panel tone="warn">
          <p className="text-[14px] font-semibold">The schedule could not be read.</p>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-2)]">
            Nothing was lost and nothing was written. The error was: {fatal}
          </p>
          <div className="mt-3">
            <PrimaryButton onClick={() => boot()}>Try again</PrimaryButton>
          </div>
        </Panel>
      </div>
    );
  }

  if (phase === 'empty') {
    return (
      <div className="mt-10">
        {live}
        {studied === 0 ? (
          <>
            <h2 className="text-[20px] font-semibold tracking-tight">Nothing is scheduled yet.</h2>
            <p className="mt-3 max-w-[68ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
              None of the {poolSize.toLocaleString('en-GB')} concepts in the curriculum have entered the
              review schedule. A concept enters it when you finish a lesson that teaches it — reading is what
              puts something into the queue, and it enters unproven, due immediately.
            </p>
            <p className="mt-3 max-w-[68ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
              This is an empty queue, not a missed one. There is nothing here to catch up on.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-[20px] font-semibold tracking-tight">Nothing is due right now.</h2>
            <p className="mt-3 max-w-[68ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
              {studied.toLocaleString('en-GB')} of {poolSize.toLocaleString('en-GB')} concepts are in your
              schedule and all of them are still holding.{' '}
              {nextDueAt !== null
                ? `The next one comes back ${whenLabel(nextDueAt)}.`
                : 'None of them has a future date recorded yet.'}
            </p>
            <p className="mt-3 max-w-[68ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
              Coming back sooner would not help: reviewing something you still know is the least useful thing
              you can do with the time. Read something new instead.
            </p>
          </>
        )}
        {droppedNotice}
        <div className="mt-5 flex flex-wrap gap-4 text-[13.5px]">
          <Link href="/m" className="text-[var(--color-accent)] hover:underline">
            Roadmap
          </Link>
          <Link href="/" className="text-[var(--color-accent)] hover:underline">
            Today
          </Link>
          <button
            type="button"
            onClick={() => boot()}
            className="text-[var(--color-ink-2)] underline hover:text-[var(--color-accent)]"
          >
            Check again
          </button>
        </div>
        {deviceNotice}
      </div>
    );
  }

  if (phase === 'start') {
    const tracks = trackCount(queue);
    return (
      <div className="mt-8">
        {live}
        <h2 className="text-[20px] font-semibold tracking-tight">
          {dueCount.toLocaleString('en-GB')} {dueCount === 1 ? 'concept is' : 'concepts are'} due.
        </h2>
        <p className="mt-3 max-w-[68ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
          {dueCount > 1 && 'You will not necessarily be shown all of them. '}
          The session ends on the clock, not on an empty queue — whatever is left is still there
          afterwards, unpunished and undecayed.
        </p>

        <Panel tone="quiet" className="mt-5">
          <Label>Why this feels harder than it should</Label>
          <p className="mt-2 max-w-[68ch] text-[13.5px] leading-relaxed text-[var(--color-ink-2)]">
            {tracks > 1 ? (
              <>
                The queue is <strong className="font-semibold text-[var(--color-ink)]">interleaved on
                purpose</strong>: it jumps between the {tracks} tracks and their modules instead of working
                through one unit at a time. Blocked practice feels fluent and produces worse retention;
                interleaved practice feels clumsy and produces better retention and transfer. The clumsiness
                is the mechanism, not a bug.
              </>
            ) : (
              <>
                The queue is interleaved across tracks by design, but everything due right now comes from a
                single track, so there is nothing to mix. That changes as soon as you are studying in more
                than one place.
              </>
            )}
          </p>
        </Panel>

        <fieldset className="mt-6 min-w-0 border-0 p-0">
          <legend className="text-[14px] font-medium text-[var(--color-ink)]">
            How long do you have?
          </legend>
          <p className="mt-1 max-w-[68ch] text-[12.5px] text-[var(--color-ink-2)]">
            The cap is time, never a count. You will always finish the concept you are on.
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            {CAPS.map((m) => (
              <label key={m} className="flex items-center gap-2 text-[14px] text-[var(--color-ink)]">
                <input
                  type="radio"
                  name="cap"
                  value={m}
                  checked={capMin === m}
                  onChange={() => setCapMin(m)}
                  className="accent-[var(--color-accent)]"
                />
                {m} minutes
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <PrimaryButton onClick={startSession} buttonRef={startRef}>
            Start reviewing
          </PrimaryButton>
          <span className="text-[12.5px] text-[var(--color-ink-3)]">
            <Kbd>space</Kbd> reveal · <Kbd>1</Kbd>–<Kbd>4</Kbd> grade · <Kbd>n</Kbd> next
          </span>
        </div>

        {droppedNotice}
        {deviceNotice}
      </div>
    );
  }

  if (phase === 'done') {
    const heads: Record<EndReason, string> = {
      time: `Time is up — that was your ${capMin} minutes.`,
      queue: 'That is everything this session had queued.',
      stopped: 'Session ended.',
    };
    const flagged = reviewed.filter((r) => r.confidentlyWrong);
    const tracksSeen = new Set(reviewed.map((r) => r.item.trackTitle));
    return (
      <div className="mt-8">
        {live}
        <h2 ref={doneRef} tabIndex={-1} className="text-[20px] font-semibold tracking-tight">
          {heads[endReason]}
        </h2>
        <p className="mt-3 max-w-[68ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
          {reviewed.length === 0 ? (
            'Nothing was recorded — you ended before grading anything. That is a complete and unremarkable outcome.'
          ) : (
            <>
              {reviewed.length} {reviewed.length === 1 ? 'concept' : 'concepts'} reviewed
              {tracksSeen.size > 1 ? ` across ${tracksSeen.size} tracks` : ''}.
              {endReason === 'time' && ' The item you were on was finished first; nothing was cut off mid-recall.'}
            </>
          )}
        </p>

        {remainingDue !== null && remainingDue > 0 && (
          <p className="mt-3 max-w-[68ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
            {remainingDue.toLocaleString('en-GB')} still due. They keep. Nothing about them gets worse
            because you stopped, and none of it has to happen today.
          </p>
        )}
        {remainingDue === 0 && (
          <p className="mt-3 max-w-[68ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
            Nothing else is due. The rest of the schedule is out in front of you, not behind.
          </p>
        )}

        {flagged.length > 0 && (
          <Panel tone="warn" className="mt-5">
            <p className="text-[14px] font-semibold text-[var(--color-ink)]">
              {flagged.length === 1 ? 'One concept' : `${flagged.length} concepts`} came back certain and
              wrong.
            </p>
            <p className="mt-2 max-w-[68ch] text-[13px] leading-relaxed text-[var(--color-ink-2)]">
              Each of these is queued for a full re-read rather than just a shorter interval, and is flagged
              as a note on the concept so it is still there when you come back.
            </p>
            <ul className="mt-3 flex flex-col gap-1.5 text-[13.5px]">
              {flagged.map((f) => (
                <li key={f.item.conceptId}>
                  <QuietLink href={f.item.reread?.href ?? f.item.conceptHref}>
                    {f.item.reread?.label ?? f.item.title}
                  </QuietLink>
                  <span className="text-[var(--color-ink-3)]"> · {f.item.title}</span>
                </li>
              ))}
            </ul>
          </Panel>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <PrimaryButton onClick={() => boot()}>Another session</PrimaryButton>
          <Link href="/" className="text-[13.5px] text-[var(--color-accent)] hover:underline">
            Back to Today
          </Link>
          <Link href="/m" className="text-[13.5px] text-[var(--color-accent)] hover:underline">
            Roadmap
          </Link>
        </div>
        {deviceNotice}
      </div>
    );
  }

  // phase 'item' | 'outcome'
  const item = queue[index];
  if (!item) {
    return (
      <div className="mt-10">
        {live}
        <p role="status" className="text-[14px] text-[var(--color-ink-2)]">
          The queue ran out. <button type="button" className="underline" onClick={() => void finish('queue')}>Close the session</button>.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {live}

      {saveError && (
        <Panel tone="warn" className="mb-4">
          <p role="alert" className="text-[13.5px] leading-relaxed text-[var(--color-ink-2)]">
            <strong className="font-semibold text-[var(--color-ink)]">That review was not recorded.</strong>{' '}
            {saveError}. Nothing was written, so choosing a confidence again is safe.
          </p>
        </Panel>
      )}

      {phase === 'item' ? (
        <ItemView
          item={item}
          stage={itemStage}
          position={`item ${index + 1} of ${queue.length} queued`}
          onReveal={reveal}
          onGrade={grade}
          onConfidence={(c) => void chooseConfidence(c)}
        />
      ) : (
        outcome && (
          <>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <Label>
                {outcome.item.trackTitle} · {outcome.item.moduleTitle}
              </Label>
              <p className="text-[11px] text-[var(--color-ink-3)]">
                item {index + 1} of {queue.length} queued
              </p>
            </div>
            <h2 className="mt-2 text-[22px] font-semibold tracking-tight">{outcome.item.title}</h2>
            <OutcomeView
              outcome={outcome}
              nextLabel={
                index + 1 >= queue.length ? 'Finish' : pastCap ? 'Finish — time is up' : 'Next concept'
              }
              onNext={() => void advance()}
            />
          </>
        )
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-[var(--color-rule)] pt-3">
        <p aria-hidden="true" className="text-[12px] text-[var(--color-ink-3)]">
          {minutesLeft === null
            ? null
            : minutesLeft > 0
              ? `about ${minutesLeft} min left of ${capMin}`
              : `past the ${capMin} min cap — this is the last one`}
        </p>
        <button
          type="button"
          onClick={() => void finish('stopped')}
          className="text-[12.5px] text-[var(--color-ink-2)] underline hover:text-[var(--color-accent)]"
        >
          End the session here
        </button>
      </div>
    </div>
  );
}
