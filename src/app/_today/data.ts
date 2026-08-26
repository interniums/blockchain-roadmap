/**
 * Today's data provider. Server-only: it reads the content graph off disk.
 *
 * Everything here is either derived from real content or an honest empty value.
 * Nothing is invented, and nothing pretends to be progress.
 *
 * The server cannot see your record — in web mode it lives in a browser, and even locally
 * the house rule is that state is read from a client leaf. So `getTodayData()` returns the
 * content-derived baseline with `phase: 'pending'`, and `./resolve.ts` turns what the client
 * read out of the store into the same shapes. The exported helpers below are what both use.
 */

import {
  allTracks, crumbsFor, getConcept, getLesson, getModule, getModulesOf, getPracticesOf, getSource,
  getTrack, readingOrder, stats,
} from '@/lib/content/load';
import type { Volatility } from '@/lib/content/types';
import { MODE } from '@/lib/capabilities';
import type {
  ConceptRef, ContentHealth, ContinuePick, CurriculumState, ProgressStore, TodayData,
} from './model';

/** §12: past verifiedAt + window, a source is on the freshness board. */
const REVERIFY_DAYS: Record<Volatility, number> = { stable: 365, evolving: 120, hot: 45 };
const DAY_MS = 86_400_000;

/** Accepts a full ISO day only. "2026" and "2026-07" are publication dates, not verification stamps. */
function parseDay(value?: string): number | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const t = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(t) ? null : t;
}

export function isoDay(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

function conceptRef(id: string): ConceptRef {
  const c = getConcept(id);
  return { id, title: c?.title ?? id, href: `/c/${id}` };
}

/** Walks every concept exactly once. Module.teaches is the authoritative enumeration. */
function eachConcept(visit: (id: string) => void): void {
  const seen = new Set<string>();
  for (const track of allTracks()) {
    for (const mod of getModulesOf(track.id)) {
      for (const id of mod.teaches ?? []) {
        if (seen.has(id)) continue;
        seen.add(id);
        visit(id);
      }
    }
  }
}

/**
 * Real staleness, computed from the graph: a source inherits the tightest re-verify
 * window of any concept citing it. Today that count is zero and the page says zero,
 * with the date the first source falls due — which is the useful part.
 */
export function contentHealth(now: number): ContentHealth {
  const windowBySource = new Map<string, number>();
  let needsSource = 0;

  eachConcept((id) => {
    const c = getConcept(id);
    if (!c) return;
    if (c.needsSource) needsSource += 1;
    const days = REVERIFY_DAYS[c.volatility ?? 'stable'];
    for (const sid of c.sources ?? []) {
      const current = windowBySource.get(sid);
      if (current === undefined || days < current) windowBySource.set(sid, days);
    }
  });

  let stale = 0;
  let unstamped = 0;
  let nextDue: number | null = null;

  for (const [sid, days] of windowBySource) {
    const source = getSource(sid);
    const stamped = parseDay(source?.verifiedAt) ?? parseDay(source?.retrievedAt);
    if (!source || stamped === null) { unstamped += 1; continue; }
    const due = stamped + days * DAY_MS;
    if (due <= now) stale += 1;
    else if (nextDue === null || due < nextDue) nextDue = due;
  }

  return {
    stale,
    tracked: windowBySource.size,
    unstamped,
    nextDueAt: nextDue === null ? null : isoDay(nextDue),
    needsSource,
    checkedAt: isoDay(now),
  };
}

export function curriculum(): CurriculumState {
  const s = stats();
  let written = 0;
  for (const { lessonId } of readingOrder()) {
    if (getLesson(lessonId)?.lesson.status !== 'outlined') written += 1;
  }
  return { ...s, written };
}

/** Local runs keep progress in SQLite; the hosted copy keeps it in one browser and says so. */
export const progressStore: ProgressStore = MODE === 'web' ? 'device' : 'local';

/**
 * Turn a lesson id into the full Continue card. Shared by the no-state baseline and by the
 * resolver that answers the client — so a resume point and a cold start render identically.
 */
export function buildPick(
  lessonId: string,
  basis: 'start' | 'resume',
  resumeNote?: string,
): ContinuePick | null {
  const order = readingOrder();
  const index = order.findIndex((x) => x.lessonId === lessonId);
  if (index < 0) return null;

  const at = order[index];
  const found = getLesson(at.lessonId);
  const mod = getModule(at.moduleId);
  const track = getTrack(at.trackId);
  if (!found || !mod || !track) return null;

  const { lesson } = found;
  return {
    href: `/t/${track.id}/${mod.id}/${lesson.id}`,
    lessonId: lesson.id,
    moduleId: mod.id,
    trackId: track.id,
    lessonTitle: lesson.title,
    moduleTitle: mod.title,
    trackTitle: track.title,
    crumbs: crumbsFor({ trackId: track.id, moduleId: mod.id, lessonId: lesson.id }),
    readingMin: lesson.readingMin,
    status: lesson.status,
    teaches: (lesson.teaches ?? []).map(conceptRef),
    assumes: (lesson.assumes ?? []).map(conceptRef),
    practices: getPracticesOf(mod.id).map((p) => ({
      id: p.id, title: p.title, kind: p.kind, href: `/p/${p.id}`,
    })),
    basis,
    resumeNote,
    position: index + 1,
    total: order.length,
  };
}

/** The cold start: first thing in reading order, and the card says so rather than implying a resume. */
export function firstInOrder(): ContinuePick | null {
  const first = readingOrder()[0];
  return first ? buildPick(first.lessonId, 'start') : null;
}

/**
 * The first lesson in reading order the learner has not finished, skipping a set of known-read
 * ids. `readIds` only covers the recent window the store handed us, so this is "first unread as
 * far as we can tell" — which is exactly what it is used for and never overstated to the reader.
 */
export function firstUnreadId(readIds: Set<string>): string | null {
  for (const { lessonId } of readingOrder()) {
    if (!readIds.has(lessonId)) return lessonId;
  }
  return null;
}

/** The lesson that follows `lessonId` in reading order, skipping anything already finished. */
export function nextUnreadAfter(lessonId: string, readIds: Set<string>): string | null {
  const order = readingOrder();
  const index = order.findIndex((x) => x.lessonId === lessonId);
  if (index < 0) return null;
  for (let i = index + 1; i < order.length; i += 1) {
    if (!readIds.has(order[i].lessonId)) return order[i].lessonId;
  }
  return null;
}

export function getTodayData(now: number = Date.now()): TodayData {
  const health = contentHealth(now);
  const c = curriculum();

  return {
    progressStore,
    // The server render is the honest "we have not looked yet" state. A client leaf reads the
    // store after mount and replaces every count below; until then the cards say so in words.
    phase: 'pending',
    next: firstInOrder(),
    review: { due: 0, nextDueAt: null, nextDueIsToday: false, seen: 0, pool: c.concepts },
    // Track exit projects are an authored instrument (§10); no project exists in content yet.
    project: { active: null, tracksWithExit: allTracks().filter((t) => (t.capabilities?.length ?? 0) > 0).length },
    questions: { open: 0, items: [], oldestAgeDays: null },
    health,
    trail: [],
    curriculum: c,
  };
}
