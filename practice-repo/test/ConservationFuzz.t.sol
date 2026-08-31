// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-fuzzing-conservation-property  (implement, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/ConservationFuzz.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Take a minimal ERC-20-like token and fuzz `transfer(address to, uint256 amount)` for the
 *   property that the sum of the sender's and recipient's balances is unchanged. Exclude only
 *   what genuinely must be excluded with assume — address(0), the token itself, the test
 *   contract, and the cheatcode address 0x7109709ECfa91a80626fF3989D68f67F5b1DD12D — and bound
 *   the amount rather than assuming it. Then introduce a deliberate rounding bug, such as a fee
 *   that truncates, and show the fuzzer producing a concrete counterexample. Promote those exact
 *   arguments into a named `test_` case, fix the bug, and confirm both the named case and the
 *   campaign pass. Finally, tighten the bounds until the same bug stops being found, and write
 *   down the bound that hid it.
 */
contract ConservationFuzzTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// The conservation property passes on the correct implementation at the configured run count
    function test_criterion01_theConservationPropertyPassesOnTheCorrectImplementationAt() public {
        fail("The conservation property passes on the correct implementation at the configured run count");
    }

    /// The property fails on the seeded rounding bug and the failure output names concrete
    /// arguments
    function test_criterion02_thePropertyFailsOnTheSeededRoundingBugAnd() public {
        fail("The property fails on the seeded rounding bug and the failure output names concrete arguments");
    }

    /// A named unit test carrying those exact arguments fails on the buggy implementation and
    /// passes on the fixed one
    function test_criterion03_aNamedUnitTestCarryingThoseExactArgumentsFails() public {
        fail("A named unit test carrying those exact arguments fails on the buggy implementation and passes on the fixed one");
    }

    /// A commented-out or clearly labelled over-tight bound is included, with a note stating which
    /// bug it conceals and why
    function test_criterion04_aCommentedOutOrClearlyLabelledOverTightBound() public {
        fail("A commented-out or clearly labelled over-tight bound is included, with a note stating which bug it conceals and why");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
