/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-blocks-rebuild-the-block-hash  (implement, difficulty 4)
 * Exercised by: test/header-hash.test.mjs
 * Run:      node --test test/header-hash.test.mjs
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Fetch a recent mainnet block with `eth_getBlockByNumber`, take every header field,
 *   RLP-encode them in the order the execution specs declare them, keccak-256 the encoding, and
 *   assert the result equals the block's reported `hash`. Take the field order from the `Header`
 *   dataclass in ethereum/execution-specs for the fork your block belongs to — not from a blog
 *   post and not from this exercise, because the ordering is the thing being tested and an RLP
 *   list is order-sensitive. Then make the exercise teach its own lesson: add a test that omits
 *   one field and asserts the hash no longer matches, and a test that swaps two adjacent fields
 *   and asserts the same. Finally, print the three post-Merge fossil fields and assert their
 *   values are the constants they are frozen at. Tests go in `test/header-hash.test.mjs`.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - The block hash is the header hash — `blockHash = keccak256(rlp(header))` — nothing in
 *     the body is hashed into it directly.
 *   - The header is the block — Only the header is hashed and linked; everything in the body
 *     reaches consensus through a root inside the header.
 *   - Fields kept only so the encoding never changed — `difficulty`, `nonce` and `ommersHash`
 *     are frozen constants retained purely to preserve the header layout.
 *   - The requests hash is not a trie root — Pectra's `requestsHash` is a SHA-256 accumulator
 *     over typed execution-layer requests, not a Merkle Patricia root.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const headerHashUnimplemented = true;
