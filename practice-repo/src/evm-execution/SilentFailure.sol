// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-execution-silent-call-failure  (break, difficulty 3)
 * Exercised by: test/SilentFailure.t.sol
 * Run:      forge test --junit --match-path test/SilentFailure.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write contract `A` that updates its own state and then low-level-calls contract `B`,
 *   discarding the returned boolean. Make `B` always revert. Write a Foundry test asserting that
 *   A's transaction succeeds and that A's state changed anyway. Then extend the exercise: leave
 *   B non-reverting but gas-hungry, and have the test call A while forwarding a gas amount
 *   chosen so that B runs out while A completes — the same silent failure produced by a
 *   different mechanism. Finally fix A so both cases revert, and show that the revert payload
 *   from B is bubbled up unchanged.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - A low-level call returns a boolean — A failed inner call pushes 0 and does not abort the
 *     caller, so ignoring that value silently swallows the failure.
 *   - Three ways a frame can end badly — REVERT undoes state, returns data and refunds gas; an
 *     exceptional halt undoes state, returns nothing and burns the frame's gas; out-of-gas is
 *     the second kind.
 *   - Gas griefing — A caller can forward deliberately insufficient gas so an inner call fails
 *     while the outer transaction still succeeds.
 *   - The return-data buffer — One buffer, overwritten by every sub-call including failed
 *     ones, and RETURNDATACOPY reverts on out-of-bounds reads instead of zero-padding.
 */
contract SilentFailure {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
