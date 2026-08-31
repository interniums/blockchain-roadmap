/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: protocol-peerdas-sampling-security-curve  (measure, difficulty 3)
 * Exercised by: test/sampling-security.test.ts
 * Run:      npx vitest run test/sampling-security.test.ts && npx tsx src/curves.ts --out out/curves.json
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Compute and chart the detection probability for a withholding adversary. For a matrix of 128
 *   columns with more than half withheld, plot the probability that a single node drawing k
 *   random columns notices, for k from 1 to 32. On the same chart, plot the probability that at
 *   least one node out of N notices, for several values of N up to a realistic network size.
 *   Mark the spec's per-slot sample count on both curves. Then run a Monte Carlo simulation as
 *   an independent check: build a 128-column matrix, withhold exactly 64 columns, simulate 5,000
 *   nodes each sampling the spec count, and count how many fail to detect it. Compare the
 *   simulated failure count with the analytic prediction.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Sampling beyond custody — An honest node samples 8 custody groups' worth of columns per
 *     slot beyond what it holds — or its own custody count, whichever is larger.
 *   - Why a handful of samples is enough — Withholding enough to prevent reconstruction means
 *     withholding over half the columns, and k random samples miss that with probability one
 *     in two to the k.
 *   - Extend to twice the length, recover from any half — Each blob is Reed-Solomon extended
 *     to twice its length, so any 50% of the extended data reconstructs the original.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const samplingSecurityUnimplemented = true;
