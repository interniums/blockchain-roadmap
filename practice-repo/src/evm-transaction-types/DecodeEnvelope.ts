/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-transaction-types-decode-five-envelopes  (implement, difficulty 4)
 * Exercised by: test/decodeEnvelope.test.ts
 * Run:      npx vitest run test/decodeEnvelope.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write a decoder in TypeScript that takes a raw transaction hex string, identifies its
 *   envelope type from the leading byte (remembering that a legacy transaction has no type byte
 *   at all), and decodes the correct field set for that type. Do not use a library's transaction
 *   parser — RLP decoding is fine, field interpretation is yours. Collect one real mainnet
 *   transaction of each of the five types with `cast tx --raw` and use them as fixtures. Produce
 *   a table of which fields each type carries, generated from your decoder rather than written
 *   by hand.
 *
 * The 6 concepts this has to end up demonstrating:
 *   - Typed transaction envelope — A transaction is a one-byte type prefix followed by a
 *     type-specific payload, with type numbers restricted to 0x00-0x7f.
 *   - Legacy transaction (type 0x00) — The original untyped format — nonce, gasPrice,
 *     gasLimit, to, value, data, v, r, s — still valid and still broadcast.
 *   - Access-list transaction (type 0x01) — EIP-2930 added an accessList of addresses and
 *     storage keys that are pre-warmed before execution.
 *   - 1559 transaction (type 0x02) — Replaces gasPrice with maxFeePerGas and
 *     maxPriorityFeePerGas, and is the default envelope for ordinary transactions.
 *   - Blob transaction (type 0x03) — EIP-4844's envelope — it carries versioned hashes of blob
 *     commitments and pays a separate blob fee on its own market.
 *   - Set-code transaction (type 0x04) — EIP-7702's envelope — a 1559 transaction plus a
 *     non-empty authorization_list that installs delegation designators before the call runs.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const decodeEnvelopeUnimplemented = true;
