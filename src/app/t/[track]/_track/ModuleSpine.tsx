import Link from 'next/link';
import type { Module } from '@/lib/content/types';
import { buildSpine } from './spineLayout';
import { moduleFigures, plural } from './figures';

/**
 * The track's modules drawn with the same grammar as the roadmap: a centre spine,
 * left and right lanes, SVG connectors between authored coordinates. One level down,
 * so the diagram you learned to read at L1 reads the same here.
 *
 * The list underneath this diagram carries the same links in the same order and is
 * the accessible equivalent; the nodes are still real anchors — tabbable, deep-linkable
 * (/t/evm#m-evm-accounts) and back-button friendly.
 */
export function ModuleSpine({ trackId, modules }: { trackId: string; modules: Module[] }) {
  if (modules.length === 0) {
    return (
      <p className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-4 py-3 text-[13px] text-[var(--color-ink-2)]">
        No modules are authored for this track yet.
      </p>
    );
  }

  const { nodes, edges, width, height } = buildSpine(modules);

  return (
    <div className="overflow-x-auto rounded border border-[var(--color-rule)] bg-[var(--color-surface)] p-4">
      <div className="relative mx-auto" style={{ width, height }}>
        <svg
          className="pointer-events-none absolute left-0 top-0"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden="true"
          focusable="false"
        >
          {edges.map((e) => (
            <path
              key={e.id}
              d={e.d}
              fill="none"
              stroke="var(--color-rule)"
              strokeWidth={e.lateral ? 1.5 : 2}
              strokeDasharray={e.lateral ? '4 4' : undefined}
            />
          ))}
        </svg>

        {nodes.map((n) => {
          const f = moduleFigures(n.module);
          return (
            <Link
              key={n.module.id}
              id={`m-${n.module.id}`}
              href={`/t/${trackId}/${n.module.id}`}
              className="absolute flex flex-col justify-between rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-2 no-underline hover:border-[var(--color-accent)]"
              style={{ left: n.x, top: n.y, width: n.width, height: n.height }}
            >
              <span className="flex items-baseline justify-between gap-2 text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
                <span>Module {n.module.order}</span>
                {f.isStub && (
                  <span className="normal-case tracking-normal text-[var(--color-warn)]">stub</span>
                )}
              </span>
              <span className="line-clamp-2 text-[13.5px] font-medium leading-snug text-[var(--color-ink)]">
                {n.module.title}
              </span>
              <span className="text-[11.5px] text-[var(--color-ink-3)]">
                {`${plural(f.lessons, 'lesson')} · ${plural(f.practices, 'practice', 'practices')} · ${f.readingMin} min`}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
