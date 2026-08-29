import Link from 'next/link';
import { CARD_DEPS_H, CARD_H, CARD_W, cardBox } from './geometry';
import type { Lane, TrackKind } from '@/lib/content/types';

export interface TrackNodeData {
  id: string;
  number: number;
  kind: TrackKind;
  title: string;
  tagline?: string;
  lane: Lane;
  row: number;
  moduleCount: number;
  lessonCount: number;
  needs: string[];
  opens: string[];
}

const nn = (n: number) => String(n).padStart(2, '0');

export function TrackCard({ t }: { t: TrackNodeData }) {
  const box = cardBox(t.lane, t.row);
  const depsId = `t-${t.id}-deps`;

  return (
    <li className="absolute" style={{ left: box.x, top: box.y, width: CARD_W }}>
      <Link
        id={`t-${t.id}`}
        href={`/t/${t.id}`}
        aria-describedby={depsId}
        className="cp-card block rounded-md border border-[var(--color-rule)] bg-[var(--color-surface)] px-4 pt-3.5 no-underline"
        style={{ height: CARD_H, paddingBottom: CARD_DEPS_H, scrollMarginTop: 132 }}
      >
        <span className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-3)]">
            {nn(t.number)}
          </span>
          <span
            className={`rounded-sm px-1.5 py-px text-[10px] uppercase tracking-[0.08em] ${
              t.kind === 'core'
                ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                : 'bg-[var(--color-warn-soft)] text-[var(--color-warn)]'
            }`}
          >
            {t.kind}
          </span>
        </span>

        <h2 className="mt-1 text-[15.5px] leading-tight font-semibold text-[var(--color-ink)]">
          {t.title}
        </h2>

        {t.tagline && (
          <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-[1.35] text-[var(--color-ink-2)]">
            {t.tagline}
          </p>
        )}

        <p className="mt-2 font-mono text-[11px] text-[var(--color-ink-3)]">
          {t.moduleCount} modules · {t.lessonCount} lessons
        </p>

      </Link>

      {/*
        Prerequisites in text. Sits over the foot of the card but outside the <a>, so it is the
        link's description rather than part of its (already long) accessible name. Clicks fall
        through to the link beneath.
      */}
      <div
        id={depsId}
        className="pointer-events-none absolute inset-x-0 px-4"
        style={{ top: CARD_H - CARD_DEPS_H + 4 }}
      >
        <p className="truncate text-[11px] leading-[1.5] text-[var(--color-ink-3)]">
          <span className="text-[var(--color-ink-2)]">Needs</span>{' '}
          {t.needs.length ? t.needs.join(', ') : 'nothing — this is the entry point'}
        </p>
        <p className="truncate text-[11px] leading-[1.5] text-[var(--color-ink-3)]">
          <span className="text-[var(--color-ink-2)]">Opens</span>{' '}
          {t.opens.length ? t.opens.join(', ') : 'nothing further — this is an end of the map'}
        </p>
      </div>

    </li>
  );
}
