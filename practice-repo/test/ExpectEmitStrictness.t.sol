// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-unit-testing-decoy-emitter  (implement, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/ExpectEmitStrictness.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write two tests of the same ERC-20 transfer. The first uses `vm.expectEmit(true, true, true,
 *   true)` without pinning the emitter. The second uses the overload that takes the emitting
 *   address. Then deploy a decoy contract that emits a byte-identical `Transfer` event with the
 *   same indexed values, arrange for the decoy to emit during the call under test, and show that
 *   the first assertion is satisfied by the decoy while the second is not. Add a third test that
 *   registers two expectations in the wrong relative order and observe the failure, so you have
 *   seen ordering enforced as well as emitter blindness.
 */
contract ExpectEmitStrictnessTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test passes while the real token never emits, because the decoy's identical event
    /// satisfied an unpinned expectation
    function test_criterion01_aTestPassesWhileTheRealTokenNeverEmits() public {
        fail("A test passes while the real token never emits, because the decoy's identical event satisfied an unpinned expectation");
    }

    /// The equivalent test using the address overload fails against the decoy and passes against
    /// the token
    function test_criterion02_theEquivalentTestUsingTheAddressOverloadFailsAgainst() public {
        fail("The equivalent test using the address overload fails against the decoy and passes against the token");
    }

    /// A test demonstrates that two expectations registered in reverse order fail, and the same two
    /// in actual order pass
    function test_criterion03_aTestDemonstratesThatTwoExpectationsRegisteredInReverse() public {
        fail("A test demonstrates that two expectations registered in reverse order fail, and the same two in actual order pass");
    }

    /// Comments state which of topic0, topics 1-3, the data body and the emitter each assertion is
    /// checking
    function test_criterion04_commentsStateWhichOfTopic0Topics13The() public {
        fail("Comments state which of topic0, topics 1-3, the data body and the emitter each assertion is checking");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
