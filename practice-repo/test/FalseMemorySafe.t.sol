// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {FalseMemorySafe} from "../src/evm-yul-assembly/FalseMemorySafe.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-yul-assembly-false-memory-safe  (break, grain module, difficulty 5)
 * Run:      FOUNDRY_PROFILE=viair forge test --junit --match-path test/FalseMemorySafe.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write an assembly block that writes past the free-memory pointer without updating it,
 *   annotate it `("memory-safe")`, and place a Solidity memory allocation after it. Compile and
 *   run the same test under several configurations: legacy codegen, `--via-ir`, and `--via-ir`
 *   at different optimizer `runs` settings. Find at least one configuration where the output is
 *   wrong and at least one where it is accidentally correct. Then remove the annotation and
 *   record what happens to the gas of unrelated functions in the same file, to see the cost of
 *   the conservative choice.
 */
contract FalseMemorySafeTest is Test {
    /// The subject, from src/evm-yul-assembly/FalseMemorySafe.sol. Add functions there and call them here.
    FalseMemorySafe internal subject;

    function setUp() public {
        subject = new FalseMemorySafe();
    }

    /// The same test produces different results under at least two documented compiler
    /// configurations
    function test_criterion01_theSameTestProducesDifferentResultsUnderAtLeast() public {
        fail("The same test produces different results under at least two documented compiler configurations");
    }

    /// The learner names the configuration in which the false annotation caused corruption
    function test_criterion02_theLearnerNamesTheConfigurationInWhichTheFalse() public {
        fail("The learner names the configuration in which the false annotation caused corruption");
    }

    /// A gas comparison shows unrelated functions in the same file getting worse when the
    /// annotation is removed
    function test_criterion03_aGasComparisonShowsUnrelatedFunctionsInTheSame() public {
        fail("A gas comparison shows unrelated functions in the same file getting worse when the annotation is removed");
    }

    /// A written explanation of why a passing test suite is not evidence the annotation was true
    function test_criterion04_aWrittenExplanationOfWhyAPassingTestSuite() public {
        fail("A written explanation of why a passing test suite is not evidence the annotation was true");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
