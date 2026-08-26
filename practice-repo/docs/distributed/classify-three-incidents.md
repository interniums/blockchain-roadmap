# Classify three real chain incidents

Practice: `fundamentals-distributed-classify-three-incidents`
Acceptance: `npx markdownlint docs/incidents/*.md && node scripts/check-incident-writeup.mjs docs/incidents`

Write three analyses into `docs/incidents/`. Templates are already there —
`01-incident.md`, `02-incident.md`, `03-incident.md`. Rename them to something
descriptive.

## Start from the definitions, not the incident

This is the instruction that makes the exercise work. Fix the definitions
first, then go looking:

- **Safety failure** — two conflicting things were both finalised. Someone with
  a valid finality proof for state A can be shown a valid finality proof for
  incompatible state B. Extremely rare. Has never happened on Ethereum mainnet.
- **Liveness failure** — nothing progressed. The chain could not finalise, or
  could not include transactions at all, for a sustained period. Uncommon, but
  it has happened.
- **Neither** — and this is most incidents. Something built on top of the chain
  degraded, or one client diverged while the network as a whole carried on, or
  a service everyone depended on went away.

At least one of your three must be classified as **neither**, with reasoning.
If all three come out as safety or liveness failures you have almost certainly
mis-defined one of the terms.

## The rule that makes this exercise bite

An analysis fails if it uses the phrase "the chain went down" without saying
which property that maps to. The phrase is doing no work. Whose guarantee
broke? What could a user no longer rely on? Answer that instead.

## Candidates worth considering

Pick from documented incidents on Ethereum or any L2 — a finalisation stall, a
deep reorg, a client consensus bug, a sequencer outage. Each write-up must cite
a **primary** source: a post-mortem from the team involved, or a client release
note. Not a news article, not a thread summarising one.

Two traps in the obvious candidates:

- A client bug that made one implementation compute a different state root is
  not automatically a safety failure *of the protocol*. Ask what actually
  finalised. If the network converged on one chain and only the minority client
  was wrong, no conflicting finalisation occurred.
- A sequencer outage on an L2 usually stops new transactions but does not
  reverse anything, and often leaves a forced-inclusion escape hatch open. That
  is a liveness degradation of a service, and whether it is a liveness failure
  *of the L2* depends on whether the escape hatch worked. Check.

## Each write-up must contain

1. **What happened** — the observable evidence, with the primary source cited.
2. **What was violated** — which property, and *whose* guarantee. Be specific
   about the party: the protocol's, one client's, one rollup's, one RPC
   provider's.
3. **The classification** — safety, liveness, or neither.
4. **The counter-reading** — the most plausible argument for classifying it
   differently, stated fairly, and your answer to it. Not a strawman.
5. **RPC observability** — could an ordinary user have detected this from a
   single RPC endpoint alone? Usually the interesting answer is no, and the
   reason why is the lesson.

## What a good answer addresses

- The difference between "the protocol's guarantee broke" and "the guarantee I
  assumed the protocol gave me was never the guarantee it gave".
- Why the availability-versus-finality dilemma means a chain that keeps
  producing blocks it cannot finalise is behaving as designed, not failing.
- For the RPC question: what a single endpoint can and cannot tell you. It can
  show you a stalled `finalized` tag. It cannot tell you the network split,
  and it will happily serve you a minority fork with a straight face.
