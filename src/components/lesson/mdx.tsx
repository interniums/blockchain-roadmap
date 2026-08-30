import Link from 'next/link';
import { getSource } from '@/lib/content/load';
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
export function makeCite(numberOf?: Map<string, number>) {
  return function Cite({ src }: { src: string }) {
    const s = getSource(src);
    if (!s) return <sup className="text-[var(--color-danger)]" title={`unknown source: ${src}`}>[?]</sup>;
    const n = numberOf?.get(src);
    return (
      <sup>
        <a
          href={`#src-${src}`}
          title={s.title}
          className="ml-0.5 rounded px-[3px] text-[10px] tabular-nums text-[var(--color-accent)] no-underline hover:bg-[var(--color-accent-soft)]"
        >
          {n ?? (s.tier === 'spec' ? 'spec' : s.tier === 'canonical-docs' ? 'docs' : 'src')}
        </a>
      </sup>
    );
  };
}

export const Cite = makeCite();

export function makeMisconception(Cite: (p: { src: string }) => React.ReactNode) {
  return function Misconception(
    { belief, reality, why, src }: { belief: string; reality: string; why?: string; src?: string },
  ) {
    return (
      <aside className="my-6 rounded-md border border-[var(--color-rule)] bg-[var(--color-surface)] p-4">
        <p className="m-0 text-[11px] uppercase tracking-wider text-[var(--color-warn)]">Common belief</p>
        <p className="mb-3 mt-1 text-[15px] text-[var(--color-ink-2)] italic">“{belief}”</p>
        <p className="m-0 text-[11px] uppercase tracking-wider text-[var(--color-good)]">Actually</p>
        <p className="mb-0 mt-1 text-[15px]">{reality}</p>
        {why && <p className="mb-0 mt-2 text-[13.5px] text-[var(--color-ink-2)]">{why}{src && <Cite src={src} />}</p>}
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
export function lessonScopedComponents(numberOf: Map<string, number>) {
  const Cite = makeCite(numberOf);
  return { Cite, Misconception: makeMisconception(Cite) };
}

export function Aside({ kind = 'note', children }: { kind?: 'note' | 'warn' | 'stop'; children: React.ReactNode }) {
  const border = kind === 'stop' ? 'var(--color-danger)' : kind === 'warn' ? 'var(--color-warn)' : 'var(--color-accent)';
  return (
    <aside className="my-5 border-l-2 py-1 pl-4 text-[14.5px] text-[var(--color-ink-2)]" style={{ borderColor: border }}>
      {children}
    </aside>
  );
}

export function Figure({ caption, alt, children }: { caption?: string; alt?: string; children: React.ReactNode }) {
  return (
    <figure className="my-6">
      <div role="img" aria-label={alt} className="overflow-x-auto rounded-md border border-[var(--color-rule)] bg-[var(--color-surface)] p-4">
        {children}
      </div>
      {caption && <figcaption className="mt-2 text-[13px] text-[var(--color-ink-3)]">{caption}</figcaption>}
    </figure>
  );
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
  h2: (p: React.ComponentProps<'h2'>) => <h2 {...p} className="mt-9 mb-2 text-[20px] font-semibold tracking-tight" />,
  h3: (p: React.ComponentProps<'h3'>) => <h3 {...p} className="mt-7 mb-2 text-[16px] font-semibold" />,
  p: (p: React.ComponentProps<'p'>) => <p {...p} className="my-3.5 text-[15.5px] leading-[1.7] text-[var(--color-ink)]" />,
  ul: (p: React.ComponentProps<'ul'>) => <ul {...p} className="my-3.5 list-disc pl-5 text-[15.5px] leading-[1.7]" />,
  ol: (p: React.ComponentProps<'ol'>) => <ol {...p} className="my-3.5 list-decimal pl-5 text-[15.5px] leading-[1.7]" />,
  li: (p: React.ComponentProps<'li'>) => <li {...p} className="my-1.5" />,
  code: (p: React.ComponentProps<'code'>) => <code {...p} className="rounded border border-[var(--color-rule)] bg-[var(--color-surface-2)] px-1 py-0.5 text-[0.87em]" />,
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
