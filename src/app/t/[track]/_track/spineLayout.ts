import type { Lane, Module } from '@/lib/content/types';

/**
 * Geometry for the L2 module spine.
 *
 * Same grammar as the L1 roadmap, one level down: a centre spine with left and right
 * lanes, connectors drawn as SVG between fixed coordinates. Positions come from the
 * authored `layout { lane, row }` in each module's YAML — nothing is computed from
 * content length, so the diagram renders identically every load and diffs cleanly.
 *
 * Every number lives here so a restyle is a constants edit, not a rewrite.
 */
export const GEO = {
  sideWidth: 196,
  spineWidth: 300,
  columnGap: 26,
  rowHeight: 120,
  nodeHeight: 92,
  padY: 16,
} as const;

export const SPINE_WIDTH =
  GEO.sideWidth * 2 + GEO.spineWidth + GEO.columnGap * 2;

/** left | spine | right, ordered so "one lane over" is a meaningful distance. */
const LANE_ORDER: Record<Lane, number> = { left: 0, spine: 1, right: 2 };

export type Column = -1 | 0 | 1;

export interface SpineNode {
  module: Module;
  /** -1 left lane, 0 centre spine, +1 right lane */
  column: Column;
  rowIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  /** horizontal centre, used as the connector anchor */
  cx: number;
}

export interface SpineEdge {
  id: string;
  d: string;
  /** true when the two modules sit in different lanes — the branch case */
  lateral: boolean;
}

export interface SpineDiagram {
  nodes: SpineNode[];
  edges: SpineEdge[];
  width: number;
  height: number;
  /** the lane treated as this page's centre, so an elective track is not drawn off-axis */
  centreLane: Lane;
}

function centreLaneOf(modules: Module[]): Lane {
  const counts = new Map<Lane, number>();
  for (const m of modules) {
    const lane = m.layout?.lane ?? 'spine';
    counts.set(lane, (counts.get(lane) ?? 0) + 1);
  }
  let best: Lane = modules[0]?.layout?.lane ?? 'spine';
  let bestCount = -1;
  for (const [lane, count] of counts) {
    if (count > bestCount) {
      best = lane;
      bestCount = count;
    }
  }
  return best;
}

function columnFor(lane: Lane, centre: Lane): Column {
  const delta = LANE_ORDER[lane] - LANE_ORDER[centre];
  if (delta < 0) return -1;
  if (delta > 0) return 1;
  return 0;
}

function xFor(column: Column): { x: number; width: number } {
  if (column === 0) {
    return { x: GEO.sideWidth + GEO.columnGap, width: GEO.spineWidth };
  }
  if (column === -1) return { x: 0, width: GEO.sideWidth };
  return { x: SPINE_WIDTH - GEO.sideWidth, width: GEO.sideWidth };
}

/**
 * Rows are authored absolutes (they carry a per-track offset such as 1201..1208),
 * so they are normalised against the track's own minimum. If any module is missing
 * a layout — or the authored rows leave an implausible gap — the diagram falls back
 * to reading order rather than rendering a page of empty space.
 */
function rowIndices(modules: Module[]): number[] {
  const sequential = modules.map((_, i) => i);
  if (modules.some((m) => !m.layout)) return sequential;

  const rows = modules.map((m) => m.layout!.row);
  const min = Math.min(...rows);
  const normalised = rows.map((r) => r - min);
  const max = Math.max(...normalised);
  if (max > modules.length * 3) return sequential;
  if (new Set(normalised).size !== normalised.length) return sequential;
  return normalised;
}

function connector(a: SpineNode, b: SpineNode): string {
  const y1 = a.y + a.height;
  const y2 = b.y;
  if (y2 - y1 < 8) {
    // Side by side on the same row: join the facing edges.
    const ax = a.cx < b.cx ? a.x + a.width : a.x;
    const bx = a.cx < b.cx ? b.x : b.x + b.width;
    const my = a.y + a.height / 2;
    return `M ${ax} ${my} L ${bx} ${my}`;
  }
  if (a.cx === b.cx) return `M ${a.cx} ${y1} L ${b.cx} ${y2}`;
  const mid = (y2 - y1) / 2;
  return `M ${a.cx} ${y1} C ${a.cx} ${y1 + mid}, ${b.cx} ${y2 - mid}, ${b.cx} ${y2}`;
}

/** Pure: takes modules already sorted by order, returns fixed coordinates. */
export function buildSpine(modules: Module[]): SpineDiagram {
  if (modules.length === 0) {
    return { nodes: [], edges: [], width: SPINE_WIDTH, height: 0, centreLane: 'spine' };
  }

  const centreLane = centreLaneOf(modules);
  const rows = rowIndices(modules);

  const nodes: SpineNode[] = modules.map((module, i) => {
    const column = columnFor(module.layout?.lane ?? centreLane, centreLane);
    const { x, width } = xFor(column);
    const rowIndex = rows[i];
    const y = GEO.padY + rowIndex * GEO.rowHeight;
    return {
      module,
      column,
      rowIndex,
      x,
      y,
      width,
      height: GEO.nodeHeight,
      cx: x + width / 2,
    };
  });

  const edges: SpineEdge[] = [];
  for (let i = 0; i < nodes.length - 1; i += 1) {
    const a = nodes[i];
    const b = nodes[i + 1];
    edges.push({
      id: `${a.module.id}--${b.module.id}`,
      d: connector(a, b),
      lateral: a.column !== b.column,
    });
  }

  const height =
    GEO.padY * 2 + Math.max(...nodes.map((n) => n.rowIndex)) * GEO.rowHeight + GEO.nodeHeight;

  return { nodes, edges, width: SPINE_WIDTH, height, centreLane };
}
