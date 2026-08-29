/**
 * The one state interface every screen uses. Two implementations behind it:
 *   local -> server actions writing SQLite (authoritative, durable)
 *   web   -> localStorage on the device (explicitly NOT synced, and the UI says so)
 * Screens never branch on mode; they read `can` from capabilities and call this.
 */

export interface QueuedConcept { conceptId: string; retrievability: number; stability: number; reps: number }
export interface Mastery { conceptId: string; mastery: number; reps: number; creditedShare: number }
export interface QuestionRow { id: number; text: string; conceptIds: string[]; raisedFrom: string | null; status: 'open' | 'answered' | 'parked'; answer: string | null; raisedAt: number; resolvedAt: number | null }
export interface NoteRow { id: number; scope: string; targetId: string; body: string; createdAt: number }
export interface ReflectionRow { id: number; moduleId: string; prompt: string; body: string; writtenAt: number }
export interface AttemptRow { id: number; practiceId: string; attemptedAt: number; passed: boolean; hintsUsed: number }

export interface ReviewOutcome {
  conceptId: string;
  credited: { conceptId: string; depth: number }[];
}

export interface StateStore {
  readonly durable: boolean;

  /**
   * The queue, softest memory first. No date filter and no cutoff: there is no such thing as
   * an overdue concept here, only one you are more or less likely to have lost. Sorting happens
   * in JS because retrievability is not expressible in SQL.
   */
  nextByRetrievability(limit: number): Promise<QueuedConcept[]>;
  masteryFor(conceptIds: string[]): Promise<Mastery[]>;
  /** rating: 1 Again · 2 Hard · 3 Good · 4 Easy. confidence 1-3. */
  recordReview(conceptId: string, rating: 1 | 2 | 3 | 4, confidence?: 1 | 2 | 3): Promise<ReviewOutcome>;

  askQuestion(text: string, conceptIds: string[], raisedFrom?: string): Promise<QuestionRow>;
  questions(status?: 'open' | 'answered' | 'parked'): Promise<QuestionRow[]>;
  answerQuestion(id: number, answer: string): Promise<void>;

  addNote(scope: string, targetId: string, body: string): Promise<NoteRow>;
  notesFor(scope: string, targetId: string): Promise<NoteRow[]>;

  saveReflection(moduleId: string, prompt: string, body: string): Promise<ReflectionRow>;
  reflectionsFor(moduleId: string): Promise<ReflectionRow[]>;

  recordAttempt(practiceId: string, passed: boolean, hintsUsed: number, output?: string): Promise<void>;
  attemptsFor(practiceId: string): Promise<AttemptRow[]>;

  summary(): Promise<{ openQuestions: number; conceptsStudied: number }>;

}

/** 0-1. Retrievability-ish: reps and stability both matter, and a never-reviewed concept is 0. */
export function masteryOf(reps: number, stability: number): number {
  if (reps === 0) return 0;
  return Math.min(1, 1 - Math.exp(-stability / 20));
}
