'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { QuestionBody } from '@/components/question/QuestionBody';
import { wordCount } from '@/components/question/age';
import type { ConceptLabel, OriginLabel } from '../model';
import { stateOf, type Row } from './rows';

const STATE_LABEL: Record<string, string> = { open: 'Open', parked: 'Parked', answered: 'Answered' };

/**
 * One open loop: the question, where it was raised, what it touches, and your answer if you have
 * written one. No age, no date, no "still open after N weeks" — an unanswered question is not a
 * missed appointment, and the only honest thing to say about it is that it is unanswered.
 */
export function QuestionCard({
  row, concept, extras, origin, onAnswer, onPark,
}: {
  row: Row;
  concept: ConceptLabel | null;
  extras: ConceptLabel[];
  origin: OriginLabel | null;
  onAnswer: (id: number, answer: string) => Promise<void>;
  onPark: (id: number, parked: boolean) => Promise<void>;
}) {
  const uid = useId();
  const state = stateOf(row);
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  const [writing, setWriting] = useState(false);
  const [draft, setDraft] = useState(row.answer ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (writing) fieldRef.current?.focus();
  }, [writing]);

  async function save() {
    const text = draft.trim();
    if (!text || busy) return;
    setBusy(true);
    setError(null);
    try {
      await onAnswer(row.id, text);
      setWriting(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save the answer.');
    } finally {
      setBusy(false);
    }
  }

  async function park(next: boolean) {
    setBusy(true);
    setError(null);
    try {
      await onPark(row.id, next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not change the state.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] p-4">
      <div className="flex items-start justify-between gap-4">
        <QuestionBody text={row.text} className="min-w-0 flex-1" />
        <span className="shrink-0 rounded border border-[var(--color-rule)] bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
          {STATE_LABEL[state]}
        </span>
      </div>

      <p className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[12.5px] text-[var(--color-ink-3)]">
        {origin ? (
          origin.href ? (
            <span>
              Raised at{' '}
              <Link href={origin.href} className="text-[var(--color-accent)] hover:underline">
                {origin.label}
              </Link>
            </span>
          ) : (
            <span>Raised at {origin.label} (not in the curriculum now)</span>
          )
        ) : (
          <span>Origin not recorded</span>
        )}
      </p>

      {extras.length > 0 && (
        <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--color-ink-3)]">
          <span>also touches</span>
          {extras.map((c) =>
            c.href ? (
              <Link
                key={c.id}
                href={c.href}
                className="rounded border border-[var(--color-rule)] bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[var(--color-ink-2)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                {c.title}
              </Link>
            ) : (
              <span key={c.id} className="rounded border border-dashed border-[var(--color-rule)] px-1.5 py-0.5">
                {c.title}
              </span>
            ),
          )}
        </p>
      )}

      {row.answer && !writing && (
        <section aria-labelledby={`${uid}-a`} className="mt-3 rounded border border-[var(--color-rule)] bg-[var(--color-surface-2)] p-3">
          <h4 id={`${uid}-a`} className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
            Your answer
          </h4>
          <p className="mt-1.5 whitespace-pre-wrap text-[13.5px] leading-6 text-[var(--color-ink)]">{row.answer}</p>
          <p className="mt-2 text-[12px] text-[var(--color-ink-3)]">
            {wordCount(row.answer)} words
          </p>
        </section>
      )}

      {writing && (
        <div className="mt-3">
          <label htmlFor={`${uid}-f`} className="block text-[13px] font-medium text-[var(--color-ink)]">
            Answer it in your own words
          </label>
          <p className="mt-0.5 max-w-[68ch] text-[12.5px] leading-relaxed text-[var(--color-ink-2)]">
            Not a form field — this is the version of the answer you will re-read in six months, and the one
            that gets you re-tested. Write the explanation, not the keyword.
          </p>
          <textarea
            id={`${uid}-f`}
            ref={fieldRef}
            rows={7}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="mt-2 block w-full resize-y rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-2 text-[13.5px] leading-6 text-[var(--color-ink)] placeholder:text-[var(--color-ink-3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-accent)]"
            placeholder="Because…"
          />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={save}
              disabled={busy || !draft.trim()}
              className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-1.5 text-[13px] text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:text-[var(--color-ink-3)] disabled:hover:border-[var(--color-rule)] disabled:hover:text-[var(--color-ink-3)]"
            >
              {busy ? 'Saving…' : 'Save the answer'}
            </button>
            <button
              type="button"
              onClick={() => { setDraft(row.answer ?? ''); setWriting(false); }}
              className="rounded px-2 py-1.5 text-[13px] text-[var(--color-ink-2)] hover:text-[var(--color-accent)]"
            >
              Cancel
            </button>
            <span className="text-[12px] text-[var(--color-ink-3)]">{wordCount(draft)} words</span>
          </div>
        </div>
      )}

      {!writing && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setWriting(true)}
            className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-2.5 py-1 text-[13px] text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            {row.answer ? 'Revise the answer' : 'Answer it'}
          </button>
          {state !== 'answered' && (
            <button
              type="button"
              onClick={() => park(state !== 'parked')}
              disabled={busy}
              className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-2.5 py-1 text-[13px] text-[var(--color-ink-2)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:text-[var(--color-ink-3)]"
            >
              {state === 'parked' ? 'Reopen' : 'Park it'}
            </button>
          )}
          {concept?.href && (
            <Link
              href={concept.href}
              className="rounded px-1.5 py-1 text-[13px] text-[var(--color-ink-2)] hover:text-[var(--color-accent)]"
            >
              Read the concept
            </Link>
          )}
        </div>
      )}

      {state === 'parked' && !writing && (
        <p className="mt-2 text-[12px] text-[var(--color-ink-3)]">
          Parked — out of the default view, still counted, still ageing.
        </p>
      )}

      {error && (
        <p role="alert" className="mt-2 text-[12.5px] text-[var(--color-danger)]">
          {error}
        </p>
      )}
    </article>
  );
}
