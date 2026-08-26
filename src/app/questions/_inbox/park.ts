'use client';

import { store } from '@/lib/state/client';

/**
 * Parking, built on the one write the state interface gives us for arbitrary learner marks.
 *
 * QuestionRow has a 'parked' status but the store exposes no setter for it — askQuestion opens,
 * answerQuestion answers, and that is the whole lifecycle. Rather than reach into the state layer
 * (which is finished and tested), park is kept as an append-only log of notes under one scope.
 * Newest entry per question wins; nothing is ever deleted, so a park you later reopen leaves a
 * trail rather than a hole.
 *
 * Consequence worth knowing: store.summary().openQuestions still counts a parked question as open,
 * because the row's status is genuinely still 'open'.
 */
const SCOPE = 'question-park';
const TARGET = 'log';

export type ParkMap = Record<number, boolean>;

interface ParkEvent {
  id: number;
  state: 'parked' | 'open';
}

function parse(body: string): ParkEvent | null {
  try {
    const v = JSON.parse(body) as Partial<ParkEvent>;
    if (typeof v?.id !== 'number') return null;
    if (v.state !== 'parked' && v.state !== 'open') return null;
    return { id: v.id, state: v.state };
  } catch {
    return null;
  }
}

/** Both backends return notes newest-first, so the first entry seen for an id is the current one. */
export async function readParked(): Promise<ParkMap> {
  const notes = await store.notesFor(SCOPE, TARGET);
  const out: ParkMap = {};
  for (const n of notes) {
    const e = parse(n.body);
    if (!e || e.id in out) continue;
    out[e.id] = e.state === 'parked';
  }
  return out;
}

export async function writeParked(id: number, parked: boolean): Promise<void> {
  await store.addNote(SCOPE, TARGET, JSON.stringify({ id, state: parked ? 'parked' : 'open' } satisfies ParkEvent));
}
