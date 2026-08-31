// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-calls-delegatecall-capstone-the-context-table  (break, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/capstone/CallContext.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build a small proxied system, derive the full context table from it by running code rather
 *   than by reading a doc, and then exploit the row that matters. THE TABLE. For CALL,
 *   DELEGATECALL and STATICCALL, and for each of `address(this)`, `msg.sender`, `msg.value` and
 *   whose storage is written: predict every cell in a comment, then assert it. Twelve cells,
 *   twelve predictions written before the run. CALL TO NOTHING. Show that a delegatecall to an
 *   address with no code succeeds and returns true. Then write the check that would have caught
 *   it, and say why that check is now unreliable under EIP-7702. THIS.F() IS NOT FREE.
 *   Demonstrate that `this.f()` is an external call: show the context difference and the gas
 *   difference against calling `f()` directly. STATICCALL ENFORCES. Show that `view` is not what
 *   makes a view function safe by making a `view` function attempt a state change and observing
 *   where it fails — and then show the same code succeeding when not reached through a
 *   staticcall. THE BOOLEAN AND THE BYTES. Make a low-level call fail and ignore the boolean, so
 *   the caller proceeds as if it succeeded. Then bubble the revert properly and show the
 *   difference in what the caller learns. Then send a returndata bomb and show what naive
 *   returndata copying costs — with a number. THE DRAIN. Finally: overwrite the proxy's
 *   implementation pointer from a function that was never meant to touch it, using nothing but
 *   slot arithmetic, and take control. A comment names the slot and says how the collision arose
 *   from the two contracts' layouts. THE GUARD THAT IS NOT ONE. Add a `tx.origin` check
 *   somewhere and show it does not mean what it looks like it means.
 */
contract CallContextTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// All twelve cells of the context table are predicted in comments before being asserted
    function test_criterion01_allTwelveCellsOfTheContextTableArePredicted() public {
        fail("All twelve cells of the context table are predicted in comments before being asserted");
    }

    /// A delegatecall to a codeless address returns true, and the check that would catch it is
    /// written with a note on why EIP-7702 makes it unreliable
    function test_criterion02_aDelegatecallToACodelessAddressReturnsTrueAnd() public {
        fail("A delegatecall to a codeless address returns true, and the check that would catch it is written with a note on why EIP-7702 makes it unreliable");
    }

    /// this.f() is shown to differ from f() in both context and gas, with the gas difference
    /// reported
    function test_criterion03_thisFIsShownToDifferFromFIn() public {
        fail("this.f() is shown to differ from f() in both context and gas, with the gas difference reported");
    }

    /// A view function's state change is shown failing under staticcall and succeeding when not
    /// reached through one
    function test_criterion04_aViewFunctionSStateChangeIsShownFailing() public {
        fail("A view function's state change is shown failing under staticcall and succeeding when not reached through one");
    }

    /// An ignored low-level-call boolean lets the caller proceed after a failure, and proper revert
    /// bubbling is contrasted with it
    function test_criterion05_anIgnoredLowLevelCallBooleanLetsTheCaller() public {
        fail("An ignored low-level-call boolean lets the caller proceed after a failure, and proper revert bubbling is contrasted with it");
    }

    /// A returndata bomb's cost to a naive caller is measured as a number
    function test_criterion06_aReturndataBombSCostToANaiveCaller() public {
        fail("A returndata bomb's cost to a naive caller is measured as a number");
    }

    /// The implementation pointer is overwritten from an unrelated setter, with the colliding slot
    /// and its origin named in a comment
    function test_criterion07_theImplementationPointerIsOverwrittenFromAnUnrelatedSetter() public {
        fail("The implementation pointer is overwritten from an unrelated setter, with the colliding slot and its origin named in a comment");
    }

    /// A tx.origin check is shown not to mean what it appears to mean
    function test_criterion08_aTxOriginCheckIsShownNotToMean() public {
        fail("A tx.origin check is shown not to mean what it appears to mean");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
