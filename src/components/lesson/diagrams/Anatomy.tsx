import { Canvas, FS, INK, INK2, INK3, type Tone, charW, textW, tone } from './kit';

export type AnatomyPart = {
  /** Character index into `value`, half-open: [from, to). */
  from: number;
  to: number;
  label: string;
  note?: string;
  tone?: Tone;
};

const VS = 13;                    // value font size
const CH = charW(VS);
const LINE_H = 22;
const BRACKET = 9;
const LANE_H = 15;
const MAXW = 660;

/**
 * One literal — an address, a calldata blob, a signature, a bytecode fragment — with its parts
 * bracketed and named underneath. This is the diagram for "what are these bytes", which is most of
 * what a first encounter with an encoding actually needs.
 */
export function Anatomy({
  value, parts, cols,
}: { value: string; parts: AnatomyPart[]; cols?: number }) {
  const perLine = cols ?? Math.max(16, Math.floor(MAXW / CH));
  const lines: string[] = [];
  for (let i = 0; i < value.length; i += perLine) lines.push(value.slice(i, i + perLine));

  // Split every part at line boundaries so a span that wraps still brackets correctly on each line.
  type Seg = { line: number; a: number; b: number; part: AnatomyPart; head: boolean };
  const segs: Seg[] = [];
  parts.forEach((p) => {
    for (let i = p.from; i < p.to; ) {
      const line = Math.floor(i / perLine);
      const lineEnd = (line + 1) * perLine;
      const end = Math.min(p.to, lineEnd);
      segs.push({ line, a: i - line * perLine, b: end - line * perLine, part: p, head: i === p.from });
      i = end;
    }
  });

  // Greedy lane packing per line: a label drops a lane only when it would collide with one above.
  const placed = segs.map((s) => {
    const cx = (s.a + s.b) / 2 * CH;
    const w = Math.max(textW(s.part.label, FS.note), s.part.note ? textW(s.part.note, FS.tiny) : 0);
    return { ...s, cx, w, lane: 0, rows: s.part.note ? 2 : 1 };
  });
  const lanesPerLine: number[] = [];
  lines.forEach((_, li) => {
    const mine = placed.filter((s) => s.line === li).sort((a, b) => a.cx - b.cx);
    const occupied: Array<Array<[number, number]>> = [];
    for (const s of mine) {
      const span: [number, number] = [s.cx - s.w / 2 - 4, s.cx + s.w / 2 + 4];
      let lane = 0;
      while (occupied[lane]?.some(([l, r]) => span[0] < r && l < span[1])) lane += s.rows;
      for (let k = 0; k < s.rows; k++) (occupied[lane + k] ??= []).push(span);
      s.lane = lane;
    }
    lanesPerLine[li] = occupied.length;
  });

  // Height comes from where labels actually land, not from a lane count that over-reserves when the
  // deepest lane holds a one-line label.
  const lowest = (li: number) =>
    placed.filter((s) => s.line === li)
      .reduce((m, s) => Math.max(m, s.lane * LANE_H + 5 + (s.part.note ? 12 : 0)), 0);
  const blockH = (li: number) => LINE_H + BRACKET + lowest(li) + 12;
  const valueW = Math.max(...lines.map((l) => l.length)) * CH;
  const yOf = (li: number) => lines.slice(0, li).reduce((s, _, i) => s + blockH(i), 0);
  const H = lines.reduce((s, _, i) => s + blockH(i), 0);

  // Labels centre under their span, so a part at either end of the value hangs past it. Measure the
  // real extent and pad the canvas rather than letting text clip.
  const padL = Math.max(0, ...placed.map((s) => s.w / 2 - s.cx));
  const padR = Math.max(0, ...placed.map((s) => s.cx + s.w / 2 - valueW));
  const W = valueW + padL + padR + 2;

  return (
    <Canvas w={W} h={H}>
     <g transform={`translate(${padL} 0)`}>
      {lines.map((l, li) => {
        const top = yOf(li);
        return (
          <g key={li}>
            {(() => {
              // Colour the characters themselves rather than tinting behind them: on a hex string the
              // run boundaries are the whole point, and a 13%-opacity band does not survive dark mode.
              const mine = placed.filter((q) => q.line === li).sort((a, b) => a.a - b.a);
              const runs: Array<{ a: number; b: number; hue: string }> = [];
              let cur = 0;
              for (const q of mine) {
                if (q.a > cur) runs.push({ a: cur, b: q.a, hue: INK3 });
                runs.push({ a: q.a, b: q.b, hue: tone(q.part.tone).hue });
                cur = q.b;
              }
              if (cur < l.length) runs.push({ a: cur, b: l.length, hue: INK3 });
              return runs.map((r, ri) => (
                <text
                  key={`r${ri}`} x={r.a * CH} y={top + (LINE_H - 4) / 2} fontSize={VS}
                  fill={r.hue === INK3 ? INK3 : r.hue} dominantBaseline="middle" xmlSpace="preserve"
                  textLength={(r.b - r.a) * CH} lengthAdjust="spacing"
                >
                  {l.slice(r.a, r.b)}
                </text>
              ));
            })()}

            {placed.filter((s) => s.line === li).map((s, i) => {
              const c = tone(s.part.tone);
              const x0 = s.a * CH + 1;
              const x1 = s.b * CH - 1;
              const yb = top + LINE_H - 2;
              const cx = (x0 + x1) / 2;
              const labelY = yb + BRACKET + s.lane * LANE_H + 5;
              return (
                <g key={`p${li}-${i}`}>
                  <path
                    d={`M${x0} ${yb} v4 h${x1 - x0} v-4`}
                    fill="none" stroke={c.hue} strokeWidth={1}
                  />
                  <path d={`M${cx} ${yb + 4} V${labelY - 6}`} fill="none" stroke={c.hue} strokeWidth={0.75} opacity={0.55} />
                  {s.head && (
                    <>
                      <text x={cx} y={labelY} fontSize={FS.note} fill={INK} textAnchor="middle" dominantBaseline="middle">
                        {s.part.label}
                      </text>
                      {s.part.note && (
                        <text x={cx} y={labelY + 12} fontSize={FS.tiny} fill={INK2} textAnchor="middle" dominantBaseline="middle">
                          {s.part.note}
                        </text>
                      )}
                    </>
                  )}
                  {!s.head && (
                    <text x={cx} y={labelY} fontSize={FS.tiny} fill={INK3} textAnchor="middle" dominantBaseline="middle">
                      ↳ {s.part.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
     </g>
    </Canvas>
  );
}
