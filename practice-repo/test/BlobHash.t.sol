// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-blobs-data-lane-versioned-hash-only  (implement, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/BlobHash.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write a contract that reads the versioned hash at a given index of the current transaction
 *   using Solidity's `blobhash` builtin, stores it, and exposes it. Test it with Foundry by
 *   setting the transaction's blob hashes with `vm.blobhashes`, and assert the contract sees
 *   exactly what you set. Then write the negative half of the exercise: enumerate what the
 *   contract can and cannot learn about the blob, and encode it as assertions — reading past the
 *   number of attached blobs yields zero, and there is no path from the versioned hash back to
 *   any blob content. Finish with a contract that verifies a claimed value at a claimed position
 *   using the point-evaluation precompile, and note what that does and does not tell you.
 */
contract BlobHashTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// The contract returns exactly the versioned hashes set on the transaction, for at least two
    /// indices
    function test_criterion01_theContractReturnsExactlyTheVersionedHashesSetOn() public {
        fail("The contract returns exactly the versioned hashes set on the transaction, for at least two indices");
    }

    /// Reading an index beyond the attached blob count returns zero rather than reverting
    function test_criterion02_readingAnIndexBeyondTheAttachedBlobCountReturns() public {
        fail("Reading an index beyond the attached blob count returns zero rather than reverting");
    }

    /// A test exercises the point-evaluation precompile against a known commitment and opening
    function test_criterion03_aTestExercisesThePointEvaluationPrecompileAgainstA() public {
        fail("A test exercises the point-evaluation precompile against a known commitment and opening");
    }

    /// A comment states, in one sentence, what a contract can prove about a blob and what it cannot
    function test_criterion04_aCommentStatesInOneSentenceWhatAContract() public {
        fail("A comment states, in one sentence, what a contract can prove about a blob and what it cannot");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
