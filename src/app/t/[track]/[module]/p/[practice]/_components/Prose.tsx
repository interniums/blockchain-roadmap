/**
 * Practice specs, criteria and hints are authored with markdown-style backticks.
 * This renders those spans as <code> and leaves everything else alone.
 * No directive: usable from both the server page and the client hint ladder.
 */

/**
 * The types promise string[]; the YAML does not always deliver one.
 * A line like `- The lesson generalises: any check that ...` parses as a
 * single-key map, not a string, so 10 hints and criteria arrive as objects.
 * Rejoining key and value with ": " reproduces the sentence exactly, which
 * beats printing [object Object] or dropping the line.
 */
export function asText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(asText).join(' ');
  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${k}: ${asText(v)}`)
      .join(' ');
  }
  return String(value);
}

export function Prose({ text }: { text: unknown }) {
  const parts = asText(text).split(/`([^`]+)`/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code
            key={i}
            className="rounded bg-[var(--color-surface-2)] px-1 font-mono text-[0.9em] text-[var(--color-ink)]"
          >
            {part}
          </code>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
