# Figures

Every figure is a React primitive that takes **data** and computes its own layout. Authors never
write SVG, never pick coordinates, never set a width. If you find yourself wanting a `<svg>` tag or
an ASCII drawing in a code fence, the answer is one of the nine primitives below.

Live reference with a worked example of each: **`/figures`** (`src/app/figures/page.tsx`).
Implementation: `src/components/lesson/diagrams/`.

## The wrapper

Every figure is wrapped. Both props are required and the linter enforces them.

```mdx
<Figure caption="What the reader should take away." alt="Literal description of what is drawn.">
  <Flow … />
</Figure>
```

- `caption` — an **assertion**, not a title. "A Merkle proof is the siblings, not the leaves" beats
  "Merkle tree diagram". The caption is often the sentence the figure exists to make.
- `alt` — what a screen reader says instead. Describe the content, not the shape.

`Compare` and `Matrix` render their own container, so they take `caption` and `alt` **as their own
props** instead of being wrapped:

```mdx
<Compare caption="…" alt="…" columns={…} rows={…} />
```

Never wrap either one in `<Figure>` — that double-wraps the container and the linter rejects it.

**Cells take React nodes, not plain strings.** A `<Cite>` inside a cell survives, so a markdown table
carrying citations can be converted without losing them:

```mdx
rows={[{ label: 'Cold SLOAD', cells: [<>2,100 gas<Cite src="measured-gas-constants" /></>] }]}
```

Both also accept the toned cell shape `{ v, tone }`, so a cell can carry meaning on its own:

```mdx
cells: [{ v: '22,100', tone: 'warn' }, '100']
```

Headers take nodes too — `Matrix`'s `cols` and `corner`, and `Compare`'s column `title` and `note` —
so a converted table's header row keeps its inline code and its citations.

## When to add one

Add a figure when the reader has to hold a **shape** in their head: an ordering, a layout, a
hierarchy, a span of time, a set of parallel differences. Do not add one to restate a sentence.

Every lesson should carry **at least one** figure unless its content is genuinely non-visual
(a philosophy lesson, a pure vocabulary lesson). The **first lesson of every module** opens with a
structural figure that shows how the module's pieces fit together.

If a lesson currently draws a diagram as ASCII inside a ```` ```text ```` fence, convert it. That fence
is a figure that has not been built yet.

A ```` ```console ```` fence is different: `forge tree` and `chisel` print box-drawing characters of
their own, and that is captured tool output, not a drawing. Leave it. Redrawing a transcript as a
figure presents the tool's output as something you authored.

**The linter's `ASCII-DIAGRAM` count is a floor, not a ceiling.** It keys on box-drawing characters
and caret rows, so it misses the commonest hand-drawn fence of all: a plain ```` ```text ```` block
laying out a formula's operands, a mnemonic listing beside its bytes, or two options set side by side
with spaces. Read your lessons' fences yourself. If a fence is doing a figure's job — showing a
shape rather than reproducing a literal or a transcript — convert it whether or not the linter
noticed.

## The nine primitives

### `<Flow>` — a process with ordered steps

```mdx
<Flow
  lanes={['local', 'network', 'block']}
  nodes={[
    { id: 'sign', label: 'sign', note: 'secp256k1', col: 0, tone: 'accent' },
    { id: 'pool', label: 'mempool', col: 1 },
    { id: 'priv', label: 'private relay', col: 1, tone: 'warn', dashed: true },
    { id: 'blk',  label: 'block', col: 2 },
  ]}
  edges={[{ from: 'sign', to: 'pool' }, { from: 'pool', to: 'blk', label: 'bid' }]}
/>
```

`col` advances the process left to right. Two nodes sharing a `col` are a fork or work that happens
together. Omit `edges` entirely to chain consecutive columns. `dir="down"` flows vertically.
`lanes` labels the columns — in vertical mode they label rows, in a left gutter. Keep `label` under
~22 characters; put detail in `note`.

**Backward edges are supported.** An edge whose target sits in an earlier column routes through a
channel below the nodes rather than crossing its own source box. That is the shape for re-entry, a
retry loop, a feedback effect, or a payment made at the end of a pipeline — draw it as the back-edge
it is rather than flattening it into forward progression.

**Choose the tone on a back-edge deliberately.** A loop is as often restorative — arbitrage closing a
gap, a rate correcting a deviation — as it is destructive. `danger` for a spiral or a re-entrancy,
`good` for a loop that returns the system to where it should be, `plain` when it is simply the
mechanism. The component does not guess for you.

Back-edges work in both directions: running right the return channel sits below the row, running
`dir="down"` it sits beside the column. The vertical case used to route up the centreline and through
every node between the two ends — if you see that, the component is out of date, not your data.

### `<ByteLayout>` — encodings

```mdx
<ByteLayout offsets caption="0x02 || rlp([...])"
  fields={[
    { label: 'type', size: 1, tone: 'accent', note: '0x02' },
    { label: 'to', size: 20 },
    { label: 'data', variable: true, tone: 'muted' },
  ]}
/>
```

Field widths follow the **label** by default, because a truthful 32:4 ratio is unreadable. Pass
`proportional` only when the ratio is the actual lesson (calldata against a blob, packing waste).

Two `proportional` figures each normalise to their own total, so a four-slot layout and a six-slot
layout come out the same width — which destroys the comparison if the point is that one is longer.
When you are drawing a pair meant to be read against each other, give both the same `total`.
`variable` draws a dashed open-ended band. `unit` is `bytes | bits | words`. `offsets` prints the
running offset above each boundary — pass `offsets="hex"` whenever the prose addresses the same
region in hex, as a Solidity memory map does.

### `<Anatomy>` — one literal, bracketed and named

```mdx
<Anatomy value="0xa9059cbb0000…0000"
  parts={[
    { from: 0, to: 2, label: '0x', tone: 'muted' },
    { from: 2, to: 10, label: 'selector', note: 'keccak(sig)[0:4]', tone: 'accent' },
  ]}
/>
```

`from`/`to` are **character** indices into `value`, half-open. Characters are coloured by part. This
is the diagram for "what are these bytes" — addresses, calldata, signatures, bytecode, a CID.

**It works on any monospace string, not just hex.** A function signature, a market name, and — the
case three agents asked for and went without — an **equation**:

```mdx
<Anatomy value="profit(V) = b·V - G - V²/R"
  parts={[
    { from: 12, to: 15, label: 'bonus', note: 'grows linearly', tone: 'good' },
    { from: 18, to: 19, label: 'gas', note: 'fixed, sets the floor', tone: 'warn' },
    { from: 22, to: 26, label: 'slippage', note: 'grows quadratically', tone: 'danger' },
  ]}
/>
```

Naming which term dominates where is a shape, and it is the shape a formula fence cannot show.

`npm run check:figures` verifies every part is in range and that parts do not overlap — but it
cannot know which operand you *meant*. Slice the string yourself and read the result back.

### `<Timeline>` — measured time

```mdx
<Timeline from={0} to={7} unit="days" ticks={[0, 1, 7]}
  marks={[{ at: 7, label: 'claim on L1', tone: 'good' }]}
  spans={[{ label: 'fault-proof window', start: 1, end: 7, tone: 'warn', note: 'anyone may challenge' }]}
/>
```

`spans` are durations and pack into lanes automatically; `marks` are instants and draw a dashed
rule. Use real numbers from the sources — a timeline with invented durations is worse than none.

### `<Tree>` — hierarchies

```mdx
<Tree root={{ label: 'root', tone: 'accent', children: [
  { label: 'H(AB)', tone: 'muted', note: 'in proof', dashed: true },
  { label: 'H(CD)', children: [{ label: 'C' }, { label: 'D', tone: 'good' }] },
]}} />
```

Merkle and Patricia tries, account state, call trees, proof paths, derivation paths.

### `<StackTrace>` — the EVM as a machine you can watch

```mdx
<StackTrace steps={[
  { op: 'PUSH1 0x0a', stack: ['0x0a'], gas: 3, changed: [0], tone: 'accent' },
  { op: 'SUB', stack: ['0xfff…fd'], gas: 3, changed: [0], tone: 'warn', note: '3 - 10, wrapped' },
]} />
```

`stack` is **top of stack first** — the order a debugger prints. `changed` marks the indices that
moved at that step. Gas figures come from `docs/research/MEASURED.md`, never from memory.

### `<Bars>` — a magnitude series

```mdx
<Figure caption="…" alt="…">
  <Bars scale="log" unit="gas" axisLabel="cost of one operation"
    items={[
      { label: 'SSTORE zero→non-zero', value: 20000, tone: 'danger', note: 'plus a cold surcharge' },
      { label: 'SLOAD warm', value: 100, tone: 'good' },
    ]}
  />
</Figure>
```

How much, across a handful of named things — gas by operation class, loss by category, liquidity by
range. `scale="log"` when the honest range spans orders of magnitude: on a linear axis a series from
100 to 20,000 renders every bar but one as a sliver, hiding the exact ratio the figure exists for.
`display` overrides the printed number when the value needs a unit or a qualifier.

**`<Bars>` is not a chart.** It draws one magnitude per named row. It cannot draw a continuous
function, a distribution over a numeric axis, or a series against time — see **Curves** below.

### `<Compare>` — two or three systems, same questions

```mdx
<Compare axis="Question"
  columns={[{ title: 'EVM', note: 'Ethereum', tone: 'accent' }, { title: 'SVM', note: 'Solana' }]}
  rows={[{ label: 'How is work metered?', cells: ['Gas, priced in wei', 'Compute units, no exchange rate'] }]}
  caption="Nothing in the SVM corresponds to gas, because nothing discovers state mid-execution."
  alt="EVM and SVM compared across metering, state discovery, parallelism and code location."
/>
```

Row labels are **questions**, which is what makes a comparison teach rather than list. Every row
must have exactly one cell per column. Renders its own container — pass `caption`/`alt` directly,
never a `<Figure>` wrapper.

### `<Matrix>` — a dense grid

```mdx
<Matrix numeric corner="Opcode" cols={['Cold', 'Warm', 'Set by']}
  rows={[{ label: 'SLOAD', cells: [{ v: '2,100', tone: 'warn' }, { v: '100', tone: 'good' }, 'EIP-2929'] }]}
/>
```

`numeric` turns on tabular figures and right-alignment. A cell is a plain string or `{ v, tone }`.
Takes `caption` and `alt` directly; no `<Figure>` wrapper.

## Curves

**No primitive draws a curve.** Not a price curve, not an interest-rate curve, not a distribution
over a continuous axis. Bending `<Timeline>` (measured time) or `<ByteLayout>` (encodings) into one
misrepresents the axis, and `<Bars>` draws named rows, not a function.

Where the underlying shape is continuous, do one of these and say which in your report:

- **Sample it.** A `<Matrix numeric>` of the lesson's own worked points shows the *rate of change*
  honestly — a kink reads as the jump it is. Sample only points the lesson computed; interpolating
  your own is inventing data.
- **Show the endpoints.** Two documented values at the ends of a range often carry the claim without
  implying anything about the path between them.
- **Leave it to the prose.** A missing figure is better than one whose axis lies.

## Tone

`plain` (default) · `accent` · `warn` · `danger` · `good` · `muted`

Tone carries meaning, never decoration. Across the whole curriculum it means:

| Tone | Use it for |
|---|---|
| `accent` | the subject of the figure — the thing being explained |
| `warn` | cost, risk, a trust assumption, a delay the reader is paying for |
| `danger` | the failure, the exploit, the invalid state |
| `good` | the safe path, the finalised state, the fix |
| `muted` | context that is present but not the point |
| `plain` | everything else |

A figure where every node is `accent` has said nothing. Most nodes should be `plain`.

## Rules

1. **Both `caption` and `alt`, always** — on `<Figure>`, and equally on `<Compare>` and `<Matrix>`,
   which take the props themselves. The caption is where the figure states what it proves; a
   comparison whose assertion lives only in its column headers has left the teaching implicit.
2. **Numbers in figures obey the same sourcing rules as prose.** A gas cost, a duration, a size —
   cite it in the surrounding text and take it from `docs/research/MEASURED.md`. Never invent a
   figure's numbers to make the shape look nice.
3. **Never state a `docs/research/CONFLICTS.md` claim as a single value in a figure.** Show the
   range, or pick a different figure.
4. **No `<svg>` in MDX. No ASCII art in code fences.** If no primitive fits, say so in your report
   rather than hand-rolling one.
5. **Keep a figure to one idea.** Two ideas is two figures.
6. Do not restate the caption in the paragraph immediately before or after it.
7. **A markdown data table may be replaced by the primitive that carries the same data.** Moving a
   table's cells verbatim into a `<Matrix>` or `<ByteLayout>` is not a prose rewrite — it is the same
   content in the form this kit exists to provide. Carry every cell and every `<Cite>` across, and
   delete the table so the lesson does not ship both. What you may **not** do is re-author the
   numbers, drop a column, or reword a cell on the way.

   Leave the table alone when a figure beside it would say something genuinely different — then you
   have two artefacts, not a duplicate.

   **Check the surrounding prose first.** If a sentence points at the table positionally — "read the
   offset-0 row first", "the left column" — converting it silently breaks that reference, because a
   `<Compare>` puts rows in columns. Either keep the table or you are rewriting prose, which you may
   not do.

8. **A `<Cite>` you add must also be listed in the lesson's frontmatter `sources`.** The linter fails
   the build on a citation the frontmatter does not declare.

## Size

The lesson prose column is **760px**, measured in the browser. A figure wider than that is scaled
down by the SVG, and past about `0.82×` the 12px diagram type drops under 9px and stops being
readable. `npm run check:figures` fails any figure that crosses that line.

In practice:

- A horizontal `<Flow>` fits about **four columns**. Beyond that, merge steps — push the detail into
  `note` — or switch to `dir="down"`.
- `<ByteLayout>` and `<Timeline>` are capped at 660px internally and wrap or compress themselves.
- `<Anatomy>` wraps its value automatically; a long hex string simply becomes two lines.
- `<Tree>` grows with its widest level. A tree more than about six leaves wide needs pruning to the
  part of it the lesson is actually about.

## Before you report done

```bash
npm run check:figures
```

It renders every figure with the real components and reports a primitive that **crashed** on your
data, a figure that is **too wide**, a label the component had to **truncate**, and an `<Anatomy>`
part that is **out of range or overlapping**. `npm run check:mdx` proves a lesson parses; it does not
prove a figure renders.

**It does not measure rendered text.** It cannot see a label overlapping a neighbouring box or a
path drawn through a node. If a figure has crossing edges or long edge labels, open the page and
look — two real routing bugs passed this check clean before an agent read the DOM directly.
