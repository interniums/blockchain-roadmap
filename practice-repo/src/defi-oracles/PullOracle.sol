// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-oracles-the-consumer-is-liable  (implement, difficulty 3)
 * Exercised by: test/PullOracle.t.sol
 * Run:      forge test --junit --match-path test/PullOracle.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   In a pull model nobody pushes a price on chain for you. You fetch it, you pay for it, and
 *   you are responsible for checking it — which means the failure modes are yours. FETCH AND
 *   VERIFY. Retrieve a signed price off chain and verify it on chain yourself: signature,
 *   publisher identity, and the age of the observation. Report the gas. Then break each check in
 *   turn — wrong signer, stale timestamp, tampered price — and show each rejected with a
 *   distinct error. Three checks, three failures, three errors. THE STALENESS DECISION. There is
 *   no correct maximum age, only a choice. State yours for two different uses — a liquidation
 *   and a display — and defend both. Then show what happens at the boundary: submit a price
 *   exactly at your threshold and one just past it. THE INTERVAL. The feed reports uncertainty
 *   as well as a price, and most integrations ignore it. Read it, and then build a contract that
 *   actually uses it: refuse to act when the interval is too wide relative to the position at
 *   risk. Demonstrate a refusal, and report a real moment when the interval widened enough to
 *   trigger it — or, if you cannot find one, state what conditions would produce it. Close with
 *   the liability sentence: name every failure in this exercise that a push model would have
 *   made somebody else's problem, and say whether you would still choose pull.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Pull oracles — The network signs prices continuously off chain and the consumer submits
 *     a signed update in the same transaction that uses it, paying the gas.
 *   - Verifying a pull update — The update is trusted because the transaction verifies a
 *     signature over feed id, price and publish time against a known validator set — not
 *     because a privileged address wrote it.
 *   - The confidence interval — Pull networks publish a band alongside the price, and ignoring
 *     it discards the oracle's own statement about how much it disagrees with itself.
 */
contract PullOracle {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
