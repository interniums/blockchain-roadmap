'use client';

import { CommandBlock } from './CommandBlock';
import { SelfReport } from './SelfReport';
import type { ManualReason } from './explain';

/**
 * Manual tier. The command needs a shell — pipes, chains, loops, globs, a placeholder to fill in —
 * or a binary the runner does not execute. Plan §17 forbids handing a web page a shell, so this
 * one is handed to you instead.
 *
 * The framing matters: this is not a broken feature and not a lesser practice. Your terminal is
 * strictly more capable than the runner, and 135 of the 236 authored practices live here.
 */
export function ManualCheck({
  practiceId, command, why, rungs,
}: {
  practiceId: string;
  command: string | null;
  why: ManualReason;
  rungs: number;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] p-4">
        <p className="mb-3 flex flex-wrap items-center gap-2 text-[13px]">
          <span className="rounded border border-[var(--color-rule)] bg-[var(--color-surface-2)] px-1.5 py-px text-[11px] uppercase tracking-wider text-[var(--color-ink-2)]">
            Run this yourself
          </span>
          <span className="text-[var(--color-ink-2)]">{why.short}</span>
        </p>

        {command ? (
          <>
            <CommandBlock command={command} label="Run this in your terminal, at the root of your repo" />
            <p className="-mt-1 max-w-[70ch] text-[13px] text-[var(--color-ink-2)]">{why.plain}</p>
          </>
        ) : (
          <p className="max-w-[70ch] text-[13px] text-[var(--color-ink-2)]">{why.plain}</p>
        )}

        {why.raw && (
          <p className="mt-2 max-w-[70ch] rounded border border-dashed border-[var(--color-rule)] bg-[var(--color-surface-2)] px-3 py-2 text-[12.5px]">
            <span className="text-[var(--color-ink-3)]">The safety parser&rsquo;s exact words: </span>
            <span className="font-mono text-[var(--color-ink)]">{why.raw}</span>
          </p>
        )}

        <p className="mt-3 max-w-[70ch] text-[12px] text-[var(--color-ink-3)]">
          The app runs what it can run safely and hands you the rest. Of the 236 authored acceptance commands, 101
          reduce to a plain argument list and can be executed and graded here; the other 135 do not, and giving a
          browser page a shell to close that gap would be a worse trade than asking you to paste a line.
        </p>
      </div>

      <div className="rounded border border-dashed border-[var(--color-rule)] p-4">
        <SelfReport
          practiceId={practiceId}
          rungs={rungs}
          intro={
            command
              ? 'When it has finished, say what happened. Nothing here inspects your repo, so this is your report — and it is kept exactly as you state it, failures included.'
              : 'Grade yourself against the acceptance criteria above and say what happened. This is your report, kept exactly as you state it.'
          }
        />
      </div>
    </div>
  );
}
