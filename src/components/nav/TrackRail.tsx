import Link from 'next/link';
import { getModulesOf, getTrack } from '@/lib/content/load';

/** One track at a time, expanded to your position. Showing all 13 is how a sidebar becomes unusable. */
export function TrackRail({
  trackId, activeModuleId, activeLessonId,
}: { trackId: string; activeModuleId?: string; activeLessonId?: string }) {
  const track = getTrack(trackId);
  if (!track) return null;
  const modules = getModulesOf(trackId);

  return (
    <nav aria-label={`${track.title} contents`} className="text-[13px]">
      <Link href="/m" className="block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)] hover:text-[var(--color-accent)]">
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
                <ol className="ml-2 mt-0.5 flex flex-col gap-0.5 border-l border-[var(--color-rule)] pl-2">
                  {[...(m.lessons ?? [])].sort((a, b) => a.order - b.order).map((l) => (
                    <li key={l.id}>
                      <Link
                        href={`/t/${track.id}/${m.id}/${l.id}`}
                        aria-current={l.id === activeLessonId ? 'page' : undefined}
                        className={`block rounded px-2 py-0.5 text-[12.5px] ${l.id === activeLessonId ? 'text-[var(--color-accent)]' : 'text-[var(--color-ink-3)] hover:text-[var(--color-ink-2)]'}`}
                      >
                        {l.title}
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
