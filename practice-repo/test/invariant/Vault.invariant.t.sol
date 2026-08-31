// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: security-fuzzing-vault-invariant-suite  (implement, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/invariant/Vault.invariant.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Take an ERC-4626 vault implementation and build a handler-based Foundry invariant suite for
 *   it. The handler exposes deposit, mint, withdraw, redeem and a donation of assets straight to
 *   the vault, selects the acting address from a fixed actor set, clamps every amount to what
 *   that actor can actually supply, and maintains ghost accumulators for total deposited and
 *   total withdrawn. Write three invariants - a solvency invariant that total assets always
 *   cover total claimable, a conservation invariant over the ghost accumulators, and a
 *   path-independence property asserting that n small deposits never yield more shares than one
 *   deposit of the same total. Then invert one rounding direction in the share calculation and
 *   confirm that the path-independence property, and only that property, fails.
 */
contract VaultInvariantTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// All three invariants pass on the correct implementation
    function test_criterion01_allThreeInvariantsPassOnTheCorrectImplementation() public {
        fail("All three invariants pass on the correct implementation");
    }

    /// Line coverage of the vault from the invariant runner alone exceeds seventy percent
    function test_criterion02_lineCoverageOfTheVaultFromTheInvariantRunner() public {
        fail("Line coverage of the vault from the invariant runner alone exceeds seventy percent");
    }

    /// Inverting one rounding direction makes the path-independence property fail and leaves the
    /// other two passing
    function test_criterion03_invertingOneRoundingDirectionMakesThePathIndependenceProperty() public {
        fail("Inverting one rounding direction makes the path-independence property fail and leaves the other two passing");
    }

    /// The handler clamps rather than rejects, and the reported revert rate is below twenty percent
    function test_criterion04_theHandlerClampsRatherThanRejectsAndTheReported() public {
        fail("The handler clamps rather than rejects, and the reported revert rate is below twenty percent");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
