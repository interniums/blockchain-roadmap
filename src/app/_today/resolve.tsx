'use server';

/**
 * The other half of Today's seam.
 *
 * State is read in a client leaf (house rule, and in web mode the server genuinely cannot see it).
 * The content graph is server-only. So the client sends the ids and counts the store gave it, and
 * this turns them into the exact shapes `./model.ts` describes — titles, hrefs, crumbs,
 * reading-order positions, the track rail — with no state access of any kind on this side.
 *
 * Nothing here invents a number. Every field traces back either to the content on disk or to a
 * value the store actually returned.
 */

import { TrackRail } from '@/components/nav/TrackRail';
import { getConcept, getLesson, getModule, getTrack, stats } from '@/lib/content/load';
import { buildPick, firstUnreadId, isoDay, nextUnreadAfter } from './data';
import type {
  ContinuePick, LiveInput, LiveToday, OpenQuestion, QuestionsState, ReviewState, TrailEntry,
} from './model';

const DAY_MS = 86_400_000;

/** scrollPct is written as a fraction; tolerate a percentage rather than reporting "4300% in". */
function asPercent(raw: number): number {
  const n = Number.isFinite(raw) ? raw : 0;
  const pct = n <= 1 ? n * 100 : n;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

function lessonHref(lessonId: string): string | null {
  const found = getLesson(lessonId);
  return found ? `/t/${found.trackId}/${found.moduleId}/${lessonId}` : null;
}

function whereItSits(lessonId: string): string {
  const found = getLesson(lessonId);
  if (!found) return 'No longer in the curriculum';
  const track = getTrack(found.trackId);
  const mod = getModule(found.moduleId);
  return [track?.title, mod?.title].filter(Boolean).join(' · ') || found.moduleId;
}

// ---- continue -----------------------------------------------------------------------

function resolvePick(input: LiveInput): ContinuePick | null {
  const readIds = new Set(input.readIds);
  const anchor = input.anchor;

  // Nothing was ever opened: the first thing in reading order, said as the cold start it is.
  if (!anchor) {
    const id = firstUnreadId(readIds);
    return id
      ? buildPick(id, 'start', 'Nothing is recorded yet, so this is the first lesson in reading order — not a resume point.')
      : null;
  }

  // A lesson left open: back to it, with how far in you got.
  if (anchor.status !== 'read') {
    const pct = asPercent(anchor.scrollPct);
    const pick = buildPick(
      anchor.lessonId,
      'resume',
      pct >= 2
        ? `You stopped about ${pct}% of the way through this one.`
        : 'You opened this one and did not finish it.',
    );
    if (pick) return pick;
  }

  // Finished it: the next thing you have not finished.
  const nextId = nextUnreadAfter(anchor.lessonId, readIds);
  if (nextId) {
    const previous = getLesson(anchor.lessonId)?.lesson.title;
    return buildPick(
      nextId,
      'resume',
      previous
        ? `You marked “${previous}” read, so this is the next lesson in reading order.`
        : 'This is the next lesson in reading order after the last one you read.',
    );
  }

  // Off the end of the curriculum: the earliest thing still unread, if there is one.
  const wrapId = firstUnreadId(readIds);
  if (wrapId && wrapId !== anchor.lessonId) {
    return buildPick(wrapId, 'resume', 'You have read everything after your last lesson. This is the earliest one you have not.');
  }

  return buildPick(
    anchor.lessonId,
    'resume',
    'This is the last lesson in reading order, and you have already marked it read.',
  );
}

// ---- review -------------------------------------------------------------------------

function resolveReview(input: LiveInput): ReviewState {
  const nextDueAt = input.review.earliestDue === null ? null : isoDay(input.review.earliestDue);
  return {
    due: input.review.due,
    seen: input.review.seen,
    nextDueAt,
    nextDueIsToday: nextDueAt !== null && nextDueAt === isoDay(input.now),
    pool: stats().concepts,
  };
}

// ---- questions ----------------------------------------------------------------------

function resolveQuestions(input: LiveInput): QuestionsState {
  const items: OpenQuestion[] = input.questions.map((q) => {
    const titles = q.conceptIds
      .map((id) => getConcept(id)?.title)
      .filter((t): t is string => Boolean(t));

    const raisedIn = q.raisedFrom ? getLesson(q.raisedFrom) : undefined;
    const raisedHref = q.raisedFrom
      ? lessonHref(q.raisedFrom) ?? (q.raisedFrom.startsWith('/') ? q.raisedFrom : null)
      : null;

    const context = titles.length > 0
      ? titles.slice(0, 2).join(', ') + (titles.length > 2 ? ` +${titles.length - 2} more` : '')
      : raisedIn
        ? `Raised in ${raisedIn.lesson.title}`
        : 'No concept attached';

    return {
      id: String(q.id),
      // The board is the fallback home; a lesson link is only offered when it actually resolves.
      href: raisedHref ?? '/questions',
      text: q.text,
      context,
      askedAt: isoDay(q.raisedAt),
      ageDays: Math.max(0, Math.floor((input.now - q.raisedAt) / DAY_MS)),
    };
  });

  return {
    open: input.openCount,
    items,
    oldestAgeDays: input.oldestRaisedAt === null
      ? null
      : Math.max(0, Math.floor((input.now - input.oldestRaisedAt) / DAY_MS)),
  };
}

// ---- trail --------------------------------------------------------------------------

function resolveTrail(input: LiveInput): TrailEntry[] {
  const out: TrailEntry[] = [];
  for (const row of input.trail) {
    const found = getLesson(row.lessonId);
    const href = lessonHref(row.lessonId);
    // A row for a lesson that has since left the content would be a fabricated entry. Drop it.
    if (!found || !href) continue;

    const pct = asPercent(row.scrollPct);
    out.push({
      href,
      label: found.lesson.title,
      context: whereItSits(row.lessonId),
      kind: 'lesson',
      at: new Date(row.at ?? input.now).toISOString(),
      note: row.status === 'read' ? 'read' : pct >= 2 ? `${pct}% in` : 'opened',
    });
  }
  return out;
}

// ---- the one call the client makes --------------------------------------------------

export async function resolveToday(input: LiveInput): Promise<LiveToday> {
  const pick = resolvePick(input);
  return {
    pick,
    review: resolveReview(input),
    questions: resolveQuestions(input),
    trail: resolveTrail(input),
    // Rendered here because the rail is built from the content graph and has to follow the pick.
    rail: pick
      ? <TrackRail trackId={pick.trackId} activeModuleId={pick.moduleId} activeLessonId={pick.lessonId} />
      : null,
  };
}
