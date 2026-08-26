import Link from 'next/link';
import { getTrack } from '@/lib/content/load';
import type { PrereqRef } from './derive';

/**
 * One strip at the top: what this module assumes you already hold.
 * Concepts from another track are labelled with it — that is the "borrows from" signal.
 */
export function PrereqStrip({ refs, trackId }: { refs: PrereqRef[]; trackId: string }) {
  if (refs.length === 0) {
    return (
      <div className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-2">
        <p className="text-[12.5px] text-[var(--color-ink-2)]">
          <span className="font-medium text-[var(--color-ink)]">Assumes nothing.</span>{' '}
          No lesson here leans on a concept taught elsewhere — this module can be read cold.
        </p>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="prereq-heading"
      className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-2.5"
    >
      <div className="flex items-baseline gap-2">
        <h2 id="prereq-heading" className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-3)]">
          Before this module
        </h2>
        <span className="text-[11px] text-[var(--color-ink-3)]">
          {refs.length} assumed {refs.length === 1 ? 'concept' : 'concepts'}, taught elsewhere
        </span>
      </div>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {refs.map((r) => {
          const foreign = r.trackId && r.trackId !== trackId ? getTrack(r.trackId) : undefined;
          if (!r.resolved) {
            return (
              <li key={r.id}>
                <span
                  title="No concept record with this id — a content gap, not a link."
                  className="inline-flex items-center gap-1 rounded border border-dashed border-[var(--color-rule)] px-1.5 py-0.5 text-[12px] text-[var(--color-ink-3)]"
                >
                  {r.id}
                  <span className="text-[10px] uppercase tracking-wide">unwritten</span>
                </span>
              </li>
            );
          }
          return (
            <li key={r.id}>
              <Link
                href={`/c/${r.id}`}
                title={r.oneLine}
                className="inline-flex items-center gap-1 rounded border border-[var(--color-rule)] bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[12px] text-[var(--color-ink-2)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                {r.title}
                {foreign && (
                  <span className="text-[10px] text-[var(--color-ink-3)]">· {foreign.title}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
