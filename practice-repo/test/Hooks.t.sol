// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-hooks-owing-the-pool  (implement, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/Hooks.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Two structural changes that alter what integrating with a pool means. NO DEPLOYMENT. Create
 *   a new pool and show that nothing was deployed: report the address you interact with, before
 *   and after, and show it unchanged. Then state what that does to two things — the gas cost of
 *   creating a pool, and the way you would index pools in a product. Report the creation cost,
 *   and say what an indexer keyed on contract addresses would now miss. OWE, DO NOT PAY.
 *   Implement a sequence that takes tokens out, does something, and settles at the end rather
 *   than paying per step. Show the intermediate state: a point at which you hold tokens you have
 *   not paid for, with the accounting recording a debt. Then fail to settle and show what
 *   happens. Then use it for something that was previously impossible or expensive: chain two
 *   swaps and a liquidity operation with a single net settlement, and compare the token transfer
 *   count against the same sequence done pay-as-you-go. Report both counts and the gas
 *   difference. Close with the risk this introduces: state what an integrator must now check
 *   that it did not have to before, given that the balance changes it observes mid-sequence do
 *   not mean what they used to.
 */
contract HooksTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A new pool is created with the interaction address shown unchanged before and after
    function test_criterion01_aNewPoolIsCreatedWithTheInteractionAddress() public {
        fail("A new pool is created with the interaction address shown unchanged before and after");
    }

    /// Pool creation cost is reported
    function test_criterion02_poolCreationCostIsReported() public {
        fail("Pool creation cost is reported");
    }

    /// What an address-keyed indexer would miss is stated
    function test_criterion03_whatAnAddressKeyedIndexerWouldMissIsStated() public {
        fail("What an address-keyed indexer would miss is stated");
    }

    /// A sequence holds tokens it has not paid for, with the debt visible in the accounting
    function test_criterion04_aSequenceHoldsTokensItHasNotPaidFor() public {
        fail("A sequence holds tokens it has not paid for, with the debt visible in the accounting");
    }

    /// Failing to settle is shown with its outcome
    function test_criterion05_failingToSettleIsShownWithItsOutcome() public {
        fail("Failing to settle is shown with its outcome");
    }

    /// Two swaps and a liquidity operation are chained with one net settlement
    function test_criterion06_twoSwapsAndALiquidityOperationAreChainedWith() public {
        fail("Two swaps and a liquidity operation are chained with one net settlement");
    }

    /// Transfer counts and gas are compared against the pay-as-you-go equivalent
    function test_criterion07_transferCountsAndGasAreComparedAgainstThePay() public {
        fail("Transfer counts and gas are compared against the pay-as-you-go equivalent");
    }

    /// What an integrator must now check, given mid-sequence balances have changed meaning, is
    /// stated
    function test_criterion08_whatAnIntegratorMustNowCheckGivenMidSequence() public {
        fail("What an integrator must now check, given mid-sequence balances have changed meaning, is stated");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
