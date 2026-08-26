import { Canvas, Eyebrow, FS, INK, INK2, INK3, RULE, T, type Tone, textW, tone } from './kit';

export type TraceStep = {
  /** The instruction executed to reach this state. */
  op: string;
  /** Stack after the op, top of stack first — the order a debugger prints. */
  stack?: string[];
  /** Anything worth naming: gas charged, memory touched, a storage write. */
  note?: string;
  gas?: string | number;
  tone?: Tone;
  /** Stack entries whose value changed at this step, by index. */
  changed?: number[];
};

const CELL_H = 19;
const COL_GAP = 8;
const PAD = 7;
const TOP = 16;

/**
 * The EVM as a machine you can watch. Each column is the stack after one instruction, top of stack
 * at the top of the column, with the entries that moved marked. Reading a sequence of these is the
 * fastest route to understanding why an opcode's argument order is what it is.
 */
export function StackTrace({ steps, label = 'stack' }: { steps: TraceStep[]; label?: string }) {
  const depth = Math.max(1, ...steps.map((s) => s.stack?.length ?? 0));
  const colW = steps.map((s) =>
    Math.max(
      textW(s.op, FS.note) + PAD * 2,
      ...(s.stack ?? ['']).map((v) => textW(v, FS.tiny) + PAD * 2),
      s.note ? textW(s.note, FS.tiny) * 0.6 : 0,
      52,
    ),
  );
  const gutter = textW(label, FS.tiny) + 10;
  const noteH = steps.some((s) => s.note) ? 14 : 0;
  const gasH = steps.some((s) => s.gas != null) ? 12 : 0;

  const W = gutter + colW.reduce((a, b) => a + b, 0) + (steps.length - 1) * COL_GAP;
  const stackTop = TOP;
  const opY = stackTop + depth * CELL_H + 10;
  const H = opY + 12 + gasH + noteH;

  // Column origins are computed up front; mutating a cursor inside the render map is a re-render hazard.
  const xs: number[] = [];
  colW.reduce((acc, w, i) => { xs[i] = acc; return acc + w + COL_GAP; }, gutter);

  return (
    <Canvas w={W + 2} h={H}>
      <Eyebrow x={0} y={stackTop + depth * CELL_H / 2}>{label}</Eyebrow>
      <line x1={gutter - 5} x2={gutter - 5} y1={stackTop} y2={stackTop + depth * CELL_H} stroke={RULE} />

      {steps.map((s, i) => {
        const x = xs[i];
        const w = colW[i];
        const stack = s.stack ?? [];
        const c = tone(s.tone);
        return (
          <g key={i}>
            {stack.map((v, j) => {
              // Index 0 is top of stack; draw it at the top of the column and grow downward.
              const y = stackTop + j * CELL_H;
              const hot = s.changed?.includes(j);
              return (
                <g key={j}>
                  <rect
                    x={x} y={y} width={w} height={CELL_H - 2} rx={2}
                    fill={hot ? tone(s.tone ?? 'accent').fill : 'var(--color-surface-2)'}
                    stroke={hot ? tone(s.tone ?? 'accent').stroke : RULE}
                  />
                  <T x={x + w / 2} y={y + (CELL_H - 2) / 2} size={FS.tiny} fill={hot ? INK : INK2}>{v}</T>
                </g>
              );
            })}
            {stack.length === 0 && (
              <T x={x + w / 2} y={stackTop + CELL_H / 2} size={FS.tiny} fill={INK3}>empty</T>
            )}
            <T x={x + w / 2} y={opY} size={FS.note} fill={c.hue === 'var(--color-ink-3)' ? INK : c.hue} weight={500}>
              {s.op}
            </T>
            {s.gas != null && (
              <T x={x + w / 2} y={opY + 13} size={FS.tiny} fill={INK3}>{s.gas} gas</T>
            )}
            {s.note && (
              <T x={x + w / 2} y={opY + 13 + gasH} size={FS.tiny} fill={INK2}>{s.note}</T>
            )}
          </g>
        );
      })}
    </Canvas>
  );
}
