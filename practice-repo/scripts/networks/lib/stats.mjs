/**
 * Summary statistics. Support code - not part of either exercise.
 * Every function takes an array of numbers and returns null for an empty one, rather than NaN.
 */

export function quantile(values, q) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((x, y) => x - y);
  const position = (sorted.length - 1) * q;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

export const median = (values) => quantile(values, 0.5);
export const p95 = (values) => quantile(values, 0.95);
export const max = (values) => (values.length === 0 ? null : Math.max(...values));
export const min = (values) => (values.length === 0 ? null : Math.min(...values));
export const mean = (values) => (values.length === 0 ? null : values.reduce((a, b) => a + b, 0) / values.length);

/** |A ∩ B| / |A ∪ B|. Two empty sets are defined here as fully overlapping. */
export function jaccard(a, b) {
  if (a.size === 0 && b.size === 0) return 1;
  let intersection = 0;
  for (const item of a) if (b.has(item)) intersection++;
  return intersection / (a.size + b.size - intersection);
}

/** Everything in `a` that is not in `b`. */
export function difference(a, b) {
  const out = new Set();
  for (const item of a) if (!b.has(item)) out.add(item);
  return out;
}

export function summarise(values) {
  return { count: values.length, median: median(values), p95: p95(values), max: max(values), mean: mean(values) };
}
