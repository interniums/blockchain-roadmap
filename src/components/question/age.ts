/**
 * What is left of the question helpers once age is gone.
 *
 * There used to be a whole vocabulary here — buckets, "asked 3 weeks ago", "over 3 months",
 * an oldest-open-loop figure. All of it made an unanswered question into a debt with a running
 * clock, which is exactly the pressure this product refuses to apply. A question is either open
 * or it is not; how long it has been open is not the app's business.
 */

export function wordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}
