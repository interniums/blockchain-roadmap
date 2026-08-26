# Code the slashing arithmetic and find where the curve is undecided

Practice: `fundamentals-incentives-implement-the-slashing-formula`
Acceptance: `npx vitest run test/slashing.test.ts`

Implement `src/incentives/slashing.ts` against `test/slashing.test.ts`, then
write up what you found here.

## Constants come from the specs, not from a blog post

Several of these changed across forks and the blog posts did not. Every
constant in `src/incentives/slashing.ts` carries a `specFile` and `symbol`
field, and a test fails until both are filled in with a real citation.

Start from `slash_validator` for the initial term and `process_slashings` for
the correlation term. The window constant, and the midpoint of that window at
which the correlation penalty is actually applied, both live in the spec
constants.

## Integer arithmetic in Gwei

The spec computes a penalty numerator, divides by total balance **integer**-wise,
then multiplies back by the effective balance increment. That divide-then-
multiply is deliberate rounding, and it is where floating point and the spec
part company. Floating point will pass tests you wrote yourself and disagree
with the spec at the edges — which are the only places anyone will ever check.

Use `bigint` throughout.

## The two candidate curves

- linear: `3 * EB * SB / TB`
- quadratic: `9 * EB * SB^2 / TB^2`

Substitute `SB = TB/3` into both before you plot anything. They both give `EB`.
That coincidence is exactly why checking only the one-third case tells you
nothing about which formula is live, and why the practice asks for the whole
range from 0 to 1/3.

## The write-up

### Where the curves diverge and where they coincide

TODO. Include the plot or table. `curve()` in `src/incentives/slashing.ts`
generates the points.

State the divergence in terms someone would act on: at what fraction of
correlated stake does the choice of formula change a validator's penalty by
more than, say, 10% of effective balance?

### Which one is live

TODO. State which formula your reading of `process_slashings` says is live.

**Or state plainly that you could not tell, and name the evidence that would
settle it.** That is an accepted answer and a better one than a confident guess.
Evidence that would settle it might be: the literal multiplier constant in the
current fork's spec file, a slashing event on mainnet with enough correlated
stake to distinguish the curves, or a consensus client's implementation read
directly.

### What the shape is for

TODO. Answer this one in your own words.

The initial penalty is small and roughly fixed. The correlation penalty scales
with how much *other* stake was slashed in the same window. That asymmetry is
the entire design: slashing is anti-**correlation**, not anti-**error**.

- One validator double-signing because of a misconfigured failover loses a
  rounding error.
- Ten thousand validators double-signing together because they all ran the same
  client on the same host lose everything.

Say what that implies about running a minority client, about hosting choices,
and about why the protocol is indifferent to your individual mistakes but not
to your correlated ones.

## What a good answer addresses

- Why accountable safety needs the penalty to reach the full effective balance
  exactly at one third, and not before or after.
- What the window length means, and why the penalty is assessed at its midpoint
  rather than immediately.
- Whether the curve you plotted is capped, and what happens past one third.
