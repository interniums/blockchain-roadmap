// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-vyper-nonreentrant-slot-regression  (break, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/VyperLockRegression.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   In an isolated virtual environment, install Vyper 0.3.0 and compile a contract with two
 *   @nonreentrant functions. Inspect the emitted storage layout and identify the slot each lock
 *   was assigned. Compile the identical source with a current 0.4.x release and compare. Then
 *   write a test demonstrating that under the 0.3.0 bytecode a call can re-enter the second
 *   function while the first holds its lock, and that under the current bytecode it cannot.
 *   Record the affected version range and where a version pin for it would live in a real
 *   repository.
 */
contract VyperLockRegressionTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// The storage layout output from both compilers is captured in the repository and the
    /// differing lock slots are identified by number
    function test_criterion01_theStorageLayoutOutputFromBothCompilersIsCaptured() public {
        fail("The storage layout output from both compilers is captured in the repository and the differing lock slots are identified by number");
    }

    /// A test proves cross-function re-entry succeeds against the 0.3.0 bytecode and reverts
    /// against the current one
    function test_criterion02_aTestProvesCrossFunctionReEntrySucceedsAgainst() public {
        fail("A test proves cross-function re-entry succeeds against the 0.3.0 bytecode and reverts against the current one");
    }

    /// A written note names the affected version range and states the mechanism without quoting a
    /// loss figure
    function test_criterion03_aWrittenNoteNamesTheAffectedVersionRangeAnd() public {
        fail("A written note names the affected version range and states the mechanism without quoting a loss figure");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
