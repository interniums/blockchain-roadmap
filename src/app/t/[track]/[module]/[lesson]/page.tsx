import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumb } from '@/components/nav/Breadcrumb';
import { Keyboard } from '@/components/nav/Keyboard';
import { TrackRail } from '@/components/nav/TrackRail';
import {
  crumbsFor, getConcept, getLesson, getModule, getPracticesOf, getSource, getTrack,
  readingOrder, siblings,
} from '@/lib/content/load';
import type { ConceptView } from '@/lib/content/types';
import { StatusBadge } from './_lesson/bits';
import { ContextRail } from './_lesson/ContextRail';
import { LessonProgressProvider } from './_lesson/progress';
import { LessonStateLine } from './_lesson/LessonStateLine';
import { EndOfLesson } from './_lesson/EndOfLesson';
import { OutlineBody } from './_lesson/OutlineBody';
import { getLessonBody } from '@/lib/content/body';
import { LessonProse, ProvenanceStrip } from '@/components/lesson/LessonProse';
import { PrevNext, type Neighbour } from './_lesson/PrevNext';
import { PrereqStrip, UsedLaterStrip } from './_lesson/Strips';
import { conceptRef, groupByTrack, sourcesFor, usedLater } from './_lesson/graph';

type Params = { track: string; module: string; lesson: string };

export const dynamicParams = false;

/**
 * One page per lesson in the whole curriculum. If a parent segment also generates params, this runs
 * once per parent set and scopes itself to it; on its own it generates all of them.
 */
export function generateStaticParams(
  ctx?: { params?: Record<string, string | string[] | undefined> },
): Params[] {
  const only = (key: string) => {
    const v = ctx?.params?.[key];
    return typeof v === 'string' ? v : undefined;
  };
  const track = only('track');
  const mod = only('module');
  return readingOrder()
    .filter((x) => (!track || x.trackId === track) && (!mod || x.moduleId === mod))
    .map((x) => ({ track: x.trackId, module: x.moduleId, lesson: x.lessonId }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lesson: lessonId } = await params;
  const found = getLesson(lessonId);
  if (!found) return { title: 'Lesson not found · Chainpath' };
  const mod = getModule(found.moduleId);
  return {
    title: `${found.lesson.title} · Chainpath`,
    description: mod ? `${mod.title} — lesson outline (${found.lesson.status}).` : undefined,
  };
}

function neighbour(
  x: { lessonId: string; moduleId: string; trackId: string } | null,
  currentModuleId: string,
  currentTrackId: string,
): Neighbour | null {
  if (!x) return null;
  const found = getLesson(x.lessonId);
  if (!found) return null;
  return {
    href: `/t/${x.trackId}/${x.moduleId}/${x.lessonId}`,
    title: found.lesson.title,
    moduleTitle: getModule(x.moduleId)?.title ?? x.moduleId,
    trackTitle: getTrack(x.trackId)?.title ?? x.trackId,
    boundary: x.trackId !== currentTrackId ? 'track' : x.moduleId !== currentModuleId ? 'module' : null,
  };
}

export default async function LessonPage({ params }: { params: Promise<Params> }) {
  const { track: trackParam, module: moduleParam, lesson: lessonParam } = await params;

  const found = getLesson(lessonParam);
  // The URL must agree with where the lesson actually lives, or the ladder is lying.
  if (!found || found.trackId !== trackParam || found.moduleId !== moduleParam) notFound();

  const { lesson, moduleId, trackId } = found;
  const mod = getModule(moduleId);
  const track = getTrack(trackId);
  if (!mod || !track) notFound();

  const moduleHref = `/t/${trackId}/${moduleId}`;

  // Position: within the module, and within the whole curriculum.
  const moduleLessons = [...(mod.lessons ?? [])].sort((a, b) => a.order - b.order);
  const positionInModule = moduleLessons.findIndex((l) => l.id === lesson.id) + 1;
  const order = readingOrder();
  const positionOverall = order.findIndex((x) => x.lessonId === lesson.id) + 1;

  // Concepts this lesson teaches. Unresolved ids are surfaced, not swallowed.
  const taught: ConceptView[] = [];
  const unresolvedTaught: string[] = [];
  for (const id of lesson.teaches ?? []) {
    const c = getConcept(id);
    if (c) taught.push(c); else unresolvedTaught.push(id);
  }

  const prereqs = (lesson.assumes ?? []).map((id) => conceptRef(id));
  const later = usedLater(taught);
  const laterGroups = groupByTrack(later, trackId);
  const { entries: sourceEntries, unresolved: unresolvedSources } = sourcesFor(taught, getSource);
  const practices = getPracticesOf(moduleId);

  const { prev, next } = siblings(lesson.id);
  const prevN = neighbour(prev, moduleId, trackId);
  const nextN = neighbour(next, moduleId, trackId);

  return (
    // Keyed by lesson: moving to the next lesson must not carry this one's state, or its revealed
    // checks, into it. The remount is also what flushes the outgoing lesson's scroll position.
    <LessonProgressProvider
      key={lesson.id}
      lessonId={lesson.id}
      conceptIds={taught.map((c) => c.id)}
      contentHash={getLessonBody(lesson.id)?.contentHash}
      changeKind={getLessonBody(lesson.id)?.changeKind}
    >
      <div className="mx-auto grid max-w-[1680px] grid-cols-1 gap-x-8 gap-y-6 px-6 py-6 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_21rem]">
        <Keyboard up={moduleHref} prev={prevN?.href} next={nextN?.href} />

        <aside className="order-2 lg:order-1" aria-label="Track contents">
          <div className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-2">
            <TrackRail trackId={trackId} activeModuleId={moduleId} activeLessonId={lesson.id} />
          </div>
        </aside>

        <main className="order-1 min-w-0 lg:order-2">
          <header className="border-b border-[var(--color-rule)] pb-4">
            <Breadcrumb crumbs={crumbsFor({ trackId, moduleId, lessonId: lesson.id })} />
            <h1 className="mt-2 max-w-[38ch] text-[26px] leading-tight font-semibold">{lesson.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px] text-[var(--color-ink-3)]">
              <StatusBadge status={lesson.status} />
              <span>
                Lesson {positionInModule} of {moduleLessons.length} in{' '}
                <Link href={moduleHref} className="hover:text-[var(--color-accent)]">{mod.title}</Link>
              </span>
              <span aria-hidden="true">·</span>
              <span>{lesson.readingMin ? `${lesson.readingMin} min planned` : 'reading time not set'}</span>
              <span aria-hidden="true">·</span>
              <span>{taught.length} concept{taught.length === 1 ? '' : 's'}</span>
              <span aria-hidden="true">·</span>
              <span>{positionOverall > 0 ? `#${positionOverall} of ${order.length} in reading order` : 'not in reading order'}</span>
              <span aria-hidden="true">·</span>
              <LessonStateLine />
            </div>
          </header>

          <div className="mt-5 max-w-[76ch]">
            <PrereqStrip refs={prereqs} currentTrackId={trackId} />

            <div className="mt-6">
              {(() => {
                const body = getLessonBody(lesson.id);
                return body ? (
                  <>
                    <ProvenanceStrip body={body} />
                    <LessonProse body={body} />
                  </>
                ) : (
                  <OutlineBody lesson={lesson} taught={taught} unresolvedTaught={unresolvedTaught} />
                );
              })()}
            </div>

            <div className="mt-8">
              <UsedLaterStrip groups={laterGroups} total={later.length} currentTrackId={trackId} />
            </div>

            <EndOfLesson
              taught={taught}
              practices={practices}
              moduleTitle={mod.title}
              moduleHref={moduleHref}
              reflectionPrompt={mod.reflectionPrompt}
            />

            <PrevNext prev={prevN} next={nextN} />

            <p className="mt-4 text-[11.5px] text-[var(--color-ink-3)]">
              Esc goes up to {mod.title}. J / K move to the next and previous lesson. ⌘K searches everything.
            </p>
          </div>
        </main>

        <aside className="order-3 min-w-0" aria-label="Lesson context">
          <div className="xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto xl:pl-1">
            <ContextRail
              entries={sourceEntries}
              unresolved={unresolvedSources}
              lessonTitle={lesson.title}
            />
          </div>
        </aside>
      </div>
    </LessonProgressProvider>
  );
}
