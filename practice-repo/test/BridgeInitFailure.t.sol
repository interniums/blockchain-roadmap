// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {BridgeInitFailure} from "../src/scaling-bridges/BridgeInitFailure.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: scaling-bridges-nomad-zero-root  (break, grain block, difficulty 3)
 * Run:      forge test --match-path test/BridgeInitFailure.t.sol -vvv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
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
 */
contract BridgeInitFailureTest is Test {
    /// The subject, from src/scaling-bridges/BridgeInitFailure.sol. Add functions there and call them here.
    BridgeInitFailure internal subject;

    function setUp() public {
        subject = new BridgeInitFailure();
    }

    /// A test proves an unauthorised message is accepted while the trusted root is zero, minting to
    /// an attacker-chosen address
    function test_criterion01_aTestProvesAnUnauthorisedMessageIsAcceptedWhile() public {
        fail(
            "A test proves an unauthorised message is accepted while the trusted root is zero, minting to an attacker-chosen address"
        );
    }

    /// A second test proves the same message is rejected after the one-line fix
    function test_criterion02_aSecondTestProvesTheSameMessageIsRejected() public {
        fail("A second test proves the same message is rejected after the one-line fix");
    }

    /// A third test runs the same exploit against a second, unrelated message and passes,
    /// demonstrating the bug was copy-pasteable rather than message-specific
    function test_criterion03_aThirdTestRunsTheSameExploitAgainstA() public {
        fail(
            "A third test runs the same exploit against a second, unrelated message and passes, demonstrating the bug was copy-pasteable rather than message-specific"
        );
    }

    /// The deployment script asserts a non-zero trusted root after upgrade and the test proves that
    /// assertion fails on the broken deployment
    function test_criterion04_theDeploymentScriptAssertsANonZeroTrustedRoot() public {
        fail(
            "The deployment script asserts a non-zero trusted root after upgrade and the test proves that assertion fails on the broken deployment"
        );
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
