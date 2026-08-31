// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-unit-testing-nested-expect-revert  (fix, difficulty 3)
 * Exercised by: test/ExpectRevertTraps.t.sol
 * Run:      forge test --junit --match-path test/ExpectRevertTraps.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   You are given a Vault with a `withdraw(uint256)` that reverts with a custom
 *   `InsufficientBalance(uint256 requested, uint256 available)` error, and a test written as
 *   `vm.expectRevert(Vault.InsufficientBalance.selector);
 *   vault.withdraw(token.balanceOf(user));`. First prove the test is worthless: make `withdraw`
 *   correct — so that it does not revert at all — and show the test still passes. Then repair it
 *   by hoisting the inner call, and tighten the assertion from a bare selector to the fully
 *   ABI-encoded revert data including both arguments. Finally add a case that wraps a low-level
 *   `.call` in expectRevert and assert on the returned boolean correctly, not intuitively.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - expectRevert binds to the next call — vm.expectRevert applies to the next external call
 *     only, and internal reverts need an opt-in config comment.
 *   - The nested-argument trap — In target.f(other.g()) the next call is g, not f — so the
 *     expectation attaches to the wrong call and the test passes for free.
 *   - How precisely to match a revert — Match a bare revert, a bytes4 selector, full revert
 *     data, a specific reverter, or a count — count 0 asserts no revert at all.
 *   - The low-level call status trap — Around a low-level .call, the returned success boolean
 *     reports whether the expectation was met — not whether the call reverted.
 */
contract ExpectRevertTraps {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
