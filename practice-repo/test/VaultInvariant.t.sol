// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-invariant-testing-vault-solvency  (implement, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/VaultInvariant.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build a small deposit-and-withdraw vault, a handler that bounds amounts and picks among
 *   three actors, and ghost variables tracking total ever deposited and total ever withdrawn.
 *   State the solvency invariant against the ghosts rather than against the vault's own
 *   accounting. Then seed a bug that only manifests after a specific three-call sequence — for
 *   example a rounding error in share conversion that only bites when a withdrawal follows a
 *   deposit that followed another actor's withdrawal. Write unit tests covering each function
 *   individually and show them all passing, then show the invariant campaign finding the
 *   sequence and reporting it.
 */
contract VaultInvariantTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Every per-function unit test passes against the buggy implementation
    function test_criterion01_everyPerFunctionUnitTestPassesAgainstTheBuggy() public {
        fail("Every per-function unit test passes against the buggy implementation");
    }

    /// The invariant fails against the buggy implementation and the reported call sequence is at
    /// least three calls long
    function test_criterion02_theInvariantFailsAgainstTheBuggyImplementationAndThe() public {
        fail("The invariant fails against the buggy implementation and the reported call sequence is at least three calls long");
    }

    /// The same invariant passes against the fixed implementation at the configured runs and depth
    function test_criterion03_theSameInvariantPassesAgainstTheFixedImplementationAt() public {
        fail("The same invariant passes against the fixed implementation at the configured runs and depth");
    }

    /// The invariant compares vault state against ghost variables, not against a value the vault
    /// itself computed
    function test_criterion04_theInvariantComparesVaultStateAgainstGhostVariablesNot() public {
        fail("The invariant compares vault state against ghost variables, not against a value the vault itself computed");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
