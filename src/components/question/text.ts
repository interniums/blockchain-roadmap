/**
 * A captured question is two things: what you asked, and the sentence that made you ask it.
 * Both live in one text field (the store has one), separated by a markdown-ish quote prefix so
 * the inbox can show them apart three months later without a schema change.
 */

export interface ParsedQuestion {
  body: string;
  /** The passage that provoked it, if one was selected. */
  quote: string | null;
}

export function parseQuestion(text: string): ParsedQuestion {
  const lines = text.split('\n');
  const body = lines.filter((l) => !l.trimStart().startsWith('>')).join('\n').trim();
  const quote = lines
    .filter((l) => l.trimStart().startsWith('>'))
    .map((l) => l.trimStart().replace(/^>\s?/, ''))
    .join('\n')
    .trim();
  return { body: body || text.trim(), quote: quote || null };
}

export function composeQuestion(body: string, quote: string | null): string {
  const q = (quote ?? '').trim();
  if (!q) return body.trim();
  const quoted = q.split('\n').map((l) => `> ${l}`).join('\n');
  return `${body.trim()}\n\n${quoted}`;
}

/** Selections can be a whole screen of prose. Keep the provocation, not the chapter. */
export function trimSelection(raw: string, limit = 400): string {
  const clean = raw.replace(/\s+/g, ' ').trim();
  return clean.length > limit ? `${clean.slice(0, limit).trimEnd()}…` : clean;
}
