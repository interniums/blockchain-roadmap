// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {GasPriceList} from "../../src/evm-gas-fee-market/GasPriceList.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-gas-fee-market-capstone-a-price-list-you-measured  (measure, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/capstone/GasPriceList.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Produce a gas price list for the current fork, every number measured on your machine rather
 *   than copied, and then find at least one widely circulated figure that your measurement
 *   contradicts. INTRINSIC. Measure the fixed charge before any opcode runs, for a plain
 *   transfer, a call with calldata, and a contract creation. Separate the base cost from the
 *   calldata cost and show the calldata floor applying — construct one transaction where the
 *   floor binds and one where it does not, and state the byte pattern that makes the difference.
 *   COLD AND WARM. Measure the cold and warm cost of an account access and a storage read,
 *   independently. This is where the dead-code trap lives: prove your measurement is not being
 *   optimised away, by showing the same harness produces a different number when you defeat the
 *   optimiser and by saying which number is the real one. SSTORE. Measure all the dynamic cases:
 *   zero to non-zero, non-zero to different non-zero, non-zero to zero and the refund, and the
 *   same slot written twice in one transaction. Report each separately; a single "SSTORE costs"
 *   number is the mistake. ACCESS LISTS. Find the break-even for your own workload: the number
 *   of distinct accesses at which paying for the list starts to win. State it as a number, and
 *   show the two measurements either side of it. THE CEILINGS. Demonstrate both 2025–2026
 *   ceilings binding. For the per-transaction cap, construct a transaction that would have been
 *   valid before it and is not now. For the gas-limit-versus-used distinction, show a case where
 *   the two differ enough to matter to a caller. THE CONTRADICTION. Finally, name one figure in
 *   circulation — a docs table, a blog post, a cheat sheet — that your measurements show is
 *   wrong or out of date. Quote it, quote yours, and say why they differ.
 */
contract GasPriceListTest is Test {
    /// The subject, from src/evm-gas-fee-market/GasPriceList.sol. Add functions there and call them here.
    GasPriceList internal subject;

    function setUp() public {
        subject = new GasPriceList();
    }

    /// Intrinsic gas is measured separately for a transfer, a call with calldata and a creation,
    /// with base and calldata costs split
    function test_criterion01_intrinsicGasIsMeasuredSeparatelyForATransferA() public {
        fail(
            "Intrinsic gas is measured separately for a transfer, a call with calldata and a creation, with base and calldata costs split"
        );
    }

    /// One transaction where the calldata floor binds and one where it does not, with the byte
    /// pattern responsible named
    function test_criterion02_oneTransactionWhereTheCalldataFloorBindsAndOne() public {
        fail(
            "One transaction where the calldata floor binds and one where it does not, with the byte pattern responsible named"
        );
    }

    /// Cold and warm costs are measured independently for account access and storage read
    function test_criterion03_coldAndWarmCostsAreMeasuredIndependentlyForAccount() public {
        fail("Cold and warm costs are measured independently for account access and storage read");
    }

    /// The dead-code trap is demonstrated: the same harness yields a different number with the
    /// optimiser defeated, and the report says which is real
    function test_criterion04_theDeadCodeTrapIsDemonstratedTheSameHarness() public {
        fail(
            "The dead-code trap is demonstrated: the same harness yields a different number with the optimiser defeated, and the report says which is real"
        );
    }

    /// All four SSTORE dynamic cases are reported separately, including the refund and the
    /// same-slot-twice case
    function test_criterion05_allFourSstoreDynamicCasesAreReportedSeparatelyIncluding() public {
        fail("All four SSTORE dynamic cases are reported separately, including the refund and the same-slot-twice case");
    }

    /// An access-list break-even is stated as a number with measurements either side of it
    function test_criterion06_anAccessListBreakEvenIsStatedAsA() public {
        fail("An access-list break-even is stated as a number with measurements either side of it");
    }

    /// A transaction valid before the per-transaction gas cap and invalid after it is constructed
    function test_criterion07_aTransactionValidBeforeThePerTransactionGasCap() public {
        fail("A transaction valid before the per-transaction gas cap and invalid after it is constructed");
    }

    /// A case where gas limit and gas used differ enough to matter to a caller is shown
    function test_criterion08_aCaseWhereGasLimitAndGasUsedDiffer() public {
        fail("A case where gas limit and gas used differ enough to matter to a caller is shown");
    }

    /// One circulating figure is quoted alongside your contradicting measurement, with the
    /// discrepancy explained
    function test_criterion09_oneCirculatingFigureIsQuotedAlongsideYourContradictingMeasurement() public {
        fail(
            "One circulating figure is quoted alongside your contradicting measurement, with the discrepancy explained"
        );
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
