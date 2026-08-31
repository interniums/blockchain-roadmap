// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-liquidations-rate-oracle-hard-liquidation  (break, grain block, difficulty 4)
 * Run:      forge test --match-path test/RateOracleAttack.t.sol -vv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Reproduce the shape of the March 2026 LlamaLend sDOLA incident locally. Build an
 *   ERC-4626-style savings vault whose share-to-asset conversion rate is used directly as a
 *   lending oracle by a minimal borrow market. Give the vault an unpermissioned entry point — a
 *   stake or a direct donation of assets — that any caller may use and that moves the conversion
 *   rate within a single transaction. Then write a test that makes a healthy borrower
 *   hard-liquidatable inside one block using only unpermissioned calls, and quantify the
 *   attacker's profit against their cost. Finally implement a defence — a rate-limited or
 *   checkpointed exchange rate that can move only a bounded amount per unit time — and show the
 *   same attack test now fails.
 */
contract RateOracleAttackTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test moves the vault's conversion rate in one transaction using only calls any address may
    /// make
    function test_criterion01_aTestMovesTheVaultSConversionRateIn() public {
        fail("A test moves the vault's conversion rate in one transaction using only calls any address may make");
    }

    /// The same test asserts a previously healthy position becomes hard-liquidatable in that block
    /// and reports the attacker's net profit
    function test_criterion02_theSameTestAssertsAPreviouslyHealthyPositionBecomes() public {
        fail("The same test asserts a previously healthy position becomes hard-liquidatable in that block and reports the attacker's net profit");
    }

    /// After swapping in the rate-limited oracle, the attack test fails and a separate test asserts
    /// the exact bound the limiter enforces
    function test_criterion03_afterSwappingInTheRateLimitedOracleTheAttack() public {
        fail("After swapping in the rate-limited oracle, the attack test fails and a separate test asserts the exact bound the limiter enforces");
    }

    /// A test demonstrates the cost of the defence — a genuine large rate move is reported late by
    /// the limiter, and the test quantifies the lag
    function test_criterion04_aTestDemonstratesTheCostOfTheDefenceA() public {
        fail(unicode"A test demonstrates the cost of the defence — a genuine large rate move is reported late by the limiter, and the test quantifies the lag");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
