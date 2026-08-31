// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {LanguageCore} from "../../src/solidity-language-core/LanguageCore.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-language-core-capstone-where-the-resemblance-breaks  (implement, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/capstone/LanguageCore.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   One contract, deliberately built so that each of this module's four traps is live in it and
 *   provable by test. Every prediction goes in a comment BEFORE the assertion that checks it —
 *   the exercise is predicting, not observing. DATA LOCATION. Include one assignment that copies
 *   and one that aliases, where the two lines look the same. A test shows mutating through one
 *   changes the original and the other does not. Then include a storage pointer that is dangling
 *   after the array it points into shrinks, and demonstrate what reading through it returns.
 *   VISIBILITY IS NOT PRIVACY. Give the contract a `private` state variable holding something
 *   that looks like a secret, and read it from outside the contract entirely. State in a comment
 *   which slot you read and how you knew it was that slot. VIEW AND PURE PROMISE LESS THAN YOU
 *   THINK. Write a `view` function that does something a reader would not expect a view function
 *   to be able to do, and a `pure` one likewise. Say precisely what each keyword does and does
 *   not enforce, and where the enforcement actually happens. MODIFIERS SPLICE. Write two
 *   modifiers whose order changes the outcome, and a third with the placeholder in a position
 *   that makes the function body run twice. Predict all three behaviours in comments first. THE
 *   DIAMOND. Build a four-contract inheritance diamond. Before running anything, write down in a
 *   comment the constructor order and the linearised override order the compiler will choose.
 *   Then assert both. Getting this wrong on the first attempt and leaving the wrong prediction
 *   visible, with a note on why you expected it, is worth more than getting it right. INTERFACE
 *   OR ABSTRACT. Finally, refactor one part of the contract to use an interface and one to use
 *   an abstract contract, and justify each choice in two sentences.
 */
contract LanguageCoreTest is Test {
    /// The subject, from src/solidity-language-core/LanguageCore.sol. Add functions there and call them here.
    LanguageCore internal subject;

    function setUp() public {
        subject = new LanguageCore();
    }

    /// Two visually similar assignments differ in copy-versus-alias behaviour, proven by mutating
    /// through one and not the other
    function test_criterion01_twoVisuallySimilarAssignmentsDifferInCopyVersusAlias() public {
        fail(
            "Two visually similar assignments differ in copy-versus-alias behaviour, proven by mutating through one and not the other"
        );
    }

    /// A dangling storage pointer is demonstrated with what reading through it returns
    function test_criterion02_aDanglingStoragePointerIsDemonstratedWithWhatReading() public {
        fail("A dangling storage pointer is demonstrated with what reading through it returns");
    }

    /// A private state variable is read from outside the contract, with the slot and the derivation
    /// named in a comment
    function test_criterion03_aPrivateStateVariableIsReadFromOutsideThe() public {
        fail(
            "A private state variable is read from outside the contract, with the slot and the derivation named in a comment"
        );
    }

    /// A view and a pure function each do something the keyword does not prevent, with the actual
    /// enforcement point stated
    function test_criterion04_aViewAndAPureFunctionEachDoSomething() public {
        fail(
            "A view and a pure function each do something the keyword does not prevent, with the actual enforcement point stated"
        );
    }

    /// Two modifiers whose order changes the outcome, and one whose placeholder position runs the
    /// body twice
    function test_criterion05_twoModifiersWhoseOrderChangesTheOutcomeAndOne() public {
        fail("Two modifiers whose order changes the outcome, and one whose placeholder position runs the body twice");
    }

    /// Every behavioural claim has a prediction in a comment placed above the assertion that checks
    /// it
    function test_criterion06_everyBehaviouralClaimHasAPredictionInAComment() public {
        fail("Every behavioural claim has a prediction in a comment placed above the assertion that checks it");
    }

    /// Constructor order and C3 linearised override order for a four-contract diamond are predicted
    /// before being asserted
    function test_criterion07_constructorOrderAndC3LinearisedOverrideOrderForA() public {
        fail(
            "Constructor order and C3 linearised override order for a four-contract diamond are predicted before being asserted"
        );
    }

    /// One refactor to an interface and one to an abstract contract, each justified in two
    /// sentences
    function test_criterion08_oneRefactorToAnInterfaceAndOneToAn() public {
        fail("One refactor to an interface and one to an abstract contract, each justified in two sentences");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
