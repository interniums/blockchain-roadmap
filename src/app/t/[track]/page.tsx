import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allTracks, crumbsFor, getModulesOf, getTrack } from '@/lib/content/load';
import { Breadcrumb } from '@/components/nav/Breadcrumb';
import { Keyboard } from '@/components/nav/Keyboard';
import { TrackRail } from '@/components/nav/TrackRail';
import { ContextRail } from './_track/ContextRail';
import { ModuleList } from './_track/ModuleList';

type Params = { track: string };

export function generateStaticParams(): Params[] {
  return allTracks().map((t) => ({ track: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { track } = await params;
  const t = getTrack(track);
  if (!t) return { title: 'Track not found · Chainpath' };
  return {
    title: `${t.title} · Chainpath`,
    description: t.tagline ?? `Track ${t.number} of the Chainpath curriculum.`,
  };
}

export default async function TrackPage({ params }: { params: Promise<Params> }) {
  const { track: trackId } = await params;
  const track = getTrack(trackId);
  if (!track) notFound();

  const modules = getModulesOf(track.id);

  // First lesson in reading order within this track — the one honest "start here" link.
  const firstModule = modules.find((m) => (m.lessons?.length ?? 0) > 0);
  const firstLesson = firstModule
    ? [...(firstModule.lessons ?? [])].sort((a, b) => a.order - b.order)[0]
    : undefined;

  // Siblings for J / K: the track before and after this one, in curriculum order.
  const tracks = allTracks();
  const index = tracks.findIndex((t) => t.id === track.id);
  const prevTrack = index > 0 ? tracks[index - 1] : undefined;
  const nextTrack = index >= 0 && index < tracks.length - 1 ? tracks[index + 1] : undefined;

  return (
    <>
      <Keyboard
        up="/m"
        prev={prevTrack ? `/t/${prevTrack.id}` : undefined}
        next={nextTrack ? `/t/${nextTrack.id}` : undefined}
      />

      <div className="mx-auto flex w-full max-w-[1560px] flex-wrap items-start gap-x-10 gap-y-8 px-6 py-6 lg:flex-nowrap">
        {/* TrackRail supplies its own <nav> landmark, so this wrapper stays a plain box. */}
        <div className="w-full lg:sticky lg:top-6 lg:w-60 lg:shrink-0 lg:self-start">
          <TrackRail trackId={track.id} />
        </div>

        <main className="w-full min-w-0 flex-1 lg:max-w-[880px]">
          <Breadcrumb crumbs={crumbsFor({ trackId: track.id })} />

          <header className="mt-4">
            <p className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-[var(--color-ink-3)]">
              <span className="tabular-nums">
                Track {String(track.number).padStart(2, '0')}
              </span>
              <span aria-hidden="true">·</span>
              <span>{track.kind === 'core' ? 'Core — on the spine' : 'Elective'}</span>
            </p>
            <h1 className="mt-1 text-[30px] font-semibold leading-tight tracking-tight text-[var(--color-ink)]">
              {track.title}
            </h1>
            {track.tagline && (
              <p className="mt-2 max-w-[62ch] text-[16px] leading-relaxed text-[var(--color-ink-2)]">
                {track.tagline}
              </p>
            )}
          </header>

          {firstModule && firstLesson && (
            <p className="mt-4">
              <Link
                href={`/t/${track.id}/${firstModule.id}/${firstLesson.id}`}
                className="inline-flex items-baseline gap-2 rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-2 text-[14px] text-[var(--color-ink)] no-underline hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                <span>Start at the beginning</span>
                <span className="text-[13px] text-[var(--color-ink-3)]">
                  {firstLesson.title}
                </span>
              </Link>
            </p>
          )}

          <section aria-labelledby="modules-heading" className="mt-8">
            <h2
              id="modules-heading"
              className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]"
            >
              Modules in order
            </h2>
            <div className="mt-3">
              <ModuleList trackId={track.id} modules={modules} />
            </div>
          </section>

          <nav
            aria-label="Adjacent tracks"
            className="mt-10 flex flex-wrap items-start justify-between gap-4 border-t border-[var(--color-rule)] pt-4"
          >
            {prevTrack ? (
              <Link
                href={`/t/${prevTrack.id}`}
                className="max-w-[45%] text-[13.5px] text-[var(--color-ink-2)] hover:text-[var(--color-accent)]"
              >
                <span className="block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
                  ← Previous track
                </span>
                {prevTrack.title}
              </Link>
            ) : (
              <span className="max-w-[45%] text-[13.5px] text-[var(--color-ink-3)]">
                <span className="block text-[11px] uppercase tracking-wider">← Previous track</span>
                This is the first track.
              </span>
            )}
            {nextTrack ? (
              <Link
                href={`/t/${nextTrack.id}`}
                className="max-w-[45%] text-right text-[13.5px] text-[var(--color-ink-2)] hover:text-[var(--color-accent)]"
              >
                <span className="block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
                  Next track →
                </span>
                {nextTrack.title}
              </Link>
            ) : (
              <span className="max-w-[45%] text-right text-[13.5px] text-[var(--color-ink-3)]">
                <span className="block text-[11px] uppercase tracking-wider">Next track →</span>
                This is the last track.
              </span>
            )}
          </nav>
        </main>

        <aside
          aria-label="Track context"
          className="w-full lg:sticky lg:top-6 lg:w-[19rem] lg:shrink-0 lg:self-start"
        >
          <ContextRail track={track} />
        </aside>
      </div>
    </>
  );
}
