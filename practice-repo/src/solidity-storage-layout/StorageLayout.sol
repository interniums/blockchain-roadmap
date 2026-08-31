// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-storage-layout-capstone-derive-every-slot  (implement, difficulty 4)
 * Exercised by: test/capstone/StorageLayout.t.sol
 * Run:      forge test --junit --match-path test/capstone/StorageLayout.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Take a deployed mainnet contract with at least twelve state variables including a mapping, a
 *   dynamic array, a struct and a packed group. Produce a complete slot map, derived by hand and
 *   then proved against the chain. THE MAP. For every state variable: slot number, byte offset
 *   within the slot, and width. Include the packed group and show which variables share a slot
 *   and why the one after them does not. State the rule that ends a slot. PROVE IT. For each
 *   entry, read the value from the live chain at the slot and offset you computed and assert it
 *   matches what the contract's own getter returns. A getter that does not exist is not an
 *   excuse — read the slot and decode it. THE DERIVED ONES. Compute, by hand, the slot of one
 *   mapping entry and one dynamic array element, including a nested mapping and an array inside
 *   a struct. Show the hash inputs for each. Then prove each against the chain. THE GAP. Find a
 *   place in the layout where the compiler left part of a slot unused, and say what declaration
 *   change would have filled it. Then show — measured, not asserted — what that change would
 *   have saved on a function that writes those variables together. REORDER IT. Produce a
 *   reordered version of the same declarations that is strictly cheaper for one named operation
 *   and strictly more expensive for another. Report both numbers. If you cannot make something
 *   worse, you have not found a real trade. TRANSIENT. Finally, add a transient variable and
 *   show that its layout is a separate address space: same slot number, different value, and
 *   gone at the end of the transaction.
 *
 * The 8 concepts this has to end up demonstrating:
 *   - Storage slot — Contract storage is a mapping from a 256-bit slot number to a 32-byte
 *     word.
 *   - Slot packing — Contiguous variables smaller than 32 bytes share one slot when they fit,
 *     lower-order first.
 *   - Declaration order determines slot count — uint128, uint128, uint256 takes two slots;
 *     uint128, uint256, uint128 takes three.
 *   - Structs and arrays start a new slot — Struct and array data always begins a new slot and
 *     packs tightly only within itself.
 *   - Mapping slot derivation — A mapping value lives at keccak256(key concatenated with the
 *     mapping's declared slot).
 *   - Dynamic array layout — The declared slot holds the length; elements run contiguously
 *     from keccak256(slot).
 *   - Why the hashing is necessary — Mappings and dynamic arrays cannot be sized at compile
 *     time, so they cannot sit between their neighbours.
 *   - Transient storage layout — Transient storage is a second slot-numbered space with its
 *     own layout and its own counter.
 */
contract StorageLayout {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
