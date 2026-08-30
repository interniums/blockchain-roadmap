'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { store } from '@/lib/state/client';
import type { GateBlocker } from '@/lib/content/gate';

/**
 * The gate, rendered in place of the prose rather than as a warning above it. A gate that whispers
 * over readable text is not a gate.
 *
 * The page is statically prerendered and state is client-side, so this is the leaf that reads it.
 * Until the read lands the prose renders — an unlocked lesson must never flash a lock at someone
 * who has earned it, and the cost of the other error is that a locked lesson is briefly readable.
 *
 * Vocabulary: "not yet earned", "earned by". Never "locked", never a padlock, never a percentage,
 * never a count of how far behind you are. One thing to read, one click to it.
 */
export function Gate({
  watch, blockers, children,
}: {
  watch: string[];
  blockers: GateBlocker[];
  children: React.ReactNode;
}) {
  const key = watch.join('|');
  const [answered, setAnswered] = useState<Set<string> | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!key) return;
    let live = true;
    store.masteryFor(key.split('|'))
      .then((rows) => {
        if (live) setAnswered(new Set(rows.filter((r) => r.reps > 0).map((r) => r.conceptId)));
      })
      .catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, [key]);

  // Nothing to gate on, the read has not landed, or it failed: show the lesson. A gate that
  // cannot read your record has no business standing in your way.
  if (!blockers.length || answered === null || failed) return <>{children}</>;

  const unmet = blockers.filter((b) => !b.keyConcepts.every((c) => answered.has(c)));
  if (unmet.length === 0) return <>{children}</>;

  const first = unmet[0];
  const rest = unmet.slice(1);

  return (
    <section
      aria-labelledby="gate-heading"
      className="border-l-2 border-[var(--color-warn)] bg-[var(--color-warn-soft)] px-5 py-5"
    >
      <h2 id="gate-heading" className="text-[11px] uppercase tracking-wider text-[var(--color-warn)]">
        Not yet earned
      </h2>

      <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-[var(--color-ink)]">
        This lesson is written assuming you already hold{' '}
        {first.conceptHref ? (
          <Link href={first.conceptHref} className="underline decoration-[var(--color-rule)] underline-offset-2 hover:text-[var(--color-accent)]">
            {first.conceptTitle}
          </Link>
        ) : (
          <strong className="font-medium">{first.conceptTitle}</strong>
        )}
        . Reading it out of order would cost you more than it saves.
      </p>

      <p className="mt-4 text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">Earned by</p>
      {first.lessonHref ? (
        <p className="mt-1">
          <Link
            href={first.lessonHref}
            className="inline-flex items-baseline rounded border border-[var(--color-accent)] bg-[var(--color-accent-soft)] px-3 py-2 text-[14.5px] text-[var(--color-accent)] no-underline"
          >
            {first.lessonTitle}
          </Link>
        </p>
      ) : (
        <p className="mt-1 text-[14.5px] text-[var(--color-ink-2)]">{first.lessonTitle}</p>
      )}

      <p className="mt-3 max-w-[62ch] text-[13px] leading-relaxed text-[var(--color-ink-2)]">
        Answer its check on the way through — any grade, including &ldquo;Again&rdquo; — and this
        opens. Nothing here can be failed, and nothing re-closes.
      </p>

      {rest.length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer text-[13px] text-[var(--color-ink-2)]">
            {rest.length} other {rest.length === 1 ? 'reading' : 'readings'} this one also stands on
          </summary>
          <ul className="mt-2 flex flex-col gap-1.5">
            {rest.map((b) => (
              <li key={b.lessonId} className="text-[13.5px]">
                {b.lessonHref ? (
                  <Link href={b.lessonHref} className="text-[var(--color-ink)] hover:text-[var(--color-accent)]">
                    {b.lessonTitle}
                  </Link>
                ) : (
                  <span className="text-[var(--color-ink-2)]">{b.lessonTitle}</span>
                )}
                <span className="text-[var(--color-ink-3)]"> — for {b.conceptTitle}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
