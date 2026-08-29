import type { Tier } from '@/lib/content/types';

/** Small shared primitives for the lesson screen. Structure only — no visual identity. */

export type Tone = 'neutral' | 'accent' | 'warn' | 'good' | 'danger';

const TONE: Record<Tone, string> = {
  neutral: 'border-[var(--color-rule)] text-[var(--color-ink-3)]',
  accent: 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]',
  warn: 'border-[var(--color-warn)] bg-[var(--color-warn-soft)] text-[var(--color-warn)]',
  good: 'border-[var(--color-good)] text-[var(--color-good)]',
  danger: 'border-[var(--color-danger)] text-[var(--color-danger)]',
};

export function Chip({
  children, tone = 'neutral', title,
}: { children: React.ReactNode; tone?: Tone; title?: string }) {
  return (
    <span
      title={title}
      className={`inline-block shrink-0 rounded border px-1.5 py-0.5 text-[10.5px] uppercase tracking-wider ${TONE[tone]}`}
    >
      {children}
    </span>
  );
}

const TIER_LABEL: Record<Tier, string> = {
  spec: 'Spec',
  'canonical-docs': 'Canonical docs',
  'primary-analysis': 'Primary analysis',
  secondary: 'Secondary',
};

export function TierBadge({ tier }: { tier: Tier }) {
  return <Chip tone={tier === 'spec' || tier === 'canonical-docs' ? 'accent' : 'neutral'}>{TIER_LABEL[tier] ?? tier}</Chip>;
}

/** A framed section. Used for the rail panels and the top/bottom strips. */
export function Panel({
  id, title, aside, children, tone = 'neutral',
}: {
  id: string;
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
  tone?: 'neutral' | 'warn' | 'danger';
}) {
  const border =
    tone === 'warn' ? 'border-[var(--color-warn)]'
      : tone === 'danger' ? 'border-[var(--color-danger)]'
        : 'border-[var(--color-rule)]';
  return (
    <section aria-labelledby={id} className={`rounded border ${border} bg-[var(--color-surface)]`}>
      <div className="flex items-baseline justify-between gap-3 border-b border-[var(--color-rule)] px-3 py-2">
        <h2 id={id} className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">{title}</h2>
        {aside ? <span className="text-[11px] text-[var(--color-ink-3)]">{aside}</span> : null}
      </div>
      <div className="px-3 py-2.5">{children}</div>
    </section>
  );
}

/** Said in words, never implied by a greyed-out control alone. */
export function Notice({
  children, tone = 'neutral', id,
}: { children: React.ReactNode; tone?: Tone; id?: string }) {
  const color =
    tone === 'warn' ? 'text-[var(--color-warn)]'
      : tone === 'danger' ? 'text-[var(--color-danger)]'
        : 'text-[var(--color-ink-3)]';
  return <p id={id} className={`mt-1 text-[12px] leading-snug ${color}`}>{children}</p>;
}
