// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {GasAccounting} from "../../src/evm-yul-assembly/GasAccounting.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-exit-account-for-every-gas-unit  (measure, grain exit, difficulty 5)
 * Run:      forge test --match-path test/exit/GasAccounting.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Pick one mainnet transaction that costs more than 200,000 gas and touches at least three
 *   contracts. Produce a post-mortem that accounts for its cost down to the frame, and then a
 *   rewrite that is measurably cheaper — with the measurement defended rather than asserted. SIX
 *   parts. ONE. Name the envelope type and say what that envelope bought: which fields exist
 *   because of it, and what the transaction would have paid under the previous one. TWO.
 *   Attribute the gas. Intrinsic cost, calldata, each frame's execution, each cold and warm
 *   access, each storage write and its refund. The numbers must sum to the receipt. If they do
 *   not, the gap is the finding and you say what you have not accounted for. THREE. Verify one
 *   storage slot the transaction wrote, against the post-state root, without trusting the RPC
 *   that reported it. FOUR. Audit the contracts for "is this a contract" checks. Find every
 *   `extcodesize`, `code.length` and `isContract` in the reachable code and say, for each,
 *   whether a delegated EOA under EIP-7702 breaks it — and what specifically goes wrong when it
 *   does. Nothing to find is an acceptable answer only if you show where you looked. FIVE.
 *   Predict the address of one contract the transaction interacts with, from its deployment
 *   inputs, and state exactly which single change to those inputs would move it. SIX. Take the
 *   most expensive frame and rewrite it. For each value it holds, choose between stack,
 *   calldata, memory, transient storage and storage, and defend the choice with measured gas —
 *   then state which of your numbers mainnet will not reproduce, and why. If your rewrite uses
 *   assembly, it carries a memory-safe annotation and you argue the annotation is honest.
 */
contract GasAccountingTest is Test {
    /// The subject, from src/evm-yul-assembly/GasAccounting.sol. Add functions there and call them here.
    GasAccounting internal subject;

    function setUp() public {
        subject = new GasAccounting();
    }

    /// The gas attribution sums to the receipt, or the unaccounted remainder is stated as a number
    /// and named
    function test_criterion01_theGasAttributionSumsToTheReceiptOrThe() public {
        fail("The gas attribution sums to the receipt, or the unaccounted remainder is stated as a number and named");
    }

    /// Each cold access, warm access, storage write and refund is attributed to a specific frame
    /// rather than to the transaction as a whole
    function test_criterion02_eachColdAccessWarmAccessStorageWriteAndRefund() public {
        fail(
            "Each cold access, warm access, storage write and refund is attributed to a specific frame rather than to the transaction as a whole"
        );
    }

    /// One written storage slot verifies against the post-state root using your own trie walk
    function test_criterion03_oneWrittenStorageSlotVerifiesAgainstThePostState() public {
        fail("One written storage slot verifies against the post-state root using your own trie walk");
    }

    /// Every contract-detection check in the reachable code is listed with a verdict on whether
    /// EIP-7702 breaks it and what fails when it does
    function test_criterion04_everyContractDetectionCheckInTheReachableCodeIs() public {
        fail(
            "Every contract-detection check in the reachable code is listed with a verdict on whether EIP-7702 breaks it and what fails when it does"
        );
    }

    /// One contract address is predicted from its deployment inputs and a named single change moves
    /// it, demonstrated rather than asserted
    function test_criterion05_oneContractAddressIsPredictedFromItsDeploymentInputs() public {
        fail(
            "One contract address is predicted from its deployment inputs and a named single change moves it, demonstrated rather than asserted"
        );
    }

    /// The rewrite is measurably cheaper under a test that fails if the saving disappears
    function test_criterion06_theRewriteIsMeasurablyCheaperUnderATestThat() public {
        fail("The rewrite is measurably cheaper under a test that fails if the saving disappears");
    }

    /// The write-up names at least one measured number mainnet will not reproduce, and says why
    function test_criterion07_theWriteUpNamesAtLeastOneMeasuredNumber() public {
        fail("The write-up names at least one measured number mainnet will not reproduce, and says why");
    }

    /// Any assembly in the rewrite carries a memory-safe annotation with an argument for its
    /// honesty
    function test_criterion08_anyAssemblyInTheRewriteCarriesAMemorySafe() public {
        fail("Any assembly in the rewrite carries a memory-safe annotation with an argument for its honesty");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
