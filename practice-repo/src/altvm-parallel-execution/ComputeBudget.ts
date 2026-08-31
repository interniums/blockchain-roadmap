/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: altvm-parallel-execution-tune-the-budget  (implement, difficulty 2)
 * Exercised by: test/compute-budget.test.ts
 * Run:      pnpm vitest run test/compute-budget.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write a TypeScript script that builds the same transfer twice at the same compute-unit
 *   price. The first version sets no ComputeBudget instruction at all. The second calls
 *   `simulateTransaction` first, reads the units consumed from the simulation, and sets
 *   `setComputeUnitLimit` to that value plus a stated margin. Print, for both, the requested
 *   limit, the simulated consumption, and the resulting prioritization fee computed as price
 *   times requested limit. Then add a third path that submits the tuned transaction and
 *   classifies its outcome into exactly one of four buckets: confirmed, confirmed-but-failed,
 *   never included before the blockhash expired, or never submitted. The classifier must
 *   distinguish an on-chain program error from a transaction that has no on-chain record at all.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Compute units — Solana's gas - a per-transaction budget defaulting to 200k CU per
 *     instruction, raisable to 1.4M, with no refund.
 *   - Priority fee is requested CU times CU price — You are billed on the compute limit you
 *     asked for, not the compute you consumed.
 *   - Included means paid — Base fee and priority fee are charged for any transaction the
 *     leader includes, including one that fails.
 *   - Dropped, not reverted — Under load the symptom is transactions that never landed -
 *     forwarded, discarded, or expired with their blockhash.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const computeBudgetUnimplemented = true;
