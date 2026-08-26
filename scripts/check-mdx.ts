/**
 * Compile every lesson's MDX exactly as the app does.
 *
 * content-lint.py validates the DATA graph; it cannot parse MDX. That gap let a lesson pass lint and
 * break `next build` — six files where a closing tag sat inline after prose, which MDX rejects.
 * A build error found at page 2,400 of a prerender is an expensive way to learn that.
 *
 * "Exactly as the app does" is load-bearing: this goes through next-mdx-remote's serialize with the
 * app's options, not bare @mdx-js/mdx. The two disagree — next-mdx-remote layers its own remark
 * plugins on top, and a lesson that compiles under one can be rejected by the other.
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';


const DIR = path.join(process.cwd(), 'content', 'lessons');
/** Same reason as content-lint's scope: a parallel verification step must not read other agents' files. */
const SCOPE = (process.env.CHAINPATH_FIGURE_SCOPE ?? '').split(',').map((x) => x.trim()).filter(Boolean);

(async () => {
  // ESM-only under tsx; a static import resolves as CJS and throws.
  const { serialize } = await import('next-mdx-remote/serialize');
  const files = (fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith('.mdx')) : [])
    .filter((f) => !SCOPE.length || SCOPE.some((p) => f.startsWith(p)));
  const failures: { file: string; msg: string }[] = [];
  let ok = 0;

  for (const f of files) {
    const { content } = matter(fs.readFileSync(path.join(DIR, f), 'utf8'));
    try {
      const remarkGfm = (await import('remark-gfm')).default;
      await serialize(content, {
        parseFrontmatter: false, blockJS: false,
        mdxOptions: { remarkPlugins: [remarkGfm] },
      }, true);
      ok++;
    } catch (e) {
      failures.push({ file: f, msg: String((e as Error).message).split('\n')[0].slice(0, 180) });
    }
  }

  console.log(`compiled ${ok}/${files.length} lessons`);
  if (failures.length) {
    console.log(`\n${failures.length} FAILED TO COMPILE:\n`);
    for (const { file, msg } of failures) console.log(`  ${file}\n     ${msg}\n`);
    process.exit(1);
  }
  console.log('all lesson MDX compiles');
})();
