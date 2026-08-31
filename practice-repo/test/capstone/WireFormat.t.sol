// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {WireFormat} from "../../src/solidity-errors-events/WireFormat.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-errors-events-capstone-what-leaves-the-frame  (implement, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/capstone/WireFormat.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   One contract plus one decoder, built together, so that every byte leaving a frame is
 *   something you chose rather than something the compiler chose for you. THE FAILURE CATALOGUE.
 *   Make the contract fail in every way it can: a require with no data, a require with a string,
 *   a require with a custom error, a revert with a custom error carrying arguments, an assert,
 *   and both compiler-thrown panics you can trigger. For each, capture the exact revert bytes
 *   and decode them in your own decoder — selector first, then arguments. Tabulate the byte
 *   length of each, because that is the cost of the choice. EAGER ARGUMENTS. Demonstrate that
 *   the arguments to a require's error are evaluated even when the condition passes, by making
 *   one of them expensive and measuring. State what that means for where you put a call in a
 *   require. PROVENANCE IS NOT PROVEN. Have contract A call contract B, where B reverts with an
 *   error that A also declares. Show that a client decoding the revert cannot tell which
 *   contract failed. Then show the same error forwarded through a proxy and note that it is not
 *   in the proxy's ABI at all — so a client working from the ABI cannot decode it. THE LOG. Emit
 *   events covering: a value type indexed, a value type in data, a dynamic type indexed, and the
 *   maximum number of indexed arguments. For each, show the topics and the data separately. Then
 *   prove the point: try to recover the original value of the indexed dynamic argument, fail,
 *   and fix the event so it is recoverable — stating what the fix costs. ON-CHAIN BLINDNESS.
 *   Write a test asserting a contract cannot read its own emitted event. THE PRICE OF INDEXING.
 *   Measure the gas of each event shape and state the per-topic cost you measured. Then design
 *   the final event schema for this contract, and say in two sentences what changing it in v2
 *   would silently break downstream.
 */
contract WireFormatTest is Test {
    /// The subject, from src/solidity-errors-events/WireFormat.sol. Add functions there and call them here.
    WireFormat internal subject;

    function setUp() public {
        subject = new WireFormat();
    }

    /// All six failure modes are triggered, their revert bytes captured, and decoded by your own
    /// decoder rather than a library
    function test_criterion01_allSixFailureModesAreTriggeredTheirRevertBytes() public {
        fail(
            "All six failure modes are triggered, their revert bytes captured, and decoded by your own decoder rather than a library"
        );
    }

    /// The byte length of each failure mode is tabulated
    function test_criterion02_theByteLengthOfEachFailureModeIsTabulated() public {
        fail("The byte length of each failure mode is tabulated");
    }

    /// Eager evaluation of a require's error arguments is demonstrated by measurement, with the
    /// consequence for placing calls in a require stated
    function test_criterion03_eagerEvaluationOfARequireSErrorArgumentsIs() public {
        fail(
            "Eager evaluation of a require's error arguments is demonstrated by measurement, with the consequence for placing calls in a require stated"
        );
    }

    /// A client is shown unable to determine which of two contracts declaring the same error
    /// actually failed
    function test_criterion04_aClientIsShownUnableToDetermineWhichOf() public {
        fail("A client is shown unable to determine which of two contracts declaring the same error actually failed");
    }

    /// An error forwarded through a proxy is shown to be absent from the proxy's ABI, and therefore
    /// undecodable from it
    function test_criterion05_anErrorForwardedThroughAProxyIsShownTo() public {
        fail(
            "An error forwarded through a proxy is shown to be absent from the proxy's ABI, and therefore undecodable from it"
        );
    }

    /// Four event shapes are emitted with topics and data shown separately for each
    function test_criterion06_fourEventShapesAreEmittedWithTopicsAndData() public {
        fail("Four event shapes are emitted with topics and data shown separately for each");
    }

    /// Recovering an indexed dynamic argument's original value fails, and the fixed event makes it
    /// recoverable with the cost stated
    function test_criterion07_recoveringAnIndexedDynamicArgumentSOriginalValueFails() public {
        fail(
            "Recovering an indexed dynamic argument's original value fails, and the fixed event makes it recoverable with the cost stated"
        );
    }

    /// A test asserts a contract cannot read its own emitted event
    function test_criterion08_aTestAssertsAContractCannotReadItsOwn() public {
        fail("A test asserts a contract cannot read its own emitted event");
    }

    /// Per-topic gas cost is measured, and the final schema comes with two sentences on what a v2
    /// change would silently break
    function test_criterion09_perTopicGasCostIsMeasuredAndTheFinal() public {
        fail(
            "Per-topic gas cost is measured, and the final schema comes with two sentences on what a v2 change would silently break"
        );
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
