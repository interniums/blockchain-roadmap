/**
 * The shape Today renders. Every card takes one of these objects and nothing else,
 * so the state store could be swapped in behind `./data.ts` + `./resolve.ts`
 * without touching a single component.
 *
 * Rule for this screen: a zero that means "nothing is due", a zero that means
 * "nothing is recorded yet" and a blank that means "we have not looked yet" are
 * three different facts and must read differently. `phase` says which of the three
 * a card is showing; `progressStore` says where the answer came from.
 */

import type { ReactNode } from 'react';
import type { Crumb, LessonStatus } from '@/lib/content/types';

/** 'local' = SQLite on this machine, durable. 'device' = web copy, this browser only, never synced. */
export type ProgressStore = 'local' | 'device';

/**
 * The page renders on the server, which by design cannot see your record — state is read
 * from a client leaf after mount. Until that read lands, cards must say they have not
 * looked rather than assert an empty record.
 */
export type StatePhase = 'pending' | 'ready' | 'unavailable';

/** What the store reports about a lesson. Mirrors LessonState['status'] without importing the store. */
export type ReadStatus = 'unread' | 'reading' | 'read';

export interface ConceptRef {
  id: string;
  title: string;
  href: string;
}

export interface PracticeRef {
  id: string;
  title: string;
  kind: string;
  href: string;
}

export interface ContinuePick {
  href: string;
  lessonId: string;
  moduleId: string;
  trackId: string;
  lessonTitle: string;
  moduleTitle: string;
  trackTitle: string;
  crumbs: Crumb[];
  readingMin?: number;
  status: LessonStatus;
  teaches: ConceptRef[];
  assumes: ConceptRef[];
  /** The practice(s) this lesson's module ends on — the other kind of "next move". */
  practices: PracticeRef[];
  /** Why this lesson is the pick. 'resume' means a recorded position put you here. */
  basis: 'start' | 'resume';
  /**
   * One sentence saying why this is the pick, when the reason is not obvious from `basis`:
   * how far in you stopped, that the previous lesson is finished, that this is the last one.
   * Composed server-side so the card renders it and does not have to reason about state.
   */
  resumeNote?: string;
  /** 1-based position in the whole curriculum's reading order. */
  position: number;
  total: number;
}

export interface ReviewState {
  due: number;
  /** ISO day of the earliest scheduled item. Only meaningful when `due` is 0. */
  nextDueAt: string | null;
  /** The next item lands later today. A date would read as a contradiction next to "nothing ready". */
  nextDueIsToday: boolean;
  /**
   * Concepts that have entered the schedule at all — finishing a lesson puts the concepts it
   * teaches in, unproven, before you have ever graded yourself. So this is coverage, not mastery.
   */
  seen: number;
  /** Every concept in the curriculum — the pool review draws from. */
  pool: number;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  done: boolean;
}

export interface ActiveProject {
  id: string;
  title: string;
  href: string;
  trackTitle: string;
  milestones: ProjectMilestone[];
}

export interface ProjectState {
  active: ActiveProject | null;
  /** Tracks that state an exit capability — the slot a project will hang off. */
  tracksWithExit: number;
}

export interface OpenQuestion {
  id: string;
  text: string;
  href: string;
  /** Where it was raised. */
  context: string;
  askedAt: string;
  ageDays: number;
}

export interface QuestionsState {
  open: number;
  items: OpenQuestion[];
  /** Age of the oldest open question in days — the plan wants questions to age visibly. */
  oldestAgeDays: number | null;
}

export interface ContentHealth {
  /** Sources past `verifiedAt + window(volatility)`. Computed from the content, not stubbed. */
  stale: number;
  /** Sources a concept cites and therefore puts on the re-verify clock. */
  tracked: number;
  /** Cited sources carrying no parsable verifiedAt/retrievedAt stamp. */
  unstamped: number;
  /** ISO day the next source falls due. */
  nextDueAt: string | null;
  /** Concepts the content itself flags as not yet carrying a real source. */
  needsSource: number;
  /** When this was computed — the build, for a prerendered page. */
  checkedAt: string;
}

export interface TrailEntry {
  href: string;
  label: string;
  /** Where it sits — e.g. "Fundamentals · What a blockchain is". */
  context: string;
  kind: 'lesson' | 'module' | 'track' | 'concept' | 'practice';
  /** ISO timestamp. */
  at: string;
  /** How far you got — "read", "62% in". Omitted when the store has nothing to say. */
  note?: string;
}

export interface CurriculumState {
  tracks: number;
  modules: number;
  lessons: number;
  concepts: number;
  practices: number;
  sources: number;
  /** Lessons past 'outlined'. Zero today, and the page says so out loud. */
  written: number;
}

export interface TodayData {
  progressStore: ProgressStore;
  /** 'pending' on the server render — nobody has read your record yet. */
  phase: StatePhase;
  next: ContinuePick | null;
  review: ReviewState;
  project: ProjectState;
  questions: QuestionsState;
  health: ContentHealth;
  trail: TrailEntry[];
  curriculum: CurriculumState;
}

// ---- the client -> server hand-off -------------------------------------------------
// State is read in a client leaf; the content graph only exists on the server. So the
// client sends what the store told it, and the server turns lesson ids and concept ids
// into titles, hrefs, crumbs and reading-order positions.

export interface LiveInput {
  now: number;
  /** The most recently opened lesson, as the store reports it. Null when nothing was ever opened. */
  anchor: { lessonId: string; status: ReadStatus; scrollPct: number } | null;
  /** Lessons in the recent window the store says are finished — skipped when walking forward. */
  readIds: string[];
  trail: { lessonId: string; status: ReadStatus; scrollPct: number; at: number | null }[];
  /** Enough open questions to fill the card, newest first. */
  questions: { id: number; text: string; conceptIds: string[]; raisedFrom: string | null; raisedAt: number }[];
  openCount: number;
  oldestRaisedAt: number | null;
  /** Straight off `store.summary()`, plus the earliest scheduled due date. */
  review: { due: number; seen: number; earliestDue: number | null };
}

export interface LiveToday {
  pick: ContinuePick | null;
  review: ReviewState;
  questions: QuestionsState;
  trail: TrailEntry[];
  /**
   * The left rail, already rendered, because it follows the resume point and is built from the
   * content graph the client cannot read. Null when there is no lesson to sit it against.
   */
  rail: ReactNode;
}
