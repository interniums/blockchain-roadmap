import Link from 'next/link';
import { Chip, Notice, Panel } from './bits';
import type { ConceptRef, TrackGroup } from './graph';

/**
 * The two position strips from the plan: "what this needs" at the top, "what needs this" at the
 * bottom. Lists, not a mini-graph — at 1,490 concepts a list is faster to read and impossible to
 * get lost in. Both link across tracks; that is where the graph becomes visible to the reader.
 */

function RefLink({
  ref_, currentTrackId, showTrack = true,
}: { ref_: ConceptRef; currentTrackId: string; showTrack?: boolean }) {
  if (ref_.missing) {
    return (
      <li className="rounded border border-dashed border-[var(--color-danger)] px-2 py-1.5">
        <span className="text-[13px] text-[var(--color-danger)]">{ref_.id}</span>
        <span className="block text-[11.5px] text-[var(--color-ink-3)]">
          Unresolved concept id — a content bug, not a missing page.
        </span>
      </li>
    );
  }
  const cross = showTrack && ref_.trackId !== currentTrackId;
  return (
    <li>
      <Link
        href={`/c/${ref_.id}`}
        className="group block rounded border border-[var(--color-rule)] px-2 py-1.5 hover:border-[var(--color-accent)]"
      >
        <span className="flex items-baseline justify-between gap-2">
          <span className="text-[13px] text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
            {ref_.title}
          </span>
          {cross && (
            <Chip tone="accent" title={`Lives in ${ref_.trackTitle}`}>
              {ref_.trackTitle}
            </Chip>
          )}
        </span>
        {ref_.oneLine && (
          <span className="mt-0.5 block text-[11.5px] leading-snug text-[var(--color-ink-3)]">
            {ref_.oneLine}
          </span>
        )}
      </Link>
    </li>
  );
}

export function PrereqStrip({
  refs, currentTrackId,
}: { refs: ConceptRef[]; currentTrackId: string }) {
  const cross = refs.filter((r) => !r.missing && r.trackId !== currentTrackId).length;
  return (
    <Panel
      id="prereq-strip"
      title="What this lesson assumes"
      aside={refs.length ? `${refs.length} concept${refs.length === 1 ? '' : 's'}${cross ? ` · ${cross} from another track` : ''}` : undefined}
    >
      {refs.length === 0 ? (
        <Notice>
          Nothing. This lesson assumes no prior concept — it is an entry point into the graph.
        </Notice>
      ) : (
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {refs.map((r) => <RefLink key={r.id} ref_={r} currentTrackId={currentTrackId} />)}
        </ul>
      )}
    </Panel>
  );
}

export function UsedLaterStrip({
  groups, total, currentTrackId,
}: { groups: TrackGroup[]; total: number; currentTrackId: string }) {
  const crossTracks = groups.filter((g) => g.crossTrack).length;
  return (
    <Panel
      id="used-later-strip"
      title="Used later in"
      aside={total ? `${total} concept${total === 1 ? '' : 's'}${crossTracks ? ` · ${crossTracks} other track${crossTracks === 1 ? '' : 's'}` : ''}` : undefined}
    >
      {total === 0 ? (
        <Notice>
          Nothing in the curriculum depends on these concepts yet. Either this is a leaf of the graph,
          or an edge is missing upstream.
        </Notice>
      ) : (
        <div className="max-h-[26rem] overflow-y-auto">
          <ul className="flex flex-col gap-3">
            {groups.map((g) => (
              <li key={g.trackId || 'unresolved'}>
                <h3 className="mb-1 flex items-baseline gap-2 text-[12px] text-[var(--color-ink-2)]">
                  <span>{g.trackTitle}</span>
                  {g.crossTrack && <Chip tone="accent">other track</Chip>}
                  <span className="text-[11px] text-[var(--color-ink-3)]">
                    {g.refs.length} concept{g.refs.length === 1 ? '' : 's'}
                  </span>
                </h3>
                <ul className="grid gap-1.5 sm:grid-cols-2">
                  {g.refs.map((r) => (
                    <RefLink key={r.id} ref_={r} currentTrackId={currentTrackId} showTrack={false} />
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Notice>
        Computed from the graph: every concept that requires one of the concepts this lesson teaches.
      </Notice>
    </Panel>
  );
}
