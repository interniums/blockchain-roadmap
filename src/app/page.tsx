import type { Metadata } from 'next';
import { TrackRail } from '@/components/nav/TrackRail';
import { ContextRail } from './_today/ContextRail';
import { getTodayData } from './_today/data';
import { HealthCard } from './_today/HealthCard';
import {
  LiveContinueCard, LiveKeyboard, LiveProjectCard, LiveQuestionsCard, LiveRecentTrail,
  LiveReviewCard, LiveTrackRail, TodayState,
} from './_today/Live';

export const metadata: Metadata = {
  title: 'Today · Chainpath',
  description: 'One good next move, and an honest account of what is and is not built.',
};

/**
 * The front door — deliberately not the roadmap, which demands a decision before you have
 * had a thought. Answers one question: what is one good next move?
 *
 * This page stays a server component and renders the content-derived baseline: the first lesson
 * in reading order, real curriculum counts, real source freshness. `<TodayState>` is the single
 * client leaf; it reads the store after mount and republishes the four state-backed cards. Until
 * it answers, every one of them says it has not looked yet rather than showing a zero.
 *
 * Explicitly absent, per the plan: no streak, no goal ring, no "you haven't visited in N days".
 * Every count on this page is either computed from the content, read from your record, or a
 * labelled absence.
 */
export default function TodayPage() {
  const data = getTodayData();
  const pick = data.next;

  return (
    <TodayState baseline={data}>
      <div className="mx-auto flex w-full max-w-[1560px] items-start gap-8 px-6 py-8">
        {/* Left rail: the track the next move sits in, expanded to its position. It follows the
            resume point, so it is re-rendered when the store moves the pick off lesson 1. */}
        <LiveTrackRail
          fallback={
            pick
              ? <TrackRail trackId={pick.trackId} activeModuleId={pick.moduleId} activeLessonId={pick.lessonId} />
              : null
          }
        />

        <main className="min-w-0 flex-1">
          <header className="mb-6 max-w-[70ch]">
            <h1 className="text-[28px] font-semibold leading-tight">Today</h1>
            <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--color-ink-2)]">
              One good next move. The roadmap is one click away for when you want to survey instead.
            </p>
            <p className="mt-3 rounded border border-[var(--color-rule)] bg-[var(--color-surface-2)] p-3 text-[13px] leading-relaxed text-[var(--color-ink-2)]">
              <strong className="font-semibold text-[var(--color-ink)]">Where the build is.</strong>{' '}
              {data.curriculum.written === 0 ? (
                <>
                  All {data.curriculum.lessons.toLocaleString('en-GB')} lessons are outlined and none is
                  written: titles, concepts, prerequisites and reading times exist, the prose does not.
                </>
              ) : (
                <>
                  {data.curriculum.written.toLocaleString('en-GB')} of{' '}
                  {data.curriculum.lessons.toLocaleString('en-GB')} lessons are past outline; the rest open as
                  an outline rather than a reading.
                </>
              )}{' '}
              {data.progressStore === 'local' ? (
                <>
                  Your progress is kept on this machine and synced nowhere. Every count below is read back
                  from it — none of them is estimated, and a zero means your record says zero.
                </>
              ) : (
                <>
                  Your progress is kept in this browser and synced nowhere: another device starts from
                  scratch, and clearing the cache takes it with it. The cards repeat that where it matters.
                </>
              )}
            </p>
          </header>

          <div className="grid gap-4 lg:grid-cols-6">
            <LiveContinueCard className="lg:col-span-4" />
            <LiveReviewCard className="lg:col-span-2" />
            <LiveProjectCard project={data.project} className="lg:col-span-2" />
            <LiveQuestionsCard className="lg:col-span-2" />
            <HealthCard health={data.health} className="lg:col-span-2" />
            <LiveRecentTrail className="lg:col-span-6" />
          </div>

          {/* The rails are hidden on narrow desktops; the same facts stay reachable here. */}
          <div className="mt-6 lg:hidden">
            <ContextRail curriculum={data.curriculum} health={data.health} idPrefix="inline-rail" />
          </div>
        </main>

        <aside aria-label="Status" className="hidden w-[260px] shrink-0 lg:block">
          <div className="sticky top-8">
            <ContextRail curriculum={data.curriculum} health={data.health} idPrefix="side-rail" />
          </div>
        </aside>

        {/* J drops straight into the next lesson — the resume point once one is known. M and R are global. */}
        <LiveKeyboard />
      </div>
    </TodayState>
  );
}
