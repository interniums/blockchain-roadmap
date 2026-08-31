// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {UpgradeRehearsal} from "../src/infra-simulation/UpgradeRehearsal.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-simulation-rehearse-a-real-upgrade  (implement, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/UpgradeRehearsal.t.sol --fork-url $RPC_URL
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write a Foundry fork test that rehearses a proxy upgrade at a pinned recent block: fork,
 *   impersonate the proxy admin, execute the real upgrade calldata, then run an existing
 *   integration test against the upgraded proxy and diff the storage layout of the old and new
 *   implementations. Extend it into a full governance rehearsal - grant voting power by writing
 *   storage, propose, vote, queue, advance past the timelock, execute - and assert the target
 *   parameter holds its new value at the end. Then deliberately introduce a storage-layout shift
 *   in the new implementation and show the rehearsal catching it. Wire the whole thing into CI,
 *   pinned and cached.
 */
contract UpgradeRehearsalTest is Test {
    /// The subject, from src/infra-simulation/UpgradeRehearsal.sol. Add functions there and call them here.
    UpgradeRehearsal internal subject;

    function setUp() public {
        subject = new UpgradeRehearsal();
    }

    /// The integration suite passes against the upgraded proxy on a pinned fork, and the pin is a
    /// literal block number in the test
    function test_criterion01_theIntegrationSuitePassesAgainstTheUpgradedProxyOn() public {
        fail(
            "The integration suite passes against the upgraded proxy on a pinned fork, and the pin is a literal block number in the test"
        );
    }

    /// The governance path reaches execute and asserts the target parameter's new value, with the
    /// timelock delay skipped rather than removed
    function test_criterion02_theGovernancePathReachesExecuteAndAssertsTheTarget() public {
        fail(
            "The governance path reaches execute and asserts the target parameter's new value, with the timelock delay skipped rather than removed"
        );
    }

    /// Introducing a storage-layout shift makes the rehearsal fail, and the failure names the
    /// shifted slot rather than a generic revert
    function test_criterion03_introducingAStorageLayoutShiftMakesTheRehearsalFail() public {
        fail(
            "Introducing a storage-layout shift makes the rehearsal fail, and the failure names the shifted slot rather than a generic revert"
        );
    }

    /// The CI job runs the same test with a warm fork cache and the second run is measurably faster
    /// than the first
    function test_criterion04_theCiJobRunsTheSameTestWithA() public {
        fail(
            "The CI job runs the same test with a warm fork cache and the second run is measurably faster than the first"
        );
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
