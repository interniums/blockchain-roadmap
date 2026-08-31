// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-storage-layout-hand-derive-slots  (implement, difficulty 3)
 * Exercised by: test/SlotDerivation.t.sol
 * Run:      forge test --junit --match-path test/SlotDerivation.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Take a contract with a packed pair of small variables, a mapping(address => uint256), a
 *   mapping(address => mapping(uint256 => uint256)), a dynamic uint256 array and a string that
 *   is longer than 31 bytes. Compute by hand, on paper, the slot holding each of: the second
 *   packed variable, myMapping[addr], nested[addr][7], the array's length, the array's third
 *   element, and the string's first data word. Then write a Foundry test that reads each of
 *   those slots with vm.load and asserts the value equals what the getter returns, and confirm
 *   the same slots from a running node with cast storage.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Storage slot — Contract storage is a mapping from a 256-bit slot number to a 32-byte
 *     word.
 *   - Mapping slot derivation — A mapping value lives at keccak256(key concatenated with the
 *     mapping's declared slot).
 *   - Dynamic array layout — The declared slot holds the length; elements run contiguously
 *     from keccak256(slot).
 *   - Why the hashing is necessary — Mappings and dynamic arrays cannot be sized at compile
 *     time, so they cannot sit between their neighbours.
 */
contract SlotDerivation {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
