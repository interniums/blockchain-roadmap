import Link from 'next/link';
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

/**
 * Practice is not reading. It sits in its own block, on its own surface, after the lessons.
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

  return (
    <ul className="flex flex-col gap-3">
      {practices.map((p) => (
        <li
          key={p.id}
          className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] p-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="accent" title={KIND_BLURB[p.kind]}>{p.kind}</Pill>
            <Difficulty n={p.difficulty ?? 0} />
            {p.concepts && p.concepts.length > 0 && (
              <span className="text-[11px] text-[var(--color-ink-3)]">
                {p.concepts.length} {p.concepts.length === 1 ? 'concept' : 'concepts'}
              </span>
            )}
            {p.hints && p.hints.length > 0 && (
              <span className="text-[11px] text-[var(--color-ink-3)]">
                {p.hints.length}-step hint ladder
              </span>
            )}
          </div>
          <h3 className="mt-1.5 text-[14px] font-medium leading-5">
            <Link href={`/p/${p.id}`} className="text-[var(--color-ink)] hover:text-[var(--color-accent)]">
              {p.title}
            </Link>
          </h3>
          {p.spec && (
            <p className="mt-1 line-clamp-2 max-w-[70ch] text-[12.5px] leading-5 text-[var(--color-ink-2)]">
              {p.spec}
            </p>
          )}
          {p.acceptance?.command && (
            <div className="mt-2 overflow-x-auto rounded border border-[var(--color-rule)] bg-[var(--color-surface-2)]">
              <pre className="w-max px-2 py-1 font-mono text-[12px] text-[var(--color-ink-2)]">
                <code>{p.acceptance.command}</code>
              </pre>
            </div>
          )}
          {p.acceptance?.criteria && p.acceptance.criteria.length > 0 && (
            <p className="mt-1.5 text-[11px] text-[var(--color-ink-3)]">
              {p.acceptance.criteria.length} acceptance{' '}
              {p.acceptance.criteria.length === 1 ? 'criterion' : 'criteria'}
            </p>
          )}
        </li>
      ))}

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
  );
}
