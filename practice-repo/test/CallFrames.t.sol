// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-execution-a-call-is-a-new-machine  (implement, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/CallFrames.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Three properties of the execution model, each demonstrated by hitting its edge. MEMORY IS
 *   PER FRAME. Write a contract that writes to memory, calls another contract, and reads its
 *   memory back. Show it unchanged. Then have the callee write to the same offsets and show the
 *   caller still unaffected. State in one sentence what is shared between frames and what is
 *   not. THE DEPTH LIMIT. Recurse until you hit it. Report the exact depth at which the call
 *   fails, and — the part that matters — show how the failure presents to the caller. It is not
 *   a revert, and code that treats it as one is wrong. Then construct a case where hitting the
 *   limit makes a contract behave incorrectly rather than merely fail. GAS IS A COUNTDOWN. Show
 *   that gas forwarded to a call is a ceiling and not a promise: forward a specific amount and
 *   show the callee receiving less. Report both numbers and name the rule. THE NEUTERED OPCODE.
 *   Deploy a contract that calls `selfdestruct` and show what now happens: what is destroyed,
 *   what is not, and under what single circumstance the old behaviour still occurs. Then state
 *   what breaks in a contract written against the old semantics.
 */
contract CallFramesTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A caller's memory is shown unaffected by a callee writing the same offsets
    function test_criterion01_aCallerSMemoryIsShownUnaffectedByA() public {
        fail("A caller's memory is shown unaffected by a callee writing the same offsets");
    }

    /// One sentence states what is shared between frames and what is not
    function test_criterion02_oneSentenceStatesWhatIsSharedBetweenFramesAnd() public {
        fail("One sentence states what is shared between frames and what is not");
    }

    /// The exact depth at which calls begin failing is reported
    function test_criterion03_theExactDepthAtWhichCallsBeginFailingIs() public {
        fail("The exact depth at which calls begin failing is reported");
    }

    /// The failure is shown presenting to the caller as something other than a revert
    function test_criterion04_theFailureIsShownPresentingToTheCallerAs() public {
        fail("The failure is shown presenting to the caller as something other than a revert");
    }

    /// A case is constructed where hitting the depth limit makes a contract behave incorrectly
    /// rather than merely fail
    function test_criterion05_aCaseIsConstructedWhereHittingTheDepthLimit() public {
        fail("A case is constructed where hitting the depth limit makes a contract behave incorrectly rather than merely fail");
    }

    /// Forwarded gas is shown to be a ceiling, with requested and received amounts reported and the
    /// rule named
    function test_criterion06_forwardedGasIsShownToBeACeilingWith() public {
        fail("Forwarded gas is shown to be a ceiling, with requested and received amounts reported and the rule named");
    }

    /// selfdestruct is shown with what is and is not destroyed, and the single remaining
    /// circumstance for old behaviour
    function test_criterion07_selfdestructIsShownWithWhatIsAndIsNot() public {
        fail("selfdestruct is shown with what is and is not destroyed, and the single remaining circumstance for old behaviour");
    }

    /// What breaks in a contract written against the old selfdestruct semantics is stated
    function test_criterion08_whatBreaksInAContractWrittenAgainstTheOld() public {
        fail("What breaks in a contract written against the old selfdestruct semantics is stated");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
