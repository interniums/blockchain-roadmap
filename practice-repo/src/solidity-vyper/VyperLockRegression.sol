// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-vyper-nonreentrant-slot-regression  (break, difficulty 4)
 * Exercised by: test/VyperLockRegression.t.sol
 * Run:      forge test --junit --match-path test/VyperLockRegression.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   In an isolated virtual environment, install Vyper 0.3.0 and compile a contract with two
 *   @nonreentrant functions. Inspect the emitted storage layout and identify the slot each lock
 *   was assigned. Compile the identical source with a current 0.4.x release and compare. Then
 *   write a test demonstrating that under the 0.3.0 bytecode a call can re-enter the second
 *   function while the first holds its lock, and that under the current bytecode it cannot.
 *   Record the affected version range and where a version pin for it would live in a real
 *   repository.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - The 2023 nonreentrant lock regression — Vyper 0.2.15, 0.2.16 and 0.3.0 gave different
 *     functions different lock slots, so correct source compiled to a bypassable guard.
 *   - The compiler is in your trusted computing base — The compiler version is a
 *     security-relevant deployment parameter: pin it, record it, check advisories against it.
 *   - Only major releases carry the audit promise — Vyper's stated policy audits x.0.0
 *     releases; point releases carry no such guarantee.
 */
contract VyperLockRegression {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
