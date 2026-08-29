import type { Metadata } from 'next';
import Link from 'next/link';
import { graph, stats } from '@/lib/content/load';
import type { Volatility } from '@/lib/content/types';

export const metadata: Metadata = {
  title: 'Glossary · Chainpath',
  description: 'Every concept in the curriculum, alphabetical, one line each.',
};

const LETTERS = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

const LIBRARY = [
  { href: '/glossary', label: 'Glossary' },
  { href: '/questions', label: 'Questions' },
];

const VOL_TONE: Record<Volatility, string> = {
  stable: 'border-[var(--color-good)] text-[var(--color-good)]',
  evolving: 'border-[var(--color-warn)] text-[var(--color-warn)]',
  hot: 'border-[var(--color-danger)] text-[var(--color-danger)]',
};

interface Entry {
  id: string;
  title: string;
  oneLine: string;
  volatility: Volatility | null;
  trackTitle: string | null;
  trackId: string | null;
}

/** '#' collects digits, quotes and anything else that is not A–Z. */
function bucketOf(title: string): string {
  const c = title.trim().charAt(0).toUpperCase();
  return c >= 'A' && c <= 'Z' ? c : '#';
}

function buildEntries(): { buckets: Map<string, Entry[]>; total: number } {
  const g = graph();
  const entries: Entry[] = [];
  for (const [id, c] of g.conceptById) {
    const home = g.conceptHome.get(id);
    const track = home?.trackId ? g.trackById.get(home.trackId) : undefined;
    entries.push({
      id,
      title: c.title,
      oneLine: c.oneLine,
      volatility: c.volatility ?? null,
      trackTitle: track ? track.title : null,
      trackId: track ? track.id : null,
    });
  }
  entries.sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }));

  const buckets = new Map<string, Entry[]>();
  for (const l of LETTERS) buckets.set(l, []);
  for (const e of entries) buckets.get(bucketOf(e.title))!.push(e);
  return { buckets, total: entries.length };
}

export default function GlossaryPage() {
  const { buckets, total } = buildEntries();
  const s = stats();

  return (
    <div className="mx-auto flex w-full max-w-[1400px] gap-8 px-6 py-6">
      <aside className="hidden w-[190px] shrink-0 lg:block">
        <nav aria-label="Library" className="sticky top-6 text-[13px]">
          <Link href="/" className="block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)] hover:text-[var(--color-accent)]">
            ← Curriculum
          </Link>
          <p className="mt-2 text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">Library</p>
          <ul className="mt-1 flex flex-col gap-0.5">
            {LIBRARY.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={l.href === '/glossary' ? 'page' : undefined}
                  className={`block rounded px-2 py-1 ${
                    l.href === '/glossary'
                      ? 'bg-[var(--color-surface-2)] text-[var(--color-ink)]'
                      : 'text-[var(--color-ink-2)] hover:text-[var(--color-accent)]'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">Corpus</p>
          <dl className="mt-1 flex flex-col gap-1 text-[12px] text-[var(--color-ink-2)]">
            <div className="flex justify-between gap-2"><dt>Concepts</dt><dd className="font-mono text-[var(--color-ink)]">{s.concepts}</dd></div>
            <div className="flex justify-between gap-2"><dt>Lessons</dt><dd className="font-mono">{s.lessons}</dd></div>
            <div className="flex justify-between gap-2"><dt>Tracks</dt><dd className="font-mono">{s.tracks}</dd></div>
          </dl>
        </nav>
      </aside>

      <main className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">Library</p>
        <h1 id="top-of-glossary" className="mt-1 scroll-mt-6 text-[26px] font-semibold tracking-tight">Glossary</h1>
        <p className="mt-2 max-w-[80ch] text-[14px] text-[var(--color-ink-2)]">
          All {total} concepts, alphabetical, one line each. A concept is the atom — one idea you can be right or
          wrong about — so this is also the full list of things review can ask you. Every title links to the concept
          page, where the statement, misconceptions, sources and neighbourhood live.
        </p>
        <p className="mt-2 max-w-[80ch] text-[13px] text-[var(--color-ink-3)]">
          The badge is the concept&apos;s volatility, which sets how often its sources must be re-verified:{' '}
          <span className="font-mono">stable</span> 365 days, <span className="font-mono">evolving</span> 120,{' '}
          <span className="font-mono">hot</span> 45.
        </p>

        <nav aria-label="Jump to letter" className="sticky top-0 z-10 mt-4 -mx-2 border-b border-[var(--color-rule)] bg-[var(--color-ground)] px-2 py-2">
          <ul className="flex flex-wrap gap-0.5">
            {LETTERS.map((l) => {
              const n = buckets.get(l)?.length ?? 0;
              return (
                <li key={l}>
                  {n === 0 ? (
                    <span
                      aria-disabled="true"
                      title={`No concepts under ${l}`}
                      className="inline-block w-7 rounded px-1 py-0.5 text-center font-mono text-[12px] text-[var(--color-ink-3)] opacity-40"
                    >
                      {l}
                    </span>
                  ) : (
                    <a
                      href={`#letter-${l === '#' ? 'other' : l}`}
                      title={`${n} concept${n === 1 ? '' : 's'}`}
                      className="inline-block w-7 rounded px-1 py-0.5 text-center font-mono text-[12px] text-[var(--color-ink-2)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-accent)]"
                    >
                      {l}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-6 flex flex-col gap-8">
          {LETTERS.map((l) => {
            const list = buckets.get(l) ?? [];
            if (list.length === 0) return null;
            const anchor = `letter-${l === '#' ? 'other' : l}`;
            return (
              <section key={l} aria-labelledby={anchor} className="scroll-mt-14">
                <h2
                  id={anchor}
                  className="flex items-baseline gap-2 border-b border-[var(--color-rule)] pb-1 text-[18px] font-semibold"
                >
                  <span className="font-mono">{l}</span>
                  <span className="text-[12px] font-normal text-[var(--color-ink-3)]">
                    {list.length} concept{list.length === 1 ? '' : 's'}
                  </span>
                  <a href="#top-of-glossary" className="ml-auto text-[12px] font-normal text-[var(--color-ink-3)] hover:text-[var(--color-accent)]">
                    top ↑
                  </a>
                </h2>
                <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-2">
                  {list.map((e) => (
                    <div key={e.id} id={`g-${e.id}`} className="scroll-mt-16">
                      <dt className="flex flex-wrap items-baseline gap-2">
                        <Link href={`/c/${e.id}`} className="text-[14px] font-medium hover:text-[var(--color-accent)]">
                          {e.title}
                        </Link>
                        {e.volatility && (
                          <span className={`rounded border px-1.5 py-px text-[11px] leading-[16px] ${VOL_TONE[e.volatility]}`}>
                            {e.volatility}
                          </span>
                        )}
                        {e.trackId && e.trackTitle && (
                          <Link
                            href={`/t/${e.trackId}`}
                            className="text-[11px] text-[var(--color-ink-3)] hover:text-[var(--color-accent)]"
                          >
                            {e.trackTitle}
                          </Link>
                        )}
                      </dt>
                      <dd className="mt-0.5 max-w-[60ch] text-[13px] text-[var(--color-ink-2)]">{e.oneLine}</dd>
                      <dd className="mt-0.5 font-mono text-[11px] text-[var(--color-ink-3)]">{e.id}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
