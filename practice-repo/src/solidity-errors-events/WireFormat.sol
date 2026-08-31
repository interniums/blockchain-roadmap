// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-errors-events-capstone-what-leaves-the-frame  (implement, difficulty 4)
 * Exercised by: test/capstone/WireFormat.t.sol
 * Run:      forge test --junit --match-path test/capstone/WireFormat.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   One contract plus one decoder, built together, so that every byte leaving a frame is
 *   something you chose rather than something the compiler chose for you. THE FAILURE CATALOGUE.
 *   Make the contract fail in every way it can: a require with no data, a require with a string,
 *   a require with a custom error, a revert with a custom error carrying arguments, an assert,
 *   and both compiler-thrown panics you can trigger. For each, capture the exact revert bytes
 *   and decode them in your own decoder — selector first, then arguments. Tabulate the byte
 *   length of each, because that is the cost of the choice. EAGER ARGUMENTS. Demonstrate that
 *   the arguments to a require's error are evaluated even when the condition passes, by making
 *   one of them expensive and measuring. State what that means for where you put a call in a
 *   require. PROVENANCE IS NOT PROVEN. Have contract A call contract B, where B reverts with an
 *   error that A also declares. Show that a client decoding the revert cannot tell which
 *   contract failed. Then show the same error forwarded through a proxy and note that it is not
 *   in the proxy's ABI at all — so a client working from the ABI cannot decode it. THE LOG. Emit
 *   events covering: a value type indexed, a value type in data, a dynamic type indexed, and the
 *   maximum number of indexed arguments. For each, show the topics and the data separately. Then
 *   prove the point: try to recover the original value of the indexed dynamic argument, fail,
 *   and fix the event so it is recoverable — stating what the fix costs. ON-CHAIN BLINDNESS.
 *   Write a test asserting a contract cannot read its own emitted event. THE PRICE OF INDEXING.
 *   Measure the gas of each event shape and state the per-topic cost you measured. Then design
 *   the final event schema for this contract, and say in two sentences what changing it in v2
 *   would silently break downstream.
 *
 * The 13 concepts this has to end up demonstrating:
 *   - Custom error — An error declared like an event and thrown with revert; its data is an
 *     ABI-encoded call to a same-named function.
 *   - Error selector — An error's selector is derived exactly like a function selector, from
 *     its canonical signature.
 *   - Error(string) and Panic(uint256) — Two selectors are built in: 0x08c379a0 for string
 *     reverts and 0x4e487b71 for panics.
 *   - Panic codes — A panic code names which compiler-inserted check fired: 0x11 overflow,
 *     0x12 divide by zero, 0x32 index out of bounds.
 *   - require with a custom error — require(cond, CustomError(args)) has been supported since
 *     0.8.26 via-IR and 0.8.27 legacy.
 *   - require arguments are evaluated eagerly — require's second argument is evaluated
 *     unconditionally, including on the happy path.
 *   - Error data is untrusted input — Any contract can return bytes matching any error
 *     signature, so a decoded name is a claim.
 *   - Forwarded errors are missing from the ABI — A contract's ABI JSON lists its own errors,
 *     not errors thrown by contracts it calls.
 *   - Event topics — topics[0] is keccak256 of the event's canonical signature; up to three
 *     indexed parameters follow.
 *   - Event data — Non-indexed parameters are ABI-encoded into the log's data field: readable,
 *     not filterable.
 *   - Indexed dynamic values are hashed — An indexed string, bytes, array or struct stores its
 *     Keccak hash in the topic, not the value.
 *   - What a log costs — 375 base, 375 per topic, 8 per byte of data, plus memory expansion.
 *   - Logs are not state — Logs go to the receipt, never to state; no contract, not even the
 *     emitter, can read one back.
 */
contract WireFormat {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
