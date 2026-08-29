import { graph, getModulesOf } from './load';

export interface SearchItem { id: string; label: string; sub: string; href: string; kind: 'Track' | 'Module' | 'Lesson' | 'Concept' | 'Source' | 'Practice' }

let idx: SearchItem[] | null = null;

/** Built once at build time and shipped to the palette. Covers every level of the ladder. */
export function searchIndex(): SearchItem[] {
  if (idx) return idx;
  const g = graph();
  const out: SearchItem[] = [];

  for (const t of g.tracks) {
    out.push({ id: t.id, label: t.title, sub: `Track ${t.number}`, href: `/t/${t.id}`, kind: 'Track' });
    for (const m of getModulesOf(t.id)) {
      out.push({ id: m.id, label: m.title, sub: t.title, href: `/t/${t.id}/${m.id}`, kind: 'Module' });
      for (const l of m.lessons ?? []) {
        out.push({ id: l.id, label: l.title, sub: `${t.title} · ${m.title}`, href: `/t/${t.id}/${m.id}/${l.id}`, kind: 'Lesson' });
      }
    }
  }
  for (const [id, c] of g.conceptById) {
    out.push({ id, label: c.title, sub: c.oneLine, href: `/c/${id}`, kind: 'Concept' });
  }
  for (const [id, p] of g.practiceById) {
    out.push({ id, label: p.title, sub: `${p.kind} · practice`, href: `/p/${id}`, kind: 'Practice' });
  }
  for (const [id, s] of g.sourceById) {
    out.push({ id, label: s.title, sub: s.tier, href: s.url, kind: 'Source' });
  }
  idx = out;
  return out;
}
