// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-token-standards-inflation-attack-and-fix  (break, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/VaultInflation.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Implement a naive ERC-4626 vault that computes shares from balanceOf(address(this)) with no
 *   virtual offset. Run the full first-depositor attack against it: the attacker deposits 1 wei,
 *   donates a large amount directly to the vault address with a plain transfer, the victim
 *   deposits, and the attacker redeems. Then add virtual shares and a decimal offset and re-run
 *   the identical attack, quantifying the attacker's residual profit as a function of the
 *   offset. Finally write an invariant test asserting no participant can extract more than they
 *   put in plus their share of yield, and show it fails against the naive version.
 */
contract VaultInflationTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test asserts the victim receives zero shares and the attacker withdraws more than they
    /// deposited
    function test_criterion01_aTestAssertsTheVictimReceivesZeroSharesAnd() public {
        fail("A test asserts the victim receives zero shares and the attacker withdraws more than they deposited");
    }

    /// The same attack against the virtual-offset vault leaves the attacker no better off, with the
    /// residual quantified in the assertion
    function test_criterion02_theSameAttackAgainstTheVirtualOffsetVaultLeaves() public {
        fail("The same attack against the virtual-offset vault leaves the attacker no better off, with the residual quantified in the assertion");
    }

    /// An invariant test passes on the fixed vault and produces a counterexample against the naive
    /// one
    function test_criterion03_anInvariantTestPassesOnTheFixedVaultAnd() public {
        fail("An invariant test passes on the fixed vault and produces a counterexample against the naive one");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
