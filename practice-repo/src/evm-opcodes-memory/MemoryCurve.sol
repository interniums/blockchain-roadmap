// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-opcodes-memory-cost-curve  (measure, difficulty 3)
 * Exercised by: test/MemoryCurve.t.sol
 * Run:      forge test -vv --junit --match-path test/MemoryCurve.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write a test that MSTOREs at increasing offsets — 1 KiB, 16 KiB, 64 KiB, 256 KiB, 1 MiB —
 *   and records gas used for each expansion step. Plot or tabulate the results and fit them
 *   against `3·words + floor(words² / 512)`. Identify roughly the buffer size at which the
 *   quadratic term overtakes the linear one. Then demonstrate the high-water rule: expand memory
 *   to a large offset, return to working at offset 0x80, allocate again, and show that nothing
 *   was refunded. Finally compare `bytes calldata` against `bytes memory` for a 32-byte, 1 KiB
 *   and 32 KiB argument.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Memory expansion is quadratic — Growing memory to a words costs 3·a + floor(a²/512) in
 *     total, charged as the delta from the previous high-water mark.
 *   - The memory high-water mark never falls — You are charged for the highest byte offset
 *     ever touched in the frame, and there is no way to release memory.
 *   - Copies and hashes are charged per word — CALLDATACOPY, CODECOPY, RETURNDATACOPY, MCOPY
 *     and KECCAK256 each charge a small base plus a per-32-byte-word rate plus any memory
 *     expansion.
 */
contract MemoryCurve {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
