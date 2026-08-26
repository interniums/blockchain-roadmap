import Link from 'next/link';
import { getTrack } from '@/lib/content/load';
import { can, WEB_NOTICE } from '@/lib/capabilities';
import type { Track } from '@/lib/content/types';
import { hoursMinutes, trackFigures } from './figures';

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

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-[var(--color-rule)] py-1.5 last:border-b-0">
      <dt className="text-[13px] text-[var(--color-ink-2)]">{label}</dt>
      <dd className="tabular-nums text-[13.5px] text-[var(--color-ink)]">{value}</dd>
    </div>
  );
}

/**
 * Where this track sits in the graph, and how big it is.
 * Cross-track links are the point: a track is not a silo, it borrows and it feeds.
 */
export function ContextRail({ track }: { track: Track }) {
  const f = trackFigures(track.id);

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="rail-size">
        <RailHeading id="rail-size">Size of this track</RailHeading>
        <dl className="mt-1.5">
          <Figure label="Modules" value={String(f.modules)} />
          <Figure label="Lessons" value={String(f.lessons)} />
          <Figure label="Reading time" value={hoursMinutes(f.readingMin)} />
          <Figure label="Practices" value={String(f.practices)} />
          <Figure label="Concepts taught" value={String(f.concepts)} />
        </dl>
        {f.practices > 0 && !can.runPractice && (
          <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--color-warn)]">
            Practice checks are read-only here. {WEB_NOTICE}
          </p>
        )}
      </section>

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

      <section aria-labelledby="rail-exit">
        <RailHeading id="rail-exit">Exit project</RailHeading>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-ink-3)]">
          Not authored. No track in the curriculum carries an exit project yet — the
          per-module practices are the only build work currently specified.
        </p>
      </section>
    </div>
  );
}
