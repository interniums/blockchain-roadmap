/** Structural pieces for the setup screen. Tokens only — no colour is spelled out here. */

type Tone = 'neutral' | 'good' | 'warn' | 'danger' | 'accent';

const TONE_TEXT: Record<Tone, string> = {
  neutral: 'text-[var(--color-ink-2)]',
  good: 'text-[var(--color-good)]',
  warn: 'text-[var(--color-warn)]',
  danger: 'text-[var(--color-danger)]',
  accent: 'text-[var(--color-accent)]',
};

const TONE_BORDER: Record<Tone, string> = {
  neutral: 'border-[var(--color-rule)]',
  good: 'border-[var(--color-good)]',
  warn: 'border-[var(--color-warn)]',
  danger: 'border-[var(--color-danger)]',
  accent: 'border-[var(--color-accent)]',
};

export function Pill({ tone = 'neutral', children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-block rounded border px-1.5 py-px text-[11px] uppercase tracking-wider ${TONE_BORDER[tone]} ${TONE_TEXT[tone]}`}>
      {children}
    </span>
  );
}

export function Callout({
  tone = 'neutral', title, children,
}: {
  tone?: Tone; title: string; children?: React.ReactNode;
}) {
  return (
    <div className={`max-w-[74ch] rounded border ${TONE_BORDER[tone]} bg-[var(--color-surface)] px-3 py-2.5`}>
      <p className={`text-[13px] font-semibold ${TONE_TEXT[tone]}`}>{title}</p>
      {children && <div className="mt-1 text-[13px] text-[var(--color-ink-2)]">{children}</div>}
    </div>
  );
}

export function Section({
  id, title, lede, aside, children,
}: {
  id: string; title: string; lede?: React.ReactNode; aside?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-h`} className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id={`${id}-h`} className="text-[17px] font-semibold">{title}</h2>
        {aside}
      </div>
      {lede && <p className="mt-1 max-w-[74ch] text-[13px] text-[var(--color-ink-2)]">{lede}</p>}
      {children}
    </section>
  );
}

export function Stat({ n, label, tone = 'neutral' }: { n: number | string; label: string; tone?: Tone }) {
  return (
    <div className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-2">
      <div className={`font-mono text-[22px] leading-none ${TONE_TEXT[tone]}`}>{n}</div>
      <div className="mt-1 text-[12px] text-[var(--color-ink-2)]">{label}</div>
    </div>
  );
}

export function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-[var(--color-surface-2)] px-1 py-px font-mono text-[12px] break-all">
      {children}
    </code>
  );
}
