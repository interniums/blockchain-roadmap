// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {GuardBench} from "../src/evm-opcodes-memory/GuardBench.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-opcodes-memory-guard-benchmark  (measure, grain block, difficulty 3)
 * Run:      forge test -vv --junit --match-path test/GuardBench.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Implement the same trivial function three ways: unguarded, guarded with a storage lock, and
 *   guarded with a transient lock. Measure the gas of a single call in each case, and compute
 *   the guard overhead as the difference from the unguarded baseline. Do it twice: once where
 *   the storage lock slot is cold (first guarded call in the transaction) and once where it is
 *   warm. Report four overhead figures. Then write one paragraph explaining why publishing a
 *   single number for the storage guard is misleading, using your own cold and warm figures as
 *   evidence.
 */
contract GuardBenchTest is Test {
    /// The subject, from src/evm-opcodes-memory/GuardBench.sol. Add functions there and call them here.
    GuardBench internal subject;

    function setUp() public {
        subject = new GuardBench();
    }

    /// Four measured overheads from the learner's own run - storage cold, storage warm, transient,
    /// and the unguarded baseline
    function test_criterion01_fourMeasuredOverheadsFromTheLearnerSOwnRun() public {
        fail(
            "Four measured overheads from the learner's own run - storage cold, storage warm, transient, and the unguarded baseline"
        );
    }

    /// The transient overhead is flat across cold and warm cases and the storage overhead is not
    function test_criterion02_theTransientOverheadIsFlatAcrossColdAndWarm() public {
        fail("The transient overhead is flat across cold and warm cases and the storage overhead is not");
    }

    /// The warm storage overhead lands near 3,100 and the transient overhead near 284 on a
    /// comparable toolchain
    function test_criterion03_theWarmStorageOverheadLandsNear3100And() public {
        fail("The warm storage overhead lands near 3,100 and the transient overhead near 284 on a comparable toolchain");
    }

    /// A written paragraph explaining why a single published figure for the storage guard cannot be
    /// reproduced
    function test_criterion04_aWrittenParagraphExplainingWhyASinglePublishedFigure() public {
        fail("A written paragraph explaining why a single published figure for the storage guard cannot be reproduced");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
