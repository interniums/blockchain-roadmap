/** Fixed locale so the prerendered page reads the same everywhere it is served. */
const DAY = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export function formatDay(iso: string | null): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return DAY.format(new Date(Date.UTC(y, m - 1, d)));
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return n === 1 ? one : many;
}
