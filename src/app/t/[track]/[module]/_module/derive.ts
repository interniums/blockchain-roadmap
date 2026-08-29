import { getConcept } from '@/lib/content/load';
import type { Lesson, LessonStatus, Module } from '@/lib/content/types';

/** Lessons in authored order. The YAML is usually sorted already; do not trust it. */
export function orderedLessons(m: Module): Lesson[] {
  return [...(m.lessons ?? [])].sort((a, b) => a.order - b.order);
}

/** Everything this module claims to teach: module-level plus anything a lesson teaches. */
export function taughtHere(m: Module): Set<string> {
  const set = new Set<string>(m.teaches ?? []);
  for (const l of m.lessons ?? []) for (const c of l.teaches ?? []) set.add(c);
  return set;
}

/**
 * The prerequisite strip: every concept the lessons assume that this module does not
 * itself teach. Kept in first-encounter order — the order you meet them while reading.
 */
export function prereqIds(m: Module): string[] {
  const taught = taughtHere(m);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const l of orderedLessons(m)) {
    for (const c of l.assumes ?? []) {
      if (taught.has(c) || seen.has(c)) continue;
      seen.add(c);
      out.push(c);
    }
  }
  return out;
}

export interface PrereqRef {
  id: string;
  title: string;
  oneLine?: string;
  trackId: string;
  /** false when the id has no concept record — a content gap, shown rather than hidden. */
  resolved: boolean;
}

export function prereqRefs(m: Module): PrereqRef[] {
  return prereqIds(m).map((id) => {
    const c = getConcept(id);
    return {
      id,
      title: c?.title ?? id,
      oneLine: c?.oneLine,
      trackId: c?.trackId ?? '',
      resolved: Boolean(c),
    };
  });
}

/**
 * A concept as a row needs to travel to a client component, so it carries its resolved
 * title rather than an id the client would have to look up — the content API is server-only.
 */
export interface ConceptRef {
  id: string;
  title: string;
  oneLine?: string;
  /** false when nothing in the graph has this id — a content gap, shown rather than hidden. */
  resolved: boolean;
}

export function conceptRefs(ids: string[]): ConceptRef[] {
  return ids.map((id) => {
    const c = getConcept(id);
    return { id, title: c?.title ?? id, oneLine: c?.oneLine, resolved: Boolean(c) };
  });
}

/** A lesson flattened for the client: same reason — no getConcept() on the other side. */
export interface LessonRow {
  id: string;
  title: string;
  status: LessonStatus;
  teaches: ConceptRef[];
}

export function lessonRows(m: Module): LessonRow[] {
  return orderedLessons(m).map((l) => ({
    id: l.id,
    title: l.title,
    status: l.status,
    teaches: conceptRefs(l.teaches ?? []),
  }));
}

export interface ModuleTotals {
  lessons: number;
  written: number;
  concepts: number;
  /** module.teaches entries no lesson in this module actually teaches */
  unplacedConcepts: string[];
}

export function totals(m: Module): ModuleTotals {
  const lessons = orderedLessons(m);
  const byLesson = new Set<string>();
  for (const l of lessons) for (const c of l.teaches ?? []) byLesson.add(c);
  return {
    lessons: lessons.length,
    written: lessons.filter((l) => l.status !== 'outlined').length,
    concepts: (m.teaches ?? []).length,
    unplacedConcepts: (m.teaches ?? []).filter((c) => !byLesson.has(c)),
  };
}
