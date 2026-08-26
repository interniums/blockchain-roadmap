/**
 * Roadmap geometry — pure, deterministic, derived only from authored `layout { lane, row }`.
 *
 * Nothing here measures the DOM or reacts to viewport size. The board is a fixed pixel
 * canvas rendered on the server at build time; the same YAML always produces the same
 * coordinates, so the map you learned last month is the same map today.
 */

import type { Lane, Track } from '@/lib/content/types';

// ---- board constants -------------------------------------------------------

export const CARD_W = 340;
export const CARD_H = 204;
export const ROW_TOP = 44;
export const ROW_PITCH = 324;
export const BOARD_W = 1240;
export const BOARD_PAD_BOTTOM = 76;

/** Lane centre lines. Three columns: elective / core spine / elective. */
export const LANE_X: Record<Lane, number> = { left: 190, spine: 620, right: 1050 };

/** left → spine → right, used to decide which face of a card an edge leaves from. */
const LANE_RANK: Record<Lane, number> = { left: 0, spine: 1, right: 2 };

export interface Box {
  x: number; y: number; w: number; h: number; cx: number; cy: number;
}

export function cardBox(lane: Lane, row: number): Box {
  const cx = LANE_X[lane];
  const y = ROW_TOP + (row - 1) * ROW_PITCH;
  return { x: cx - CARD_W / 2, y, w: CARD_W, h: CARD_H, cx, cy: y + CARD_H / 2 };
}

export function boardHeight(maxRow: number): number {
  return ROW_TOP + (maxRow - 1) * ROW_PITCH + CARD_H + BOARD_PAD_BOTTOM;
}

/** Vertical gap between a card's bottom and the next row's top — where checkpoints sit. */
export const CHECKPOINT_TOP = CARD_H + 34;
export const CHECKPOINT_BLEED = 44; // how far the checkpoint pill overhangs the card, each side

/** Reserved strip at the foot of a card for the prerequisite text. */
export const CARD_DEPS_H = 50;

// ---- edges -----------------------------------------------------------------

export type EdgeKind = 'spine' | 'cross';

export interface RoadmapEdge {
  id: string;
  from: string;
  to: string;
  kind: EdgeKind;
  /** SVG path data, absolute board coordinates. */
  d: string;
}

type Side = 'top' | 'bottom' | 'left' | 'right';

interface Pair {
  from: Track; to: Track;
  fromSide: Side; toSide: Side;
  kind: EdgeKind;
}

function sidesFor(from: Track, to: Track): { fromSide: Side; toSide: Side } {
  const a = from.layout;
  const b = to.layout;
  if (a.lane === b.lane) {
    return b.row > a.row ? { fromSide: 'bottom', toSide: 'top' } : { fromSide: 'top', toSide: 'bottom' };
  }
  const rightward = LANE_RANK[b.lane] > LANE_RANK[a.lane];
  return rightward ? { fromSide: 'right', toSide: 'left' } : { fromSide: 'left', toSide: 'right' };
}

function anchor(box: Box, side: Side, offset: number): { x: number; y: number } {
  switch (side) {
    case 'top': return { x: box.cx + offset, y: box.y };
    case 'bottom': return { x: box.cx + offset, y: box.y + box.h };
    case 'left': return { x: box.x, y: box.cy + offset };
    case 'right': return { x: box.x + box.w, y: box.cy + offset };
  }
}

/**
 * Collect every authored connection once. `entersFrom` and `feedsInto` are two views of the
 * same relation, so the union is de-duplicated by direction.
 */
function collectPairs(tracks: Track[]): Pair[] {
  const byId = new Map(tracks.map((t) => [t.id, t]));
  const seen = new Set<string>();
  const pairs: Pair[] = [];

  const push = (fromId: string, toId: string) => {
    const from = byId.get(fromId);
    const to = byId.get(toId);
    if (!from || !to || from.id === to.id) return;
    const key = `${from.id}>${to.id}`;
    if (seen.has(key)) return;
    seen.add(key);
    const { fromSide, toSide } = sidesFor(from, to);
    const spine =
      from.layout.lane === 'spine' && to.layout.lane === 'spine' &&
      Math.abs(to.layout.row - from.layout.row) === 1;
    pairs.push({ from, to, fromSide, toSide, kind: spine ? 'spine' : 'cross' });
  };

  for (const t of tracks) {
    for (const f of t.entersFrom ?? []) push(f, t.id);
    for (const g of t.feedsInto ?? []) push(t.id, g);
  }
  return pairs;
}

/**
 * When several edges share one face of a card, fan them out along that face so no two
 * endpoints land on the same pixel. Deterministic: sorted by the other track's row, then number.
 */
function fanOffsets(pairs: Pair[]): Map<string, number> {
  const buckets = new Map<string, { key: string; sortRow: number; sortNum: number }[]>();

  const add = (trackId: string, side: Side, key: string, other: Track) => {
    const b = `${trackId}:${side}`;
    const list = buckets.get(b) ?? [];
    list.push({ key, sortRow: other.layout.row, sortNum: other.number });
    buckets.set(b, list);
  };

  for (const p of pairs) {
    const key = `${p.from.id}>${p.to.id}`;
    add(p.from.id, p.fromSide, `${key}|from`, p.to);
    add(p.to.id, p.toSide, `${key}|to`, p.from);
  }

  const out = new Map<string, number>();
  for (const [bucket, list] of buckets) {
    list.sort((a, b) => a.sortRow - b.sortRow || a.sortNum - b.sortNum);
    const side = bucket.split(':')[1] as Side;
    const step = side === 'left' || side === 'right' ? 20 : 26;
    for (let i = 0; i < list.length; i += 1) {
      out.set(list[i].key, (i - (list.length - 1) / 2) * step);
    }
  }
  return out;
}

function pathFor(p: Pair, from: Box, to: Box, p1: { x: number; y: number }, p2: { x: number; y: number }): string {
  const sameLane = p.from.layout.lane === p.to.layout.lane;
  if (sameLane) {
    // The core spine. A straight run, nothing clever.
    return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
  }

  const sx = Math.sign(p2.x - p1.x) || 1;
  const laneGap = Math.abs(LANE_RANK[p.to.layout.lane] - LANE_RANK[p.from.layout.lane]);

  if (p.from.layout.row === p.to.layout.row && laneGap > 1) {
    // left lane ↔ right lane on the same row: dip under the spine card that sits between them.
    const k = from.h + 44;
    return `M ${p1.x} ${p1.y} C ${p1.x + sx * 80} ${p1.y + k} ${p2.x - sx * 80} ${p2.y + k} ${p2.x} ${p2.y}`;
  }

  const c = Math.max(60, Math.abs(p2.x - p1.x) * 0.6 + 30);
  return `M ${p1.x} ${p1.y} C ${p1.x + sx * c} ${p1.y} ${p2.x - sx * c} ${p2.y} ${p2.x} ${p2.y}`;
}

export function buildEdges(tracks: Track[]): RoadmapEdge[] {
  const pairs = collectPairs(tracks);
  const offsets = fanOffsets(pairs);

  return pairs.map((p) => {
    const key = `${p.from.id}>${p.to.id}`;
    const fromBox = cardBox(p.from.layout.lane, p.from.layout.row);
    const toBox = cardBox(p.to.layout.lane, p.to.layout.row);
    const p1 = anchor(fromBox, p.fromSide, offsets.get(`${key}|from`) ?? 0);
    const p2 = anchor(toBox, p.toSide, offsets.get(`${key}|to`) ?? 0);
    return { id: key, from: p.from.id, to: p.to.id, kind: p.kind, d: pathFor(p, fromBox, toBox, p1, p2) };
  });
}

// ---- DOM order -------------------------------------------------------------

/**
 * DOM order is the structural truth (the SVG is decorative). Row by row, and within a row
 * the core spine track first, then the electives that branch off it.
 */
const DOM_LANE_ORDER: Record<Lane, number> = { spine: 0, left: 1, right: 2 };

export function domOrder(tracks: Track[]): Track[] {
  return [...tracks].sort(
    (a, b) =>
      a.layout.row - b.layout.row ||
      DOM_LANE_ORDER[a.layout.lane] - DOM_LANE_ORDER[b.layout.lane] ||
      a.number - b.number,
  );
}
