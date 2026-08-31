// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-invariant-testing-fix-revert-rate  (fix, difficulty 4)
 * Exercised by: test/HandlerHealth.t.sol
 * Run:      forge test --junit --match-path test/HandlerHealth.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   You are given a passing invariant campaign whose handler reverts on the overwhelming
 *   majority of generated calls — unbounded amounts, withdrawals from actors with no balance,
 *   transfers to address(0). Turn on the campaign metrics and record the per-function revert and
 *   discard rates before changing anything. Repair the handler so that calls are constructed to
 *   be able to succeed: bound amounts against the actor's actual balance, select actors from a
 *   fixed set, and skip operations whose preconditions are unmet rather than letting them
 *   revert. Record the rates again, and demonstrate that the repaired campaign now reaches a
 *   state the original never did by asserting on a state variable that only a deep sequence can
 *   produce.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Revert metrics — show_metrics reports which handler functions revert or get discarded; a
 *     high revert rate means the campaign tested almost nothing.
 *   - The handler — A thin wrapper that bounds inputs and only makes calls that can plausibly
 *     succeed, so the campaign explores reachable states.
 *   - runs and depth — runs is how many sequences are generated, depth is how many calls per
 *     sequence — on forge 1.7.1 the defaults are 256 and 500.
 */
contract HandlerHealth {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
