'use client';

import { Chip } from './bits';
import { useLessonProgress } from './progress';

/**
 * This lesson's own state, in the header where the rest of the lesson's facts live.
 * Coverage and durability only — no streak, no goal, no count of days since you were last here.
 */

const STATUS: Record<string, { label: string; tone: 'neutral' | 'good' }> = {
  unread: { label: 'Not started', tone: 'neutral' },
  reading: { label: 'Reading', tone: 'neutral' },
  read: { label: 'Read', tone: 'good' },
};

function day(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function LessonStateLine() {
  const p = useLessonProgress();
  if (!p) return null;

  if (p.loading) {
    return <span className="text-[var(--color-ink-3)]" aria-live="polite">checking your progress…</span>;
  }

  if (!p.state) {
    return (
      <span className="text-[var(--color-danger)]">
        {p.error ?? 'progress unavailable — nothing is being recorded'}
      </span>
    );
  }

  const s = STATUS[p.state.status] ?? { label: p.state.status, tone: 'neutral' as const };
  const showScroll = p.state.status !== 'read' && p.state.scrollPct > 0.02;

  return (
    <>
      <Chip tone={s.tone}>{s.label}</Chip>
      {showScroll && (
        <span title="How far down this page you had scrolled when you last left it.">
          {Math.round(p.state.scrollPct * 100)}% in
        </span>
      )}
      <span aria-hidden="true">·</span>
      <span>
        {p.previouslyOpenedAt === null
          ? 'first time on this page'
          : `last opened ${day(p.previouslyOpenedAt)}`}
      </span>
      {!p.durable && (
        <>
          <span aria-hidden="true">·</span>
          <span className="text-[var(--color-warn)]" title="The web copy keeps state in this browser and never syncs it.">
            recorded on this device only
          </span>
        </>
      )}
      {p.error && (
        <span className="w-full basis-full text-[var(--color-danger)]" role="alert">{p.error}</span>
      )}
      {p.restoredPct !== null && (
        <span className="w-full basis-full" aria-live="polite">
          Put back where you stopped, {Math.round(p.restoredPct * 100)}% in.{' '}
          <button
            type="button"
            onClick={p.backToTop}
            className="underline underline-offset-2 hover:text-[var(--color-accent)]"
          >
            Back to the top
          </button>
        </span>
      )}
    </>
  );
}
