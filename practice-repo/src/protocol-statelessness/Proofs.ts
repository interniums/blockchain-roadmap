/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: protocol-statelessness-measure-a-real-proof  (measure, difficulty 3)
 * Exercised by: test/proofs.test.ts
 * Run:      npx tsx src/measure-proofs.ts --slots config/slots.json --out out/proofs.json && npx vitest run test/proofs.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Using a public archive RPC, fetch state proofs for a set of real storage slots — pick a
 *   widely used ERC-20 and prove several balance-mapping slots, plus a few account-level proofs.
 *   Measure the actual encoded byte size of each returned proof, and decompose it: how many
 *   bytes are the values, and how many are sibling hashes. Then compute what the same set of
 *   proofs would cost in a binary tree with the same number of leaves, from the sibling
 *   arithmetic alone. Finally, pull a recent mainnet block, count the distinct accounts and
 *   storage slots it touched, and produce an estimated full-block witness size under each
 *   structure. State clearly which of your numbers are measured and which are derived.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - The witness — The state values plus sibling hashes needed to prove a block read and
 *     wrote exactly what it claims — the input a verifier needs instead of the whole state.
 *   - Witness size is what blocks statelessness — Witnesses must be small enough to gossip
 *     inside a slot, and hexary-trie witnesses for a full block are far too large — so the
 *     state commitment has to change first.
 *   - Merkle Patricia Trie — A hexary radix trie in which every node is referenced by the
 *     keccak256 of its RLP encoding, so one 32-byte root commits to the entire map.
 *   - The unified binary tree — EIP-7864 replaces the sixteen-way trie with an arity-2 tree
 *     using only a hash function — more levels, but one sibling per level.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const proofsUnimplemented = true;
