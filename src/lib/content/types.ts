// Mirrors content/SCHEMA.md. The linter enforces the shapes; these types describe them.

export type Lane = 'spine' | 'left' | 'right';
export type TrackKind = 'core' | 'elective';
export type EdgeType = 'requires' | 'recommends' | 'deepens' | 'contrasts' | 'applies' | 'supersedes';
export type Tier = 'spec' | 'canonical-docs' | 'primary-analysis' | 'secondary';
export type Volatility = 'stable' | 'evolving' | 'hot';
export type PracticeKind = 'implement' | 'break' | 'fix' | 'read' | 'measure' | 'write';

export interface Layout { lane: Lane; row: number }

export interface Track {
  id: string; number: number; kind: TrackKind; title: string; tagline?: string;
  capabilities?: string[]; layout: Layout;
  entersFrom?: string[]; feedsInto?: string[]; modules: string[];
}

export interface Lesson {
  id: string; order: number; title: string;
  teaches?: string[]; assumes?: string[];
  readingMin?: number;
  /**
   * Concepts this lesson leans on that are taught LATER in reading order. They inform the reading
   * but must never gate it — a gate keyed to them would lock the lesson behind content up to 154
   * lessons downstream of itself. Kept as authored data rather than deleted, because the
   * relationship is real; enforced non-gating by `assumesFor`, and R10 is what stops a genuine
   * backward prerequisite being filed here by mistake.
   */
  softAssumes?: string[];
}

export interface Module {
  id: string; trackId: string; order: number; title: string; summary?: string;
  layout?: Layout; teaches?: string[]; lessons?: Lesson[];
  practices?: string[]; reflectionPrompt?: string; status?: string;
}

export interface Misconception { belief: string; reality: string; why?: string; source?: string }
export interface Edge { to: string; type: EdgeType; note?: string }

export interface Concept {
  id: string; title: string; oneLine: string; statement?: string;
  /** Plan §17: ids are immutable. A rename is recorded here, never applied in place. */
  formerIds?: string[];
  /** This concept was split into these; state migrates to every child at the parent's mastery. */
  splitInto?: string[];
  /** This concept absorbed these; state takes the maximum. */
  mergedFrom?: string[];
  volatility?: Volatility; edges?: Edge[]; sources?: string[];
  misconceptions?: Misconception[]; paysOffIn?: string[];
  needsSource?: boolean; claimKind?: string;
}

export interface Source {
  id: string; tier: Tier; title: string; url: string;
  publishedAt?: string; retrievedAt?: string; verifiedAt?: string; vendor?: boolean;
}

/**
 * How much of the curriculum a practice answers for. Called `grain` and not `tier` because
 * `Source.tier` already means something else, and not `level` because `difficulty` already does.
 *
 *   check   — an inline retrieval inside one lesson. Authored in the prose as `<Check>`, not as a
 *             practice file; listed here because it is the bottom of the same ladder.
 *   block   — a repo exercise over the 2-3 lessons that share a mechanism. The 236 authored
 *             practices are all this size: measured concept-span 1→22, 2→106, 3→87, 4→20, 5→1.
 *   module  — the capstone. Spans a module's whole `teaches` set: min 4, median 15, max 28.
 *   exit    — a core track's project, graded against the plain-English capabilities it declares.
 */
export type PracticeGrain = 'check' | 'block' | 'module' | 'exit';

export interface Practice {
  id: string; moduleId: string; kind: PracticeKind; title: string;
  /** absent in older files; treated as 'block', which is what all 236 originally were */
  grain?: PracticeGrain;
  concepts?: string[]; spec?: string;
  acceptance?: { command?: string; criteria?: string[] };
  hints?: string[]; difficulty?: number;
  /**
   * Module grain only: the concepts the capstone has to exercise together. Authored as the
   * module's whole `teaches` set so a lint rule can check it has not drifted from it.
   */
  coversConcepts?: string[];
  /** Exit grain only: the core track this project closes out. */
  trackId?: string;
  /**
   * Module and exit grain: the question to answer in writing afterwards. For a capstone this is
   * the module's existing `reflectionPrompt` — all 104 are already authored, so a second one would
   * be a second thing to keep in sync.
   */
  writeUp?: string;
}

/** A concept plus everything the graph knows about where it sits. */
export interface ConceptView extends Concept {
  moduleId: string; trackId: string;
  requires: string[]; requiredBy: string[];
  related: { type: EdgeType; to: string }[];
  lessons: string[];
}

export interface Crumb { href: string; label: string }
