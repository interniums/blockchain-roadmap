// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-opcodes-memory-guard-benchmark  (measure, difficulty 3)
 * Exercised by: test/GuardBench.t.sol
 * Run:      forge test -vv --junit --match-path test/GuardBench.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Implement the same trivial function three ways: unguarded, guarded with a storage lock, and
 *   guarded with a transient lock. Measure the gas of a single call in each case, and compute
 *   the guard overhead as the difference from the unguarded baseline. Do it twice: once where
 *   the storage lock slot is cold (first guarded call in the transaction) and once where it is
 *   warm. Report four overhead figures. Then write one paragraph explaining why publishing a
 *   single number for the storage guard is misleading, using your own cold and warm figures as
 *   evidence.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - The transient reentrancy guard — The flagship use case — a lock in transient storage
 *     whose overhead is flat and small, against a storage lock whose cost depends on whether
 *     the slot is cold.
 *   - TSTORE and TLOAD — Opcodes 0x5d and 0x5c, taking the same stack arguments as SSTORE and
 *     SLOAD, measured at 100 gas each.
 *   - Cold and warm access — The first touch of an address or a storage slot in a transaction
 *     is priced far above every later touch, so identical code costs different gas depending
 *     on what ran before it.
 *   - Cheap guards change the economics both ways — Making a guard cost hundreds instead of
 *     thousands of gas also makes probing for an unguarded path cheaper to attempt.
 */
contract GuardBench {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
