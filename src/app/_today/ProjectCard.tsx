import Link from 'next/link';
import { Card, Empty, Note } from './Card';
import type { ContinuePick, ProjectState } from './model';

/**
 * §10 makes the project a track-exit instrument. No project is authored in the content yet,
 * so this states that and points at the track whose exit it would belong to — rather than
 * showing an empty progress bar.
 */
export function ProjectCard({
  project, pick, className,
}: {
  project: ProjectState;
  pick: ContinuePick | null;
  className?: string;
}) {
  const active = project.active;

  return (
    <Card
      id="project"
      title="Active project"
      hint={active ? active.trackTitle : 'none'}
      className={className}
    >
      {active ? (
        <>
          <h3 className="text-[15px] font-semibold leading-snug">
            <Link href={active.href} className="hover:text-[var(--color-accent)]">{active.title}</Link>
          </h3>
          <ol className="flex flex-col gap-1">
            {active.milestones.map((m) => (
              <li key={m.id} className="flex items-start gap-2 text-[13px] text-[var(--color-ink-2)]">
                <span aria-hidden="true" className={m.done ? 'text-[var(--color-good)]' : 'text-[var(--color-ink-3)]'}>
                  {m.done ? '✓' : '○'}
                </span>
                <span className={m.done ? 'text-[var(--color-ink-3)] line-through' : undefined}>{m.title}</span>
                {!m.done && <span className="sr-only">not done</span>}
              </li>
            ))}
          </ol>
        </>
      ) : (
        <Empty headline="No project running.">
          A project hangs off a track&rsquo;s exit and is checked milestone by milestone.{' '}
          {project.tracksWithExit} {project.tracksWithExit === 1 ? 'track states' : 'tracks state'} the
          capabilities a project would have to prove; none of those projects is written yet.
        </Empty>
      )}

      {!active && pick && (
        <div className="mt-auto pt-1">
          <Link href={`/t/${pick.trackId}`} className="text-[13px] text-[var(--color-ink-2)] hover:text-[var(--color-accent)]">
            What {pick.trackTitle} leads to
          </Link>
          <Note>The track page lists its capabilities in plain English.</Note>
        </div>
      )}
    </Card>
  );
}
