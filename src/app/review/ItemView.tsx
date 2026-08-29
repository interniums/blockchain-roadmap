'use client';

import { useEffect, useRef } from 'react';
import type { Confidence, Rating, ReviewItem } from './types';
import { ChoiceButton, Kbd, Label, Panel, PrimaryButton } from './ui';

export type ItemStage = 'prompt' | 'revealed' | 'confidence' | 'saving';

export const GRADES: { rating: Rating; title: string; body: string }[] = [
  { rating: 1, title: 'Again', body: 'Could not retrieve it, or retrieved it wrong.' },
  { rating: 2, title: 'Hard', body: 'Got there, but slowly or only in part.' },
  { rating: 3, title: 'Good', body: 'Retrieved it correctly, with effort.' },
  { rating: 4, title: 'Easy', body: 'Immediate and complete.' },
];

export const CONFIDENCES: { level: Confidence; title: string; body: string }[] = [
  { level: 1, title: 'Low', body: 'I was guessing, or knew I was shaky.' },
  { level: 2, title: 'Medium', body: 'Fairly sure, with a soft edge somewhere.' },
  { level: 3, title: 'High', body: 'I was certain before I looked.' },
];

/**
 * One concept, one screen. Prompt → reveal → grade → confidence.
 *
 * Confidence is asked after the grade and about the moment *before* the reveal, because the pairing
 * that matters is what you believed against what turned out to be true.
 */
export function ItemView({
  item,
  stage,
  onReveal,
  onGrade,
  onConfidence,
}: {
  item: ReviewItem;
  stage: ItemStage;
  onReveal: () => void;
  onGrade: (rating: Rating) => void;
  onConfidence: (level: Confidence) => void;
}) {
  const firstAction = useRef<HTMLButtonElement>(null);

  // Buttons are unmounted between stages, so focus would otherwise fall to <body>.
  useEffect(() => {
    firstAction.current?.focus();
  }, [stage, item.conceptId]);

  return (
    <article aria-labelledby="review-item-title">
      <Label>
        {item.trackTitle} · {item.moduleTitle}
      </Label>

      <h2 id="review-item-title" className="mt-2 text-[22px] font-semibold tracking-tight">
        {item.title}
      </h2>

      {/* The one-liner is a compression of the answer, so it stays behind the reveal with it.
          Printing it above the button turns retrieval into recognition and feeds the scheduler
          a grade for the wrong task. */}
      {stage !== 'prompt' && (
        <p className="mt-3 max-w-[68ch] text-[16px] leading-relaxed text-[var(--color-ink)]">
          {item.oneLine}
        </p>
      )}

      {stage === 'prompt' && (
        <div className="mt-5">
          <p className="max-w-[68ch] text-[13px] leading-relaxed text-[var(--color-ink-2)]">
            Say the full explanation out loud, or write it, before you reveal anything. The retrieval is
            the part that works; reading the answer is not.
          </p>
          <div className="mt-3">
            <PrimaryButton onClick={onReveal} buttonRef={firstAction} hint={<Kbd>space</Kbd>}>
              Reveal the statement
            </PrimaryButton>
          </div>
        </div>
      )}

      {(stage === 'revealed' || stage === 'confidence' || stage === 'saving') && (
        <div className="mt-5">
          <Panel>
            <Label>The statement</Label>
            {item.statement ? (
              <p className="mt-2 max-w-[70ch] whitespace-pre-line text-[14.5px] leading-relaxed text-[var(--color-ink)]">
                {item.statement}
              </p>
            ) : (
              <p className="mt-2 max-w-[70ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
                This concept has no long statement written yet — the one line above is everything the
                curriculum holds for it. Grade yourself against the fuller explanation you gave, not against
                this.
              </p>
            )}
          </Panel>

          {item.misconception && (
            <Panel tone="quiet" className="mt-3">
              <Label>The wrong model to check yourself against</Label>
              <p className="mt-2 max-w-[70ch] text-[13.5px] leading-relaxed text-[var(--color-ink-2)]">
                <span className="font-medium text-[var(--color-ink)]">Commonly believed:</span>{' '}
                {item.misconception.belief}
              </p>
              <p className="mt-1.5 max-w-[70ch] text-[13.5px] leading-relaxed text-[var(--color-ink-2)]">
                <span className="font-medium text-[var(--color-ink)]">Actually:</span>{' '}
                {item.misconception.reality}
              </p>
            </Panel>
          )}
        </div>
      )}

      {stage === 'revealed' && (
        <fieldset className="mt-5 min-w-0 border-0 p-0">
          <legend className="text-[14px] font-medium text-[var(--color-ink)]">
            How did that retrieval actually go?
          </legend>
          <p className="mt-1 max-w-[68ch] text-[12.5px] text-[var(--color-ink-2)]">
            Grade the recall you gave before the reveal, not how much of the statement you recognise now.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            {GRADES.map((g, i) => (
              <ChoiceButton
                key={g.rating}
                title={g.title}
                body={g.body}
                keyHint={String(g.rating)}
                onClick={() => onGrade(g.rating)}
                buttonRef={i === 0 ? firstAction : undefined}
              />
            ))}
          </div>
        </fieldset>
      )}

      {(stage === 'confidence' || stage === 'saving') && (
        <fieldset className="mt-5 min-w-0 border-0 p-0" disabled={stage === 'saving'}>
          <legend className="text-[14px] font-medium text-[var(--color-ink)]">
            Before you revealed it, how sure were you?
          </legend>
          <p className="mt-1 max-w-[68ch] text-[12.5px] text-[var(--color-ink-2)]">
            Recorded separately from correctness, and it is not a second grade. Certain-and-wrong is the
            combination worth catching, and it can only be caught if the two are asked apart.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            {CONFIDENCES.map((c, i) => (
              <ChoiceButton
                key={c.level}
                title={c.title}
                body={c.body}
                keyHint={String(c.level)}
                onClick={() => onConfidence(c.level)}
                buttonRef={i === 0 ? firstAction : undefined}
                disabled={stage === 'saving'}
              />
            ))}
          </div>
        </fieldset>
      )}
    </article>
  );
}
