'use client';

import Link from 'next/link';
import { isOpen, useEarned } from '@/lib/state/useEarned';

export interface RailLesson {
  id: string;
  title: string;
  href: string;
  /** concepts whose grading opens this lesson; empty means it is an entry point */
  watch: string[];
}

/**
 * The open module's lessons, with the not-yet-earned ones dimmed rather than hidden or removed.
 *
 * Dimmed and still clickable on purpose: the rail's job is orientation, so you must be able to see
 * the shape of what is ahead. Clicking one lands on the lesson's own gate, which names the single
 * thing to read — a rail that refuses the click would leave you with no way to find that out.
 */
export function RailLessons({
  lessons, activeLessonId,
}: { lessons: RailLesson[]; activeLessonId?: string }) {
  const earned = useEarned(lessons.flatMap((l) => l.watch));

  return (
    <ol className="ml-2 mt-0.5 flex flex-col gap-0.5 border-l border-[var(--color-rule)] pl-2">
      {lessons.map((l) => {
        const active = l.id === activeLessonId;
        const open = isOpen(earned, l.watch);
        return (
          <li key={l.id}>
            <Link
              href={l.href}
              aria-current={active ? 'page' : undefined}
              title={open ? undefined : 'Not yet earned — opens once its prerequisite reading is answered'}
              className={`block rounded px-2 py-0.5 text-[12.5px] ${
                active
                  ? 'text-[var(--color-accent)]'
                  : open
                    ? 'text-[var(--color-ink-3)] hover:text-[var(--color-ink-2)]'
                    : 'text-[var(--color-ink-3)] opacity-45 hover:opacity-100'
              }`}
            >
              {l.title}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
