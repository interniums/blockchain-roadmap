import Link from 'next/link';
import { can } from '@/lib/capabilities';
import { Card, Count, LocalOnlyAction, Note } from './Card';
import { formatDay, plural } from './format';
import type { ContentHealth } from './model';

/**
 * Real staleness, not a stub: every source a concept cites inherits the tightest
 * re-verify window of its citing concepts (§12 — stable 365 days, evolving 120, hot 45).
 * Today that is zero overdue, and the useful number is the date the first one falls due.
 */
export function HealthCard({ health, className }: { health: ContentHealth; className?: string }) {
  const clear = health.stale === 0;

  return (
    <Card
      id="health"
      title="Stale content"
      hint={`checked ${formatDay(health.checkedAt)}`}
      className={className}
    >
      <Count value={health.stale} unit="sources past re-verify" muted={clear} />

      {clear ? (
        <Note>
          None of the {health.tracked.toLocaleString('en-GB')} cited sources is overdue. The first falls due{' '}
          {formatDay(health.nextDueAt)}, on the 45-day window a hot concept carries.
        </Note>
      ) : (
        <Note tone="warn">
          {health.stale} {plural(health.stale, 'source is', 'sources are')} past{' '}
          <span className="font-mono">verifiedAt + window</span> and {plural(health.stale, 'renders', 'render')} a
          staleness badge. This never fails the build.
        </Note>
      )}

      {health.unstamped > 0 && (
        <Note tone="warn">
          {health.unstamped} cited {plural(health.unstamped, 'source carries', 'sources carry')} no verification
          stamp at all.
        </Note>
      )}

      {health.needsSource > 0 && (
        <Note tone="warn">
          {health.needsSource.toLocaleString('en-GB')} concepts are flagged{' '}
          <span className="font-mono">needsSource</span> — the claim is written, the citation is not.
        </Note>
      )}

      <div className="mt-auto flex flex-col gap-2 pt-1">
        <Link href="/sources" className="text-[13px] text-[var(--color-ink-2)] hover:text-[var(--color-accent)]">
          Open the freshness board
        </Link>
        <LocalOnlyAction
          id="reverify-notice"
          label="Work the re-verify queue"
          href="/sources"
          available={can.reverifySources}
          notice="This needs the local install — re-verifying stamps verifiedAt back into the content files in your repo, which a hosted copy cannot write."
        />
      </div>
    </Card>
  );
}
