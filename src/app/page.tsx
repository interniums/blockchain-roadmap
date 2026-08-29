import type { Metadata } from 'next';
import Link from 'next/link';
import { allTracks, getModulesOf } from '@/lib/content/load';
import { Keyboard } from '@/components/nav/Keyboard';

export const metadata: Metadata = {
  title: 'Chainpath',
  description: 'The whole curriculum, from the entry point down.',
};

/**
 * The front door is the top of the content tree and nothing else.
 *
 * Deliberately absent: a dashboard, a resume point, a keyboard cheat sheet, curriculum counts,
 * a freshness report, and anything that reads as owed work. There is no clock in this product —
 * you open it when you open it, and it opens where the subject starts.
 */
export default function HomePage() {
  const tracks = allTracks();
  const core = tracks.filter((t) => t.kind === 'core');
  const electives = tracks.filter((t) => t.kind !== 'core');

  const firstTrack = core[0] ?? tracks[0];
  const firstModule = getModulesOf(firstTrack?.id ?? '').find((m) => (m.lessons?.length ?? 0) > 0);
  const firstLesson = firstModule
    ? [...(firstModule.lessons ?? [])].sort((a, b) => a.order - b.order)[0]
    : undefined;

  return (
    <>
      <Keyboard next={firstLesson && firstModule ? `/t/${firstTrack.id}/${firstModule.id}/${firstLesson.id}` : undefined} />

      <div className="mx-auto w-full max-w-[1100px] px-6 py-12">
        <header className="max-w-[62ch]">
          <h1 className="text-[32px] font-semibold leading-tight tracking-tight">Chainpath</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-ink-2)]">
            Blockchain development from first principles. Six core tracks in the order they are
            cheapest to learn, and seven electives that hang off them. Nothing is scheduled and
            nothing expires — the order is a suggestion about dependencies, not a timetable.
          </p>
        </header>

        {firstModule && firstLesson && (
          <p className="mt-7">
            <Link
              href={`/t/${firstTrack.id}/${firstModule.id}/${firstLesson.id}`}
              className="inline-flex items-baseline gap-2 rounded border border-[var(--color-accent)] bg-[var(--color-accent-soft)] px-3.5 py-2 text-[14.5px] text-[var(--color-accent)] no-underline"
            >
              <span>Start at the beginning</span>
              <span className="text-[13px] opacity-80">{firstLesson.title}</span>
            </Link>
          </p>
        )}

        <TrackGroup heading="Core" gloss="Read in order. Each one is assumed by the next." tracks={core} />
        <TrackGroup
          heading="Electives"
          gloss="Entered for a capability, once the core they lean on is behind you."
          tracks={electives}
        />

        <nav
          aria-label="Elsewhere"
          className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--color-rule)] pt-4 text-[13px] text-[var(--color-ink-3)]"
        >
          <Link href="/review" className="hover:text-[var(--color-accent)]">Drill</Link>
          <Link href="/questions" className="hover:text-[var(--color-accent)]">Questions</Link>
          <Link href="/m" className="hover:text-[var(--color-accent)]">The whole map as a diagram</Link>
          <Link href="/setup" className="hover:text-[var(--color-accent)]">Practice repo &amp; toolchain</Link>
        </nav>
      </div>
    </>
  );
}

function TrackGroup({
  heading, gloss, tracks,
}: {
  heading: string;
  gloss: string;
  tracks: ReturnType<typeof allTracks>;
}) {
  if (tracks.length === 0) return null;
  return (
    <section aria-labelledby={`group-${heading}`} className="mt-10">
      <h2
        id={`group-${heading}`}
        className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]"
      >
        {heading}
      </h2>
      <p className="mt-1 max-w-[62ch] text-[13px] text-[var(--color-ink-3)]">{gloss}</p>
      <ol className="mt-3 flex flex-col border-t border-[var(--color-rule)]">
        {tracks.map((t) => (
          <li key={t.id} className="border-b border-[var(--color-rule)]">
            <Link href={`/t/${t.id}`} className="group flex gap-4 px-1 py-3.5 no-underline">
              <span className="w-8 shrink-0 pt-0.5 text-right text-[13px] tabular-nums text-[var(--color-ink-3)]">
                {String(t.number).padStart(2, '0')}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[16px] font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                  {t.title}
                </span>
                {t.tagline && (
                  <span className="mt-0.5 block max-w-[62ch] text-[13.5px] leading-relaxed text-[var(--color-ink-2)]">
                    {t.tagline}
                  </span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
