/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: protocol-statelessness-hexary-versus-binary  (implement, difficulty 3)
 * Exercised by: test/trees.test.ts
 * Run:      npx vitest run test/trees.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Implement a hexary Merkle tree and a binary Merkle tree over the same set of 2^16 leaves,
 *   with the same hash function. For each, produce inclusion proofs for a random sample of
 *   leaves and measure proof size and verification time. Then implement the proposed key
 *   derivation: given an address and a storage slot, compute the stem and suffix, and
 *   demonstrate that several adjacent storage slots of one contract share a stem. Show that a
 *   multi-slot proof under a shared stem costs one branch opening rather than one per slot, and
 *   quantify the saving for a contract that reads a run of adjacent slots.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - The unified binary tree — EIP-7864 replaces the sixteen-way trie with an arity-2 tree
 *     using only a hash function — more levels, but one sibling per level.
 *   - One 32-byte key space for everything — Account headers, code and storage all live in one
 *     key space with subtree prefixes, removing the per-account storage trie entirely.
 *   - Stem and suffix — locality made structural — Keys split into a 31-byte stem and a 1-byte
 *     suffix, so 256 related values share a stem and one branch opening covers all of them.
 *   - The witness — The state values plus sibling hashes needed to prove a block read and
 *     wrote exactly what it claims — the input a verifier needs instead of the whole state.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const treesUnimplemented = true;
