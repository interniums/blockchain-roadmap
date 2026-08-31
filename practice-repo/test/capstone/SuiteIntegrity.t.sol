// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-unit-testing-capstone-a-suite-that-cannot-lie  (fix, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/capstone/SuiteIntegrity.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Every trap in this module is a documented way a test passes while its subject is broken.
 *   Build a suite that contains one instance of each trap, prove each one passes wrongly, then
 *   fix it — and end with a mutation check that proves the fixed suite actually holds. THE
 *   TRAPS, each demonstrated then fixed. EXPECT-REVERT ON THE WRONG CALL. Write a test where
 *   `expectRevert` catches a revert from a setup call rather than the call under test, and
 *   passes. Fix it. ARGUMENT NESTING. Write one where the reverting call is nested inside
 *   another call's arguments, so the expectation applies to the outer call. Fix it. SELECTOR
 *   VERSUS DATA. Write one that asserts on a selector and passes for a revert carrying entirely
 *   different arguments. Fix it to assert on the data. THE LOW-LEVEL STATUS TRAP. Write one
 *   where the contract's low-level call fails, the boolean is ignored, and the test passes
 *   because nothing reverted. Fix it. EMIT ORDERING AND FLAGS. Write one where `expectEmit`
 *   matches a decoy contract's event, and one where the four booleans let a wrong value through.
 *   Fix both, and state what the flags do not cover. THE FIXTURE. Show that `setUp` runs per
 *   test rather than once, and demonstrate one consequence: state you expected to carry between
 *   tests and does not. Then show the opposite — something that does leak, via the snapshot
 *   model, and say what. PRANKS. Demonstrate all three prank scopes, including the tx.origin
 *   form and the delegatecall form, and one case where the scope ended earlier than the author
 *   expected. THE MUTATION CHECK. Finally, break the contract in five distinct ways, one at a
 *   time, and show the fixed suite catches all five. Any mutation that survives is a hole, and
 *   you either close it or document why it is acceptable.
 */
contract SuiteIntegrityTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Each of the six named traps is demonstrated passing wrongly, then fixed, with both versions
    /// retained
    function test_criterion01_eachOfTheSixNamedTrapsIsDemonstratedPassing() public {
        fail("Each of the six named traps is demonstrated passing wrongly, then fixed, with both versions retained");
    }

    /// The selector-versus-data fix asserts on data and fails for a revert with different arguments
    function test_criterion02_theSelectorVersusDataFixAssertsOnDataAnd() public {
        fail("The selector-versus-data fix asserts on data and fails for a revert with different arguments");
    }

    /// The low-level status trap is shown passing while the contract's call failed
    function test_criterion03_theLowLevelStatusTrapIsShownPassingWhile() public {
        fail("The low-level status trap is shown passing while the contract's call failed");
    }

    /// An expectEmit is shown matching a decoy contract, and a topic-flag combination is shown
    /// letting a wrong value through
    function test_criterion04_anExpectemitIsShownMatchingADecoyContractAnd() public {
        fail("An expectEmit is shown matching a decoy contract, and a topic-flag combination is shown letting a wrong value through");
    }

    /// What the four topic flags do not cover is stated
    function test_criterion05_whatTheFourTopicFlagsDoNotCoverIs() public {
        fail("What the four topic flags do not cover is stated");
    }

    /// setUp is shown to run per test, with one consequence demonstrated, and one thing that does
    /// leak via the snapshot model identified
    function test_criterion06_setupIsShownToRunPerTestWithOne() public {
        fail("setUp is shown to run per test, with one consequence demonstrated, and one thing that does leak via the snapshot model identified");
    }

    /// All three prank scopes are demonstrated, including the tx.origin and delegatecall forms,
    /// plus one case where the scope ended early
    function test_criterion07_allThreePrankScopesAreDemonstratedIncludingTheTx() public {
        fail("All three prank scopes are demonstrated, including the tx.origin and delegatecall forms, plus one case where the scope ended early");
    }

    /// Five distinct contract mutations are each caught by the fixed suite
    function test_criterion08_fiveDistinctContractMutationsAreEachCaughtByThe() public {
        fail("Five distinct contract mutations are each caught by the fixed suite");
    }

    /// Any surviving mutation is documented with a reason it is acceptable
    function test_criterion09_anySurvivingMutationIsDocumentedWithAReasonIt() public {
        fail("Any surviving mutation is documented with a reason it is acceptable");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
