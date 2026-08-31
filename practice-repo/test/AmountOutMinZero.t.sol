// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-mev-zero-min-out  (break, grain block, difficulty 3)
 * Run:      forge test --match-path test/AmountOutMinZero.t.sol -vv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Deploy a naive DEX router that forwards a user's swap with amountOutMin set to zero and no
 *   deadline. Write a Foundry test that sandwiches a user of that router and takes an
 *   arbitrarily large share of their trade — parameterise the attack so the test can assert that
 *   increasing the attacker's capital increases the extraction without bound up to the pool's
 *   depth. Then write a fixed router that computes a minimum output from a price obtained
 *   independently of the pool it is about to trade against, and enforces a deadline. Show the
 *   same attack against the fixed router is unprofitable, and state precisely what the fixed
 *   router now trusts that the broken one did not.
 */
contract AmountOutMinZeroTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test sandwiches the naive router and asserts the victim receives less than a stated
    /// fraction of the fair-price output
    function test_criterion01_aTestSandwichesTheNaiveRouterAndAssertsThe() public {
        fail("A test sandwiches the naive router and asserts the victim receives less than a stated fraction of the fair-price output");
    }

    /// A parameterised test shows extraction rising with attacker capital, demonstrating the
    /// absence of any bound
    function test_criterion02_aParameterisedTestShowsExtractionRisingWithAttackerCapital() public {
        fail("A parameterised test shows extraction rising with attacker capital, demonstrating the absence of any bound");
    }

    /// The same attack against the fixed router either reverts or leaves the attacker net-negative
    /// after gas
    function test_criterion03_theSameAttackAgainstTheFixedRouterEitherReverts() public {
        fail("The same attack against the fixed router either reverts or leaves the attacker net-negative after gas");
    }

    /// A test asserts the fixed router reverts on a stale deadline, and the repository states in
    /// one sentence what the minimum-output source is now trusted to provide
    function test_criterion04_aTestAssertsTheFixedRouterRevertsOnA() public {
        fail("A test asserts the fixed router reverts on a stale deadline, and the repository states in one sentence what the minimum-output source is now trusted to provide");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
