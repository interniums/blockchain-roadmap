'use client';
import type {
  StateStore, QuestionRow, NoteRow, ReflectionRow, AttemptRow, ReviewOutcome, Mastery,
} from './store';
import { masteryOf } from './store';

/**
 * Web-mode backend: this device only, never synced. The UI states that in words wherever it matters.
 * Scheduling is deliberately simplified — no prerequisite credit, because the web copy is for reading,
 * not for running a review practice you would be upset to lose.
 */
const KEY = 'chainpath.state.v1';
type Blob = {
  review: Record<string, { due: number; stability: number; reps: number; credited: number }>;
  questions: QuestionRow[]; notes: NoteRow[]; reflections: ReflectionRow[]; attempts: AttemptRow[];
  seq: number;
};
const blank: Blob = { review: {}, questions: [], notes: [], reflections: [], attempts: [], seq: 1 };

function read(): Blob {
  if (typeof window === 'undefined') return blank;
  try { return { ...blank, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return blank; }
}
function write(b: Blob) { if (typeof window !== 'undefined') localStorage.setItem(KEY, JSON.stringify(b)); }
const b_all = read;

export const deviceStore: StateStore = {
  durable: false,

  async nextByRetrievability(limit) {
    // Same contract as the local store: softest first, no cutoff. The web copy has no FSRS, so R
    // is approximated by how far past its scheduled point a concept has drifted.
    const now = Date.now();
    return Object.entries(b_all().review)
      .map(([conceptId, v]) => ({
        conceptId,
        retrievability: Math.min(1, Math.max(0, 1 - (now - v.due) / (v.stability * 86400000 || 1))),
        stability: v.stability,
        reps: v.reps,
      }))
      .sort((a, z) => a.retrievability - z.retrievability)
      .slice(0, limit);
  },
  async masteryFor(ids): Promise<Mastery[]> {
    const b = read();
    return ids.map((id) => {
      const v = b.review[id];
      if (!v) return { conceptId: id, mastery: 0, reps: 0, creditedShare: 0 };
      return { conceptId: id, mastery: masteryOf(v.reps, v.stability), reps: v.reps, creditedShare: v.stability ? v.credited / v.stability : 0 };
    });
  },
  async recordReview(conceptId, rating): Promise<ReviewOutcome> {
    const b = read();
    const cur = b.review[conceptId] ?? { due: Date.now(), stability: 1, reps: 0, credited: 0 };
    const mult = rating === 1 ? 0.5 : rating === 2 ? 1.2 : rating === 3 ? 2.0 : 2.8;
    const stability = Math.max(0.5, cur.stability * mult);
    const due = Date.now() + stability * 86400000;
    b.review[conceptId] = { due, stability, reps: cur.reps + 1, credited: cur.credited };
    write(b);
    return { conceptId, credited: [] };
  },
  async askQuestion(text, conceptIds, raisedFrom) {
    const b = read();
    const row: QuestionRow = { id: b.seq++, text, conceptIds, raisedFrom: raisedFrom ?? null, status: 'open', answer: null, raisedAt: Date.now(), resolvedAt: null };
    b.questions.unshift(row); write(b); return row;
  },
  async questions(status) { const b = read(); return status ? b.questions.filter((q) => q.status === status) : b.questions; },
  async answerQuestion(id, answer) { const b = read(); const q = b.questions.find((x) => x.id === id); if (q) { q.answer = answer; q.status = 'answered'; q.resolvedAt = Date.now(); } write(b); },
  async addNote(scope, targetId, body) { const b = read(); const row = { id: b.seq++, scope, targetId, body, createdAt: Date.now() }; b.notes.unshift(row); write(b); return row; },
  async notesFor(scope, targetId) { return read().notes.filter((n) => n.scope === scope && n.targetId === targetId); },
  async saveReflection(moduleId, prompt, body) { const b = read(); const row = { id: b.seq++, moduleId, prompt, body, writtenAt: Date.now() }; b.reflections.unshift(row); write(b); return row; },
  async reflectionsFor(moduleId) { return read().reflections.filter((r) => r.moduleId === moduleId); },
  async recordAttempt(practiceId, passed, hintsUsed) { const b = read(); b.attempts.unshift({ id: b.seq++, practiceId, attemptedAt: Date.now(), passed, hintsUsed }); write(b); },
  async attemptsFor(practiceId) { return read().attempts.filter((a) => a.practiceId === practiceId).sort((a, z) => z.attemptedAt - a.attemptedAt || z.id - a.id); },
  async summary() {
    const b = read();
    return {
      openQuestions: b.questions.filter((q) => q.status === 'open').length,
      conceptsStudied: Object.keys(b.review).length,
    };
  },
};
