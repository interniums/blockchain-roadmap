// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-exit-a-repo-someone-can-clone  (implement, grain exit, difficulty 5)
 * Run:      forge test --match-path test/exit/Repo.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   The deliverable of this track is the repository itself. Take the practice repo you have been
 *   working in and make it something a stranger can clone and get identical results from — then
 *   prove that claim rather than making it. EIGHT properties, each with the evidence for it in
 *   the repo. REPRODUCIBLE. Pinned compiler version, pinned dependencies, committed lockfile. A
 *   documented command produces byte-identical bytecode, and you show the hash from two runs.
 *   TESTS THAT FAIL RIGHT. For three tests, demonstrate that each fails for the reason it
 *   claims: break the thing it tests, show the failure message names that thing, restore it. A
 *   test that passes when its subject is broken is worse than no test and you find at least one.
 *   FUZZ TO INVARIANT. Take one suspicion, write it as a fuzz property, then promote it to a
 *   stateful invariant campaign with handlers. Report the handler revert rate and get it under
 *   15% — a campaign that mostly reverts is a campaign that mostly tested nothing. FORK, PINNED.
 *   One suite runs against real mainnet state at a pinned block, offline after the first run,
 *   and produces the same numbers on a machine with no network. HONEST GAS. A gas report, plus a
 *   written statement of which numbers mainnet will not reproduce and why. Name at least two.
 *   MULTICHAIN DEPLOY. Deploy one contract to three chains at the same address, verify on each,
 *   and then deliberately interrupt a deploy and recover it. The recovery is the deliverable,
 *   not the deploy. CI THAT IS NOT FLAKY. A pipeline that catches gas regressions, format drift
 *   and broken invariants. Run it ten times on unchanged code with zero failures, and show the
 *   runs. HARDHAT JUDGEMENT. Read a Hardhat 3 repository and write one page on whether this
 *   project needs it. "No" is the expected answer and it still has to be argued.
 */
contract RepoTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A documented command produces byte-identical bytecode across two runs, with both hashes
    /// recorded
    function test_criterion01_aDocumentedCommandProducesByteIdenticalBytecodeAcrossTwo() public {
        fail("A documented command produces byte-identical bytecode across two runs, with both hashes recorded");
    }

    /// Three tests are each shown to fail for the reason they claim, by breaking and restoring
    /// their subject
    function test_criterion02_threeTestsAreEachShownToFailForThe() public {
        fail("Three tests are each shown to fail for the reason they claim, by breaking and restoring their subject");
    }

    /// At least one pre-existing test is identified that passed while its subject was broken
    function test_criterion03_atLeastOnePreExistingTestIsIdentifiedThat() public {
        fail("At least one pre-existing test is identified that passed while its subject was broken");
    }

    /// A stateful invariant campaign runs with a handler revert rate under 15%, with the rate
    /// reported
    function test_criterion04_aStatefulInvariantCampaignRunsWithAHandlerRevert() public {
        fail("A stateful invariant campaign runs with a handler revert rate under 15%, with the rate reported");
    }

    /// A fork suite runs offline at a pinned block and reproduces its numbers with no network
    /// access
    function test_criterion05_aForkSuiteRunsOfflineAtAPinnedBlock() public {
        fail("A fork suite runs offline at a pinned block and reproduces its numbers with no network access");
    }

    /// The gas report is accompanied by at least two named numbers mainnet will not reproduce, with
    /// reasons
    function test_criterion06_theGasReportIsAccompaniedByAtLeastTwo() public {
        fail("The gas report is accompanied by at least two named numbers mainnet will not reproduce, with reasons");
    }

    /// One contract is deployed to three chains at one address and verified on each
    function test_criterion07_oneContractIsDeployedToThreeChainsAtOne() public {
        fail("One contract is deployed to three chains at one address and verified on each");
    }

    /// An interrupted deploy is recovered, with the recovery steps and the resume state committed
    function test_criterion08_anInterruptedDeployIsRecoveredWithTheRecoverySteps() public {
        fail("An interrupted deploy is recovered, with the recovery steps and the resume state committed");
    }

    /// CI runs ten times on unchanged code with zero failures, and the runs are linked or logged
    function test_criterion09_ciRunsTenTimesOnUnchangedCodeWithZero() public {
        fail("CI runs ten times on unchanged code with zero failures, and the runs are linked or logged");
    }

    /// A written page argues whether this project needs Hardhat 3, from the repository you read
    /// rather than from generalities
    function test_criterion10_aWrittenPageArguesWhetherThisProjectNeedsHardhat() public {
        fail("A written page argues whether this project needs Hardhat 3, from the repository you read rather than from generalities");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
