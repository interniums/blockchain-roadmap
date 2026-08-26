import type React from 'react';
import type { Tone } from './kit';

/**
 * Comparisons and grids render as real HTML tables rather than SVG. Their content is prose-length
 * and needs to wrap, be selectable, and be read by a screen reader in row order — three things a
 * hand-laid SVG grid does badly.
 */

const HUE: Record<Tone, string> = {
  plain: 'var(--color-ink-3)',
  accent: 'var(--color-accent)',
  warn: 'var(--color-warn)',
  danger: 'var(--color-danger)',
  good: 'var(--color-good)',
  muted: 'var(--color-rule)',
};

const soft = (t?: Tone) =>
  !t || t === 'plain' || t === 'muted'
    ? undefined
    : `color-mix(in oklab, ${HUE[t]} 11%, var(--color-surface))`;

export type MatrixCell = React.ReactNode | { v: React.ReactNode; tone?: Tone };
export type CompareColumn = { title: React.ReactNode; note?: React.ReactNode; tone?: Tone };
/**
 * Cells take React nodes, not strings. A markdown table being converted into a comparison may carry
 * a `<Cite>`, and typing the cell as a string would drop the citation silently — which turns a
 * sourced claim into an unsourced one at exactly the moment nobody is looking.
 */
export type CompareRow = { label: React.ReactNode; cells: MatrixCell[] };

/**
 * Two or three systems held against the same set of questions. The row label is the question, which
 * is what makes a comparison teach something instead of listing features side by side.
 */
export function Compare({
  columns, rows, axis = 'Question', caption, alt,
}: { columns: CompareColumn[]; rows: CompareRow[]; axis?: string; caption?: string; alt?: string }) {
  return (
    <figure className="my-6">
      <div className="overflow-x-auto" role={alt ? 'img' : undefined} aria-label={alt}>
      <table className="w-full border-collapse text-[13.5px] leading-[1.55]">
        <thead>
          <tr>
            <th scope="col"
                className="w-[24%] border-b border-[var(--color-rule)] px-3 py-2 text-left align-bottom text-[10.5px] font-normal uppercase tracking-wider text-[var(--color-ink-3)]">
              {axis}
            </th>
            {columns.map((c, i) => (
              <th key={i} scope="col"
                  className="border-b-2 px-3 py-2 text-left align-bottom font-semibold text-[var(--color-ink)]"
                  style={{ borderBottomColor: HUE[c.tone ?? 'plain'], background: soft(c.tone) }}>
                {c.title}
                {c.note && (
                  <span className="mt-0.5 block text-[11px] font-normal text-[var(--color-ink-3)]">{c.note}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="align-top">
              <th scope="row"
                  className="border-b border-[var(--color-rule)] px-3 py-2.5 text-left font-medium text-[var(--color-ink-2)]">
                {r.label}
              </th>
              {r.cells.map((cell, j) => {
                // Accept the same { v, tone } shape as Matrix. Authors reasonably assume the two
                // tables take the same cell, and passing it here used to throw "Objects are not
                // valid as a React child" at render time rather than failing a type check.
                const shaped = cell !== null && typeof cell === 'object' && 'v' in (cell as object);
                const v = shaped ? (cell as { v: React.ReactNode }).v : (cell as React.ReactNode);
                const t = shaped ? (cell as { tone?: Tone }).tone : undefined;
                return (
                  <td key={j} className="border-b border-[var(--color-rule)] px-3 py-2.5"
                      style={{ background: soft(t) ?? soft(columns[j]?.tone),
                               color: t && t !== 'plain' && t !== 'muted' ? HUE[t] : undefined }}>
                    {v}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {caption && (
        <figcaption className="mt-2 text-[13px] text-[var(--color-ink-3)]">{caption}</figcaption>
      )}
    </figure>
  );
}

export type MatrixRow = { label: React.ReactNode; cells: MatrixCell[] };

/**
 * A dense grid: opcode costs, feature support, a tradeoff space. Numbers get tabular figures so
 * columns of digits line up and a magnitude difference is visible without reading.
 */
export function Matrix({
  cols, rows, corner = '', numeric, caption, alt,
}: {
  /** Header cells take nodes for the same reason the body does: a converted table's header may
   *  carry inline code or a `<Cite>`, and typing it as a string silently drops both. */
  cols: React.ReactNode[];
  rows: MatrixRow[]; corner?: React.ReactNode; numeric?: boolean; caption?: string; alt?: string;
}) {
  return (
    <figure className="my-6">
      <div className="overflow-x-auto" role={alt ? 'img' : undefined} aria-label={alt}>
      <table
        className="w-full border-collapse text-[13px] leading-[1.5]"
        style={numeric ? { fontVariantNumeric: 'tabular-nums' } : undefined}
      >
        <thead>
          <tr>
            <th scope="col" className="border-b border-[var(--color-rule)] px-2.5 py-2 text-left text-[10.5px] font-normal uppercase tracking-wider text-[var(--color-ink-3)]">
              {corner}
            </th>
            {cols.map((c, i) => (
              <th key={i} scope="col"
                  className={`border-b border-[var(--color-rule)] px-2.5 py-2 font-medium text-[var(--color-ink-2)] ${numeric ? 'text-right' : 'text-left'}`}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <th scope="row" className="border-b border-[var(--color-rule)] px-2.5 py-2 text-left font-normal text-[var(--color-ink)]">
                {r.label}
              </th>
              {r.cells.map((cell, j) => {
                const shaped = cell !== null && typeof cell === 'object' && 'v' in (cell as object);
                const v = shaped ? (cell as { v: React.ReactNode }).v : (cell as React.ReactNode);
                const t = shaped ? (cell as { tone?: Tone }).tone : undefined;
                return (
                  <td key={j}
                      className={`border-b border-[var(--color-rule)] px-2.5 py-2 text-[var(--color-ink-2)] ${numeric ? 'text-right' : 'text-left'}`}
                      style={{ background: soft(t), color: t && t !== 'plain' && t !== 'muted' ? HUE[t] : undefined }}>
                    {v}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {caption && (
        <figcaption className="mt-2 text-[13px] text-[var(--color-ink-3)]">{caption}</figcaption>
      )}
    </figure>
  );
}
