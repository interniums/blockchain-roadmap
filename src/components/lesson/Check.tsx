'use client';
import { useEffect, useRef, useState } from 'react';
import { store } from '@/lib/state/client';
import type { Mastery, ReviewOutcome } from '@/lib/state/store';

/**
 * Inline retrieval prompt. The answer is hidden until you commit — that is the whole mechanism.
 *
 * What happens after the reveal is the other half: you self-grade, confidence is captured
 * separately from correctness, and the grade goes into the scheduler for this concept — which also
 * credits its prerequisites. Skipping is allowed and is recorded; it is never nagged about.
 */

const LABEL: Record<string, string> = {
  recall: 'Recall', predict: 'Predict the output',
  'spot-bug': 'Spot the bug', explain: 'Explain why',
};

/** Fired after any inline check writes state, so the lesson's review panel can refresh itself. */
export const REVIEW_RECORDED_EVENT = 'chainpath:review-recorded';
export interface ReviewRecordedDetail {
  conceptId: string;
  outcome: 'graded' | 'skipped';
}
function announce(detail: ReviewRecordedDetail) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<ReviewRecordedDetail>(REVIEW_RECORDED_EVENT, { detail }));
}

/**
 * The store has no first-class "skipped" write, so a skip is kept as a durable record under its own
 * note scope. The concept itself enters review unproven when the lesson is marked read.
 */
const SKIP_SCOPE = 'check-skip';

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

const BTN =
  'rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-1.5 text-[13px] hover:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:text-[var(--color-ink-3)] disabled:hover:border-[var(--color-rule)]';
const LINKBTN =
  'text-[12px] text-[var(--color-ink-3)] underline underline-offset-2 hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:no-underline';

function whenDue(ms: number): string {
  const minutes = Math.round((ms - Date.now()) / 60_000);
  if (minutes <= 1) return 'back in the queue now';
  if (minutes < 90) return `back in the queue in about ${minutes} minutes`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `back in the queue in about ${hours} hours`;
  const date = new Date(ms).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  const days = Math.round(hours / 24);
  if (days === 1) return `due again tomorrow (${date})`;
  return `due again in ${days} days (${date})`;
}

const STEPS: Record<number, string> = { 1: 'one step back', 2: 'two steps back' };

export function Check({ type = 'recall', concept, children }: { type?: string; concept?: string; children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  const [rating, setRating] = useState<Rating | null>(null);
  const [outcome, setOutcome] = useState<ReviewOutcome | null>(null);
  const [mastery, setMastery] = useState<Mastery | null>(null);
  const [credited, setCredited] = useState<{ conceptId: string; depth: number }[]>([]);
  const [skipped, setSkipped] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Once a write has started this check is settled: never record it twice.
  const settledRef = useRef(false);
  const flushRef = useRef<() => void>(() => {});

  const kids = Array.isArray(children) ? children : [children];
  const answer = kids.filter((c) => (c as { type?: { displayName?: string } })?.type?.displayName === 'Answer');
  const prompt = kids.filter((c) => (c as { type?: { displayName?: string } })?.type?.displayName !== 'Answer');

  const label = LABEL[type] ?? 'Check';

  async function recordSkip(reason: string) {
    if (!concept || settledRef.current) { setSkipped(true); return; }
    settledRef.current = true;
    setSkipped(true);
    try {
      await store.addNote(SKIP_SCOPE, concept, `Skipped the ${label.toLowerCase()} check on "${concept}" — ${reason}.`);
      announce({ conceptId: concept, outcome: 'skipped' });
    } catch {
      setError('The skip could not be written down. Nothing else changed.');
    }
  }

  async function grade(confidence: Confidence) {
    if (!concept || rating === null || settledRef.current) return;
    settledRef.current = true;
    setBusy(true);
    setError(null);
    try {
      const result = await store.recordReview(concept, rating, confidence);
      setOutcome(result);
      // `credited` names every ancestor the store looked at, including ones that gained nothing:
      // a failed retrieval credits no prerequisite at all, and a prerequisite with no reviews of
      // its own has no stability to advance. Claim only what actually moved.
      const after = await store.masteryFor([concept, ...result.credited.map((c) => c.conceptId)]);
      const byId = new Map(after.map((m) => [m.conceptId, m]));
      setMastery(byId.get(concept) ?? null);
      setCredited(
        rating === 1 ? [] : result.credited.filter((c) => (byId.get(c.conceptId)?.reps ?? 0) > 0),
      );
      announce({ conceptId: concept, outcome: 'graded' });
    } catch {
      settledRef.current = false;
      setError('That grade could not be recorded. Nothing was saved — try again.');
    } finally {
      setBusy(false);
    }
  }

  // Moving on without grading IS the skip. Recorded on the way out, not asked about.
  useEffect(() => {
    flushRef.current = () => {
      if (!revealed || settledRef.current || !concept) return;
      if (rating !== null) {
        settledRef.current = true;
        void store.recordReview(concept, rating).catch(() => {});
      } else {
        settledRef.current = true;
        void store
          .addNote(SKIP_SCOPE, concept, `Skipped the ${label.toLowerCase()} check on "${concept}" — moved on without grading.`)
          .catch(() => {});
      }
    };
  });
  useEffect(() => () => flushRef.current(), []);

  const graded = outcome !== null;
  const creditNote = !store.durable
    ? 'Prerequisite credit is computed by the local install. This device copy schedules the concept on its own.'
    : !graded || credited.length > 0
      ? null
      : rating === 1
        ? 'Nothing was credited to its prerequisites — a failed retrieval says nothing good about the ideas underneath it.'
        : 'No prerequisite gained credit — none of them has been reviewed yet, so there is no stability to advance.';

  return (
    <section className="my-6 rounded-md border border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)] p-4">
      <p className="m-0 flex items-baseline gap-2 text-[11px] uppercase tracking-wider text-[var(--color-accent)]">
        {label}
        {concept && <span className="normal-case tracking-normal text-[var(--color-ink-3)]">· {concept}</span>}
      </p>
      <div className="mt-2 text-[15px]">{prompt}</div>

      {!revealed ? (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setRevealed(true)} className={BTN}>
            Commit to an answer, then reveal
          </button>
          <button
            type="button"
            className={LINKBTN}
            onClick={() => { setRevealed(true); void recordSkip('revealed without committing'); }}
          >
            Skip this check
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
            ) : skipped && !graded ? (
              <p className="m-0 text-[12px] text-[var(--color-ink-3)]" aria-live="polite">
                Skipped — recorded. <strong>{concept}</strong> is not scheduled from this check; it
                enters review unproven when you mark the lesson read.
              </p>
            ) : graded ? (
              <div aria-live="polite">
                <p className="m-0 text-[12px] text-[var(--color-ink-2)]">
                  Recorded as <strong>{RATINGS.find((r) => r.value === rating)?.label}</strong> —{' '}
                  {whenDue(outcome.nextDue)}.
                </p>
                {mastery && (
                  <p className="mt-1 mb-0 text-[12px] text-[var(--color-ink-3)]">
                    Mastery of {concept} is now {Math.round(mastery.mastery * 100)}% over{' '}
                    {mastery.reps} direct review{mastery.reps === 1 ? '' : 's'}
                    {mastery.creditedShare > 0.05 && (
                      <> · {Math.round(mastery.creditedShare * 100)}% of its stability came from
                        prerequisite credit rather than from being tested</>
                    )}
                    .
                  </p>
                )}
                {credited.length > 0 && (
                  <p className="mt-1 mb-0 text-[12px] text-[var(--color-ink-3)]">
                    This counted as partial practice of{' '}
                    {credited.length} prerequisite{credited.length === 1 ? '' : 's'}:{' '}
                    {credited
                      .map((c) => `${c.conceptId} (${STEPS[c.depth] ?? `${c.depth} steps back`})`)
                      .join(', ')}
                    . Their next review moved out; none of it counts as a full repetition.
                  </p>
                )}
                {creditNote && (
                  <p className="mt-1 mb-0 text-[12px] text-[var(--color-ink-3)]">{creditNote}</p>
                )}
                {rating === 1 && (
                  <p className="mt-1 mb-0 text-[12px] text-[var(--color-warn)]">
                    Worth a re-read rather than just a shorter interval — a failed retrieval on a
                    concept you had read is the signal the model itself is wrong.
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
                  Grade the retrieval, not the answer&rsquo;s prose.{' '}
                  <button type="button" className={LINKBTN} onClick={() => void recordSkip('chose not to grade')}>
                    Don&rsquo;t grade this one
                  </button>{' '}
                  — that is recorded too, and moving on without grading counts the same.
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
