import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { lessonScopedComponents, mdxComponents } from './mdx';
import { Answer } from './Check';
import type { LessonBody } from '@/lib/content/body';

/** Compiles a lesson's MDX at build time with the Chainpath component set. */
export async function LessonProse({ body }: { body: LessonBody }) {
  const { content } = await compileMDX({
    source: body.content,
    components: { ...mdxComponents, Answer, ...lessonScopedComponents() },
    options: {
      parseFrontmatter: false,
      // next-mdx-remote defaults to blockJS, which strips EVERY expression-valued JSX attribute.
      // That silently deletes `nodes={[...]}` from a figure and the component renders with undefined
      // props. The default exists for MDX submitted by strangers; ours is first-party content in
      // this repo, reviewed in the same diff as the code. blockDangerousJS stays on, so eval,
      // Function, require, process and .constructor are still rejected at compile time.
      blockJS: false,
      // Without GFM, a markdown table is not a table: remark leaves it as a paragraph and the page
      // renders a literal row of pipe characters. 140 tables across 119 lessons were shipping that
      // way, which is why several agents reported "converting the table adds nothing" — the thing
      // they were comparing against had never rendered.
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
  });
  return <div className="lesson-prose">{content}</div>;
}
