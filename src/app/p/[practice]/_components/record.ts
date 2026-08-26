'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { store } from '@/lib/state/client';
import type { AttemptRow } from '@/lib/state/store';

/**
 * One record per practice, shared by the hint ladder and the attempt log, so the rung you
 * needed and the attempt you record can never disagree with each other.
 *
 * The state layer has no dedicated hint-level API, and it is not mine to extend. So the
 * rung lives in the notes table under a scope of its own: one row per new high-water mark,
 * read back newest-first and reduced to a maximum. notesFor() is keyed by (scope, targetId),
 * so nothing else can surface these rows in a list of real notes.
 *
 * A module-level cache with a subscription, rather than per-component fetching: the ladder
 * and the log both mount on the same page and must read the same number.
 */
export const HINT_SCOPE = 'practice.hint-level';

export interface PracticeRecord {
  /** highest rung ever revealed here. Hiding the text again does not lower it. */
  level: number;
  /** newest first, exactly as the store returns them */
  attempts: AttemptRow[];
  loaded: boolean;
  /** a read or write did not reach the store. Shown in words, never swallowed. */
  failed: boolean;
}

const BLANK: PracticeRecord = { level: 0, attempts: [], loaded: false, failed: false };

const cache = new Map<string, PracticeRecord>();
const listeners = new Set<() => void>();
const loading = new Set<string>();

function emit() {
  for (const fn of listeners) fn();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

function put(id: string, patch: Partial<PracticeRecord>) {
  cache.set(id, { ...(cache.get(id) ?? BLANK), ...patch });
  emit();
}

async function load(id: string) {
  if (cache.get(id)?.loaded || loading.has(id)) return;
  loading.add(id);
  try {
    const [notes, attempts] = await Promise.all([
      store.notesFor(HINT_SCOPE, id),
      store.attemptsFor(id),
    ]);
    const level = notes.reduce((n, r) => Math.max(n, Number.parseInt(r.body, 10) || 0), 0);
    put(id, { level, attempts, loaded: true, failed: false });
  } catch {
    // loaded stays true so the UI stops saying "checking" and starts saying "could not read"
    put(id, { loaded: true, failed: true });
  } finally {
    loading.delete(id);
  }
}

export function usePracticeRecord(practiceId: string) {
  const record = useSyncExternalStore(
    subscribe,
    () => cache.get(practiceId) ?? BLANK,
    () => BLANK,
  );

  useEffect(() => { void load(practiceId); }, [practiceId]);

  /** Take one more rung. Optimistic: the text is on screen either way, the record may fail. */
  const revealNext = useCallback(async (rungs: number) => {
    const current = cache.get(practiceId) ?? BLANK;
    if (current.level >= rungs) return;
    const level = current.level + 1;
    put(practiceId, { level, failed: false });
    try {
      await store.addNote(HINT_SCOPE, practiceId, String(level));
    } catch {
      put(practiceId, { failed: true });
    }
  }, [practiceId]);

  /**
   * Write one attempt. hintsUsed is the rung count at this moment, so the ladder and the log can
   * never tell different stories. `output` is the runner's own summary when a check produced this
   * attempt, and absent when you reported it yourself — the row is the same shape either way.
   */
  const logAttempt = useCallback(async (passed: boolean, output?: string) => {
    const current = cache.get(practiceId) ?? BLANK;
    try {
      await store.recordAttempt(practiceId, passed, current.level, output);
      put(practiceId, { attempts: await store.attemptsFor(practiceId), failed: false });
    } catch {
      put(practiceId, { failed: true });
    }
  }, [practiceId]);

  return { ...record, revealNext, logAttempt };
}

/** Durability is a property of the store, not of the screen. Read once, worded per surface. */
export const RECORD_IS_DURABLE = store.durable;

export function whenLong(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}
