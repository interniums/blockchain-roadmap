'use client';
import { useEffect, useRef, useState } from 'react';
import { store } from '@/lib/state/client';
import type { ReviewOutcome } from '@/lib/state/store';

/**
 * Inline retrieval prompt. The answer is hidden until you commit — that is the whole mechanism.
 *
 * Grading is the one act this product records. It is the progress signal, the enrolment event for
 * the scheduler, and the thing that credits this concept's prerequisites. Leaving a check ungraded
 * records nothing at all: no skip, no note, no trace. There is nothing to be behind on.
 *
 * What it never reports back: a date, an interval, a countdown, a mastery percentage, or an essay
 * about the scheduler's internals. One sentence about where the concept went in the queue.
 */

const LABEL: Record<string, string> = {
  recall: 'Recall', predict: 'Predict the output',
  'spot-bug': 'Spot the bug', explain: 'Explain why',
};

/** Fired after any inline check writes state, so other panels on the page can refresh. */
export const REVIEW_RECORDED_EVENT = 'chainpath:review-recorded';
export interface ReviewRecordedDetail {
  conceptId: string;
  outcome: 'graded';
}
function announce(detail: ReviewRecordedDetail) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<ReviewRecordedDetail>(REVIEW_RECORDED_EVENT, { detail }));
}

type Rating = 1 | 2 | 3 | 4;
type Confidence = 1 | 2 | 3;

const RATINGS: { value: Rating; label: string; hint: string }[] = [
  { value: 1, label: 'Again', hint: 'I could not retrieve it' },
  { value: 2, label: 'Hard', hint: 'I got there, slowly or partly' },
  { value: 3, label: 'Good', hint: 'I had it' },
  { value: 4, label: 'Easy', hint: 'Immediate, no effort' },
];

const CONFIDENCES: { value: Confidence; label: string }[] = [
  { value: 1, label: 'Not sure' },
  { value: 2, label: 'Fairly sure' },
  { value: 3, label: 'Certain' },
];

/**
 * Position in the queue, never a time. The scheduler knows the interval; saying it out loud turns
 * a memory into an appointment, and an appointment is something you can be late for.
 */
const PLACED: Record<Rating, string> = {
  1: 'That one comes back near the front.',
  2: 'That one comes back before long.',
  3: 'That one goes to the back.',
  4: 'That one goes a long way back.',
};

const BTN =
  'rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-1.5 text-[13px] hover:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:text-[var(--color-ink-3)] disabled:hover:border-[var(--color-rule)]';
const LINKBTN =
  'text-[12px] text-[var(--color-ink-3)] underline underline-offset-2 hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:no-underline';

export function Check({ type = 'recall', concept, children }: { type?: string; concept?: string; children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  const [rating, setRating] = useState<Rating | null>(null);
  const [outcome, setOutcome] = useState<ReviewOutcome | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Once a write has started this check is settled: never record it twice.
  const settledRef = useRef(false);
  const flushRef = useRef<() => void>(() => {});

  const kids = Array.isArray(children) ? children : [children];
  const answer = kids.filter((c) => (c as { type?: { displayName?: string } })?.type?.displayName === 'Answer');
  const prompt = kids.filter((c) => (c as { type?: { displayName?: string } })?.type?.displayName !== 'Answer');

  const label = LABEL[type] ?? 'Check';

  async function grade(confidence: Confidence) {
    if (!concept || rating === null || settledRef.current) return;
    settledRef.current = true;
    setBusy(true);
    setError(null);
    try {
      const result = await store.recordReview(concept, rating, confidence);
      setOutcome(result);
      announce({ conceptId: concept, outcome: 'graded' });
    } catch {
      settledRef.current = false;
      setError('That grade could not be recorded. Nothing was saved — try again.');
    } finally {
      setBusy(false);
    }
  }

  // A rating chosen but not confirmed still counts — it is a real judgement, and losing it on
  // navigation would be worse than recording it without the confidence figure.
  useEffect(() => {
    flushRef.current = () => {
      if (!revealed || settledRef.current || !concept || rating === null) return;
      settledRef.current = true;
      void store.recordReview(concept, rating).catch(() => {});
    };
  });
  useEffect(() => () => flushRef.current(), []);

  const graded = outcome !== null;

  return (
    <section className="my-6 rounded-md border border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)] p-4">
      <p className="m-0 text-[11px] uppercase tracking-wider text-[var(--color-accent)]">{label}</p>
      <div className="mt-2 text-[15px]">{prompt}</div>

      {!revealed ? (
        <div className="mt-3">
          <button type="button" onClick={() => setRevealed(true)} className={BTN}>
            Commit to an answer, then reveal
          </button>
        </div>
      ) : (
        <div className="mt-3 border-t border-[var(--color-rule)] pt-3 text-[15px]">
          {answer}

          <div className="mt-4 border-t border-[var(--color-rule)] pt-3">
            {!concept ? (
              <p className="m-0 text-[12px] text-[var(--color-ink-3)]">
                No concept is attached to this check, so there is nothing to schedule. That is a
                content bug, not something you did.
              </p>
            ) : graded && rating !== null ? (
              <div aria-live="polite">
                <p className="m-0 text-[12px] text-[var(--color-ink-2)]">{PLACED[rating]}</p>
                {rating === 1 && (
                  <p className="mt-1 mb-0 text-[12px] text-[var(--color-warn)]">
                    Worth a re-read rather than just another attempt — a failed retrieval on
                    something you have read is the signal the model itself is wrong.
                  </p>
                )}
              </div>
            ) : rating === null ? (
              <fieldset className="m-0 border-0 p-0">
                <legend className="mb-1.5 p-0 text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
                  How did that retrieval go?
                </legend>
                <div className="flex flex-wrap gap-2">
                  {RATINGS.map((r) => (
                    <button key={r.value} type="button" title={r.hint} className={BTN}
                      onClick={() => setRating(r.value)}>
                      {r.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 mb-0 text-[12px] text-[var(--color-ink-3)]">
                  Grade the retrieval, not the answer&rsquo;s prose. Moving on without grading is
                  fine and records nothing.
                </p>
              </fieldset>
            ) : (
              <fieldset className="m-0 border-0 p-0" disabled={busy}>
                <legend className="mb-1.5 p-0 text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
                  And how sure were you, before you looked?
                </legend>
                <div className="flex flex-wrap gap-2">
                  {CONFIDENCES.map((c) => (
                    <button key={c.value} type="button" className={BTN} onClick={() => void grade(c.value)}>
                      {c.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 mb-0 text-[12px] text-[var(--color-ink-3)]" aria-live="polite">
                  {busy
                    ? 'Recording…'
                    : 'Confidence is kept apart from correctness, so being certain and wrong is visible instead of averaged away.'}
                </p>
                <p className="mt-1.5 mb-0">
                  <button type="button" className={LINKBTN} onClick={() => setRating(null)}>
                    Change the grade
                  </button>
                </p>
              </fieldset>
            )}

            {error && <p className="mt-2 mb-0 text-[12px] text-[var(--color-danger)]" role="alert">{error}</p>}

            {concept && !store.durable && (
              <p className="mt-2 mb-0 text-[11.5px] text-[var(--color-warn)]">
                Recorded in this browser only — the web copy does not sync, and clearing site data
                clears it.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export function Answer({ children }: { children: React.ReactNode }) { return <>{children}</>; }
Answer.displayName = 'Answer';
