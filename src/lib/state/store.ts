/**
 * The one state interface every screen uses. Two implementations behind it:
 *   local -> server actions writing SQLite (authoritative, durable)
 *   web   -> localStorage on the device (explicitly NOT synced, and the UI says so)
 * Screens never branch on mode; they read `can` from capabilities and call this.
 */

export interface DueConcept { conceptId: string; due: number; stability: number; reps: number }
export interface Mastery { conceptId: string; mastery: number; reps: number; due: number | null; creditedShare: number }
export interface LessonState { lessonId: string; status: 'unread' | 'reading' | 'read'; scrollPct: number; lastOpenedAt: number | null }
export interface QuestionRow { id: number; text: string; conceptIds: string[]; raisedFrom: string | null; status: 'open' | 'answered' | 'parked'; answer: string | null; raisedAt: number; resolvedAt: number | null }
export interface NoteRow { id: number; scope: string; targetId: string; body: string; createdAt: number }
export interface ReflectionRow { id: number; moduleId: string; prompt: string; body: string; writtenAt: number }
export interface AttemptRow { id: number; practiceId: string; attemptedAt: number; passed: boolean; hintsUsed: number }

export interface ReviewOutcome {
  conceptId: string;
  nextDue: number;
  credited: { conceptId: string; depth: number }[];
}

export interface StateStore {
  readonly durable: boolean;

  dueConcepts(now: number, limit: number): Promise<DueConcept[]>;
  masteryFor(conceptIds: string[]): Promise<Mastery[]>;
  /** rating: 1 Again · 2 Hard · 3 Good · 4 Easy. confidence 1-3. */
  recordReview(conceptId: string, rating: 1 | 2 | 3 | 4, confidence?: 1 | 2 | 3): Promise<ReviewOutcome>;

  lessonState(lessonIds: string[]): Promise<LessonState[]>;
  markLessonOpened(lessonId: string): Promise<void>;
  markLessonRead(lessonId: string, conceptIds: string[]): Promise<void>;
  setScroll(lessonId: string, pct: number): Promise<void>;
  recentTrail(limit: number): Promise<LessonState[]>;

  askQuestion(text: string, conceptIds: string[], raisedFrom?: string): Promise<QuestionRow>;
  questions(status?: 'open' | 'answered' | 'parked'): Promise<QuestionRow[]>;
  answerQuestion(id: number, answer: string): Promise<void>;

  addNote(scope: string, targetId: string, body: string): Promise<NoteRow>;
  notesFor(scope: string, targetId: string): Promise<NoteRow[]>;

  saveReflection(moduleId: string, prompt: string, body: string): Promise<ReflectionRow>;
  reflectionsFor(moduleId: string): Promise<ReflectionRow[]>;

  recordAttempt(practiceId: string, passed: boolean, hintsUsed: number, output?: string): Promise<void>;
  attemptsFor(practiceId: string): Promise<AttemptRow[]>;

  summary(): Promise<{ dueCount: number; lessonsRead: number; openQuestions: number; conceptsStudied: number }>;

  /**
   * Plan §17. Called when a lesson is opened. If its content changed since the learner last saw it
   * AND the edit was marked `corrective`, the lesson's concepts reset to unproven and re-enter the
   * queue — with a reason the learner can read. Nothing ever changes state without saying why.
   */
  reconcileContent(
    lessonId: string, contentHash: string,
    changeKind: 'cosmetic' | 'clarifying' | 'corrective' | undefined,
    conceptIds: string[],
  ): Promise<{ changed: boolean; reset: string[] }>;
}

/** 0-1. Retrievability-ish: reps and stability both matter, and a never-reviewed concept is 0. */
export function masteryOf(reps: number, stability: number): number {
  if (reps === 0) return 0;
  return Math.min(1, 1 - Math.exp(-stability / 20));
}
