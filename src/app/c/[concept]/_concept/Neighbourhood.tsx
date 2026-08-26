import type { ConceptView, EdgeType } from '@/lib/content/types';
import { ConceptGroup } from './ConceptList';
import { Empty } from './ui';

/** Related edge kinds, in the order they are worth reading. `requires` is handled separately. */
const RELATED_ORDER: EdgeType[] = ['deepens', 'contrasts', 'applies', 'supersedes', 'recommends'];

const RELATED_COPY: Record<EdgeType, { heading: string; gloss: string }> = {
  requires: { heading: 'Requires', gloss: 'Hard prerequisites.' },
  recommends: {
    heading: 'Recommended alongside',
    gloss: 'Soft support. Helps, but does not gate this one.',
  },
  deepens: {
    heading: 'Deepens',
    gloss: 'The same idea taken further. Read after this one, not instead of it.',
  },
  contrasts: {
    heading: 'Contrasts with',
    gloss: 'Close enough to be confused with this, different in a way that matters.',
  },
  applies: {
    heading: 'Applied in',
    gloss: 'Where this idea is put to work rather than explained.',
  },
  supersedes: {
    heading: 'Supersedes',
    gloss: 'This replaces the following. They are still worth reading — as history, not as guidance.',
  },
};

export function Neighbourhood({ concept }: { concept: ConceptView }) {
  const byType = new Map<EdgeType, string[]>();
  for (const edge of concept.related) {
    const list = byType.get(edge.type) ?? [];
    if (!list.includes(edge.to)) list.push(edge.to);
    byType.set(edge.type, list);
  }
  const relatedGroups = RELATED_ORDER
    .map((type) => ({ type, ids: byType.get(type) ?? [] }))
    .filter((g) => g.ids.length > 0);

  return (
    <div className="flex flex-col gap-7">
      <ConceptGroup
        heading="Requires"
        gloss="You need these to be right before this one can be. These are the only edges that gate readiness."
        ids={concept.requires}
        fromTrackId={concept.trackId}
        empty="Nothing. This is an entry point — it stands on no other concept in the graph."
      />

      <ConceptGroup
        heading="Required by"
        gloss="These depend on this concept. Getting this wrong quietly breaks all of them."
        ids={concept.requiredBy}
        fromTrackId={concept.trackId}
        empty="Nothing yet. No concept in the graph names this one as a hard prerequisite."
      />

      {relatedGroups.length === 0 ? (
        <Empty>
          No deepens, contrasts, applies or supersedes edges are authored for this concept — only its
          prerequisite relations above.
        </Empty>
      ) : (
        relatedGroups.map(({ type, ids }) => (
          <ConceptGroup
            key={type}
            heading={RELATED_COPY[type].heading}
            gloss={RELATED_COPY[type].gloss}
            ids={ids}
            fromTrackId={concept.trackId}
            empty=""
          />
        ))
      )}
    </div>
  );
}
