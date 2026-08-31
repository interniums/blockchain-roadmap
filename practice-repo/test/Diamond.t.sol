// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-language-core-diamond-order-prediction  (implement, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/Diamond.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build four contracts — X, A is X, B is X, C is A, B — where every constructor emits an event
 *   naming itself and every contract overrides foo() to emit and then call super.foo(). Before
 *   running, write your predicted constructor emission order and your predicted foo() resolution
 *   order into a comment at the top of the test file. Then assert both orders in a Foundry test
 *   using vm.recordLogs. Add a second test proving that declaring contract C is B, A produces a
 *   different answer, and a compile-failure note showing that contract C is A, X cannot be
 *   linearised.
 */
contract DiamondTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test asserts the exact constructor emission order and it matches the prediction recorded
    /// in the file
    function test_criterion01_aTestAssertsTheExactConstructorEmissionOrderAnd() public {
        fail("A test asserts the exact constructor emission order and it matches the prediction recorded in the file");
    }

    /// A test asserts the full super.foo() chain order for both C is A, B and C is B, A
    function test_criterion02_aTestAssertsTheFullSuperFooChainOrder() public {
        fail("A test asserts the full super.foo() chain order for both C is A, B and C is B, A");
    }

    /// A comment records why contract C is A, X fails to compile, in terms of linearisation
    function test_criterion03_aCommentRecordsWhyContractCIsAX() public {
        fail("A comment records why contract C is A, X fails to compile, in terms of linearisation");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
