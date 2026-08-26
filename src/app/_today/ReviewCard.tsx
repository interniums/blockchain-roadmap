import Link from 'next/link';
import { can, MODE } from '@/lib/capabilities';
import { Card, Count, Empty, Note, Unknown } from './Card';
import { formatDay, plural } from './format';
import type { ReviewState, StatePhase } from './model';

/**
 * Three different zeros, and the card never confuses them: nobody has looked yet (a dash),
 * nothing has entered the schedule (an empty state that says why), and a schedule with
 * nothing ready today (a plain fact, with the date the next one lands).
 */
export function ReviewCard({
  review, phase, className,
}: {
  review: ReviewState;
  phase: StatePhase;
  className?: string;
}) {
  const n = (v: number) => v.toLocaleString('en-GB');

  return (
    <Card
      id="review"
      title="Review"
      hint={`${n(review.pool)} in the pool`}
      className={className}
    >
      {phase === 'ready'
        ? <Count value={review.due} unit="concepts due" muted={review.due === 0} />
        : <Unknown unit="concepts due" />}

      {phase === 'pending' && <Note>Reading your schedule.</Note>}

      {phase === 'unavailable' && (
        <Note tone="warn">
          The schedule could not be read, so this is a dash rather than a count. Nothing has been lost —
          the queue is still there, this page just could not reach it.
        </Note>
      )}

      {phase === 'ready' && review.seen === 0 && (
        <Empty headline="Nothing is scheduled, because no lesson has been finished yet.">
          A concept enters the queue when you mark a lesson read, unproven, and gets a real interval the
          first time you grade yourself on it.
        </Empty>
      )}

      {phase === 'ready' && review.seen > 0 && review.due === 0 && (
        <Note>
          Nothing is ready yet. {n(review.seen)} {plural(review.seen, 'concept has', 'concepts have')} entered
          the schedule; the next falls due{' '}
          {review.nextDueIsToday ? 'later today' : formatDay(review.nextDueAt)}.
        </Note>
      )}

      {phase === 'ready' && review.due > 0 && (
        <Note>
          {n(review.due)} of the {n(review.seen)} {plural(review.seen, 'concept', 'concepts')} in your schedule{' '}
          {plural(review.due, 'is', 'are')} ready now. Reviewing one also credits its prerequisites, so the
          queue shrinks faster than it looks.
        </Note>
      )}

      <div className="mt-auto flex flex-col gap-1.5 pt-1">
        <Link href="/review" className="text-[13px] text-[var(--color-ink-2)] hover:text-[var(--color-accent)]">
          Open the review queue
          <kbd className="ml-2 rounded border border-[var(--color-rule)] px-1 text-[11px] text-[var(--color-ink-3)]">R</kbd>
        </Link>
        {MODE === 'web' && !can.persistProgress && (
          <Note tone="warn">
            Web copy: answers stay in this browser and are not synced. Durable progress needs the local install.
          </Note>
        )}
      </div>
    </Card>
  );
}
