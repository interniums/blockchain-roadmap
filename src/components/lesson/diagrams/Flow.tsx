import { Arrow, Box, Canvas, Eyebrow, FS, INK2, T, type Tone, maxTextW, round, textW, tone, wrap } from './kit';

export type FlowNode = {
  id: string;
  label: string;
  /** Second line, dimmer — what the step actually does, or what it costs. */
  note?: string;
  tone?: Tone;
  /** Column index, left to right. Nodes sharing a column are alternatives or parallel work. */
  col: number;
  /** Optional explicit row inside the column; defaults to declaration order. */
  row?: number;
  dashed?: boolean;
};

export type FlowEdge = {
  from: string;
  to: string;
  label?: string;
  tone?: Tone;
  dashed?: boolean;
};

const PAD_X = 10;
const PAD_Y = 9;
const LINE = 14;
const COL_GAP = 44;
const ROW_GAP = 14;
const MIN_W = 84;
const WRAP_COLS = 22;

/**
 * A left-to-right sequence of steps. Columns advance the process; stacking two nodes in one column
 * shows a fork or work that happens together. Edges default to chaining consecutive columns, which
 * covers the common case without asking the author to name every connection.
 */
export function Flow({
  nodes, edges, lanes, dir = 'right',
}: {
  nodes: FlowNode[];
  edges?: FlowEdge[];
  /** Optional heading above each column. */
  lanes?: string[];
  dir?: 'right' | 'down';
}) {
  const cols = Math.max(...nodes.map((n) => n.col)) + 1;
  const byCol: FlowNode[][] = Array.from({ length: cols }, () => []);
  for (const n of nodes) byCol[n.col].push(n);
  for (const c of byCol) c.sort((a, b) => (a.row ?? 0) - (b.row ?? 0));

  const laid = new Map<string, { x: number; y: number; w: number; h: number; n: FlowNode }>();
  const size = (n: FlowNode) => {
    const lines = wrap(n.label, WRAP_COLS);
    const w = Math.max(MIN_W, maxTextW(lines, FS.label), n.note ? maxTextW(wrap(n.note, WRAP_COLS + 4), FS.note) : 0) + PAD_X * 2;
    const noteLines = n.note ? wrap(n.note, WRAP_COLS + 4).length : 0;
    const h = lines.length * LINE + noteLines * (LINE - 2) + PAD_Y * 2;
    return { w, h, lines, noteLines };
  };

  const colW = byCol.map((c) => Math.max(...c.map((n) => size(n).w)));
  const colH = byCol.map((c) => c.reduce((s, n) => s + size(n).h, 0) + (c.length - 1) * ROW_GAP);
  // Lanes label columns when the flow runs right, and rows when it runs down. In vertical mode they
  // therefore need a left gutter, not headroom — stacking every label at x=0 makes them unreadable.
  const vertLanes = dir === 'down' && !!lanes?.length;
  const headroom = lanes?.length && dir === 'right' ? 18 : 0;
  const gutter = vertLanes ? maxTextW(lanes!, FS.tiny) + 14 : 0;
  const rowMid: number[] = [];
  // Where each rank starts and how thick it is, in whichever axis the flow advances. Routing needs
  // it: the COL_GAP between two ranks is the one strip of canvas guaranteed to hold no box, so a
  // wire that has to get out of the way has somewhere to go that is clear by construction.
  const rankAt: number[] = [];
  const rankSize: number[] = [];

  let W: number, H: number;
  if (dir === 'right') {
    W = colW.reduce((a, b) => a + b, 0) + (cols - 1) * COL_GAP;
    H = Math.max(...colH) + headroom;
    let x = 0;
    byCol.forEach((c, i) => {
      let y = headroom + (H - headroom - colH[i]) / 2;
      rankAt[i] = x;
      rankSize[i] = colW[i];
      for (const n of c) {
        const { w, h } = size(n);
        laid.set(n.id, { x: x + (colW[i] - w) / 2, y, w, h, n });
        y += h + ROW_GAP;
      }
      x += colW[i] + COL_GAP;
    });
  } else {
    // Running down, a "column" is a ROW: its width is the sum of its nodes plus the gaps between
    // them, not the widest single node. Using colW here clipped any row holding more than one node.
    const rowWidths = byCol.map((c) => c.reduce((s, n) => s + size(n).w, 0) + (c.length - 1) * ROW_GAP);
    const body = Math.max(...rowWidths);
    W = gutter + body;
    let y = 0;
    byCol.forEach((c, i) => {
      let x = gutter + (body - rowWidths[i]) / 2;
      const rh = Math.max(...c.map((n) => size(n).h));
      rowMid[i] = y + rh / 2;
      rankAt[i] = y;
      rankSize[i] = rh;
      for (const n of c) {
        const { w, h } = size(n);
        laid.set(n.id, { x, y: y + (rh - h) / 2, w, h, n });
        x += w + ROW_GAP;
      }
      y += rh + COL_GAP;
    });
    H = y - COL_GAP;
  }

  // An edge that runs backwards — re-entry, a retry, a payment at the end of the pipeline — cannot
  // be drawn straight: it would leave the source's right side and cross its own box to reach a node
  // on the left. Route it through a channel outside the nodes instead, which is how the shape is
  // drawn by hand and the only honest way to show a frame being re-entered before it finished.
  //
  // These used to default to the `danger` tone. That was the component asserting a judgement the
  // author had not made: a loop is as often restorative (arbitrage closing a gap, a fee market
  // correcting) as it is destructive (a spiral, a re-entrancy). Two figures in the corpus drew a
  // benign fallback and an ordinary protocol step in the failure colour because of it. The tone is
  // the author's to choose, like every other tone in this kit.
  const chain: FlowEdge[] = [];
  if (!edges) {
    for (let i = 0; i < cols - 1; i++)
      for (const a of byCol[i]) for (const b of byCol[i + 1]) chain.push({ from: a.id, to: b.id });
  }
  const wires = edges ?? chain;

  const colOf = (id: string) => nodes.find((n) => n.id === id)?.col ?? 0;
  const backEdges = wires.filter((e) => colOf(e.to) < colOf(e.from));
  const CHANNEL = 32;
  // Running right, the return channel sits below the row. Running DOWN it cannot: every node in a
  // single-node-per-row flow shares a centre x, so a channel underneath draws the edge straight up
  // the centreline and through every box between the two ends. Beside the nodes is the only clear
  // route, so vertical flows reserve width instead of height.
  const vertical = dir === 'down';

  // ---------------------------------------------------------------------------------------------
  // Routing. A wire drawn across a box it does not connect reads as a link that is not in the data,
  // and nothing downstream can catch it: the figure renders, fits its column and truncates nothing.
  // The layout is finished by this point, so the crossing is knowable here — test the obvious route
  // and take the long way round when it fails, rather than leaving the author to find it by reading
  // path `d` out of the DOM.
  // ---------------------------------------------------------------------------------------------
  type Pt = [number, number];
  type Lay = { x: number; y: number; w: number; h: number };
  const boxes = [...laid.values()];
  /** A wire run along a border is drawn ON that border; only the inside is a crossing. */
  const CLEAR = 2.5;
  /** And a bite this shallow is a rounded coordinate, not a line through a node. */
  const NICK = 5;

  /** Liang–Barsky: how much of p→q lies inside r. */
  const insideLen = (p: Pt, q: Pt, r: Lay) => {
    const x = r.x + CLEAR, y = r.y + CLEAR, w = r.w - CLEAR * 2, h = r.h - CLEAR * 2;
    if (w <= 0 || h <= 0) return 0;
    const dx = q[0] - p[0], dy = q[1] - p[1];
    let t0 = 0, t1 = 1;
    const clip = (a: number, b: number) => {
      if (a === 0) return b >= 0;
      const t = b / a;
      if (a < 0) { if (t > t1) return false; if (t > t0) t0 = t; }
      else { if (t < t0) return false; if (t < t1) t1 = t; }
      return true;
    };
    const ok = clip(-dx, p[0] - x) && clip(dx, x + w - p[0]) && clip(-dy, p[1] - y) && clip(dy, y + h - p[1]);
    return ok ? Math.hypot(dx, dy) * Math.max(0, t1 - t0) : 0;
  };

  /** Does this route cross a box that is not one of its own ends? */
  const blocked = (pts: Pt[], ends: [string, string]) =>
    pts.some((p, i) => i > 0 && boxes.some((b) =>
      b.n.id !== ends[0] && b.n.id !== ends[1] && insideLen(pts[i - 1], p, b) > NICK));

  /** The empty strips either side of a rank. */
  const before = (i: number) => rankAt[i] - COL_GAP / 2;
  const after = (i: number) => rankAt[i] + rankSize[i] + COL_GAP / 2;
  const mid = (u: number, v: number) => (u + v) / 2;

  /**
   * The obvious route: out of one box, into the next, at most one elbow. Two nodes in the SAME rank
   * are neighbours across the flow's other axis — side by side when it runs down, stacked when it
   * runs right — so they connect on that axis. Handing them the advancing axis sent the wire out of
   * the source's trailing edge and back in over the top of it, which is what a same-rank edge drew
   * until the crossing check went in.
   */
  const direct = (a: Lay, b: Lay, sameRank: boolean) => {
    const along: 'h' | 'v' = sameRank !== vertical ? 'v' : 'h';
    let from: Pt, to: Pt;
    if (along === 'h') {
      const right = b.x >= a.x;
      from = [right ? a.x + a.w : a.x, a.y + a.h / 2];
      to = [right ? b.x - 5 : b.x + b.w + 5, b.y + b.h / 2];
    } else {
      const down = b.y >= a.y;
      from = [a.x + a.w / 2, down ? a.y + a.h : a.y];
      to = [b.x + b.w / 2, down ? b.y - 5 : b.y + b.h + 5];
    }
    const straight = along === 'h' ? from[1] === to[1] : from[0] === to[0];
    const pts: Pt[] = straight ? [from, to]
      : along === 'h'
        ? [from, [mid(from[0], to[0]), from[1]], [mid(from[0], to[0]), to[1]], to]
        : [from, [from[0], mid(from[1], to[1])], [to[0], mid(from[1], to[1])], to];
    return { from, to, along, straight, pts };
  };

  // An edge that skips a rank — col 0 straight to col 2 — has a box sitting in its way whenever the
  // rank it skips is occupied at that height. Give it a lane outside the body and reach it through
  // the empty strips, so it enters its target the same way every other forward edge does.
  const needsBypass = wires.map((e) => {
    const a = laid.get(e.from), b = laid.get(e.to);
    if (!a || !b || colOf(e.to) < colOf(e.from)) return false;
    return blocked(direct(a, b, colOf(e.from) === colOf(e.to)).pts, [e.from, e.to]);
  });
  const anyBypass = needsBypass.some(Boolean);
  // Horizontally the lane goes above the band, which the band has to make room for. Shifting the
  // boxes is safe here and only here: every route is computed after this point.
  const TOP = anyBypass && !vertical ? CHANNEL - 10 : 0;
  if (TOP) for (const v of boxes) v.y += TOP;
  H += TOP;

  // The channel carries the path; the label sits outside it and needs its own room, or it is clipped
  // at the canvas edge — which is how it first shipped.
  const backLabelW = backEdges.reduce((m, e) => Math.max(m, e.label ? textW(e.label, FS.tiny) + 8 : 0), 0);
  const byLane = vertical ? W + CHANNEL / 2 : headroom + 11;
  const backLane = vertical ? W + (anyBypass ? CHANNEL : 0) + CHANNEL / 2 : H + 11;
  const Hc = H + (backEdges.length && !vertical ? CHANNEL : 0);
  const Wc = vertical
    ? W + (anyBypass ? CHANNEL : 0) + (backEdges.length ? CHANNEL + backLabelW : 0)
    : W;

  const bypass = (a: Lay, b: Lay, ra: number, rb: number): Pt[] => vertical
    ? [[a.x + a.w / 2, a.y + a.h], [a.x + a.w / 2, after(ra)], [byLane, after(ra)],
       [byLane, before(rb)], [b.x + b.w / 2, before(rb)], [b.x + b.w / 2, b.y - 5]]
    : [[a.x + a.w, a.y + a.h / 2], [after(ra), a.y + a.h / 2], [after(ra), byLane],
       [before(rb), byLane], [before(rb), b.y + b.h / 2], [b.x - 5, b.y + b.h / 2]];

  /**
   * A back-edge leaves its source, runs the return channel and comes back in. Both of those short
   * legs cross the source's or target's own column, so a node stacked under either one sits in the
   * way — a figure with two nodes in the last column drew the return straight down through the
   * lower one. When that happens, leave and re-enter sideways through the empty strip instead.
   */
  const backRoute = (a: Lay, b: Lay, ra: number, rb: number, ends: [string, string]): Pt[] => {
    if (vertical) {
      let out: Pt[] = [[a.x + a.w, a.y + a.h / 2], [backLane, a.y + a.h / 2]];
      if (blocked(out, ends)) out = [[a.x + a.w / 2, a.y + a.h], [a.x + a.w / 2, after(ra)], [backLane, after(ra)]];
      let inn: Pt[] = [[backLane, b.y + b.h / 2], [b.x + b.w + 5, b.y + b.h / 2]];
      if (blocked(inn, ends)) inn = [[backLane, before(rb)], [b.x + b.w / 2, before(rb)], [b.x + b.w / 2, b.y - 5]];
      return [...out, ...inn];
    }
    let out: Pt[] = [[a.x + a.w / 2, a.y + a.h], [a.x + a.w / 2, backLane]];
    if (blocked(out, ends)) out = [[a.x, a.y + a.h / 2], [before(ra), a.y + a.h / 2], [before(ra), backLane]];
    let inn: Pt[] = [[b.x + b.w / 2, backLane], [b.x + b.w / 2, b.y + b.h + 5]];
    if (blocked(inn, ends)) inn = [[after(rb), backLane], [after(rb), b.y + b.h / 2], [b.x + b.w + 5, b.y + b.h / 2]];
    return [...out, ...inn];
  };

  /** Orthogonal runs stay H/V rather than L: the `d` is read by hand when a figure looks wrong. */
  const dOf = (pts: Pt[]) => pts.map((p, i) => {
    if (i === 0) return `M${round(p[0])} ${round(p[1])}`;
    const q = pts[i - 1];
    if (p[1] === q[1]) return `H${round(p[0])}`;
    if (p[0] === q[0]) return `V${round(p[1])}`;
    return `L${round(p[0])} ${round(p[1])}`;
  }).join(' ');

  /** Midpoint of the longest leg — the one stretch of a rerouted wire with room for a caption. */
  const labelAt = (pts: Pt[]): Pt => {
    let best: Pt = pts[0], len = -1;
    for (let i = 1; i < pts.length; i++) {
      const d = Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]);
      if (d > len) { len = d; best = [mid(pts[i - 1][0], pts[i][0]), mid(pts[i - 1][1], pts[i][1])]; }
    }
    return best;
  };

  return (
    <Canvas w={Wc} h={Hc}>
      {lanes?.map((l, i) => {
        if (!l) return null;
        return vertLanes
          ? <Eyebrow key={i} x={0} y={rowMid[i]}>{l}</Eyebrow>
          : <Eyebrow key={i} x={colW.slice(0, i).reduce((a, b) => a + b, 0) + i * COL_GAP} y={7}>{l}</Eyebrow>;
      })}

      {wires.map((e, wi) => {
        const a = laid.get(e.from);
        const b = laid.get(e.to);
        if (!a || !b) return null;
        const ra = colOf(e.from);
        const rb = colOf(e.to);
        const t = tone(e.tone);
        const ends: [string, string] = [e.from, e.to];

        if (rb < ra) {
          const pts = backRoute(a, b, ra, rb, ends);
          // The label sits outside the channel run, not on it: on the vertical lane it reads down
          // the side, and below a horizontal channel rather than above, because above puts it
          // between the channel and the boxes it just left, where it reads as belonging to them.
          const run = pts.slice(vertical ? 1 : 1, -1);
          const lx = vertical ? backLane + 4 : mid(run[0][0], run[run.length - 1][0]);
          const ly = vertical ? mid(run[0][1], run[run.length - 1][1]) : backLane + 10;
          return (
            <g key={wi}>
              <path
                d={dOf(pts)} fill="none" stroke={t.stroke} strokeWidth={1.25}
                strokeDasharray={e.dashed ? '4 3' : undefined} markerEnd={`url(#ah-${e.tone ?? 'plain'})`}
              />
              {e.label && (
                <T x={lx} y={ly} size={FS.tiny} fill={t.hue} anchor={vertical ? 'start' : 'middle'}>{e.label}</T>
              )}
            </g>
          );
        }

        if (needsBypass[wi]) {
          const pts = bypass(a, b, ra, rb);
          const [lx, ly] = labelAt(pts);
          const lw = e.label ? textW(e.label, FS.tiny) + 6 : 0;
          return (
            <g key={wi}>
              <path
                d={dOf(pts)} fill="none" stroke={t.stroke} strokeWidth={1.25}
                strokeDasharray={e.dashed ? '4 3' : undefined} markerEnd={`url(#ah-${e.tone ?? 'plain'})`}
              />
              {e.label && (
                <>
                  <rect x={round(lx - lw / 2)} y={round(ly - 6.5)} width={round(lw)} height={13} rx={2}
                        fill="var(--color-surface)" />
                  <T x={lx} y={ly} size={FS.tiny} fill={t.hue}>{e.label}</T>
                </>
              )}
            </g>
          );
        }

        const d = direct(a, b, ra === rb);
        return (
          <Arrow
            key={wi} from={d.from} to={d.to} label={e.label} t={e.tone ?? 'plain'}
            dashed={e.dashed} elbow={d.straight ? undefined : d.along}
          />
        );
      })}

      {[...laid.values()].map(({ x, y, w, h, n }) => {
        const lines = wrap(n.label, WRAP_COLS);
        const noteLines = n.note ? wrap(n.note, WRAP_COLS + 4) : [];
        const c = tone(n.tone);
        const total = lines.length * LINE + noteLines.length * (LINE - 2);
        const ty = y + (h - total) / 2 + LINE / 2;
        return (
          <g key={n.id}>
            <Box x={x} y={y} w={w} h={h} t={n.tone} dashed={n.dashed} />
            {lines.map((l, i) => (
              <T key={`l${i}`} x={x + w / 2} y={ty + i * LINE} fill={c.ink}>{l}</T>
            ))}
            {noteLines.map((l, i) => (
              <T key={`n${i}`} x={x + w / 2} y={ty + lines.length * LINE + i * (LINE - 2) + 1}
                 size={FS.note} fill={INK2}>{l}</T>
            ))}
          </g>
        );
      })}
    </Canvas>
  );
}
