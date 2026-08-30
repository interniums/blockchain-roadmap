import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPractice, graph } from '@/lib/content/load';
import { asText } from '../../[module]/p/[practice]/_components/Prose';
import { PracticeScreen } from '../../[module]/p/[practice]/_screen';

type Params = { track: string; practice: string };

export const dynamicParams = false;

/**
 * A track's exit project. Depth is grain: a block exercise and a module capstone live under their
 * module, and the one build that closes out a whole track lives under the track.
 *
 * It renders the same screen as the other two — an exit project is not a different kind of page,
 * only a different size of thing — with the ladder above it reflecting where it actually sits.
 */
export function generateStaticParams(
  ctx?: { params?: Record<string, string | string[] | undefined> },
): Params[] {
  const want = typeof ctx?.params?.track === 'string' ? ctx.params.track : undefined;
  const out: Params[] = [];
  for (const [practice, p] of graph().practiceById) {
    if (p.grain !== 'exit' || !p.trackId) continue;
    if (want && p.trackId !== want) continue;
    out.push({ track: p.trackId, practice });
  }
  return out;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { practice } = await params;
  const p = getPractice(practice);
  if (!p) return { title: 'Practice · Chainpath' };
  return {
    title: `${p.title} · Exit project · Chainpath`,
    description: asText(p.spec).slice(0, 160) || undefined,
  };
}

export default async function TrackExitPage({ params }: { params: Promise<Params> }) {
  const { track, practice } = await params;
  const p = getPractice(practice);
  if (!p || p.grain !== 'exit' || p.trackId !== track) notFound();
  return <PracticeScreen id={practice} />;
}
