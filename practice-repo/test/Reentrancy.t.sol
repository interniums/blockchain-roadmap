// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {Reentrancy} from "../src/solidity-contract-patterns/Reentrancy.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-contract-patterns-reentrancy-then-cei  (break, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/Reentrancy.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write a VulnerableBank whose withdraw sends ETH before zeroing the balance, and an attacker
 *   whose receive() re-enters it. Prove the drain. Reorder to Checks-Effects-Interactions and
 *   prove the same attack fails. Then extend to read-only reentrancy: add a second contract that
 *   prices something from bank.totalAssets(), have the attacker query it from inside the
 *   callback, and show that the CEI-fixed and nonReentrant-guarded bank still hands the observer
 *   a wrong number. Finish by benchmarking no guard, ReentrancyGuard and
 *   ReentrancyGuardTransient on the same function.
 */
contract ReentrancyTest is Test {
    /// The subject, from src/solidity-contract-patterns/Reentrancy.sol. Add functions there and call them here.
    Reentrancy internal subject;

    function setUp() public {
        subject = new Reentrancy();
    }

    /// A test proves the attacker's ending balance exceeds its deposit against the vulnerable
    /// version and does not against the CEI version
    function test_criterion01_aTestProvesTheAttackerSEndingBalanceExceeds() public {
        fail(
            "A test proves the attacker's ending balance exceeds its deposit against the vulnerable version and does not against the CEI version"
        );
    }

    /// A test proves the observer contract reads an incorrect price during the callback even with
    /// CEI and nonReentrant both applied
    function test_criterion02_aTestProvesTheObserverContractReadsAnIncorrect() public {
        fail(
            "A test proves the observer contract reads an incorrect price during the callback even with CEI and nonReentrant both applied"
        );
    }

    /// Measured guard overheads are recorded for all three variants with the solc version and
    /// optimizer setting stated
    function test_criterion03_measuredGuardOverheadsAreRecordedForAllThreeVariants() public {
        fail(
            "Measured guard overheads are recorded for all three variants with the solc version and optimizer setting stated"
        );
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
