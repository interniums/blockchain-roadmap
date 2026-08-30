import { permanentRedirect, notFound } from 'next/navigation';
import { graph, hrefForConcept } from '@/lib/content/load';

/**
 * Concepts used to live at this flat route, outside the content tree. They now live under the
 * single lesson that teaches them, so this is a redirect and nothing else.
 *
 * It stays as a route rather than a `next.config` redirect table for one reason:
 * `hrefForConcept` resolves through `aliasOf`, so a retired or merged concept id in an old link
 * still lands on the live page. A generated table of 1,490 literal pairs would not.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return [...graph().conceptById.keys()].map((concept) => ({ concept }));
}

export default async function ConceptRedirect({
  params,
}: { params: Promise<{ concept: string }> }) {
  const { concept } = await params;
  const to = hrefForConcept(concept);
  if (!to) notFound();
  permanentRedirect(to);
}
