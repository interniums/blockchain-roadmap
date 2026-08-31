// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-blocks-three-roots-and-a-window  (implement, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/ReceiptProof.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   A header commits to three separate tries, and each one lets you prove a different thing to
 *   someone who has only the header. Build the proof for one of them. THE PROOF. For a real
 *   block, take one transaction receipt and construct a Merkle proof of it against the header's
 *   receipts root. Verify it with only the header and the proof — no node, no RPC. Then corrupt
 *   one byte of the receipt and show verification fail. THREE ROOTS, THREE JOBS. State what each
 *   of the three roots commits to, and demonstrate the key difference: the state root is keyed
 *   by account and is an output of execution, while the transactions and receipts roots are
 *   keyed by index. Show one consequence of index-keying that account-keying does not have. THE
 *   BLOOM. Use the block's logs bloom to test for an event that is present and one that is not.
 *   Then show the property that makes it a filter and not an index: construct a query the bloom
 *   says might match and the block does not actually contain. State what a client must do next,
 *   and what that means for anyone treating the bloom as an answer. THE WINDOW. Finally, read
 *   the parent beacon block root from inside a contract and say what having it makes possible
 *   that was not possible before it existed.
 */
contract ReceiptProofTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A real receipt is proven against a real header's receipts root using only the header and the
    /// proof
    function test_criterion01_aRealReceiptIsProvenAgainstARealHeader() public {
        fail("A real receipt is proven against a real header's receipts root using only the header and the proof");
    }

    /// Corrupting one byte of the receipt causes verification to fail
    function test_criterion02_corruptingOneByteOfTheReceiptCausesVerificationTo() public {
        fail("Corrupting one byte of the receipt causes verification to fail");
    }

    /// All three roots are described by what they commit to, with state-root keying contrasted
    /// against index-keying
    function test_criterion03_allThreeRootsAreDescribedByWhatTheyCommit() public {
        fail("All three roots are described by what they commit to, with state-root keying contrasted against index-keying");
    }

    /// One consequence of index-keying that account-keying lacks is demonstrated
    function test_criterion04_oneConsequenceOfIndexKeyingThatAccountKeyingLacks() public {
        fail("One consequence of index-keying that account-keying lacks is demonstrated");
    }

    /// The bloom is queried for a present and an absent event
    function test_criterion05_theBloomIsQueriedForAPresentAndAn() public {
        fail("The bloom is queried for a present and an absent event");
    }

    /// A false-positive bloom query is constructed, with what the client must do next and the
    /// consequence for treating the bloom as an answer
    function test_criterion06_aFalsePositiveBloomQueryIsConstructedWithWhat() public {
        fail("A false-positive bloom query is constructed, with what the client must do next and the consequence for treating the bloom as an answer");
    }

    /// The parent beacon block root is read from a contract, with one capability it enables stated
    function test_criterion07_theParentBeaconBlockRootIsReadFromA() public {
        fail("The parent beacon block root is read from a contract, with one capability it enables stated");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
