/**
 * Nibble paths for the Merkle-Patricia trie.
 *
 * Practice: fundamentals-state-compact-encoding-from-scratch
 *           fundamentals-state-verify-a-real-getproof
 *
 * A trie key is not consumed byte by byte. It is consumed one HALF-BYTE (nibble) at a
 * time, because a branch node has 16 children — one per possible nibble value. Everything
 * in this module is about that translation and nothing else.
 *
 * No solutions here. Every function below throws. Make the tests pass.
 */

/**
 * The terminator marker as it appears in the published hex-prefix examples.
 *
 * It is NOT a real nibble — real nibbles are 0..15. It is a sentinel appended to a leaf's
 * path in some reference implementations to mean "the key ends here". Whether YOUR
 * representation carries it is a decision you must make explicitly and then hold to in
 * both directions (see compact.ts).
 */
export const NIBBLE_TERMINATOR = 16;

/** Thrown when a value that must be a nibble (0..15) is not one. */
export class NibbleRangeError extends Error {
  constructor(public readonly value: number, public readonly index: number) {
    super(`nibble out of range at index ${index}: ${value} (must be 0..15)`);
    this.name = 'NibbleRangeError';
  }
}

/**
 * Split each byte into its high nibble then its low nibble.
 * `Uint8Array([0xab, 0xcd])` -> `[0xa, 0xb, 0xc, 0xd]`, i.e. `[10, 11, 12, 13]`.
 *
 * Output length is always exactly 2x input length.
 */
export function toNibbles(_bytes: Uint8Array): number[] {
  throw new Error('TODO: split each byte into (high, low) nibbles, high first');
}

/**
 * Inverse of `toNibbles`. Must reject an odd-length input — you cannot pack an odd
 * number of nibbles into whole bytes without deciding on padding, and that decision
 * belongs to hex-prefix encoding, not here.
 */
export function fromNibbles(_nibbles: number[]): Uint8Array {
  throw new Error('TODO: pack nibble pairs back into bytes; reject odd length');
}

/**
 * Validate every element is in 0..15. Throw `NibbleRangeError` naming the offending
 * index otherwise. The acceptance criteria require a DISTINGUISHABLE error, so do not
 * throw a bare `Error` and do not silently mask with `& 0xf`.
 */
export function assertNibbles(_nibbles: number[]): void {
  throw new Error('TODO: validate 0..15, throw NibbleRangeError with the index');
}

/** How many leading elements `a` and `b` share. Used to split an extension node's path. */
export function commonPrefixLength(_a: number[], _b: number[]): number {
  throw new Error('TODO: count the shared leading nibbles');
}

/**
 * Normalise a published-style path that may carry a trailing terminator marker.
 *
 * The four vectors in the practice spec are written with the terminator included on the
 * leaf cases. Your encode/decode pair works on terminator-free paths plus an explicit
 * `isLeaf` flag. This function is the bridge, and writing it forces you to say out loud
 * which convention you picked.
 */
export function stripTerminator(_path: number[]): { nibbles: number[]; hadTerminator: boolean } {
  throw new Error('TODO: peel a trailing NIBBLE_TERMINATOR off, report whether one was there');
}

/** Render a nibble path as a readable hex string, e.g. `[10, 11] -> "ab"`. Debug aid. */
export function nibblesToHex(_nibbles: number[]): string {
  throw new Error('TODO: one hex character per nibble');
}
