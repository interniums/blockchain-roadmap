// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {ForceInclude} from "../src/scaling-forced-inclusion/ForceInclude.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: scaling-forced-inclusion-force-it-through  (implement, grain module, difficulty 4)
 * Run:      forge test --match-path test/ForceInclude.t.sol --fork-url $ETH_RPC_URL -vvv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write a Foundry test against a mainnet or testnet fork of an Arbitrum-family chain's L1
 *   contracts. First, read the live force-inclusion parameters straight from the SequencerInbox
 *   contract rather than from documentation, and assert on the values you find. Then queue a
 *   message through the delayed inbox, attempt the force-include call immediately and assert
 *   that it reverts, warp past the delay with `vm.warp` and `vm.roll`, and assert that the same
 *   call now succeeds. Do this for two different Arbitrum-family chains and show that the
 *   parameter differs between them. Finally, add a test showing that a forced transaction which
 *   would have succeeded at queue time reverts after the delay because the state moved — for
 *   example an allowance that was revoked.
 */
contract ForceIncludeTest is Test {
    /// The subject, from src/scaling-forced-inclusion/ForceInclude.sol. Add functions there and call them here.
    ForceInclude internal subject;

    function setUp() public {
        subject = new ForceInclude();
    }

    /// Force-inclusion parameters are read from the SequencerInbox contract on-chain and asserted,
    /// not hard-coded from docs
    function test_criterion01_forceInclusionParametersAreReadFromTheSequencerinboxContract() public {
        fail(
            "Force-inclusion parameters are read from the SequencerInbox contract on-chain and asserted, not hard-coded from docs"
        );
    }

    /// The force-include call reverts before the delay elapses and succeeds after it
    function test_criterion02_theForceIncludeCallRevertsBeforeTheDelayElapses() public {
        fail("The force-include call reverts before the delay elapses and succeeds after it");
    }

    /// Two Arbitrum-family chains are covered and the test output shows their parameters differ
    function test_criterion03_twoArbitrumFamilyChainsAreCoveredAndTheTest() public {
        fail("Two Arbitrum-family chains are covered and the test output shows their parameters differ");
    }

    /// One test demonstrates that inclusion is not the outcome — a forced transaction lands and
    /// reverts because state moved during the delay
    function test_criterion04_oneTestDemonstratesThatInclusionIsNotTheOutcome() public {
        fail(
            unicode"One test demonstrates that inclusion is not the outcome — a forced transaction lands and reverts because state moved during the delay"
        );
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
