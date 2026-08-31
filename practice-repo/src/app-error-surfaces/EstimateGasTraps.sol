// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-error-surfaces-exact-estimate-fails  (break, difficulty 4)
 * Exercised by: test/EstimateGasTraps.t.sol
 * Run:      forge test --match-path test/EstimateGasTraps.t.sol -vv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build a contract with several nested calls where an inner frame branches on `gasleft()`.
 *   Estimate its gas, send it with exactly the estimated limit, and show it failing. Explain the
 *   failure via the 63/64 rule, then find the headroom multiplier that makes it pass reliably.
 *   Separately, demonstrate the non-monotonicity: find a gas limit at which the call succeeds
 *   and a larger one at which it does not, and show what the estimator returns for it.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Why an exact estimate still fails — EIP-150 retains one sixty-fourth of remaining gas at
 *     each call frame, so a deep sub-call can receive less than it needs even when the total
 *     is right.
 *   - Estimation is a search — eth_estimateGas dry-runs the call and then searches for the
 *     smallest gas limit at which it succeeds, so it is several executions, not one.
 *   - The search assumes something contracts can violate — Bisection assumes success is
 *     monotone in the gas limit; contracts that branch on gasleft break that assumption.
 *   - Estimation sizes, simulation explains — Estimation returns a number or throws;
 *     simulation returns the value and the revert data - use each for what it does.
 */
contract EstimateGasTraps {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
