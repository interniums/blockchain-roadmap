'use client';

import { RECORD_IS_DURABLE, usePracticeRecord, whenLong } from './record';

/**
 * The attempt history: when, outcome, hints used. Read-only — writing an attempt belongs next to
 * the thing that produced it, either the runner or the self-report control above.
 *
 * Rows do not distinguish a failing test from a project that did not build; the store keeps a
 * boolean. That is said in words rather than papered over, because a history that quietly implies
 * more precision than it has is worse than one that admits its resolution.
 */
export function AttemptLog({ practiceId, rungs }: { practiceId: string; rungs: number }) {
  const { attempts, loaded, failed } = usePracticeRecord(practiceId);

  const passes = attempts.filter((a) => a.passed);
  const firstPass = passes.length > 0 ? passes[passes.length - 1] : null;

  return (
    <div>
      <p className="max-w-[74ch] text-[13px] text-[var(--color-ink-2)]">
        Every attempt is kept, including the ones that did not pass — those are the more useful half. A practice you
        passed on the third try after two hints is a different piece of evidence from one you passed cold, and only
        this list can tell them apart.
      </p>

      {failed && (
        <p role="note" className="mt-2 max-w-[74ch] text-[12px] text-[var(--color-warn)]">
          The store did not answer, so this list is not complete. Nothing was invented to fill the gap.
        </p>
      )}

      <div className="mt-3">
        {!loaded ? (
          <p className="rounded border border-dashed border-[var(--color-rule)] px-3 py-2 text-[13px] text-[var(--color-ink-3)]">
            Reading the attempt history…
          </p>
        ) : attempts.length === 0 ? (
          <p className="rounded border border-dashed border-[var(--color-rule)] px-3 py-2 text-[13px] text-[var(--color-ink-3)]">
            Nothing recorded yet. An empty history is not a failed practice — it means no attempt has been logged
            here, by you or by a run.
          </p>
        ) : (
          <>
            <p className="text-[12.5px] text-[var(--color-ink-2)]">
              {attempts.length} attempt{attempts.length === 1 ? '' : 's'} ·{' '}
              {passes.length === 0 ? 'none passed yet' : `${passes.length} passed`}
              {firstPass && (
                <>
                  {' · first pass '}
                  {firstPass.hintsUsed === 0
                    ? 'came with no hints taken'
                    : `came after ${firstPass.hintsUsed} rung${firstPass.hintsUsed === 1 ? '' : 's'}`}
                </>
              )}
            </p>
            <ol className="mt-2 flex flex-col gap-1.5">
              {attempts.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-2 text-[13px]"
                >
                  <span
                    className={`shrink-0 rounded border px-1.5 py-px text-[11px] uppercase tracking-wider ${
                      a.passed
                        ? 'border-[var(--color-good)] text-[var(--color-good)]'
                        : 'border-[var(--color-danger)] text-[var(--color-danger)]'
                    }`}
                  >
                    {a.passed ? 'Passed' : 'Did not pass'}
                  </span>
                  <span className="tabular-nums text-[var(--color-ink-2)]">{whenLong(a.attemptedAt)}</span>
                  <span className="text-[var(--color-ink-3)]">
                    {a.hintsUsed === 0
                      ? 'no hints taken'
                      : `${a.hintsUsed} of ${rungs || a.hintsUsed} hint rung${a.hintsUsed === 1 ? '' : 's'} taken`}
                  </span>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>

      <p className="mt-3 max-w-[74ch] text-[12px] text-[var(--color-ink-3)]">
        A row says pass or not-pass and nothing finer, so a failing test and a project that would not build look the
        same here. The run that produced a row carries its full output; the row itself is deliberately coarse.{' '}
        {RECORD_IS_DURABLE
          ? 'Attempts are kept by the local install and outlive the browser.'
          : 'Attempts are kept in this browser only — this device, not synced anywhere. Clearing site data clears them.'}
      </p>
    </div>
  );
}
