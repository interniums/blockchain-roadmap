'use client';
/**
 * One batched read of the learner's record for every concept named on this page.
 *
 * The page is a server component; this is the client leaf that touches state. It is a
 * provider rather than a per-row fetch because a neighbourhood can name thirty concepts
 * and `masteryFor` already takes a list. A review recorded anywhere inside calls
 * `refresh()`, so prerequisite rows that just took credit stop showing a stale number.
 */
import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react';

import { store } from '@/lib/state/client';
import type { Mastery } from '@/lib/state/store';

export type ScopeStatus = 'loading' | 'ready' | 'error';

export interface MasteryScopeValue {
  status: ScopeStatus;
  /**
   * When the read landed. Every "due in 3 days" on this page is relative to this instant and
   * not to render time — the clock must not be read during render, and a due date that drifts
   * mid-render is worse than one anchored to a stated moment.
   */
  readAt: number;
  /** Undefined until the read lands. After that, always a row — the store fills blanks. */
  get(conceptId: string): Mastery | undefined;
  /** Titles are server data; the client never loads the content graph. */
  titleOf(conceptId: string): string | undefined;
  refresh(): void;
}

const Ctx = createContext<MasteryScopeValue | null>(null);

/** Null outside a scope. Callers render nothing rather than inventing a number. */
export function useMasteryScope(): MasteryScopeValue | null {
  return useContext(Ctx);
}

export function MasteryScope({
  ids, titles, children,
}: { ids: string[]; titles: Record<string, string>; children: ReactNode }) {
  // Serialised so a re-render with an equal-but-new array does not re-fetch.
  const key = ids.join('|');
  const [rows, setRows] = useState<Map<string, Mastery>>(() => new Map());
  const [status, setStatus] = useState<ScopeStatus>('loading');
  const [readAt, setReadAt] = useState(0);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    const list = key ? key.split('|') : [];
    store.masteryFor(list)
      .then((got) => {
        if (!alive) return;
        setRows(new Map(got.map((r) => [r.conceptId, r])));
        setReadAt(Date.now());
        setStatus('ready');
      })
      .catch(() => { if (alive) setStatus('error'); });
    return () => { alive = false; };
  }, [key, nonce]);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  const value = useMemo<MasteryScopeValue>(() => ({
    status,
    readAt,
    get: (id: string) => rows.get(id),
    titleOf: (id: string) => titles[id],
    refresh,
  }), [status, readAt, rows, titles, refresh]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
