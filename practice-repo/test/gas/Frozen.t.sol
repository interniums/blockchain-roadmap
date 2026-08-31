// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {Frozen} from "../../src/toolchain-ci/Frozen.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-ci-false-positive-gate  (break, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/gas/Frozen.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Set up `forge snapshot --check` as a gate over a repository. Now add a single new test that
 *   exercises an existing function on a cheap path, changing no production code at all, and show
 *   the gate failing. Explain precisely why. Then implement the fix that keeps the signal
 *   without the false positive: move gas measurement into a small frozen suite under `test/gas/`
 *   whose contents change only deliberately, pin its fuzz seed, and gate on that file alone
 *   while the functional suite is free to churn. Prove the new arrangement by adding another
 *   functional test and showing the frozen numbers do not move. As a coda, add a test that
 *   executes every line of a contract and asserts nothing, and report the coverage number it
 *   produces.
 */
contract FrozenTest is Test {
    /// The subject, from src/toolchain-ci/Frozen.sol. Add functions there and call them here.
    Frozen internal subject;

    function setUp() public {
        subject = new Frozen();
    }

    /// The frozen gas suite passes with its recorded numbers before and after an unrelated
    /// functional test is added
    function test_criterion01_theFrozenGasSuitePassesWithItsRecordedNumbers() public {
        fail(
            "The frozen gas suite passes with its recorded numbers before and after an unrelated functional test is added"
        );
    }

    /// A written explanation states why the original gate failed on a change with no production
    /// effect
    function test_criterion02_aWrittenExplanationStatesWhyTheOriginalGateFailed() public {
        fail("A written explanation states why the original gate failed on a change with no production effect");
    }

    /// The frozen suite pins a fuzz seed, or contains no fuzz tests at all, and says which
    function test_criterion03_theFrozenSuitePinsAFuzzSeedOrContains() public {
        fail("The frozen suite pins a fuzz seed, or contains no fuzz tests at all, and says which");
    }

    /// The assertion-free coverage test is reported with its coverage percentage, as evidence that
    /// coverage measures execution rather than checking
    function test_criterion04_theAssertionFreeCoverageTestIsReportedWithIts() public {
        fail(
            "The assertion-free coverage test is reported with its coverage percentage, as evidence that coverage measures execution rather than checking"
        );
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
