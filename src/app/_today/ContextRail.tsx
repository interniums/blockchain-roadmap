import Link from 'next/link';
import { can, MODE } from '@/lib/capabilities';
import { formatDay } from './format';
import type { ContentHealth, CurriculumState } from './model';

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <dt className="text-[12.5px] text-[var(--color-ink-3)]">{label}</dt>
      <dd className="text-[13px] tabular-nums">{value}</dd>
    </div>
  );
}

/** Only keys that actually do something on this page are listed. */
const KEYS: { key: string; does: string }[] = [
  { key: '⌘K', does: 'Command palette' },
  { key: 'J', does: 'Straight into the next lesson' },
  { key: 'M', does: 'Open the roadmap' },
  { key: 'R', does: 'Start the review queue' },
];

export function ContextRail({
  curriculum, health, idPrefix,
}: {
  curriculum: CurriculumState;
  health: ContentHealth;
  /** The rail renders twice — in the sidebar and inline below the cards on narrow desktops.
      Each instance needs its own heading ids for aria-labelledby to stay valid. */
  idPrefix: string;
}) {
  const n = (v: number) => v.toLocaleString('en-GB');

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby={`${idPrefix}-content-h`}>
        <h2 id={`${idPrefix}-content-h`} className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-3)]">
          The content
        </h2>
        <dl className="divide-y divide-[var(--color-rule)] border-y border-[var(--color-rule)]">
          <Row label="Tracks" value={n(curriculum.tracks)} />
          <Row label="Modules" value={n(curriculum.modules)} />
          <Row
            label="Lessons"
            value={
              <span>
                {n(curriculum.lessons)}{' '}
                <span className="text-[12px] text-[var(--color-warn)]">
                  ({n(curriculum.written)} written)
                </span>
              </span>
            }
          />
          <Row label="Concepts" value={n(curriculum.concepts)} />
          <Row label="Practices" value={n(curriculum.practices)} />
          <Row label="Sources" value={n(curriculum.sources)} />
        </dl>
        <p className="mt-2 text-[12px] leading-relaxed text-[var(--color-ink-3)]">
          {curriculum.written === 0
            ? 'Every lesson is outlined and none is written. Titles, concepts, prerequisites and reading times are real; the prose is not there yet.'
            : `${n(curriculum.lessons - curriculum.written)} lessons are still outline only.`}{' '}
          Last freshness check {formatDay(health.checkedAt)}.
        </p>
      </section>

      <section aria-labelledby={`${idPrefix}-keys-h`}>
        <h2 id={`${idPrefix}-keys-h`} className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-3)]">
          Keys that work here
        </h2>
        <dl className="flex flex-col gap-1">
          {KEYS.map((k) => (
            <div key={k.key} className="flex items-baseline gap-2">
              <dt>
                <kbd className="rounded border border-[var(--color-rule)] bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[11px] text-[var(--color-ink-2)]">
                  {k.key}
                </kbd>
              </dt>
              <dd className="text-[12.5px] text-[var(--color-ink-3)]">{k.does}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby={`${idPrefix}-mode-h`}>
        <h2 id={`${idPrefix}-mode-h`} className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-3)]">
          This copy
        </h2>
        <p className="text-[12.5px] leading-relaxed text-[var(--color-ink-3)]">
          {MODE === 'local' ? (
            <>
              Running locally. Practice checks run against your repo, notes and questions are written to disk,
              and progress is durable.
            </>
          ) : (
            <>
              Read-only web copy. Practice checks and source re-verification need the local install; anything
              you record here stays in this browser.
            </>
          )}
        </p>
        <p className="mt-2 text-[12px] text-[var(--color-ink-3)]">
          Practice runner: {can.runPractice ? 'available' : 'unavailable'} · Re-verify:{' '}
          {can.reverifySources ? 'available' : 'unavailable'}
        </p>
        <p className="mt-3 text-[12.5px]">
          <Link href="/m" className="text-[var(--color-ink-2)] hover:text-[var(--color-accent)]">
            The whole roadmap →
          </Link>
        </p>
      </section>
    </div>
  );
}
