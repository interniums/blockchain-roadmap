import Link from 'next/link';
import { hrefForConcept } from '@/lib/content/load';
import type { LessonBody } from '@/lib/content/body';
import type { ConceptRef } from './graph';

/**
 * The top of the margin gutter: what this lesson stands on, and what it was measured against.
 *
 * Both used to be framed panels in the column — a two-column bordered grid for a median of two
 * prerequisites, and a provenance strip above the first paragraph. Neither is something you read;
 * they are things you occasionally look up, which is what a gutter is for.
 *
 * A float rather than a positioned block, for the same reason the citation notes are: floats stack,
 * so this and the first citation note cannot land on top of each other.
 */
export function Margin({ assumes, body }: { assumes: ConceptRef[]; body: LessonBody }) {
  const stack = Object.entries(body.stack ?? {});
  const resolved = assumes.filter((a) => !a.missing);
  if (resolved.length === 0 && stack.length === 0) return null;

  return (
    <aside className="cite-note" aria-label="About this lesson">
      {resolved.length > 0 && (
        <div>
          <span className="cite-note-meta !mt-0 uppercase tracking-wider">Stands on</span>
          <ul className="mt-1 flex flex-col gap-0.5">
            {resolved.map((a) => {
              const href = hrefForConcept(a.id);
              return (
                <li key={a.id}>
                  {href ? (
                    <Link href={href} className="cite-note-link" title={a.oneLine}>
                      {a.title}
                    </Link>
                  ) : (
                    <span title={a.oneLine}>{a.title}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {stack.length > 0 && (
        <div className={resolved.length > 0 ? 'mt-3' : undefined}>
          <span className="cite-note-meta !mt-0 uppercase tracking-wider">Measured on</span>
          <ul className="mt-1 flex flex-col gap-0.5 font-[family-name:var(--font-mono)]">
            {stack.map(([k, v]) => (
              <li key={k}>{k} {v}</li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
