// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-proxies-upgrades-upgrade-both-patterns  (implement, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/ProxyUpgrade.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write a minimal transparent proxy and a minimal UUPS proxy over the same logic contract.
 *   Upgrade each once to a V2 that adds a state variable, and prove that state written before
 *   the upgrade survives it. Then, on the UUPS one, deliberately upgrade to a V3 that omits the
 *   upgrade function and prove that no further upgrade is possible from any caller. Finally, add
 *   a variant where V2 moves its state into an ERC-7201 namespace while V1 used sequential
 *   slots, and show what the old bytes look like when read under the new layout.
 */
contract ProxyUpgradeTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Tests prove pre-upgrade state is readable after upgrade on both the transparent and the UUPS
    /// proxy
    function test_criterion01_testsProvePreUpgradeStateIsReadableAfterUpgrade() public {
        fail("Tests prove pre-upgrade state is readable after upgrade on both the transparent and the UUPS proxy");
    }

    /// A test proves that after upgrading the UUPS proxy to an implementation with no upgrade
    /// function, every upgrade attempt reverts, including from the admin
    function test_criterion02_aTestProvesThatAfterUpgradingTheUupsProxy() public {
        fail("A test proves that after upgrading the UUPS proxy to an implementation with no upgrade function, every upgrade attempt reverts, including from the admin");
    }

    /// A test reads a variable after the sequential-to-namespaced migration and asserts it does not
    /// equal what it held before, with a comment identifying which slot collided
    function test_criterion03_aTestReadsAVariableAfterTheSequentialTo() public {
        fail("A test reads a variable after the sequential-to-namespaced migration and asserts it does not equal what it held before, with a comment identifying which slot collided");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
