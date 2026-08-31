// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-lending-shared-oracle-breaks-isolation  (break, grain module, difficulty 4)
 * Run:      forge test --match-path test/IsolationBreak.t.sol -vv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build a minimal isolated lending market: one collateral token, one loan token, a pluggable
 *   oracle, a fixed liquidation LTV, and a liquidate function that repays debt and seizes
 *   collateral at an incentive. Deploy two instances that share the same collateral token but
 *   read different oracles, one of which lags or can be moved. Write a test showing an attacker
 *   profitably borrowing against the market with the more favourable oracle and leaving that
 *   market with bad debt, while the other market's suppliers are untouched in accounting terms
 *   and yet exposed through the shared collateral they hold. Then add a supply cap to the
 *   affected market and measure exactly how much the loss is reduced.
 */
contract IsolationBreakTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test drives one market's oracle until a position is under water past the incentive and
    /// asserts a rational liquidator declines, leaving quantified bad debt
    function test_criterion01_aTestDrivesOneMarketSOracleUntilA() public {
        fail("A test drives one market's oracle until a position is under water past the incentive and asserts a rational liquidator declines, leaving quantified bad debt");
    }

    /// A test asserts the loss lands only on the affected market's suppliers, demonstrating
    /// accounting isolation
    function test_criterion02_aTestAssertsTheLossLandsOnlyOnThe() public {
        fail("A test asserts the loss lands only on the affected market's suppliers, demonstrating accounting isolation");
    }

    /// A second test shows an attacker exploiting the divergence between the two markets' oracles
    /// for net profit
    function test_criterion03_aSecondTestShowsAnAttackerExploitingTheDivergence() public {
        fail("A second test shows an attacker exploiting the divergence between the two markets' oracles for net profit");
    }

    /// Adding a supply cap reduces the realised loss, and the test asserts the new loss equals the
    /// cap times the price gap rather than merely being smaller
    function test_criterion04_addingASupplyCapReducesTheRealisedLossAnd() public {
        fail("Adding a supply cap reduces the realised loss, and the test asserts the new loss equals the cap times the price gap rather than merely being smaller");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
