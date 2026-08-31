/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: scaling-blobs-peerdas-should-i-blob  (implement, difficulty 3)
 * Exercised by: test/blob-vs-calldata.test.ts
 * Run:      npx vitest run test/blob-vs-calldata.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Implement a function that decides, for a given batch, whether posting it as a type-3 blob
 *   transaction or as type-2 calldata is cheaper right now. It takes the compressed batch bytes
 *   and reads the current execution base fee and blob base fee from a public RPC. For the blob
 *   path it must account for whole-blob granularity — a batch smaller than one blob still pays
 *   for one blob, and a batch larger than one blob pays for several. For the calldata path it
 *   must price the bytes at the current execution base fee including the calldata floor rules.
 *   Return the cheaper path and both costs. Then test it against three fixtures: blob base fee
 *   pinned at its 1 wei floor, blob base fee spiking with execution gas calm, and the reverse.
 *   Prove the decision flips.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - The blob gas market — Blobs price on their own EIP-1559-style market with its own base
 *     fee, which can spike while execution gas is calm.
 *   - The blob-or-calldata decision — A batcher must continuously compare the cost of a type-3
 *     blob submission against plain type-2 calldata and pick the cheaper path per batch.
 *   - The blob base fee floor — When blob demand sits below target the blob base fee decays to
 *     its 1 wei floor, making data posting effectively free — until demand crosses target
 *     again.
 *   - Batch compression — Rollups compress batches before posting, so the effective L1 cost
 *     per L2 transaction is far below the raw byte cost.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const blobVsCalldataUnimplemented = true;
