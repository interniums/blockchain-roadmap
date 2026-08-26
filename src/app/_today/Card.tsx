import Link from 'next/link';

/** One card on Today. Every card is a labelled region, so the page is navigable by landmark. */
export function Card({
  id, title, hint, className, children,
}: {
  id: string;
  title: string;
  /** Right-aligned qualifier in the header — a count, a state, a source of truth. */
  hint?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={`${id}-h`}
      className={`flex flex-col rounded-lg border border-[var(--color-rule)] bg-[var(--color-surface)] p-4 ${className ?? ''}`}
    >
      <header className="mb-3 flex items-baseline justify-between gap-3 border-b border-[var(--color-rule)] pb-2">
        <h2 id={`${id}-h`} className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-3)]">
          {title}
        </h2>
        {hint && <span className="text-[11px] text-[var(--color-ink-3)]">{hint}</span>}
      </header>
      <div className="flex min-h-0 flex-1 flex-col gap-3">{children}</div>
    </section>
  );
}

/** A number that is allowed to be zero, with the unit spelled out next to it. */
export function Count({ value, unit, muted }: { value: number; unit: string; muted?: boolean }) {
  return (
    <p className="flex items-baseline gap-2">
      <span className={`text-[30px] leading-none tabular-nums ${muted ? 'text-[var(--color-ink-3)]' : 'text-[var(--color-ink)]'}`}>
        {value.toLocaleString('en-GB')}
      </span>
      <span className="text-[13px] text-[var(--color-ink-2)]">{unit}</span>
    </p>
  );
}

/**
 * The same slot as `Count`, before anyone has looked. A dash, not a zero — "we have not read your
 * record yet" and "your record says none" are different facts and must not share a glyph.
 */
export function Unknown({ unit }: { unit: string }) {
  return (
    <p className="flex items-baseline gap-2">
      <span aria-hidden="true" className="text-[30px] leading-none text-[var(--color-ink-3)]">—</span>
      <span className="sr-only">not read yet</span>
      <span className="text-[13px] text-[var(--color-ink-2)]">{unit}</span>
    </p>
  );
}

/** Says what is missing and why, rather than showing a blank frame. */
export function Empty({ headline, children }: { headline: string; children?: React.ReactNode }) {
  return (
    <div className="rounded border border-dashed border-[var(--color-rule)] p-3">
      <p className="text-[13px] text-[var(--color-ink-2)]">{headline}</p>
      {children && <div className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--color-ink-3)]">{children}</div>}
    </div>
  );
}

export function Note({ children, tone = 'plain' }: { children: React.ReactNode; tone?: 'plain' | 'warn' }) {
  const colour = tone === 'warn' ? 'text-[var(--color-warn)]' : 'text-[var(--color-ink-3)]';
  return <p className={`text-[12.5px] leading-relaxed ${colour}`}>{children}</p>;
}

/** Small inline link used for concept and route references. */
export function Chip({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded border border-[var(--color-rule)] bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[12px] text-[var(--color-ink-2)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
    >
      {children}
    </Link>
  );
}

/**
 * A control that only works with the local install. In web mode it renders as a real,
 * visibly disabled button with the reason in words next to it — never a live control
 * that quietly does nothing.
 */
export function LocalOnlyAction({
  id, label, href, available, notice,
}: {
  id: string;
  label: string;
  href: string;
  available: boolean;
  notice: string;
}) {
  if (available) {
    return (
      <Link
        href={href}
        className="self-start rounded border border-[var(--color-rule)] px-2.5 py-1 text-[13px] text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
      >
        {label}
      </Link>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        disabled
        aria-describedby={id}
        className="self-start cursor-not-allowed rounded border border-[var(--color-rule)] px-2.5 py-1 text-[13px] text-[var(--color-ink-3)]"
      >
        {label}
      </button>
      <p id={id} className="text-[12.5px] leading-relaxed text-[var(--color-warn)]">{notice}</p>
    </div>
  );
}
