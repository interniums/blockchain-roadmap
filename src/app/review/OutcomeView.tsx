'use client';

import { useEffect, useRef } from 'react';
import type { ConceptLabel, Confidence, Rating, ReviewItem } from './types';
import { Kbd, Panel, PrimaryButton, QuietLink } from './ui';

export interface CreditedView {
  label: ConceptLabel;
  depth: number;
}

export interface Outcome {
  item: ReviewItem;
  rating: Rating;
  confidence: Confidence;
  credited: CreditedView[];
  confidentlyWrong: boolean;
  /** null: no note was needed. true/false: a re-read flag was written, or failed to write. */
  noteSaved: boolean | null;
  noteError: string | null;
  /** The device-only store schedules with a simplified rule and computes no prerequisite credit. */
  creditComputed: boolean;
}

/**
 * Where the concept went in the queue. Position, never an interval — the scheduler holds a real
 * date and this screen deliberately does not repeat it. "In four days" is an appointment; "to the
 * back" is a fact about a queue you are never obliged to reach the end of.
 */
const PLACED: Record<Rating, string> = {
  1: 'That one comes back near the front.',
  2: 'That one comes back before long.',
  3: 'That one goes to the back.',
  4: 'That one goes a long way back.',
};

export function OutcomeView({
  outcome,
  nextLabel,
  onNext,
}: {
  outcome: Outcome;
  nextLabel: string;
  onNext: () => void;
}) {
  const next = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    next.current?.focus();
  }, [outcome.item.conceptId]);

  const o = outcome;

  return (
    <section aria-labelledby="outcome-title" className="mt-6">
      <h2 id="outcome-title" className="sr-only">
        What that review did
      </h2>

      {o.confidentlyWrong && (
        <Panel tone="warn">
          <p className="text-[14px] font-semibold text-[var(--color-ink)]">
            Certain, and wrong. That is the dangerous one.
          </p>
          <p className="mt-2 max-w-[70ch] text-[13.5px] leading-relaxed text-[var(--color-ink-2)]">
            Asking again sooner does not fix a confidently held wrong model — it just tests the same wrong
            model sooner. This concept needs a full re-read.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13.5px]">
            {o.item.reread ? (
              <QuietLink href={o.item.reread.href}>Re-read: {o.item.reread.label}</QuietLink>
            ) : (
              <span className="text-[var(--color-ink-2)]">
                No lesson teaches this concept yet — <QuietLink href={o.item.conceptHref}>the concept
                page</QuietLink> and its sources are the re-read.
              </span>
            )}
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed text-[var(--color-ink-3)]">
            {o.noteSaved === true &&
              'Flagged on the concept as a note, so it outlives this session and you find it there later.'}
            {o.noteSaved === false &&
              `The re-read flag could not be written${o.noteError ? `: ${o.noteError}` : ''}. The review itself was recorded; the flag was not.`}
          </p>
        </Panel>
      )}

      <Panel className={o.confidentlyWrong ? 'mt-3' : ''}>
        <p className="text-[14px] text-[var(--color-ink)]">{PLACED[o.rating]}</p>
        {o.credited.length > 0 && (
          <p className="mt-2 max-w-[70ch] text-[13px] leading-relaxed text-[var(--color-ink-2)]">
            It also counted as practice of{' '}
            {o.credited.map((c, i) => (
              <span key={c.label.conceptId}>
                {i > 0 && ', '}
                <QuietLink href={c.label.href}>{c.label.title}</QuietLink>
              </span>
            ))}
            {' '}underneath it. Advanced work <em>is</em> review of its foundations, which is the only
            reason a queue drawn from 1,490 concepts stays finite.
          </p>
        )}
      </Panel>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <PrimaryButton onClick={onNext} buttonRef={next} hint={<Kbd>n</Kbd>}>
          {nextLabel}
        </PrimaryButton>
        <span className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
          Recorded: {o.rating === 1 ? 'Again' : o.rating === 2 ? 'Hard' : o.rating === 3 ? 'Good' : 'Easy'},
          confidence {o.confidence === 1 ? 'low' : o.confidence === 2 ? 'medium' : 'high'}
        </span>
      </div>
    </section>
  );
}
