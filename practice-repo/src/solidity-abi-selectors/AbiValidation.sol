// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-abi-selectors-decoding-is-validation  (break, difficulty 3)
 * Exercised by: test/AbiValidation.t.sol
 * Run:      forge test --junit --match-path test/AbiValidation.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Decoding is where the ABI checks your arguments, and packing is where that checking is
 *   thrown away. WHAT DECODING CATCHES. Hand-craft calldata with an out-of-range value for a
 *   narrow type — a `uint8` carrying a value above 255, or a `bool` that is neither 0 nor 1.
 *   Call a normal function with it and show the decoder rejecting it. Report what the revert
 *   looks like. WHAT IT DOES NOT. Now show strict mode is not enforced: craft calldata that
 *   violates the encoding rules — trailing junk after the arguments, or an offset that points
 *   somewhere unexpected — and get it accepted. For each case, state what a strict decoder would
 *   have rejected and why the one you called did not. PACKED THROWS IT AWAY. Take the same
 *   arguments and encode them packed. Show there is no length information and therefore nothing
 *   to validate, and demonstrate the consequence: two different argument tuples whose packed
 *   encoding is identical, used to pass a check that hashes them. FROM THE INSIDE. Finally,
 *   write a function that reads the raw call itself: recover the selector from the calldata and
 *   compare it against the built-in, then decode one argument by hand from a byte offset you
 *   compute. Assert both match what the normal decoding produced.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - abi.decode validates — abi.decode re-runs the encoding rules in reverse and reverts on
 *     malformed input.
 *   - Strict encoding is not enforced on decode — Solidity's encoder always emits strict
 *     encoding; its decoder does not require it.
 *   - abi.encodePacked — Packed mode drops padding and array lengths, so different argument
 *     tuples can produce identical bytes.
 *   - msg.data and msg.sig — msg.data is the whole calldata byte array; msg.sig is its first
 *     four bytes.
 */
contract AbiValidation {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
