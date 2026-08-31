// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-fork-testing-pinned-whale  (implement, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/ForkPinned.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write a test that forks mainnet at an explicitly pinned block, reads a real USDC balance of
 *   a known large holder through the live token contract, pranks that holder to move funds into
 *   a contract of yours, and asserts on the result. Reference the endpoint through an
 *   `[rpc_endpoints]` alias with the URL supplied by an environment variable — no keyed URL in
 *   source. Time the first run and the second. Then clear Foundry's cache directory and time a
 *   third run. Finally, remove the pin, run twice, and record what changes.
 */
contract ForkPinnedTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// The test passes against a pinned block and the block number appears in foundry.toml or on
    /// the command line, never as "latest"
    function test_criterion01_theTestPassesAgainstAPinnedBlockAndThe() public {
        fail("The test passes against a pinned block and the block number appears in foundry.toml or on the command line, never as \"latest\"");
    }

    /// Three wall-clock timings are recorded — cold, warm, and after clearing the cache — with the
    /// gap explained in terms of per-slot RPC fetches
    function test_criterion02_threeWallClockTimingsAreRecordedColdWarmAnd() public {
        fail(unicode"Three wall-clock timings are recorded — cold, warm, and after clearing the cache — with the gap explained in terms of per-slot RPC fetches");
    }

    /// No endpoint URL or API key appears in any committed source file
    function test_criterion03_noEndpointUrlOrApiKeyAppearsInAny() public {
        fail("No endpoint URL or API key appears in any committed source file");
    }

    /// The unpinned variant is shown either producing different results or missing the cache, and
    /// the learner can say why CI would be flaky
    function test_criterion04_theUnpinnedVariantIsShownEitherProducingDifferentResults() public {
        fail("The unpinned variant is shown either producing different results or missing the cache, and the learner can say why CI would be flaky");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
