/**
 * Structural CSS for the roadmap board. Kept here rather than in globals.css because
 * globals.css is shared; these rules only ever apply inside /m.
 *
 * Only two things need real CSS: the connector styling (which has to react to an ancestor's
 * data attribute) and the card hover/active affordance. Everything else is utility classes.
 */
export const ROADMAP_CSS = `
.cp-edge { fill: none; stroke-linecap: round; }

.cp-edge--spine {
  stroke: var(--color-ink-3);
  stroke-width: 2.5;
  opacity: .85;
}

/* Cross-track dependencies: drawn always, muted by default. Hidden-by-default is how a
   connected map becomes a hairball; muted keeps the shape without the noise. */
.cp-edge--cross {
  stroke: var(--color-ink-3);
  stroke-width: 1.5;
  stroke-dasharray: 5 6;
  opacity: .3;
}

[data-lines="strong"] .cp-edge--cross {
  stroke-width: 2;
  stroke-dasharray: none;
  opacity: .95;
}

[data-lines="strong"] .cp-edge--spine { opacity: .5; }

.cp-card {
  transition: border-color .12s ease, background-color .12s ease;
}
.cp-card:hover {
  border-color: var(--color-accent);
  background: var(--color-accent-soft);
}
`;
