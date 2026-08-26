import Link from 'next/link';
import type { Crumb } from '@/lib/content/types';

/** Always the full ladder. Every segment links up one level. */
export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--color-ink-3)]">
      <ol className="flex flex-wrap items-center gap-1.5">
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">›</span>}
            {i === crumbs.length - 1 ? (
              <span className="text-[var(--color-ink)]" aria-current="page">{c.label}</span>
            ) : (
              <Link href={c.href} className="hover:text-[var(--color-accent)]">{c.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
