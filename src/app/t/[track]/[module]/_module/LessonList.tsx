'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { store } from '@/lib/state/client';
import type { LessonState } from '@/lib/state/store';
import { LESSON_STATUS, Pill } from './Chrome';
import type { ConceptRef, LessonRow } from './derive';
import { whenShort } from './fmt';

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

/** Your own state on a lesson, drawn separately from the lesson's authoring state. */
function ReadMark({ state }: { state: LessonState | undefined }) {
  if (!state || (state.status === 'unread' && !state.lastOpenedAt)) {
    return <span className="shrink-0 text-[12px] text-[var(--color-ink-3)]">Not opened</span>;
  }
  if (state.status === 'read') {
    return (
      <Pill tone="good" title={state.lastOpenedAt ? `Last opened ${whenShort(state.lastOpenedAt)}` : undefined}>
        Read
      </Pill>
    );
  }
  // scrollPct is stored as written: a fraction from one writer, a percentage from another.
  // A value at or below 1 can only sensibly be a fraction.
  const pct = Math.round(state.scrollPct <= 1 ? state.scrollPct * 100 : state.scrollPct);
  return (
    <Pill tone="accent" title={state.lastOpenedAt ? `Last opened ${whenShort(state.lastOpenedAt)}` : undefined}>
      {pct > 0 ? `Started · ${pct}%` : 'Started'}
    </Pill>
  );
}

/**
 * The lessons, in reading order. Two independent states per row, never merged:
 * how finished the lesson is (authoring) and how far you got (yours).
 * Outlined lessons stay dashed and unfilled — never a finished row you can be fooled by.
 */
export function LessonList({
  lessons, trackId, moduleId,
}: { lessons: LessonRow[]; trackId: string; moduleId: string }) {
  const idsKey = lessons.map((l) => l.id).join(',');
  const [byId, setById] = useState<Map<string, LessonState> | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!idsKey) return;
    let live = true;
    store.lessonState(idsKey.split(','))
      .then((rows) => { if (live) setById(new Map(rows.map((r) => [r.lessonId, r]))); })
      .catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, [idsKey]);

  if (lessons.length === 0) {
    return (
      <p className="rounded border border-dashed border-[var(--color-rule)] px-3 py-4 text-[13px] text-[var(--color-ink-3)]">
        This module has no lessons authored yet.
      </p>
    );
  }

  const touched = byId
    ? lessons.filter((l) => {
      const s = byId.get(l.id);
      return Boolean(s && (s.status !== 'unread' || s.lastOpenedAt));
    })
    : [];
  const read = byId ? lessons.filter((l) => byId.get(l.id)?.status === 'read').length : 0;

  return (
    <>
      <p aria-live="polite" className="mb-2 text-[12px] text-[var(--color-ink-3)]">
        {failed
          ? 'Your reading state could not be read from the store, so no row below claims one.'
          : !byId
            ? 'Reading your progress through these lessons…'
            : touched.length === 0
              ? 'Nothing recorded yet — you have not opened any lesson in this module.'
              : `${read} of ${lessons.length} read · ${touched.length} opened.`}
      </p>

      <ol className="flex flex-col gap-1.5">
        {lessons.map((l, i) => {
          const s = LESSON_STATUS[l.status];
          const mine = byId?.get(l.id);
          return (
            <li
              key={l.id}
              className={`rounded border px-3 py-2.5 ${
                s.written
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
                      s.written
                        ? 'font-medium text-[var(--color-ink)]'
                        : 'font-normal text-[var(--color-ink-2)]'
                    }`}
                  >
                    {l.title}
                  </Link>
                </h3>
                <span className="shrink-0 text-[12px] tabular-nums text-[var(--color-ink-3)]">
                  {l.readingMin ? `${l.readingMin} min` : 'unestimated'}
                </span>
                {byId && !failed && <ReadMark state={mine} />}
                <Pill tone={s.tone}>{s.label}</Pill>
              </div>
              {l.teaches.length > 0 && (
                <p className="mt-1 pl-8 text-[12.5px] leading-5 text-[var(--color-ink-3)]">
                  <span className="text-[var(--color-ink-3)]">
                    {s.written ? 'Teaches' : 'Will teach'}:{' '}
                  </span>
                  <ConceptLinks refs={l.teaches} />
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </>
  );
}
