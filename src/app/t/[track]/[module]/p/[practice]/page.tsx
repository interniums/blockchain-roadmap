import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPractice, graph } from '@/lib/content/load';
import { asText } from './_components/Prose';
import { PracticeScreen } from './_screen';

type Params = { track: string; module: string; practice: string };

export const dynamicParams = false;

export function generateStaticParams(
  ctx?: { params?: Record<string, string | string[] | undefined> },
): Params[] {
  const only = (key: string) => {
    const v = ctx?.params?.[key];
    return typeof v === 'string' ? v : undefined;
  };
  const wantTrack = only('track');
  const wantModule = only('module');

  const g = graph();
  const out: Params[] = [];
  for (const [practice, p] of g.practiceById) {
    // An exit project is addressed at track depth, so it is not generated here.
    if (p.grain === 'exit') continue;
    const mod = g.moduleById.get(p.moduleId);
    if (!mod) continue;
    if (wantTrack && mod.trackId !== wantTrack) continue;
    if (wantModule && mod.id !== wantModule) continue;
    out.push({ track: mod.trackId, module: mod.id, practice });
  }
  return out;
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { practice } = await params;
  const p = getPractice(practice);
  if (!p) return { title: 'Practice · Chainpath' };
  const what = p.grain === 'module' ? 'Module capstone' : 'Practice';
  return { title: `${p.title} · ${what} · Chainpath`, description: asText(p.spec).slice(0, 160) || undefined };
}

export default async function ModulePracticePage({ params }: { params: Promise<Params> }) {
  const { practice, module: moduleParam } = await params;
  const p = getPractice(practice);
  // The URL must agree with where this practice actually belongs, and an exit project does not
  // belong at module depth even though it is authored against a module.
  if (!p || p.grain === 'exit' || p.moduleId !== moduleParam) notFound();
  return <PracticeScreen id={practice} />;
}
