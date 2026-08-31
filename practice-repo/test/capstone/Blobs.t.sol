// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {Blobs} from "../../src/evm-blobs-data-lane/Blobs.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-blobs-data-lane-capstone-the-lane-you-cannot-read  (implement, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/capstone/Blobs.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Send a real blob transaction on a testnet and account for the whole life of that data —
 *   including the part where it stops existing. POST IT. Build and send a type-3 transaction
 *   carrying at least one blob you constructed. Compute the KZG commitment yourself and derive
 *   the versioned hash from it, then assert the versioned hash the chain reports equals the one
 *   you computed. If they differ you have the commitment wrong, and the exercise is to find out
 *   how. READ WHAT THE EVM CAN. Write a contract that reads the versioned hash of the blob in
 *   its own transaction, and prove — with a test that fails if you are wrong — that it cannot
 *   read the blob's contents. State in a comment what the 32 bytes it CAN read are actually good
 *   for, with one concrete use. TWO MARKETS. Price the same 100 KiB as calldata and as blob data
 *   at live prices, and plot both fee markets over at least 200 blocks. Show they move
 *   independently — find a block range where one rose while the other fell. Say what that
 *   independence means for a rollup choosing where to put data. AVAILABILITY IS A WINDOW.
 *   Explain, with reference to the sampling scheme, why nobody has to download every blob for
 *   the guarantee to hold — and what the guarantee therefore is, stated as a sentence about time
 *   rather than about storage. Then demonstrate the consequence: retrieve your blob's contents
 *   shortly after posting, and state the date after which that request will fail and what you
 *   would have had to do to still have the data. THROUGHPUT. Given the current target and max
 *   per block, state the sustained bytes per second the lane offers, and what changed most
 *   recently to move that number.
 */
contract BlobsTest is Test {
    /// The subject, from src/evm-blobs-data-lane/Blobs.sol. Add functions there and call them here.
    Blobs internal subject;

    function setUp() public {
        subject = new Blobs();
    }

    /// A type-3 transaction with a self-constructed blob is sent on a testnet
    function test_criterion01_aType3TransactionWithASelfConstructedBlob() public {
        fail("A type-3 transaction with a self-constructed blob is sent on a testnet");
    }

    /// The KZG commitment is computed locally and the derived versioned hash matches what the chain
    /// reports
    function test_criterion02_theKzgCommitmentIsComputedLocallyAndTheDerived() public {
        fail("The KZG commitment is computed locally and the derived versioned hash matches what the chain reports");
    }

    /// A contract reads its transaction's versioned hash, and a test proves it cannot read the blob
    /// contents
    function test_criterion03_aContractReadsItsTransactionSVersionedHashAnd() public {
        fail("A contract reads its transaction's versioned hash, and a test proves it cannot read the blob contents");
    }

    /// A comment states what the versioned hash is good for, with one concrete use
    function test_criterion04_aCommentStatesWhatTheVersionedHashIsGood() public {
        fail("A comment states what the versioned hash is good for, with one concrete use");
    }

    /// 100 KiB is priced as calldata and as blob data at live prices
    function test_criterion05_100KibIsPricedAsCalldataAndAsBlob() public {
        fail("100 KiB is priced as calldata and as blob data at live prices");
    }

    /// Both fee markets are plotted over at least 200 blocks, with a range identified where they
    /// moved in opposite directions
    function test_criterion06_bothFeeMarketsArePlottedOverAtLeast200() public {
        fail(
            "Both fee markets are plotted over at least 200 blocks, with a range identified where they moved in opposite directions"
        );
    }

    /// The availability guarantee is stated as a sentence about time, with reference to the
    /// sampling scheme
    function test_criterion07_theAvailabilityGuaranteeIsStatedAsASentenceAbout() public {
        fail("The availability guarantee is stated as a sentence about time, with reference to the sampling scheme");
    }

    /// The blob's contents are retrieved, and the date after which retrieval fails is stated along
    /// with what would preserve the data
    function test_criterion08_theBlobSContentsAreRetrievedAndTheDate() public {
        fail(
            "The blob's contents are retrieved, and the date after which retrieval fails is stated along with what would preserve the data"
        );
    }

    /// Sustained throughput is derived from the current target and max, with the most recent change
    /// to it named
    function test_criterion09_sustainedThroughputIsDerivedFromTheCurrentTargetAnd() public {
        fail("Sustained throughput is derived from the current target and max, with the most recent change to it named");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
