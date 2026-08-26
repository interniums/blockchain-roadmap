import type { ReactNode } from 'react';
import type { LessonStatus } from '@/lib/content/types';

/**
 * Structural primitives for the module screen only. Colour comes from the
 * globals.css tokens; nothing here invents a visual identity.
 */

export type Tone = 'neutral' | 'accent' | 'warn' | 'good' | 'danger' | 'ghost';

const TONE: Record<Tone, string> = {
  neutral: 'border-[var(--color-rule)] bg-[var(--color-surface-2)] text-[var(--color-ink-2)]',
  accent: 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]',
  warn: 'border-[var(--color-warn)] bg-[var(--color-warn-soft)] text-[var(--color-warn)]',
  good: 'border-[var(--color-good)] bg-transparent text-[var(--color-good)]',
  danger: 'border-[var(--color-danger)] bg-transparent text-[var(--color-danger)]',
  ghost: 'border-dashed border-[var(--color-rule)] bg-transparent text-[var(--color-ink-3)]',
};

export function Pill({
  tone = 'neutral', children, title,
}: { tone?: Tone; children: ReactNode; title?: string }) {
  return (
    <span
      title={title}
      className={`inline-flex shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] leading-4 ${TONE[tone]}`}
    >
      {children}
    </span>
  );
}

/** A page section with a ruled heading. Every section is a real landmark. */
export function Section({
  id, title, meta, lede, children,
}: { id: string; title: string; meta?: ReactNode; lede?: ReactNode; children: ReactNode }) {
  return (
    <section aria-labelledby={`${id}-heading`} className="mt-12">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[var(--color-rule)] pb-2">
        <h2 id={`${id}-heading`} className="text-[15px] font-semibold tracking-tight text-[var(--color-ink)]">
          {title}
        </h2>
        {meta && <span className="text-[12px] text-[var(--color-ink-3)]">{meta}</span>}
      </div>
      {lede && <p className="mt-2 max-w-[68ch] text-[13px] leading-6 text-[var(--color-ink-2)]">{lede}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** A stated limitation. Never decorative — it exists so nothing degrades silently. */
export function Note({ tone = 'warn', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <p
      className={`rounded border px-3 py-2 text-[12.5px] leading-5 ${TONE[tone]}`}
      role="note"
    >
      {children}
    </p>
  );
}

export const LESSON_STATUS: Record<LessonStatus, { label: string; tone: Tone; written: boolean }> = {
  outlined: { label: 'Outline only', tone: 'warn', written: false },
  drafted: { label: 'Draft', tone: 'neutral', written: true },
  reviewed: { label: 'Reviewed', tone: 'accent', written: true },
  published: { label: 'Published', tone: 'good', written: true },
};

export function minutes(total: number): string {
  if (total < 60) return `${total} min`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}
