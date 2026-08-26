import { getModulesOf, getPracticesOf } from '@/lib/content/load';
import type { Module } from '@/lib/content/types';

export interface ModuleFigures {
  lessons: number;
  practices: number;
  concepts: number;
  readingMin: number;
  /** the module itself is a deliberate stub node, not a full treatment */
  isStub: boolean;
  /** lessons whose prose has been written */
  written: number;
}

export function moduleFigures(m: Module): ModuleFigures {
  const lessons = m.lessons ?? [];
  return {
    lessons: lessons.length,
    practices: getPracticesOf(m.id).length,
    concepts: (m.teaches ?? []).length,
    readingMin: lessons.reduce((sum, l) => sum + (l.readingMin ?? 0), 0),
    isStub: m.status === 'stub',
    written: lessons.filter((l) => l.status !== 'outlined').length,
  };
}

export interface TrackFigures {
  modules: number;
  lessons: number;
  practices: number;
  concepts: number;
  readingMin: number;
  written: number;
  stubModules: number;
}

export function trackFigures(trackId: string): TrackFigures {
  const modules = getModulesOf(trackId);
  const acc: TrackFigures = {
    modules: modules.length,
    lessons: 0,
    practices: 0,
    concepts: 0,
    readingMin: 0,
    written: 0,
    stubModules: 0,
  };
  for (const m of modules) {
    const f = moduleFigures(m);
    acc.lessons += f.lessons;
    acc.practices += f.practices;
    acc.concepts += f.concepts;
    acc.readingMin += f.readingMin;
    acc.written += f.written;
    if (f.isStub) acc.stubModules += 1;
  }
  return acc;
}

export function hoursMinutes(total: number): string {
  if (!Number.isFinite(total) || total <= 0) return 'not estimated';
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (!h) return `${m} min`;
  if (!m) return `${h} h`;
  return `${h} h ${m} min`;
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}
