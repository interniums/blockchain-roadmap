import fs from 'node:fs';
import path from 'node:path';
import { load as parseYaml } from 'js-yaml';
import { writtenLessonIds } from './body';
import type {
  Track, Module, Concept, Source, Practice, Lesson, ConceptView, Crumb, EdgeType,
} from './types';

const ROOT = path.join(process.cwd(), 'content');

function readDir<T>(dir: string): T[] {
  const p = path.join(ROOT, dir);
  if (!fs.existsSync(p)) return [];
  return fs.readdirSync(p)
    .filter((f) => f.endsWith('.yaml'))
    .map((f) => parseYaml(fs.readFileSync(path.join(p, f), 'utf8')) as T)
    .filter(Boolean);
}

export interface Graph {
  tracks: Track[];
  trackById: Map<string, Track>;
  moduleById: Map<string, Module>;
  modulesByTrack: Map<string, Module[]>;
  conceptById: Map<string, Concept>;
  conceptHome: Map<string, { moduleId: string; trackId: string }>;
  sourceById: Map<string, Source>;
  /** retired id -> live id. Lets stored state survive a rename or merge. */
  aliasOf: Map<string, string>;
  practiceById: Map<string, Practice>;
  practicesByModule: Map<string, Practice[]>;
  lessonById: Map<string, { lesson: Lesson; moduleId: string; trackId: string }>;
  /** reverse `requires` index */
  requiredBy: Map<string, string[]>;
  /** concepts taught by each lesson, reversed */
  lessonsByConcept: Map<string, string[]>;
}

let cache: Graph | null = null;

export function graph(): Graph {
  if (cache) return cache;

  const tracks = readDir<Track>('tracks').sort((a, b) => a.number - b.number);
  const modules = readDir<Module>('modules');
  const practices = readDir<Practice>('practices');
  const conceptFiles = readDir<{ moduleId: string; concepts: Concept[] }>('concepts');
  const sourceFiles = readDir<{ trackId: string; sources: Source[] }>('sources');

  const trackById = new Map(tracks.map((t) => [t.id, t]));
  const moduleById = new Map(modules.map((m) => [m.id, m]));

  const modulesByTrack = new Map<string, Module[]>();
  for (const m of modules) {
    const list = modulesByTrack.get(m.trackId) ?? [];
    list.push(m);
    modulesByTrack.set(m.trackId, list);
  }
  for (const [, list] of modulesByTrack) list.sort((a, b) => a.order - b.order);

  const conceptById = new Map<string, Concept>();
  const conceptHome = new Map<string, { moduleId: string; trackId: string }>();
  for (const f of conceptFiles) {
    const trackId = moduleById.get(f.moduleId)?.trackId ?? '';
    for (const c of f.concepts ?? []) {
      conceptById.set(c.id, c);
      conceptHome.set(c.id, { moduleId: f.moduleId, trackId });
    }
  }

  const aliasOf = new Map<string, string>();
  for (const [id, c] of conceptById) {
    for (const old of c.formerIds ?? []) aliasOf.set(old, id);
    for (const old of c.mergedFrom ?? []) aliasOf.set(old, id);
  }

  const sourceById = new Map<string, Source>();
  for (const f of sourceFiles) for (const s of f.sources ?? []) sourceById.set(s.id, s);

  const practiceById = new Map(practices.map((p) => [p.id, p]));
  const practicesByModule = new Map<string, Practice[]>();
  for (const p of practices) {
    const list = practicesByModule.get(p.moduleId) ?? [];
    list.push(p);
    practicesByModule.set(p.moduleId, list);
  }

  const lessonById = new Map<string, { lesson: Lesson; moduleId: string; trackId: string }>();
  const lessonsByConcept = new Map<string, string[]>();
  // Prose on disk is the truth. A lesson whose .mdx exists is at least 'drafted', whatever the YAML
  // says — otherwise status drifts the moment someone writes a lesson without editing two files.
  const written = writtenLessonIds();
  for (const m of modules) {
    for (const l of m.lessons ?? []) {
      if (written.has(l.id) && l.status === 'outlined') l.status = 'drafted';
      lessonById.set(l.id, { lesson: l, moduleId: m.id, trackId: m.trackId });
      for (const c of l.teaches ?? []) {
        const list = lessonsByConcept.get(c) ?? [];
        list.push(l.id);
        lessonsByConcept.set(c, list);
      }
    }
  }

  const requiredBy = new Map<string, string[]>();
  for (const [id, c] of conceptById) {
    for (const e of c.edges ?? []) {
      if (e.type !== 'requires') continue;
      const list = requiredBy.get(e.to) ?? [];
      list.push(id);
      requiredBy.set(e.to, list);
    }
  }

  cache = {
    tracks, trackById, moduleById, modulesByTrack, conceptById, conceptHome,
    sourceById, aliasOf, practiceById, practicesByModule, lessonById, requiredBy, lessonsByConcept,
  };
  return cache;
}

// ---- accessors ----

export const allTracks = () => graph().tracks;
export const getTrack = (id: string) => graph().trackById.get(id);
export const getModule = (id: string) => graph().moduleById.get(id);
export const getModulesOf = (trackId: string) => graph().modulesByTrack.get(trackId) ?? [];
export const getSource = (id: string) => graph().sourceById.get(id);
export const getPractice = (id: string) => graph().practiceById.get(id);
export const getPracticesOf = (moduleId: string) => graph().practicesByModule.get(moduleId) ?? [];
export const getLesson = (id: string) => graph().lessonById.get(id);

/** Resolve a possibly-retired concept id to the live one. Identity, not guesswork. */
export function resolveConceptId(id: string): string | undefined {
  const g = graph();
  if (g.conceptById.has(id)) return id;
  const live = g.aliasOf.get(id);
  return live && g.conceptById.has(live) ? live : undefined;
}

export function getConcept(rawId: string): ConceptView | undefined {
  const g = graph();
  const id = resolveConceptId(rawId);
  if (!id) return undefined;
  const c = g.conceptById.get(id);
  if (!c) return undefined;
  const home = g.conceptHome.get(id) ?? { moduleId: '', trackId: '' };
  const requires = (c.edges ?? []).filter((e) => e.type === 'requires').map((e) => e.to);
  const related = (c.edges ?? [])
    .filter((e) => e.type !== 'requires')
    .map((e) => ({ type: e.type as EdgeType, to: e.to }));
  return {
    ...c, ...home, requires,
    requiredBy: g.requiredBy.get(id) ?? [],
    related,
    lessons: g.lessonsByConcept.get(id) ?? [],
  };
}

/** Every lesson in reading order across the whole curriculum. Powers next/prev. */
export function readingOrder(): { lessonId: string; moduleId: string; trackId: string }[] {
  const g = graph();
  const out: { lessonId: string; moduleId: string; trackId: string }[] = [];
  for (const t of g.tracks) {
    for (const m of getModulesOf(t.id)) {
      for (const l of [...(m.lessons ?? [])].sort((a, b) => a.order - b.order)) {
        out.push({ lessonId: l.id, moduleId: m.id, trackId: t.id });
      }
    }
  }
  return out;
}

export function siblings(lessonId: string) {
  const order = readingOrder();
  const i = order.findIndex((x) => x.lessonId === lessonId);
  return { prev: i > 0 ? order[i - 1] : null, next: i >= 0 && i < order.length - 1 ? order[i + 1] : null };
}

export function crumbsFor(opts: { trackId?: string; moduleId?: string; lessonId?: string }): Crumb[] {
  const g = graph();
  const out: Crumb[] = [{ href: '/m', label: 'Roadmap' }];
  const t = opts.trackId ? g.trackById.get(opts.trackId) : undefined;
  if (t) out.push({ href: `/t/${t.id}`, label: t.title });
  const m = opts.moduleId ? g.moduleById.get(opts.moduleId) : undefined;
  if (m && t) out.push({ href: `/t/${t.id}/${m.id}`, label: m.title });
  if (opts.lessonId) {
    const l = g.lessonById.get(opts.lessonId);
    if (l && m && t) out.push({ href: `/t/${t.id}/${m.id}/${l.lesson.id}`, label: l.lesson.title });
  }
  return out;
}

export function stats() {
  const g = graph();
  let lessons = 0;
  let written = 0;
  for (const m of g.moduleById.values()) {
    for (const l of m.lessons ?? []) { lessons++; if (l.status !== 'outlined') written++; }
  }
  return {
    lessonsWritten: written,
    tracks: g.tracks.length,
    modules: g.moduleById.size,
    lessons,
    concepts: g.conceptById.size,
    practices: g.practiceById.size,
    sources: g.sourceById.size,
  };
}
