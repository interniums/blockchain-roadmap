import Link from 'next/link';
import { hrefForPractice, lessonsOfPractice, getLesson } from '@/lib/content/load';
import type { Practice } from '@/lib/content/types';
import { Pill } from './Chrome';

const KIND_BLURB: Record<Practice['kind'], string> = {
  implement: 'build it',
  break: 'break it on purpose',
  fix: 'repair a broken one',
  read: 'read real code',
  measure: 'measure it',
  write: 'write it down',
};

function Difficulty({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center gap-1" title={`Difficulty ${n} of 5`}>
      <span className="text-[11px] text-[var(--color-ink-3)]">Difficulty</span>
      <span className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full border border-[var(--color-rule)] ${
              i <= n ? 'bg-[var(--color-ink-2)]' : 'bg-transparent'
            }`}
          />
        ))}
      </span>
      <span className="sr-only">{n} of 5</span>
    </span>
  );
}

/** The lessons a block exercise actually covers, derived from the concepts it names. */
function Span({ practiceId }: { practiceId: string }) {
  const ids = lessonsOfPractice(practiceId);
  if (ids.length === 0) return null;
  const titles = ids.map((id) => getLesson(id)?.lesson.title).filter(Boolean) as string[];
  return (
    <p className="mt-1.5 text-[11.5px] leading-snug text-[var(--color-ink-3)]">
      Over: {titles.join(' · ')}
    </p>
  );
}

function Row({ p }: { p: Practice }) {
  const isCapstone = p.grain === 'module';
  return (
    <li
      className={`rounded border p-3 ${
        isCapstone
          ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]'
          : 'border-[var(--color-rule)] bg-[var(--color-surface)]'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="accent" title={KIND_BLURB[p.kind]}>{p.kind}</Pill>
        <Difficulty n={p.difficulty ?? 0} />
        {p.hints && p.hints.length > 0 && (
          <span className="text-[11px] text-[var(--color-ink-3)]">
            {p.hints.length}-step hint ladder
          </span>
        )}
        {p.acceptance?.criteria && p.acceptance.criteria.length > 0 && (
          <span className="text-[11px] text-[var(--color-ink-3)]">
            {p.acceptance.criteria.length} acceptance{' '}
            {p.acceptance.criteria.length === 1 ? 'criterion' : 'criteria'}
          </span>
        )}
      </div>
      <h3 className="mt-1.5 text-[14px] font-medium leading-5">
        <Link href={hrefForPractice(p.id) ?? '/'} className="text-[var(--color-ink)] hover:text-[var(--color-accent)]">
          {p.title}
        </Link>
      </h3>
      {isCapstone
        ? p.coversConcepts && p.coversConcepts.length > 0 && (
          <p className="mt-1.5 text-[11.5px] leading-snug text-[var(--color-ink-3)]">
            Over all {p.coversConcepts.length} concepts this module teaches, at once.
          </p>
        )
        : <Span practiceId={p.id} />}
      {p.spec && (
        <p className="mt-1 line-clamp-2 max-w-[70ch] text-[12.5px] leading-5 text-[var(--color-ink-2)]">
          {p.spec}
        </p>
      )}
    </li>
  );
}

/**
 * Practice as a ladder rather than a list.
 *
 * A module's exercises are not interchangeable: the block ones sit over two or three lessons that
 * share a mechanism, and the capstone sits over the whole module at once. Rendering them flat —
 * which is what this did, and what the lesson page did for up to 23 of them — hides the only thing
 * about them a reader needs in order to choose.
 *
 * The raw acceptance command is also gone from here. It is up to 270 characters on some of these,
 * and a wall of bash is not how you decide which exercise to open.
 */
export function PracticeList({
  practices, missingIds,
}: { practices: Practice[]; missingIds: string[] }) {
  if (practices.length === 0 && missingIds.length === 0) {
    return (
      <p className="rounded border border-dashed border-[var(--color-rule)] px-3 py-4 text-[13px] text-[var(--color-ink-3)]">
        No practice authored for this module yet. Every module is meant to carry at least one.
      </p>
    );
  }

  const blocks = practices.filter((p) => (p.grain ?? 'block') === 'block');
  const capstone = practices.find((p) => p.grain === 'module');

  return (
    <div className="flex flex-col gap-5">
      {blocks.length > 0 && (
        <section aria-labelledby="ladder-blocks">
          <h3 id="ladder-blocks" className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
            Over a few lessons at a time
          </h3>
          <ul className="mt-2 flex flex-col gap-3">
            {blocks.map((p) => <Row key={p.id} p={p} />)}
          </ul>
        </section>
      )}

      <section aria-labelledby="ladder-capstone">
        <h3 id="ladder-capstone" className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
          The capstone
        </h3>
        {capstone ? (
          <ul className="mt-2">
            <Row p={capstone} />
          </ul>
        ) : (
          <p className="mt-2 rounded border border-dashed border-[var(--color-warn)] px-3 py-2.5 text-[12.5px] leading-relaxed text-[var(--color-warn)]">
            Not written yet. This module has exercises over parts of it but nothing that puts the
            whole thing under load at once, which is the step that would let you call it finished.
          </p>
        )}
      </section>

      {missingIds.length > 0 && (
        <ul className="flex flex-col gap-2">
          {missingIds.map((id) => (
            <li
              key={id}
              className="rounded border border-dashed border-[var(--color-rule)] p-3 text-[12.5px] text-[var(--color-ink-3)]"
            >
              <span className="font-mono">{id}</span> — listed by this module, but no practice
              spec has been written for it yet.
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
