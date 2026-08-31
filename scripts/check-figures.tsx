/**
 * Render every figure in the corpus and audit it.
 *
 * check-mdx proves a lesson *parses*. It cannot prove a figure *renders*: a diagram whose props are
 * malformed compiles fine and then throws at request time, which is how a 500 reaches a page that
 * passed every check. This script evaluates each lesson's MDX with the real diagram components and
 * reports five things lint cannot see:
 *
 *   crash          — the primitive threw on the data it was given
 *   too wide       — the figure exceeds the prose column and is scaled until the type is unreadable
 *   truncated      — a label the component itself had to cut to fit
 *   anatomy-range  — an <Anatomy> part out of range, or overlapping its neighbour
 *   path-in-node   — a connector routed straight through a box it does not connect to
 *
 * The last one is geometry, not text: a back-edge that takes the wrong channel still renders and
 * still fits, so every earlier check passes it while the reader sees a line drawn through three
 * boxes. That is exactly how a <Flow dir="down"> back-edge shipped routing up the centreline. The
 * rendered SVG carries the node rects and the path `d` already, so the crossing is checkable here
 * without a browser.
 *
 * WHAT IT STILL DOES NOT CHECK. It does not measure rendered text extents, so it cannot see a label
 * overlapping a neighbouring box or glyphs outside the viewBox. Those need a browser: fetch the
 * page and read `getComputedTextLength` from the DOM.
 */
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import matter from 'gray-matter';
import * as jsxRuntime from 'react/jsx-runtime';
import * as jsxDevRuntime from 'react/jsx-dev-runtime';
import { Anatomy, Bars, ByteLayout, Compare, Flow, Matrix, StackTrace, Timeline, Tree } from '../src/components/lesson/diagrams';

/** The lesson column, measured in the browser. A figure wider than this is scaled down by the SVG. */
const COLUMN = 760;
/** Below this scale the 12px diagram type drops under ~9px and stops being readable. */
const MIN_SCALE = 0.82;

const DIR = path.join(process.cwd(), 'content', 'lessons');

/**
 * Many agents author figures at once and each runs this as a verification step. Without a filter
 * they render each other's half-written files and report failures that do not exist once the run
 * settles. CHAINPATH_FIGURE_SCOPE=<substring> narrows the run to the files an agent owns.
 */
const SCOPE = (process.env.CHAINPATH_FIGURE_SCOPE ?? '').split(',').map((x) => x.trim()).filter(Boolean);

// Prose components are stubbed: this script is about figures, and the real ones drag in the content
// graph and client-only code that has nothing to do with whether a diagram lays out.
const stub = (tag: string) => {
  const Stub = (p: Record<string, unknown>) =>
    React.createElement(tag, null, (p.children ?? null) as React.ReactNode);
  Stub.displayName = `stub(${tag})`;
  return Stub;
};

const components: Record<string, unknown> = {
  Flow, ByteLayout, Anatomy, Timeline, Tree, StackTrace, Compare, Matrix, Bars,
  Figure: (p: { caption?: string; alt?: string; children?: React.ReactNode }) =>
    React.createElement('figure', null, p.children),
  Cite: () => null,
  Check: stub('div'), Answer: stub('div'), Misconception: () => null, Aside: stub('div'),
};

/**
 * Geometry for the path-in-node check.
 *
 * A "renders and fits" pass cannot see a connector drawn across a box it has nothing to do with,
 * and that is the failure mode of a mis-routed channel: the SVG is well formed, the viewBox is
 * right, and the picture is wrong. The rects and the path `d` are both in the markup, so compare
 * them directly.
 */
type Seg = { x1: number; y1: number; x2: number; y2: number };
type Rect = { x: number; y: number; w: number; h: number };

/** A line running along a box border is drawn ON it, not through it. */
const INSET = 2.5;
/** Below this, a crossing is a rounding artefact or an arrowhead nudging the edge. */
const CROSS = 6;

/**
 * Every path this kit emits is built from M/L/H/V by hand, so a full path parser is not needed —
 * but an unrecognised command must consume a token or the loop never terminates.
 */
function segments(d: string): Seg[] {
  const toks = d.match(/[A-Za-z]|-?[\d.]+/g) ?? [];
  const out: Seg[] = [];
  let cx = 0, cy = 0, cmd = '';
  for (let i = 0; i < toks.length; ) {
    if (/[A-Za-z]/.test(toks[i])) {
      cmd = toks[i++].toUpperCase();
      if (cmd === 'Z') { cmd = ''; continue; }
    }
    let nx = cx, ny = cy;
    if (cmd === 'M' || cmd === 'L') { nx = Number(toks[i]); ny = Number(toks[i + 1]); i += 2; }
    else if (cmd === 'H') { nx = Number(toks[i]); i += 1; }
    else if (cmd === 'V') { ny = Number(toks[i]); i += 1; }
    else { i += 1; continue; }
    if (cmd !== 'M' && Number.isFinite(nx) && Number.isFinite(ny)) out.push({ x1: cx, y1: cy, x2: nx, y2: ny });
    cx = nx; cy = ny;
    // An M with extra coordinate pairs is an implicit lineto; H/V/L repeat too.
    if (cmd === 'M') cmd = 'L';
  }
  return out;
}

/** Liang–Barsky: the length of `s` that lies inside `r`, 0 if it misses. */
function insideLength(s: Seg, r: Rect): number {
  const dx = s.x2 - s.x1;
  const dy = s.y2 - s.y1;
  let t0 = 0, t1 = 1;
  const clip = (p: number, q: number) => {
    if (p === 0) return q >= 0;
    const t = q / p;
    if (p < 0) { if (t > t1) return false; if (t > t0) t0 = t; }
    else { if (t < t0) return false; if (t < t1) t1 = t; }
    return true;
  };
  const ok = clip(-dx, s.x1 - r.x) && clip(dx, r.x + r.w - s.x1)
          && clip(-dy, s.y1 - r.y) && clip(dy, r.y + r.h - s.y1);
  return ok ? Math.hypot(dx, dy) * Math.max(0, t1 - t0) : 0;
}

const attr = (tag: string, name: string) => {
  const m = tag.match(new RegExp(`\\b${name}="([^"]*)"`));
  return m ? m[1] : undefined;
};

/**
 * Findings for one lesson's markup. Each root <svg> is checked on its own — coordinates are per
 * figure — and <defs> is dropped first, because every canvas defines six arrowhead markers whose
 * little triangles live at 0,0 in marker space and would collide with everything.
 */
function pathsThroughNodes(html: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  let fig = 0;
  for (const [, inner] of html.matchAll(/<svg\b[^>]*>([\s\S]*?)<\/svg>/g)) {
    fig++;
    const body = inner.replace(/<defs>[\s\S]*?<\/defs>/g, '');
    // A stroked rect is a node box. The unstroked ones are label grounds — an <Arrow> label paints
    // one in the surface colour so the line does not run through its own caption — and a connector
    // crossing those is the point of them, not a bug.
    const rects: Rect[] = [];
    for (const [tag] of body.matchAll(/<rect\b[^>]*>/g)) {
      if (!attr(tag, 'stroke')) continue;
      const [x, y, w, h] = ['x', 'y', 'width', 'height'].map((k) => Number(attr(tag, k)));
      if ([x, y, w, h].every(Number.isFinite) && w > 0 && h > 0) rects.push({ x, y, w, h });
    }
    if (!rects.length) continue;
    for (const [tag] of body.matchAll(/<path\b[^>]*>/g)) {
      const d = attr(tag, 'd');
      // Connectors are stroked and unfilled. A filled path is a glyph or a shaded region.
      if (!d || attr(tag, 'fill') !== 'none') continue;
      for (const s of segments(d)) {
        for (const r of rects) {
          const inset: Rect = { x: r.x + INSET, y: r.y + INSET, w: r.w - INSET * 2, h: r.h - INSET * 2 };
          if (inset.w <= 0 || inset.h <= 0) continue;
          const len = insideLength(s, inset);
          if (len < CROSS) continue;
          // One report per path, not per segment: an elbow that crosses a box usually clips it
          // twice — once on the run in, once on the turn — and two lines for one wrong edge reads
          // as two problems.
          const key = `${d}|${r.x},${r.y}`;
          if (seen.has(key)) continue;
          seen.add(key);
          out.push(`figure ${fig}: "${d}" runs ${Math.round(len)}px through the box at `
            + `(${r.x}, ${r.y}, ${r.w}×${r.h})`);
        }
      }
    }
  }
  return out;
}

type Finding = { file: string; kind: string; detail: string };

(async () => {
  const { serialize } = await import('next-mdx-remote/serialize');
  const files = (fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith('.mdx')).sort() : [])
    .filter((f) => !SCOPE.length || SCOPE.some((p) => f.startsWith(p)));
  if (SCOPE.length) console.log(`scope: ${SCOPE.join(', ')} (${files.length} lessons)`);
  const findings: Finding[] = [];
  let figures = 0;
  let lessonsWithFigures = 0;

  for (const f of files) {
    const { content } = matter(fs.readFileSync(path.join(DIR, f), 'utf8'));
    if (!/<(Figure|Compare|Matrix)\b/.test(content)) continue;

    let html: string;
    try {
      const remarkGfm = (await import('remark-gfm')).default;
      const { compiledSource } = await serialize(content, {
        parseFrontmatter: false, blockJS: false,
        mdxOptions: { remarkPlugins: [remarkGfm] },
      }, true);
      // Same evaluation the app performs, minus React Server Components.
      // serialize compiles against the dev JSX runtime unless NODE_ENV is production, so the scope
      // has to carry both entry points or the generated body calls a function that is not there.
      const scope = { opts: { ...jsxRuntime, ...jsxDevRuntime }, frontmatter: {} };
      const fn = Reflect.construct(Function, Object.keys(scope).concat(compiledSource));
      const Content = fn.apply(fn, Object.values(scope)).default;
      html = renderToStaticMarkup(React.createElement(Content, { components }));
    } catch (e) {
      findings.push({ file: f, kind: 'crash', detail: String((e as Error).message).split('\n')[0].slice(0, 160) });
      continue;
    }

    // Only the root <svg>; arrowhead <marker> elements carry a viewBox of their own.
    const boxes = [...html.matchAll(/<svg[^>]*?viewBox="0 0 ([\d.]+) ([\d.]+)"/g)];
    if (!boxes.length && !/<table/.test(html)) continue;
    lessonsWithFigures++;
    figures += boxes.length + (html.match(/<table/g)?.length ?? 0);

    // Anatomy slices whatever indices it is handed, so a part running past the end of the value, or
    // overlapping its neighbour, renders happily and brackets the wrong bytes. That is the single
    // error the briefs warn about hardest and the renderer cannot see it — so check the data, not
    // the output.
    for (const m of content.matchAll(/<Anatomy\b([\s\S]*?)\/>/g)) {
      const block = m[1];
      // The value is a JSX attribute in one of three shapes — value="…", value={'…'}, value={`…`} —
      // and its contents routinely include the *other* quote characters (a JSON clientDataJSON, a
      // query key of single-quoted strings). Find the delimiter, then scan to its matching close;
      // a regex character class stops at the first inner quote and reports a 1-character value.
      const at = block.indexOf('value=');
      if (at < 0) continue;
      let i = at + 'value='.length;
      if (block[i] === '{') i++;
      const quote = block[i];
      if (quote !== '"' && quote !== "'" && quote !== '`') continue;
      let j = i + 1;
      while (j < block.length && !(block[j] === quote && block[j - 1] !== '\\')) j++;
      const len = j - i - 1;
      if (len <= 0) continue;
      const spans = [...block.matchAll(/from:\s*(\d+)\s*,\s*to:\s*(\d+)/g)]
        .map((x) => [Number(x[1]), Number(x[2])] as [number, number]);
      for (const [a, b] of spans) {
        if (b > len || a >= b) {
          findings.push({ file: f, kind: 'anatomy-range',
            detail: `[${a},${b}) against a ${len}-character value` });
        }
      }
      const sorted = [...spans].sort((x, y) => x[0] - y[0]);
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i][0] < sorted[i - 1][1]) {
          findings.push({ file: f, kind: 'anatomy-overlap',
            detail: `[${sorted[i - 1][0]},${sorted[i - 1][1]}) overlaps [${sorted[i][0]},${sorted[i][1]})` });
        }
      }
    }

    // A label cut to fit is a silent lie: the reader sees "index 1 · always const…" with no way to
    // know the rest existed. Guessing from a trailing ellipsis cannot work — an author writing
    // "0xf90211a0…" for a long digest is doing something deliberate — so the component marks its own
    // truncations and this only reports those.
    for (const [, inner] of html.matchAll(/<text[^>]*\bdata-clipped="1"[^>]*>([^<]*)<\/text>/g)) {
      findings.push({ file: f, kind: 'truncated', detail: `cut to fit: "${inner}"` });
    }

    // A connector crossing a box it does not touch. Every other check here passes such a figure:
    // it renders, it fits, nothing is cut. The reader still sees a line drawn through three nodes.
    for (const detail of pathsThroughNodes(html)) {
      findings.push({ file: f, kind: 'path-in-node', detail });
    }

    for (const [, w] of boxes) {
      const width = Number(w);
      if (width > COLUMN / MIN_SCALE) {
        findings.push({
          file: f, kind: 'too wide',
          detail: `${Math.round(width)}px scales to ${(COLUMN / width).toFixed(2)}× in a ${COLUMN}px column`,
        });
      }
    }
  }

  console.log(`rendered ${figures} figures across ${lessonsWithFigures} lessons`);
  if (!findings.length) { console.log('every figure renders and fits'); return; }

  const byKind = findings.reduce<Record<string, number>>((a, x) => ((a[x.kind] = (a[x.kind] ?? 0) + 1), a), {});
  console.log('\n' + Object.entries(byKind).map(([k, n]) => `  ${n} ${k}`).join('\n') + '\n');
  for (const x of findings.slice(0, 40)) console.log(`  [${x.kind}] ${x.file}\n      ${x.detail}`);
  if (findings.length > 40) console.log(`  … and ${findings.length - 40} more`);
  process.exit(1);
})();
