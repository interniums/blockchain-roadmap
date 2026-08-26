'use client';

import { useEffect, useRef } from 'react';
import type { ConceptLabel, Confidence, Rating, ReviewItem } from './types';
import { Kbd, Panel, PrimaryButton, QuietLink, pct, whenLabel } from './ui';

export interface CreditedView {
  label: ConceptLabel;
  depth: number;
  creditedShare: number;
  mastery: number;
}

export interface Outcome {
  item: ReviewItem;
  rating: Rating;
  confidence: Confidence;
  nextDue: number;
  credited: CreditedView[];
  mastery: number;
  creditedShare: number;
  confidentlyWrong: boolean;
  /** null: no note was needed. true/false: a re-read flag was written, or failed to write. */
  noteSaved: boolean | null;
  noteError: string | null;
  /** The device-only store schedules with a simplified rule and computes no prerequisite credit. */
  creditComputed: boolean;
}

/** Why nothing was credited — always a real reason, never silence. */
function whyNoCredit(o: Outcome): string {
  if (!o.creditComputed) {
    return 'This copy keeps progress in the browser and schedules with a simplified rule; prerequisite credit is computed by the local install only.';
  }
  if (o.rating === 1) {
    return 'A failed review credits nothing. Failing this concept says nothing good about the concepts underneath it, so none of them were touched.';
  }
  if (o.item.prereqCount === 0) {
    return 'This concept records no prerequisites of its own, so there was nothing underneath it to refresh.';
  }
  return 'None of its prerequisites are in your schedule yet. Credit only reaches concepts you have already started — it cannot refresh something you have never read.';
}

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
  const untested = o.creditedShare >= 0.5;

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
            A shorter interval does not fix a confidently held wrong model — it just tests the same wrong
            model sooner. This concept needs a full re-read, not a faster card.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13.5px]">
            {o.item.reread ? (
              <QuietLink href={o.item.reread.href}>
                Re-read: {o.item.reread.label}
                {o.item.reread.outlineOnly ? ' (outline only so far)' : ''}
              </QuietLink>
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
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <p className="text-[13.5px] text-[var(--color-ink-2)]">
            Next due <span className="font-medium text-[var(--color-ink)]">{whenLabel(o.nextDue)}</span>
          </p>
          <p className="text-[13.5px] text-[var(--color-ink-2)]">
            Mastery <span className="font-medium text-[var(--color-ink)]">{pct(o.mastery)}</span>
          </p>
        </div>
        {untested && (
          <p className="mt-2 max-w-[70ch] text-[12.5px] leading-relaxed text-[var(--color-ink-2)]">
            {pct(o.creditedShare)} of this concept&rsquo;s durability still comes from prerequisite credit
            rather than from being tested directly. It is held up partly by work you did elsewhere.
          </p>
        )}
      </Panel>

      <Panel tone={o.credited.length ? 'good' : 'quiet'} className="mt-3">
        {o.credited.length > 0 ? (
          <>
            <p className="text-[14px] font-medium text-[var(--color-ink)]">
              That one review also refreshed {o.credited.length}{' '}
              {o.credited.length === 1 ? 'prerequisite' : 'prerequisites'}.
            </p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {o.credited.map((c) => (
                <li key={c.label.conceptId} className="text-[13.5px] leading-snug">
                  <QuietLink href={c.label.href}>{c.label.title}</QuietLink>
                  <span className="text-[var(--color-ink-3)]">
                    {' '}
                    · {c.depth === 1 ? 'one step under' : `${c.depth} steps under`} · {c.label.trackTitle}
                  </span>
                  <span className="block text-[12.5px] text-[var(--color-ink-2)]">
                    {c.creditedShare >= 0.5
                      ? `${pct(c.creditedShare)} of its strength is now credit rather than retrieval — it is overdue for a direct test.`
                      : `${pct(c.creditedShare)} of its strength is credit; the rest you earned by being tested.`}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 max-w-[70ch] text-[12.5px] leading-relaxed text-[var(--color-ink-2)]">
              This is fractional implicit repetition: advanced work <em>is</em> review of its foundations,
              which is the only reason a queue drawn from 1,490 concepts stays finite. Credit advances
              durability; it never counts as a repetition, because you were not actually asked.
            </p>
          </>
        ) : (
          <>
            <p className="text-[13.5px] font-medium text-[var(--color-ink)]">
              Nothing was credited underneath this one.
            </p>
            <p className="mt-1.5 max-w-[70ch] text-[13px] leading-relaxed text-[var(--color-ink-2)]">
              {whyNoCredit(o)}
            </p>
          </>
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
