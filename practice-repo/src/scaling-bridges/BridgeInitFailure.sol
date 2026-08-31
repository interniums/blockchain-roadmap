// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: scaling-bridges-nomad-zero-root  (break, difficulty 3)
 * Exercised by: test/BridgeInitFailure.t.sol
 * Run:      forge test --match-path test/BridgeInitFailure.t.sol -vvv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build a minimal message bridge in Solidity: a `Home` contract that commits messages into a
 *   Merkle tree, and a `Replica` that accepts a message if a supplied proof verifies against a
 *   trusted root stored at initialisation. Deploy the `Replica` behind a proxy and perform an
 *   upgrade that reinitialises it, leaving the trusted root at zero. Then prove an arbitrary
 *   message — including one that mints an unbacked token to an address you choose — and show it
 *   is accepted without any valid proof. Fix it in one line, and write the regression test that
 *   would have caught it. Finally, add a post-upgrade invariant check to the deployment script
 *   that asserts the trusted root is non-zero and matches the expected value.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Initialisation failure — The Nomad class — an upgrade left the trusted root at zero, so
 *     every message verified as pre-approved.
 *   - A bridge is a honeypot by construction — A bridge concentrates the value of everything
 *     that crossed it into one contract or key set, which is why bridges dominate the
 *     largest-exploit list.
 *   - Lock and mint — Lock the asset on the source chain, mint a representation on the
 *     destination; the minted token is only as good as the lock.
 */
contract BridgeInitFailure {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
