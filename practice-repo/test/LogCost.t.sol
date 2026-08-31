// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-logs-bloom-emission-cost  (measure, grain block, difficulty 2)
 * Run:      forge test -vv --junit --match-path test/LogCost.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Emit the same payload three ways in one Foundry test: fully indexed across the available
 *   topic slots, fully non-indexed in the data field, and written to storage with SSTORE
 *   instead. Record gas for each. Derive the per-topic increment yourself by emitting LOG0
 *   through LOG4 with an identical data field and taking successive differences. Then
 *   demonstrate the indexed-dynamic rule: emit an event with an `indexed string`, show you
 *   cannot recover the string from the log, and show that filtering for the exact known string
 *   does work.
 */
contract LogCostTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Three measured totals for indexed, non-indexed and storage versions of the same payload
    function test_criterion01_threeMeasuredTotalsForIndexedNonIndexedAndStorage() public {
        fail("Three measured totals for indexed, non-indexed and storage versions of the same payload");
    }

    /// A derived per-topic increment from the learner's own LOG0-to-LOG4 differences, landing on
    /// 375
    function test_criterion02_aDerivedPerTopicIncrementFromTheLearnerS() public {
        fail("A derived per-topic increment from the learner's own LOG0-to-LOG4 differences, landing on 375");
    }

    /// A test showing the indexed string is unrecoverable from the log
    function test_criterion03_aTestShowingTheIndexedStringIsUnrecoverableFrom() public {
        fail("A test showing the indexed string is unrecoverable from the log");
    }

    /// A test showing an exact-value topic filter on that same string matches
    function test_criterion04_aTestShowingAnExactValueTopicFilterOn() public {
        fail("A test showing an exact-value topic filter on that same string matches");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
