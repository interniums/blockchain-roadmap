import Link from 'next/link';
import type { Module } from '@/lib/content/types';
import { moduleFigures, plural } from './figures';

/**
 * The same modules as the spine, in the same order, as a readable list.
 * Title, summary, and the two counts that tell you what a module asks of you:
 * how much reading, and how much building.
 */
export function ModuleList({ trackId, modules }: { trackId: string; modules: Module[] }) {
  if (modules.length === 0) {
    return (
      <p className="text-[14px] text-[var(--color-ink-2)]">
        No modules are authored for this track yet.
      </p>
    );
  }

  return (
    <ol className="flex flex-col border-t border-[var(--color-rule)]">
      {modules.map((m) => {
        const f = moduleFigures(m);
        return (
          <li key={m.id} className="border-b border-[var(--color-rule)]">
            <Link
              href={`/t/${trackId}/${m.id}`}
              className="group flex gap-4 px-1 py-4 no-underline"
            >
              <span className="w-8 shrink-0 pt-0.5 text-right text-[13px] tabular-nums text-[var(--color-ink-3)]">
                {String(m.order).padStart(2, '0')}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-[16px] font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                    {m.title}
                  </span>
                  {f.isStub && (
                    <span className="rounded border border-[var(--color-rule)] bg-[var(--color-warn-soft)] px-1.5 py-px text-[11px] text-[var(--color-warn)]">
                      stub — orientation only
                    </span>
                  )}
                </span>
                {m.summary && (
                  <span className="mt-1 block max-w-[62ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
                    {m.summary}
                  </span>
                )}
                <span className="mt-2 block text-[12.5px] text-[var(--color-ink-3)]">
                  {plural(f.lessons, 'lesson')} · {plural(f.practices, 'practice', 'practices')} ·{' '}
                  {plural(f.concepts, 'concept')} · {f.readingMin} min reading
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
