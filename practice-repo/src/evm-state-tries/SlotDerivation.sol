// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-state-tries-slot-archaeology  (measure, difficulty 3)
 * Exercised by: test/SlotDerivation.t.sol
 * Run:      forge test -vv --junit --match-path test/SlotDerivation.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   For a deployed ERC-20 on a pinned fork, compute the storage slot holding a chosen holder's
 *   balance as `keccak256(abi.encode(holder, balancesSlot))` and read it with `vm.load`. Compare
 *   it against what `balanceOf` returns, for three different holders. Then measure the gas of
 *   three storage transitions on a scratch contract in the same test run — zero to non-zero,
 *   non-zero to a different non-zero, and non-zero to zero — recording the numbers from your own
 *   run rather than from a table. Make sure each measured read or write is assigned into a
 *   storage sink so the compiler cannot eliminate it as dead code.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Each contract has its own storage trie — A contract's storage is a separate trie whose
 *     root sits inside that contract's account leaf, making the state a trie of tries.
 *   - Writing zero deletes the key — Setting a storage slot to zero removes it from the trie
 *     rather than storing a zero, so "never written" and "written to zero" are
 *     indistinguishable.
 *   - The account record is exactly four fields — Nonce, balance, storageRoot, codeHash —
 *     RLP-encoded, and that encoded tuple is the value stored in the state trie leaf.
 */
contract SlotDerivation {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
