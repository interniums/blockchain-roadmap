// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: fundamentals-state-one-root-every-client  (break, difficulty 3)
 * Exercised by: test/CanonicalRoot.t.sol
 * Run:      forge test --junit --match-path test/CanonicalRoot.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   The trie has no design freedom left in it, and this exercise is to find out why by removing
 *   some. Take your trie implementation and insert the same key-value set in two different
 *   orders. Assert the roots are identical. Then deliberately break canonicality in three ways,
 *   one at a time, and show each producing a different root from the same logical data: skip the
 *   inlining threshold, allow a non-minimal path encoding, and permit an extension node with an
 *   empty path. For each, name the rule you violated and state what would happen on a live
 *   network if two clients disagreed that way. Then connect it to the header: show that your
 *   root changes when any single account in the set changes, and that it does not change when
 *   the insertion order does. That pair of facts is what the state root in a block header is
 *   for. Close with two sentences on the replacement that did not happen: what Verkle promised
 *   about this structure, and what is being pursued instead.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Canonical roots — Every structural choice is forced, so two clients holding the same
 *     key-value set must produce byte-identical nodes and the same root.
 *   - The state root — The MPT root in each block header, committing to the entire world state
 *     in 32 bytes.
 *   - Verkle tries, and what actually replaced them — The vector-commitment structure once
 *     planned to succeed the MPT; as of August 2026 the live direction is a binary tree under
 *     EIP-7864 instead.
 */
contract CanonicalRoot {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
