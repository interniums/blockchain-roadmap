// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-accounts-code-length-audit  (read, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/EoaCheckAudit.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Find three deployed, pre-2025 contracts that gate behaviour on `address.code.length == 0`,
 *   `extcodesize`, or `msg.sender == tx.origin`. Read each one and decide what property the
 *   check was actually protecting — anti-bot, anti-flash-loan, reward eligibility, reentrancy
 *   heuristic. Then encode each verdict as a fork test: write a test that delegates an EOA to a
 *   trivial delegate and drives the contract through the check, asserting either that the
 *   guarded path is now reachable when it should not be, or that it is still unreachable and
 *   explaining why. Every verdict must be a passing assertion, not a comment.
 */
contract EoaCheckAuditTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Three separate tests, one per contract, each naming the contract address and the exact line
    /// of the check
    function test_criterion01_threeSeparateTestsOnePerContractEachNamingThe() public {
        fail("Three separate tests, one per contract, each naming the contract address and the exact line of the check");
    }

    /// At least one test demonstrates a guarded path becoming reachable by a delegated EOA
    function test_criterion02_atLeastOneTestDemonstratesAGuardedPathBecoming() public {
        fail("At least one test demonstrates a guarded path becoming reachable by a delegated EOA");
    }

    /// Each test carries a one-sentence comment stating the property the original check was trying
    /// to enforce
    function test_criterion03_eachTestCarriesAOneSentenceCommentStatingThe() public {
        fail("Each test carries a one-sentence comment stating the property the original check was trying to enforce");
    }

    /// Any contract judged still safe has a test asserting the specific reason it is unaffected
    function test_criterion04_anyContractJudgedStillSafeHasATestAsserting() public {
        fail("Any contract judged still safe has a test asserting the specific reason it is unaffected");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
