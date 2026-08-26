# Lesson prose format

One file per lesson: `content/lessons/<lesson-id>.mdx`. The id must match a lesson in a module YAML.
A lesson with no file renders as an outline; the page never pretends prose exists.

## Frontmatter (required)

```yaml
---
id: fundamentals-crypto-what-a-hash-guarantees
authorship: authored          # authored | adapted | generated
verifiedAt: "2026-08-25"
volatility: stable            # stable | evolving | hot
sources: [nist-fips-180-4]    # every source cited in the body
stack: {}                     # version pins IF the lesson shows code
---
```

## Components available in the body

- `<Cite src="eip-7702" />` — inline citation. **Required** for any sentence carrying a number, a
  version, or a named EIP. The linter enforces this.
- `<Check type="recall|predict|spot-bug|explain" concept="concept-id">` … `</Check>` — an inline
  retrieval prompt. Put the answer in `<Answer>` inside it. Optional to attempt, but skipping is
  recorded once P4 lands.
- `<Misconception belief="…" reality="…" why="…" src="source-id" />`
- `<Figure caption="…" alt="…">` … `</Figure>` — wraps a diagram. Both attributes are required.
  The eight diagram primitives and when to reach for each are in **`content/FIGURE-FORMAT.md`**.
  Never hand-write `<svg>` and never draw a diagram as ASCII inside a code fence.
- `<Aside kind="note|warn|stop">` … `</Aside>`
- Fenced code blocks are highlighted at build time. Always tag the language.

## Rules

1. **Never state a claim listed in `docs/research/CONFLICTS.md` as fact.** Give the range and say
   sources disagree.
2. Gas constants come from `docs/research/MEASURED.md`, never from memory.
3. Every factual number, version or EIP reference needs a `<Cite>` in scope.
4. Worked examples use subgoal labels — name the step's purpose, not just the step.
5. Target the lesson's `readingMin`. Going long means the lesson should have been split.
6. Write for an experienced product engineer with zero blockchain knowledge. No condescension, no
   "simply", no "just".
