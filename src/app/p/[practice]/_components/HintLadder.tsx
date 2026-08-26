'use client';

import { useState } from 'react';
import { Prose } from './Prose';
import { RECORD_IS_DURABLE, usePracticeRecord } from './record';

/**
 * Three rungs, one at a time. Dumping all three is the same as printing the answer,
 * and which rung you needed is the signal worth keeping — so the reveal is written to
 * the store, not held in a component that forgets on navigation.
 *
 * The rung is a high-water mark. "Hide again" collapses the text; it does not un-take
 * the hint, because that would let the record be edited after the fact.
 */
export function HintLadder({ practiceId, hints }: { practiceId: string; hints: unknown[] }) {
  const { level, attempts, loaded, failed, revealNext } = usePracticeRecord(practiceId);
  const [collapsed, setCollapsed] = useState(false);

  if (hints.length === 0) {
    return (
      <p className="rounded border border-dashed border-[var(--color-rule)] px-3 py-2 text-[13px] text-[var(--color-ink-3)]">
        This practice has no hints authored. That is a content gap, not a deliberate difficulty setting.
      </p>
    );
  }

  const taken = Math.min(level, hints.length);
  const shown = collapsed ? 0 : taken;
  const remaining = hints.length - taken;
  const nextIsLast = remaining === 1;
  const noAttemptYet = loaded && attempts.length === 0;

  return (
    <div>
      <p className="max-w-[70ch] text-[13px] text-[var(--color-ink-2)]">
        {hints.length} rungs, revealed one at a time. Take the smallest one that unblocks you and go back to the
        code — the rung you needed says more about what you have not understood than the result of the test does.
      </p>

      <ol className="mt-3 flex flex-col gap-2">
        {hints.slice(0, shown).map((h, i) => (
          <li
            key={i}
            className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-2"
          >
            <span className="block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
              Hint {i + 1} of {hints.length}
            </span>
            <span className="mt-1 block max-w-[70ch] text-[14px] text-[var(--color-ink)]">
              <Prose text={h} />
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        {collapsed && taken > 0 ? (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="rounded border border-[var(--color-rule)] px-3 py-1.5 text-[13px] text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Show the {taken} rung{taken === 1 ? '' : 's'} you already took
          </button>
        ) : (
          <button
            type="button"
            onClick={() => { setCollapsed(false); void revealNext(hints.length); }}
            disabled={!loaded || remaining === 0}
            className="rounded border border-[var(--color-rule)] px-3 py-1.5 text-[13px] text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {remaining === 0 ? 'All rungs taken' : `Reveal hint ${taken + 1} of ${hints.length}`}
          </button>
        )}

        {taken > 0 && !collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="text-[13px] text-[var(--color-ink-3)] underline-offset-2 hover:text-[var(--color-ink)] hover:underline"
          >
            Hide the text
          </button>
        )}

        <span aria-live="polite" className="text-[13px] text-[var(--color-ink-3)]">
          {!loaded
            ? 'Checking which rungs you have already taken…'
            : remaining === 0
              ? 'All rungs taken. There is no solution below this — the acceptance criteria are the answer key.'
              : `${remaining} rung${remaining === 1 ? '' : 's'} still hidden.`}
        </span>
      </div>

      <p className="mt-3 max-w-[70ch] text-[12px] text-[var(--color-ink-3)]" aria-live="polite">
        {!loaded
          ? 'Nothing has been revealed on this page yet.'
          : taken === 0
            ? 'No rung taken here yet. When you take one it is recorded, and any attempt you log afterwards carries the rung count with it.'
            : `Recorded: you took ${taken} of ${hints.length} rung${hints.length === 1 ? '' : 's'} on this practice. ` +
              (RECORD_IS_DURABLE
                ? 'Kept by the local install, and it survives leaving the page.'
                : 'Kept in this browser only — this device, not synced anywhere.')}
      </p>

      {failed && (
        <p className="mt-2 max-w-[70ch] text-[12px] text-[var(--color-warn)]" role="note">
          The last reveal did not reach the store. The hint is on screen, but it is not recorded — treat the rung
          count below as incomplete.
        </p>
      )}

      {nextIsLast && noAttemptYet && !collapsed && (
        <p className="mt-2 max-w-[70ch] text-[12px] text-[var(--color-warn)]" role="note">
          The last rung is the one closest to the answer, and you have no attempt recorded on this practice yet.
          Nothing stops you taking it — but the record will show you took it before you had tried.
        </p>
      )}
    </div>
  );
}
