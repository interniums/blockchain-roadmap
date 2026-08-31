// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: zk-onchain-verification-capstone-a-proof-is-not-permission  (break, difficulty 4)
 * Exercised by: test/capstone/ProofConsumption.t.sol
 * Run:      forge test --junit --match-path test/capstone/ProofConsumption.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   A verifier is a pure function. Every bug worth having in this area is in the contract that
 *   calls it, and this exercise is to write both bugs and then price the thing properly. THE
 *   UNBOUND INPUT. Build a payout contract that verifies a proof and pays out. Leave a public
 *   input unbound — the recipient, or the amount — and take the money with a proof that verifies
 *   perfectly. Then fix the binding and show the same attack failing. A comment states which
 *   input was unbound and what the verifier was and was not asserting. THE REPLAY. Now make the
 *   proof itself valid, bound, and replayable: claim twice with the same proof. Fix it, and
 *   state what your fix costs per claim in gas and in storage. WHERE THE GAS GOES. Profile the
 *   verifier. Report what fraction is pairings, and show the verification floor — the gas you
 *   pay before any input-specific work. Compare a Groth16 and a PLONK verifier for the same
 *   statement and report both totals and both floors. MANY PROOFS, ONE COST. Implement a batched
 *   pairing check over N proofs and plot gas per proof against N. State the N at which the
 *   batching saves more than it costs in added complexity. Then describe, without necessarily
 *   implementing it, what recursive aggregation would change about that curve. VERIFY VERSUS
 *   RE-EXECUTE. For one concrete statement, compute both: the gas to verify a proof, and the gas
 *   to just re-execute the computation on chain. Say which wins and at what size the answer
 *   flips — this is the break-even nobody puts on the slide. THE OTHER COSTS. Separate three
 *   numbers that get conflated: verification gas, the calldata cost of the public inputs and the
 *   proof, and the off-chain proving cost in dollars. Report all three for one claim. THE ADMIN.
 *   Finally: find the upgrade path on your own verifier and state what the proofs are worth if
 *   the verifier can be replaced. Then say what you would do about it.
 *
 * The 13 concepts this has to end up demonstrating:
 *   - Verifier contract — A stateless pure function on-chain that takes a proof plus public
 *     inputs and returns true or false — nothing more.
 *   - Binding the public inputs — The verifier attests only to the statement in the public
 *     inputs; the caller must bind those inputs to the thing it actually cares about.
 *   - Proof replay — A proof is just bytes; the same valid proof can be submitted twice unless
 *     the caller enforces a nullifier or state progression.
 *   - What a Groth16 verifier costs — Roughly a couple of hundred thousand gas on BN254,
 *     dominated by the pairing check, plus a per-public-input term.
 *   - What a PLONK-family verifier costs — Short constant verification like Groth16 and the
 *     same dominating pairing check, bought with a larger proof and a universal setup instead
 *     of a per-circuit ceremony.
 *   - Pairings dominate verifier gas — Almost all verifier gas is pairing operations; every
 *     other step is noise, which is why optimisation targets pairing count.
 *   - Batched pairing checks — Many independent pairing equations fold into one randomised
 *     check, so per-proof pairing count grows far more slowly than verifying each proof
 *     separately.
 *   - Recursive aggregation — Fold N proofs into one off-chain so L1 verifies exactly once, at
 *     the cost of waiting for the batch.
 *   - Verify versus re-execute — Re-executing costs gas proportional to the work; verifying a
 *     proof costs a near-constant amount. Proofs win only above the crossover.
 *   - The verification floor — Verification has a fixed gas floor, so proving is uneconomic
 *     below a threshold of work — the rule is not "always use ZK".
 *   - Data, not proofs, dominates rollup cost — For a rollup, publishing data is usually the
 *     larger L1 line item; blobs changed rollup economics far more than proof-cost
 *     improvements did.
 *   - Three costs, only one of which is gas — Prover hardware and time, data availability, and
 *     L1 verification are three separate lines; optimising only the gas misreads the P&L.
 *   - An upgradeable verifier is not a cryptographic guarantee — If a key can replace the
 *     verifier, the proof guarantees nothing the key holder does not allow — which is why a
 *     live validity proof does not by itself lift a rollup off the lowest trust stage.
 */
contract ProofConsumption {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
