'use client';
/**
 * The mastery indicator that rides on every concept row in the neighbourhood lists.
 *
 * It exists so a weak prerequisite is visible without opening it. Kept to a bar plus
 * a few words: the plan rejects a mini-graph here, and a row of coloured dots with no
 * legend is the same mistake in a smaller space.
 */
import { BAND_TONE, bandOf, creditLevel, masteryText, pct, standingOf } from './mastery';
import { useMasteryScope } from './MasteryScope';

function Bar({ value, tone }: { value: number; tone: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-[3px] w-8 overflow-hidden rounded-full bg-[var(--color-surface-2)] align-middle"
    >
      <span
        className="block h-full rounded-full"
        style={{ width: `${Math.max(2, pct(value))}%`, background: tone }}
      />
    </span>
  );
}

export function MasteryTag({ id }: { id: string }) {
  const scope = useMasteryScope();
  if (!scope) return null;

  if (scope.status === 'loading') {
    // Nothing is known yet. A placeholder, not a zero, and silent to screen readers.
    return <span aria-hidden="true" className="text-[11px] text-[var(--color-ink-3)]">·</span>;
  }
  if (scope.status === 'error') {
    return (
      <span className="text-[11px] text-[var(--color-ink-3)]" title="Your record could not be read.">
        record unread
      </span>
    );
  }

  const row = scope.get(id);
  const standing = standingOf(row);

  if (standing === 'untracked') {
    return (
      <span
        className="text-[11px] text-[var(--color-ink-3)]"
        title="Not in your review system. Nothing has introduced it and you have not graded it."
      >
        not started
      </span>
    );
  }

  if (standing === 'unproven') {
    return (
      <span
        className="text-[11px] text-[var(--color-warn)]"
        title="In your review system, but you have never been asked to produce it. Unknown, not zero."
      >
        unproven
      </span>
    );
  }

  const m = row!;
  const level = creditLevel(m.creditedShare);
  const tone = BAND_TONE[bandOf(m.mastery)];
  const share = pct(m.creditedShare);

  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] text-[var(--color-ink-3)]"
      title={
        `${masteryText(m.mastery)} · ${bandOf(m.mastery)} · ${m.reps} direct retrieval${m.reps === 1 ? '' : 's'}` +
        (level === 'none' ? ' · all of it earned by retrieval' : ` · ${share}% of its stability is prerequisite credit`)
      }
    >
      <Bar value={m.mastery} tone={tone} />
      <span>{masteryText(m.mastery)}</span>
      {level === 'most' && <span className="text-[var(--color-warn)]">· mostly credit</span>}
    </span>
  );
}
