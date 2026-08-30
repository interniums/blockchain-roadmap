'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { LessonSection } from '@/lib/content/body';
import { SECTION_LINE, currentSection } from './currentSection';

/**
 * Where you are inside this lesson.
 *
 * The rail used to list the module's other lessons. That answered a question you do not have while
 * reading: a lesson runs 6 to 13 screens, and the thing you lose is your place in it. Siblings —
 * with their lock state — live one click up on the module page, which is what the heading link is.
 *
 * The active section is the last heading to have passed a line near the top of the viewport, and
 * the rail only re-renders when that answer changes.
 *
 * `[` collapses it, and the grid column collapses with it — `data-rail` is what the layout reads
 * through `:has()`, so the prose recentres instead of leaving a 220px hole. Collapse to nothing,
 * not to icons: the titles here are full sentences ("Getting out past a sequencer that will not
 * help you") and there is no icon vocabulary to fall back on.
 */
export function SectionRail({
  sections, moduleTitle, moduleHref,
}: {
  sections: LessonSection[];
  moduleTitle: string;
  moduleHref: string;
}) {
  const [active, setActive] = useState<string | null>(sections[0]?.id ?? null);
  const [open, setOpen] = useState(true);
  const ids = sections.map((s) => s.id).join('|');

  useEffect(() => {
    if (!ids) return;
    const nodes = ids.split('|')
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => !!n);
    if (!nodes.length) return;

    // The current section is the last heading to have passed a line near the top of the viewport —
    // NOT whichever heading happens to be on screen. A section here can run 900px, so for most of
    // the time you spend reading one there is no heading visible at all, and keying on visibility
    // leaves the rail stuck on whatever it last saw. The choice itself lives in `currentSection`,
    // which is unit-tested; this is only the wiring.
    let last = '';
    const recompute = () => {
      const i = currentSection(
        nodes.map((n) => n.getBoundingClientRect().top),
        window.innerHeight * SECTION_LINE,
      );
      const id = nodes[i]?.id;
      // Only re-render when the answer changes: scrolling through one long section sets no state.
      if (id && id !== last) { last = id; setActive(id); }
    };

    recompute();
    window.addEventListener('scroll', recompute, { passive: true });
    window.addEventListener('resize', recompute, { passive: true });
    return () => {
      window.removeEventListener('scroll', recompute);
      window.removeEventListener('resize', recompute);
    };
  }, [ids]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || e.key !== '[') return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))) return;
      e.preventDefault();
      setOpen((v) => !v);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!open) {
    return (
      <nav aria-label="Lesson sections" data-rail="collapsed" className="text-[var(--text-marginal)]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-[var(--color-ink-3)] uppercase tracking-wider hover:text-[var(--color-accent)]"
        >
          Contents <span className="font-[family-name:var(--font-mono)]">[</span>
        </button>
      </nav>
    );
  }

  return (
    <nav aria-label="Lesson sections" data-rail="open" className="flex flex-col gap-3">
      <Link
        href={moduleHref}
        className="text-[var(--text-marginal)] uppercase tracking-wider text-[var(--color-ink-3)] no-underline hover:text-[var(--color-accent)]"
      >
        ↑ {moduleTitle}
      </Link>

      <ol className="flex flex-col gap-px border-l border-[var(--color-rule)]">
        {sections.map((s, i) => {
          const on = s.id === active;
          return (
            <li key={s.id} className="contents">
              <a
                href={`#${s.id}`}
                aria-current={on ? 'true' : undefined}
                className={`-ml-px border-l py-1 pl-3 text-[var(--text-small)] leading-snug no-underline transition-colors ${
                  on
                    ? 'border-[var(--color-accent)] text-[var(--color-ink)]'
                    : 'border-transparent text-[var(--color-ink-3)] hover:text-[var(--color-ink-2)]'
                }`}
              >
                <span className="mr-1.5 font-[family-name:var(--font-mono)] text-[10px] tabular-nums opacity-60">
                  {i + 1}
                </span>
                {s.title}
              </a>
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        onClick={() => setOpen(false)}
        className="self-start text-[10.5px] uppercase tracking-wider text-[var(--color-ink-3)] opacity-70 hover:text-[var(--color-accent)] hover:opacity-100"
      >
        Hide <span className="font-[family-name:var(--font-mono)]">[</span>
      </button>
    </nav>
  );
}
