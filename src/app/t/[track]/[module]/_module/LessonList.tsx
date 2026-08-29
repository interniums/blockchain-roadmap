import Link from 'next/link';
import type { ConceptRef, LessonRow } from './derive';

function ConceptLinks({ refs }: { refs: ConceptRef[] }) {
  return (
    <>
      {refs.map((c, i) => (
        <span key={c.id}>
          {i > 0 && <span className="text-[var(--color-ink-3)]">, </span>}
          <Link
            href={`/c/${c.id}`}
            title={c.oneLine}
            className="text-[var(--color-ink-2)] underline decoration-[var(--color-rule)] underline-offset-2 hover:text-[var(--color-accent)]"
          >
            {c.title}
          </Link>
        </span>
      ))}
    </>
  );
}

/**
 * The lessons, in reading order, and nothing else.
 *
 * No read marks, no scroll percentages, no "last opened", no reading estimates — this app does
 * not record that you were here, so a row cannot report it. Progress belongs to the practice
 * below this list; a lesson is a thing to read, not a box to close.
 */
export function LessonList({
  lessons, trackId, moduleId,
}: { lessons: LessonRow[]; trackId: string; moduleId: string }) {
  if (lessons.length === 0) {
    return (
      <p className="rounded border border-dashed border-[var(--color-rule)] px-3 py-4 text-[13px] text-[var(--color-ink-3)]">
        This module has no lessons authored yet.
      </p>
    );
  }

  return (
    <ol className="flex flex-col gap-1.5">
      {lessons.map((l, i) => (
        <li
          key={l.id}
          className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-2.5"
        >
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="w-5 shrink-0 text-right text-[12px] tabular-nums text-[var(--color-ink-3)]">
              {i + 1}
            </span>
            <h3 className="min-w-0 flex-1 text-[14px] leading-5">
              <Link
                href={`/t/${trackId}/${moduleId}/${l.id}`}
                className="font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)]"
              >
                {l.title}
              </Link>
            </h3>
          </div>
          {l.teaches.length > 0 && (
            <p className="mt-1 pl-8 text-[12.5px] leading-5 text-[var(--color-ink-3)]">
              <span>Teaches: </span>
              <ConceptLinks refs={l.teaches} />
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
