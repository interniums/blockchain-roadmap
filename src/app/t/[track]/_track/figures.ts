import { getModulesOf, getPracticesOf } from '@/lib/content/load';
import type { Module } from '@/lib/content/types';

export interface ModuleFigures {
  lessons: number;
  practices: number;
  concepts: number;
  /** the module itself is a deliberate stub node, not a full treatment */
  isStub: boolean;
}

export function moduleFigures(m: Module): ModuleFigures {
  const lessons = m.lessons ?? [];
  return {
    lessons: lessons.length,
    practices: getPracticesOf(m.id).length,
    concepts: (m.teaches ?? []).length,
    isStub: m.status === 'stub',
  };
}

export interface TrackFigures {
  modules: number;
  lessons: number;
  practices: number;
  concepts: number;
  stubModules: number;
}

export function trackFigures(trackId: string): TrackFigures {
  const modules = getModulesOf(trackId);
  const acc: TrackFigures = {
    modules: modules.length,
    lessons: 0,
    practices: 0,
    concepts: 0,
    stubModules: 0,
  };
  for (const m of modules) {
    const f = moduleFigures(m);
    acc.lessons += f.lessons;
    acc.practices += f.practices;
    acc.concepts += f.concepts;
    if (f.isStub) acc.stubModules += 1;
  }
  return acc;
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}
