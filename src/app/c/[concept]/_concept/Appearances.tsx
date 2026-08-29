import type { ReactNode } from 'react';
import Link from 'next/link';
import { getLesson, getModule, getPractice } from '@/lib/content/load';
import { can } from '@/lib/capabilities';
import { trackTitle } from './derive';
import { Badge, Empty } from './ui';

function LessonRow({ id, fromTrackId }: { id: string; fromTrackId: string }) {
  const found = getLesson(id);
  if (!found) {
    return (
      <li className="px-2 py-1.5">
        <span className="font-mono text-[13px] text-[var(--color-ink-3)]">{id}</span>{' '}
        <Badge tone="danger">lesson not found</Badge>
      </li>
    );
  }
  const { lesson, moduleId, trackId } = found;
  const mod = getModule(moduleId);
  const crossTrack = trackId !== fromTrackId;

  return (
    <li>
      <Link
        href={`/t/${trackId}/${moduleId}/${lesson.id}`}
        className="group block rounded px-2 py-1.5 hover:bg-[var(--color-surface-2)]"
      >
        <span className="block text-[14px] text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
          {lesson.title}
        </span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] text-[var(--color-ink-3)]">
          <span className={crossTrack ? 'text-[var(--color-accent)]' : undefined}>
            {crossTrack && <span aria-hidden="true">↗ </span>}
            {trackTitle(trackId)}
          </span>
          <span aria-hidden="true">›</span>
          <span>{mod?.title ?? moduleId}</span>
        </span>
      </Link>
    </li>
  );
}

function PracticeRow({ id }: { id: string }) {
  const p = getPractice(id);
  if (!p) {
    return (
      <li className="px-2 py-1.5">
        <span className="font-mono text-[13px] text-[var(--color-ink-3)]">{id}</span>{' '}
        <Badge tone="danger">practice not found</Badge>
      </li>
    );
  }
  const mod = getModule(p.moduleId);
  return (
    <li>
      <Link href={`/p/${p.id}`} className="group block rounded px-2 py-1.5 hover:bg-[var(--color-surface-2)]">
        <span className="block text-[14px] text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
          {p.title}
        </span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] text-[var(--color-ink-3)]">
          <Badge>{p.kind}</Badge>
          <span>{mod?.title ?? p.moduleId}</span>
        </span>
      </Link>
    </li>
  );
}

function List({ children }: { children: ReactNode }) {
  return (
    <ul className="-mx-2 flex flex-col divide-y divide-[var(--color-rule)]">{children}</ul>
  );
}

function Group({
  heading, gloss, count, children,
}: { heading: string; gloss: string; count: number; children: ReactNode }) {
  return (
    <section aria-label={heading}>
      <div className="flex items-baseline gap-2">
        <h3 className="text-[13.5px] font-semibold text-[var(--color-ink)]">{heading}</h3>
        <span className="text-[12px] text-[var(--color-ink-3)]">{count}</span>
      </div>
      <p className="mt-0.5 text-[12.5px] text-[var(--color-ink-3)]">{gloss}</p>
      <div className="mt-2">{children}</div>
    </section>
  );
}

/**
 * Where this concept is taught, and where it is put under load.
 */
export function Appearances({
  taughtIn, practices, fromTrackId,
}: { taughtIn: string[]; practices: string[]; fromTrackId: string }) {
  return (
    <div className="flex flex-col gap-7">
      <Group
        heading="Taught in"
        gloss="Lessons that introduce and explain this concept."
        count={taughtIn.length}
      >
        {taughtIn.length === 0 ? (
          <Empty>
            No lesson claims to teach this concept. That is a coverage gap — it can be assumed and reviewed,
            but nowhere learned.
          </Empty>
        ) : (
          <List>
            {taughtIn.map((id) => (
              <LessonRow key={id} id={id} fromTrackId={fromTrackId} />
            ))}
          </List>
        )}
      </Group>

      <Group
        heading="Exercised by"
        gloss="Practices that put this concept under load, where knowing it and being able to use it separate."
        count={practices.length}
      >
        {practices.length === 0 ? (
          <Empty>No practice in the corpus exercises this concept.</Empty>
        ) : (
          <>
            <List>
              {practices.map((id) => (
                <PracticeRow key={id} id={id} />
              ))}
            </List>
            {!can.runPractice && (
              <p className="mt-2 px-2 text-[12px] leading-snug text-[var(--color-ink-3)]">
                You can read every spec and acceptance criterion here. Running the check needs the local
                install, because it executes the test command inside your own repo.
              </p>
            )}
          </>
        )}
      </Group>
    </div>
  );
}
