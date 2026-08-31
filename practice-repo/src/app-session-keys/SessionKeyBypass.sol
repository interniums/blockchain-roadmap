// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-session-keys-bypass-your-own-policy  (break, difficulty 4)
 * Exercised by: test/SessionKeyBypass.t.sol
 * Run:      forge test --match-path test/SessionKeyBypass.t.sol -vv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Attack your own validator from the previous exercise with at least three approaches: replay
 *   the same session authorisation on a second chain id; exhaust the value cap and then replay
 *   an earlier accepted call to spend past it; and invoke a different function whose selector
 *   you can influence. Find at least one working bypass. Then patch it, name the policy
 *   dimension that was missing, and add the regression test.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - A policy is only real if the account enforces it — Client-side policy checks stop bugs,
 *     not attackers, because the attacker holds the key and skips your client.
 *   - The dimensions a policy can constrain — Target addresses, function selectors, argument
 *     values, per-call and cumulative caps, rate, gas budget, chain id, and a validity window.
 *   - Blast radius, not safety — The security claim is never "this key is safe" - it is "if
 *     this key leaks, the loss is bounded by the policy".
 */
contract SessionKeyBypass {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
