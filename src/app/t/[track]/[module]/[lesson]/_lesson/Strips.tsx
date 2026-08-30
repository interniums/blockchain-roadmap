import Link from 'next/link';
import { hrefForConcept } from '@/lib/content/load';
import { Chip, Notice, Panel } from './bits';
import type { ConceptRef } from './graph';

/**
 * What this lesson assumes, at the top. A list, not a mini-graph — at 1,490 concepts a list is
 * faster to read and impossible to get lost in, and it links across tracks, which is where the
 * graph becomes visible to the reader.
 *
 * There is deliberately no matching strip at the bottom. "Used later in" fanned out to a median of
 * 39 downstream concepts across eight other tracks, which is not orientation, it is noise at the
 * exact moment the reader has finished something.
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
        href={hrefForConcept(ref_.id) ?? `/t/${currentTrackId}`}
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
