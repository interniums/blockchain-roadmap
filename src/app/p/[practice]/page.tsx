import { permanentRedirect, notFound } from 'next/navigation';
import { graph, hrefForPractice } from '@/lib/content/load';

/**
 * Practices used to live at this flat route. They now live under what they exercise, where their
 * depth states their grain. Old links keep working.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return [...graph().practiceById.keys()].map((practice) => ({ practice }));
}

export default async function PracticeRedirect({
  params,
}: { params: Promise<{ practice: string }> }) {
  const { practice } = await params;
  const to = hrefForPractice(practice);
  if (!to) notFound();
  permanentRedirect(to);
}
