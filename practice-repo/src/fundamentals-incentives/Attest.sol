// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: fundamentals-exit-verify-without-trust  (implement, difficulty 5)
 * Exercised by: test/exit/Attest.t.sol
 * Run:      forge test --match-path test/exit/Attest.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build one command-line tool, `attest`, that takes an address, a slot and a block number and
 *   prints a balance, a storage value and a confirmation verdict — where every line of that
 *   output is something you verified rather than something an RPC asserted. It has four parts,
 *   and they are the six modules of this track in one artefact. ONE. Fetch `eth_getProof` for
 *   the address and slot at that block, and verify the account proof against the block's
 *   `stateRoot` and the storage proof against the account's `storageRoot`, walking the trie
 *   yourself. Not a library that says "valid" — your code has to hash the nodes, follow the
 *   nibbles, and reach the root. It must also verify an ABSENCE: prove that an address you pick
 *   has no account, and say which node type ends that walk. TWO. Get the block header by RPC,
 *   re-hash it yourself, and confirm it matches the block hash you asked for. If it does not,
 *   you have caught the node lying and the tool must say so and stop. THREE. Take one
 *   transaction from that block and decode it from raw bytes with no ABI decoder: envelope type,
 *   then selector, then arguments. Re-encode the arguments and assert you get the same bytes
 *   back. A round trip that does not reproduce the input is a failure, not a rounding error.
 *   FOUR. Print a confirmation verdict for a stated value at risk, which the caller passes in.
 *   Not "12 blocks" — a depth, plus the ETH an attacker would have to destroy to reverse it,
 *   plus the sentence that says whether that is more or less than the value at risk. If the
 *   attack is cheaper than the prize, the tool says the value is not safe at any depth it can
 *   offer.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Cost of attack — Security expressed as a number — what violating a specific property
 *     would cost, against what violating it is worth.
 *   - Security is a price, not a proof — The claim is not that attacking is impossible; it is
 *     that attacking costs more than it earns, denominated in a volatile asset.
 *   - Confirmation policy is a product decision — How long to wait before treating something
 *     as done is derived from value at risk, not from a default someone copied.
 *   - Cost only binds against the largest prize — A security budget means nothing unless
 *     attacker profit is bounded — and a short position, a bridge, or an L2 exit window can
 *     unbound it.
 */
contract Attest {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
