import 'server-only';
import { graph, hrefForConcept, lessonHref } from './load';
import { getLessonBody } from './body';

/**
 * What a lesson is standing on, and what would open it.
 *
 * The rule, in one line: a lesson opens once every lesson that teaches one of its assumed
 * concepts is complete. A lesson is complete once every concept its inline checks name has been
 * graded — any rating. The act is the signal; how well it went is the scheduler's business, so
 * nothing here can be failed, and the gate is monotone: once open, always open.
 *
 * Three deliberate properties:
 *
 *  - It gates on `assumes`, never on `softAssumes`. A softAssumes edge points forward in reading
 *    order, so gating on it would lock a lesson behind content up to 154 lessons downstream of
 *    itself. Lint rules R10 and R12 are what keep the two fields honest.
 *
 *  - It requires the teaching LESSON to be complete, not the assumed concept itself to have been
 *    answered. Only 648 of 1,490 concepts are named by a check, so keying on the concept would
 *    lock you out of anything whose prerequisite happens not to be check-covered.
 *
 *  - It is one level deep, not a transitive closure. If the lesson teaching your prerequisite is
 *    itself locked, its own gate says so when you get there. A closure would hand you a list of
 *    twenty things and no first move; one level always names exactly the next move.
 *
 * Measured over the whole corpus: 17 lessons open at a cold start, all 635 reachable in 3 rounds,
 * 0 permanently locked, and the median locked lesson sits behind 27 upstream lessons.
 */

export interface GateBlocker {
  /** the assumed concept that is not yet earned */
  conceptId: string;
  conceptTitle: string;
  conceptHref: string | null;
  /** the lesson that teaches it — the one thing to go and read */
  lessonId: string;
  lessonTitle: string;
  lessonHref: string | null;
  /** concepts whose checks that lesson asks you to grade; all must be answered */
  keyConcepts: string[];
}

export interface Gate {
  /** every concept id whose state the client must read to decide this lesson is open */
  watch: string[];
  blockers: GateBlocker[];
}

const cache = new Map<string, Gate>();

export function gateFor(lessonId: string): Gate {
  const hit = cache.get(lessonId);
  if (hit) return hit;

  const g = graph();
  const found = g.lessonById.get(lessonId);
  const assumes = found?.lesson.assumes ?? [];

  const blockers: GateBlocker[] = [];
  const watch = new Set<string>();

  for (const conceptId of assumes) {
    const teacher = g.conceptLesson.get(conceptId);
    // A concept no lesson teaches cannot gate anything — R9 reports it as a coverage gap instead
    // of it becoming a door with no key.
    if (!teacher || teacher === lessonId) continue;
    const teaching = g.lessonById.get(teacher);
    if (!teaching) continue;

    const keyConcepts = getLessonBody(teacher)?.checkConcepts ?? [];
    if (keyConcepts.length === 0) continue;
    for (const k of keyConcepts) watch.add(k);

    blockers.push({
      conceptId,
      conceptTitle: g.conceptById.get(conceptId)?.title ?? conceptId,
      conceptHref: hrefForConcept(conceptId),
      lessonId: teacher,
      lessonTitle: teaching.lesson.title,
      lessonHref: lessonHref(teacher),
      keyConcepts,
    });
  }

  // One row per blocking lesson, not per assumed concept: two prerequisites taught by the same
  // lesson are one thing to go and read, and saying it twice makes the gate look bigger than it is.
  const byLesson = new Map<string, GateBlocker>();
  for (const b of blockers) if (!byLesson.has(b.lessonId)) byLesson.set(b.lessonId, b);

  const gate: Gate = { watch: [...watch], blockers: [...byLesson.values()] };
  cache.set(lessonId, gate);
  return gate;
}

/** Concepts whose grading marks THIS lesson complete — what it contributes downstream. */
export function keyConceptsOf(lessonId: string): string[] {
  return getLessonBody(lessonId)?.checkConcepts ?? [];
}
