// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {Fuzzing} from "../../src/toolchain-fuzzing/Fuzzing.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-fuzzing-capstone-the-constraint-hid-the-bug  (measure, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/capstone/Fuzzing.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   The hard part of fuzzing is not writing the property. It is that your input constraints are
 *   part of the test, and a constraint can exclude the only inputs that would have failed. This
 *   exercise makes that concrete by planting a bug in a place your first instinct will hide. THE
 *   TARGET. Write a function with a bug reachable only at a boundary — the maximum of a range, a
 *   zero, or a value just above a threshold. Write down which input class triggers it before you
 *   write any test. HIDE IT. Write a property test that constrains inputs with `vm.assume` in a
 *   way that excludes the triggering class. Show it passing at the default run count. Then
 *   report the rejection count and show that you were near the reject ceiling — the signal that
 *   your test was mostly not running. HIDE IT AGAIN, DIFFERENTLY. Now use a naive `bound`
 *   instead, and demonstrate the bias it introduces: show the distribution of values your bound
 *   actually produces and where it clusters. Show the test still passing. FIND IT. Fix the
 *   constraints so the test fails. State what you changed and why, in terms of the input class
 *   you wrote down at the start. THE DICTIONARY AND FIXTURES. Add a fuzz dictionary and fixtures
 *   containing the boundary values, and show the failure is now found in far fewer runs. Report
 *   the run count before and after. REPRODUCE IT. Capture the counterexample, show it persisted,
 *   and reproduce the exact failure from a seed on a clean checkout. Read the counterexample out
 *   loud in the write-up: what were the inputs, and why is that the boundary. THE LIMIT.
 *   Finally, construct a second bug that stateless fuzzing cannot find no matter how you
 *   constrain it, and say in one sentence what it needs instead.
 */
contract FuzzingTest is Test {
    /// The subject, from src/toolchain-fuzzing/Fuzzing.sol. Add functions there and call them here.
    Fuzzing internal subject;

    function setUp() public {
        subject = new Fuzzing();
    }

    /// The triggering input class is written down before any test exists
    function test_criterion01_theTriggeringInputClassIsWrittenDownBeforeAny() public {
        fail("The triggering input class is written down before any test exists");
    }

    /// A vm.assume-constrained property passes while excluding the triggering class, with the
    /// rejection count reported and shown near the ceiling
    function test_criterion02_aVmAssumeConstrainedPropertyPassesWhileExcludingThe() public {
        fail(
            "A vm.assume-constrained property passes while excluding the triggering class, with the rejection count reported and shown near the ceiling"
        );
    }

    /// A naive bound version also passes, with the actual value distribution shown and its
    /// clustering identified
    function test_criterion03_aNaiveBoundVersionAlsoPassesWithTheActual() public {
        fail(
            "A naive bound version also passes, with the actual value distribution shown and its clustering identified"
        );
    }

    /// Corrected constraints make the test fail, with the change explained in terms of the stated
    /// input class
    function test_criterion04_correctedConstraintsMakeTheTestFailWithTheChange() public {
        fail("Corrected constraints make the test fail, with the change explained in terms of the stated input class");
    }

    /// A dictionary and fixtures reduce the runs needed to find the failure, with counts before and
    /// after
    function test_criterion05_aDictionaryAndFixturesReduceTheRunsNeededTo() public {
        fail("A dictionary and fixtures reduce the runs needed to find the failure, with counts before and after");
    }

    /// The counterexample is persisted and reproduced from a seed on a clean checkout
    function test_criterion06_theCounterexampleIsPersistedAndReproducedFromASeed() public {
        fail("The counterexample is persisted and reproduced from a seed on a clean checkout");
    }

    /// The write-up reads the counterexample: the inputs, and why they are the boundary
    function test_criterion07_theWriteUpReadsTheCounterexampleTheInputsAnd() public {
        fail("The write-up reads the counterexample: the inputs, and why they are the boundary");
    }

    /// A second bug is constructed that stateless fuzzing cannot reach, with one sentence on what
    /// it needs instead
    function test_criterion08_aSecondBugIsConstructedThatStatelessFuzzingCannot() public {
        fail(
            "A second bug is constructed that stateless fuzzing cannot reach, with one sentence on what it needs instead"
        );
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
