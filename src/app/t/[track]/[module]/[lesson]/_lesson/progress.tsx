'use client';

import {
  createContext, useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { store } from '@/lib/state/client';
import type { LessonState } from '@/lib/state/store';

/**
 * One lesson's own learner state, shared by the header line and the end-of-lesson panel so the two
 * can never disagree. It owns exactly three writes:
 *
 *   markLessonOpened  — on mount, once
 *   setScroll         — throttled, plus a flush when the tab hides or the page unmounts
 *   markLessonRead    — the explicit action, which is what puts concepts into review unproven
 *
 * scrollPct is a FRACTION (0–1) — the column behind it is a `real`, and mastery is a fraction too.
 */

const FLUSH_MS = 2000;     // at most one scroll write every two seconds
const MIN_DELTA = 0.01;    // sub-1% movement is not worth a write
const RESTORE_MIN = 0.05;  // below this there is nothing worth restoring
const RESTORE_MAX = 0.97;  // past this you finished — a revisit starts at the top

export interface LessonProgressValue {
  lessonId: string;
  conceptIds: string[];
  /** true until the first read of stored state returns — never show a number before this clears */
  loading: boolean;
  /** null means the read failed or has not happened; it never means "zero progress" */
  state: LessonState | null;
  /** lastOpenedAt as it was BEFORE this visit. null = never opened before. */
  previouslyOpenedAt: number | null;
  /** set when this visit jumped you back to where you stopped */
  restoredPct: number | null;
  backToTop(): void;
  markRead(): Promise<void>;
  marking: boolean;
  /** last write/read failure, in words. Never swallowed. */
  error: string | null;
  /** false in the web copy: state lives in this browser only */
  durable: boolean;
}

const Ctx = createContext<LessonProgressValue | null>(null);

/** Returns null outside a provider so a consumer can say so instead of exploding. */
export function useLessonProgress(): LessonProgressValue | null {
  return useContext(Ctx);
}

function pctNow(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / max));
}

export function LessonProgressProvider({
  lessonId, conceptIds, contentHash, changeKind, children,
}: {
  lessonId: string;
  conceptIds: string[];
  /** sha of the prose, when this lesson has any. Absent for outline-only lessons. */
  contentHash?: string;
  changeKind?: 'cosmetic' | 'clarifying' | 'corrective';
  children: React.ReactNode;
}) {
  const [correction, setCorrection] = useState<string[] | null>(null);
  const [state, setState] = useState<LessonState | null>(null);
  const [loading, setLoading] = useState(true);
  const [previouslyOpenedAt, setPreviouslyOpenedAt] = useState<number | null>(null);
  const [restoredPct, setRestoredPct] = useState<number | null>(null);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readyRef = useRef(false);            // stored state is loaded: safe to persist scroll
  void correction;
  const savedRef = useRef(0);                // last pct actually written
  const pendingRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const conceptKey = conceptIds.join(',');

  // --- open: read what we had, then record the visit -------------------------------------------
  useEffect(() => {
    let alive = true;
    let restoreTimer: ReturnType<typeof setTimeout> | null = null;
    readyRef.current = false;

    (async () => {
      try {
        const [before] = await store.lessonState([lessonId]);
        if (!alive) return;
        setState(before);
        setPreviouslyOpenedAt(before.lastOpenedAt);
        savedRef.current = before.scrollPct;

        // Put the reader back where they stopped — unless an anchor asked for somewhere specific,
        // or they have already started scrolling themselves.
        if (
          !window.location.hash
          && before.scrollPct >= RESTORE_MIN
          && before.scrollPct <= RESTORE_MAX
        ) {
          // A timeout, not requestAnimationFrame: a lesson opened in a background tab is never
          // painted, and "where I stopped" should survive that.
          restoreTimer = setTimeout(() => {
            if (!alive || window.scrollY > 40) return;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            if (max <= 0) return;
            window.scrollTo({ top: Math.round(before.scrollPct * max) });
            setRestoredPct(before.scrollPct);
          }, 0);
        }

        await store.markLessonOpened(lessonId);
        // §17: if this lesson changed since you last saw it and the edit was corrective,
        // its concepts reset to unproven and re-queue — and you are told, never silently.
        if (contentHash) {
          const r = await store.reconcileContent(lessonId, contentHash, changeKind, conceptIds);
          if (r.reset.length) setCorrection(r.reset);
        }
        const [after] = await store.lessonState([lessonId]);
        if (!alive) return;
        setState(after);
        savedRef.current = after.scrollPct;
      } catch {
        if (alive) setError('Could not read your progress for this lesson. Nothing is being recorded.');
      } finally {
        if (alive) setLoading(false);
        readyRef.current = true;
      }
    })();

    return () => {
      alive = false;
      if (restoreTimer !== null) clearTimeout(restoreTimer);
    };
  }, [lessonId]);

  // --- scroll: throttled write, flushed on hide and on leaving ---------------------------------
  useEffect(() => {
    let alive = true;

    const flush = () => {
      if (timerRef.current !== null) { clearTimeout(timerRef.current); timerRef.current = null; }
      const pct = pendingRef.current;
      pendingRef.current = null;
      if (pct === null || !readyRef.current) return;
      if (Math.abs(pct - savedRef.current) < MIN_DELTA) return;
      savedRef.current = pct;
      void store.setScroll(lessonId, pct).catch(() => {});
      if (alive) setState((cur) => (cur ? { ...cur, scrollPct: pct } : cur));
    };

    const capture = () => {
      if (!readyRef.current) return;
      pendingRef.current = pctNow();
      if (timerRef.current === null) timerRef.current = setTimeout(flush, FLUSH_MS);
    };

    const onVisibility = () => { if (document.visibilityState === 'hidden') flush(); };

    window.addEventListener('scroll', capture, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', flush);

    return () => {
      window.removeEventListener('scroll', capture);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', flush);
      // Leaving the page is exactly when "where I stopped" is worth keeping.
      if (readyRef.current && pendingRef.current === null) pendingRef.current = pctNow();
      alive = false;
      flush();
    };
  }, [lessonId]);

  const backToTop = useCallback(() => {
    window.scrollTo({ top: 0 });
    setRestoredPct(null);
  }, []);

  const markRead = useCallback(async () => {
    setMarking(true);
    setError(null);
    try {
      const ids = conceptKey ? conceptKey.split(',') : [];
      await store.markLessonRead(lessonId, ids);
      const [after] = await store.lessonState([lessonId]);
      setState(after);
    } catch {
      setError('Could not record that. Nothing was saved — try again.');
    } finally {
      setMarking(false);
    }
  }, [lessonId, conceptKey]);

  const value: LessonProgressValue = {
    lessonId,
    conceptIds,
    loading,
    state,
    previouslyOpenedAt,
    restoredPct,
    backToTop,
    markRead,
    marking,
    error,
    durable: store.durable,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
