// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-token-standards-usdt-integration-break  (break, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/WeirdTokens.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   On a mainnet fork, write a vault that moves tokens with the plain IERC20 interface and
 *   deposit USDT into it. Prove the call reverts, and prove that swapping in SafeERC20 makes the
 *   identical test pass. Then, locally, implement a 2 percent fee-on-transfer mock from the
 *   weird-erc20 catalogue, have three users deposit into a vault that credits the requested
 *   amount, and have them withdraw in sequence. Prove the last withdrawal fails for insufficient
 *   balance, and prove the balance-delta version does not.
 */
contract WeirdTokensTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A forked test asserts the plain IERC20 transfer against USDT reverts and the SafeERC20
    /// version succeeds
    function test_criterion01_aForkedTestAssertsThePlainIerc20TransferAgainst() public {
        fail("A forked test asserts the plain IERC20 transfer against USDT reverts and the SafeERC20 version succeeds");
    }

    /// A test proves the naive vault becomes insolvent after three fee-on-transfer deposits and
    /// that the last withdrawal reverts
    function test_criterion02_aTestProvesTheNaiveVaultBecomesInsolventAfter() public {
        fail("A test proves the naive vault becomes insolvent after three fee-on-transfer deposits and that the last withdrawal reverts");
    }

    /// The balance-delta vault passes the same three-user sequence with every user able to withdraw
    /// what they are owed
    function test_criterion03_theBalanceDeltaVaultPassesTheSameThreeUser() public {
        fail("The balance-delta vault passes the same three-user sequence with every user able to withdraw what they are owed");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
