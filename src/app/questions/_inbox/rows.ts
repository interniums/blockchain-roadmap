import type { QuestionRow } from '@/lib/state/store';

/** A stored question plus the park overlay. */
export interface Row extends QuestionRow {
  parked: boolean;
}

export type QuestionState = 'open' | 'parked' | 'answered';
export type Filter = 'open' | 'parked' | 'answered' | 'all';

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
 * Grouped by the concept the question was captured against, and ordered by that concept — not by
 * when anything was asked. A question naming several concepts appears once, under the first; the
 * rest ride along as context on the card, because a question in two places is answered twice.
 *
 * The row order inside a group is stable insertion order, which happens to be newest-first from
 * the store. That is an implementation detail and is never labelled as a date.
 */
export function groupRows(rows: Row[]): Group[] {
  const byKey = new Map<string, Row[]>();
  for (const r of rows) {
    const k = primaryConcept(r);
    const list = byKey.get(k) ?? [];
    list.push(r);
    byKey.set(k, list);
  }
  const groups: Group[] = [...byKey].map(([key, list]) => ({ key, rows: list }));
  groups.sort((a, b) => a.key.localeCompare(b.key));
  return groups;
}

export function counts(rows: Row[]) {
  let open = 0;
  let parked = 0;
  let answered = 0;
  for (const r of rows) {
    const s = stateOf(r);
    if (s === 'open') open += 1;
    else if (s === 'parked') parked += 1;
    else answered += 1;
  }
  return { open, parked, answered, total: rows.length };
}
