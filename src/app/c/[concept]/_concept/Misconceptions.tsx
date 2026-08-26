import { getSource } from '@/lib/content/load';
import type { Misconception } from '@/lib/content/types';
import { Badge, Empty } from './ui';
import { TIER_LABEL, TIER_TONE } from './sourceMeta';

/**
 * Belief / reality pairs, given the weight they earn: the wrong model is the thing
 * that costs money, so it is set as prominently as the correct one and directly beside it.
 */
export function Misconceptions({ items }: { items: Misconception[] }) {
  if (items.length === 0) {
    return (
      <Empty>
        No misconceptions are recorded for this concept. That is an authoring gap, not a claim that none
        exist — roughly six in ten concepts in the corpus carry at least one.
      </Empty>
    );
  }

  return (
    <ol className="flex flex-col gap-4">
      {items.map((m, i) => {
        const src = m.source ? getSource(m.source) : undefined;
        return (
          <li
            key={`${i}-${m.belief.slice(0, 24)}`}
            className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)]"
          >
            <div className="grid gap-px bg-[var(--color-rule)] md:grid-cols-2">
              <div className="bg-[var(--color-surface)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-danger)]">
                  Commonly believed
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-ink)]">{m.belief}</p>
              </div>
              <div className="bg-[var(--color-surface)] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-good)]">
                  Actually
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-ink)]">{m.reality}</p>
              </div>
            </div>

            {(m.why || m.source) && (
              <div className="border-t border-[var(--color-rule)] px-4 py-3">
                {m.why && (
                  <p className="text-[13px] leading-relaxed text-[var(--color-ink-2)]">
                    <span className="font-semibold text-[var(--color-ink-2)]">Why it sticks — </span>
                    {m.why}
                  </p>
                )}
                {m.source && (
                  <p className="mt-2 flex flex-wrap items-center gap-2 text-[12.5px]">
                    <span className="text-[var(--color-ink-3)]">Corrected by</span>
                    {src ? (
                      <>
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-[var(--color-accent)] hover:underline"
                        >
                          {src.title}
                        </a>
                        <Badge tone={TIER_TONE[src.tier]}>{TIER_LABEL[src.tier]}</Badge>
                      </>
                    ) : (
                      <>
                        <span className="font-mono text-[var(--color-ink-3)]">{m.source}</span>
                        <Badge tone="danger">source id not found</Badge>
                      </>
                    )}
                  </p>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
