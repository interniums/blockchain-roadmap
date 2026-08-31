// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-fork-testing-capstone-a-moment-you-can-return-to  (implement, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/capstone/ForkMoment.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Pick a real event on mainnet — a large swap, a liquidation, an exploit — and build a suite
 *   that reproduces the moment before it, runs your own code against that state, and does so
 *   identically on a machine with no network. PIN AND REPRODUCE. Fork at the block before your
 *   chosen event. Run your code against real deployed contracts, not mocks. Then delete the
 *   cache, run again with the network on, and assert the same result. Then run a third time with
 *   the network OFF and assert the same result again. All three numbers go in the write-up.
 *   PROVE IT IS LAZY. Show that a fork is not a download: count the RPC requests your suite
 *   makes, then add one storage read to your test and show the count go up by a specific amount.
 *   State what that implies about the cost of a large fork suite. TWO WORLDS. Create two forks
 *   in one test at different blocks and show their state is isolated — the same contract holding
 *   different values. Then make one address persistent across both and show what changes. MOVE
 *   THROUGH TIME. Use roll-fork to advance past your event and assert the state changed the way
 *   the real chain did. Then use vm.transact to replay the actual transaction and compare your
 *   prediction against what really happened. Any difference is a finding, not an error. THE
 *   BILL. Report the RPC request count, the wall-clock time cold and warm, and an estimate of
 *   what running this suite a hundred times a day would cost at your provider's prices. Then
 *   state whether an archive node was required and why. CI. Get the suite green in CI with a
 *   restored cache, and report the time saved against a cold run.
 */
contract ForkMomentTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// The suite forks at a pinned block before a real named event and runs against real deployed
    /// contracts
    function test_criterion01_theSuiteForksAtAPinnedBlockBeforeA() public {
        fail("The suite forks at a pinned block before a real named event and runs against real deployed contracts");
    }

    /// The same result is produced cold with network, warm with network, and warm with the network
    /// off, with all three recorded
    function test_criterion02_theSameResultIsProducedColdWithNetworkWarm() public {
        fail("The same result is produced cold with network, warm with network, and warm with the network off, with all three recorded");
    }

    /// RPC request count is reported, and adding one storage read is shown to increase it by a
    /// specific amount
    function test_criterion03_rpcRequestCountIsReportedAndAddingOneStorage() public {
        fail("RPC request count is reported, and adding one storage read is shown to increase it by a specific amount");
    }

    /// Two forks at different blocks are shown holding different state for the same contract
    function test_criterion04_twoForksAtDifferentBlocksAreShownHoldingDifferent() public {
        fail("Two forks at different blocks are shown holding different state for the same contract");
    }

    /// A persistent address is shown behaving differently from a non-persistent one across those
    /// forks
    function test_criterion05_aPersistentAddressIsShownBehavingDifferentlyFromA() public {
        fail("A persistent address is shown behaving differently from a non-persistent one across those forks");
    }

    /// roll-fork advances past the event and the state change matches the real chain
    function test_criterion06_rollForkAdvancesPastTheEventAndTheState() public {
        fail("roll-fork advances past the event and the state change matches the real chain");
    }

    /// vm.transact replays the real transaction and any divergence from the prediction is reported
    /// as a finding
    function test_criterion07_vmTransactReplaysTheRealTransactionAndAnyDivergence() public {
        fail("vm.transact replays the real transaction and any divergence from the prediction is reported as a finding");
    }

    /// The write-up reports request count, cold and warm wall-clock time, and a cost estimate at
    /// provider prices
    function test_criterion08_theWriteUpReportsRequestCountColdAndWarm() public {
        fail("The write-up reports request count, cold and warm wall-clock time, and a cost estimate at provider prices");
    }

    /// Whether an archive node was required is stated with the reason
    function test_criterion09_whetherAnArchiveNodeWasRequiredIsStatedWith() public {
        fail("Whether an archive node was required is stated with the reason");
    }

    /// CI runs the suite green with a restored cache, with the time saved against cold reported
    function test_criterion10_ciRunsTheSuiteGreenWithARestoredCache() public {
        fail("CI runs the suite green with a restored cache, with the time saved against cold reported");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
