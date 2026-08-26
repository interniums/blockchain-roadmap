/** Structural primitives local to the concept screen. No visual identity — tokens only. */
import type { ReactNode } from 'react';

export function Badge({
  children, tone = 'neutral', title,
}: { children: ReactNode; tone?: 'neutral' | 'accent' | 'warn' | 'danger' | 'good'; title?: string }) {
  const tones: Record<string, string> = {
    neutral: 'border-[var(--color-rule)] text-[var(--color-ink-3)]',
    accent: 'border-[var(--color-accent)] text-[var(--color-accent)]',
    warn: 'border-[var(--color-warn)] text-[var(--color-warn)]',
    danger: 'border-[var(--color-danger)] text-[var(--color-danger)]',
    good: 'border-[var(--color-good)] text-[var(--color-good)]',
  };
  return (
    <span
      title={title}
      className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] leading-none whitespace-nowrap ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** A titled block in the main column. */
export function Section({
  id, title, count, caption, children,
}: { id: string; title: string; count?: number; caption?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="mt-10 border-t border-[var(--color-rule)] pt-6">
      <div className="flex items-baseline gap-2">
        <h2 id={`${id}-h`} className="text-[13px] font-semibold uppercase tracking-wider text-[var(--color-ink-2)]">
          {title}
        </h2>
        {count !== undefined && <span className="text-[12px] text-[var(--color-ink-3)]">{count}</span>}
      </div>
      {caption && <p className="mt-1 text-[12.5px] text-[var(--color-ink-3)]">{caption}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** A titled block in the context rail. */
export function RailBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="border-t border-[var(--color-rule)] pt-4">
      <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-3)]">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** Says plainly that something is absent. Never a blank space pretending to be finished. */
export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded border border-dashed border-[var(--color-rule)] px-3 py-2.5 text-[13px] text-[var(--color-ink-3)]">
      {children}
    </p>
  );
}

export function Notice({
  tone = 'warn', title, children,
}: { tone?: 'warn' | 'danger' | 'neutral'; title: string; children: ReactNode }) {
  const tones: Record<string, string> = {
    warn: 'border-[var(--color-warn)] bg-[var(--color-warn-soft)] text-[var(--color-warn)]',
    danger: 'border-[var(--color-danger)] text-[var(--color-danger)]',
    neutral: 'border-[var(--color-rule)] bg-[var(--color-surface-2)] text-[var(--color-ink-2)]',
  };
  return (
    <div className={`rounded border px-3.5 py-3 text-[13px] leading-relaxed ${tones[tone]}`}>
      <p className="font-semibold">{title}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

/**
 * A control that exists but cannot act here. Rendered as a real disabled button
 * with the reason in words — never hidden, never a silent no-op.
 */
export function BlockedAction({ label, reason }: { label: string; reason: string }) {
  return (
    <div>
      <button
        type="button"
        disabled
        aria-describedby={`why-${label.replace(/\W+/g, '-')}`}
        className="w-full cursor-not-allowed rounded border border-[var(--color-rule)] px-3 py-1.5 text-[13px] text-[var(--color-ink-3)]"
      >
        {label}
      </button>
      <p id={`why-${label.replace(/\W+/g, '-')}`} className="mt-1.5 text-[12px] leading-snug text-[var(--color-ink-3)]">
        {reason}
      </p>
    </div>
  );
}
