// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: fundamentals-encoding-capstone-one-byte-string  (implement, difficulty 4)
 * Exercised by: test/capstone/Encoding.t.sol
 * Run:      forge test --junit --match-path test/capstone/Encoding.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write a single codec library that speaks all three of this module's encodings, and then use
 *   it to demonstrate the failure that connects them. ABI. Encode and decode a call with a
 *   dynamic argument — a `bytes` and a `string[]` — from scratch. Head and tail, offsets in
 *   words, right-padding for bytes and left-padding for numbers. Round-trip a real mainnet
 *   calldata blob and assert you reproduce it byte for byte, selector included, with the
 *   selector derived from the signature rather than looked up. RLP. Encode and decode the same
 *   transaction envelope. Prove your implementation rejects a non-canonical encoding: a length
 *   prefix that could have been shorter, and a leading zero on an integer. Both must fail, and
 *   your error must say which rule they broke. SSZ. Encode a fixed-size container and a
 *   variable-size one, and compute the Merkle root of each. Show that the root of a container
 *   with one field changed differs, and that the root of the same logical value encoded twice
 *   does not. THE COLLISION. Construct two distinct argument tuples whose `abi.encodePacked`
 *   output is byte-identical, and use them to pass a check that hashes the packed bytes. Then
 *   show the same two tuples produce different `abi.encode` output and fail the same check. This
 *   is the whole module in one test: an ambiguous encoding is one you cannot safely hash.
 *
 * The 8 concepts this has to end up demonstrating:
 *   - ABI encoding — Each argument padded to 32 bytes, with dynamic types stored as an offset
 *     plus a length-prefixed payload elsewhere.
 *   - RLP (Recursive Length Prefix) — The execution layer's serialization: exactly two types —
 *     byte strings and lists — with length-prefix rules and nothing else.
 *   - SSZ (Simple Serialize) — The consensus layer's encoding: a typed schema, little-endian
 *     integers, not self-describing, with Merkleization defined alongside.
 *   - Canonical serialization — Exactly one valid byte encoding per value — because two
 *     encodings of the same data hash differently, and different hashes split consensus.
 *   - Packed-encoding hash collision — `("AB","C")` and `("A","BC")` both pack to `"ABC"`, so
 *     their hashes are equal.
 *   - Function selector — The first 4 bytes of `keccak256("name(type1,type2)")` — which is why
 *     selectors can collide.
 *   - Endianness across the two layers — The execution layer is big-endian; SSZ integers on
 *     the consensus layer are little-endian.
 *   - The 32-byte word — The EVM's native unit is a 256-bit word, and almost every layout rule
 *     in Ethereum follows from that one choice.
 */
contract Encoding {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
