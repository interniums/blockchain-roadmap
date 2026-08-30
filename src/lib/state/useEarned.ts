'use client';

import { useEffect, useState } from 'react';
import { store } from './client';

/**
 * Which of these concepts you have answered at least once.
 *
 * One batched read for a whole screen. `null` means the read has not landed (or failed), and every
 * caller must treat that as "show it" rather than "hide it": a lesson you have earned must never
 * flash a lock at you, and the opposite error only means a locked lesson is briefly readable.
 *
 * `reps > 0` is the whole test. Nothing enters `review_state` except by being graded, so the
 * presence of a row IS the record — there is no separate "started but unproven" state to reason
 * about, and no threshold to tune.
 */
const NOTHING: Set<string> = new Set();

export function useEarned(conceptIds: string[]): Set<string> | null {
  const key = [...new Set(conceptIds)].sort().join('|');
  const [earned, setEarned] = useState<Set<string> | null>(null);

  useEffect(() => {
    if (!key) return;
    let live = true;
    store.masteryFor(key.split('|'))
      .then((rows) => {
        if (live) setEarned(new Set(rows.filter((r) => r.reps > 0).map((r) => r.conceptId)));
      })
      .catch(() => { if (live) setEarned(null); });
    return () => { live = false; };
  }, [key]);

  // Nothing to look up is answered during render, not by setting state inside the effect —
  // an empty watch list has a known answer and never needs to touch the store.
  return key ? earned : NOTHING;
}

/** True when every key concept of the blocking readings has been answered. Optimistic while null. */
export function isOpen(earned: Set<string> | null, watch: string[]): boolean {
  if (earned === null) return true;
  return watch.every((c) => earned.has(c));
}
