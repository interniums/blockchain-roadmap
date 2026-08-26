import type { QuestionRow } from '@/lib/state/store';

/** A stored question plus the park overlay. */
export interface Row extends QuestionRow {
  parked: boolean;
}

export type QuestionState = 'open' | 'parked' | 'answered';
export type Filter = 'open' | 'parked' | 'answered' | 'all';
export type Sort = 'newest' | 'oldest';

export function stateOf(r: Row): QuestionState {
  if (r.status === 'answered') return 'answered';
  return r.parked ? 'parked' : 'open';
}

export function matches(r: Row, f: Filter): boolean {
  return f === 'all' || stateOf(r) === f;
}

/** The concept a question is filed under: the one it was captured against. */
export function primaryConcept(r: Row): string {
  return r.conceptIds[0] ?? '';
}

export interface Group {
  key: string;
  rows: Row[];
}

/**
 * Grouped by the concept the question was captured against, newest question first by default.
 * A question naming several concepts appears once, under the first; the rest ride along as
 * context on the card, because a question in two places is a question you answer twice.
 */
export function groupRows(rows: Row[], sort: Sort): Group[] {
  const dir = sort === 'newest' ? -1 : 1;
  const byKey = new Map<string, Row[]>();
  for (const r of rows) {
    const k = primaryConcept(r);
    const list = byKey.get(k) ?? [];
    list.push(r);
    byKey.set(k, list);
  }
  const groups: Group[] = [...byKey].map(([key, list]) => ({
    key,
    rows: [...list].sort((a, b) => (a.raisedAt - b.raisedAt) * dir),
  }));
  // Groups follow the same clock as the questions inside them.
  groups.sort((a, b) => (a.rows[0].raisedAt - b.rows[0].raisedAt) * dir);
  return groups;
}

export function counts(rows: Row[]) {
  let open = 0;
  let parked = 0;
  let answered = 0;
  let oldestOpen: number | null = null;
  for (const r of rows) {
    const s = stateOf(r);
    if (s === 'open') {
      open += 1;
      if (oldestOpen === null || r.raisedAt < oldestOpen) oldestOpen = r.raisedAt;
    } else if (s === 'parked') parked += 1;
    else answered += 1;
  }
  return { open, parked, answered, oldestOpen, total: rows.length };
}
