// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: security-threat-modeling-invariant-gas-placement  (measure, difficulty 3)
 * Exercised by: test/InvariantPlacement.t.sol
 * Run:      forge test --junit --match-path test/InvariantPlacement.t.sol -vv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Take one system-level invariant from a protocol you have modelled - a solvency or
 *   conservation statement - "and implement it three ways: as an on-chain runtime check inside
 *   the state-changing function, as an" invariant_ property in a Foundry invariant suite, and as
 *   the pseudocode of a monitoring alert with its data source and threshold. Measure the gas the
 *   on-chain form adds to a realistic call, using a gasleft() delta harness that assigns each
 *   read into a storage sink so the read is not eliminated as dead code. Then argue in writing
 *   which of the three placements this invariant should have, and why.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - System-level invariant — A property spanning contracts and state transitions — solvency,
 *     conservation, or supply accounting.
 *   - Invariant-driven development — Write the invariants first, then let fuzzers, provers and
 *     runtime monitors all consume the same statements.
 *   - Trust assumption inventory — The written list of everything assumed honest, live or
 *     correct — each one a thing you lose to if it misbehaves.
 */
contract InvariantPlacement {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
