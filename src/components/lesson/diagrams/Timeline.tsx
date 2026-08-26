import { Canvas, Eyebrow, FS, INK, INK2, INK3, RULE, T, type Tone, textW, tone } from './kit';

export type Span = { label: string; start: number; end: number; note?: string; tone?: Tone };
export type Mark = { at: number; label: string; tone?: Tone };

const W = 660;
const AXIS_H = 20;
const LANE_H = 30;
const LANE_GAP = 6;

/**
 * A measured time axis: slot and epoch structure, challenge and exit windows, fork schedules,
 * the gap between two events. Spans pack into lanes so overlapping windows stay separately readable
 * rather than stacking into a single ambiguous bar.
 */
export function Timeline({
  from, to, unit, spans = [], marks = [], ticks, caption,
}: {
  from: number; to: number; unit?: string;
  spans?: Span[]; marks?: Mark[]; ticks?: number[]; caption?: string;
}) {
  const span = to - from || 1;
  const x = (v: number) => ((v - from) / span) * W;
  const tickAt = ticks ?? [from, from + span / 2, to];

  const laid = [...spans].sort((a, b) => a.start - b.start);
  const laneEnd: number[] = [];
  const lane = new Map<Span, number>();
  for (const s of laid) {
    const need = Math.max(x(s.end), x(s.start) + textW(s.label, FS.note) + 14);
    let i = 0;
    while (laneEnd[i] != null && laneEnd[i] > x(s.start) - 6) i++;
    laneEnd[i] = need;
    lane.set(s, i);
  }
  const lanes = laneEnd.length;

  const headroom = caption ? 16 : 0;
  const markH = marks.length ? 26 : 0;
  const bandTop = headroom + markH;
  const H = bandTop + lanes * (LANE_H + LANE_GAP) + AXIS_H + 8;
  const axisY = bandTop + lanes * (LANE_H + LANE_GAP) + 2;

  return (
    <Canvas w={W + 2} h={H}>
      {caption && <Eyebrow x={0} y={6}>{caption}</Eyebrow>}

      {marks.map((m, i) => {
        const c = tone(m.tone ?? 'danger');
        return (
          <g key={i}>
            <path d={`M${Math.min(W - 0.5, Math.max(0.5, x(m.at)))} ${bandTop - 6} V${axisY}`} stroke={c.hue} strokeWidth={1} strokeDasharray="3 3" />
            <T x={x(m.at)} y={headroom + 8} size={FS.tiny} fill={c.hue}
               anchor={x(m.at) < 40 ? 'start' : x(m.at) > W - 40 ? 'end' : 'middle'}>
              {m.label}
            </T>
          </g>
        );
      })}

      {laid.map((s, i) => {
        const c = tone(s.tone);
        const l = lane.get(s)!;
        const y = bandTop + l * (LANE_H + LANE_GAP);
        const x0 = x(s.start);
        const w = Math.max(3, x(s.end) - x0);
        const inside = w > textW(s.label, FS.note) + 12;
        return (
          <g key={i}>
            <rect x={x0} y={y} width={w} height={s.note ? LANE_H - 12 : LANE_H - 8} rx={3}
                  fill={c.fill} stroke={c.stroke} />
            <T x={inside ? x0 + w / 2 : x0 + w + 6} y={y + (s.note ? LANE_H - 12 : LANE_H - 8) / 2}
               size={FS.note} fill={inside ? c.ink : INK} anchor={inside ? 'middle' : 'start'}>
              {s.label}
            </T>
            {s.note && (() => {
              // Anchored left by default, but a span that starts late would push its note off the
              // right edge; flip the anchor rather than let the text leave the canvas.
              const overruns = x0 + textW(s.note, FS.tiny) > W;
              return (
                <T x={overruns ? W : x0} y={y + LANE_H - 5} size={FS.tiny} fill={INK2}
                   anchor={overruns ? 'end' : 'start'}>
                  {s.note}
                </T>
              );
            })()}
          </g>
        );
      })}

      <line x1={0} x2={W} y1={axisY} y2={axisY} stroke={RULE} />
      {tickAt.map((t, i) => (
        <g key={i}>
          <line x1={x(t)} x2={x(t)} y1={axisY} y2={axisY + 4} stroke={RULE} />
          <T x={x(t)} y={axisY + 12} size={FS.tiny} fill={INK3}
             anchor={i === 0 ? 'start' : i === tickAt.length - 1 ? 'end' : 'middle'}>
            {i === tickAt.length - 1 && unit ? `${fmt(t)} ${unit}` : fmt(t)}
          </T>
        </g>
      ))}
    </Canvas>
  );
}

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
