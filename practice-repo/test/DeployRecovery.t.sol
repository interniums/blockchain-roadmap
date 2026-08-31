// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-deploy-verify-resume-a-broken-deploy  (fix, grain block, difficulty 4)
 * Run:      forge test --junit --match-path test/DeployRecovery.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write a script that deploys five contracts in sequence against a local anvil, arranged so
 *   the fourth fails — for example by giving that transaction a gas limit that cannot cover it.
 *   Run it first without `--broadcast` and note what was written and what was not. Run it with
 *   `--broadcast`, observe the failure, then recover with `--resume` rather than rerunning from
 *   the start. Prove the recovery worked by writing a Solidity test that reads
 *   `broadcast/Deploy.s.sol/31337/run-latest.json` with `vm.readFile` and `vm.parseJson`,
 *   asserts exactly five deployments with five distinct addresses, and asserts the first three
 *   addresses match what the failed run had already recorded. You will need an `fs_permissions`
 *   entry for the broadcast directory.
 */
contract DeployRecoveryTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test parses run-latest.json and asserts exactly five deployed contract addresses, all
    /// distinct
    function test_criterion01_aTestParsesRunLatestJsonAndAssertsExactly() public {
        fail("A test parses run-latest.json and asserts exactly five deployed contract addresses, all distinct");
    }

    /// The first three addresses are identical before and after the resume, proving nothing was
    /// redeployed
    function test_criterion02_theFirstThreeAddressesAreIdenticalBeforeAndAfter() public {
        fail("The first three addresses are identical before and after the resume, proving nothing was redeployed");
    }

    /// A test or note distinguishes the dry-run artifacts from the broadcast artifacts by path
    function test_criterion03_aTestOrNoteDistinguishesTheDryRunArtifacts() public {
        fail("A test or note distinguishes the dry-run artifacts from the broadcast artifacts by path");
    }

    /// A follow-up script reads at least one address out of the artifact rather than from a
    /// hardcoded constant
    function test_criterion04_aFollowUpScriptReadsAtLeastOneAddress() public {
        fail("A follow-up script reads at least one address out of the artifact rather than from a hardcoded constant");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
