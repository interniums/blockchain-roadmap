// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-contract-patterns-reentrancy-then-cei  (break, difficulty 3)
 * Exercised by: test/Reentrancy.t.sol
 * Run:      forge test --junit --match-path test/Reentrancy.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write a VulnerableBank whose withdraw sends ETH before zeroing the balance, and an attacker
 *   whose receive() re-enters it. Prove the drain. Reorder to Checks-Effects-Interactions and
 *   prove the same attack fails. Then extend to read-only reentrancy: add a second contract that
 *   prices something from bank.totalAssets(), have the attacker query it from inside the
 *   callback, and show that the CEI-fixed and nonReentrant-guarded bank still hands the observer
 *   a wrong number. Finish by benchmarking no guard, ReentrancyGuard and
 *   ReentrancyGuardTransient on the same function.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Checks-Effects-Interactions — Validate, then write all state, then call outside
 *     contracts last, so re-entry sees final state.
 *   - What CEI does not cover — CEI protects one function; cross-function, cross-contract and
 *     read-only reentrancy survive it.
 *   - Reentrancy guard — A mutex flag that blocks re-entry into any guarded function of the
 *     same contract.
 *   - Transient reentrancy guard — Holding the mutex in EIP-1153 transient storage makes the
 *     guard roughly an order of magnitude cheaper.
 */
contract Reentrancy {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
