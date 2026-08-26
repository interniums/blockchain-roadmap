import Link from 'next/link';
import { Breadcrumb } from '@/components/nav/Breadcrumb';
import { can, WEB_NOTICE } from '@/lib/capabilities';
import { Card, Chip, Empty, LocalOnlyAction, Note } from './Card';
import { plural } from './format';
import type { ContinuePick, ProgressStore, StatePhase } from './model';

/**
 * The one good next move. It is a resume point only when a recorded position says so; otherwise
 * it is the first lesson in reading order and the card says that in as many words. While the
 * store has not answered yet it says that too, rather than implying an empty record.
 */
export function ContinueCard({
  pick, store, phase, className,
}: {
  pick: ContinuePick | null;
  store: ProgressStore;
  phase: StatePhase;
  className?: string;
}) {
  if (!pick) {
    return (
      <Card id="continue" title="Continue" className={className}>
        <Empty headline="No lesson to continue — the curriculum has no lessons in reading order.">
          That is a content problem, not a progress one. <Link href="/m" className="underline hover:text-[var(--color-accent)]">Open the roadmap</Link> to see what loaded.
        </Empty>
      </Card>
    );
  }

  const outlined = pick.status === 'outlined';

  return (
    <Card
      id="continue"
      title="Continue"
      hint={
        phase === 'pending'
          ? 'reading your record'
          : pick.basis === 'start' ? 'starting at the beginning' : 'where you stopped'
      }
      className={className}
    >
      {phase === 'pending' && (
        <Note>
          Reading what you have recorded. Until it answers this is the first lesson in reading order,
          not a resume point.
        </Note>
      )}

      {phase === 'unavailable' && (
        <Note tone="warn">
          Your recorded position could not be read, so this is lesson 1 of{' '}
          {pick.total.toLocaleString('en-GB')} rather than where you actually stopped.
        </Note>
      )}

      {phase === 'ready' && pick.resumeNote && <Note>{pick.resumeNote}</Note>}

      {phase === 'ready' && pick.basis === 'resume' && store === 'device' && (
        <Note tone="warn">
          This position is kept in this browser only. Another device, or a cleared cache, starts you
          back at the beginning.
        </Note>
      )}

      {/* The ladder down to the lesson. The lesson itself is the heading below, so the
          trail stops at its module rather than repeating the title. */}
      <Breadcrumb crumbs={pick.crumbs.slice(0, -1)} />

      <h3 className="text-[19px] font-semibold leading-snug">
        <Link href={pick.href} className="hover:text-[var(--color-accent)]">
          {pick.lessonTitle}
        </Link>
      </h3>

      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-[var(--color-ink-3)]">
        {pick.readingMin != null && (
          <>
            <span>{pick.readingMin} min read</span>
            <span aria-hidden="true">·</span>
          </>
        )}
        <span>lesson {pick.position.toLocaleString('en-GB')} of {pick.total.toLocaleString('en-GB')} in reading order</span>
      </p>

      {outlined && (
        <div className="rounded border border-[var(--color-rule)] bg-[var(--color-warn-soft)] p-3">
          <p className="text-[13px] text-[var(--color-warn)]">
            Outlined, not written. This lesson has its title, its concepts, its prerequisites and its reading
            time. The prose does not exist yet — opening it shows the outline, not a reading.
          </p>
        </div>
      )}

      {pick.teaches.length > 0 && (
        <div>
          <p className="mb-1.5 text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
            Teaches {pick.teaches.length} {plural(pick.teaches.length, 'concept')}
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {pick.teaches.map((c) => (
              <li key={c.id}><Chip href={c.href}>{c.title}</Chip></li>
            ))}
          </ul>
        </div>
      )}

      {pick.assumes.length > 0 && (
        <div>
          <p className="mb-1.5 text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
            Assumes you know
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {pick.assumes.map((c) => (
              <li key={c.id}><Chip href={c.href}>{c.title}</Chip></li>
            ))}
          </ul>
        </div>
      )}

      {pick.practices.length > 0 && (
        <div className="rounded border border-[var(--color-rule)] p-3">
          <p className="mb-1.5 text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
            The other kind of next move — {pick.practices.length}{' '}
            {plural(pick.practices.length, 'practice')} in this module
          </p>
          <ul className="mb-2 flex flex-col gap-1">
            {pick.practices.map((p) => (
              <li key={p.id} className="text-[13px]">
                <Link href={p.href} className="hover:text-[var(--color-accent)]">{p.title}</Link>
                <span className="ml-2 text-[12px] text-[var(--color-ink-3)]">{p.kind}</span>
              </li>
            ))}
          </ul>
          <LocalOnlyAction
            id="run-check-notice"
            label={pick.practices.length === 1 ? 'Run its check' : `Run the first check — ${pick.practices[0].title}`}
            href={`${pick.practices[0].href}#check`}
            available={can.runPractice}
            notice={WEB_NOTICE}
          />
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
        <Link
          href={pick.href}
          className="rounded border border-[var(--color-accent)] bg-[var(--color-accent-soft)] px-3 py-1.5 text-[14px] text-[var(--color-accent)]"
        >
          Open this lesson
        </Link>
        <Link href={`/t/${pick.trackId}/${pick.moduleId}`} className="text-[13px] text-[var(--color-ink-2)] hover:text-[var(--color-accent)]">
          The whole module
        </Link>
        <Link href="/m" className="text-[13px] text-[var(--color-ink-2)] hover:text-[var(--color-accent)]">
          Pick somewhere else
        </Link>
      </div>
    </Card>
  );
}
