// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-account-abstraction-drain-a-paymaster  (break, difficulty 3)
 * Exercised by: test/PaymasterDrain.t.sol
 * Run:      forge test --match-path test/PaymasterDrain.t.sol -vv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Deploy a paymaster that sponsors any UserOperation from any account - the shape that appears
 *   in most "gasless onboarding" demos. From an unrelated account, drain its EntryPoint deposit
 *   by submitting valid, expensive, sponsored operations. Measure how much you extracted and how
 *   many operations it took. Then apply the scoping from the previous exercise and show the same
 *   attack fails.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - A paymaster is an economic surface — Sponsorship is a contract that spends money on
 *     rules you wrote; badly scoped rules are drained, not exploited.
 *   - Paymaster — An optional contract that agrees to pay a UserOperation's gas, letting a
 *     user transact with no ETH or pay in an ERC-20.
 *   - Bundler — A network actor that collects UserOperations, packs them into a transaction,
 *     and pays L1 gas to submit it.
 */
contract PaymasterDrain {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
