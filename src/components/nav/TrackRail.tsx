import Link from 'next/link';
import { getModulesOf, getTrack } from '@/lib/content/load';
import { gateFor } from '@/lib/content/gate';
import { RailLessons } from './RailLessons';

/**
 * One track at a time, expanded to your position. Showing all 13 is how a sidebar becomes unusable.
 *
 * The gate is computed here on the server and the lock state resolved in the `RailLessons` client
 * leaf, so the rail is the one place you can see what is ahead of you and what is not yet open.
 */
export function TrackRail({
  trackId, activeModuleId, activeLessonId,
}: { trackId: string; activeModuleId?: string; activeLessonId?: string }) {
  const track = getTrack(trackId);
  if (!track) return null;
  const modules = getModulesOf(trackId);

  return (
    <nav aria-label={`${track.title} contents`} className="text-[13px]">
      <Link href="/" className="block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)] hover:text-[var(--color-accent)]">
        ← All tracks
      </Link>
      <Link href={`/t/${track.id}`} className="mt-2 block font-semibold text-[15px] hover:text-[var(--color-accent)]">
        {track.title}
      </Link>
      <ol className="mt-3 flex flex-col gap-0.5">
        {modules.map((m) => {
          const open = m.id === activeModuleId;
          return (
            <li key={m.id}>
              <Link
                href={`/t/${track.id}/${m.id}`}
                aria-current={open && !activeLessonId ? 'page' : undefined}
                className={`block rounded px-2 py-1 ${open ? 'bg-[var(--color-surface-2)] text-[var(--color-ink)]' : 'text-[var(--color-ink-2)] hover:text-[var(--color-accent)]'}`}
              >
                {m.title}
              </Link>
              {open && (m.lessons?.length ?? 0) > 0 && (
                <RailLessons
                  activeLessonId={activeLessonId}
                  lessons={[...(m.lessons ?? [])].sort((a, b) => a.order - b.order).map((l) => ({
                    id: l.id,
                    title: l.title,
                    href: `/t/${track.id}/${m.id}/${l.id}`,
                    watch: gateFor(l.id).watch,
                  }))}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
