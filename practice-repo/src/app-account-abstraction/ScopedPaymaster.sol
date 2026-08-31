// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-account-abstraction-scoped-paymaster  (implement, difficulty 4)
 * Exercised by: test/ScopedPaymaster.t.sol
 * Run:      forge test --match-path test/ScopedPaymaster.t.sol -vv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write and deploy a paymaster that sponsors UserOperations only when the call targets one
 *   specific contract and one specific function selector, with a per-account cap on how much gas
 *   it will cover in a period. Fund its deposit at the EntryPoint. Then submit three
 *   UserOperations through a bundler against a local node: the intended call, the same call to a
 *   different contract, and a different function on the intended contract. Only the first may be
 *   sponsored.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Paymaster — An optional contract that agrees to pay a UserOperation's gas, letting a
 *     user transact with no ETH or pay in an ERC-20.
 *   - UserOperation — ERC-4337's alternative to a transaction - signed by the user, collected
 *     by bundlers, validated and executed by the EntryPoint.
 *   - EntryPoint — The singleton contract that validates and executes UserOperations through
 *     the user's smart account.
 */
contract ScopedPaymaster {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
