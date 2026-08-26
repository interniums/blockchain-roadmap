import Link from 'next/link';
import type { ConceptView, Lesson } from '@/lib/content/types';
import { Chip, Notice, VolatilityChip } from './bits';

/**
 * Lessons are status "outlined": titles, concepts, prerequisites and reading time exist, prose does
 * not. This renders the outline as the real thing it is — a plan — and says plainly what is absent.
 * It is the scaffold the drafting pass fills in; every gap is labelled so it is obvious what is
 * missing rather than looking like a finished page that happens to be short.
 */

const MISSING_PARTS = [
  'the written explanation',
  'diagrams',
  'worked code',
  'inline checks',
];

export function OutlineBody({
  lesson, taught, unresolvedTaught,
}: { lesson: Lesson; taught: ConceptView[]; unresolvedTaught: string[] }) {
  const written = lesson.status !== 'outlined';

  return (
    <>
      <section
        aria-labelledby="body-status"
        className="rounded border border-[var(--color-warn)] bg-[var(--color-warn-soft)] px-4 py-3"
      >
        <h2 id="body-status" className="text-[13px] font-semibold text-[var(--color-warn)]">
          {written ? 'This lesson is not finished.' : 'This lesson is not written yet.'}
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-ink-2)]">
          Its status is <strong>{lesson.status}</strong>. What is decided: the {taught.length} concept
          {taught.length === 1 ? '' : 's'} below, in this order, what the lesson assumes, and its
          {lesson.readingMin ? ` ${lesson.readingMin}-minute` : ''} budget. What is missing:{' '}
          {MISSING_PARTS.join(', ')}. Everything below this line is the authored outline — real content,
          but an outline, not the reading.
        </p>
      </section>

      <section aria-labelledby="body-outline" className="mt-6">
        <h2 id="body-outline" className="text-[15px] font-semibold">
          What this lesson will cover
        </h2>
        <p className="mt-1 text-[12.5px] text-[var(--color-ink-3)]">
          One numbered entry per concept, in teaching order. Each is a claim you can be right or wrong
          about — that is what makes it a unit of review.
        </p>

        {taught.length === 0 && unresolvedTaught.length === 0 ? (
          <p className="mt-3 rounded border border-dashed border-[var(--color-danger)] px-3 py-2 text-[13px] text-[var(--color-danger)]">
            This lesson declares no concepts. A lesson that teaches nothing is a content bug — it has
            nothing to review and nothing to link to.
          </p>
        ) : (
          <ol className="mt-3 flex flex-col gap-5">
            {taught.map((c, i) => (
              <li key={c.id}>
                <article className="border-l-2 border-[var(--color-rule)] pl-3">
                  <h3 className="flex flex-wrap items-baseline gap-2">
                    <span className="text-[11px] tabular-nums text-[var(--color-ink-3)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <Link
                      href={`/c/${c.id}`}
                      className="text-[15px] font-semibold hover:text-[var(--color-accent)]"
                    >
                      {c.title}
                    </Link>
                    <VolatilityChip volatility={c.volatility} />
                    {c.needsSource && (
                      <Chip tone="warn" title="No verified source attached yet — this must be closed before drafting.">
                        needs source
                      </Chip>
                    )}
                  </h3>

                  <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--color-ink)]">{c.oneLine}</p>

                  {c.statement ? (
                    <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-ink-2)]">
                      {c.statement}
                    </p>
                  ) : (
                    <Notice tone="warn">
                      No statement authored yet — this concept is a one-liner so far.
                    </Notice>
                  )}

                  {(c.misconceptions?.length ?? 0) > 0 && (
                    <ul className="mt-3 flex flex-col gap-2">
                      {(c.misconceptions ?? []).map((m) => (
                        <li
                          key={m.belief}
                          className="rounded border border-[var(--color-rule)] bg-[var(--color-surface-2)] px-3 py-2"
                        >
                          <p className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
                            Common belief
                          </p>
                          <p className="text-[13px] text-[var(--color-ink-2)]">{m.belief}</p>
                          <p className="mt-1.5 text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
                            Actually
                          </p>
                          <p className="text-[13px] text-[var(--color-ink)]">{m.reality}</p>
                          {m.why && (
                            <p className="mt-1 text-[12px] text-[var(--color-ink-3)]">
                              Why it sticks: {m.why}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                  <p className="mt-2 border-t border-dashed border-[var(--color-rule)] pt-1.5 text-[11.5px] text-[var(--color-ink-3)]">
                    Not written yet for this concept: explanation, diagram, inline check.
                  </p>
                </article>
              </li>
            ))}

            {unresolvedTaught.map((id) => (
              <li key={id}>
                <article className="border-l-2 border-dashed border-[var(--color-danger)] pl-3">
                  <h3 className="text-[14px] text-[var(--color-danger)]">{id}</h3>
                  <p className="text-[12.5px] text-[var(--color-ink-3)]">
                    This lesson claims to teach a concept that does not exist in the graph. Dangling id
                    — a content bug.
                  </p>
                </article>
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}
