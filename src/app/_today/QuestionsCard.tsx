import Link from 'next/link';
import { can, MODE } from '@/lib/capabilities';
import { Card, Count, Empty, Note, Unknown } from './Card';
import { formatDay, plural } from './format';
import type { QuestionsState, StatePhase } from './model';

/** Open loops, newest first. Questions age visibly — an old one is the signal, not a nag. */
export function QuestionsCard({
  questions, phase, className,
}: {
  questions: QuestionsState;
  phase: StatePhase;
  className?: string;
}) {
  const shown = questions.items.length;
  const hidden = Math.max(0, questions.open - shown);

  return (
    <Card
      id="questions"
      title="Open questions"
      hint={
        phase !== 'ready' || questions.oldestAgeDays == null
          ? undefined
          : `oldest ${questions.oldestAgeDays} ${plural(questions.oldestAgeDays, 'day')}`
      }
      className={className}
    >
      {phase === 'ready'
        ? <Count value={questions.open} unit="unresolved" muted={questions.open === 0} />
        : <Unknown unit="unresolved" />}

      {phase === 'pending' && <Note>Reading your question list.</Note>}

      {phase === 'unavailable' && (
        <Note tone="warn">
          The question list could not be read. Anything you recorded is still there; this card just
          could not reach it.
        </Note>
      )}

      {phase === 'ready' && shown === 0 && (
        <Empty headline="Nothing captured yet.">
          Questions are raised from inside a lesson, against the concept you were reading, and collect
          here until you answer them in your own words.
        </Empty>
      )}

      {phase === 'ready' && shown > 0 && (
        <>
          <ul className="flex flex-col gap-2">
            {questions.items.map((q) => (
              <li key={q.id} className="text-[13px]">
                <Link href={q.href} className="hover:text-[var(--color-accent)]">{q.text}</Link>
                <span className="block text-[12px] text-[var(--color-ink-3)]">
                  {q.context} · asked {formatDay(q.askedAt)} · {q.ageDays} {plural(q.ageDays, 'day')} old
                </span>
              </li>
            ))}
          </ul>
          {hidden > 0 && (
            <Note>
              {hidden} more {plural(hidden, 'is', 'are')} open — the board has all of them.
            </Note>
          )}
        </>
      )}

      <div className="mt-auto flex flex-col gap-1.5 pt-1">
        <Link href="/questions" className="text-[13px] text-[var(--color-ink-2)] hover:text-[var(--color-accent)]">
          Open the question list
        </Link>
        {MODE === 'web' && !can.composeNotes && (
          <Note tone="warn">
            Web copy: questions live in this browser and are not synced. Writing answers as notes needs the
            local install.
          </Note>
        )}
      </div>
    </Card>
  );
}
