'use client';

import { useState } from 'react';
import { usePracticeRecord } from './record';

/**
 * You ran it; tell the page what happened.
 *
 * Used wherever the app cannot run the check itself — the manual tier always, and the runnable
 * tier when this build or this machine cannot execute it. A self-reported row and a runner-produced
 * row are the same shape on purpose: the record is a record of attempts, not of verdicts, and it is
 * only worth anything if you put the failures in too.
 *
 * hintsUsed is never asked for. It is the rung count the ladder already recorded.
 */
export function SelfReport({
  practiceId, rungs, intro,
}: {
  practiceId: string;
  rungs: number;
  intro: string;
}) {
  const { level, loaded, failed, logAttempt } = usePracticeRecord(practiceId);
  const [busy, setBusy] = useState(false);
  const [said, setSaid] = useState<string | null>(null);

  async function record(passed: boolean) {
    setBusy(true);
    setSaid(null);
    await logAttempt(passed);
    setBusy(false);
    setSaid(
      `Recorded ${passed ? 'a pass' : 'a failure'}${
        level > 0 ? `, with hint rung ${level} of ${rungs} taken` : ', with no hints taken'
      }. It is in the attempt history below.`,
    );
  }

  return (
    <div>
      <p className="max-w-[70ch] text-[13px] text-[var(--color-ink-2)]">{intro}</p>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void record(true)}
          disabled={busy || !loaded}
          className="rounded border border-[var(--color-good)] px-3 py-1.5 text-[13px] font-medium text-[var(--color-good)] hover:bg-[var(--color-surface-2)] disabled:cursor-not-allowed disabled:border-[var(--color-rule)] disabled:text-[var(--color-ink-3)]"
        >
          It passed
        </button>
        <button
          type="button"
          onClick={() => void record(false)}
          disabled={busy || !loaded}
          className="rounded border border-[var(--color-rule)] px-3 py-1.5 text-[13px] font-medium text-[var(--color-ink)] hover:border-[var(--color-danger)] hover:text-[var(--color-danger)] disabled:cursor-not-allowed disabled:text-[var(--color-ink-3)]"
        >
          It failed
        </button>
        <span className="text-[13px] text-[var(--color-ink-3)]">
          {!loaded
            ? 'Reading what you have already recorded…'
            : level > 0
              ? `Will be recorded with hint rung ${level} of ${rungs} taken.`
              : rungs > 0
                ? 'Will be recorded with no hints taken.'
                : 'This practice has no hints to take.'}
        </span>
      </div>

      <p aria-live="polite" className="mt-2 min-h-[1.25rem] text-[12px] text-[var(--color-ink-2)]">
        {busy ? 'Recording…' : (said ?? '')}
      </p>

      {failed && (
        <p role="note" className="mt-1 max-w-[70ch] text-[12px] text-[var(--color-warn)]">
          The store did not accept that write, so the history below is missing it. Nothing was faked to cover it up.
        </p>
      )}
    </div>
  );
}
