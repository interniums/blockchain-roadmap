// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-accounts-three-layers-of-replay  (break, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/ReplayLayers.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Replay protection is three separate mechanisms, and knowing which one stops what is the
 *   difference between a working integration and a drained one. THREE REPLAYS, THREE OUTCOMES.
 *   Take one signed transaction and attempt to replay it: on the same chain at the same nonce,
 *   on the same chain at a different nonce, and on a different chain with the same nonce. For
 *   each, say which layer rejected it — the nonce, the chain id, or nothing — and show the
 *   rejection. Then find the case that is not protected. Construct a message signed for one
 *   purpose and accepted for another, where no nonce and no chain id is involved because it
 *   never became a transaction. Name what would have prevented it. THE ASYMMETRY. Separately,
 *   show that ETH is not a token: transfer ETH and transfer an ERC-20 to the same recipient and
 *   enumerate every difference in what the receiving code can observe and control. Then
 *   demonstrate empty-account clearing: create an account, empty it, and show what happens to
 *   the record. Close with one sentence naming the thing this account model made cheap that the
 *   UTXO model made expensive, and one naming the reverse.
 */
contract ReplayLayersTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Three replay attempts are made and each attributed to the layer that rejected it, or to
    /// nothing
    function test_criterion01_threeReplayAttemptsAreMadeAndEachAttributedTo() public {
        fail("Three replay attempts are made and each attributed to the layer that rejected it, or to nothing");
    }

    /// An unprotected signed message is accepted for a purpose it was not signed for, with the
    /// prevention named
    function test_criterion02_anUnprotectedSignedMessageIsAcceptedForAPurpose() public {
        fail("An unprotected signed message is accepted for a purpose it was not signed for, with the prevention named");
    }

    /// Every observable difference between receiving ETH and receiving an ERC-20 is enumerated
    function test_criterion03_everyObservableDifferenceBetweenReceivingEthAndReceivingAn() public {
        fail("Every observable difference between receiving ETH and receiving an ERC-20 is enumerated");
    }

    /// Empty-account clearing is demonstrated on an account created and then emptied
    function test_criterion04_emptyAccountClearingIsDemonstratedOnAnAccountCreated() public {
        fail("Empty-account clearing is demonstrated on an account created and then emptied");
    }

    /// One sentence names what the account model made cheap and one what it made expensive, against
    /// UTXO
    function test_criterion05_oneSentenceNamesWhatTheAccountModelMadeCheap() public {
        fail("One sentence names what the account model made cheap and one what it made expensive, against UTXO");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
