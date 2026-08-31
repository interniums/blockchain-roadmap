// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: security-threat-modeling-tx-origin-7702  (break, difficulty 3)
 * Exercised by: test/TxOriginGuard.t.sol
 * Run:      forge test --junit --match-path test/TxOriginGuard.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write a contract whose sensitive function is guarded by require(msg.sender == tx.origin),
 *   stated in its comments as meaning "callers must not be contracts". On a Pectra-or-later
 *   fork, use an EIP-7702 delegation to make an EOA execute attacker-supplied contract logic
 *   while still satisfying the guard, and drain or otherwise misuse the guarded function. Then
 *   write the one-paragraph threat-model consequence: which assumption in a pre-Pectra
 *   trust-assumption inventory this invalidates, and what the guard should have been checking
 *   instead.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Capability, not role — Model what an actor can cause to happen, not the job title the
 *     documentation gives it.
 *   - Trust assumption inventory — The written list of everything assumed honest, live or
 *     correct — each one a thing you lose to if it misbehaves.
 *   - Threat scenario — A named attack story tied to one boundary crossing plus one violated
 *     assumption, with an impact and a mitigation.
 */
contract TxOriginGuard {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
