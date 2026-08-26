import type { Track } from '@/lib/content/types';

/**
 * The track opens with what you'll be able to DO, in plain English — not a topic list.
 * These are authored in the track YAML; if a track has none, say so rather than
 * papering over it with the module titles.
 */
export function Capabilities({ track }: { track: Track }) {
  const capabilities = track.capabilities ?? [];

  return (
    <section aria-labelledby="capabilities-heading">
      <h2
        id="capabilities-heading"
        className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]"
      >
        What you&rsquo;ll be able to do
      </h2>

      {capabilities.length === 0 ? (
        <p className="mt-2 text-[14px] text-[var(--color-ink-2)]">
          No capabilities are authored for this track yet. Until they are, the module
          summaries below are the only statement of what it covers.
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {capabilities.map((c) => (
            <li
              key={c}
              className="border-l-2 border-[var(--color-accent-soft)] pl-3 text-[14.5px] leading-relaxed text-[var(--color-ink)]"
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
