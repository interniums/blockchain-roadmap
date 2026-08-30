import fs from 'node:fs';
import path from 'node:path';
import { load as parseYaml } from 'js-yaml';
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
  /**
   * conceptId -> the single lesson that teaches it. This is the canonical-parent rule, and it is
   * derived rather than authored: all 1,490 concepts are taught by exactly one lesson, which lint
   * rule R9 enforces. A concept therefore has one address in the tree without anyone hand-writing
   * a second source of truth that could drift from `teaches`.
   */
  conceptLesson: Map<string, string>;
  /**
   * practiceId -> the lessons it actually covers, in reading order.
   *
   * Derived, never authored: a practice already names its concepts, and a lesson already names what
   * it teaches, so the span is the intersection. Measured across the 236: 22 practices span one
   * lesson, 106 span two, 87 three, 20 four, 1 five — mean 2.4, and none spans zero.
   *
   * Deliberately NOT a lesson range. 90 of the 192 multi-lesson spans are non-contiguous, so any
   * definition based on order would either mis-attribute a practice or silently drop lessons out of
   * the middle of it.
   */
  practiceLessons: Map<string, string[]>;
  /** the reverse: lessonId -> practices whose span includes it */
  lessonPractices: Map<string, string[]>;
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
  // `Lesson.status` used to be patched here from what was on disk, because the YAML said
  // `outlined` for all 635 lessons that in fact have prose. Nothing renders authoring status any
  // more, so the patch — and the drift it papered over — is gone with it.
  for (const m of modules) {
    for (const l of m.lessons ?? []) {
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

  const conceptLesson = new Map<string, string>();
  for (const [conceptId, ls] of lessonsByConcept) if (ls.length) conceptLesson.set(conceptId, ls[0]);

  const practiceLessons = new Map<string, string[]>();
  const lessonPractices = new Map<string, string[]>();
  for (const p of practices) {
    const mod = moduleById.get(p.moduleId);
    if (!mod) continue;
    const named = new Set(p.concepts ?? []);
    const span = [...(mod.lessons ?? [])]
      .sort((a, b) => a.order - b.order)
      .filter((l) => (l.teaches ?? []).some((c) => named.has(c)))
      .map((l) => l.id);
    practiceLessons.set(p.id, span);
    for (const lessonId of span) {
      lessonPractices.set(lessonId, [...(lessonPractices.get(lessonId) ?? []), p.id]);
    }
  }

  cache = {
    tracks, trackById, moduleById, modulesByTrack, conceptById, conceptHome,
    sourceById, aliasOf, practiceById, practicesByModule, lessonById, requiredBy, lessonsByConcept,
    conceptLesson, practiceLessons, lessonPractices,
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

/** The lessons a practice covers — its grain, measured rather than declared. */
export const lessonsOfPractice = (practiceId: string) => graph().practiceLessons.get(practiceId) ?? [];

/**
 * The practices that cover a lesson, narrowest grain first.
 *
 * This is what the end of a lesson points at: the exercise over the mechanism you have just read,
 * not the module's whole list fanned onto every lesson in it — which is what the old page did, up
 * to 23 of them on one lesson.
 */
export function practicesForLesson(practiceId: string): Practice[] {
  const g = graph();
  const RANK = { block: 0, module: 1, exit: 2, check: -1 } as const;
  return (g.lessonPractices.get(practiceId) ?? [])
    .map((id) => g.practiceById.get(id))
    .filter((p): p is Practice => Boolean(p))
    .sort((a, b) =>
      (RANK[a.grain ?? 'block'] - RANK[b.grain ?? 'block'])
      || (a.difficulty ?? 0) - (b.difficulty ?? 0)
      || a.id.localeCompare(b.id));
}

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

/**
 * ---- addresses ------------------------------------------------------------------------------
 *
 * One tree, one address per entity. Every link goes through these: 36 call sites used to build
 * `/c/${id}` and `/p/${id}` by hand, and none of them should re-derive a parent chain.
 *
 * The static `c` and `p` segments are load-bearing. Next's route sorter refuses two different
 * slug names at the same path depth, so `…/[lesson]/[concept]` could not coexist with a sibling
 * `…/[lesson]/[practice]`; and no track, module or lesson id equals `c` or `p`, so a static
 * segment cannot shadow a real node.
 */

export function lessonHref(lessonId: string): string | null {
  const found = graph().lessonById.get(lessonId);
  return found ? `/t/${found.trackId}/${found.moduleId}/${lessonId}` : null;
}

/** A concept lives under the lesson that teaches it. Retired ids resolve first. */
export function hrefForConcept(rawId: string): string | null {
  const id = resolveConceptId(rawId);
  if (!id) return null;
  const lessonId = graph().conceptLesson.get(id);
  if (!lessonId) return null;
  const under = lessonHref(lessonId);
  return under ? `${under}/c/${id}` : null;
}

/**
 * A practice lives under what it exercises, and its depth IS its grain: a block exercise and a
 * module capstone sit under the module, a track exit project under the track.
 *
 * This is the canonical address. `/t/[track]/p/[practice]` exists as a real route so an exit
 * project can be linked at track depth, and it resolves back to here.
 */
export function hrefForPractice(practiceId: string): string | null {
  const g = graph();
  const p = g.practiceById.get(practiceId);
  if (!p) return null;
  // An exit project closes out a track, so it is addressed at track depth. Everything else is
  // authored against a module and lives under it.
  if (p.grain === 'exit' && p.trackId) return `/t/${p.trackId}/p/${p.id}`;
  const mod = g.moduleById.get(p.moduleId);
  if (!mod) return null;
  return `/t/${mod.trackId}/${mod.id}/p/${p.id}`;
}

/** The exit project of a core track, if one is authored. Electives deliberately have none. */
export function exitProjectOf(trackId: string): Practice | undefined {
  for (const [, p] of graph().practiceById) {
    if (p.grain === 'exit' && p.trackId === trackId) return p;
  }
  return undefined;
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

/**
 * The breadcrumb IS the URL, segment for segment. Every entity type is reachable here, so no page
 * has to append a leaf whose href is not a child of the ladder above it — which is what the
 * concept and practice screens used to do.
 *
 * Pass the deepest thing you have; the parents are derived. A concept or practice id resolves its
 * own ancestry, so callers never assemble a chain by hand.
 */
export function crumbsFor(opts: {
  trackId?: string; moduleId?: string; lessonId?: string;
  conceptId?: string; practiceId?: string;
}): Crumb[] {
  const g = graph();

  // Derive the ancestry of a leaf that knows its own parents.
  let { trackId, moduleId, lessonId } = opts;
  if (opts.conceptId) {
    const cid = resolveConceptId(opts.conceptId);
    const under = cid ? g.conceptLesson.get(cid) : undefined;
    const found = under ? g.lessonById.get(under) : undefined;
    if (found) { trackId = found.trackId; moduleId = found.moduleId; lessonId = found.lesson.id; }
  } else if (opts.practiceId) {
    const p = g.practiceById.get(opts.practiceId);
    const mod = p ? g.moduleById.get(p.moduleId) : undefined;
    if (mod) {
      trackId = mod.trackId;
      // An exit project spans the whole track, so putting its host module in the ladder would say
      // it belongs to that module. It does not; it is the thing that comes after all of them.
      moduleId = p?.grain === 'exit' ? undefined : mod.id;
    }
  }

  const out: Crumb[] = [{ href: '/', label: 'Curriculum' }];
  const t = trackId ? g.trackById.get(trackId) : undefined;
  if (t) out.push({ href: `/t/${t.id}`, label: t.title });
  const m = moduleId ? g.moduleById.get(moduleId) : undefined;
  if (m && t) out.push({ href: `/t/${t.id}/${m.id}`, label: m.title });
  const l = lessonId ? g.lessonById.get(lessonId) : undefined;
  if (l && m && t) out.push({ href: `/t/${t.id}/${m.id}/${l.lesson.id}`, label: l.lesson.title });

  if (opts.conceptId) {
    const cid = resolveConceptId(opts.conceptId);
    const c = cid ? g.conceptById.get(cid) : undefined;
    const href = cid ? hrefForConcept(cid) : null;
    if (c && href) out.push({ href, label: c.title });
  } else if (opts.practiceId) {
    const p = g.practiceById.get(opts.practiceId);
    const href = hrefForPractice(opts.practiceId);
    if (p && href) out.push({ href, label: p.title });
  }
  return out;
}

export function stats() {
  const g = graph();
  let lessons = 0;
  for (const m of g.moduleById.values()) lessons += (m.lessons ?? []).length;
  return {
    tracks: g.tracks.length,
    modules: g.moduleById.size,
    lessons,
    concepts: g.conceptById.size,
    practices: g.practiceById.size,
    sources: g.sourceById.size,
  };
}
