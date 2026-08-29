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
import { ContextRail } from './_lesson/ContextRail';
import { EndOfLesson } from './_lesson/EndOfLesson';
import { getLessonBody } from '@/lib/content/body';
import { LessonProse, ProvenanceStrip } from '@/components/lesson/LessonProse';
import { PrevNext, type Neighbour } from './_lesson/PrevNext';
import { PrereqStrip } from './_lesson/Strips';
import { conceptRef, sourcesFor } from './_lesson/graph';

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
    description: mod?.title,
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

  // Every lesson has prose on disk; a missing body is a build error, not a state to render.
  const body = getLessonBody(lesson.id);
  if (!body) notFound();

  // Concepts this lesson teaches. Unresolved ids are dropped here and caught by content:lint.
  const taught: ConceptView[] = [];
  for (const id of lesson.teaches ?? []) {
    const c = getConcept(id);
    if (c) taught.push(c);
  }

  const prereqs = (lesson.assumes ?? []).map((id) => conceptRef(id));
  const { entries: sourceEntries, unresolved: unresolvedSources } = sourcesFor(taught, getSource);
  const practices = getPracticesOf(moduleId);

  const { prev, next } = siblings(lesson.id);
  const prevN = neighbour(prev, moduleId, trackId);
  const nextN = neighbour(next, moduleId, trackId);

  return (
    // Keyed by lesson: moving to the next lesson must not carry this one's revealed checks into it.
    <div
      key={lesson.id}
      className="mx-auto grid max-w-[1680px] grid-cols-1 gap-x-8 gap-y-6 px-6 py-6 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_21rem]"
    >
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
        <p className="mt-2 text-[12.5px] text-[var(--color-ink-3)]">
          <Link href={moduleHref} className="hover:text-[var(--color-accent)]">
          {mod.title}
          </Link>
        </p>
        </header>

        <div className="mt-5 max-w-[76ch]">
        <PrereqStrip refs={prereqs} currentTrackId={trackId} />

        <div className="mt-6">
          <ProvenanceStrip body={body} />
          <LessonProse body={body} />
        </div>

        <EndOfLesson
          practices={practices}
          moduleTitle={mod.title}
          moduleHref={moduleHref}
        />

        <PrevNext prev={prevN} next={nextN} />
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
  );
}
