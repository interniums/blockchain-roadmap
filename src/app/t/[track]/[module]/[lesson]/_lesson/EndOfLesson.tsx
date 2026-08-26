import Link from 'next/link';
import { can, WEB_NOTICE } from '@/lib/capabilities';
import type { ConceptView, Practice } from '@/lib/content/types';
import { Chip, Notice } from './bits';
import { ReviewEntry } from './ReviewEntry';

/**
 * The plan's ending, in order: explain-why prompt → the module's practice → concepts entering
 * review → Next. Every page has an end, and the end says what comes next.
 */

export function EndOfLesson({
  taught, practices, moduleTitle, moduleHref, reflectionPrompt,
}: {
  taught: ConceptView[];
  practices: Practice[];
  moduleTitle: string;
  moduleHref: string;
  reflectionPrompt?: string;
}) {
  return (
    <section aria-labelledby="end-of-lesson" className="mt-8 border-t border-[var(--color-rule)] pt-5">
      <h2 id="end-of-lesson" className="text-[15px] font-semibold">Before you move on</h2>

      <div className="mt-3 rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-2.5">
        <h3 className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">Explain why</h3>
        {taught.length === 0 ? (
          <Notice>No concepts to explain — this lesson teaches none.</Notice>
        ) : (
          <>
            <p className="mt-1 text-[13px] text-[var(--color-ink-2)]">
              Without scrolling back, say why each of these is true — not what it is:
            </p>
            <ul className="mt-1.5 flex flex-col gap-1">
              {taught.map((c) => (
                <li key={c.id} className="text-[13px]">
                  <Link href={`/c/${c.id}`} className="hover:text-[var(--color-accent)]">{c.title}</Link>
                  <span className="text-[var(--color-ink-3)]"> — {c.oneLine}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        {reflectionPrompt && (
          <p className="mt-2 border-t border-[var(--color-rule)] pt-2 text-[13px] text-[var(--color-ink-2)]">
            <span className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
              Module reflection ·{' '}
            </span>
            {reflectionPrompt}
          </p>
        )}
      </div>

      <div className="mt-3 rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-2.5">
        <h3 className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
          Practice for {moduleTitle}
        </h3>
        {practices.length === 0 ? (
          <Notice tone="warn">
            This module has no practice. Every module is meant to carry at least one — reading without
            building is how understanding goes unproven.
          </Notice>
        ) : (
          <ul className="mt-1.5 flex flex-col gap-1.5">
            {practices.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/p/${p.id}`}
                  className="flex flex-wrap items-baseline gap-2 text-[13px] hover:text-[var(--color-accent)]"
                >
                  <Chip>{p.kind}</Chip>
                  <span>{p.title}</span>
                  {typeof p.difficulty === 'number' && (
                    <span className="text-[11px] text-[var(--color-ink-3)]">difficulty {p.difficulty}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {practices.length > 0 && !can.runPractice && (
          <Notice tone="warn">
            You can read the spec and the acceptance criteria here. Running the check needs the local
            install — {WEB_NOTICE}
          </Notice>
        )}
      </div>

      <div className="mt-3 rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-2.5">
        <h3 className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
          Entering review
        </h3>
        <ReviewEntry concepts={taught.map((c) => ({ id: c.id, title: c.title }))} />
        <p className="mt-1.5 flex flex-wrap gap-x-4 text-[12.5px] text-[var(--color-ink-3)]">
          <Link href="/review" className="hover:text-[var(--color-accent)]">Review queue →</Link>
          <Link href={moduleHref} className="hover:text-[var(--color-accent)]">Back up to {moduleTitle} →</Link>
        </p>
      </div>
    </section>
  );
}
