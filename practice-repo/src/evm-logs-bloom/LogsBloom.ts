/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-logs-bloom-rebuild-logsbloom  (implement, difficulty 4)
 * Exercised by: test/logsBloom.test.ts
 * Run:      npx vitest run test/logsBloom.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Implement Ethereum's bloom construction in TypeScript with no library: for the emitting
 *   address and for each topic, keccak256 the item, take the low 11 bits of each of the first
 *   three byte-pairs of the digest, and set those bit positions in a 2048-bit array. OR the
 *   per-item results together to build a receipt bloom, then OR every receipt bloom in a block
 *   to build the header bloom. Fetch a real mainnet receipt and a real block over RPC and
 *   compare against the `logsBloom` fields byte for byte. Then measure saturation: for a range
 *   of recent blocks, report the fraction of bits set in each header bloom.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Ethereum's specific bloom construction — 2048 bits, up to three bits set per item, taken
 *     as the low 11 bits of each of the first three byte-pairs of keccak256(item) — over the
 *     emitting address and every topic.
 *   - What a Bloom filter is — A fixed-size bit array where each item sets a few bits — an
 *     unset bit proves absence, all bits set means only "probably present".
 *   - The header bloom is a union of receipt blooms — Each receipt carries its own bloom, and
 *     the header's logsBloom is the bitwise OR of them all, so a node can reject an irrelevant
 *     block from 256 bytes of header.
 *   - Bloom saturation — A fixed 2048-bit filter against a growing log volume fills up, the
 *     false-positive rate climbs, and the filter stops saving work.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const logsBloomUnimplemented = true;
