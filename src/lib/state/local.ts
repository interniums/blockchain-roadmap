import 'server-only';
import { eq, lte, gte, inArray, desc, and } from 'drizzle-orm';
import { db } from './db';
import * as t from './schema';
import { graph, resolveConceptId } from '../content/load';
import {
  emptyState, review, applyCredit, ancestorsWithDepth, introductionDue, type ConceptState,
} from './scheduler';
import type {
  StateStore, DueConcept, Mastery, LessonState, QuestionRow, NoteRow, ReflectionRow, AttemptRow, ReviewOutcome,
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

  async dueConcepts(now, limit) {
    const rows = db().select().from(t.reviewState)
      .where(lte(t.reviewState.due, new Date(now))).orderBy(t.reviewState.due).limit(limit).all();
    return rows.map((r) => ({ conceptId: r.conceptId, due: r.due.getTime(), stability: r.stability, reps: r.reps }));
  },

  async masteryFor(ids) {
    if (!ids.length) return [];
    const rows = db().select().from(t.reviewState).where(inArray(t.reviewState.conceptId, ids)).all();
    const byId = new Map(rows.map((r) => [r.conceptId, r]));
    return ids.map((id) => {
      const r = byId.get(id);
      if (!r) return { conceptId: id, mastery: 0, reps: 0, due: null, creditedShare: 0 };
      return {
        conceptId: id, mastery: masteryOf(r.reps, r.stability), reps: r.reps,
        due: r.due.getTime(),
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
    return { conceptId, nextDue: after.due.getTime(), credited };
  },

  async lessonState(ids) {
    if (!ids.length) return [];
    const rows = db().select().from(t.lessonProgress).where(inArray(t.lessonProgress.lessonId, ids)).all();
    const byId = new Map(rows.map((r) => [r.lessonId, r]));
    return ids.map((id) => {
      const r = byId.get(id);
      return {
        lessonId: id,
        status: (r?.status ?? 'unread') as LessonState['status'],
        scrollPct: r?.scrollPct ?? 0,
        lastOpenedAt: r?.lastOpenedAt?.getTime() ?? null,
      };
    });
  },

  async markLessonOpened(lessonId) {
    const now = new Date();
    db().insert(t.lessonProgress).values({ lessonId, status: 'reading', lastOpenedAt: now })
      .onConflictDoUpdate({ target: t.lessonProgress.lessonId, set: { lastOpenedAt: now } }).run();
  },

  async markLessonRead(lessonId, conceptIds) {
    const now = new Date();
    db().insert(t.lessonProgress).values({ lessonId, status: 'read', lastOpenedAt: now, completedAt: now })
      .onConflictDoUpdate({ target: t.lessonProgress.lessonId, set: { status: 'read', completedAt: now } }).run();
    // Reading introduces concepts into the review system, unproven — but rate-limited (§17), so a
    // long session cannot dump a backlog on tomorrow.
    const dayStart = new Date(now); dayStart.setHours(0, 0, 0, 0);
    const introducedToday = db().select().from(t.reviewState)
      .where(and(eq(t.reviewState.reps, 0), gte(t.reviewState.due, dayStart)))
      .all()
      .filter((r) => r.due.getTime() < dayStart.getTime() + 86400000).length;

    let i = 0;
    for (const raw of conceptIds) {
      const id = resolveConceptId(raw) ?? raw;
      const existing = db().select().from(t.reviewState).where(eq(t.reviewState.conceptId, id)).get();
      if (existing) continue;
      upsert({ ...emptyState(id, now), due: introductionDue(introducedToday, i, now) });
      i++;
    }
  },

  async setScroll(lessonId, pct) {
    db().insert(t.lessonProgress).values({ lessonId, scrollPct: pct, lastOpenedAt: new Date() })
      .onConflictDoUpdate({ target: t.lessonProgress.lessonId, set: { scrollPct: pct } }).run();
  },

  async recentTrail(limit) {
    const rows = db().select().from(t.lessonProgress)
      .orderBy(desc(t.lessonProgress.lastOpenedAt)).limit(limit).all();
    return rows.map((r) => ({
      lessonId: r.lessonId, status: r.status as LessonState['status'],
      scrollPct: r.scrollPct, lastOpenedAt: r.lastOpenedAt?.getTime() ?? null,
    }));
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
    const rows = db().select().from(t.practiceAttempt)
      .where(eq(t.practiceAttempt.practiceId, practiceId)).orderBy(desc(t.practiceAttempt.attemptedAt)).all();
    return rows.map((r) => ({
      id: r.id, practiceId: r.practiceId, attemptedAt: r.attemptedAt.getTime(),
      passed: r.passed, hintsUsed: r.hintsUsed,
    }));
  },

  async reconcileContent(lessonId, contentHash, changeKind, conceptIds) {
    const now = new Date();
    const seen = db().select().from(t.contentVersion)
      .where(eq(t.contentVersion.lessonId, lessonId)).all();
    const known = seen.some((r) => r.contentHash === contentHash);
    if (!known) {
      db().insert(t.contentVersion).values({ lessonId, contentHash, seenAt: now })
        .onConflictDoNothing().run();
    }
    // First sighting of a lesson is not a "change" — there is nothing to reconcile against.
    if (known || seen.length === 0) return { changed: false, reset: [] };
    if (changeKind !== 'corrective') return { changed: true, reset: [] };

    const reset: string[] = [];
    for (const raw of conceptIds) {
      const id = resolveConceptId(raw) ?? raw;
      const row = db().select().from(t.reviewState).where(eq(t.reviewState.conceptId, id)).get();
      if (!row || row.reps === 0) continue;          // nothing proven, nothing to invalidate
      upsert({ ...emptyState(id, now), creditedStability: 0 });
      db().insert(t.reviewLog).values({
        conceptId: id, rating: 1, confidence: null, confidentlyWrong: false,
        reviewedAt: now, creditedFrom: `corrective:${lessonId}`,
      }).run();
      reset.push(id);
    }
    if (reset.length) {
      db().insert(t.note).values({
        scope: 'lesson', targetId: lessonId, createdAt: now,
        body: `This lesson was corrected — a claim in it was wrong. ${reset.length} concept(s) were reset to unproven and re-queued so you re-learn the corrected version rather than keeping a wrong one.`,
      }).run();
    }
    return { changed: true, reset };
  },

  async summary() {
    const due = db().select().from(t.reviewState).where(lte(t.reviewState.due, new Date())).all();
    const read = db().select().from(t.lessonProgress).where(eq(t.lessonProgress.status, 'read')).all();
    const open = db().select().from(t.question).where(eq(t.question.status, 'open')).all();
    const studied = db().select().from(t.reviewState).all();
    return {
      dueCount: due.length, lessonsRead: read.length,
      openQuestions: open.length, conceptsStudied: studied.length,
    };
  },
};
