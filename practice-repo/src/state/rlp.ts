/**
 * Minimal RLP, hand-rolled.
 *
 * Practice: fundamentals-state-verify-a-real-getproof
 *
 * `eth_getProof` hands you a list of hex strings. Each one is an RLP-encoded trie node.
 * You cannot tell a branch from an extension from a leaf until you have decoded it, and
 * the practice forbids using a library, so this is the first thing you build.
 *
 * You only need the decoder to verify a proof. The encoder is here because recomputing a
 * node's hash bottom-up means re-encoding it, and because `encode(decode(x)) === x` is
 * the cheapest correctness check you will get.
 */

/** An RLP item is either a byte string or a list of items. Nothing else exists in RLP. */
export type RlpItem = Uint8Array | RlpItem[];

/** Thrown when input is not well-formed RLP. */
export class RlpError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RlpError';
  }
}

/**
 * Decode exactly one RLP item from the front of `input` and require that it consumed the
 * whole buffer. Trailing bytes are an error, not something to ignore — a proof node with
 * trailing bytes is a malformed proof.
 */
export function rlpDecode(_input: Uint8Array): RlpItem {
  throw new Error('TODO: single byte < 0x80, short/long string, short/long list');
}

/** Re-encode an item. Needed to recompute a node hash from its decoded parts. */
export function rlpEncode(_item: RlpItem): Uint8Array {
  throw new Error('TODO: inverse of rlpDecode');
}

/** Parse a `0x`-prefixed hex string as returned by `eth_getProof`. */
export function hexToBytes(_hex: string): Uint8Array {
  throw new Error('TODO: strip 0x, reject odd length and non-hex characters');
}

/** Render bytes as a `0x`-prefixed lowercase hex string. */
export function bytesToHex(_bytes: Uint8Array): string {
  throw new Error('TODO');
}
