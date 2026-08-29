import 'server-only';
import { eq, inArray, desc, and } from 'drizzle-orm';
import { db } from './db';
import * as t from './schema';
import { graph } from '../content/load';
import {
  emptyState, review, applyCredit, ancestorsWithDepth, retrievability, type ConceptState,
} from './scheduler';
import type {
  StateStore, QuestionRow, NoteRow, ReflectionRow, ReviewOutcome,
} from './store';
import { masteryOf } from './store';

type Row = typeof t.reviewState.$inferSelect;
const toCS = (r: Row): ConceptState => ({
  conceptId: r.conceptId, due: r.due, stability: r.stability, difficulty: r.difficulty,
  elapsedDays: r.elapsedDays, scheduledDays: r.scheduledDays, reps: r.reps, lapses: r.lapses,
  learningSteps: r.learningSteps, state: r.state, lastReview: r.lastReview ?? undefined,
  creditedStability: r.creditedStability,
});
const toRow = (s: ConceptState) => ({
  conceptId: s.conceptId, due: s.due, stability: s.stability, difficulty: s.difficulty,
  elapsedDays: s.elapsedDays, scheduledDays: s.scheduledDays, reps: s.reps, lapses: s.lapses,
  learningSteps: s.learningSteps, state: s.state, lastReview: s.lastReview ?? null,
  creditedStability: s.creditedStability,
});

function upsert(s: ConceptState) {
  db().insert(t.reviewState).values(toRow(s))
    .onConflictDoUpdate({ target: t.reviewState.conceptId, set: toRow(s) }).run();
}

export const localStore: StateStore = {
  durable: true,

  async nextByRetrievability(limit) {
    // No WHERE clause on purpose. Every row is a concept you have personally retrieved at least
    // once (recordReview is the only writer), so the table is bounded by the corpus, and the
    // sort must happen here: R(t) has no SQL expression. Slice AFTER sorting, never before.
    const now = new Date();
    const rows = db().select().from(t.reviewState).all();
    return rows
      .map((r) => ({
        conceptId: r.conceptId,
        retrievability: retrievability(toCS(r), now),
        stability: r.stability,
        reps: r.reps,
      }))
      .sort((a, b) => a.retrievability - b.retrievability)
      .slice(0, limit);
  },

  async masteryFor(ids) {
    if (!ids.length) return [];
    const rows = db().select().from(t.reviewState).where(inArray(t.reviewState.conceptId, ids)).all();
    const byId = new Map(rows.map((r) => [r.conceptId, r]));
    return ids.map((id) => {
      const r = byId.get(id);
      if (!r) return { conceptId: id, mastery: 0, reps: 0, creditedShare: 0 };
      return {
        conceptId: id, mastery: masteryOf(r.reps, r.stability), reps: r.reps,
        creditedShare: r.stability > 0 ? r.creditedStability / r.stability : 0,
      };
    });
  },

  async recordReview(conceptId, rating, confidence): Promise<ReviewOutcome> {
    const now = new Date();
    const g = graph();
    const existing = db().select().from(t.reviewState).where(eq(t.reviewState.conceptId, conceptId)).get();
    const before = existing ? toCS(existing) : emptyState(conceptId, now);
    const after = review(before, rating, now);
    upsert(after);

    db().insert(t.reviewLog).values({
      conceptId, rating, confidence: confidence ?? null,
      confidentlyWrong: rating === 1 && (confidence ?? 0) >= 3,
      reviewedAt: now, creditedFrom: null,
    }).run();

    // fractional implicit repetition — advanced work IS review of its prerequisites
    const edgesOf = (id: string) => (g.conceptById.get(id)?.edges ?? []).map((e) => ({ to: e.to, type: e.type as string }));
    const credited: { conceptId: string; depth: number }[] = [];
    for (const [ancestorId, depth] of ancestorsWithDepth(conceptId, edgesOf)) {
      const row = db().select().from(t.reviewState).where(eq(t.reviewState.conceptId, ancestorId)).get();
      if (!row) continue;                       // never studied — nothing to credit
      const next = applyCredit(toCS(row), depth, rating, now);
      if (next === toCS(row)) continue;
      upsert(next);
      db().insert(t.reviewLog).values({
        conceptId: ancestorId, rating, confidence: null, confidentlyWrong: false,
        reviewedAt: now, creditedFrom: conceptId,
      }).run();
      credited.push({ conceptId: ancestorId, depth });
    }
    return { conceptId, credited };
  },

  async askQuestion(text, conceptIds, raisedFrom) {
    const now = new Date();
    const r = db().insert(t.question)
      .values({ text, conceptIds: JSON.stringify(conceptIds), raisedFrom: raisedFrom ?? null, raisedAt: now })
      .returning().get();
    return { ...r, conceptIds, raisedAt: now.getTime(), resolvedAt: null } as QuestionRow;
  },

  async questions(status) {
    const rows = status
      ? db().select().from(t.question).where(eq(t.question.status, status)).orderBy(desc(t.question.raisedAt)).all()
      : db().select().from(t.question).orderBy(desc(t.question.raisedAt)).all();
    return rows.map((r) => ({
      id: r.id, text: r.text, conceptIds: JSON.parse(r.conceptIds), raisedFrom: r.raisedFrom,
      status: r.status as QuestionRow['status'], answer: r.answer,
      raisedAt: r.raisedAt.getTime(), resolvedAt: r.resolvedAt?.getTime() ?? null,
    }));
  },

  async answerQuestion(id, answer) {
    db().update(t.question).set({ answer, status: 'answered', resolvedAt: new Date() })
      .where(eq(t.question.id, id)).run();
  },

  async addNote(scope, targetId, body) {
    const now = new Date();
    const r = db().insert(t.note).values({ scope, targetId, body, createdAt: now }).returning().get();
    return { ...r, createdAt: now.getTime() } as NoteRow;
  },

  async notesFor(scope, targetId) {
    const rows = db().select().from(t.note)
      .where(and(eq(t.note.scope, scope), eq(t.note.targetId, targetId))).orderBy(desc(t.note.createdAt)).all();
    return rows.map((r) => ({ ...r, createdAt: r.createdAt.getTime() }));
  },

  async saveReflection(moduleId, prompt, body) {
    const now = new Date();
    const r = db().insert(t.reflection).values({ moduleId, prompt, body, writtenAt: now }).returning().get();
    return { ...r, writtenAt: now.getTime() } as ReflectionRow;
  },

  async reflectionsFor(moduleId) {
    const rows = db().select().from(t.reflection)
      .where(eq(t.reflection.moduleId, moduleId)).orderBy(desc(t.reflection.writtenAt)).all();
    return rows.map((r) => ({ ...r, writtenAt: r.writtenAt.getTime() }));
  },

  async recordAttempt(practiceId, passed, hintsUsed, output) {
    db().insert(t.practiceAttempt)
      .values({ practiceId, attemptedAt: new Date(), passed, hintsUsed, output: output ?? null }).run();
  },

  async attemptsFor(practiceId) {
    // id is the tiebreak, not decoration: two attempts inside the same millisecond tie on
    // attemptedAt, and "which one was last" is exactly what this list is for.
    const rows = db().select().from(t.practiceAttempt)
      .where(eq(t.practiceAttempt.practiceId, practiceId))
      .orderBy(desc(t.practiceAttempt.attemptedAt), desc(t.practiceAttempt.id)).all();
    return rows.map((r) => ({
      id: r.id, practiceId: r.practiceId, attemptedAt: r.attemptedAt.getTime(),
      passed: r.passed, hintsUsed: r.hintsUsed,
    }));
  },

  async summary() {
    const open = db().select().from(t.question).where(eq(t.question.status, 'open')).all();
    const studied = db().select().from(t.reviewState).all();
    return { openQuestions: open.length, conceptsStudied: studied.length };
  },
};
