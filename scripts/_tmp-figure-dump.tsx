import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import matter from 'gray-matter';
import * as jsxRuntime from 'react/jsx-runtime';
import * as jsxDevRuntime from 'react/jsx-dev-runtime';
import { Anatomy, Bars, ByteLayout, Compare, Flow, Matrix, StackTrace, Timeline, Tree } from '../src/components/lesson/diagrams';

const stub = (tag: string) => (p: Record<string, unknown>) => React.createElement(tag, null, (p.children ?? null) as React.ReactNode);
const components: Record<string, unknown> = {
  Flow, ByteLayout, Anatomy, Timeline, Tree, StackTrace, Compare, Matrix, Bars,
  Figure: (p: { children?: React.ReactNode }) => React.createElement('figure', null, p.children),
  Cite: () => null, Check: stub('div'), Answer: stub('div'), Misconception: () => null, Aside: stub('div'),
};

(async () => {
  const { serialize } = await import('next-mdx-remote/serialize');
  const file = process.argv[2];
  const want = Number(process.argv[3] ?? 1);
  const { content } = matter(fs.readFileSync(path.join('content/lessons', file), 'utf8'));
  const remarkGfm = (await import('remark-gfm')).default;
  const { compiledSource } = await serialize(content, { parseFrontmatter: false, blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm] } }, true);
  const scope = { opts: { ...jsxRuntime, ...jsxDevRuntime }, frontmatter: {} };
  const fn = Reflect.construct(Function, Object.keys(scope).concat(compiledSource));
  const Content = fn.apply(fn, Object.values(scope)).default;
  const html = renderToStaticMarkup(React.createElement(Content, { components }));
  let i = 0;
  for (const m of html.matchAll(/<svg\b[^>]*>([\s\S]*?)<\/svg>/g)) {
    if (++i !== want) continue;
    const body = m[1].replace(/<defs>[\s\S]*?<\/defs>/g, '');
    console.log(m[0].match(/viewBox="[^"]*"/)?.[0]);
    for (const r of body.matchAll(/<rect\b[^>]*>/g)) console.log('RECT', r[0].replace(/ (fill|stroke|stroke-width|stroke-dasharray|rx)="[^"]*"/g, ''));
    for (const p2 of body.matchAll(/<path\b[^>]*>/g)) console.log('PATH', p2[0].match(/d="[^"]*"/)?.[0]);
    for (const t of body.matchAll(/<text\b[^>]*>([^<]*)</g)) console.log('TEXT', t[0].match(/x="[^"]*" y="[^"]*"/)?.[0], JSON.stringify(t[1]));
  }
})();
