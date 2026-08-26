import type { RoadmapEdge } from './geometry';

/**
 * The connector layer. Decorative only: `aria-hidden`, no pointer events, and the roadmap
 * reads correctly with this component deleted. The structural truth lives in DOM order and
 * in each card's `aria-describedby`, which names its prerequisites in words.
 */
export function Connectors({
  edges, width, height,
}: { edges: RoadmapEdge[]; width: number; height: number }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="pointer-events-none absolute inset-0"
      style={{ color: 'var(--color-ink-3)' }}
    >
      <defs>
        <marker
          id="cp-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
      </defs>
      {edges.map((e) => (
        <path key={e.id} d={e.d} className={`cp-edge cp-edge--${e.kind}`} markerEnd="url(#cp-arrow)" />
      ))}
    </svg>
  );
}
