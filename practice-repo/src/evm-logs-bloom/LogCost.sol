// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-logs-bloom-emission-cost  (measure, difficulty 2)
 * Exercised by: test/LogCost.t.sol
 * Run:      forge test -vv --junit --match-path test/LogCost.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Emit the same payload three ways in one Foundry test: fully indexed across the available
 *   topic slots, fully non-indexed in the data field, and written to storage with SSTORE
 *   instead. Record gas for each. Derive the per-topic increment yourself by emitting LOG0
 *   through LOG4 with an identical data field and taking successive differences. Then
 *   demonstrate the indexed-dynamic rule: emit an event with an `indexed string`, show you
 *   cannot recover the string from the log, and show that filtering for the exact known string
 *   does work.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Logs are cheap but not free — A log costs a base charge plus a measured 375 gas per
 *     topic plus a per-byte charge on the data — far below storage, and not zero.
 *   - Indexed means searchable, and nothing else — Indexed parameters become topics and can be
 *     filtered by exact value; non-indexed parameters are ABI-encoded into the data and
 *     readable only after you have found the log.
 *   - An indexed dynamic type is stored hashed — An indexed string, bytes, array or struct
 *     becomes keccak256 of its value, so you can filter for a value you already know and never
 *     recover the original.
 *   - Storage is the expensive location — The only location that survives the transaction,
 *     priced two to three orders of magnitude above memory because every write mutates a trie
 *     every node keeps.
 */
contract LogCost {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
