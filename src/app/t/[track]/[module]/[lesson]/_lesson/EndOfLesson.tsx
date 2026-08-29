import Link from 'next/link';
import { can, WEB_NOTICE } from '@/lib/capabilities';
import type { Practice } from '@/lib/content/types';
import { Chip, Notice } from './bits';

/**
 * The end of a lesson is one decision, not four cards. The lesson's own closing section is the
 * ending; this is only the pointer at the thing that proves it — the practice. Nothing here
 * restates a concept the reader has just read, because reading the answer next to the prompt
 * turns retrieval into recognition.
 *
 * Until the practice ladder is grained per lesson, this points at the module's build work.
 */
export function EndOfLesson({
  practices, moduleTitle, moduleHref,
}: {
  practices: Practice[];
  moduleTitle: string;
  moduleHref: string;
}) {
  return (
    <section aria-labelledby="end-of-lesson" className="mt-8 border-t border-[var(--color-rule)] pt-5">
      <h2 id="end-of-lesson" className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
        Prove it
      </h2>

      {practices.length === 0 ? (
        <Notice tone="warn">
          {moduleTitle} carries no practice. Every module is meant to carry at least one — reading
          without building is how understanding goes unproven.
        </Notice>
      ) : (
        <ul className="mt-2 flex flex-col gap-1.5">
          {practices.map((p) => (
            <li key={p.id}>
              <Link
                href={`/p/${p.id}`}
                className="flex flex-wrap items-baseline gap-2 text-[14px] text-[var(--color-ink)] hover:text-[var(--color-accent)]"
              >
                <Chip>{p.kind}</Chip>
                <span>{p.title}</span>
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

      <p className="mt-3 flex flex-wrap gap-x-4 text-[12.5px] text-[var(--color-ink-3)]">
        <Link href={moduleHref} className="hover:text-[var(--color-accent)]">↑ {moduleTitle}</Link>
        <Link href="/review" className="hover:text-[var(--color-accent)]">Drill</Link>
      </p>
    </section>
  );
}
