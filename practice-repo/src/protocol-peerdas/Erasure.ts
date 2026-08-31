/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: protocol-peerdas-erasure-recovery-boundary  (implement, difficulty 4)
 * Exercised by: test/erasure.test.ts
 * Run:      npx vitest run test/erasure.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Implement one-dimensional Reed-Solomon extension and recovery over a small prime field. Take
 *   a vector of n values, extend it to 2n, then delete a random subset and attempt recovery.
 *   Prove empirically that recovery succeeds with exactly n known values and fails with n minus
 *   one, whatever the pattern of deletions. Then model cross-seeding: simulate a set of nodes
 *   each holding a random slice, have any node that reaches the recovery threshold reconstruct
 *   and republish the columns it recovered, and measure how many rounds it takes for the whole
 *   network to hold what it needs when the adversary withholds various fractions below one half.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Extend to twice the length, recover from any half — Each blob is Reed-Solomon extended
 *     to twice its length, so any 50% of the extended data reconstructs the original.
 *   - Reconstruct once you hold half — A node holding 50% or more of the columns should
 *     reconstruct the whole matrix — after a random delay, so the network does not all
 *     reconstruct at once.
 *   - Cross-seeding — how a partially withheld block heals — After reconstructing, a node must
 *     re-expose the recovered columns as though it had received them, and may then discard
 *     what it does not custody.
 *   - The cell — The smallest independently authenticatable unit — 64 field elements, giving
 *     128 cells per extended blob.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const erasureUnimplemented = true;
