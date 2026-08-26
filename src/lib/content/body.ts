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
}

/** Returns undefined when the lesson has no prose yet — the caller must render an outline, not an empty page. */
export function getLessonBody(id: string): LessonBody | undefined {
  const p = path.join(DIR, `${id}.mdx`);
  if (!fs.existsSync(p)) return undefined;
  const { data, content } = matter(fs.readFileSync(p, 'utf8'));
  const contentHash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
  return { id, content, contentHash, ...(data as Omit<LessonBody, 'id' | 'content' | 'contentHash'>) };
}

export function writtenLessonIds(): Set<string> {
  if (!fs.existsSync(DIR)) return new Set();
  return new Set(fs.readdirSync(DIR).filter((f) => f.endsWith('.mdx')).map((f) => f.slice(0, -4)));
}
