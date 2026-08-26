/**
 * Shared geometry and chrome for lesson diagrams.
 *
 * Every diagram is server-rendered SVG with no client JS. Layout is computed here, never authored:
 * a lesson supplies data, this file decides where things sit. Text is measured rather than guessed,
 * which only works because diagram text is forced to a monospace stack — advance width is then a
 * constant multiple of the font size on every face we care about.
 */

export const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

/** Font sizes. Diagrams read below body copy so they sit under the prose, not over it. */
export const FS = { label: 12, note: 10.5, tiny: 9.5, head: 12.5 } as const;

/** Monospace advance width as a fraction of font size. 0.6 is exact on SF Mono and Menlo. */
const ADVANCE = 0.6;

export const charW = (size: number) => size * ADVANCE;
export const textW = (s: string, size: number = FS.label) => s.length * charW(size);

/** Widest line in a set, in px. */
export const maxTextW = (lines: readonly string[], size: number = FS.label) =>
  lines.reduce((w, l) => Math.max(w, textW(l, size)), 0);

/** Greedy word wrap to a character budget. Long unbreakable tokens get their own line. */
export function wrap(s: string, cols: number): string[] {
  const out: string[] = [];
  let line = '';
  for (const word of s.split(/\s+/).filter(Boolean)) {
    if (!line) line = word;
    else if (line.length + 1 + word.length <= cols) line += ' ' + word;
    else { out.push(line); line = word; }
  }
  if (line) out.push(line);
  return out.length ? out : [''];
}

export type Tone = 'plain' | 'accent' | 'warn' | 'danger' | 'good' | 'muted';

const HUE: Record<Tone, string> = {
  plain: 'var(--color-ink-3)',
  accent: 'var(--color-accent)',
  warn: 'var(--color-warn)',
  danger: 'var(--color-danger)',
  good: 'var(--color-good)',
  muted: 'var(--color-rule)',
};

/** Stroke, a tinted fill derived from the same hue, and the ink that stays legible on it. */
export function tone(t: Tone = 'plain') {
  const stroke = t === 'plain' || t === 'muted' ? 'var(--color-rule)' : HUE[t];
  const fill =
    t === 'plain' ? 'var(--color-surface-2)'
    : t === 'muted' ? 'transparent'
    : `color-mix(in oklab, ${HUE[t]} 13%, var(--color-surface))`;
  const ink = t === 'muted' ? 'var(--color-ink-3)' : 'var(--color-ink)';
  return { stroke, fill, ink, hue: HUE[t] };
}

export const INK = 'var(--color-ink)';
export const INK2 = 'var(--color-ink-2)';
export const INK3 = 'var(--color-ink-3)';
export const RULE = 'var(--color-rule)';

/**
 * Root element for every diagram. Fixes the type stack once so children can measure, and scales
 * down rather than clipping when the figure is wider than its column.
 */
export function Canvas({ w, h, children }: { w: number; h: number; children: React.ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${round(w)} ${round(h)}`}
      width={round(w)}
      height={round(h)}
      role="presentation"
      style={{ fontFamily: MONO, maxWidth: '100%', height: 'auto', display: 'block' }}
    >
      <defs>
        {(Object.keys(HUE) as Tone[]).map((t) => (
          <marker
            key={t}
            id={`ah-${t}`}
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0.5 L8 4 L0 7.5 z" fill={t === 'muted' ? RULE : HUE[t]} />
          </marker>
        ))}
      </defs>
      {children}
    </svg>
  );
}

export const round = (n: number) => Math.round(n * 100) / 100;

/** A single line of diagram text. Anchors default to the visual centre because most boxes centre. */
export function T({
  x, y, children, size = FS.label, fill = INK, anchor = 'middle', weight, opacity, clipped,
}: {
  x: number; y: number; children: React.ReactNode; size?: number; fill?: string;
  anchor?: 'start' | 'middle' | 'end'; weight?: number; opacity?: number;
  /** Set when this text was shortened to fit. An author's own "0xf90211a0…" is not this. */
  clipped?: boolean;
}) {
  return (
    <text
      x={round(x)} y={round(y)} fontSize={size} fill={fill} textAnchor={anchor}
      dominantBaseline="middle" fontWeight={weight} opacity={opacity}
      data-clipped={clipped ? '1' : undefined}
    >
      {children}
    </text>
  );
}

/** Rounded container used by most primitives. */
export function Box({
  x, y, w, h, t = 'plain', dashed, r = 4,
}: { x: number; y: number; w: number; h: number; t?: Tone; dashed?: boolean; r?: number }) {
  const c = tone(t);
  return (
    <rect
      x={round(x)} y={round(y)} width={round(w)} height={round(h)} rx={r}
      fill={c.fill} stroke={c.stroke} strokeWidth={1}
      strokeDasharray={dashed ? '4 3' : undefined}
    />
  );
}

/** Straight or elbowed connector. `dir` picks which axis the elbow turns on first. */
export function Arrow({
  from, to, t = 'plain', dashed, elbow, label,
}: {
  from: [number, number]; to: [number, number]; t?: Tone; dashed?: boolean;
  elbow?: 'h' | 'v'; label?: string;
}) {
  const c = tone(t);
  const [x1, y1] = from;
  const [x2, y2] = to;
  const d =
    !elbow || (x1 === x2 || y1 === y2)
      ? `M${round(x1)} ${round(y1)} L${round(x2)} ${round(y2)}`
      : elbow === 'h'
        ? `M${round(x1)} ${round(y1)} H${round((x1 + x2) / 2)} V${round(y2)} H${round(x2)}`
        : `M${round(x1)} ${round(y1)} V${round((y1 + y2) / 2)} H${round(x2)} V${round(y2)}`;
  return (
    <>
      <path
        d={d} fill="none" stroke={c.stroke} strokeWidth={1.25}
        strokeDasharray={dashed ? '4 3' : undefined} markerEnd={`url(#ah-${t})`}
      />
      {label && (() => {
        // The label sits at the path midpoint, which in a horizontal flow is inside the box band. A
        // label wider than the column gap was drawn straight over its neighbours, so it gets a
        // ground of its own in the surface colour rather than being left transparent.
        const lw = textW(label, FS.tiny) + 6;
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2 - 7;
        return (
          <>
            <rect x={round(cx - lw / 2)} y={round(cy - 6.5)} width={round(lw)} height={13} rx={2}
                  fill="var(--color-surface)" />
            <T x={cx} y={cy} size={FS.tiny} fill={INK3}>{label}</T>
          </>
        );
      })()}
    </>
  );
}

/** Small uppercase caption used to title a band, column or lane. */
export function Eyebrow({
  x, y, children, anchor = 'start', fill = INK3,
}: { x: number; y: number; children: React.ReactNode; anchor?: 'start' | 'middle' | 'end'; fill?: string }) {
  return (
    <text
      x={round(x)} y={round(y)} fontSize={FS.tiny} fill={fill} textAnchor={anchor}
      dominantBaseline="middle" letterSpacing="0.08em"
    >
      {String(children).toUpperCase()}
    </text>
  );
}
