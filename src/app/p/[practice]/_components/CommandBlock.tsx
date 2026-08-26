'use client';

import { useState } from 'react';

/**
 * A command you can select, read, and copy. Used by both tiers — the runnable one shows what the
 * runner will spawn, the manual one shows what you are being handed. Copy failure is reported, not
 * swallowed: a Copy button that quietly does nothing is worse than no Copy button.
 */
export function CommandBlock({
  command, label, id,
}: {
  command: string;
  label: string;
  id?: string;
}) {
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle');

  function copy() {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      setCopied('fail');
      return;
    }
    navigator.clipboard.writeText(command).then(
      () => setCopied('ok'),
      () => setCopied('fail'),
    );
  }

  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">{label}</p>
      <div className="mt-1 flex flex-wrap items-start gap-2">
        <code
          id={id}
          className="min-w-0 flex-1 overflow-x-auto rounded bg-[var(--color-surface-2)] px-2 py-1.5 font-mono text-[13px] whitespace-pre"
        >
          {command}
        </code>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded border border-[var(--color-rule)] px-2 py-1 text-[12px] text-[var(--color-ink-2)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          Copy
        </button>
      </div>
      <p aria-live="polite" className="mt-1 min-h-[1rem] text-[12px] text-[var(--color-ink-3)]">
        {copied === 'ok' && 'Copied.'}
        {copied === 'fail' && 'The browser blocked the copy — select the command and copy it by hand.'}
      </p>
    </div>
  );
}
