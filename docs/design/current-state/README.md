# Current-state screenshots

Captured 29 Aug 2026 from the local dev server. Dark mode, 1440×900 viewport at 2× (2880px
wide files). Every one except the two review shots and the palette is **full-page**, so the
file height is the real scroll length of that screen.

**These are evidence of the problem, not a reference to preserve.** Attach them at Round 2 of
`../REBUILD-PROMPT.md`, labelled as a failed attempt. Do not attach them at Round 1.

| File | Screen | Scroll height | What it shows |
|---|---|---|---|
| `01-today-orientation.png` | Today | 1.7 screens | The "what now" front door — six cards, two rails |
| `02-lesson-reading-surface.png` | Lesson | **4.1 screens** | The workhorse. Three columns, and the full instrument density |
| `03-roadmap-map.png` | Roadmap | 2.9 screens | 13 track cards on a static SVG spine with connectors |
| `04-track.png` | Track | **5.2 screens** | A level that mostly lists its children |
| `05-module.png` | Module | 2.9 screens | Another level that mostly lists its children |
| `06-concept.png` | Concept | **4.8 screens** | The graph node — statement, misconceptions, appearances, mastery |
| `07-review-drill-start.png` | Review | 1 screen | Session setup: how long do you have |
| `08-review-drill-item.png` | Review | 1 screen | A single drill item, pre-reveal. The only calm screen in the app |
| `09-practice.png` | Practice | 2.5 screens | Spec, acceptance criteria, run-the-check, hint ladder |
| `10-command-palette.png` | Palette | 1 screen | ⌘K over everything, open on top of the practice screen |

## What to point at when you attach these

- **`02` is the case for the rebuild.** One 9-minute lesson is nearly 12,000 px of scroll,
  carrying ~32 citation markers, a figure, an inline check, misconception cards and asides,
  between two rails that compete with the prose.
- **`04` and `05` are the case against the hierarchy.** Both are long pages whose main job is
  to list what is inside them. Five screens of scroll to choose a child.
- **`10` shows navigation losing.** Concept titles truncate to "Gas c…", "Gas gri…",
  "Gas estimatio…" — the search surface cannot show what it found.
- **`08` is the one screen that works.** Single item, no chrome, nothing competing. Worth
  asking why the reading surface is not more like it.
