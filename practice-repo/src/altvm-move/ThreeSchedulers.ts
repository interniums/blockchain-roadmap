/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: altvm-move-capstone-three-schedulers-one-workload  (implement, difficulty 5)
 * Exercised by: test/three-schedulers.test.ts
 * Run:      npx vitest run test/three-schedulers.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Solana, Aptos and Sui parallelise by three genuinely different mechanisms, and the
 *   difference reaches users as three different failures. Build all three over one workload and
 *   find out which. Implement three schedulers in TypeScript against a common transaction
 *   interface. The first takes reader/writer locks from a declared access list and never
 *   co-schedules conflicting transactions; there is no abort-and-retry step in this model at
 *   all, which is the detail most ports of the mental model get wrong. The second executes
 *   speculatively, records what each transaction read and wrote, detects where a lower-indexed
 *   transaction invalidated a read, and re-executes the losers, so the output is exactly what
 *   sequential execution in the block's preset order would have produced. The third partitions
 *   by object ownership and takes a path that skips consensus for single-owner transactions.
 *   Then run one contended workload through all three, a popular mint or one pool everybody is
 *   trading against, and report throughput, wasted work, and the failure the user actually
 *   experiences. Add a transaction batch touching several objects in sequence, so the third
 *   model has something to schedule beyond the trivial case.
 *
 * The 11 concepts this has to end up demonstrating:
 *   - Where Move came from — A Rust-influenced contract language built at Meta for Diem, now
 *     the basis of Aptos and Sui.
 *   - Resources are linear — A value the type system forbids from being copied or silently
 *     dropped - so an asset is a compiler guarantee.
 *   - The four abilities — Types carry copy, drop, store and key - omitting copy and drop is
 *     what makes a type asset-like.
 *   - The bytecode verifier — Resource, type and reference safety are re-checked at
 *     deployment, so the guarantees survive hand-written bytecode.
 *   - There is no single Move — Aptos Move keeps account-rooted global storage; Sui Move
 *     removed global storage for an object model.
 *   - Aptos global storage — Resources live inside accounts and are addressed by (account
 *     address, type), at most one per type per account.
 *   - Sui objects — Every stateful thing is an object with a unique id, passed explicitly into
 *     transactions rather than fetched.
 *   - Owned versus shared objects — Transactions touching only owned objects skip full
 *     consensus; shared objects require consensus ordering.
 *   - Block-STM — Aptos executes optimistically, detects read/write conflicts afterwards, and
 *     re-executes the losers.
 *   - Three strategies, one problem — Declare and lock, execute and retry, or partition by
 *     ownership and skip consensus.
 *   - Programmable Transaction Blocks — One transaction chains many Move calls, feeding each
 *     call's outputs into the next - closer to a script than a call.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const threeSchedulersUnimplemented = true;
