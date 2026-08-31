// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-error-surfaces-five-failure-paths  (break, grain block, difficulty 3)
 * Run:      forge test --match-path test/FiveReverts.t.sol -vv && pnpm vitest run test/decode-five.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Deploy a contract exposing five failure paths: a `require` with a string message, a custom
 *   error carrying arguments, a failed `assert`, an out-of-bounds array read, and a call to an
 *   address holding no code. Capture the raw revert bytes for each. Build a five-row table
 *   mapping raw hex to selector to decoded meaning, using `cast sig`, `cast decode-error` and
 *   viem's `decodeErrorResult`, and explain why exactly one row has no selector at all.
 */
contract FiveRevertsTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Both toolchains produce the same error name and arguments for every decodable row
    function test_criterion01_bothToolchainsProduceTheSameErrorNameAndArguments() public {
        fail("Both toolchains produce the same error name and arguments for every decodable row");
    }

    /// The table records the two builtin selectors explicitly and identifies which panic code each
    /// panic row produced
    function test_criterion02_theTableRecordsTheTwoBuiltinSelectorsExplicitlyAnd() public {
        fail("The table records the two builtin selectors explicitly and identifies which panic code each panic row produced");
    }

    /// The written explanation identifies the no-selector row and lists at least three other causes
    /// that produce the same empty data
    function test_criterion03_theWrittenExplanationIdentifiesTheNoSelectorRowAnd() public {
        fail("The written explanation identifies the no-selector row and lists at least three other causes that produce the same empty data");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
