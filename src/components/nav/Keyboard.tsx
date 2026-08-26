'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Global keymap. Esc goes UP one level; J/K move between siblings.
 * Handlers are no-ops when the target isn't available, never errors.
 */
export function Keyboard({ up, prev, next }: { up?: string; prev?: string; next?: string }) {
  const router = useRouter();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case 'Escape': if (up) { e.preventDefault(); router.push(up); } break;
        case 'j': case 'J': if (next) { e.preventDefault(); router.push(next); } break;
        case 'k': case 'K': if (prev) { e.preventDefault(); router.push(prev); } break;
        case 'm': case 'M': e.preventDefault(); router.push('/m'); break;
        case 'r': case 'R': e.preventDefault(); router.push('/review'); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router, up, prev, next]);
  return null;
}
