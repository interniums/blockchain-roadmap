/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: altvm-parallel-execution-write-lock-census  (measure, difficulty 3)
 * Exercised by: test/write-lock-census.test.ts
 * Run:      pnpm vitest run test/write-lock-census.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Pull 200 consecutive recent blocks from a public RPC with `getBlock` at
 *   `maxSupportedTransactionVersion: 0`. For every transaction, extract the account keys marked
 *   writable - including keys resolved through address lookup tables - and the compute units the
 *   transaction consumed. Aggregate two distributions: write-lock count per account, and
 *   consumed compute units per writable account per block. Produce a report naming the five most
 *   write-contended accounts in your sample, the largest share of a single block's compute that
 *   any one writable account took, and how close that came to the 12M per-account ceiling. Then
 *   take the single hottest account and one cold account and chart `getRecentPrioritizationFees`
 *   for both over at least an hour, and state - with the numbers - whether the two had
 *   materially different fee floors.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Reader/writer locks on account keys — Many transactions may hold a read lock on one
 *     account at once; a write lock excludes every other lock.
 *   - Declared read/write sets — The runtime knows a transaction's complete read/write set
 *     before executing its first instruction.
 *   - The 12M per-writable-account ceiling — One writable account may consume at most 12M
 *     compute units in a block, far below the block limit.
 *   - Local fee markets — Because contention is per-account, a bidding war over one hot
 *     account is meant to leave unrelated traffic cheap.
 *   - Locality is imperfect — One global priority queue over shared workers and shared block
 *     space means a fee war on one account still degrades everyone.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const writeLockCensusUnimplemented = true;
