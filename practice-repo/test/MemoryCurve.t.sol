// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {MemoryCurve} from "../src/evm-opcodes-memory/MemoryCurve.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-opcodes-memory-cost-curve  (measure, grain block, difficulty 3)
 * Run:      forge test -vv --junit --match-path test/MemoryCurve.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write a test that MSTOREs at increasing offsets — 1 KiB, 16 KiB, 64 KiB, 256 KiB, 1 MiB —
 *   and records gas used for each expansion step. Plot or tabulate the results and fit them
 *   against `3·words + floor(words² / 512)`. Identify roughly the buffer size at which the
 *   quadratic term overtakes the linear one. Then demonstrate the high-water rule: expand memory
 *   to a large offset, return to working at offset 0x80, allocate again, and show that nothing
 *   was refunded. Finally compare `bytes calldata` against `bytes memory` for a 32-byte, 1 KiB
 *   and 32 KiB argument.
 */
contract MemoryCurveTest is Test {
    /// The subject, from src/evm-opcodes-memory/MemoryCurve.sol. Add functions there and call them here.
    MemoryCurve internal subject;

    function setUp() public {
        subject = new MemoryCurve();
    }

    /// Measured costs match 3·words + words²/512 within rounding at every measured size
    function test_criterion01_measuredCostsMatch3WordsWords512WithinRounding() public {
        fail(unicode"Measured costs match 3·words + words²/512 within rounding at every measured size");
    }

    /// The learner states the approximate size at which the quadratic term exceeds the linear one,
    /// derived from their own data
    function test_criterion02_theLearnerStatesTheApproximateSizeAtWhichThe() public {
        fail(
            "The learner states the approximate size at which the quadratic term exceeds the linear one, derived from their own data"
        );
    }

    /// A test proves that touching a high offset and then working low refunds nothing
    function test_criterion03_aTestProvesThatTouchingAHighOffsetAnd() public {
        fail("A test proves that touching a high offset and then working low refunds nothing");
    }

    /// A three-row calldata-versus-memory table naming which term dominates at each size
    function test_criterion04_aThreeRowCalldataVersusMemoryTableNamingWhich() public {
        fail("A three-row calldata-versus-memory table naming which term dominates at each size");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
