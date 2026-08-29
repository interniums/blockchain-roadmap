import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/nav/Breadcrumb';
import { Keyboard } from '@/components/nav/Keyboard';
import { allTracks, crumbsFor, getModulesOf } from '@/lib/content/load';
import type { Track } from '@/lib/content/types';
import { WEB_NOTICE, can } from '@/lib/capabilities';
import { BOARD_W, boardHeight, buildEdges, domOrder } from './geometry';
import { Connectors } from './Connectors';
import { RoadmapChrome, type ChipTrack } from './RoadmapChrome';
import { TrackCard, type TrackNodeData } from './TrackCard';
import { ROADMAP_CSS } from './roadmapCss';

export const metadata: Metadata = {
  title: 'Roadmap · Chainpath',
  description: 'All thirteen tracks on one page: the core spine, the electives that branch off it, and every dependency between them.',
};

interface Sizes {
  perTrack: Map<string, { modules: number; lessons: number }>;
}

/** Module and lesson counts per track. Shape, not workload. */
function measure(tracks: Track[]): Sizes {
  const perTrack = new Map<string, { modules: number; lessons: number }>();
  for (const t of tracks) {
    const modules = getModulesOf(t.id);
    let lessons = 0;
    for (const m of modules) lessons += (m.lessons ?? []).length;
    perTrack.set(t.id, { modules: modules.length, lessons });
  }
  return { perTrack };
}

function toNodes(tracks: Track[], sizes: Sizes): TrackNodeData[] {
  const byId = new Map(tracks.map((t) => [t.id, t]));
  const title = (id: string) => byId.get(id)?.title ?? id;

  return domOrder(tracks).map((t) => {
    const size = sizes.perTrack.get(t.id) ?? { modules: 0, lessons: 0 };
    return {
      id: t.id,
      number: t.number,
      kind: t.kind,
      title: t.title,
      tagline: t.tagline,
      lane: t.layout.lane,
      row: t.layout.row,
      moduleCount: size.modules,
      lessonCount: size.lessons,
      needs: (t.entersFrom ?? []).map((id) => title(id)),
      opens: (t.feedsInto ?? []).map((id) => title(id)),
    };
  });
}

export default function RoadmapPage() {
  const tracks = allTracks();

  const maxRow = tracks.reduce((n, t) => Math.max(n, t.layout.row), 1);
  const height = boardHeight(maxRow);
  const edges = buildEdges(tracks);

  const sizes = measure(tracks);
  const nodes = toNodes(tracks, sizes);
  const chips: ChipTrack[] = nodes.map((n) => ({ id: n.id, number: n.number, title: n.title }));

  return (
    <>
      <style href="chainpath-roadmap" precedence="default" dangerouslySetInnerHTML={{ __html: ROADMAP_CSS }} />
      <Keyboard up="/" />

      <div className="mx-auto max-w-[1360px] px-6 pb-24">
        <header className="pt-8 pb-6">
          <Breadcrumb crumbs={crumbsFor({})} />

          <h1 className="mt-3 text-[34px] leading-[1.1] font-semibold tracking-tight">Roadmap</h1>

          <p className="mt-3 max-w-[64ch] text-[15px] leading-relaxed text-[var(--color-ink-2)]">
            Every track on one page, scrolled top to bottom. The six core tracks run down the
            centre in the order they are cheapest to learn; the seven electives sit left and right
            at the row where they become enterable. Ordering is suggested, never enforced — you can
            open any track at any time.
          </p>

          {!can.persistProgress && (
            <p className="mt-2 max-w-[64ch] text-[13.5px] leading-relaxed text-[var(--color-warn)]">
              Hosted copy: progress is kept on this device only and is never synced, and practice
              checks are unavailable here. {WEB_NOTICE}
            </p>
          )}
        </header>

        <RoadmapChrome tracks={chips}>
          <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-[var(--color-ink-3)]">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-0 w-6 border-t-2 border-[var(--color-ink-3)]" aria-hidden="true" />
              core order
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-0 w-6 border-t-2 border-dashed border-[var(--color-ink-3)] opacity-50" aria-hidden="true" />
              cross-track dependency
            </span>
            <span>every card links one level down, to its track</span>
          </p>

          {/* Wide by design: the board scrolls inside this container, never the page body. */}
          <div className="mt-2 overflow-x-auto pb-6">
            <div className="relative" style={{ width: BOARD_W, height }}>
              <Connectors edges={edges} width={BOARD_W} height={height} />
              <ol className="absolute inset-0 z-10 m-0 list-none p-0">
                {nodes.map((n) => (
                  <TrackCard key={n.id} t={n} />
                ))}
              </ol>
            </div>
          </div>
        </RoadmapChrome>

        <footer className="mt-4 max-w-[70ch] text-[13px] leading-relaxed text-[var(--color-ink-3)]">
          <p>
            The connecting lines are decorative. Each card names its own prerequisites in words, and
            the cards are in dependency order in the page itself, so the roadmap reads correctly
            with the lines switched off or never drawn at all.
          </p>
        </footer>
      </div>
    </>
  );
}
