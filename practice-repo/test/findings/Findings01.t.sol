// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: security-audit-craft-full-report  (write, grain module, difficulty 4)
 * Run:      bash -c 'set -e; forge test --junit --match-path "test/findings/*.t.sol"; f=docs/audit-report.md; grep -qF "## Scope" "$f"; grep -qF "## Findings" "$f"; grep -qF "## Codebase maturity" "$f"; test $(grep -coE "^Severity: " "$f") -ge 3; test $(grep -coE "^Difficulty: " "$f") -eq $(grep -coE "^Severity: " "$f"); test $(grep -coE "^\| *(Arithmetic|Auditing|Authentication|Complexity|Decentralization|Documentation|Transaction|Low-level|Testing)" "$f") -ge 9'
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Take a roughly three-hundred-line contract you did not write and produce a complete report
 *   in docs/audit-report.md. It must open with a scope statement naming the files, the commit
 *   hash and the assumptions granted. Every finding follows the full anatomy - title naming the
 *   defect, severity, difficulty, type, target with file, line range and commit, description,
 *   exploit scenario with a named actor and an ordering, and a recommendation split into a
 *   short-term fix and a long-term change. Every high and medium finding has a runnable Foundry
 *   proof of concept in test/findings. The report closes with a nine-category maturity table
 *   where every rating cites specific evidence in the code.
 */
contract Findings01Test is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Every finding carries both a severity and a difficulty, never a single combined score
    function test_criterion01_everyFindingCarriesBothASeverityAndADifficulty() public {
        fail("Every finding carries both a severity and a difficulty, never a single combined score");
    }

    /// Every high and medium finding has a passing proof-of-concept test that fails on the unfixed
    /// code
    function test_criterion02_everyHighAndMediumFindingHasAPassingProof() public {
        fail("Every high and medium finding has a passing proof-of-concept test that fails on the unfixed code");
    }

    /// Every recommendation is split into short term and long term
    function test_criterion03_everyRecommendationIsSplitIntoShortTermAndLong() public {
        fail("Every recommendation is split into short term and long term");
    }

    /// All nine maturity categories are rated and each rating cites a specific location in the code
    function test_criterion04_allNineMaturityCategoriesAreRatedAndEachRating() public {
        fail("All nine maturity categories are rated and each rating cites a specific location in the code");
    }

    /// Informational and gas observations are in their own section, not in the findings list
    function test_criterion05_informationalAndGasObservationsAreInTheirOwnSection() public {
        fail("Informational and gas observations are in their own section, not in the findings list");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
