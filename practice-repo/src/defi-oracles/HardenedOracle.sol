// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-oracles-harden-price-getter  (fix, difficulty 2)
 * Exercised by: test/HardenedOracle.t.sol
 * Run:      forge test --match-path test/HardenedOracle.t.sol -vv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Start from a getPrice function that returns latestRoundData().answer and nothing else.
 *   Harden it so that it reverts with a distinct custom error on each of the following: an
 *   updatedAt older than a configured maximum age, a non-positive answer, an answer at or beyond
 *   the aggregator's reported minimum or maximum, a feed call that itself reverts, and a
 *   divergence beyond a configured basis point bound from an independent secondary source. Write
 *   one unit test per failure mode using a mock aggregator you control, and one fork test
 *   against a live feed that asserts the happy path still returns a sane value. Document, in a
 *   comment, the maximum age you chose and why it is larger than that feed's published
 *   heartbeat.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - The staleness check — Consuming latestRoundData without checking updatedAt against your
 *     own maximum age is the most common oracle integration bug there is.
 *   - Sanity bounds — Clamp the answer, cross-check a second independent source, and define in
 *     advance what happens on divergence.
 *   - Deviation threshold and heartbeat — A push feed updates on two triggers only — the price
 *     moved past a threshold, or the maximum interval elapsed.
 */
contract HardenedOracle {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
