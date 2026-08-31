// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-opcodes-memory-six-places-a-byte-can-live  (measure, difficulty 3)
 * Exercised by: test/DataLocations.t.sol
 * Run:      forge test --junit --match-path test/DataLocations.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   One value, six locations, six prices. Establish the table by measurement. THE WORD. Show
 *   that the machine's unit is 256 bits by storing a single byte and measuring what it cost.
 *   Then show packing working where it works and not working where it does not: pack four small
 *   values into one storage slot and measure the saving, then pack the same four in memory and
 *   show there is no saving. State the rule that explains the difference. THE STACK. Hit both
 *   stack limits. Reach past the sixteenth item and show the compiler failing rather than the
 *   machine — quote the error. Then push past the depth limit at runtime and show what the
 *   machine does instead. Two different failures, two different layers, and the write-up says
 *   which is which. CALLDATA. Show calldata is read-only by attempting to write it. Then show it
 *   is priced at the edge: send the same logical argument as a long calldata payload and as a
 *   short one that the contract expands, and report both total costs including the intrinsic
 *   charge. State which is cheaper and at what size the answer flips. THE TABLE. Close with the
 *   six-row table: stack, calldata, memory, storage, transient storage, and returndata. Cost to
 *   read, cost to write, and lifetime for each — every number measured, none copied.
 *
 * The 9 concepts this has to end up demonstrating:
 *   - The word is 256 bits — Every stack item is exactly 32 bytes; there is no smaller native
 *     word, which is why uint8 arithmetic costs more than uint256.
 *   - The 1024-item operand stack — A frame's stack holds at most 1024 items, and overflowing
 *     or underflowing it is an exceptional halt, not a catchable error.
 *   - DUP and SWAP reach only 16 slots — DUP1-DUP16 and SWAP1-SWAP16 are the only
 *     stack-addressing instructions, so code can touch just the top sixteen items.
 *   - Stack too deep — A machine limitation surfacing as a compiler error — too many live
 *     locals for the 16-slot reach — and in August 2026 it is still real for ordinary
 *     projects.
 *   - Calldata is read-only and zero-pads — The frame's immutable input array — readable with
 *     CALLDATALOAD and CALLDATACOPY, never writable, and reads past its end return zeros
 *     rather than reverting.
 *   - Calldata is paid for at the transaction boundary — The per-byte charge happens once,
 *     when the transaction enters the block; inside execution a CALLDATALOAD is an ordinary
 *     cheap opcode.
 *   - Six places a byte can live — Stack, memory, calldata and storage are four different
 *     machines with different lifetimes and prices; return data and code are two more
 *     read-only regions.
 *   - Storage is the expensive location — The only location that survives the transaction,
 *     priced two to three orders of magnitude above memory because every write mutates a trie
 *     every node keeps.
 *   - Packing helps storage and nothing else — Squeezing several small values into one 32-byte
 *     slot saves real money in storage and saves nothing in memory or on the stack.
 */
contract DataLocations {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
