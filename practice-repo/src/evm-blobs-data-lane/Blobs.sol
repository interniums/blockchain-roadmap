// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-blobs-data-lane-capstone-the-lane-you-cannot-read  (implement, difficulty 4)
 * Exercised by: test/capstone/Blobs.t.sol
 * Run:      forge test --junit --match-path test/capstone/Blobs.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
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
 *
 * The 9 concepts this has to end up demonstrating:
 *   - Blob — A fixed-size chunk of 4,096 field elements of 32 bytes each — 128 KiB — carried
 *     alongside a transaction rather than inside it.
 *   - The EVM cannot read blob contents — A contract can see the versioned hash of a blob and
 *     nothing else — this is cheap data availability, not cheap storage.
 *   - Versioned hash — The 32-byte value a blob transaction actually carries — a version byte
 *     followed by a hash of the blob's KZG commitment.
 *   - KZG commitment — A polynomial commitment that compresses a degree-4,095 polynomial into
 *     a single elliptic-curve point, with constant-size openings at any position.
 *   - Blobs are pruned — Consensus nodes retain blobs for roughly eighteen days and then drop
 *     them — availability is a temporary guarantee, not permanent storage.
 *   - Blob gas has its own market — Blob gas is priced independently of execution gas, with
 *     its own base fee driven by the header's excess-blob-gas field.
 *   - Data availability sampling — Check a few random pieces of erasure-coded data; enough
 *     successful samples makes withholding statistically impossible to hide.
 *   - PeerDAS — EIP-7594 splits blob data into 128 columns and gives each node custody of a
 *     subset, so the network holds everything while no node holds it all.
 *   - Why blob capacity can grow — Column custody divides each node's share of blob data by a
 *     constant, which is what made raising blob counts affordable — it lowers the slope, it
 *     does not remove it.
 */
contract Blobs {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
