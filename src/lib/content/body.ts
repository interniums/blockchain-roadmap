import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import crypto from 'node:crypto';

const DIR = path.join(process.cwd(), 'content', 'lessons');

export interface LessonBody {
  id: string;
  content: string;
  authorship?: 'authored' | 'adapted' | 'generated';
  verifiedAt?: string;
  volatility?: 'stable' | 'evolving' | 'hot';
  sources?: string[];
  stack?: Record<string, string>;
  /**
   * Plan §17. Classifies the LAST edit to this lesson so progress can respond correctly:
   *   cosmetic   — typo, formatting. Touches nothing.
   *   clarifying — better wording, same claims. Touches nothing.
   *   corrective — a claim was WRONG. Resets this lesson's concepts to unproven and re-queues them.
   * Absent is treated as 'clarifying' — the safe default, since silently resetting mastery is worse
   * than silently not resetting it.
   */
  changeKind?: 'cosmetic' | 'clarifying' | 'corrective';
  /** sha256 of the body. Compared against what the learner last saw. */
  contentHash: string;
  /**
   * The concepts this lesson's inline `<Check>` blocks ask you to retrieve, in prose order.
   *
   * This is the gate key. A lesson counts as complete when every one of these has been graded,
   * which is the only act this app records — so unlocking downstream content is a byproduct of
   * reading in order rather than a separate obligation. Measured across the corpus: 649 checks,
   * 621 lessons with one and 14 with two, none with zero, and every one carries a `concept=`.
   */
  checkConcepts: string[];
}

/**
 * Pulled with a regex rather than by compiling the MDX, because this runs inside
 * `generateStaticParams` and the gate index for 635 lessons — a full MDX compile per lesson to
 * read one attribute would dominate the build. `content-lint` is what guarantees the shape.
 */
const CHECK_CONCEPT = /<Check\b[^>]*?\bconcept="([^"]+)"/g;

export function checkConceptsIn(content: string): string[] {
  const out: string[] = [];
  for (const m of content.matchAll(CHECK_CONCEPT)) if (!out.includes(m[1])) out.push(m[1]);
  return out;
}

/** Undefined only when the .mdx is missing, which content-lint treats as a build error. */
export function getLessonBody(id: string): LessonBody | undefined {
  const p = path.join(DIR, `${id}.mdx`);
  if (!fs.existsSync(p)) return undefined;
  const { data, content } = matter(fs.readFileSync(p, 'utf8'));
  const contentHash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
  return {
    id, content, contentHash,
    ...(data as Omit<LessonBody, 'id' | 'content' | 'contentHash' | 'checkConcepts'>),
    checkConcepts: checkConceptsIn(content),
  };
}

export function writtenLessonIds(): Set<string> {
  if (!fs.existsSync(DIR)) return new Set();
  return new Set(fs.readdirSync(DIR).filter((f) => f.endsWith('.mdx')).map((f) => f.slice(0, -4)));
}
