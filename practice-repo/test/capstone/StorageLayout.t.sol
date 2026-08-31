// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {StorageLayout} from "../../src/solidity-storage-layout/StorageLayout.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-storage-layout-capstone-derive-every-slot  (implement, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/capstone/StorageLayout.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Take a deployed mainnet contract with at least twelve state variables including a mapping, a
 *   dynamic array, a struct and a packed group. Produce a complete slot map, derived by hand and
 *   then proved against the chain. THE MAP. For every state variable: slot number, byte offset
 *   within the slot, and width. Include the packed group and show which variables share a slot
 *   and why the one after them does not. State the rule that ends a slot. PROVE IT. For each
 *   entry, read the value from the live chain at the slot and offset you computed and assert it
 *   matches what the contract's own getter returns. A getter that does not exist is not an
 *   excuse — read the slot and decode it. THE DERIVED ONES. Compute, by hand, the slot of one
 *   mapping entry and one dynamic array element, including a nested mapping and an array inside
 *   a struct. Show the hash inputs for each. Then prove each against the chain. THE GAP. Find a
 *   place in the layout where the compiler left part of a slot unused, and say what declaration
 *   change would have filled it. Then show — measured, not asserted — what that change would
 *   have saved on a function that writes those variables together. REORDER IT. Produce a
 *   reordered version of the same declarations that is strictly cheaper for one named operation
 *   and strictly more expensive for another. Report both numbers. If you cannot make something
 *   worse, you have not found a real trade. TRANSIENT. Finally, add a transient variable and
 *   show that its layout is a separate address space: same slot number, different value, and
 *   gone at the end of the transaction.
 */
contract StorageLayoutTest is Test {
    /// The subject, from src/solidity-storage-layout/StorageLayout.sol. Add functions there and call them here.
    StorageLayout internal subject;

    function setUp() public {
        subject = new StorageLayout();
    }

    /// Every state variable of a real deployed contract has a slot, byte offset and width, derived
    /// by hand
    function test_criterion01_everyStateVariableOfARealDeployedContractHas() public {
        fail("Every state variable of a real deployed contract has a slot, byte offset and width, derived by hand");
    }

    /// The rule that ends a packed slot is stated and demonstrated on the contract's own layout
    function test_criterion02_theRuleThatEndsAPackedSlotIsStated() public {
        fail("The rule that ends a packed slot is stated and demonstrated on the contract's own layout");
    }

    /// Each map entry is verified by reading the live chain at the computed slot and offset
    function test_criterion03_eachMapEntryIsVerifiedByReadingTheLive() public {
        fail("Each map entry is verified by reading the live chain at the computed slot and offset");
    }

    /// A mapping entry, a nested mapping entry and a dynamic array element are each derived by hand
    /// with their hash inputs shown, then proven against the chain
    function test_criterion04_aMappingEntryANestedMappingEntryAndA() public {
        fail(
            "A mapping entry, a nested mapping entry and a dynamic array element are each derived by hand with their hash inputs shown, then proven against the chain"
        );
    }

    /// An unused portion of a slot is identified with the declaration change that would fill it
    function test_criterion05_anUnusedPortionOfASlotIsIdentifiedWith() public {
        fail("An unused portion of a slot is identified with the declaration change that would fill it");
    }

    /// The saving from that change is measured on a function that writes the variables together
    function test_criterion06_theSavingFromThatChangeIsMeasuredOnA() public {
        fail("The saving from that change is measured on a function that writes the variables together");
    }

    /// A reordered layout is strictly cheaper for one named operation and strictly more expensive
    /// for another, with both numbers reported
    function test_criterion07_aReorderedLayoutIsStrictlyCheaperForOneNamed() public {
        fail(
            "A reordered layout is strictly cheaper for one named operation and strictly more expensive for another, with both numbers reported"
        );
    }

    /// A transient variable is shown to occupy a separate address space from storage at the same
    /// slot number, and to be gone after the transaction
    function test_criterion08_aTransientVariableIsShownToOccupyASeparate() public {
        fail(
            "A transient variable is shown to occupy a separate address space from storage at the same slot number, and to be gone after the transaction"
        );
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
