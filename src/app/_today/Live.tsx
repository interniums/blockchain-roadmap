'use client';

/**
 * The one client leaf on Today. Everything else on the page stays a server component.
 *
 * It reads the state store once on mount, hands what it got to `resolveToday` (which knows the
 * content graph and nothing about state), and republishes the result through context so each card
 * renders from the same snapshot and none of them can disagree with another.
 *
 * Three render phases, and the cards say which one they are in:
 *   pending      — the server render. Nobody has looked at your record yet.
 *   ready        — the store answered. Zeros here are real zeros.
 *   unavailable  — the read failed. Says so, in words, and keeps the content-derived fallback.
 */

import {
  createContext, useContext, useEffect, useState, type ReactNode,
} from 'react';
import { Keyboard } from '@/components/nav/Keyboard';
import { store } from '@/lib/state/client';
import type { LessonState } from '@/lib/state/store';
import { ContinueCard } from './ContinueCard';
import { plural } from './format';
import { ProjectCard } from './ProjectCard';
import { QuestionsCard } from './QuestionsCard';
import { RecentTrail } from './RecentTrail';
import { resolveToday } from './resolve';
import { ReviewCard } from './ReviewCard';
import type { LiveInput, ProjectState, TodayData } from './model';

const DAY_MS = 86_400_000;
/** Ten years out. `dueConcepts` is ordered by due date, so one row past every horizon is the next one. */
const HORIZON_DAYS = 3650;
/** The trail card shows five. */
const TRAIL_LIMIT = 5;
/**
 * How much recorded progress to reason over when working out what you have not finished.
 * The store only holds a row per lesson you actually touched, so in practice this is all of it —
 * and it has to be wider than the trail, or "the next lesson" can land on one you already read.
 */
const PROGRESS_WINDOW = 250;
/** The card shows three; asking for a few more costs nothing and keeps the count honest. */
const QUESTION_PREVIEW = 3;

interface TodayContext {
  data: TodayData;
  /** The track rail for the live pick, rendered server-side. Null until the store answers. */
  rail: ReactNode;
  /** Why the read failed, in the store's own words. Never swallowed. */
  error: string | null;
}

const Ctx = createContext<TodayContext | null>(null);

function useToday(): TodayContext {
  const value = useContext(Ctx);
  if (!value) throw new Error('Today cards must render inside <TodayState>.');
  return value;
}

function oldest(times: number[]): number | null {
  return times.reduce<number | null>((min, t) => (min === null || t < min ? t : min), null);
}

export function TodayState({ baseline, children }: { baseline: TodayData; children: ReactNode }) {
  const [ctx, setCtx] = useState<TodayContext>({ data: baseline, rail: null, error: null });

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const now = Date.now();
        const [progress, summary, open, earliest] = await Promise.all([
          store.recentTrail(PROGRESS_WINDOW),
          store.summary(),
          store.questions('open'),
          store.dueConcepts(now + HORIZON_DAYS * DAY_MS, 1),
        ]);

        // recentTrail gives the ordering; lessonState is the authority on where you got to in the
        // handful of lessons this page actually reports on.
        const shown = progress.slice(0, TRAIL_LIMIT);
        const states: LessonState[] = shown.length
          ? await store.lessonState(shown.map((r) => r.lessonId))
          : [];
        const byId = new Map(states.map((s) => [s.lessonId, s]));
        const rows = shown.map((r) => {
          const authoritative = byId.get(r.lessonId);
          return {
            lessonId: r.lessonId,
            status: authoritative?.status ?? r.status,
            scrollPct: authoritative?.scrollPct ?? r.scrollPct,
            at: r.lastOpenedAt,
          };
        });

        const input: LiveInput = {
          now,
          anchor: rows[0]
            ? { lessonId: rows[0].lessonId, status: rows[0].status, scrollPct: rows[0].scrollPct }
            : null,
          readIds: progress.filter((r) => r.status === 'read').map((r) => r.lessonId),
          trail: rows,
          questions: open.slice(0, QUESTION_PREVIEW).map((q) => ({
            id: q.id, text: q.text, conceptIds: q.conceptIds,
            raisedFrom: q.raisedFrom, raisedAt: q.raisedAt,
          })),
          openCount: open.length,
          oldestRaisedAt: oldest(open.map((q) => q.raisedAt)),
          review: {
            due: summary.dueCount,
            seen: summary.conceptsStudied,
            earliestDue: earliest[0]?.due ?? null,
          },
        };

        const live = await resolveToday(input);
        if (!alive) return;

        setCtx((current) => ({
          data: {
            ...current.data,
            phase: 'ready',
            next: live.pick,
            review: live.review,
            questions: live.questions,
            trail: live.trail,
          },
          rail: live.rail,
          error: null,
        }));
      } catch (e) {
        if (!alive) return;
        setCtx((current) => ({
          data: { ...current.data, phase: 'unavailable' },
          rail: null,
          error: e instanceof Error ? e.message : String(e),
        }));
      }
    })();

    return () => { alive = false; };
  }, []);

  const { data, error } = ctx;
  const announcement = data.phase === 'ready'
    ? [
      'Your record loaded.',
      `${data.review.due} ${plural(data.review.due, 'concept')} due,`,
      `${data.questions.open} open ${plural(data.questions.open, 'question')},`,
      `${data.trail.length} ${plural(data.trail.length, 'lesson')} in the recent trail.`,
    ].join(' ')
    : data.phase === 'unavailable'
      ? `Your recorded progress could not be read. ${error ?? ''}`
      : '';

  return (
    <Ctx.Provider value={ctx}>
      {children}
      <p aria-live="polite" className="sr-only">{announcement}</p>
    </Ctx.Provider>
  );
}

// ---- the cards, each reading the one snapshot -----------------------------------------

/**
 * The rail follows the resume point. Until the store answers it shows the rail the server
 * rendered for the cold-start lesson, which is what the page would show on a fresh install.
 */
export function LiveTrackRail({ fallback }: { fallback: ReactNode }) {
  const { data, rail } = useToday();
  const content = data.phase === 'ready' ? rail : fallback;
  if (!content) return null;
  return (
    <aside aria-label="Track contents" className="hidden w-[220px] shrink-0 xl:block">
      <div className="sticky top-8">{content}</div>
    </aside>
  );
}

export function LiveContinueCard({ className }: { className?: string }) {
  const { data } = useToday();
  return (
    <ContinueCard pick={data.next} store={data.progressStore} phase={data.phase} className={className} />
  );
}

export function LiveReviewCard({ className }: { className?: string }) {
  const { data } = useToday();
  return <ReviewCard review={data.review} phase={data.phase} className={className} />;
}

export function LiveQuestionsCard({ className }: { className?: string }) {
  const { data } = useToday();
  return <QuestionsCard questions={data.questions} phase={data.phase} className={className} />;
}

export function LiveRecentTrail({ className }: { className?: string }) {
  const { data } = useToday();
  return (
    <RecentTrail trail={data.trail} pick={data.next} phase={data.phase} className={className} />
  );
}

/** No state of its own — it just has to follow the pick, which moves once the store answers. */
export function LiveProjectCard({ project, className }: { project: ProjectState; className?: string }) {
  const { data } = useToday();
  return <ProjectCard project={project} pick={data.next} className={className} />;
}

/** J is "into the next lesson", so it has to mean the resume point once one is known. */
export function LiveKeyboard() {
  const { data } = useToday();
  return <Keyboard next={data.next?.href} />;
}
