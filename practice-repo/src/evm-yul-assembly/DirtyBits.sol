// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-yul-assembly-dirty-address-bits  (fix, difficulty 3)
 * Exercised by: test/DirtyBits.t.sol
 * Run:      forge test --junit --match-path test/DirtyBits.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write an assembly block that compares two `address` values with `eq` and no masking, and
 *   construct a case where one word carries non-zero garbage in its upper twelve bytes so the
 *   comparison returns false for what is logically the same address. Then show the second half
 *   of the same problem: hash the unmasked word and show the digest differs from the digest of
 *   the clean address. Fix both by masking, deriving the mask in code from the type's width
 *   rather than pasting a hex constant. Add a third case using `lt` where `slt` was meant, and
 *   show it silently produces the wrong branch.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Dirty upper bits — Values narrower than 32 bytes may carry garbage in their unused high
 *     bits; Solidity cleans them at defined points and assembly does not.
 *   - Assembly removes the whole safety net — Inside an assembly block there are no overflow
 *     checks, no bounds checks, no type checks, no automatic revert bubbling and no ABI
 *     decoding.
 *   - Signed and unsigned are different instructions — Yul exposes div/sdiv, mod/smod, lt/slt,
 *     gt/sgt and shr/sar separately, and choosing the wrong one is a silent correctness bug.
 */
contract DirtyBits {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
