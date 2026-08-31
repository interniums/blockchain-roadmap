// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-errors-events-indexed-string-is-a-hash  (break, difficulty 2)
 * Exercised by: test/EventIndexing.t.sol
 * Run:      forge test --junit --match-path test/EventIndexing.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Emit an event with an indexed string parameter and try to reconstruct the original string
 *   from the logs. You cannot: the topic is a hash. Fix it by emitting the value twice, once
 *   indexed and once not, and show that filtering by topic and reading the value both now work.
 *   In the same test file, emit one four-field event with 0, 1, 2 and 3 indexed parameters and
 *   record the gas of each so you can decompose the total into base, per-topic and per-byte
 *   components.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Indexed dynamic values are hashed — An indexed string, bytes, array or struct stores its
 *     Keccak hash in the topic, not the value.
 *   - Event topics — topics[0] is keccak256 of the event's canonical signature; up to three
 *     indexed parameters follow.
 *   - Event data — Non-indexed parameters are ABI-encoded into the log's data field: readable,
 *     not filterable.
 *   - What a log costs — 375 base, 375 per topic, 8 per byte of data, plus memory expansion.
 */
contract EventIndexing {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
