import type { Metadata } from 'next';
import Link from 'next/link';
import { stats } from '@/lib/content/load';
import { ReviewSession } from './ReviewSession';

export const metadata: Metadata = {
  title: 'Review · Chainpath',
  description: 'One concept at a time, interleaved across tracks, capped by the clock.',
};

/**
 * Section 09: single-item focus, no chrome. The page is deliberately thin — a header thin enough
 * to leave by, and the session. Everything that reads or writes state lives in the client leaf.
 */
export default function ReviewPage() {
  const s = stats();

  return (
    <div className="mx-auto w-full max-w-[760px] px-6 py-6">
      <header className="flex items-baseline justify-between gap-4 border-b border-[var(--color-rule)] pb-3">
        <h1 className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">Review</h1>
        <Link
          href="/"
          className="text-[12.5px] text-[var(--color-ink-2)] hover:text-[var(--color-accent)]"
        >
          Leave
        </Link>
      </header>

      <main>
        <ReviewSession poolSize={s.concepts} />
      </main>
    </div>
  );
}
