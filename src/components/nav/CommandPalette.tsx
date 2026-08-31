'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SearchItem } from '@/lib/content/searchIndex';

const ORDER: SearchItem['kind'][] = ['Lesson', 'Concept', 'Module', 'Track', 'Practice', 'Source'];

export function CommandPalette({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((v) => !v); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Mounted only while open, so each open starts from fresh query/selection state.
  if (!open) return null;
  return <Palette items={items} onClose={() => setOpen(false)} />;
}

function Palette({ items, onClose }: { items: SearchItem[]; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { requestAnimationFrame(() => inputRef.current?.focus()); }, []);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const n = q.toLowerCase();
    const scored = items
      .map((it) => {
        const l = it.label.toLowerCase();
        let s = -1;
        if (l === n) s = 0;
        else if (l.startsWith(n)) s = 1;
        else if (l.includes(n)) s = 2;
        else if (it.id.includes(n)) s = 3;
        else if (it.sub.toLowerCase().includes(n)) s = 4;
        return s < 0 ? null : { it, s: s * 10 + ORDER.indexOf(it.kind) };
      })
      .filter(Boolean) as { it: SearchItem; s: number }[];
    return scored.sort((a, b) => a.s - b.s).slice(0, 30).map((x) => x.it);
  }, [q, items]);

  const go = (i: number) => { const r = results[i]; if (r) { onClose(); router.push(r.href); } };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-[12vh]" onClick={onClose}>
      <div
        role="dialog" aria-modal="true" aria-label="Search"
        className="w-full max-w-2xl overflow-hidden rounded-lg border border-[var(--color-rule)] bg-[var(--color-surface)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef} value={q}
          onChange={(e) => { setQ(e.target.value); setSel(0); }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
            if (e.key === 'Enter') { e.preventDefault(); go(sel); }
          }}
          placeholder="Search lessons, concepts, modules, sources…"
          className="w-full border-b border-[var(--color-rule)] bg-transparent px-4 py-3 text-[15px] outline-none"
        />
        <ul className="max-h-[52vh] overflow-y-auto">
          {results.map((r, i) => (
            <li key={`${r.kind}-${r.id}`}>
              <button
                onMouseEnter={() => setSel(i)} onClick={() => go(i)}
                className={`flex w-full items-baseline gap-3 px-4 py-2 text-left ${i === sel ? 'bg-[var(--color-surface-2)]' : ''}`}
              >
                <span className="w-16 shrink-0 text-[10px] uppercase tracking-wider text-[var(--color-ink-3)]">{r.kind}</span>
                <span className="truncate text-[14px]">{r.label}</span>
                <span className="ml-auto truncate pl-3 text-[12px] text-[var(--color-ink-3)]">{r.sub}</span>
              </button>
            </li>
          ))}
          {q && results.length === 0 && <li className="px-4 py-6 text-center text-[13px] text-[var(--color-ink-3)]">No matches</li>}
        </ul>
      </div>
    </div>
  );
}
