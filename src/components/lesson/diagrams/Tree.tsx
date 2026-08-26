import { Box, Canvas, FS, INK2, T, type Tone, textW, tone } from './kit';

export type TreeNode = {
  label: string;
  note?: string;
  tone?: Tone;
  dashed?: boolean;
  children?: TreeNode[];
};

const NODE_H = 26;
const V_GAP = 30;
const H_GAP = 12;
const PAD = 8;
const MIN_W = 44;

/**
 * A hierarchy drawn top-down: Merkle and Patricia tries, account state, a call tree, a proof path.
 * Leaves are packed left to right at their natural width and every parent centres over its own
 * subtree, so the shape of the tree carries information instead of being decorative spacing.
 */
export function Tree({ root, gap = H_GAP }: { root: TreeNode; gap?: number }) {
  const width = (n: TreeNode): number => {
    const own = Math.max(MIN_W, textW(n.label, FS.label) + PAD * 2, n.note ? textW(n.note, FS.tiny) : 0);
    if (!n.children?.length) return own;
    const kids = n.children.reduce((s, c) => s + width(c), 0) + (n.children.length - 1) * gap;
    return Math.max(own, kids);
  };
  const depth = (n: TreeNode): number =>
    1 + Math.max(0, ...(n.children ?? []).map(depth));

  type Placed = { n: TreeNode; x: number; y: number; w: number };
  const out: Placed[] = [];
  const wires: Array<[number, number, number, number, Tone]> = [];

  const place = (n: TreeNode, left: number, level: number): number => {
    const total = width(n);
    const own = Math.min(total, Math.max(MIN_W, textW(n.label, FS.label) + PAD * 2));
    const y = level * (NODE_H + V_GAP);
    let cx = left + total / 2;
    if (n.children?.length) {
      let x = left + (total - (n.children.reduce((s, c) => s + width(c), 0) + (n.children.length - 1) * gap)) / 2;
      const centres: number[] = [];
      for (const c of n.children) {
        centres.push(place(c, x, level + 1));
        x += width(c) + gap;
      }
      cx = (centres[0] + centres[centres.length - 1]) / 2;
      centres.forEach((c, i) =>
        wires.push([cx, y + NODE_H, c, y + NODE_H + V_GAP, n.children![i].tone ?? 'muted']),
      );
    }
    out.push({ n, x: cx - own / 2, y, w: own });
    return cx;
  };
  place(root, 0, 0);

  const W = width(root);
  const H = depth(root) * (NODE_H + V_GAP) - V_GAP + (out.some((p) => p.n.note) ? 12 : 0);

  return (
    <Canvas w={W + 2} h={H + 2}>
      {wires.map(([x1, y1, x2, y2], i) => (
        <path key={i} d={`M${x1} ${y1} V${(y1 + y2) / 2} H${x2} V${y2}`}
              fill="none" stroke={tone('muted').stroke} strokeWidth={1} />
      ))}
      {out.map((p, i) => {
        const c = tone(p.n.tone);
        return (
          <g key={i}>
            <Box x={p.x} y={p.y} w={p.w} h={NODE_H} t={p.n.tone} dashed={p.n.dashed} />
            <T x={p.x + p.w / 2} y={p.y + NODE_H / 2} fill={c.ink}>{p.n.label}</T>
            {p.n.note && (
              <T x={p.x + p.w / 2} y={p.y + NODE_H + 8} size={FS.tiny} fill={INK2}>{p.n.note}</T>
            )}
          </g>
        );
      })}
    </Canvas>
  );
}

