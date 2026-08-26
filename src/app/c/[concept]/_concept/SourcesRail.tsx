import { getSource } from '@/lib/content/load';
import type { Source, Volatility } from '@/lib/content/types';
import { can } from '@/lib/capabilities';
import { Badge, BlockedAction, Notice } from './ui';
import { CARRYING_TIERS, TIER_LABEL, TIER_RANK, TIER_TONE } from './sourceMeta';
import { WINDOW_DAYS, freshness } from './volatility';

export function SourcesRail({
  sourceIds, volatility, needsSource, claimKind, builtAt,
}: {
  sourceIds: string[];
  volatility: Volatility;
  needsSource?: boolean;
  claimKind?: string;
  builtAt: Date;
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
        {resolved.map((s) => {
          const f = freshness(s.verifiedAt, volatility, builtAt);
          return (
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
                {f.overdueDays !== null && (
                  <Badge tone="danger">past re-verify by {f.overdueDays}d</Badge>
                )}
              </div>
              <dl className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-2 text-[11.5px] text-[var(--color-ink-3)]">
                {s.publishedAt && (
                  <>
                    <dt>Published</dt>
                    <dd>{s.publishedAt}</dd>
                  </>
                )}
                {s.verifiedAt && (
                  <>
                    <dt>Verified</dt>
                    <dd>{s.verifiedAt}</dd>
                  </>
                )}
                {f.dueOn && (
                  <>
                    <dt>Re-verify by</dt>
                    <dd>{f.dueOn}</dd>
                  </>
                )}
              </dl>
            </li>
          );
        })}
        {missing.map((id) => (
          <li key={id} className="py-2.5">
            <span className="font-mono text-[12.5px] text-[var(--color-ink-3)]">{id}</span>{' '}
            <Badge tone="danger">source id not found</Badge>
          </li>
        ))}
      </ul>

      <p className="text-[11.5px] leading-snug text-[var(--color-ink-3)]">
        Window: {WINDOW_DAYS[volatility]} days, set by this concept&rsquo;s volatility. Freshness is computed
        when the site is built, not when you read it.
      </p>

      {!can.reverifySources && (
        <BlockedAction
          label="Re-verify sources"
          reason="Re-verifying opens each source, then stamps a new verifiedAt into the content files. This copy is a read-only web build with no repo to write to, so the action needs the local install."
        />
      )}
    </div>
  );
}
