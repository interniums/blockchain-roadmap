// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-blobs-data-lane-versioned-hash-only  (implement, difficulty 3)
 * Exercised by: test/BlobHash.t.sol
 * Run:      forge test --junit --match-path test/BlobHash.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
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
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Blob — A fixed-size chunk of 4,096 field elements of 32 bytes each — 128 KiB — carried
 *     alongside a transaction rather than inside it.
 *   - The EVM cannot read blob contents — A contract can see the versioned hash of a blob and
 *     nothing else — this is cheap data availability, not cheap storage.
 *   - Versioned hash — The 32-byte value a blob transaction actually carries — a version byte
 *     followed by a hash of the blob's KZG commitment.
 */
contract BlobHash {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
