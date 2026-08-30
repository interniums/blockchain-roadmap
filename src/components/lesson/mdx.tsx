import { Children, isValidElement, type ReactNode } from 'react';
import Link from 'next/link';
import { getSource } from '@/lib/content/load';
import { slugify } from '@/lib/content/body';
import { Check } from './Check';
import { CodeBlock } from './CodeBlock';
import { Anatomy, Bars, ByteLayout, Compare, Flow, Matrix, StackTrace, Timeline, Tree } from './diagrams';

/**
 * Inline citation.
 *
 * It used to render the words `spec` / `docs` / `src`, which is the problem: a word reads as
 * content and breaks the line, and there are a mean of 32 of them per lesson drawn from a median
 * of 10 unique sources. A numeral reads as apparatus, and deduping per lesson turns ~32 marks into
 * ~10 numbers.
 *
 * `numberOf` is supplied per lesson by `LessonProse` from the frontmatter `sources:` order. Without
 * it — a `<Cite>` rendered outside a lesson — it falls back to the tier word rather than inventing
 * a number that points at no rail entry.
 */
function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Citations are numbered in the order the prose first reaches them, not in the order the frontmatter
 * declares them. That is the difference between margin notes that read 1, 2, 3 down the page and
 * ones that read 10, 2, 9 — and between a numeral that tells you where to look and one that only
 * happens to be unique. It also means a declared-but-uncited source consumes no number.
 *
 * Assigned lazily in a closure. Safe because these components are built fresh per lesson and the
 * MDX render is a single synchronous build-time pass in document order.
 */
export function makeCite(numbered?: boolean) {
  const numberOf = new Map<string, number>();

  return function Cite({ src }: { src: string }) {
    const s = getSource(src);
    if (!s) return <sup className="text-[var(--color-danger)]" title={`unknown source: ${src}`}>[?]</sup>;
    if (!numbered) {
      return (
        <sup>
          <a href={`#src-${src}`} title={s.title}
             className="ml-0.5 rounded px-[3px] text-[10px] text-[var(--color-accent)] no-underline hover:bg-[var(--color-accent-soft)]">
            {s.tier === 'spec' ? 'spec' : s.tier === 'canonical-docs' ? 'docs' : 'src'}
          </a>
        </sup>
      );
    }
    const known = numberOf.get(src);
    const first = known === undefined;
    const n = known ?? numberOf.size + 1;
    if (first) numberOf.set(src, n);

    return (
      <>
        <sup>
          <a
            href={`#src-${src}`}
            title={s.title}
            className="ml-0.5 rounded px-[3px] text-[10px] tabular-nums text-[var(--color-accent)] no-underline hover:bg-[var(--color-accent-soft)]"
          >
            {n}
          </a>
        </sup>
        {/* The source itself, once, in the margin beside the paragraph that first cites it. A float
            rather than absolute positioning: two notes in one paragraph stack instead of colliding. */}
        {/* The margin note is the anchor target now that the sources rail is gone. A repeat
            citation further down the page jumps back to where the source was introduced. */}
        {first && (
          <span className="cite-note" role="note" id={`src-${src}`}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="cite-note-link">
              <span className="cite-note-n">{n}</span>
              {s.title}
            </a>
            <span className="cite-note-meta">
              {s.tier === 'spec' ? 'spec' : s.tier === 'canonical-docs' ? 'canonical' : s.tier === 'primary-analysis' ? 'analysis' : 'secondary'}
              {s.vendor ? ' · vendor' : ''} · {hostOf(s.url)}
            </span>
          </span>
        )}
      </>
    );
  };
}

export const Cite = makeCite();

export function makeMisconception(Cite: (p: { src: string }) => React.ReactNode) {
  return function Misconception(
    { belief, reality, why, src }: { belief: string; reality: string; why?: string; src?: string },
  ) {
    return (
      /* The one instrument that earns a frame, because its content IS a contrast: two labelled
         halves set against each other. The "why" is the third beat and goes behind a disclosure so
         the card stays two things, not three. */
      <aside className="lesson-misconception my-7 grid gap-x-5 gap-y-3 rounded border border-[var(--color-rule)] p-4 sm:grid-cols-2">
        <div>
          <p className="m-0 text-[11px] uppercase tracking-wider text-[var(--color-warn)]">Commonly believed</p>
          <p className="mb-0 mt-1.5 text-[0.97em] italic text-[var(--color-ink-2)]">&ldquo;{belief}&rdquo;</p>
        </div>
        <div className="border-t border-[var(--color-rule)] pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
          <p className="m-0 text-[11px] uppercase tracking-wider text-[var(--color-good)]">Actually</p>
          <p className="mb-0 mt-1.5 text-[0.97em]">{reality}</p>
        </div>
        {why && (
          <details className="sm:col-span-2">
            <summary className="cursor-pointer text-[var(--text-small)] text-[var(--color-ink-3)]">
              Why the wrong one is believable
            </summary>
            <p className="mb-0 mt-1.5 text-[var(--text-small)] leading-relaxed text-[var(--color-ink-2)]">
              {why}{src && <Cite src={src} />}
            </p>
          </details>
        )}
      </aside>
    );
  };
}

export const Misconception = makeMisconception(makeCite());

/**
 * The components whose output depends on which lesson they are in. Everything else is static, so
 * only these are rebuilt per lesson — and they are rebuilt together, because a numbered citation
 * inside a misconception card must carry the same number as one in the prose beside it.
 */
export function lessonScopedComponents() {
  const Cite = makeCite(true);
  return { Cite, Misconception: makeMisconception(Cite) };
}

/**
 * An aside is a parenthesis, not an object: a hairline and slightly smaller type, no frame. It used
 * to get the same bordered box as everything else, which is why 8-9 instruments per lesson read as
 * 8 interruptions rather than as prose with apparatus in it.
 */
export function Aside({ kind = 'note', children }: { kind?: 'note' | 'warn' | 'stop'; children: React.ReactNode }) {
  const border = kind === 'stop' ? 'var(--color-danger)' : kind === 'warn' ? 'var(--color-warn)' : 'var(--color-rule)';
  return (
    <aside
      className="lesson-aside my-5 border-l pl-4 text-[0.96em] text-[var(--color-ink-2)]"
      style={{ borderColor: border }}
    >
      {children}
    </aside>
  );
}

/**
 * No frame, and no stretching. A 159px diagram inside a 752px bordered rectangle reads as a broken
 * image; measured, one figure filled 21% of its own box. `fit-content` lets a small figure be small
 * and a wide one scroll inside itself. The caption goes in the margin beside it, where it does not
 * interrupt the column.
 */
export function Figure({ caption, alt, children }: { caption?: string; alt?: string; children: React.ReactNode }) {
  return (
    <figure className="lesson-figure my-7">
      <div role="img" aria-label={alt} className="max-w-full overflow-x-auto">
        {children}
      </div>
      {caption && <figcaption className="cite-note">{caption}</figcaption>}
    </figure>
  );
}

/** A heading's plain text, however MDX nested it — headings contain inline code. */
function headingText(node: ReactNode): string {
  let out = '';
  Children.forEach(node, (child) => {
    if (typeof child === 'string' || typeof child === 'number') { out += String(child); return; }
    if (isValidElement(child)) out += headingText((child.props as { children?: ReactNode }).children);
  });
  return out;
}

export const mdxComponents = {
  Cite, Misconception, Aside, Figure, Check,
  Flow, ByteLayout, Anatomy, Timeline, Tree, StackTrace, Compare, Matrix, Bars,
  a: (p: React.ComponentProps<'a'>) => {
    const href = p.href ?? '';
    return href.startsWith('/')
      ? <Link href={href} className="text-[var(--color-accent)] underline underline-offset-2">{p.children}</Link>
      : <a {...p} target="_blank" rel="noreferrer" className="text-[var(--color-accent)] underline underline-offset-2" />;
  },
  // `id` is what the section rail anchors to, and `slugify` is shared with `sectionsIn` so the two
  // cannot drift. scroll-margin keeps a jumped-to heading clear of the top of the viewport.
  h2: (p: React.ComponentProps<'h2'>) => (
    <h2
      {...p}
      id={slugify(headingText(p.children))}
      className="mt-10 mb-2.5 scroll-mt-8 text-[length:var(--text-h2)] font-semibold leading-tight tracking-tight text-balance"
    />
  ),
  h3: (p: React.ComponentProps<'h3'>) => (
    <h3 {...p} className="mt-7 mb-2 scroll-mt-8 text-[length:var(--text-h3)] font-semibold leading-snug" />
  ),
  p: (p: React.ComponentProps<'p'>) => <p {...p} className="lesson-p my-4" />,
  ul: (p: React.ComponentProps<'ul'>) => <ul {...p} className="my-4 list-disc pl-5" />,
  ol: (p: React.ComponentProps<'ol'>) => <ol {...p} className="my-4 list-decimal pl-5" />,
  li: (p: React.ComponentProps<'li'>) => <li {...p} className="my-1.5" />,
  // Median 37 inline-code spans per lesson, max 154 — the densest instrument in the product, and
  // absent from the original brief's own list of them. A border on each one stipples the page.
  code: (p: React.ComponentProps<'code'>) => (
    <code {...p} className="rounded-[2px] bg-[var(--color-surface-2)] px-[0.28em] py-[0.06em] font-[family-name:var(--font-mono)] text-[0.9em]" />
  ),
  pre: CodeBlock,
  blockquote: (p: React.ComponentProps<'blockquote'>) => <blockquote {...p} className="my-5 border-l-2 border-[var(--color-rule)] pl-4 text-[var(--color-ink-2)] italic" />,
  strong: (p: React.ComponentProps<'strong'>) => <strong {...p} className="font-semibold text-[var(--color-ink)]" />,
  // GFM tables. Styled to match <Matrix> so a markdown table and a figure table do not read as two
  // different kinds of object; the wrapper keeps a wide table scrolling inside its own box rather
  // than pushing the page sideways.
  table: (p: React.ComponentProps<'table'>) => (
    <div className="my-6 overflow-x-auto">
      <table {...p} className="w-full border-collapse text-[13px] leading-[1.5]" />
    </div>
  ),
  th: (p: React.ComponentProps<'th'>) => (
    <th {...p} className="border-b border-[var(--color-rule)] px-2.5 py-2 text-left font-medium text-[var(--color-ink-2)]" />
  ),
  td: (p: React.ComponentProps<'td'>) => (
    <td {...p} className="border-b border-[var(--color-rule)] px-2.5 py-2 align-top text-[var(--color-ink-2)]" />
  ),
};
