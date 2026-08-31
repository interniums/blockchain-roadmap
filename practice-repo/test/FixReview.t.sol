// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: security-audit-craft-fix-review-note  (fix, grain block, difficulty 3)
 * Run:      bash -c 'set -e; forge test --junit --match-path test/FixReview.t.sol; f=docs/fix-review.md; grep -qF "## Correct" "$f"; grep -qF "## Complete" "$f"; grep -qF "## Introduced nothing new" "$f"; grep -qF "## Pattern search" "$f"'
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Choose a medium-severity finding from a public audit report where the affected code is
 *   available. Check out the audited commit, reproduce the issue as a failing Foundry test,
 *   apply the recommended fix, and confirm the test passes. Then write the fix-review note the
 *   auditor would have written: whether the fix is correct, whether it is complete -
 *   specifically whether the same pattern exists anywhere else in the codebase - and whether it
 *   introduced anything new. Search for the pattern elsewhere and report what you found,
 *   including finding nothing.
 */
contract FixReviewTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test that fails at the audited commit and passes after the fix
    function test_criterion01_aTestThatFailsAtTheAuditedCommitAnd() public {
        fail("A test that fails at the audited commit and passes after the fix");
    }

    /// A completeness check that searched the whole codebase for the same pattern, with the search
    /// recorded
    function test_criterion02_aCompletenessCheckThatSearchedTheWholeCodebaseFor() public {
        fail("A completeness check that searched the whole codebase for the same pattern, with the search recorded");
    }

    /// An explicit statement about regressions introduced by the fix
    function test_criterion03_anExplicitStatementAboutRegressionsIntroducedByTheFix() public {
        fail("An explicit statement about regressions introduced by the fix");
    }

    /// The note is written for the client, not for yourself
    function test_criterion04_theNoteIsWrittenForTheClientNotFor() public {
        fail("The note is written for the client, not for yourself");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
