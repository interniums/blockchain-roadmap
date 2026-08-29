import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  allTracks, crumbsFor, getModule, getModulesOf, getPractice, getPracticesOf, getTrack,
} from '@/lib/content/load';
import type { Practice } from '@/lib/content/types';
import { Breadcrumb } from '@/components/nav/Breadcrumb';
import { TrackRail } from '@/components/nav/TrackRail';
import { Keyboard } from '@/components/nav/Keyboard';
import { can, WEB_NOTICE } from '@/lib/capabilities';
import { Note, Section } from './_module/Chrome';
import { conceptRefs, lessonRows, prereqRefs, totals } from './_module/derive';
import { PrereqStrip } from './_module/PrereqStrip';
import { LessonList } from './_module/LessonList';
import { PracticeList } from './_module/PracticeList';
import { ConceptChips } from './_module/ConceptChips';
import { ReflectionComposer } from './_module/ReflectionComposer';

type Params = { track: string; module: string };

export function generateStaticParams(): Params[] {
  return allTracks().flatMap((t) =>
    getModulesOf(t.id).map((m) => ({ track: t.id, module: m.id })),
  );
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { track: trackId, module: moduleId } = await params;
  const mod = getModule(moduleId);
  const track = getTrack(trackId);
  if (!mod || !track) return { title: 'Not found · Chainpath' };
  return {
    title: `${mod.title} · ${track.title} · Chainpath`,
    description: mod.summary?.trim().slice(0, 200),
  };
}

/** Resolve the module's practices, keeping the authored order and surfacing ids with no spec. */
function resolvePractices(moduleId: string, declared: string[] | undefined) {
  const byId = new Map<string, Practice>();
  for (const p of getPracticesOf(moduleId)) byId.set(p.id, p);

  const ordered: Practice[] = [];
  const missing: string[] = [];
  const seen = new Set<string>();

  for (const id of declared ?? []) {
    const p = byId.get(id) ?? getPractice(id);
    if (p) { ordered.push(p); seen.add(p.id); } else { missing.push(id); }
  }
  for (const p of byId.values()) if (!seen.has(p.id)) ordered.push(p);

  return { ordered, missing };
}

export default async function ModulePage({ params }: { params: Promise<Params> }) {
  const { track: trackId, module: moduleId } = await params;
  const track = getTrack(trackId);
  const mod = getModule(moduleId);
  if (!track || !mod || mod.trackId !== track.id) notFound();

  const modules = getModulesOf(track.id);
  const index = modules.findIndex((m) => m.id === mod.id);
  const prev = index > 0 ? modules[index - 1] : null;
  const next = index >= 0 && index < modules.length - 1 ? modules[index + 1] : null;

  const lessons = lessonRows(mod);
  const t = totals(mod);
  const prereqs = prereqRefs(mod);
  const { ordered: practices, missing: missingPractices } = resolvePractices(mod.id, mod.practices);

  const firstLesson = lessons[0];
  const borrowsFrom = [...new Set(prereqs.map((p) => p.trackId).filter((id) => id && id !== track.id))];

  return (
    <>
      <Keyboard
        up={`/t/${track.id}`}
        prev={prev ? `/t/${track.id}/${prev.id}` : undefined}
        next={next ? `/t/${track.id}/${next.id}` : undefined}
      />

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-x-10 gap-y-6 px-6 py-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,760px)_280px]">

        {/* nav rail */}
        <aside className="hidden lg:block" aria-label="Track navigation">
          <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto pr-2">
            <TrackRail trackId={track.id} activeModuleId={mod.id} />
          </div>
        </aside>

        {/* content column */}
        <main className="min-w-0">
          <Breadcrumb crumbs={crumbsFor({ trackId: track.id, moduleId: mod.id })} />

          <header className="mt-4">
            <p className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
              <Link href={`/t/${track.id}`} className="hover:text-[var(--color-accent)]">
                Track {track.number} · {track.title}
              </Link>
              {index >= 0 && (
                <span> · Module {index + 1} of {modules.length}</span>
              )}
            </p>
            <h1 className="mt-1 text-[26px] font-semibold leading-8 tracking-tight text-[var(--color-ink)]">
              {mod.title}
            </h1>
            {mod.summary && (
              <p className="mt-3 max-w-[70ch] text-[14px] leading-6 text-[var(--color-ink-2)]">
                {mod.summary}
              </p>
            )}
          </header>

          <div className="mt-5">
            <PrereqStrip refs={prereqs} trackId={track.id} />
          </div>

          <Section
            id="lessons"
            title="Lessons"
            meta={<>{t.lessons} in order</>}
          >
            <LessonList lessons={lessons} trackId={track.id} moduleId={mod.id} />
          </Section>

          <Section
            id="practice"
            title="Practice"
            meta={`${practices.length} ${practices.length === 1 ? 'exercise' : 'exercises'}`}
            lede="Not reading. You write, break or measure something in your own repo, and the check runs against it."
          >
            <div className="rounded border border-[var(--color-rule)] bg-[var(--color-surface-2)] p-3">
              {!can.runPractice && (
                <div className="mb-3">
                  <Note tone="warn">
                    <span className="font-medium">Checks cannot run here.</span> {WEB_NOTICE} You can
                    still read every spec, its acceptance criteria and its hint ladder.
                  </Note>
                </div>
              )}
              <PracticeList practices={practices} missingIds={missingPractices} />
            </div>
          </Section>

          <Section
            id="concepts"
            title="Concepts introduced here"
            meta={`${t.concepts} ${t.concepts === 1 ? 'concept' : 'concepts'}`}
            lede="Each one is an idea you can be right or wrong about, and the unit review schedules."
          >
            <ConceptChips concepts={conceptRefs(mod.teaches ?? [])} unplaced={t.unplacedConcepts} />
            {!can.persistProgress && (
              <p className="mt-3 max-w-[68ch] text-[12px] text-[var(--color-ink-3)]">
                Mastery is shown here, but in the web copy it is kept on this device only — it is not
                the same record you would build up in the local install, and it does not follow you
                to another browser.
              </p>
            )}
          </Section>

          {mod.reflectionPrompt && (
            <Section
              id="reflection"
              title="Reflection"
              lede="Answer it after the practice, in your own words. Recalling beats re-reading."
            >
              <blockquote className="border-l-2 border-[var(--color-accent)] pl-3 text-[14px] leading-6 text-[var(--color-ink)]">
                {mod.reflectionPrompt}
              </blockquote>
              <ReflectionComposer
                moduleId={mod.id}
                prompt={mod.reflectionPrompt}
                deviceOnlyNotice={
                  can.composeNotes
                    ? null
                    : 'Written answers are kept in this browser in the web copy, not in the durable store the '
                      + 'local install writes to. Clearing site data clears them, and they will not appear on your '
                      + 'own machine.'
                }
              />
            </Section>
          )}

          {/* end of page — every page has an end, and the end says what comes next */}
          <nav
            aria-label="Module navigation"
            className="mt-12 flex flex-wrap items-stretch gap-3 border-t border-[var(--color-rule)] pt-4"
          >
            {firstLesson && (
              <Link
                href={`/t/${track.id}/${mod.id}/${firstLesson.id}`}
                className="flex-1 rounded border border-[var(--color-accent)] bg-[var(--color-accent-soft)] px-3 py-2 text-[13px] text-[var(--color-accent)] hover:border-[var(--color-ink)]"
              >
                <span className="block text-[11px] uppercase tracking-wider opacity-80">
                  Start reading
                </span>
                <span className="block">{firstLesson.title}</span>
              </Link>
            )}
            {prev && (
              <Link
                href={`/t/${track.id}/${prev.id}`}
                className="flex-1 rounded border border-[var(--color-rule)] px-3 py-2 text-[13px] text-[var(--color-ink-2)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                <span className="block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
                  Previous module · K
                </span>
                <span className="block">{prev.title}</span>
              </Link>
            )}
            {next && (
              <Link
                href={`/t/${track.id}/${next.id}`}
                className="flex-1 rounded border border-[var(--color-rule)] px-3 py-2 text-[13px] text-[var(--color-ink-2)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                <span className="block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
                  Next module · J
                </span>
                <span className="block">{next.title}</span>
              </Link>
            )}
            {!next && (
              <p className="flex-1 rounded border border-dashed border-[var(--color-rule)] px-3 py-2 text-[13px] text-[var(--color-ink-3)]">
                <span className="block text-[11px] uppercase tracking-wider">End of track</span>
                <Link href={`/t/${track.id}`} className="block hover:text-[var(--color-accent)]">
                  Back to {track.title}
                </Link>
              </p>
            )}
          </nav>
        </main>

        {/* context rail */}
        <aside className="hidden xl:block" aria-label="Module context">
          <div className="sticky top-6 flex max-h-[calc(100vh-3rem)] flex-col gap-5 overflow-y-auto text-[12.5px]">

            <section aria-labelledby="glance-heading">
              <h2 id="glance-heading" className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-3)]">
                At a glance
              </h2>
              <dl className="mt-2 flex flex-col gap-1">
                {([
                  ['Lessons', `${t.lessons}`],
                  ['Practices', `${practices.length}`],
                  ['Concepts', `${t.concepts}`],
                  ['Assumed first', `${prereqs.length}`],
                ] as const).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-b border-[var(--color-rule)] pb-1">
                    <dt className="text-[var(--color-ink-3)]">{k}</dt>
                    <dd className="tabular-nums text-[var(--color-ink-2)]">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {borrowsFrom.length > 0 && (
              <section aria-labelledby="borrows-heading">
                <h2 id="borrows-heading" className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-3)]">
                  Borrows from
                </h2>
                <ul className="mt-2 flex flex-col gap-1">
                  {borrowsFrom.map((id) => {
                    const bt = getTrack(id);
                    if (!bt) return null;
                    return (
                      <li key={id}>
                        <Link href={`/t/${id}`} className="text-[var(--color-ink-2)] hover:text-[var(--color-accent)]">
                          {bt.number.toString().padStart(2, '0')} · {bt.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

          </div>
        </aside>
      </div>
    </>
  );
}
