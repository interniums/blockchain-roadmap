// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: security-exit-the-report-you-would-sign  (read, grain exit, difficulty 5)
 * Run:      forge test --match-path test/exit/Audit.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Choose a real, deployed codebase between 500 and 2,000 lines that you have not read before,
 *   and audit it. The deliverable is a report you would sign — which means every finding is
 *   defensible and every non-finding is a decision you made rather than a thing you missed. IN
 *   ORDER, because the order is the method. BEFORE READING BUSINESS LOGIC. Score the codebase on
 *   a nine-category maturity rubric. Test coverage, documentation, access control structure,
 *   dependency hygiene, upgradeability, monitoring, incident history, verification, code
 *   complexity. This comes first because it tells you where to spend the rest of your time, and
 *   doing it after you have read the code contaminates it. TRUST BOUNDARIES. Draw them. For
 *   every crossing, state what an attacker controls on the other side. A diagram plus a table.
 *   RANKED CLASSES. List the vulnerability classes you looked for, ranked by what actually loses
 *   money in this codebase — not by the order a curriculum rehearses them. Say which you ruled
 *   out and how. FOUR TOOLS, FOUR BLIND SPOTS. Run static analysis, symbolic execution, fuzzing
 *   and a prover over the same code. For each, state what it could not see. Reporting only what
 *   they found is the mistake this exercise exists to prevent. INVARIANT SUITE. Write a
 *   handler-based campaign that reaches accounting states unit tests do not. Report what it
 *   found, or report that it found nothing and what that does and does not tell you. FINDINGS.
 *   Each with a severity, an exploitability difficulty, a named exploit scenario, and a runnable
 *   proof of concept. Severity uses impact first. If you have no high-severity findings, say so
 *   plainly — a report that inflates a low into a high to look productive is the failure mode
 *   here. ONE FORMAL REPORT. Read a published formal-verification report for a different project
 *   and summarise its assumptions and its summaries, not its checkmarks. One page. CONTEST
 *   ARITHMETIC. Finally: if this had been a contest, state which of your findings would have
 *   been duplicated, which would have been invalidated by scope or known-issues rules, and what
 *   the payout arithmetic would actually have produced.
 */
contract AuditTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// The nine-category maturity score is dated before the business-logic read, and the report
    /// says how it redirected the audit
    function test_criterion01_theNineCategoryMaturityScoreIsDatedBeforeThe() public {
        fail(
            "The nine-category maturity score is dated before the business-logic read, and the report says how it redirected the audit"
        );
    }

    /// A trust-boundary diagram and table state, for every crossing, what an attacker controls
    function test_criterion02_aTrustBoundaryDiagramAndTableStateForEvery() public {
        fail("A trust-boundary diagram and table state, for every crossing, what an attacker controls");
    }

    /// Vulnerability classes are ranked by money at risk in this codebase, with ruled-out classes
    /// named and the method for ruling them out stated
    function test_criterion03_vulnerabilityClassesAreRankedByMoneyAtRiskIn() public {
        fail(
            "Vulnerability classes are ranked by money at risk in this codebase, with ruled-out classes named and the method for ruling them out stated"
        );
    }

    /// All four tool categories were run, and each has a stated blind spot rather than only a
    /// result
    function test_criterion04_allFourToolCategoriesWereRunAndEachHas() public {
        fail("All four tool categories were run, and each has a stated blind spot rather than only a result");
    }

    /// A handler-based invariant campaign runs against the target with its revert rate reported
    function test_criterion05_aHandlerBasedInvariantCampaignRunsAgainstTheTarget() public {
        fail("A handler-based invariant campaign runs against the target with its revert rate reported");
    }

    /// Every finding has a severity, an exploitability difficulty, a named exploit scenario, and a
    /// proof of concept that runs
    function test_criterion06_everyFindingHasASeverityAnExploitabilityDifficultyA() public {
        fail(
            "Every finding has a severity, an exploitability difficulty, a named exploit scenario, and a proof of concept that runs"
        );
    }

    /// Severity is assigned impact-first, and any finding below high says so rather than being
    /// inflated
    function test_criterion07_severityIsAssignedImpactFirstAndAnyFindingBelow() public {
        fail("Severity is assigned impact-first, and any finding below high says so rather than being inflated");
    }

    /// A one-page summary of a published formal-verification report covers its assumptions and
    /// summaries, not its checkmarks
    function test_criterion08_aOnePageSummaryOfAPublishedFormalVerification() public {
        fail(
            "A one-page summary of a published formal-verification report covers its assumptions and summaries, not its checkmarks"
        );
    }

    /// The contest arithmetic names likely duplicates, likely rule-based invalidations, and a
    /// payout figure
    function test_criterion09_theContestArithmeticNamesLikelyDuplicatesLikelyRuleBased() public {
        fail("The contest arithmetic names likely duplicates, likely rule-based invalidations, and a payout figure");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
