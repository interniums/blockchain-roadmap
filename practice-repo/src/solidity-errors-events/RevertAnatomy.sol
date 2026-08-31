// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-errors-events-revert-data-anatomy  (measure, difficulty 2)
 * Exercised by: test/RevertAnatomy.t.sol
 * Run:      forge test --junit --match-path test/RevertAnatomy.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build four contracts identical except for the failure path: require(cond) with no message,
 *   require(cond, "Insufficient balance for this transfer"), revert InsufficientBalance(a, b),
 *   and require(cond, InsufficientBalance(a, b)). For each, capture the exact revert data
 *   returned by a low-level call and record its byte length, plus deployed bytecode size from
 *   forge build --sizes and happy-path and revert-path gas, with and without --via-ir. Assert
 *   the selector of your custom error by hand and confirm it equals the first four bytes of the
 *   captured data.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Custom error — An error declared like an event and thrown with revert; its data is an
 *     ABI-encoded call to a same-named function.
 *   - Error selector — An error's selector is derived exactly like a function selector, from
 *     its canonical signature.
 *   - Revert strings cost bytes twice — A revert string is a selector plus a full ABI-encoded
 *     string, and the literal also sits in deployed bytecode.
 *   - require with no message returns no data — require(bool) reverts with zero bytes — not
 *     even a selector — so there is nothing to decode.
 *   - require with a custom error — require(cond, CustomError(args)) has been supported since
 *     0.8.26 via-IR and 0.8.27 legacy.
 */
contract RevertAnatomy {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
