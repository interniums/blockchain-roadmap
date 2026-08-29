'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { can } from '@/lib/capabilities';
import { store, stateIsDurable } from '@/lib/state/client';
import { interleave, trackCount } from './interleave';
import { ItemView, type ItemStage } from './ItemView';
import { OutcomeView, type CreditedView, type Outcome } from './OutcomeView';
import { loadConceptLabels, loadReviewItems } from './queue';
import type { Confidence, Rating, ReviewItem } from './types';
import { Kbd, Label, Panel, PrimaryButton, QuietLink } from './ui';

type Phase = 'loading' | 'error' | 'empty' | 'start' | 'item' | 'outcome' | 'done';

/**
 * How much of the queue is pulled into one session. Not a target and never shown: it exists so a
 * long absence cannot load fifteen hundred rows into a browser tab.
 */
const PULL = 60;

interface Done {
  item: ReviewItem;
  confidentlyWrong: boolean;
}

const errText = (e: unknown) => (e instanceof Error ? e.message : String(e));

function reReadNote(item: ReviewItem): string {
  const where = item.reread ? `Re-read: ${item.reread.label}.` : 'No lesson teaches it yet — start from the sources.';
  return `Confidently wrong in review. Graded Again while certain, so this needs a full re-read rather than another attempt. ${where}`;
}

/**
 * The drill. One concept at a time, softest memory first, for as long as you feel like it.
 *
 * There is no session length, no cap, no clock, no count of what is waiting, and no date on
 * anything. You pull items until you stop, and stopping is one click that never asks twice. The
 * scheduler still does its full FSRS work underneath — it just never reports a deadline, because a
 * deadline is the one thing that turns a memory into a debt.
 */
export function ReviewSession() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [itemStage, setItemStage] = useState<ItemStage>('prompt');
  const [fatal, setFatal] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [queue, setQueue] = useState<ReviewItem[]>([]);
  const [index, setIndex] = useState(0);
  const [studied, setStudied] = useState(0);
  const [dropped, setDropped] = useState<string[]>([]);

  const [pendingRating, setPendingRating] = useState<Rating | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [reviewed, setReviewed] = useState<Done[]>([]);

  const [announcement, setAnnouncement] = useState('');
  const startRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  // ---- boot -------------------------------------------------------------------------------
  const load = useCallback(async () => {
    try {
      const summary = await store.summary();
      const next = await store.nextByRetrievability(PULL);
      const { items, dropped: gone } = await loadReviewItems(
        next.map((d) => ({ conceptId: d.conceptId, reps: d.reps })),
      );
      setStudied(summary.conceptsStudied);
      setDropped(gone);
      if (!items.length) {
        setAnnouncement('Nothing has entered the queue yet.');
        setPhase('empty');
        return;
      }
      // Order is retrievability-ascending from the store; interleave then spreads it across
      // tracks without reordering by strength — the softest things stay near the front.
      setQueue(interleave(items));
      setAnnouncement('Ready.');
      setPhase('start');
    } catch (e) {
      setFatal(errText(e));
      setPhase('error');
    }
  }, []);

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

  // ---- transitions ------------------------------------------------------------------------
  const finish = useCallback(() => {
    setPhase('done');
    setAnnouncement('Stopped.');
  }, []);

  const startSession = () => {
    setIndex(0);
    setReviewed([]);
    setOutcome(null);
    setPendingRating(null);
    setSaveError(null);
    setItemStage('prompt');
    setPhase('item');
    setAnnouncement('First concept.');
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

        const labelById = new Map(labels.map((l) => [l.conceptId, l]));
        const credited: CreditedView[] = [];
        for (const c of rawCredited) {
          const label = labelById.get(c.conceptId);
          if (label) credited.push({ label, depth: c.depth });
        }

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
          credited,
          confidentlyWrong,
          noteSaved,
          noteError,
          creditComputed: stateIsDurable,
        });
        setReviewed((prev) => [...prev, { item, confidentlyWrong }]);
        setPhase('outcome');
        setAnnouncement('Recorded.');
      } catch (e) {
        setSaveError(errText(e));
        setItemStage('confidence');
      }
    },
    [queue, index, pendingRating],
  );

  const advance = useCallback(() => {
    setOutcome(null);
    setPendingRating(null);
    setSaveError(null);
    const next = index + 1;
    if (next >= queue.length) {
      finish();
      return;
    }
    setIndex(next);
    setItemStage('prompt');
    setPhase('item');
    setAnnouncement('Next concept.');
  }, [index, queue.length, finish]);

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
        advance();
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
      {dropped.length > 3 ? ', …' : ''}) and cannot be shown. They stay in your history.
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
        <h2 className="text-[20px] font-semibold tracking-tight">Nothing to drill yet.</h2>
        <p className="mt-3 max-w-[68ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
          {studied === 0
            ? 'A concept enters this queue when you answer something about it — an inline check inside a lesson, or a practice you pass. Nothing enters it by being read, so there is nothing here you have neglected.'
            : 'Everything you have answered so far is still holding well enough that asking again would not teach you anything. Read something new instead.'}
        </p>
        {droppedNotice}
        <div className="mt-5 flex flex-wrap gap-4 text-[13.5px]">
          <Link href="/" className="text-[var(--color-accent)] hover:underline">
            The curriculum
          </Link>
          <button
            type="button"
            onClick={() => boot()}
            className="text-[var(--color-ink-2)] underline hover:text-[var(--color-accent)]"
          >
            Look again
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
        <h2 className="text-[20px] font-semibold tracking-tight">Softest first.</h2>
        <p className="mt-3 max-w-[68ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
          One concept at a time, starting with whatever you are least likely to still have. Stop
          whenever you want — there is no length to this and nothing is waiting on the other side of
          it.
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
                The queue is interleaved across tracks by design, but everything in it right now comes from a
                single track, so there is nothing to mix. That changes as soon as you are studying in more
                than one place.
              </>
            )}
          </p>
        </Panel>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <PrimaryButton onClick={startSession} buttonRef={startRef}>
            Start
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
    const flagged = reviewed.filter((r) => r.confidentlyWrong);
    return (
      <div className="mt-8">
        {live}
        <h2 ref={doneRef} tabIndex={-1} className="text-[20px] font-semibold tracking-tight">
          Stopped.
        </h2>
        <p className="mt-3 max-w-[68ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
          {reviewed.length === 0
            ? 'Nothing was recorded — you stopped before grading anything. That is a complete and unremarkable outcome.'
            : 'Everything you graded went back into the schedule. What you did not reach is exactly where it was.'}
        </p>

        {flagged.length > 0 && (
          <Panel tone="warn" className="mt-5">
            <p className="text-[14px] font-semibold text-[var(--color-ink)]">
              {flagged.length === 1 ? 'One concept' : `${flagged.length} concepts`} came back certain and
              wrong.
            </p>
            <p className="mt-2 max-w-[68ch] text-[13px] leading-relaxed text-[var(--color-ink-2)]">
              That pairing is the one worth acting on: a wrong model held confidently does not get fixed by
              being asked again. Each is flagged as a note on the concept, so it is still there later.
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
          <PrimaryButton onClick={() => boot()}>Go again</PrimaryButton>
          <Link href="/" className="text-[13.5px] text-[var(--color-accent)] hover:underline">
            The curriculum
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
          The queue ran out.{' '}
          <button type="button" className="underline" onClick={finish}>Stop here</button>.
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
          onReveal={reveal}
          onGrade={grade}
          onConfidence={(c) => void chooseConfidence(c)}
        />
      ) : (
        outcome && (
          <>
            <Label>
              {outcome.item.trackTitle} · {outcome.item.moduleTitle}
            </Label>
            <h2 className="mt-2 text-[22px] font-semibold tracking-tight">{outcome.item.title}</h2>
            <OutcomeView
              outcome={outcome}
              nextLabel={index + 1 >= queue.length ? 'That is the queue' : 'Next concept'}
              onNext={advance}
            />
          </>
        )
      )}

      <div className="mt-8 flex justify-end border-t border-[var(--color-rule)] pt-3">
        <button
          type="button"
          onClick={finish}
          className="text-[12.5px] text-[var(--color-ink-2)] underline hover:text-[var(--color-accent)]"
        >
          Stop
        </button>
      </div>
    </div>
  );
}
