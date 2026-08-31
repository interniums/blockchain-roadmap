// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: fundamentals-state-build-the-trie  (implement, difficulty 3)
 * Exercised by: test/TrieNodes.t.sol
 * Run:      forge test --junit --match-path test/TrieNodes.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Implement a Merkle Patricia Trie from an empty map upward, using nothing but the four node
 *   types. Insert keys one at a time and, after each insert, print the tree's shape as node
 *   types. Construct an insertion sequence that forces each of the four to appear, including the
 *   null node, and one that turns a leaf into an extension plus a branch. Assert the shape at
 *   each step against a shape you wrote down first. Then show what is actually on the wire: for
 *   one branch, one extension and one leaf, print the encoded bytes and label every field. A
 *   branch has a specific arity and a value slot; say why both are there. Finally, demonstrate
 *   the rule that makes it a Merkle structure rather than just a trie: show that a child shorter
 *   than the threshold is inlined in its parent rather than referenced by hash, and find the key
 *   length at which your implementation flips from one to the other.
 *
 * The 7 concepts this has to end up demonstrating:
 *   - The world state is a key-value map — Ethereum's world state maps address to account, and
 *     each contract account owns its own map from 32-byte slot to 32-byte value.
 *   - Trie — A prefix tree where a value's position in the structure encodes its key, instead
 *     of the key being stored in a node.
 *   - Four node types, no fifth — An MPT node is exactly one of NULL, branch (17 items),
 *     extension (2 items) or leaf (2 items).
 *   - The NULL node and the empty trie — The empty node is the empty string, RLP `0x80`, so
 *     the empty trie's root is `keccak256(rlp(""))`.
 *   - Branch node — A 17-item list — sixteen child slots indexed by the next nibble, plus a
 *     seventeenth holding the value of a key that ends exactly here.
 *   - Extension node — A 2-item list `[hexPrefix(sharedNibbles, false), childRef]` whose only
 *     job is to compress a run of nibbles every key below it shares.
 *   - Leaf node — A 2-item list `[hexPrefix(remainingNibbles, true), value]` — and the
 *     terminator flag is the only thing distinguishing it from an extension on the wire.
 */
contract TrieNodes {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
