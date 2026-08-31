// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-abi-selectors-hand-encode-calldata  (implement, difficulty 4)
 * Exercised by: test/HandEncoded.t.sol
 * Run:      forge test --junit --match-path test/HandEncoded.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Working from the ABI specification alone, write an encoder for
 *   f(uint256,uint32[],bytes10,bytes) in a language of your choice, then diff its output byte
 *   for byte against cast calldata for the same arguments. Repeat for a nested signature such as
 *   g(uint256[][],string[]) so that the inner offsets restart from the inner block. Then write a
 *   Foundry test that feeds your bytes to a deployed contract with a raw call and asserts the
 *   decoded arguments come back correct, and a second test asserting that hashing the signature
 *   with uint instead of uint256 produces a different, wrong selector.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Function selector — The first four bytes of calldata: the high-order four bytes of
 *     keccak256 of the canonical signature.
 *   - Canonical signature — name(type1,type2) with no spaces, no parameter names, no data
 *     locations and no return types.
 *   - Head and tail encoding — All heads first, then all tails: static values inline, dynamic
 *     values as a 32-byte offset.
 *   - Offsets are relative to the enclosing block — An offset counts bytes from the start of
 *     its enclosing encoding block, not from calldata zero.
 *   - Dynamic array and bytes tails — A dynamic array's tail is length then elements; bytes
 *     and string are length then raw padded bytes.
 */
contract HandEncoded {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
