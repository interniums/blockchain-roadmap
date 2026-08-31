// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-openzeppelin-unauthorized-internals-audit  (read, grain block, difficulty 2)
 * Run:      forge test --junit --match-path test/UnguardedInternals.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Install openzeppelin-contracts v5.7.0 and read access/Ownable.sol, utils/Pausable.sol,
 *   proxy/Clones.sol and token/ERC20/ERC20.sol end to end. Produce a list of every internal
 *   function that performs a privileged state change with no authorization of its own, and for
 *   each, the authorization you would add. Encode the list as a test: for each entry, write a
 *   test that deploys a contract exposing that internal function without a guard and proves an
 *   arbitrary caller can reach it.
 */
contract UnguardedInternalsTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// The list names at least _pause, _unpause, _mint and the clone initializer, each with the
    /// guard you would add
    function test_criterion01_theListNamesAtLeastPauseUnpauseMintAnd() public {
        fail("The list names at least _pause, _unpause, _mint and the clone initializer, each with the guard you would add");
    }

    /// Each entry has a test proving an unprivileged address can invoke it when it is exposed
    /// without a guard
    function test_criterion02_eachEntryHasATestProvingAnUnprivilegedAddress() public {
        fail("Each entry has a test proving an unprivileged address can invoke it when it is exposed without a guard");
    }

    /// A written note explains why upgradeable variants use __X_init instead of a constructor, in
    /// terms of what a proxy does and does not run
    function test_criterion03_aWrittenNoteExplainsWhyUpgradeableVariantsUseX() public {
        fail("A written note explains why upgradeable variants use __X_init instead of a constructor, in terms of what a proxy does and does not run");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
