'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

/**
 * Re-runs the doctor. The probes happen on the server during render, so refreshing the route is
 * the whole mechanism — there is no second code path that could disagree with the first.
 */
export function Recheck({ label = 'Run the doctor again' }: { label?: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [runs, setRuns] = useState(0);

  return (
    <span className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => { router.refresh(); setRuns((n) => n + 1); })}
        className="rounded border border-[var(--color-rule)] px-2 py-1 text-[12px] text-[var(--color-ink-2)] hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:text-[var(--color-ink-3)]"
      >
        {pending ? 'Probing…' : label}
      </button>
      <span aria-live="polite" className="text-[12px] text-[var(--color-ink-3)]">
        {pending ? 'Spawning each tool again…' : runs > 0 ? `Re-probed ${runs === 1 ? 'once' : `${runs} times`} this visit.` : ''}
      </span>
    </span>
  );
}
