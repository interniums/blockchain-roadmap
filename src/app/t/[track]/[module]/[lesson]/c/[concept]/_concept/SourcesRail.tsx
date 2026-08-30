import { getSource } from '@/lib/content/load';
import type { Source } from '@/lib/content/types';
import { Badge, Notice } from './ui';
import { CARRYING_TIERS, TIER_LABEL, TIER_RANK, TIER_TONE } from './sourceMeta';

export function SourcesRail({
  sourceIds, needsSource, claimKind,
}: {
  sourceIds: string[];
  needsSource?: boolean;
  claimKind?: string;
}) {
  const resolved: Source[] = [];
  const missing: string[] = [];
  for (const id of sourceIds) {
    const s = getSource(id);
    if (s) resolved.push(s);
    else missing.push(id);
  }
  resolved.sort((a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier]);
  const carried = resolved.some((s) => CARRYING_TIERS.includes(s.tier));

  return (
    <div className="flex flex-col gap-3">
      {resolved.length === 0 && (
        <Notice tone="danger" title="No sources cited">
          Every concept is required to carry at least one source. This one carries none, which is a content
          bug — treat the statement as unsupported until it is fixed.
        </Notice>
      )}

      {needsSource && (
        <Notice tone="warn" title="Flagged needsSource">
          The research sweep found no spec- or canonical-docs-tier source for this concept. What is cited
          below supports the statement but does not meet the bar; the statement is deliberately restricted
          to what these sources carry.
        </Notice>
      )}

      {!needsSource && resolved.length > 0 && !carried && claimKind !== 'empirical' && (
        <Notice tone="warn" title="No carrying source">
          Nothing here is at spec or canonical-docs tier. Secondary and analysis sources may support a claim,
          never carry it alone.
        </Notice>
      )}

      {claimKind === 'empirical' && (
        <Notice tone="neutral" title="Empirical claim">
          This is a claim about observed behaviour or market state, where no specification exists to cite.
          Primary analysis is sufficient here, and the exemption is declared rather than taken silently.
        </Notice>
      )}

      <ul className="flex flex-col divide-y divide-[var(--color-rule)]">
        {resolved.map((s) => (
          <li key={s.id} className="py-2.5 first:pt-0">
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[13px] leading-snug text-[var(--color-ink)] hover:text-[var(--color-accent)]"
            >
              {s.title}
            </a>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <Badge tone={TIER_TONE[s.tier]}>{TIER_LABEL[s.tier]}</Badge>
              {s.vendor && (
                <Badge tone="warn" title="Published by a party that sells the thing described">
                  vendor
                </Badge>
              )}
            </div>
          </li>
        ))}
        {missing.map((id) => (
          <li key={id} className="py-2.5">
            <span className="font-mono text-[12.5px] text-[var(--color-ink-3)]">{id}</span>{' '}
            <Badge tone="danger">source id not found</Badge>
          </li>
        ))}
      </ul>

    </div>
  );
}
