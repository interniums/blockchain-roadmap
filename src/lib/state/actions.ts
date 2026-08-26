'use server';
import { localStore } from './local';
import { MODE } from '../capabilities';
import type { QuestionRow } from './store';

/**
 * Defence in depth. client.ts never imports this module in web mode, but a server action endpoint
 * still exists once compiled. If one is ever reached on a hosted copy, fail loudly here rather than
 * writing to an ephemeral filesystem that silently discards the learner's record.
 */
function assertLocal() {
  if (MODE === 'web') {
    throw new Error('State is not writable on the hosted copy. Progress there lives in your browser, on this device only.');
  }
}

/**
 * Server actions = the local (durable) backend. Only reachable when the app runs on your machine.
 * Every one is a thin pass-through so the interface stays identical to the device store.
 */
export async function aReconcile(l: string, h: string, k: 'cosmetic' | 'clarifying' | 'corrective' | undefined, cs: string[]) { assertLocal(); return localStore.reconcileContent(l, h, k, cs); }
export async function aDueConcepts(now: number, limit: number) { assertLocal(); return localStore.dueConcepts(now, limit); }
export async function aMasteryFor(ids: string[]) { assertLocal(); return localStore.masteryFor(ids); }
export async function aRecordReview(id: string, rating: 1 | 2 | 3 | 4, confidence?: 1 | 2 | 3) { assertLocal(); return localStore.recordReview(id, rating, confidence); }
export async function aLessonState(ids: string[]) { assertLocal(); return localStore.lessonState(ids); }
export async function aMarkOpened(id: string) { assertLocal(); return localStore.markLessonOpened(id); }
export async function aMarkRead(id: string, concepts: string[]) { assertLocal(); return localStore.markLessonRead(id, concepts); }
export async function aSetScroll(id: string, pct: number) { assertLocal(); return localStore.setScroll(id, pct); }
export async function aRecentTrail(limit: number) { assertLocal(); return localStore.recentTrail(limit); }
export async function aAsk(text: string, concepts: string[], from?: string): Promise<QuestionRow> { return localStore.askQuestion(text, concepts, from); }
export async function aQuestions(status?: 'open' | 'answered' | 'parked') { assertLocal(); return localStore.questions(status); }
export async function aAnswer(id: number, answer: string) { assertLocal(); return localStore.answerQuestion(id, answer); }
export async function aAddNote(scope: string, target: string, body: string) { assertLocal(); return localStore.addNote(scope, target, body); }
export async function aNotesFor(scope: string, target: string) { assertLocal(); return localStore.notesFor(scope, target); }
export async function aSaveReflection(m: string, p: string, b: string) { assertLocal(); return localStore.saveReflection(m, p, b); }
export async function aReflectionsFor(m: string) { assertLocal(); return localStore.reflectionsFor(m); }
export async function aRecordAttempt(id: string, passed: boolean, hints: number, out?: string) { assertLocal(); return localStore.recordAttempt(id, passed, hints, out); }
export async function aAttemptsFor(id: string) { assertLocal(); return localStore.attemptsFor(id); }
export async function aSummary() { assertLocal(); return localStore.summary(); }
