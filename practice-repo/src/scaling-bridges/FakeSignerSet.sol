// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: scaling-bridges-fake-signer-set  (break, difficulty 4)
 * Exercised by: test/FakeSignerSet.t.sol
 * Run:      forge test --match-path test/FakeSignerSet.t.sol -vvv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write a message verifier that checks a threshold of signatures from a guardian set, but
 *   reads the guardian set from an address or struct supplied by the caller rather than from
 *   immutable storage — the shape of the Wormhole failure. Demonstrate the exploit: construct
 *   your own guardian set, sign an arbitrary mint message with your own keys, pass both to the
 *   verifier, and have it accept. Then fix it by binding the guardian set to storage the caller
 *   cannot influence, and prove the same call now reverts. Add a second test showing that even
 *   the fixed verifier is defeated if enough real guardian keys are compromised, and state the
 *   threshold at which that happens.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Verification that does not verify — The Wormhole class — the contract accepted a message
 *     without actually checking that the authorised signer set had signed it.
 *   - A bridge is a honeypot by construction — A bridge concentrates the value of everything
 *     that crossed it into one contract or key set, which is why bridges dominate the
 *     largest-exploit list.
 *   - Key compromise — The Ronin and Harmony class — the cryptography was fine and the
 *     operators' private keys were stolen, usually socially.
 */
contract FakeSignerSet {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
