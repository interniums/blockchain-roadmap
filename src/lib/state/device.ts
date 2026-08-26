'use client';
import type {
  StateStore, LessonState, QuestionRow, NoteRow, ReflectionRow, AttemptRow, ReviewOutcome, Mastery,
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
  lessons: Record<string, { status: string; scrollPct: number; lastOpenedAt: number }>;
  questions: QuestionRow[]; notes: NoteRow[]; reflections: ReflectionRow[]; attempts: AttemptRow[];
  seen?: Record<string, string[]>;
  seq: number;
};
const blank: Blob = { review: {}, lessons: {}, questions: [], notes: [], reflections: [], attempts: [], seen: {}, seq: 1 };

function read(): Blob {
  if (typeof window === 'undefined') return blank;
  try { return { ...blank, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return blank; }
}
function write(b: Blob) { if (typeof window !== 'undefined') localStorage.setItem(KEY, JSON.stringify(b)); }

export const deviceStore: StateStore = {
  durable: false,

  async dueConcepts(now, limit) {
    const b = read();
    return Object.entries(b.review).filter(([, v]) => v.due <= now)
      .sort((x, y) => x[1].due - y[1].due).slice(0, limit)
      .map(([conceptId, v]) => ({ conceptId, due: v.due, stability: v.stability, reps: v.reps }));
  },
  async masteryFor(ids): Promise<Mastery[]> {
    const b = read();
    return ids.map((id) => {
      const v = b.review[id];
      if (!v) return { conceptId: id, mastery: 0, reps: 0, due: null, creditedShare: 0 };
      return { conceptId: id, mastery: masteryOf(v.reps, v.stability), reps: v.reps, due: v.due, creditedShare: v.stability ? v.credited / v.stability : 0 };
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
    return { conceptId, nextDue: due, credited: [] };
  },
  async lessonState(ids) {
    const b = read();
    return ids.map((id) => {
      const v = b.lessons[id];
      return { lessonId: id, status: (v?.status ?? 'unread') as LessonState['status'], scrollPct: v?.scrollPct ?? 0, lastOpenedAt: v?.lastOpenedAt ?? null };
    });
  },
  async markLessonOpened(id) { const b = read(); b.lessons[id] = { ...(b.lessons[id] ?? { status: 'reading', scrollPct: 0 }), status: b.lessons[id]?.status ?? 'reading', lastOpenedAt: Date.now() }; write(b); },
  async markLessonRead(id, concepts) {
    const b = read();
    b.lessons[id] = { status: 'read', scrollPct: b.lessons[id]?.scrollPct ?? 0, lastOpenedAt: Date.now() };
    for (const c of concepts) if (!b.review[c]) b.review[c] = { due: Date.now(), stability: 1, reps: 0, credited: 0 };
    write(b);
  },
  async setScroll(id, pct) { const b = read(); b.lessons[id] = { ...(b.lessons[id] ?? { status: 'reading', lastOpenedAt: Date.now() }), status: b.lessons[id]?.status ?? 'reading', scrollPct: pct, lastOpenedAt: Date.now() }; write(b); },
  async recentTrail(limit) {
    const b = read();
    return Object.entries(b.lessons).sort((x, y) => y[1].lastOpenedAt - x[1].lastOpenedAt).slice(0, limit)
      .map(([lessonId, v]) => ({ lessonId, status: v.status as LessonState['status'], scrollPct: v.scrollPct, lastOpenedAt: v.lastOpenedAt }));
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
  async attemptsFor(practiceId) { return read().attempts.filter((a) => a.practiceId === practiceId); },
  async reconcileContent(lessonId, contentHash, changeKind, conceptIds) {
    const b = read();
    b.seen ??= {};
    const list = b.seen[lessonId] ?? [];
    const known = list.includes(contentHash);
    if (!known) { b.seen[lessonId] = [...list, contentHash]; write(b); }
    if (known || list.length === 0) return { changed: false, reset: [] };
    if (changeKind !== 'corrective') return { changed: true, reset: [] };
    const reset: string[] = [];
    for (const id of conceptIds) {
      if (!b.review[id] || b.review[id].reps === 0) continue;
      b.review[id] = { due: Date.now(), stability: 1, reps: 0, credited: 0 };
      reset.push(id);
    }
    write(b);
    return { changed: true, reset };
  },

  async summary() {
    const b = read(); const now = Date.now();
    return {
      dueCount: Object.values(b.review).filter((v) => v.due <= now).length,
      lessonsRead: Object.values(b.lessons).filter((v) => v.status === 'read').length,
      openQuestions: b.questions.filter((q) => q.status === 'open').length,
      conceptsStudied: Object.keys(b.review).length,
    };
  },
};
