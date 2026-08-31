// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {AccountShape} from "../src/evm-accounts/AccountShape.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-accounts-what-the-outside-sees  (break, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/AccountShape.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   An account is four fields, and since delegation arrived, two of the questions people ask
 *   about an account no longer have the answers they used to. THE FOUR FIELDS. For three real
 *   accounts — a plain EOA, a contract, and a delegated EOA — print all four fields of each and
 *   state, for each account, what is different. Then say where the code and the storage of the
 *   contract actually live, since neither is in the record. THE ASYMMETRY. Demonstrate that what
 *   an external observer sees is not what executes. For the delegated EOA, show the code an
 *   `extcodesize`-style check observes and the code that actually runs, and show they are not
 *   the same object. Then write the check that people use to detect a contract and show it
 *   giving the wrong answer for this account. Say concretely what breaks in a contract that
 *   relies on it. NO CHAINING. Show that delegation does not chain: point a delegation at an
 *   account that is itself delegated, and demonstrate what actually happens rather than what a
 *   reader might expect. State the rule in one sentence.
 */
contract AccountShapeTest is Test {
    /// The subject, from src/evm-accounts/AccountShape.sol. Add functions there and call them here.
    AccountShape internal subject;

    function setUp() public {
        subject = new AccountShape();
    }

    /// All four fields are printed for a plain EOA, a contract and a delegated EOA, with the
    /// differences stated
    function test_criterion01_allFourFieldsArePrintedForAPlainEoa() public {
        fail("All four fields are printed for a plain EOA, a contract and a delegated EOA, with the differences stated");
    }

    /// Where a contract's code and storage actually live is stated, given neither is in the record
    function test_criterion02_whereAContractSCodeAndStorageActuallyLive() public {
        fail("Where a contract's code and storage actually live is stated, given neither is in the record");
    }

    /// The code an external check observes and the code that executes are shown to differ for a
    /// delegated EOA
    function test_criterion03_theCodeAnExternalCheckObservesAndTheCode() public {
        fail("The code an external check observes and the code that executes are shown to differ for a delegated EOA");
    }

    /// A standard contract-detection check is shown returning the wrong answer, with a concrete
    /// consequence
    function test_criterion04_aStandardContractDetectionCheckIsShownReturningThe() public {
        fail("A standard contract-detection check is shown returning the wrong answer, with a concrete consequence");
    }

    /// Delegation pointed at an already-delegated account is shown not to chain, with the rule
    /// stated in one sentence
    function test_criterion05_delegationPointedAtAnAlreadyDelegatedAccountIsShown() public {
        fail(
            "Delegation pointed at an already-delegated account is shown not to chain, with the rule stated in one sentence"
        );
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
