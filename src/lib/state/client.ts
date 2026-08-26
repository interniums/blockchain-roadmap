'use client';
import { MODE } from '../capabilities';
import { deviceStore } from './device';
import type { StateStore } from './store';

/**
 * The one store every client component uses. Never branch on MODE at a call site.
 *
 * In WEB mode the SQLite-backed server actions are never imported. That matters for more than bundle
 * size: a hosted copy has an ephemeral, often read-only filesystem, so a stray call would either throw
 * or silently write state that vanishes. Not importing them makes that unreachable rather than
 * merely discouraged. actions.ts additionally refuses at runtime (defence in depth).
 */
type ActionsModule = typeof import('./actions');
let actionsPromise: Promise<ActionsModule> | null = null;
const actions = () => (actionsPromise ??= import('./actions'));

/** Each method resolves the server-action module on first use, then calls straight through. */
const serverBacked: StateStore = {
  durable: true,
  dueConcepts: (n, l) => actions().then((A) => A.aDueConcepts(n, l)),
  masteryFor: (ids) => actions().then((A) => A.aMasteryFor(ids)),
  recordReview: (id, r, c) => actions().then((A) => A.aRecordReview(id, r, c)),
  lessonState: (ids) => actions().then((A) => A.aLessonState(ids)),
  markLessonOpened: (id) => actions().then((A) => A.aMarkOpened(id)),
  markLessonRead: (id, cs) => actions().then((A) => A.aMarkRead(id, cs)),
  setScroll: (id, p) => actions().then((A) => A.aSetScroll(id, p)),
  recentTrail: (l) => actions().then((A) => A.aRecentTrail(l)),
  askQuestion: (t, cs, f) => actions().then((A) => A.aAsk(t, cs, f)),
  questions: (s) => actions().then((A) => A.aQuestions(s)),
  answerQuestion: (id, a) => actions().then((A) => A.aAnswer(id, a)),
  addNote: (s, t, b) => actions().then((A) => A.aAddNote(s, t, b)),
  notesFor: (s, t) => actions().then((A) => A.aNotesFor(s, t)),
  saveReflection: (m, p, b) => actions().then((A) => A.aSaveReflection(m, p, b)),
  reflectionsFor: (m) => actions().then((A) => A.aReflectionsFor(m)),
  recordAttempt: (id, p, h, o) => actions().then((A) => A.aRecordAttempt(id, p, h, o)),
  attemptsFor: (id) => actions().then((A) => A.aAttemptsFor(id)),
  summary: () => actions().then((A) => A.aSummary()),
  reconcileContent: (l, h, k, cs) => actions().then((A) => A.aReconcile(l, h, k, cs)),
};

export const store: StateStore = MODE === 'web' ? deviceStore : serverBacked;
export const stateIsDurable = store.durable;
