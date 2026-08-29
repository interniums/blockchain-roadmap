import Link from 'next/link';
import { getTrack } from '@/lib/content/load';
import type { Track } from '@/lib/content/types';

function RailHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
      {children}
    </h2>
  );
}

function TrackLinks({ ids, empty }: { ids: string[]; empty: string }) {
  const tracks = ids.map((id) => getTrack(id)).filter((t): t is Track => Boolean(t));
  if (tracks.length === 0) {
    return <p className="mt-1.5 text-[13px] text-[var(--color-ink-3)]">{empty}</p>;
  }
  return (
    <ul className="mt-1.5 flex flex-col gap-1">
      {tracks.map((t) => (
        <li key={t.id}>
          <Link
            href={`/t/${t.id}`}
            className="flex items-baseline gap-2 text-[13.5px] text-[var(--color-ink-2)] hover:text-[var(--color-accent)]"
          >
            <span className="tabular-nums text-[var(--color-ink-3)]">
              {String(t.number).padStart(2, '0')}
            </span>
            <span>{t.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Where this track sits in the graph. Cross-track links are the point: a track is not a silo,
 * it borrows and it feeds. Deliberately carries no size figures and no clock — the track is a
 * place in the subject, not a workload.
 */
export function ContextRail({ track }: { track: Track }) {
  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="rail-borrows">
        <RailHeading id="rail-borrows">Borrows from</RailHeading>
        <TrackLinks
          ids={track.entersFrom ?? []}
          empty="Nothing. This track is a way into the graph."
        />
      </section>

      <section aria-labelledby="rail-feeds">
        <RailHeading id="rail-feeds">Feeds into</RailHeading>
        <TrackLinks
          ids={track.feedsInto ?? []}
          empty="Nothing yet. Nothing downstream declares a dependency on this track."
        />
      </section>
    </div>
  );
}
