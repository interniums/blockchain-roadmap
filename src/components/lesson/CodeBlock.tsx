import 'server-only';
import { createHighlighter, type Highlighter } from 'shiki';
import { Children, isValidElement, type ReactNode } from 'react';

/**
 * Syntax highlighting for the 1,514 fenced code blocks in the corpus.
 *
 * `content/LESSON-FORMAT.md` has promised since it was written that "fenced code blocks are
 * highlighted at build time". They were not: `shiki` was installed and never wired up, and every
 * fence rendered as flat monochrome text. This is that wiring.
 *
 * Done as an async server component rather than a rehype plugin because shiki 4 ships no rehype
 * entry point, and adding `@shikijs/rehype` for one call is a dependency we do not need — the
 * component runs at build time inside `compileMDX`, which is the same moment a rehype plugin would.
 *
 * Dual-theme: shiki emits both palettes as CSS variables in one pass, so a fence follows the
 * viewer's light/dark setting without a second highlight or a flash of the wrong one.
 */

/** Only the languages the corpus actually uses, counted from the fences. Loading the full bundle
 *  would pull every grammar shiki ships into the build for no benefit. */
const LANGS = [
  'solidity', 'typescript', 'tsx', 'javascript', 'python', 'rust', 'bash', 'console',
  'toml', 'yaml', 'sql', 'json', 'go', 'graphql', 'xml', 'diff',
] as const;

/** Fence tags that are not languages, or that shiki has no grammar for. Rendered plain. */
const PLAIN = new Set(['', 'text', 'txt', 'plain', 'move', 'yul', 'gitignore', 'shell']);

const ALIAS: Record<string, string> = {
  ts: 'typescript', js: 'javascript', sh: 'bash', shell: 'bash', yml: 'yaml',
};

let instance: Promise<Highlighter> | null = null;

/** One highlighter for the whole build. Creating one per fence would load every grammar 1,514 times. */
function highlighter(): Promise<Highlighter> {
  instance ??= createHighlighter({
    langs: [...LANGS],
    themes: ['github-light', 'github-dark-default'],
  });
  return instance;
}

/** The text inside a fence, however deeply MDX nested it. */
function textOf(node: ReactNode): string {
  let out = '';
  Children.forEach(node, (child) => {
    if (child === null || child === undefined || typeof child === 'boolean') return;
    if (typeof child === 'string' || typeof child === 'number') { out += String(child); return; }
    if (isValidElement(child)) {
      out += textOf((child.props as { children?: ReactNode }).children);
    }
  });
  return out;
}

const SHELL =
  'my-5 overflow-x-auto rounded-md border border-[var(--color-rule)] p-4 text-[12.5px] leading-[1.6]';

export async function CodeBlock(props: React.ComponentProps<'pre'>) {
  // A markdown fence compiles to <pre><code className="language-x">. Anything else — a hand-written
  // <pre> in a lesson — falls through to the plain shell rather than being guessed at.
  const only = Children.toArray(props.children).find(isValidElement);
  const cls = only ? String((only.props as { className?: string }).className ?? '') : '';
  const tag = /language-([\w+-]+)/.exec(cls)?.[1] ?? '';
  const lang = ALIAS[tag] ?? tag;
  const code = textOf(props.children).replace(/\n$/, '');

  if (!code || PLAIN.has(tag) || !(LANGS as readonly string[]).includes(lang)) {
    return (
      <pre className={`${SHELL} bg-[var(--color-surface)] text-[var(--color-ink-2)]`}>
        <code>{code || props.children}</code>
      </pre>
    );
  }

  const html = (await highlighter()).codeToHtml(code, {
    lang,
    themes: { light: 'github-light', dark: 'github-dark-default' },
    defaultColor: false,
    // shiki puts its own background on the <pre>; ours comes from the theme tokens so a fence sits
    // on the same surface as every other raised block on the page.
    structure: 'inline',
  });

  return (
    <pre
      className={`${SHELL} bg-[var(--color-surface)] shiki-block`}
      dangerouslySetInnerHTML={{ __html: `<code>${html}</code>` }}
    />
  );
}
