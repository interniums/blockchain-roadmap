'use client';
/**
 * What the app actually knows about you and this concept, and the one control that changes it.
 *
 * Three things this screen must not do: print 0% for a concept nobody ever asked you about,
 * hide that a number came from prerequisite credit rather than retrieval, and offer a control
 * that does nothing. Everything below is arranged around those three.
 */
import { useState } from 'react';

import { can } from '@/lib/capabilities';
import { store } from '@/lib/state/client';
import type { ReviewOutcome } from '@/lib/state/store';

import {
  BAND_TONE, bandOf, CONFIDENCES, creditLevel, dueWords, masteryText, onDate, pct, RATINGS, stampNow,
  standingOf,
} from './mastery';
import { useMasteryScope } from './MasteryScope';
import { Empty, Notice } from './ui';

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export function MasteryPanel({
  conceptId, conceptTitle, prereqIds, creditAncestorCount,
}: {
  conceptId: string;
  conceptTitle: string;
  /** Direct `requires` edges — used only to summarise how solid the ground under this is. */
  prereqIds: string[];
  /** Concepts a passing review here could credit: requires|deepens ancestors, depth ≤ 2. */
  creditAncestorCount: number;
}) {
  const scope = useMasteryScope();

  if (!scope) return <Empty>Your record is not available on this render.</Empty>;

  if (scope.status === 'loading') {
    return (
      <div>
        <h3 className="text-[13.5px] font-semibold text-[var(--color-ink)]">Mastery</h3>
        <p className="mt-2 text-[13px] text-[var(--color-ink-3)]" role="status" aria-live="polite">
          Reading your record…
        </p>
      </div>
    );
  }

  if (scope.status === 'error') {
    return (
      <div>
        <h3 className="text-[13.5px] font-semibold text-[var(--color-ink)]">Mastery</h3>
        <div className="mt-2">
          <Notice tone="danger" title="Your record could not be read">
            The state store did not answer. Nothing was lost — but nothing can be shown either, and a
            number here would be invented.
          </Notice>
        </div>
        <button
          type="button"
          onClick={scope.refresh}
          className="mt-2 rounded border border-[var(--color-rule)] px-3 py-1.5 text-[13px] text-[var(--color-ink-2)] hover:border-[var(--color-accent)]"
        >
          Try again
        </button>
      </div>
    );
  }

  const row = scope.get(conceptId);
  const standing = standingOf(row);
  const now = scope.readAt;   // the moment the record was read, not render time

  return (
    <div>
      <h3 className="text-[13.5px] font-semibold text-[var(--color-ink)]">Mastery</h3>

      {standing === 'untracked' && (
        <div className="mt-2">
          <p className="text-[15px] text-[var(--color-ink)]">Not started.</p>
          <p className="mt-1.5 max-w-[52ch] text-[12.5px] leading-relaxed text-[var(--color-ink-3)]">
            Nothing is recorded for this concept. No lesson has introduced it into your review system and
            you have never graded it — so there is no score to show, which is not the same as a score of
            zero. Grading it below starts its schedule.
          </p>
        </div>
      )}

      {standing === 'unproven' && row && (
        <div className="mt-2">
          <p className="text-[15px] text-[var(--color-ink)]">Introduced, never retrieved.</p>
          <p className="mt-1.5 max-w-[52ch] text-[12.5px] leading-relaxed text-[var(--color-ink-3)]">
            Reading a lesson put this into your review system, but you have never been asked to produce
            it. Its mastery is unknown rather than zero — the first grade you give it is the first real
            evidence either way.
          </p>
          <p className="mt-1.5 text-[12.5px] text-[var(--color-ink-2)]">
            First review {dueWords(row.due!, now)} · {onDate(row.due!)}
          </p>
        </div>
      )}

      {standing === 'reviewed' && row && (
        <div className="mt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-[28px] leading-none font-semibold text-[var(--color-ink)]">
              {masteryText(row.mastery)}
            </span>
            <span className="text-[13px] text-[var(--color-ink-2)]">{bandOf(row.mastery)}</span>
          </div>
          <span
            aria-hidden="true"
            className="mt-2 block h-[5px] w-full max-w-[260px] overflow-hidden rounded-full bg-[var(--color-surface-2)]"
          >
            <span
              className="block h-full rounded-full"
              style={{ width: `${Math.max(2, pct(row.mastery))}%`, background: BAND_TONE[bandOf(row.mastery)] }}
            />
          </span>
          <p className="mt-2 text-[12.5px] text-[var(--color-ink-2)]">
            {plural(row.reps, 'direct retrieval')} · {dueWords(row.due!, now)} · {onDate(row.due!)}
          </p>
          <div className="mt-3">
            <CreditHonesty share={row.creditedShare} reps={row.reps} />
          </div>
        </div>
      )}

      <div className="mt-4">
        <PrerequisiteStrength ids={prereqIds} />
      </div>

      <div className="mt-4 border-t border-[var(--color-rule)] pt-4">
        <ReviewNow
          conceptId={conceptId}
          conceptTitle={conceptTitle}
          creditAncestorCount={creditAncestorCount}
        />
      </div>

      {!can.persistProgress && (
        <p className="mt-3 max-w-[52ch] text-[12px] leading-snug text-[var(--color-ink-3)]">
          You are on the hosted copy. Grades are kept in this browser only — never synced to another
          device, and gone if you clear site data. The local install keeps them in SQLite.
        </p>
      )}
    </div>
  );
}

/**
 * The most useful sentence on this page, and the easiest one to leave out.
 * A concept can look strong purely because you kept reviewing the things built on top of it.
 */
function CreditHonesty({ share, reps }: { share: number; reps: number }) {
  const level = creditLevel(share);
  const percent = pct(share);

  if (level === 'most') {
    return (
      <Notice tone="warn" title="Mostly credit — you have not really been tested on this">
        {percent}% of this concept&rsquo;s stability came from reviewing concepts that stand on it, not
        from producing this one. You have retrieved it directly {plural(reps, 'time')}. The number above is
        softer than it looks; grading it here is how you find out.
      </Notice>
    );
  }
  if (level === 'none') {
    return (
      <p className="max-w-[52ch] text-[12.5px] leading-relaxed text-[var(--color-ink-3)]">
        All of that stability was earned by retrieval — none of it is credit borrowed from work on
        concepts that depend on this one.
      </p>
    );
  }
  return (
    <p className="max-w-[52ch] text-[12.5px] leading-relaxed text-[var(--color-ink-3)]">
      {percent}% of that stability is prerequisite credit — it came from reviewing concepts built on this
      one, not from producing it. The other {100 - percent}% you retrieved yourself,{' '}
      {plural(reps, 'time')}.
    </p>
  );
}

/** How solid the ground under this concept is. Counts only; the list above carries the detail. */
function PrerequisiteStrength({ ids }: { ids: string[] }) {
  const scope = useMasteryScope();
  if (!scope || scope.status !== 'ready') return null;

  if (ids.length === 0) {
    return (
      <p className="text-[12.5px] leading-relaxed text-[var(--color-ink-3)]">
        This concept has no hard prerequisites — nothing underneath it can be the reason it will not
        stick.
      </p>
    );
  }

  const total = ids.length;
  let untracked = 0;
  let unproven = 0;
  let shaky = 0;
  for (const id of ids) {
    const m = scope.get(id);
    const s = standingOf(m);
    if (s === 'untracked') untracked++;
    else if (s === 'unproven') unproven++;
    else if (m && bandOf(m.mastery) === 'shaky') shaky++;
  }
  const weak = untracked + unproven + shaky;

  if (weak === 0) {
    return (
      <p className="max-w-[52ch] text-[12.5px] leading-relaxed text-[var(--color-ink-3)]">
        {total === 1
          ? 'Its one prerequisite is past the shaky band.'
          : `All ${total} of its prerequisites are past the shaky band.`}{' '}
        Difficulty here is this concept&rsquo;s own.
      </p>
    );
  }

  const parts: string[] = [];
  if (untracked > 0) parts.push(total === 1 ? 'not started' : `${untracked} not started`);
  if (unproven > 0) {
    parts.push(total === 1 ? 'introduced but never retrieved' : `${unproven} introduced but never retrieved`);
  }
  if (shaky > 0) parts.push(total === 1 ? 'below 40%' : `${shaky} below 40%`);

  return (
    <p className="max-w-[52ch] text-[12.5px] leading-relaxed text-[var(--color-ink-3)]">
      {total === 1
        ? 'Its one prerequisite is weak'
        : `${weak} of its ${total} prerequisites ${weak === 1 ? 'is' : 'are'} weak`}
      {' — '}{parts.join(', ')}. Each is listed under Requires above with its own number.
    </p>
  );
}

type Done = ReviewOutcome & { rating: 1 | 2 | 3 | 4; confidence: 1 | 2 | 3; at: number };

/** A single review, graded and recorded here. Same scheduler the review queue uses. */
function ReviewNow({
  conceptId, conceptTitle, creditAncestorCount,
}: { conceptId: string; conceptTitle: string; creditAncestorCount: number }) {
  const scope = useMasteryScope();
  const [confidence, setConfidence] = useState<1 | 2 | 3>(2);
  const [pending, setPending] = useState<number | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function grade(rating: 1 | 2 | 3 | 4) {
    setPending(rating);
    setError(null);
    try {
      const outcome = await store.recordReview(conceptId, rating, confidence);
      setDone({ ...outcome, rating, confidence, at: stampNow() });
      scope?.refresh();
    } catch {
      setError('That grade was not recorded — the state store rejected the write. Nothing changed.');
    } finally {
      setPending(null);
    }
  }

  return (
    <section aria-label="Review this concept now">
      <h4 className="text-[13px] font-semibold text-[var(--color-ink)]">Review this now</h4>
      <p className="mt-1 max-w-[52ch] text-[12.5px] leading-relaxed text-[var(--color-ink-3)]">
        Say the statement for &ldquo;{conceptTitle}&rdquo; out loud before you look, then grade what
        happened. It is a self-graded review with the answer already on screen — weaker evidence than an
        item drawn in the review queue, which shows you the prompt and not the answer. It moves the
        schedule exactly the same amount, so grade it honestly or not at all.
      </p>

      <fieldset className="mt-3 border-0 p-0">
        <legend className="text-[12px] text-[var(--color-ink-2)]">
          How sure were you before you checked?
        </legend>
        <div className="mt-1.5 flex flex-wrap gap-3">
          {CONFIDENCES.map((c) => (
            <label key={c.value} className="flex items-center gap-1.5 text-[13px] text-[var(--color-ink-2)]">
              <input
                type="radio"
                name={`confidence-${conceptId}`}
                value={c.value}
                checked={confidence === c.value}
                onChange={() => setConfidence(c.value)}
              />
              {c.label}
            </label>
          ))}
        </div>
        <p className="mt-1 text-[12px] leading-snug text-[var(--color-ink-3)]">
          Recorded separately from the grade. Wrong while sure is a different failure from wrong while
          guessing, and it is the one worth a re-read.
        </p>
      </fieldset>

      <div className="mt-3 flex flex-wrap gap-2">
        {RATINGS.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => grade(r.value)}
            disabled={pending !== null}
            aria-busy={pending === r.value}
            title={r.gloss}
            className="rounded border border-[var(--color-rule)] px-3 py-1.5 text-[13px] text-[var(--color-ink-2)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:cursor-progress disabled:opacity-60"
          >
            {pending === r.value ? 'Recording…' : r.label}
          </button>
        ))}
      </div>

      <div role="status" aria-live="polite" className="mt-3">
        {error && (
          <p className="text-[12.5px] leading-relaxed text-[var(--color-danger)]">{error}</p>
        )}
        {done && !error && <Recorded done={done} creditAncestorCount={creditAncestorCount} />}
      </div>
    </section>
  );
}

/** What the review did — including the part that is invisible everywhere else: the credit. */
function Recorded({ done, creditAncestorCount }: { done: Done; creditAncestorCount: number }) {
  const scope = useMasteryScope();
  const label = RATINGS.find((r) => r.value === done.rating)?.label ?? String(done.rating);
  const confidentlyWrong = done.rating === 1 && done.confidence === 3;

  /**
   * The scheduler's own rules for when credit actually moves an ancestor: a passing grade,
   * and an ancestor that has been retrieved at least once. `outcome.credited` currently also
   * names ancestors whose credit worked out to nothing, so it is filtered here rather than
   * printed — naming a concept that did not move would be the exact dishonesty this page
   * is meant to avoid. (`reps` is unaffected by credit, so the read below is safe either way.)
   */
  const credited = done.rating === 1
    ? []
    : done.credited.filter((c) => (scope?.get(c.conceptId)?.reps ?? 1) > 0);
  const overstated = done.credited.length > 0 && credited.length === 0;

  return (
    <div className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3.5 py-3">
      <p className="text-[13px] text-[var(--color-ink)]">
        Recorded: {label}. Next review {dueWords(done.nextDue, done.at)} · {onDate(done.nextDue)}.
      </p>

      {confidentlyWrong && (
        <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--color-warn)]">
          You were sure and wrong. That is logged as its own signal — it calls for re-reading the lesson
          that teaches this, not just a shorter interval.
        </p>
      )}

      {credited.length > 0 ? (
        <div className="mt-2">
          <p className="text-[12.5px] leading-relaxed text-[var(--color-ink-2)]">
            Also credited {plural(credited.length, 'prerequisite')}. Reviewing this counted as partial
            practice of what it stands on: their next review moved out, their retrieval count did not.
          </p>
          <ul className="mt-1.5 flex flex-col gap-0.5">
            {credited.map((c) => (
              <li key={c.conceptId} className="text-[12.5px] text-[var(--color-ink-2)]">
                {scope?.titleOf(c.conceptId) ?? <span className="font-mono">{c.conceptId}</span>}{' '}
                <span className="text-[var(--color-ink-3)]">
                  · {c.depth === 1 ? 'one step back' : `${c.depth} steps back`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--color-ink-3)]">
          {done.rating === 1
            ? 'No prerequisite credit: a failed review says nothing good about the concepts underneath it.'
            : !store.durable
              ? 'This browser-only copy does not model prerequisite credit. On the local install the same grade would also have pushed out the concepts this one stands on.'
              : overstated
                ? 'No prerequisite credit: the concepts this one stands on are in your review system but have never been retrieved, and credit only builds on a repetition you actually made.'
                : creditAncestorCount === 0
                  ? 'No prerequisite credit: this concept stands on nothing in the graph, so there was nothing to credit.'
                  : `No prerequisite credit: none of its ${creditAncestorCount} reachable prerequisites are in your review system yet. Credit only reaches concepts you have already studied.`}
        </p>
      )}
    </div>
  );
}
