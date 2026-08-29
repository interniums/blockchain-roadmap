'use client';

import type { ReactNode } from 'react';

/** Structural primitives only — colours come from the tokens in globals.css. */

export function Panel({
  children,
  tone = 'plain',
  className = '',
}: {
  children: ReactNode;
  tone?: 'plain' | 'quiet' | 'warn' | 'good';
  className?: string;
}) {
  const skin =
    tone === 'warn'
      ? 'border-[var(--color-warn)] bg-[var(--color-warn-soft)]'
      : tone === 'good'
        ? 'border-[var(--color-rule)] bg-[var(--color-accent-soft)]'
        : tone === 'quiet'
          ? 'border-dashed border-[var(--color-rule)] bg-transparent'
          : 'border-[var(--color-rule)] bg-[var(--color-surface)]';
  return <div className={`rounded border ${skin} p-4 ${className}`}>{children}</div>;
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">{children}</p>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-[var(--color-rule)] bg-[var(--color-surface-2)] px-1 font-mono text-[11px] text-[var(--color-ink-3)]">
      {children}
    </kbd>
  );
}

export function PrimaryButton({
  children,
  hint,
  onClick,
  buttonRef,
  disabled,
}: {
  children: ReactNode;
  hint?: ReactNode;
  onClick: () => void;
  buttonRef?: React.Ref<HTMLButtonElement>;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      className="rounded border border-[var(--color-accent)] bg-[var(--color-accent-soft)] px-4 py-2 text-[14px] font-medium text-[var(--color-ink)] hover:border-[var(--color-ink-2)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
      {hint ? <span className="ml-2 text-[12px] text-[var(--color-ink-3)]">{hint}</span> : null}
    </button>
  );
}

export function ChoiceButton({
  title,
  body,
  keyHint,
  onClick,
  buttonRef,
  disabled,
}: {
  title: string;
  body: string;
  keyHint: string;
  onClick: () => void;
  buttonRef?: React.Ref<HTMLButtonElement>;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      className="flex min-w-0 flex-1 flex-col items-start gap-0.5 rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-2 text-left hover:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="flex w-full items-baseline justify-between gap-2">
        <span className="text-[14px] font-medium text-[var(--color-ink)]">{title}</span>
        <Kbd>{keyHint}</Kbd>
      </span>
      <span className="text-[12.5px] leading-snug text-[var(--color-ink-2)]">{body}</span>
    </button>
  );
}

export function QuietLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="text-[var(--color-accent)] hover:underline">
      {children}
    </a>
  );
}

export const pct = (n: number) => `${Math.round(n * 100)}%`;
