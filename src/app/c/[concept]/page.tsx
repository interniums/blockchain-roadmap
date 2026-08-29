import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Breadcrumb } from '@/components/nav/Breadcrumb';
import { Keyboard } from '@/components/nav/Keyboard';
import { TrackRail } from '@/components/nav/TrackRail';
import { crumbsFor, getConcept, getModule } from '@/lib/content/load';

import { Appearances } from './_concept/Appearances';
import { Misconceptions } from './_concept/Misconceptions';
import { Neighbourhood } from './_concept/Neighbourhood';
import { SourcesRail } from './_concept/SourcesRail';
import { conceptSiblings, derived, trackTitle } from './_concept/derive';
import { Badge, Empty, RailBlock, Section } from './_concept/ui';

export function generateStaticParams() {
  return derived().conceptIds.map((concept) => ({ concept }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ concept: string }> }): Promise<Metadata> {
  const { concept } = await params;
  const c = getConcept(concept);
  if (!c) return { title: 'Concept not found · Chainpath' };
  return { title: `${c.title} · Chainpath`, description: c.oneLine };
}

/**
 * A concept page is the exact statement plus its neighbourhood. It carries no record of you and
 * no clock: what it knows about the world does not change because you visited, and the source
 * dates behind it are the author's maintenance problem, not the reader's.
 */
export default async function ConceptPage({
  params,
}: { params: Promise<{ concept: string }> }) {
  const { concept: id } = await params;
  const c = getConcept(id);
  if (!c) notFound();

  const mod = getModule(c.moduleId);
  const index = derived();
  const practices = index.practices.get(c.id) ?? [];
  const { prev, next } = conceptSiblings(c.id, c.moduleId);

  const crumbs = [
    ...crumbsFor({ trackId: c.trackId, moduleId: c.moduleId }),
    { href: `/c/${c.id}`, label: c.title },
  ];
  const moduleHref = `/t/${c.trackId}/${c.moduleId}`;

  return (
    <div className="mx-auto grid max-w-[1500px] grid-cols-1 items-start gap-8 px-6 py-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_300px]">
      <Keyboard
        up={moduleHref}
        prev={prev ? `/c/${prev}` : undefined}
        next={next ? `/c/${next}` : undefined}
      />

      <aside aria-label="Track navigation" className="lg:sticky lg:top-6">
        <TrackRail trackId={c.trackId} activeModuleId={c.moduleId} />
      </aside>

      <main className="min-w-0">
        <Breadcrumb crumbs={crumbs} />

        <header className="mt-5">
          <p className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">Concept</p>
          <h1 className="mt-1.5 text-[30px] leading-tight font-semibold text-[var(--color-ink)]">
            {c.title}
          </h1>
          <p className="mt-2 max-w-[62ch] text-[16px] leading-relaxed text-[var(--color-ink-2)]">
            {c.oneLine}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {c.needsSource && <Badge tone="warn">needs a carrying source</Badge>}
            {c.claimKind && <Badge tone="neutral">{c.claimKind} claim</Badge>}
            <span className="text-[12px] text-[var(--color-ink-3)]">
              Introduced in{' '}
              <Link href={moduleHref} className="hover:text-[var(--color-accent)]">
                {mod?.title ?? c.moduleId}
              </Link>
            </span>
          </div>
        </header>

        {/* The statement. Everything else on this page is context for it. */}
        <section aria-labelledby="statement-h" className="mt-7">
          <h2
            id="statement-h"
            className="text-[13px] font-semibold uppercase tracking-wider text-[var(--color-ink-2)]"
          >
            Statement
          </h2>
          <p className="mt-1 text-[12.5px] text-[var(--color-ink-3)]">
            The exact claim. This is what review asks you to reproduce and what a wrong answer is measured
            against — not the one-liner above it.
          </p>
          {c.statement ? (
            <div className="mt-3 rounded border border-[var(--color-rule)] border-l-2 border-l-[var(--color-accent)] bg-[var(--color-surface)] px-5 py-4">
              <p className="max-w-[68ch] text-[17px] leading-[1.65] text-[var(--color-ink)]">
                {c.statement}
              </p>
            </div>
          ) : (
            <div className="mt-3">
              <Empty>
                No statement is authored for this concept yet. Until one is, there is nothing precise enough
                here to be assessed on.
              </Empty>
            </div>
          )}
        </section>

        <Section
          id="misconceptions"
          title="Misconceptions"
          count={c.misconceptions?.length ?? 0}
          caption="The wrong model, set beside the right one. Held together because knowing the correct statement does not by itself dislodge the belief it replaces."
        >
          <Misconceptions items={c.misconceptions ?? []} />
        </Section>

        <Section
          id="neighbourhood"
          title="Neighbourhood"
          caption="Grouped lists, deliberately not a mini-graph. At 1,490 concepts a list is faster to read, keyboard-reachable, and impossible to get lost in."
        >
          <Neighbourhood concept={c} />
        </Section>

        <Section id="appearances" title="Where this appears">
          <Appearances taughtIn={c.lessons} practices={practices} fromTrackId={c.trackId} />
        </Section>

        <nav
          aria-label="Sibling concepts"
          className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-rule)] pt-4 text-[13px]"
        >
          <SiblingLink id={prev} direction="prev" />
          <Link href={moduleHref} className="text-[var(--color-ink-3)] hover:text-[var(--color-accent)]">
            Up to {mod?.title ?? 'module'}
          </Link>
          <SiblingLink id={next} direction="next" />
        </nav>
      </main>

      <aside
        aria-label="Concept context"
        className="flex min-w-0 flex-col gap-6 lg:col-span-2 xl:sticky xl:top-6 xl:col-span-1"
      >
        <RailBlock title={`Sources (${c.sources?.length ?? 0})`}>
          <SourcesRail
            sourceIds={c.sources ?? []}
            needsSource={c.needsSource}
            claimKind={c.claimKind}
          />
        </RailBlock>

        <RailBlock title="Home">
          <ul className="flex flex-col gap-1.5 text-[13px]">
            <li>
              <Link href={`/t/${c.trackId}`} className="text-[var(--color-ink-2)] hover:text-[var(--color-accent)]">
                {trackTitle(c.trackId)}
              </Link>
              <span className="ml-1.5 text-[11px] text-[var(--color-ink-3)]">track</span>
            </li>
            <li>
              <Link href={moduleHref} className="text-[var(--color-ink-2)] hover:text-[var(--color-accent)]">
                {mod?.title ?? c.moduleId}
              </Link>
              <span className="ml-1.5 text-[11px] text-[var(--color-ink-3)]">module</span>
            </li>
          </ul>
        </RailBlock>
      </aside>
    </div>
  );
}

function SiblingLink({ id, direction }: { id: string | null; direction: 'prev' | 'next' }) {
  const label = direction === 'prev' ? 'Previous' : 'Next';
  if (!id) {
    return (
      <span className="text-[var(--color-ink-3)]">
        {direction === 'prev' ? 'First' : 'Last'} concept in this module
      </span>
    );
  }
  const c = getConcept(id);
  return (
    <Link href={`/c/${id}`} className="max-w-[38%] text-[var(--color-ink-2)] hover:text-[var(--color-accent)]">
      <span className="block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
        {label}
      </span>
      {direction === 'prev' && <span aria-hidden="true">← </span>}
      {c?.title ?? id}
      {direction === 'next' && <span aria-hidden="true"> →</span>}
    </Link>
  );
}
