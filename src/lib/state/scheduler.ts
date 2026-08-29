import { fsrs, createEmptyCard, generatorParameters, Rating, type Card, type Grade } from 'ts-fsrs';

export type ConceptState = {
  conceptId: string;
  due: Date; stability: number; difficulty: number;
  elapsedDays: number; scheduledDays: number;
  reps: number; lapses: number; learningSteps: number;
  state: number; lastReview?: Date;
  creditedStability: number;
};

const f = fsrs(generatorParameters({ enable_fuzz: false }));

export function emptyState(conceptId: string, now: Date): ConceptState {
  const c = createEmptyCard(now);
  return { conceptId, ...toState(c), creditedStability: 0 };
}

function toState(c: Card) {
  return {
    due: c.due, stability: c.stability, difficulty: c.difficulty,
    elapsedDays: c.elapsed_days, scheduledDays: c.scheduled_days,
    reps: c.reps, lapses: c.lapses, learningSteps: c.learning_steps ?? 0,
    state: c.state as number, lastReview: c.last_review,
  };
}
function toCard(s: ConceptState): Card {
  return {
    due: s.due, stability: s.stability, difficulty: s.difficulty,
    elapsed_days: s.elapsedDays, scheduled_days: s.scheduledDays,
    reps: s.reps, lapses: s.lapses, learning_steps: s.learningSteps,
    state: s.state, last_review: s.lastReview,
  } as Card;
}

/**
 * Probability you would retrieve this right now, 0-1. This is what orders the queue: the softest
 * memory comes first. It replaces a `due <= now` cutoff, which manufactured both a backlog and a
 * forward appointment — neither of which this product is willing to show you.
 */
export function retrievability(s: ConceptState, now: Date): number {
  if (s.reps === 0) return 0;
  return f.get_retrievability(toCard(s), now, false);
}

/** A direct review: full FSRS update. */
export function review(s: ConceptState, rating: Grade, now: Date): ConceptState {
  const next = f.next(toCard(s), now, rating);
  return { ...s, ...toState(next.card) };
}

/**
 * Fractional implicit repetition (Math Academy's mechanism, adapted).
 *
 * Reviewing an advanced concept IS practice of its prerequisites, so those ancestors get a
 * discounted credit that pushes their next review out — without counting as a full repetition.
 * With ~1,500 concepts this is what keeps the daily queue survivable: advanced work reviews
 * the foundations for free.
 *
 * Deliberate properties:
 *  - reps is NOT incremented. This was never a real retrieval of the ancestor.
 *  - only a passing grade credits. Failing an advanced concept says nothing good about its prereqs.
 *  - credit decays with graph distance, and never exceeds a full review's effect.
 */
export const CREDIT_DECAY = 0.5;
export const MAX_CREDIT_DEPTH = 2;

export function creditFactor(depth: number, rating: Grade): number {
  if (rating === Rating.Again) return 0;
  const gradeWeight = rating === Rating.Easy ? 1 : rating === Rating.Good ? 0.8 : 0.4;
  return Math.pow(CREDIT_DECAY, depth) * gradeWeight;
}

export function applyCredit(s: ConceptState, depth: number, rating: Grade, now: Date): ConceptState {
  const factor = creditFactor(depth, rating);
  if (factor <= 0 || s.reps === 0) return s;   // never credit a concept never studied
  const gained = s.stability * factor;
  const stability = s.stability + gained;
  const pushMs = gained * 24 * 60 * 60 * 1000;
  const due = new Date(Math.max(s.due.getTime(), now.getTime()) + pushMs);
  return { ...s, stability, due, creditedStability: s.creditedStability + gained };
}

/** Ancestors reachable by requires|deepens, with their depth, capped at MAX_CREDIT_DEPTH. */
export function ancestorsWithDepth(
  conceptId: string,
  edgesOf: (id: string) => { to: string; type: string }[],
  maxDepth = MAX_CREDIT_DEPTH,
): Map<string, number> {
  const out = new Map<string, number>();
  let frontier = [conceptId];
  const seen = new Set([conceptId]);
  for (let depth = 1; depth <= maxDepth; depth++) {
    const next: string[] = [];
    for (const id of frontier) {
      for (const e of edgesOf(id)) {
        if (e.type !== 'requires' && e.type !== 'deepens') continue;
        if (seen.has(e.to)) continue;
        seen.add(e.to);
        out.set(e.to, depth);
        next.push(e.to);
      }
    }
    frontier = next;
    if (!frontier.length) break;
  }
  return out;
}

export { Rating };
export type { Grade };
