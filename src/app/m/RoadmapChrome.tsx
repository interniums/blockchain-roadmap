'use client';

import { useEffect, useRef, useState } from 'react';

export interface ChipTrack {
  id: string;
  number: number;
  title: string;
}

/**
 * The only interactive part of the roadmap: a sticky header carrying overall counts, a
 * jump-to-track control kept in sync by scroll-spy, and the dependency-line toggle.
 *
 * The board itself is server-rendered and passed in as children — this component only wraps
 * it so `data-lines` can reach the SVG through CSS.
 */
export function RoadmapChrome({
  tracks,
  totals,
  children,
}: {
  tracks: ChipTrack[];
  totals: { modules: number; lessons: number; concepts: number; practices: number };
  children: React.ReactNode;
}) {
  const [strong, setStrong] = useState(false);
  const [active, setActive] = useState<string>(tracks[0]?.id ?? '');
  const visible = useRef<Set<string>>(new Set());

  // Scroll-spy. Cards on the same row cross the band together, so the winner is the first in
  // DOM order — which is the core spine track that row's electives branch from.
  useEffect(() => {
    const order = tracks.map((t) => t.id);
    const els = order
      .map((id) => document.getElementById(`t-${id}`))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.id.slice(2);
          if (e.isIntersecting) visible.current.add(id);
          else visible.current.delete(id);
        }
        const first = order.find((id) => visible.current.has(id));
        if (first) setActive(first);
      },
      { rootMargin: '-140px 0px -50% 0px' },
    );
    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, [tracks]);

  // `.` toggles the dependency lines — the key the plan's keyboard map assigns to it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key !== '.') return;
      e.preventDefault();
      setStrong((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const activeTrack = tracks.find((t) => t.id === active);

  return (
    <div data-lines={strong ? 'strong' : 'muted'}>
      <div className="sticky top-0 z-30 -mx-6 border-y border-[var(--color-rule)] bg-[var(--color-ground)] px-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 pt-2.5 pb-1.5">
          <p className="font-mono text-[11px] text-[var(--color-ink-3)]">
            {tracks.length} tracks · {totals.modules} modules · {totals.lessons} lessons ·{' '}
            {totals.concepts} concepts · {totals.practices} practices
          </p>

          <p className="flex items-center gap-2 font-mono text-[11px] text-[var(--color-ink-3)]">
            <span className="inline-block h-1.5 w-40 rounded-full bg-[var(--color-surface-2)]" aria-hidden="true">
              <span className="block h-full w-0 rounded-full bg-[var(--color-accent)]" />
            </span>
            0 of {totals.lessons} lessons read
          </p>

          <button
            type="button"
            aria-pressed={strong}
            onClick={() => setStrong((v) => !v)}
            className="ml-auto rounded-sm border border-[var(--color-rule)] bg-[var(--color-surface)] px-2.5 py-1 text-[11px] text-[var(--color-ink-2)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Cross-track lines: {strong ? 'strong' : 'muted'}
            <span className="ml-1.5 font-mono text-[10px] text-[var(--color-ink-3)]">.</span>
          </button>
        </div>

        <nav aria-label="Jump to track" className="flex flex-wrap items-center gap-1 pb-2">
          <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-3)]">
            Jump to
          </span>
          {tracks.map((t) => {
            const on = t.id === active;
            return (
              <a
                key={t.id}
                href={`#t-${t.id}`}
                aria-current={on ? 'location' : undefined}
                className={`rounded-sm border px-1.5 py-0.5 font-mono text-[11px] ${
                  on
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                    : 'border-[var(--color-rule)] bg-[var(--color-surface)] text-[var(--color-ink-3)] hover:text-[var(--color-accent)]'
                }`}
              >
                {String(t.number).padStart(2, '0')}
                <span className="sr-only"> {t.title}</span>
              </a>
            );
          })}
          <span className="ml-2 text-[12px] text-[var(--color-ink-2)]">
            {activeTrack ? activeTrack.title : ''}
          </span>
        </nav>
      </div>

      {children}
    </div>
  );
}
