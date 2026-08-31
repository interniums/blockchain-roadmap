// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-contract-patterns-push-to-pull-conversion  (fix, difficulty 2)
 * Exercised by: test/PullPayments.t.sol
 * Run:      forge test --junit --match-path test/PullPayments.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Start from a distribute(address[] recipients) that pushes ETH inside a loop using .transfer.
 *   Prove three separate failures against it: a recipient whose receive() reverts blocks
 *   everyone, a recipient whose receive() burns gas blocks everyone, and a smart-contract wallet
 *   whose receive() legitimately costs more than 2300 gas fails even though nothing is wrong
 *   with it. Convert to pull payments with a credits mapping and a withdraw() using
 *   call{value:}("") with a checked return, and prove all three now succeed for everyone else.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Pull payments — Record a credit and let the recipient call withdraw(), instead of
 *     pushing value out mid-logic.
 *   - Push payments are a liveness bug — One recipient that reverts or burns gas can brick a
 *     whole distribution loop for everyone.
 *   - transfer and send are obsolete — The fixed 2300-gas stipend is a compatibility bug, and
 *     solc 0.8.31 deprecated both functions.
 */
contract PullPayments {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
