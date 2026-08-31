// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-session-keys-scoped-validator  (implement, difficulty 4)
 * Exercised by: test/SessionKeyValidator.t.sol
 * Run:      forge test --match-path test/SessionKeyValidator.t.sol -vv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   On Anvil, stand up a modular smart account - or an EOA delegated to modular account code
 *   under EIP-7702 - and install a validator module that accepts a session key only when the
 *   call targets one address, uses one function selector, carries a value at or below a cap, and
 *   arrives before a `validUntil` timestamp. Write the policy as data, not as hardcoded
 *   constants, so a second session with different bounds can be installed alongside the first.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - The dimensions a policy can constrain — Target addresses, function selectors, argument
 *     values, per-call and cumulative caps, rate, gas budget, chain id, and a validity window.
 *   - A policy is only real if the account enforces it — Client-side policy checks stop bugs,
 *     not attackers, because the attacker holds the key and skips your client.
 *   - Validators and executors are different module types — In a modular account a validator
 *     decides whether a call is authorised and an executor performs calls; conflating them is
 *     a privilege-escalation class.
 *   - Expiry costs nothing — A validUntil timestamp ends the authority with no transaction,
 *     which is why short-lived keys are the cheap default.
 */
contract SessionKeyValidator {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
