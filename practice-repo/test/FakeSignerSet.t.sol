// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: scaling-bridges-fake-signer-set  (break, grain module, difficulty 4)
 * Run:      forge test --match-path test/FakeSignerSet.t.sol -vvv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
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
 */
contract FakeSignerSetTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test forges a message accepted by the broken verifier using an attacker-controlled
    /// guardian set
    function test_criterion01_aTestForgesAMessageAcceptedByTheBroken() public {
        fail("A test forges a message accepted by the broken verifier using an attacker-controlled guardian set");
    }

    /// The fixed verifier reverts on the identical call, with the guardian set bound to immutable
    /// or contract-controlled storage
    function test_criterion02_theFixedVerifierRevertsOnTheIdenticalCallWith() public {
        fail("The fixed verifier reverts on the identical call, with the guardian set bound to immutable or contract-controlled storage");
    }

    /// A test parameterised on threshold shows the number of compromised keys required to defeat
    /// the fixed verifier
    function test_criterion03_aTestParameterisedOnThresholdShowsTheNumberOf() public {
        fail("A test parameterised on threshold shows the number of compromised keys required to defeat the fixed verifier");
    }

    /// The write-up distinguishes the two failure classes in one sentence each: verification that
    /// does not verify, versus key compromise
    function test_criterion04_theWriteUpDistinguishesTheTwoFailureClassesIn() public {
        fail("The write-up distinguishes the two failure classes in one sentence each: verification that does not verify, versus key compromise");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
