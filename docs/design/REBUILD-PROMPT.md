# Chainpath — design rebuild prompt pack

Three rounds. Round 1 brainstorms structure, Round 2 commits to a system, Round 3 builds
screens one at a time. Do not skip to Round 3 — screens designed before the structure is
settled get thrown away.

Current app screenshots are deliberately **withheld until Round 2**. Showing them in Round 1
anchors the tool to the structure we are trying to escape.

---

## ROUND 1 — structural exploration

**Claude Design settings:** template `Wireframe` · design system `None`

Paste everything between the rules.

---

I am rebuilding the interface for a personal learning system called **Chainpath**. The
content is finished and good. The interface is not: it is dense, hard to scan, and it makes
me decide things before I have had a thought. I want to rebuild it, not reskin it.

**Do not design screens yet.** This round is about structure. I want to see genuinely
different answers to "how should this be organised," not three versions of one answer.

### The person using it

One person. Me. An experienced product engineer with zero blockchain knowledge, learning it
properly. Not a course customer — the sole user and the author. No deadline, no cohort, no
manager. Coding is not my bottleneck; building correct mental models is.

The app runs locally on my own machine. No login, no other users, no mobile, no sharing.
Desktop only, and I want the width spent, not wasted on a centred 700px column.

I use it in three modes, and they feel completely different from each other:

1. **Study** — 20 to 90 minutes of real reading. Deep, uninterrupted, one thing at a time.
2. **Drill** — 5 to 20 minutes of recall practice against a spaced-repetition queue.
3. **Orient** — 2 minutes. "Where was I? What is one good next move?" Often after a 3-week gap.

### What the content actually is

Real numbers, not estimates:

- **13 tracks** — big subject areas. 6 are a core sequence, 7 are electives that hang off it.
- **104 modules** inside those tracks.
- **635 lessons** inside those modules. Each is a 9–16 minute read, fully written.
- **1,490 concepts** — the atomic units. A lesson *teaches* concepts and *assumes* others.
- **236 practices** — coding exercises that run real tests against a repo on my machine.
- **1,916 sources** — every factual claim in every lesson cites one.

The concepts are a graph, not a tree. A concept declares typed edges to other concepts:
`requires`, `recommends`, `deepens`, `contrasts`, `applies`, `supersedes`. Only `requires` is
a hard prerequisite. Concepts are reached from many lessons across many tracks — the same
concept underpins work in five different places.

**This is the hard part.** The content is a graph, but a person can only read one thing at a
time in a line. Every structural decision is about how to present a graph as a path without
lying about the graph.

### What is stored about me

- Which lessons I have opened, started, finished.
- Per-concept memory strength, on an FSRS spaced-repetition schedule. Every concept has a
  next-review date and a decaying stability.
- Practice attempts, and which of three hint levels I needed.
- Questions I raised while reading, unresolved, ageing visibly.
- Written reflections at the end of each module.
- Every source has a verification date and an expiry window. Content goes stale on a clock.

### The jobs, in the order they matter

1. "I have 40 minutes. What do I read, and take me straight into it."
2. "I am reading. Do not interrupt me, but let me flag confusion without losing my place."
3. "Drill me on what is decaying. Mix it across subjects, do not block by topic."
4. "I have been away three weeks. What happened, what decayed, where do I re-enter?"
5. "Show me the whole territory. I want to survey, not decide."
6. "What does *this term* actually mean, and everywhere it shows up." — mid-read, no detour.
7. "I want to build something, not read. Give me the spec and check my work."
8. "Which of my open questions is this lesson about to answer?"
9. "What am I reading that has gone out of date?"

### What is wrong today — diagnose against this

**Density inside a lesson.** A single 12-minute lesson carries, on average:

- 32 inline citation markers — a superscript every two or three sentences
- 2 misconception cards ("commonly believed" vs "actually")
- 1.5 asides
- 1 technical figure
- 1 inline recall check with a hidden answer
- plus code blocks, and inline glossary terms with hover definitions

Every one of those earns its place. Together they shred the prose. Reading feels like
scanning a legal document. **This is the single biggest problem to solve.** I want an
answer to "how do a dozen instrument types coexist with continuous prose" — layering,
progressive disclosure, margin apparatus, reading modes, something else.

**The hierarchy is four nested nouns and I cannot hold them.** Today it is
**track → module → lesson**, with **concepts** as a fifth thing that cuts across all of them.
Nobody can keep four container words straight, and the words themselves are interchangeable
— a "module" and a "track" are both just "a group of stuff." Every level is a page I must
pass through, and three of the four exist only to hold children.

Question all of it:

- Is **635 lessons** the right grain? A 12-minute read is one sitting, but 635 of anything is
  a number nobody can navigate. Should a lesson split into **sub-lessons** you move through
  in sequence? Should several lessons collapse into one longer **topic** you scroll?
- Do **modules** need to exist as a screen, or are they only a grouping label?
- Should **concepts** be the primary unit and lessons the secondary view of them, rather than
  the other way round?
- The right answer might not be a hierarchy at all. It might be one flat sequence with
  markers. It might be the concept graph, walked. Propose what fits, not what is expected.

**Navigation is three overlapping systems that each solve a bit of it.** A tree rail, a
breadcrumb, and a command palette all try to answer "where am I" and none finishes the job.
Sideways motion between siblings works, but only inside a group — crossing a boundary is a
visible seam. Following a prerequisite into another track loses the thread I was on.

**Too many chrome layers.** Three columns: a navigation tree on the left, content in the
middle, and context on the right. Both rails compete with the prose and neither is used much.
Plus a breadcrumb and a sticky header on top.

**The map is a decision, not a picture.** The territory overview is a long scrolled diagram of
13 boxes with connector lines. It is accurate and useless — it tells me the shape of the
subject but never what to do.

**Getting anywhere costs four clicks** through three pages I did not want to read. But the
grouping is real, and I do genuinely need to know where I am in something this large.

### Hard constraints

- Desktop only. Design at **1440×900**. Dark mode is the primary; light mode must work too.
- **No gamification of any kind.** No streaks, no XP, no daily goals, no badges, no
  leaderboards, no "you haven't visited in 12 days." Every one of those converts a
  no-deadline project into guilt, and guilt is why self-directed curricula die.
- Progress is shown as **coverage and durability** — what I know, and how well it is holding —
  never as a chain I can break.
- Keyboard-first. A command palette, and single-key moves for the things I do constantly.
- Reading is long-form prose with real typography. This is not a dashboard.
- Everything must be a real URL I can link to and use browser-back on. No modal that holds
  content, no accordion nested more than two deep.

### What is open — put it all on the table

- **The whole containment scheme.** Track / module / lesson / concept is a hypothesis, not a
  requirement. Rename it, flatten it, invert it, or replace it — as long as 635 readings and
  1,490 concepts stay navigable and I always know where I am.
- **The grain of a reading.** Sub-lessons, longer scrolled topics, or the 12-minute unit as it
  stands. Argue for one.
- **The number and shape of screens.** A level that only lists its children may not deserve a
  page.
- **Whether "the map" should exist at all**, and what replaces it if not.
- **Where navigation lives.** Rails, a palette, inline-only, something else — but one system
  that finishes the job, not three that overlap.
- **How reading and drilling relate.** Separate modes, or one continuous surface.
- **How much apparatus is visible while reading**, and what it takes to summon the rest.

### Deliver

One canvas. **Three structurally different directions**, side by side, as low-fidelity
wireframes. Grey boxes and real labels — no colour system, no final typography yet.

For each direction give me:

1. **A name and a one-sentence thesis.** What it believes about the problem.
2. **The containment scheme** — what the units are called, how many levels deep it goes, and
   what the grain of a single reading is. Show it as a labelled diagram with the real
   numbers attached, so I can see whether 635 of something stays navigable under it.
3. **The screen inventory** — every distinct screen, and what each one is for. Say plainly
   which of today's levels stopped being a screen, and where their content went.
4. **The navigation model** — one system, drawn: how I move down, up, sideways and across
   tracks, and how I always know where I am. Name the keys.
5. **A wireframe of the reading surface**, showing exactly how those dozen instrument types
   sit alongside prose. This is the deciding view; spend the most space here.
6. **A wireframe of the orientation surface** — whatever answers "what do I do now."
7. **What it trades away.** Every direction gives something up. Name it honestly.

Make them actually different. One should keep a hierarchy but make it cheap to move through.
One should question whether the lesson is the right primary unit at all — try concepts, or a
single flat sequence. One should be a structure I would not have thought of.

---

## ROUND 2 — commit and build the system

Run after picking a direction, or a hybrid. Attach the **current-state screenshots** here for
the first time, labelled as a failed attempt — useful for what to avoid, not to preserve.

Paste, with the chosen direction described in your own words at the top:

---

I picked **[direction name]**. [Two sentences on what you are keeping and what you are
changing from it.]

Now build the **visual system** for it. Still one canvas, not screens.

Attached are screenshots of the current build. **Treat these as a failed attempt.** They
show the content and the instrument types accurately, and they show exactly the density
problem I am escaping. Do not preserve the layout.

Produce:

1. **Colour** — dark palette first, light second. Named roles, not hex swatches in a vacuum:
   page ground, raised surface, primary text, secondary text, muted text, hairline rule,
   accent, plus semantic states for **verified / stale / decaying / not-yet-attempted**.
2. **Type** — a scale built for 12-minute reads. Reading size and measure decided first,
   everything else derived. Pick real families and show them at reading length, not in a
   specimen row. I need a monospace face too: this content is full of hex, opcodes and code.
3. **Density** — the spacing scale, and the rule for when something is a card versus plain
   flow. Show a dense surface and an airy one so the range is visible.
4. **The instrument set, all of it, on one board:**
   - inline citation marker (×32 per lesson — this one has to disappear until wanted)
   - misconception card: "commonly believed" beside "actually"
   - aside / note
   - inline recall check with a concealed answer, and its post-answer state
   - code block with syntax colour
   - inline glossary term with hover definition
   - technical diagram frame with caption and alt text
   - a lesson's source list
   - concept chip carrying memory strength
   - progress indicator that is coverage-and-durability, never a streak
   - staleness / freshness marker
5. **State vocabulary in form, not only colour** — untouched, in progress, complete, decaying,
   stale. It must read in greyscale.
6. **Focus and keyboard affordances** — this is a keyboard-first app and focus states are
   primary UI, not an accessibility afterthought.

Show every element in dark and light.

---

## ROUND 3 — one screen per run

Repeat per screen. Attach the Round 2 system board every time.

Order — hardest and most-used first, so the system gets stress-tested early:

1. **Reading surface** (the lesson) — 90% of time in the app lives here
2. **Orientation surface** ("what now") — the most-visited, least-designed screen
3. **Drill surface** (spaced-repetition review)
4. **Concept surface** — the graph node: statement, misconceptions, where it appears, memory
5. **Practice surface** — spec, run-the-check, hint ladder
6. **Territory / map surface**
7. **Group surfaces** (track and module, or whatever replaces them)
8. **Index surfaces** — sources, glossary, questions, figures

Per-screen prompt:

---

Design the **[screen name]** at 1440×900, dark and light, using the attached system.

**Its job:** [one sentence.]

**Everything it must carry:** [exhaustive list — every field, count, state and control.]

**States it must handle:** [empty · loading · first visit · returning after weeks · error ·
the degraded case where a feature needs the local install.]

**Keyboard:** [every key that acts on this screen.]

**What must not appear:** [the anti-goals for this screen specifically.]

Show the default state large, then the other states as smaller variants beside it.

---

## Attachment pack

Attach real content, never lorem — the density problem is invisible with placeholder text.

| Round | Attach |
|---|---|
| 1 | Nothing. Prose only. Anchoring is the enemy here. |
| 2 | `current-state/*.png` — ten screens, dark, 1440×900 at 2×. Index and talking points in `current-state/README.md` |
| 3 | The Round 2 system board, every time, plus real text for the screen in question |

Three numbers from those captures are worth quoting into Round 2, because they make the
density argument without needing an adjective:

- One 9-minute **lesson** is **11,954 px** of scroll — 4.1 full screens.
- A **track** page, whose whole job is to list 9 modules, is **9,366 px** — 5.2 screens.
- A **concept** page is **8,556 px** — 4.8 screens.

Real text worth pasting into Round 1 if a sample is wanted — this is a genuine lesson opening,
citation markers and all:

> Your indexer hashes a string with `sha3-256`. Your contract hashes the same string with
> `keccak256`. The digests do not match, and no amount of re-checking the input will make them.
>
> Nothing is broken. You are calling two different functions that share a lineage and, for a
> while, shared a name.
>
> ## Where the split happened
>
> Keccak won NIST's SHA-3 competition, and NIST then spent time turning the winning submission
> into a published standard.<sup>1</sup> FIPS 202 says outright that the result is not the
> submission: the SHA-3 hash functions append a two-bit suffix to the message before the
> sponge's own padding rule runs.<sup>1</sup>

And a real concept record, which is what a concept surface has to render:

> **Hash function** · stable · 365-day verification window
> A deterministic map from arbitrary-length input to a fixed-length digest, cheap forward and
> infeasible to invert.
> Introduced in: Cryptographic primitives (Fundamentals). Reached from 7 of 13 tracks.
> Commonly believed: hashing is a form of encryption, so a hash can in principle be decrypted.
> Actually: a hash is lossy and keyless; there is nothing to decrypt, only a search for some
> input that produces the same digest.

## Running notes

Keep decisions here as rounds complete, so later prompts stay consistent with earlier ones.

- **Round 1 direction chosen:** _(pending)_
- **Round 2 system decisions:** _(pending)_
- **Screens completed:** _(none)_
