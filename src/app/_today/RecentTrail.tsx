import Link from 'next/link';
import { Card, Empty, Note } from './Card';
import { formatDay } from './format';
import type { ContinuePick, StatePhase, TrailEntry } from './model';

const KIND_LABEL: Record<TrailEntry['kind'], string> = {
  lesson: 'Lesson',
  module: 'Module',
  track: 'Track',
  concept: 'Concept',
  practice: 'Practice',
};

/** §08 recovery: the last five things touched, each resumable in one click. */
export function RecentTrail({
  trail, pick, phase, className,
}: {
  trail: TrailEntry[];
  pick: ContinuePick | null;
  phase: StatePhase;
  className?: string;
}) {
  return (
    <Card id="trail" title="Recent trail" hint="last 5 touched" className={className}>
      {phase === 'pending' && <Note>Reading what you last opened.</Note>}

      {phase === 'unavailable' && (
        <Note tone="warn">
          Your trail could not be read. It has not been cleared — this card just could not reach it.
        </Note>
      )}

      {phase === 'ready' && trail.length === 0 && (
        <Empty headline="Nothing opened yet — there is no visit for the app to account for.">
          The last five lessons you open land here, each resumable at the point you left it. The list is
          empty because nothing has been recorded, not because anything was lost.
        </Empty>
      )}

      {phase === 'ready' && trail.length > 0 && (
        <ol className="divide-y divide-[var(--color-rule)]">
          {trail.slice(0, 5).map((e) => (
            <li key={`${e.href}-${e.at}`} className="flex items-baseline justify-between gap-4 py-2">
              <span className="min-w-0">
                <Link href={e.href} className="text-[14px] hover:text-[var(--color-accent)]">{e.label}</Link>
                <span className="block truncate text-[12px] text-[var(--color-ink-3)]">{e.context}</span>
              </span>
              <span className="shrink-0 text-[12px] text-[var(--color-ink-3)]">
                {KIND_LABEL[e.kind]}
                {e.note ? ` · ${e.note}` : ''} · {formatDay(e.at.slice(0, 10))}
              </span>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-auto flex flex-wrap gap-4 pt-1 text-[13px]">
        {pick && (
          <Link href={pick.href} className="text-[var(--color-ink-2)] hover:text-[var(--color-accent)]">
            {pick.basis === 'resume' ? 'Back to where you stopped' : 'Start at the beginning'}
          </Link>
        )}
        <Link href="/m" className="text-[var(--color-ink-2)] hover:text-[var(--color-accent)]">
          Survey the roadmap
          <kbd className="ml-2 rounded border border-[var(--color-rule)] px-1 text-[11px] text-[var(--color-ink-3)]">M</kbd>
        </Link>
        <Link href="/glossary" className="text-[var(--color-ink-2)] hover:text-[var(--color-accent)]">
          Look a term up
        </Link>
      </div>
    </Card>
  );
}
