import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/nav/Breadcrumb';
import { Keyboard } from '@/components/nav/Keyboard';
import {
  crumbsFor, getLesson, getModule, getTrack, practicesForLesson, readingOrder, siblings,
} from '@/lib/content/load';
import { getLessonBody } from '@/lib/content/body';
import { gateFor } from '@/lib/content/gate';
import { LessonProse } from '@/components/lesson/LessonProse';
import { Gate } from './_lesson/Gate';
import { SectionRail } from './_lesson/SectionRail';
import { Margin } from './_lesson/Margin';
import { conceptRef, type Neighbour } from './_lesson/graph';
import { EndOfLesson } from './_lesson/EndOfLesson';

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
  return { title: `${found.lesson.title} · Chainpath`, description: mod?.title };
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

/**
 * The reading surface. Most of the time spent in this app is here, so it gets the width and almost
 * none of the chrome.
 *
 * Two layers of structure, down from seven: a section rail that says where you are inside this
 * lesson, and a content area that is a prose column plus a margin gutter. Citations, captions and
 * provenance live in the gutter; there is no second rail competing with the paragraph.
 *
 * What the top deliberately does not say: an authoring-status badge (all 635 lessons rendered an
 * amber DRAFTED chip), a reading estimate, "Lesson 3 of 9", "#201 of 635 in reading order", how
 * many concepts it teaches, or anything about whether you have been here before.
 */
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

  const gate = gateFor(lesson.id);
  const assumes = (lesson.assumes ?? []).map((id) => conceptRef(id));
  // The exercises whose span includes THIS lesson, narrowest grain first — not the module's whole
  // list, which the old page fanned onto every lesson in it, up to 23 of them.
  const practices = practicesForLesson(lesson.id);

  const { prev, next } = siblings(lesson.id);
  const prevN = neighbour(prev, moduleId, trackId);
  const nextN = neighbour(next, moduleId, trackId);

  // Two crumbs, not four. The leaf duplicated the h1 twenty pixels below it, and the root is the
  // rail's job. Trimmed at the call site: `crumbsFor` is shared with the concept and practice
  // screens, which need more segments rather than fewer.
  const crumbs = crumbsFor({ trackId, moduleId, lessonId: lesson.id }).slice(1, -1);

  return (
    // Keyed by lesson: moving to the next lesson must not carry this one's revealed checks into it.
    <div key={lesson.id} className="reading mx-auto w-full max-w-[1440px] px-8 py-8">
      <Keyboard up={moduleHref} prev={prevN?.href} next={nextN?.href} />

      <aside className="reading-rail" aria-label="Lesson contents">
        <SectionRail sections={body.sections} moduleTitle={mod.title} moduleHref={moduleHref} />
      </aside>

      <main className="min-w-0">
        <header className="max-w-[var(--measure)]">
          <Breadcrumb crumbs={crumbs} />
          <h1 className="mt-1.5 text-[30px] font-semibold leading-[1.12] tracking-tight text-balance">
            {lesson.title}
          </h1>
          {body.authorship === 'generated' && (
            <p className="mt-2 text-[var(--text-marginal)] uppercase tracking-wider text-[var(--color-warn)]">
              Generated, not yet reviewed
            </p>
          )}
        </header>

        {/* `reading-body` is the element the measure is set on, so every float inside it — the
            margin block and each first-citation note — has the same edge to push out from.

            The gate stands in place of the prose, not above it, and it takes the closing control
            with it: there is nothing to move on to until the lesson has been read. */}
        <div className="reading-body mt-7">
          <Gate watch={gate.watch} blockers={gate.blockers}>
            <Margin assumes={assumes} body={body} />
            <LessonProse body={body} />

            <EndOfLesson
              practices={practices}
              moduleTitle={mod.title}
              moduleHref={moduleHref}
              next={nextN}
            />
          </Gate>
        </div>
      </main>
    </div>
  );
}
