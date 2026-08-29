import type { Metadata } from 'next';
import Link from 'next/link';
import { stats } from '@/lib/content/load';
import { Inbox } from './_inbox/Inbox';

export const metadata: Metadata = {
  title: 'Questions · Chainpath',
  description: 'The open-loop inbox — questions captured from lessons, grouped by the concept they are about.',
};

const LIBRARY = [
  { href: '/glossary', label: 'Glossary' },
  { href: '/questions', label: 'Questions' },
];

const LIFECYCLE = [
  { step: 'Captured', body: 'Select text in a lesson, press ?, keep reading. The question is stamped with the concept you were on.' },
  { step: 'Grouped', body: 'It lands here under that concept, next to any other question you raised about the same atom.' },
  { step: 'Parked', body: 'If the answer stopped mattering, park it. That is a real outcome, not a failure to finish.' },
  { step: 'Resolved', body: 'You write the answer in your own words. That answer is a reflection, and it stays on the question.' },
];

export default function QuestionsPage() {
  const s = stats();

  return (
    <div className="mx-auto flex w-full max-w-[1400px] gap-8 px-6 py-6">
      <aside className="hidden w-[190px] shrink-0 lg:block">
        <nav aria-label="Library" className="sticky top-6 text-[13px]">
          <Link href="/" className="block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)] hover:text-[var(--color-accent)]">
            ← Curriculum
          </Link>
          <p className="mt-2 text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">Library</p>
          <ul className="mt-1 flex flex-col gap-0.5">
            {LIBRARY.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={l.href === '/questions' ? 'page' : undefined}
                  className={`block rounded px-2 py-1 ${
                    l.href === '/questions'
                      ? 'bg-[var(--color-surface-2)] text-[var(--color-ink)]'
                      : 'text-[var(--color-ink-2)] hover:text-[var(--color-accent)]'
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[11px] leading-relaxed text-[var(--color-ink-3)]">
            Counts live at the top of the inbox — they are your state, so they are read in the browser rather
            than printed into the page.
          </p>
        </nav>
      </aside>

      <main className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">Open loops</p>
        <h1 className="mt-1 text-[26px] font-semibold tracking-tight">Questions</h1>
        <p className="mt-2 max-w-[78ch] text-[14px] leading-6 text-[var(--color-ink-2)]">
          Everything you asked while reading, grouped by the concept you asked it about. Nothing here has an
          age or a deadline — an open question is a thing you have not got to, which is a normal state for a
          question to be in.
        </p>

        <nav aria-label="Library" className="mt-4 flex gap-3 text-[13px] lg:hidden">
          {LIBRARY.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={l.href === '/questions' ? 'page' : undefined}
              className={l.href === '/questions' ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-2)] hover:text-[var(--color-accent)]'}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-5 flex flex-col gap-6 xl:flex-row">
          <div className="min-w-0 flex-1">
            <Inbox />
          </div>

          <aside className="w-full shrink-0 xl:w-[290px]">
            <div className="sticky top-6 flex flex-col gap-6">
              <section aria-labelledby="lifecycle">
                <h2 id="lifecycle" className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
                  How a question travels
                </h2>
                <ol className="mt-2 flex flex-col gap-3">
                  {LIFECYCLE.map((l, i) => (
                    <li key={l.step} className="flex gap-2">
                      <span className="mt-px font-mono text-[11px] text-[var(--color-ink-3)]">{i + 1}</span>
                      <span>
                        <span className="block text-[13px] font-medium">{l.step}</span>
                        <span className="block text-[13px] leading-6 text-[var(--color-ink-2)]">{l.body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </section>

              <section aria-labelledby="elsewhere">
                <h2 id="elsewhere" className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
                  When you would rather look it up
                </h2>
                <ul className="mt-2 flex flex-col gap-1.5 text-[13px]">
                  <li>
                    <Link href="/glossary" className="text-[var(--color-accent)] hover:underline">Glossary</Link>
                    <span className="text-[var(--color-ink-2)]"> — {s.concepts} concepts, one line each. Often answers the question outright.</span>
                  </li>
                  <li>
                    <Link href="/" className="text-[var(--color-accent)] hover:underline">The curriculum</Link>
                    <span className="text-[var(--color-ink-2)]"> — find the module that ought to cover it.</span>
                  </li>
                </ul>
              </section>

            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
