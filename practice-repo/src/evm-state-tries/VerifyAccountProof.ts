/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-state-tries-verify-account-proof  (implement, difficulty 5)
 * Exercised by: test/verifyAccountProof.test.ts
 * Run:      npx vitest run test/verifyAccountProof.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write `verifyAccountProof(stateRoot, address, proof)` in TypeScript with no Merkle library.
 *   Walk the RLP-encoded node list returned by `eth_getProof`: at each step, keccak256 the node,
 *   check the hash equals the reference held by its parent (the state root for the first node),
 *   decode the node, and consume nibbles of keccak256(address) to choose the next child. Return
 *   the decoded `[nonce, balance, storageRoot, codeHash]`. Fetch the proof from one public RPC
 *   provider and the block header's stateRoot from a different one, so the verification is
 *   genuinely cross-checked. Then add negative tests: flip a single byte in any node, and swap
 *   in a leaf belonging to a different account.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Merkle Patricia Trie — A hexary radix trie in which every node is referenced by the
 *     keccak256 of its RLP encoding, so one 32-byte root commits to the entire map.
 *   - Leaf, extension, branch — Three node kinds — leaf, extension for a shared path prefix,
 *     and a 17-slot branch — and the compression is what keeps proofs short on a sparse key
 *     space.
 *   - Trie keys are hashed, not raw — Paths are keccak256(address) and keccak256(slot), so no
 *     attacker can grind keys into a pathologically deep subtree.
 *   - eth_getProof — Returns the RLP node path from the state root down to an account leaf
 *     plus per-slot paths from that account's storage root, so anyone holding the root can
 *     verify a value offline.
 *   - A proof proves membership, not truth — A Merkle proof shows a value sits under a given
 *     root; believing that root is canonical is a separate problem you still have to solve.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const verifyAccountProofUnimplemented = true;
