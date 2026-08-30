'use client';

import Link from 'next/link';
import { isOpen, useEarned } from '@/lib/state/useEarned';
import type { ConceptRef, LessonRow } from './derive';

function ConceptLinks({ refs }: { refs: ConceptRef[] }) {
  return (
    <>
      {refs.map((c, i) => (
        <span key={c.id}>
          {i > 0 && <span className="text-[var(--color-ink-3)]">, </span>}
          {c.href ? (
            <Link
              href={c.href}
              title={c.oneLine}
              className="text-[var(--color-ink-2)] underline decoration-[var(--color-rule)] underline-offset-2 hover:text-[var(--color-accent)]"
            >
              {c.title}
            </Link>
          ) : (
            <span title={c.oneLine} className="text-[var(--color-ink-3)]">{c.title}</span>
          )}
        </span>
      ))}
    </>
  );
}

/**
 * The lessons, in reading order, with the not-yet-earned ones dimmed and told what opens them.
 *
 * No read marks, no scroll percentages, no "last opened", no reading estimates — this app does not
 * record that you were here, so a row cannot report it. The only state a row carries is whether it
 * is open yet, and that is derived from what you have answered, never from what you have visited.
 */
export function LessonList({
  lessons, trackId, moduleId,
}: { lessons: LessonRow[]; trackId: string; moduleId: string }) {
  const earned = useEarned(lessons.flatMap((l) => l.watch));

  if (lessons.length === 0) {
    return (
      <p className="rounded border border-dashed border-[var(--color-rule)] px-3 py-4 text-[13px] text-[var(--color-ink-3)]">
        This module has no lessons authored yet.
      </p>
    );
  }

  return (
    <ol className="flex flex-col gap-1.5">
      {lessons.map((l, i) => {
        const open = isOpen(earned, l.watch);
        return (
          <li
            key={l.id}
            className={`rounded border px-3 py-2.5 ${
              open
                ? 'border-[var(--color-rule)] bg-[var(--color-surface)]'
                : 'border-dashed border-[var(--color-rule)] bg-transparent'
            }`}
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="w-5 shrink-0 text-right text-[12px] tabular-nums text-[var(--color-ink-3)]">
                {i + 1}
              </span>
              <h3 className="min-w-0 flex-1 text-[14px] leading-5">
                <Link
                  href={`/t/${trackId}/${moduleId}/${l.id}`}
                  className={`hover:text-[var(--color-accent)] ${
                    open ? 'font-medium text-[var(--color-ink)]' : 'text-[var(--color-ink-3)]'
                  }`}
                >
                  {l.title}
                </Link>
              </h3>
              {!open && (
                <span className="shrink-0 text-[11px] uppercase tracking-wider text-[var(--color-warn)]">
                  not yet earned
                </span>
              )}
            </div>

            {/* A dimmed row without its key is just a wall. Name the reading that opens it. */}
            {!open && l.earnedBy.length > 0 && (
              <p className="mt-1 pl-8 text-[12.5px] leading-5 text-[var(--color-ink-3)]">
                Earned by{' '}
                {l.earnedBy.map((b, j) => (
                  <span key={b.lessonId}>
                    {j > 0 && ', '}
                    {b.href ? (
                      <Link href={b.href} className="text-[var(--color-ink-2)] hover:text-[var(--color-accent)]">
                        {b.title}
                      </Link>
                    ) : b.title}
                  </span>
                ))}
              </p>
            )}

            {open && l.teaches.length > 0 && (
              <p className="mt-1 pl-8 text-[12.5px] leading-5 text-[var(--color-ink-3)]">
                <span>Teaches: </span>
                <ConceptLinks refs={l.teaches} />
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
