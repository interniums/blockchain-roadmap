import { Canvas, Eyebrow, FS, INK2, INK3, RULE, T, type Tone, maxTextW, tone } from './kit';

export type Bar = {
  label: string;
  value: number;
  /** Printed at the end of the bar. Defaults to the value, formatted with thousands separators. */
  display?: string;
  note?: string;
  tone?: Tone;
};

const W = 660;
const ROW = 22;
const GAP = 5;
const PAD = 8;

/**
 * A magnitude series: how much, across a handful of named things.
 *
 * Three separate lessons wanted this and went without — a liquidity histogram, a descending fee
 * series, gas by operation class. `Timeline` is for measured time and `ByteLayout` for encodings, and
 * bending either misrepresents the axis, so those claims stayed in prose where the comparison a
 * reader most needs to *see* is precisely a comparison of sizes.
 *
 * `scale="log"` exists because the honest gas series spans 100 to 20,000: on a linear axis every bar
 * but one is a sliver, which hides the very ratio the figure is for.
 */
export function Bars({
  items, unit, scale = 'linear', caption, axisLabel,
}: {
  items: Bar[];
  unit?: string;
  scale?: 'linear' | 'log';
  caption?: string;
  /** Names what the length means, when `unit` alone is not enough. */
  axisLabel?: string;
}) {
  const labelW = Math.min(200, maxTextW(items.map((b) => b.label), FS.label) + PAD);
  const shown = (b: Bar) => b.display ?? b.value.toLocaleString('en-US');
  const valueW = maxTextW(items.map(shown), FS.note) + 10;
  const trackX = labelW + 10;
  const trackW = W - trackX - valueW - 4;

  const max = Math.max(...items.map((b) => Math.abs(b.value)), 1);
  const min = Math.min(...items.filter((b) => b.value > 0).map((b) => b.value), max);
  const len = (v: number) => {
    if (v <= 0) return 0;
    if (scale === 'linear') return (v / max) * trackW;
    // Anchor the smallest positive bar at a visible stub rather than at zero width, so a log axis
    // still reads as "this one is small" instead of "this one is absent".
    const lo = Math.log(min) - (Math.log(max) - Math.log(min)) / 6 || Math.log(min) - 1;
    const t = (Math.log(v) - lo) / (Math.log(max) - lo || 1);
    return Math.max(3, t * trackW);
  };

  const noteRow = items.some((b) => b.note) ? 11 : 0;
  const head = caption ? 16 : 0;
  const foot = scale === 'log' || axisLabel || unit ? 14 : 0;
  const H = head + items.length * (ROW + GAP + noteRow) + foot;

  return (
    <Canvas w={W} h={H}>
      {caption && <Eyebrow x={0} y={6}>{caption}</Eyebrow>}
      {items.map((b, i) => {
        const y = head + i * (ROW + GAP + noteRow);
        const c = tone(b.tone);
        const w = len(b.value);
        return (
          <g key={i}>
            <T x={labelW} y={y + ROW / 2} size={FS.label} fill={c.ink} anchor="end">{b.label}</T>
            <rect x={trackX} y={y + 3} width={Math.max(0.5, w)} height={ROW - 6} rx={2}
                  fill={c.fill} stroke={c.stroke} />
            <T x={trackX + w + 6} y={y + ROW / 2} size={FS.note} fill={INK2} anchor="start">
              {shown(b)}
            </T>
            {b.note && (
              <T x={labelW} y={y + ROW + 5} size={FS.tiny} fill={INK3} anchor="end">{b.note}</T>
            )}
          </g>
        );
      })}
      <line x1={trackX} x2={trackX} y1={head} y2={head + items.length * (ROW + GAP + noteRow) - GAP}
            stroke={RULE} />
      {foot > 0 && (
        <T x={trackX} y={H - 5} size={FS.tiny} fill={INK3} anchor="start">
          {[axisLabel, unit, scale === 'log' ? 'log scale' : null].filter(Boolean).join(' · ')}
        </T>
      )}
    </Canvas>
  );
}

