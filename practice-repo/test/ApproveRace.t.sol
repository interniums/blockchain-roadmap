// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-token-standards-the-allowance-and-the-race  (break, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/ApproveRace.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   A token is a mapping in someone else's contract, and an allowance is a second mapping that a
 *   great deal of received wisdom is built on. Test the wisdom. THE LEDGER. Demonstrate that
 *   your balance is a row in a contract you do not control: change a token's balance mapping
 *   directly in a test and show the "your" balance follow. State what that means for any code
 *   treating a token balance as an asset it holds. THE RACE. Execute it. Set an allowance, then
 *   have the spender front-run a change to that allowance and extract both the old and the new
 *   amount. Report the total taken and show it exceeding either individual approval. THE
 *   MITIGATIONS. Implement two: approve-to-zero-first, and an increase/decrease pair. For each,
 *   show it preventing your attack, and then state what it costs — in transactions, in gas, and
 *   in what happens if the first of two transactions lands and the second does not. THE HONEST
 *   CONCLUSION. Now argue against the exercise. The race requires the spender to already be
 *   approved and hostile. State what an already-approved hostile spender can do anyway without
 *   the race, and then answer the question this module actually asks: is the approve race where
 *   the money goes? Support the answer with what the alternative failure would cost.
 */
contract ApproveRaceTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A token balance is changed by writing the token's mapping directly, with the consequence for
    /// treating a balance as a held asset stated
    function test_criterion01_aTokenBalanceIsChangedByWritingTheToken() public {
        fail("A token balance is changed by writing the token's mapping directly, with the consequence for treating a balance as a held asset stated");
    }

    /// The approve race is executed with the total extracted exceeding either individual approval
    function test_criterion02_theApproveRaceIsExecutedWithTheTotalExtracted() public {
        fail("The approve race is executed with the total extracted exceeding either individual approval");
    }

    /// Approve-to-zero-first and increase/decrease are both implemented and shown preventing the
    /// attack
    function test_criterion03_approveToZeroFirstAndIncreaseDecreaseAreBoth() public {
        fail("Approve-to-zero-first and increase/decrease are both implemented and shown preventing the attack");
    }

    /// Each mitigation's cost is stated in transactions, gas, and the partial-failure case
    function test_criterion04_eachMitigationSCostIsStatedInTransactionsGas() public {
        fail("Each mitigation's cost is stated in transactions, gas, and the partial-failure case");
    }

    /// What an already-approved hostile spender can do without the race is stated
    function test_criterion05_whatAnAlreadyApprovedHostileSpenderCanDoWithout() public {
        fail("What an already-approved hostile spender can do without the race is stated");
    }

    /// A supported answer to whether the approve race is where the money goes
    function test_criterion06_aSupportedAnswerToWhetherTheApproveRaceIs() public {
        fail("A supported answer to whether the approve race is where the money goes");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
