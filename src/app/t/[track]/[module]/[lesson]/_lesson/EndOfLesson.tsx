import Link from 'next/link';
import { can, WEB_NOTICE } from '@/lib/capabilities';
import { hrefForPractice } from '@/lib/content/load';
import type { Practice } from '@/lib/content/types';
import type { Neighbour } from './graph';

/**
 * The end of a lesson is one decision.
 *
 * The lesson's own closing section — `## Where this pays off`, present in all 635 — is the ending.
 * This is only the control after it, and it is one control, chosen by whether the module's build
 * work is the next thing or the next reading is.
 *
 * The practices offered are the ones whose span actually covers this lesson, narrowest grain first.
 * The old page fanned the module's whole list onto every lesson in it — up to 23 exercises on one
 * lesson, most of them about something you had not read yet.
 *
 * Deleted from here over this pass: an "Explain why" card that reprinted the concept one-liners the
 * reader had already seen twice on the page (putting the answer beside the prompt turns retrieval
 * into recognition), and an "Entering review" card explaining the scheduler to itself.
 */
export function EndOfLesson({
  practices, moduleTitle, moduleHref, next,
}: {
  practices: Practice[];
  moduleTitle: string;
  moduleHref: string;
  next?: Neighbour | null;
}) {
  // Build when there is something to build over what you have just read; otherwise continue. At the
  // end of a module the capstone outranks the block exercises, because that is the point of it.
  const atModuleEnd = !next || next.boundary !== null;
  const capstone = practices.find((p) => p.grain === 'module');
  const block = practices.find((p) => (p.grain ?? 'block') === 'block');
  const primary = (atModuleEnd && capstone) || block || (atModuleEnd ? capstone : null) || null;
  const primaryHref = primary ? hrefForPractice(primary.id) : null;

  return (
    <section
      aria-labelledby="end-of-lesson"
      className="mt-10 max-w-[var(--measure)] border-t border-[var(--color-rule)] pt-5"
    >
      <h2 id="end-of-lesson" className="sr-only">What comes next</h2>

      {primary && primaryHref ? (
        <>
          <Link
            href={primaryHref}
            className="inline-flex flex-col gap-0.5 rounded border border-[var(--color-accent)] bg-[var(--color-accent-soft)] px-4 py-2.5 no-underline"
          >
            <span className="text-[var(--text-marginal)] uppercase tracking-wider text-[var(--color-accent)] opacity-80">
              {primary.grain === 'module' ? 'Capstone' : 'Build it'} · {primary.kind}
            </span>
            <span className="text-[15px] text-[var(--color-ink)]">{primary.title}</span>
          </Link>
          {!can.runPractice && (
            <p className="mt-2 text-[var(--text-small)] text-[var(--color-warn)]">
              You can read the spec and its acceptance criteria. Running the check needs the local
              install — {WEB_NOTICE}
            </p>
          )}
        </>
      ) : next ? (
        <Link
          href={next.href}
          className="inline-flex flex-col gap-0.5 rounded border border-[var(--color-accent)] bg-[var(--color-accent-soft)] px-4 py-2.5 no-underline"
        >
          <span className="text-[var(--text-marginal)] uppercase tracking-wider text-[var(--color-accent)] opacity-80">
            Continue
          </span>
          <span className="text-[15px] text-[var(--color-ink)]">{next.title}</span>
        </Link>
      ) : (
        <p className="text-[15px] text-[var(--color-ink-2)]">
          That is the end of the curriculum in reading order.
        </p>
      )}

      <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[var(--text-small)] text-[var(--color-ink-3)]">
        <Link href={moduleHref} className="hover:text-[var(--color-accent)]">↑ {moduleTitle}</Link>
        <Link href="/review" className="hover:text-[var(--color-accent)]">Drill</Link>
        <Link href="/questions" className="hover:text-[var(--color-accent)]">Questions</Link>
        {primary && practices.length > 1 && (
          <Link href={moduleHref} className="hover:text-[var(--color-accent)]">
            {practices.length - 1} more over this material
          </Link>
        )}
      </p>
    </section>
  );
}
