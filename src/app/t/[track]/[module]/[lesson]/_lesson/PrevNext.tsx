import Link from 'next/link';

/**
 * Reading order, across the whole curriculum. Module and track boundaries are marked in words —
 * you should never cross one without being told.
 */

export interface Neighbour {
  href: string;
  title: string;
  moduleTitle: string;
  trackTitle: string;
  boundary: 'module' | 'track' | null;
}

function boundaryLine(n: Neighbour, direction: 'prev' | 'next') {
  if (n.boundary === 'track') {
    return direction === 'next'
      ? `End of this track — next track: ${n.trackTitle}`
      : `Previous track: ${n.trackTitle}`;
  }
  if (n.boundary === 'module') {
    return direction === 'next'
      ? `End of this module — next module: ${n.moduleTitle}`
      : `Previous module: ${n.moduleTitle}`;
  }
  return n.moduleTitle;
}

function Side({ n, direction }: { n: Neighbour | null; direction: 'prev' | 'next' }) {
  const label = direction === 'prev' ? 'Previous' : 'Next';
  const key = direction === 'prev' ? 'K' : 'J';
  const align = direction === 'prev' ? 'text-left' : 'text-right';

  if (!n) {
    return (
      <div className={`rounded border border-dashed border-[var(--color-rule)] px-3 py-2.5 ${align}`}>
        <span className="block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">{label}</span>
        <span className="block text-[13px] text-[var(--color-ink-3)]">
          {direction === 'prev'
            ? 'Nothing before this — it is the first lesson in the curriculum.'
            : 'Nothing after this — it is the last lesson in the curriculum.'}
        </span>
      </div>
    );
  }

  return (
    <Link
      href={n.href}
      rel={direction === 'prev' ? 'prev' : 'next'}
      className={`block rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-2.5 hover:border-[var(--color-accent)] ${align}`}
    >
      <span className="block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
        {label} <span aria-hidden="true">· {key}</span>
      </span>
      <span className="block text-[14px] font-medium text-[var(--color-ink)]">{n.title}</span>
      <span
        className={`mt-0.5 block text-[11.5px] ${n.boundary ? 'text-[var(--color-warn)]' : 'text-[var(--color-ink-3)]'}`}
      >
        {boundaryLine(n, direction)}
      </span>
    </Link>
  );
}

export function PrevNext({ prev, next }: { prev: Neighbour | null; next: Neighbour | null }) {
  return (
    <nav aria-label="Reading order" className="mt-6 grid gap-3 sm:grid-cols-2">
      <Side n={prev} direction="prev" />
      <Side n={next} direction="next" />
    </nav>
  );
}
