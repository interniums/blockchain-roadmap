// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-oracles-harden-price-getter  (fix, grain block, difficulty 2)
 * Run:      forge test --match-path test/HardenedOracle.t.sol -vv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Start from a getPrice function that returns latestRoundData().answer and nothing else.
 *   Harden it so that it reverts with a distinct custom error on each of the following: an
 *   updatedAt older than a configured maximum age, a non-positive answer, an answer at or beyond
 *   the aggregator's reported minimum or maximum, a feed call that itself reverts, and a
 *   divergence beyond a configured basis point bound from an independent secondary source. Write
 *   one unit test per failure mode using a mock aggregator you control, and one fork test
 *   against a live feed that asserts the happy path still returns a sane value. Document, in a
 *   comment, the maximum age you chose and why it is larger than that feed's published
 *   heartbeat.
 */
contract HardenedOracleTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Five unit tests, each triggering exactly one failure mode and asserting its specific custom
    /// error
    function test_criterion01_fiveUnitTestsEachTriggeringExactlyOneFailureMode() public {
        fail("Five unit tests, each triggering exactly one failure mode and asserting its specific custom error");
    }

    /// A fork test against a live feed returns a value within a sane band and does not revert
    function test_criterion02_aForkTestAgainstALiveFeedReturnsA() public {
        fail("A fork test against a live feed returns a value within a sane band and does not revert");
    }

    /// The chosen maxAge is documented and is strictly greater than the feed's published heartbeat,
    /// with the reasoning stated
    function test_criterion03_theChosenMaxageIsDocumentedAndIsStrictlyGreater() public {
        fail("The chosen maxAge is documented and is strictly greater than the feed's published heartbeat, with the reasoning stated");
    }

    /// A test asserts the divergence check fires in both directions, not only when the primary is
    /// high
    function test_criterion04_aTestAssertsTheDivergenceCheckFiresInBoth() public {
        fail("A test asserts the divergence check fires in both directions, not only when the primary is high");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
