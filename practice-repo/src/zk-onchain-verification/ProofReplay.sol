// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: zk-onchain-verification-proof-replay-payout  (break, difficulty 3)
 * Exercised by: test/ProofReplay.t.sol
 * Run:      forge test --match-path test/ProofReplay.t.sol -vvv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build a Foundry project with a deployed verifier and a claim contract that pays out when the
 *   verifier returns true. Introduce two independent defects. First, the claim contract records
 *   nothing about which proofs it has already honoured, so the same valid proof can be submitted
 *   repeatedly. Second, the claim contract accepts the Merkle root as a function argument and
 *   passes it straight through as a public input, instead of using the root it has stored. Write
 *   an exploit test for each: one drains the contract by resubmitting one proof, the other
 *   claims against a root the attacker chose and proved against. Then fix both — a nullifier
 *   mapping keyed on the proof's binding public input, and reading the root from the contract's
 *   own storage — and show each exploit now reverts, while an honest claim still succeeds.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Proof replay — A proof is just bytes; the same valid proof can be submitted twice unless
 *     the caller enforces a nullifier or state progression.
 *   - Binding the public inputs — The verifier attests only to the statement in the public
 *     inputs; the caller must bind those inputs to the thing it actually cares about.
 *   - Verifier contract — A stateless pure function on-chain that takes a proof plus public
 *     inputs and returns true or false — nothing more.
 */
contract ProofReplay {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
