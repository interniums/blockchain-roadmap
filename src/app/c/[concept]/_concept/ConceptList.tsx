import Link from 'next/link';
import { getConcept } from '@/lib/content/load';
import { trackTitle } from './derive';
import { Badge, Empty } from './ui';

/**
 * One neighbour. Always shows which track it lives in, so cross-track structure
 * is legible without opening anything.
 */
function ConceptRow({ id, fromTrackId }: { id: string; fromTrackId: string }) {
  const c = getConcept(id);

  if (!c) {
    // The graph has a dangling reference. Say so; do not link into a 404.
    return (
      <li className="px-2 py-1.5">
        <span className="font-mono text-[13px] text-[var(--color-ink-3)]">{id}</span>{' '}
        <Badge tone="danger">not in the graph</Badge>
      </li>
    );
  }

  const crossTrack = c.trackId !== fromTrackId;

  return (
    <li>
      <Link
        href={`/c/${c.id}`}
        className="group block rounded px-2 py-1.5 hover:bg-[var(--color-surface-2)]"
      >
        <span className="flex items-baseline justify-between gap-3">
          <span className="text-[14px] text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
            {c.title}
          </span>
          <span className="flex shrink-0 items-center gap-2.5">
            <span
              className={`text-[11px] ${crossTrack ? 'text-[var(--color-accent)]' : 'text-[var(--color-ink-3)]'}`}
              title={crossTrack ? 'In a different track' : 'In this track'}
            >
              {crossTrack && <span aria-hidden="true">↗ </span>}
              {trackTitle(c.trackId)}
            </span>
          </span>
        </span>
        <span className="mt-0.5 block text-[12.5px] leading-snug text-[var(--color-ink-2)]">
          {c.oneLine}
        </span>
      </Link>
    </li>
  );
}

export function ConceptList({
  ids, fromTrackId, empty,
}: { ids: string[]; fromTrackId: string; empty: string }) {
  if (ids.length === 0) return empty ? <Empty>{empty}</Empty> : null;
  return (
    <ul className="-mx-2 flex flex-col divide-y divide-[var(--color-rule)]">
      {ids.map((id) => (
        <ConceptRow key={id} id={id} fromTrackId={fromTrackId} />
      ))}
    </ul>
  );
}

/** A named group inside the neighbourhood: heading, one-line gloss, list. */
export function ConceptGroup({
  heading, gloss, ids, fromTrackId, empty,
}: { heading: string; gloss: string; ids: string[]; fromTrackId: string; empty: string }) {
  return (
    <section aria-label={heading}>
      <div className="flex items-baseline gap-2">
        <h3 className="text-[13.5px] font-semibold text-[var(--color-ink)]">{heading}</h3>
        <span className="text-[12px] text-[var(--color-ink-3)]">{ids.length}</span>
      </div>
      <p className="mt-0.5 text-[12.5px] text-[var(--color-ink-3)]">{gloss}</p>
      <div className="mt-2">
        <ConceptList ids={ids} fromTrackId={fromTrackId} empty={empty} />
      </div>
    </section>
  );
}
