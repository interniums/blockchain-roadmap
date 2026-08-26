/*
 * Practice: fundamentals-encoding-rlp-roundtrip-a-real-tx
 * Run:      npx vitest run test/rlp.test.ts
 *
 * An RLP encoder and decoder, from scratch, with no serialization dependency.
 *
 * RLP has exactly two types: a byte string, and a list of items. Everything else in the
 * specification is a length-prefix rule keyed on the range the first byte falls into. Write those
 * ranges down before you write any code.
 *
 * Read test/rlp.test.ts first. It is the specification, and it is more precise than this comment.
 */

/** What you can hand to `encode`: raw bytes, or a (possibly nested) list of them. */
export type RlpInput = Uint8Array | readonly RlpInput[];

/** What `decode` gives back. Same shape, but always concrete. */
export type RlpItem = Uint8Array | RlpItem[];

/**
 * Every way a byte string can fail to be a canonical RLP encoding.
 *
 * The codes are distinguishable on purpose: "this input is bad" is not a useful decoder, and the
 * acceptance criteria ask for at least six rejections that can be told apart.
 */
export type RlpErrorCode =
  /** A long-form length prefix whose first byte is zero. */
  | 'leading-zero-in-length'
  /** Long form used for a payload that the short form can express. */
  | 'non-minimal-long-form'
  /** A single byte below 0x80 wrapped in a length prefix instead of standing for itself. */
  | 'non-minimal-single-byte'
  /** A complete item was decoded but bytes remain after it. */
  | 'trailing-bytes'
  /** The declared length runs past the end of the input. */
  | 'length-exceeds-input'
  /** The input ended in the middle of a prefix or payload. */
  | 'truncated';

export class RlpError extends Error {
  readonly code: RlpErrorCode;

  constructor(code: RlpErrorCode, message: string) {
    super(`${code}: ${message}`);
    this.name = 'RlpError';
    this.code = code;
  }
}

/**
 * Encode a byte string or a nested list.
 *
 * Two cases are easy to get wrong and are tested explicitly: a single byte below 0x80 encodes as
 * itself with no prefix, and the empty byte string encodes as the single byte 0x80.
 */
export function encode(_input: RlpInput): Uint8Array {
  // TODO: implement.
  throw new Error('TODO: encode is unimplemented - see src/encoding/rlp.ts');
}

/**
 * Decode a complete RLP item and reject anything left over.
 *
 * Canonicality is not optional here. A decoder that accepts two encodings of the same value hands
 * every consumer downstream two hashes for one object.
 *
 * One structural requirement, from the acceptance criteria: never size a buffer from a length
 * prefix you have not checked against the bytes you actually hold. Validate first, allocate second.
 */
export function decode(_bytes: Uint8Array): RlpItem {
  // TODO: implement.
  throw new Error('TODO: decode is unimplemented - see src/encoding/rlp.ts');
}
