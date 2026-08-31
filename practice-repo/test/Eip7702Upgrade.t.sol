// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-eoa-upgrade-delegate-and-clear  (implement, grain module, difficulty 4)
 * Run:      forge test --match-path test/Eip7702Upgrade.t.sol && pnpm vitest run test/sign-authorization.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   On Anvil, take a funded EOA and delegate it to a minimal batch-executor contract using
 *   viem's `signAuthorization` and a type-0x4 transaction carrying an `authorizationList`. Do it
 *   twice: once with a separate sponsor account paying for the transaction, and once with the
 *   authorizing account submitting its own upgrade - getting the nonce right in each case. Then
 *   execute a two-call batch through the delegated account. Finally, clear the delegation with
 *   an authorization pointing at the zero address and prove the account's code is empty again.
 */
contract Eip7702UpgradeTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// After the sponsored upgrade the account's code is the delegation designator naming the
    /// executor, and the sponsor paid the gas
    function test_criterion01_afterTheSponsoredUpgradeTheAccountSCodeIs() public {
        fail("After the sponsored upgrade the account's code is the delegation designator naming the executor, and the sponsor paid the gas");
    }

    /// The self-submitted upgrade succeeds, and the test documents which nonce value the
    /// authorization had to use and why it differs from the sponsored case
    function test_criterion02_theSelfSubmittedUpgradeSucceedsAndTheTestDocuments() public {
        fail("The self-submitted upgrade succeeds, and the test documents which nonce value the authorization had to use and why it differs from the sponsored case");
    }

    /// After clearing, the account's code length is zero and the batch call reverts
    function test_criterion03_afterClearingTheAccountSCodeLengthIsZero() public {
        fail("After clearing, the account's code length is zero and the batch call reverts");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
