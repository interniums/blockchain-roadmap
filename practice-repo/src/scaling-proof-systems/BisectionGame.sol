// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: scaling-proof-systems-toy-bisection-game  (implement, difficulty 5)
 * Exercised by: test/BisectionGame.t.sol
 * Run:      forge test --match-path test/BisectionGame.t.sol -vvv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   In Foundry, implement a minimal dispute game over an execution trace. Both parties commit to
 *   a Merkle root over the trace of a simple deterministic step function. The challenger
 *   disputes the final state; each round, the contract asks both sides for their claimed state
 *   at the midpoint of the disputed range and narrows to the half where they first disagree.
 *   When the range is a single step, the contract executes that one step on-chain and awards the
 *   loser's bond to the winner. Write tests proving an honest party beats a dishonest one, that
 *   the number of on-chain rounds grows logarithmically with trace length, and that a party who
 *   stops responding loses on timeout. Then add a delay attacker who always responds at the last
 *   permitted moment, and measure how long the honest party is forced to stay engaged.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Interactive bisection — The dispute is halved repeatedly — block range, then instruction
 *     range — until the parties disagree about exactly one instruction.
 *   - One-step proof — The final on-chain step — replay the single disputed instruction inside
 *     an on-chain VM and see who was right.
 *   - Delay attack — An adversary spams disputes to stall confirmations and drain honest
 *     challengers' capital and attention.
 *   - Bonded challenging — Challengers and asserters post bonds; the loser's bond pays the
 *     winner, which funds honest watching and prices spam.
 */
contract BisectionGame {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
