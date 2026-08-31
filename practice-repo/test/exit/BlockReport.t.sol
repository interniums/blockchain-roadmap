// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {BlockReport} from "../../src/ledgers-finality/BlockReport.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-exit-rebuild-a-block  (measure, grain exit, difficulty 5)
 * Run:      forge test --match-path test/exit/BlockReport.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Pick one mainnet block from the last month. Produce a written report and a test suite that,
 *   together, account for that block completely: what it contains, how it was assembled, who
 *   could have lied at each step, and how deep you would wait before believing a payment inside
 *   it. FIVE things have to be in it. ONE. Reconstruct the block hash from the header fields
 *   yourself. List every field, and mark each one live, or a post-Merge fossil that exists only
 *   because the structure could not change. A test asserts your reconstruction equals the real
 *   hash. TWO. For four accounts touched by that block, print the four fields of each account
 *   record, and say where the code and the storage of each actually live — not "in the account",
 *   which is the answer this track exists to break. THREE. Take six transactions and diagnose
 *   each: which of the six failure modes it hit, or that it succeeded. At least one must be a
 *   transaction that vanished or stuck rather than reverting, and your diagnosis has to come
 *   from raw RPC output rather than from a block explorer's label. FOUR. Trace the build path:
 *   searcher, builder, relay, proposer. Name the actual parties where you can identify them, and
 *   for each hop state what that party could have done that nobody downstream would detect.
 *   FIVE. Choose a confirmation policy for a hypothetical product that settles a payment from
 *   this block, and defend it against the concrete cost of reversing the chain at that depth.
 *   State the value at risk you assumed, because the answer is meaningless without it.
 */
contract BlockReportTest is Test {
    /// The subject, from src/ledgers-finality/BlockReport.sol. Add functions there and call them here.
    BlockReport internal subject;

    function setUp() public {
        subject = new BlockReport();
    }

    /// A test reconstructs the chosen block's hash from its header fields and fails if any field is
    /// altered
    function test_criterion01_aTestReconstructsTheChosenBlockSHashFrom() public {
        fail("A test reconstructs the chosen block's hash from its header fields and fails if any field is altered");
    }

    /// Every header field is listed and marked live or post-Merge fossil, with the fossils named
    /// specifically rather than counted
    function test_criterion02_everyHeaderFieldIsListedAndMarkedLiveOr() public {
        fail(
            "Every header field is listed and marked live or post-Merge fossil, with the fossils named specifically rather than counted"
        );
    }

    /// Four account records are printed with all four fields, and the report states where code and
    /// storage actually live rather than implying they are in the record
    function test_criterion03_fourAccountRecordsArePrintedWithAllFourFields() public {
        fail(
            "Four account records are printed with all four fields, and the report states where code and storage actually live rather than implying they are in the record"
        );
    }

    /// Six transactions are each diagnosed to a named failure mode or to success, from raw RPC
    /// output, and at least one is a stuck or vanished transaction rather than a revert
    function test_criterion04_sixTransactionsAreEachDiagnosedToANamedFailure() public {
        fail(
            "Six transactions are each diagnosed to a named failure mode or to success, from raw RPC output, and at least one is a stuck or vanished transaction rather than a revert"
        );
    }

    /// Every hop of searcher, builder, relay and proposer is named, with a concrete undetectable
    /// action stated for each
    function test_criterion05_everyHopOfSearcherBuilderRelayAndProposerIs() public {
        fail(
            "Every hop of searcher, builder, relay and proposer is named, with a concrete undetectable action stated for each"
        );
    }

    /// The confirmation policy names a depth, the value at risk it assumes, and the cost of
    /// reversal at that depth
    function test_criterion06_theConfirmationPolicyNamesADepthTheValueAt() public {
        fail(
            "The confirmation policy names a depth, the value at risk it assumes, and the cost of reversal at that depth"
        );
    }

    /// A reader who does not have your RPC access can follow the report and reach the same
    /// conclusions from the data you quote
    function test_criterion07_aReaderWhoDoesNotHaveYourRpcAccess() public {
        fail(
            "A reader who does not have your RPC access can follow the report and reach the same conclusions from the data you quote"
        );
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
