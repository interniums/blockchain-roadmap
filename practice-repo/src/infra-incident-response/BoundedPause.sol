// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-incident-response-bounded-pause-vault  (implement, difficulty 3)
 * Exercised by: test/BoundedPause.t.sol
 * Run:      forge test --junit --match-path test/BoundedPause.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Implement a vault with the mature pause pattern: a low-threshold guardian multisig can pause
 *   immediately; only governance can unpause early; the pause expires automatically after a
 *   fixed window and the protocol resumes without anyone acting; and a cooldown after expiry
 *   prevents an immediate re-pause. Add one rung below full pause - a per-block withdrawal cap
 *   that the guardian can lower without stopping the protocol - so the drill in this module has
 *   more than one option. Prove all of it in Foundry, including the adversarial property: a
 *   guardian acting in bad faith cannot keep user funds frozen indefinitely.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Bounding the pause structurally — A low-threshold guardian to pause, a governance-only
 *     path to unpause, an automatic expiry of the pause, and a cooldown before re-pausing -
 *     four mechanisms that keep pause useful without making it a permanent power.
 *   - The same key that saves you can freeze you — A guardian that can stop an exploit can
 *     also freeze honest users' funds indefinitely, so pause is simultaneously a security
 *     control and a centralisation vector.
 *   - The rungs above and below pause — Full pause, disabling specific entry points, capping
 *     or rate-limiting flows, changing parameters to make the attack unprofitable,
 *     blacklisting, and doing nothing are all containment options with different costs.
 *   - Pause is racing an automated adversary — Trail of Bits' position is that pause
 *     effectiveness declines as attackers automate, so treating pause as the answer rather
 *     than as one bounded tool is a strategic error.
 */
contract BoundedPause {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
