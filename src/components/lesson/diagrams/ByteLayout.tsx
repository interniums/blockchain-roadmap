import { Box, Canvas, Eyebrow, FS, INK2, INK3, RULE, T, type Tone, charW, textW, tone } from './kit';

export type ByteField = {
  label: string;
  /** Size in `unit`. Omit for a field whose length is not fixed. */
  size?: number;
  /** Renders as a trailing ellipsis band — the field runs to the end of the payload. */
  variable?: boolean;
  note?: string;
  tone?: Tone;
};

const MAXW = 660;
const H = 34;
const PAD = 9;
const ROW_GAP = 30;

/**
 * A byte- or bit-field diagram: transaction envelopes, calldata, storage slots, RLP payloads.
 *
 * Widths are driven by the label by default, because true proportionality between a 4-byte selector
 * and a 32-byte word produces a band nobody can read. Pass `proportional` for the cases where the
 * ratio is the actual lesson.
 */
export function ByteLayout({
  fields, unit = 'bytes', offsets, proportional, total, caption,
}: {
  fields: ByteField[];
  unit?: 'bytes' | 'bits' | 'words';
  /**
   * Print the running offset above each boundary. Pass `"hex"` for anything the surrounding prose
   * addresses in hex — a Solidity memory map reads 0x40 / 0x60 / 0x80, and a decimal rule beside it
   * forces the reader to convert on every glance.
   */
  offsets?: boolean | 'hex' | 'dec';
  proportional?: boolean;
  /**
   * Denominator for `proportional`, in the same unit as `size`.
   *
   * Without it each figure normalises to its own field total, so a four-slot layout and a six-slot
   * layout render the same width and the reader cannot see that one is longer — which is usually the
   * exact comparison the lesson is making. Give both figures the same `total` and their widths become
   * directly comparable.
   */
  total?: number;
  caption?: string;
}) {
  const suffix = unit === 'bits' ? 'b' : unit === 'words' ? 'w' : 'B';
  const chip = (f: ByteField) => (f.variable ? '…' : f.size != null ? `${f.size}${suffix}` : '');

  const natural = fields.map((f) => {
    const own = Math.max(textW(f.label, FS.label), textW(chip(f), FS.tiny), f.note ? textW(f.note, FS.tiny) : 0);
    return Math.max(46, own + PAD * 2);
  });
  const widths = proportional
    ? (() => {
        const known = total ?? fields.reduce((s, f) => s + (f.size ?? 1), 0);
        const px = MAXW / known;
        return fields.map((f, i) => Math.max(natural[i] * 0.55, (f.size ?? 1) * px));
      })()
    : natural;

  // Pack into rows so a long envelope wraps instead of scrolling off the column.
  const rows: number[][] = [[]];
  let used = 0;
  fields.forEach((_, i) => {
    if (used + widths[i] > MAXW && rows[rows.length - 1].length) { rows.push([]); used = 0; }
    rows[rows.length - 1].push(i);
    used += widths[i];
  });

  const headroom = offsets ? 14 : 0;
  const off = (n: number) => (offsets === 'hex' ? `0x${n.toString(16)}` : String(n));
  // In proportional mode a genuinely small field is genuinely narrow, and its label will not fit
  // inside. Truncating it to "va…" destroys the label to preserve the box; putting the label
  // underneath preserves both, which is what a hand-drawn diagram does.
  const outside = fields.map((f, i) => clip(f.label, widths[i]).clipped);
  const anyOutside = outside.some(Boolean);
  const noteRow = (fields.some((f) => f.note) ? 15 : 0) + (anyOutside ? 13 : 0);
  const W = Math.max(...rows.map((r) => r.reduce((s, i) => s + widths[i], 0)));
  const Hh = headroom + rows.length * (H + noteRow) + (rows.length - 1) * (ROW_GAP - noteRow) + (caption ? 16 : 0);

  let running = 0;
  const startOffset: number[] = [];
  fields.forEach((f) => { startOffset.push(running); running += f.size ?? 0; });

  return (
    <Canvas w={W} h={Hh}>
      {caption && <Eyebrow x={0} y={6}>{caption}</Eyebrow>}
      {rows.map((row, r) => {
        const y = (caption ? 16 : 0) + headroom + r * (H + noteRow + ROW_GAP - noteRow);
        const xs: number[] = [];
        row.reduce((acc, i, k) => { xs[k] = acc; return acc + widths[i]; }, 0);
        const rowEnd = xs[row.length - 1] + widths[row[row.length - 1]];
        return (
          <g key={r}>
            {row.map((i, k) => {
              const f = fields[i];
              const x = xs[k];
              const w = widths[i];
              const c = tone(f.tone);
              return (
                <g key={i}>
                  <Box x={x} y={y} w={w} h={H} t={f.tone} r={2} dashed={f.variable} />
                  {!outside[i] && (
                    <T x={x + w / 2} y={y + 12} fill={c.ink}>{f.label}</T>
                  )}
                  {outside[i] && (
                    <>
                      <path d={`M${x + w / 2} ${y + H} v6`} stroke={c.stroke} strokeWidth={0.75} />
                      <T x={x + w / 2} y={y + H + 12} size={FS.tiny} fill={c.ink}>{f.label}</T>
                    </>
                  )}
                  <T x={x + w / 2} y={y + (outside[i] ? H / 2 : 25)} size={FS.tiny} fill={INK3}>
                    {chip(f)}
                  </T>
                  {offsets && f.size != null && (
                    <T x={x} y={y - 7} size={FS.tiny} fill={INK3} anchor={i === row[0] ? 'start' : 'middle'}>
                      {off(startOffset[i])}
                    </T>
                  )}
                  {f.note && (
                    <T x={x + w / 2} y={y + H + (anyOutside ? 24 : 8)} size={FS.tiny} fill={INK2}
                       clipped={clip(f.note, w + 24, FS.tiny).clipped}>
                      {clip(f.note, w + 24, FS.tiny).text}
                    </T>
                  )}
                </g>
              );
            })}
            {offsets && (
              <T x={rowEnd} y={y - 7} size={FS.tiny} fill={INK3} anchor="end">{off(running)}</T>
            )}
            {r < rows.length - 1 && (
              <line x1={0} x2={W} y1={y + H + noteRow + 12} y2={y + H + noteRow + 12} stroke={RULE} strokeDasharray="2 4" />
            )}
          </g>
        );
      })}
    </Canvas>
  );
}

/**
 * Truncate to what actually fits, so a long label never bleeds past its field.
 *
 * The size argument is not optional in practice: notes render at FS.tiny, and measuring them against
 * FS.label silently cut them mid-word at roughly three-quarters of the width they actually had.
 */
function clip(s: string, w: number, size: number = FS.label) {
  const cols = Math.floor((w - 8) / charW(size));
  if (s.length <= cols) return { text: s, clipped: false };
  return { text: s.slice(0, Math.max(1, cols - 1)) + '…', clipped: true };
}
