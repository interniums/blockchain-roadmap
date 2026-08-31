// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-opcodes-memory-fmp-corruption  (break, difficulty 4)
 * Exercised by: test/FmpCorruption.t.sol
 * Run:      forge test --junit --match-path test/FmpCorruption.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Inside an inline assembly block, deliberately write to memory below 0x80 — first to the
 *   free-memory pointer at 0x40, then in a second variant to the permanently-zero slot at 0x60.
 *   After each, allocate a new dynamic array in ordinary Solidity and observe what happens to
 *   it. Write tests that assert the corruption concretely: an array whose length or contents are
 *   wrong, or two allocations that overlap. For each variant, name in a comment which reserved
 *   region was clobbered and which piece of compiler-generated behaviour depended on it. Then
 *   write the corrected version that allocates properly by reading and advancing the pointer.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Solidity's memory map — 0x00-0x3f is scratch, 0x40 holds the free-memory pointer, 0x60
 *     is permanently zero, and allocation starts at 0x80.
 *   - Memory is a flat byte array — Zero-initialised, byte-addressable, grows on demand,
 *     private to one frame, and gone when the frame ends.
 *   - The memory high-water mark never falls — You are charged for the highest byte offset
 *     ever touched in the frame, and there is no way to release memory.
 */
contract FmpCorruption {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
