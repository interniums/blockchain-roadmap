/*
 * Practice: fundamentals-encoding-rlp-roundtrip-a-real-tx  (kind: implement)
 * Run:      npx vitest run test/rlp.test.ts
 *
 * This practice is MANUAL in Chainpath: `npx` is not a binary the runner will execute, so the app
 * shows you this command and you run it in your own terminal. See the repo README for the one-time
 * vitest setup.
 *
 * Read this file as the specification for src/encoding/rlp.ts.
 */
import { describe, expect, it } from 'vitest';
import { decode, encode, RlpError, type RlpItem } from '../src/encoding/rlp';

/**
 * TODO: paste the output of
 *
 *     cast tx <hash> --raw
 *
 * for a real mainnet transaction here, 0x-prefixed. Pick a typed transaction (EIP-1559 or
 * EIP-4844) if you want the more interesting shape: the type byte sits outside the RLP payload,
 * which is itself a fact worth discovering rather than being told.
 */
const RAW_TX_HEX = '';

// ---------------------------------------------------------------------------
// Byte strings
// ---------------------------------------------------------------------------

describe('encode: byte strings', () => {
  it('encodes the empty byte string as 0x80', () => {
    expect(encode(bytes())).toEqual(bytes(0x80));
  });

  it('encodes a single byte below 0x80 as itself, with no prefix', () => {
    expect(encode(bytes(0x00))).toEqual(bytes(0x00));
    expect(encode(bytes(0x7f))).toEqual(bytes(0x7f));
  });

  it('prefixes a single byte of 0x80 or above', () => {
    expect(encode(bytes(0x80))).toEqual(bytes(0x81, 0x80));
  });

  it('uses the short form for payloads up to 55 bytes', () => {
    const payload = fill(55, 0xab);
    expect(encode(payload)).toEqual(concat(bytes(0x80 + 55), payload));
  });

  it('uses the long form for payloads of 56 bytes or more', () => {
    const payload = fill(56, 0xab);
    expect(encode(payload)).toEqual(concat(bytes(0xb8, 56), payload));
  });

  it('uses a multi-byte length when the payload needs one', () => {
    const payload = fill(1024, 0x01);
    expect(encode(payload)).toEqual(concat(bytes(0xb9, 0x04, 0x00), payload));
  });
});

describe('encode: lists', () => {
  it('encodes the empty list as 0xc0', () => {
    expect(encode([])).toEqual(bytes(0xc0));
  });

  it('encodes a short list', () => {
    expect(encode([bytes(0x01), bytes(0x02)])).toEqual(bytes(0xc2, 0x01, 0x02));
  });

  it('encodes nesting', () => {
    expect(encode([[], [[]], [[], [[]]]])).toEqual(bytes(0xc7, 0xc0, 0xc1, 0xc0, 0xc3, 0xc0, 0xc1, 0xc0));
  });
});

// ---------------------------------------------------------------------------
// Canonicality: at least six distinct rejections, each distinguishable
// ---------------------------------------------------------------------------

describe('decode: rejects non-canonical input', () => {
  const cases: Array<{ why: string; input: Uint8Array; code: string }> = [
    {
      why: 'single byte below 0x80 wrapped in a length prefix',
      input: bytes(0x81, 0x7f),
      code: 'non-minimal-single-byte',
    },
    {
      why: 'long form used for a 3-byte string the short form covers',
      input: concat(bytes(0xb8, 0x03), fill(3, 0xaa)),
      code: 'non-minimal-long-form',
    },
    {
      why: 'long-form length with a leading zero byte',
      input: concat(bytes(0xb9, 0x00, 0x38), fill(56, 0xaa)),
      code: 'leading-zero-in-length',
    },
    {
      why: 'long-form list used for a payload the short form covers',
      input: bytes(0xf8, 0x01, 0x00),
      code: 'non-minimal-long-form',
    },
    {
      why: 'declared length runs past the end of the input',
      input: bytes(0x83, 0xaa, 0xbb),
      code: 'length-exceeds-input',
    },
    {
      why: 'a complete item followed by a stray byte',
      input: bytes(0xc1, 0x01, 0x00),
      code: 'trailing-bytes',
    },
    {
      why: 'input ends in the middle of a length prefix',
      input: bytes(0xb9, 0x01),
      code: 'truncated',
    },
  ];

  for (const { why, input, code } of cases) {
    it(`rejects ${why}`, () => {
      let thrown: unknown;
      try {
        decode(input);
      } catch (error) {
        thrown = error;
      }
      if (thrown === undefined) throw new Error(`decode accepted a non-canonical encoding: ${why}`);
      expect(thrown).toBeInstanceOf(RlpError);
      expect((thrown as RlpError).code).toBe(code);
    });
  }

  it('gives a distinguishable code to every rejection above', () => {
    expect(new Set(cases.map((c) => c.code)).size).toBeGreaterThanOrEqual(6);
  });
});

// ---------------------------------------------------------------------------
// Round-trip
// ---------------------------------------------------------------------------

describe('round-trip', () => {
  it('round-trips 10,000 random nested structures', () => {
    const random = xorshift(0x9e3779b9);
    for (let i = 0; i < 10_000; i++) {
      const value = randomItem(random, 4);
      const roundTripped = decode(encode(value));
      expect(describeItem(roundTripped)).toEqual(describeItem(value));
    }
  });

  it('re-encodes a real mainnet transaction to the exact bytes the node returned', () => {
    if (RAW_TX_HEX === '') {
      throw new Error('paste the output of `cast tx <hash> --raw` into RAW_TX_HEX at the top of this file');
    }

    const raw = fromHex(RAW_TX_HEX);
    const { typeByte, payload } = splitTypedEnvelope(raw);

    const fields = decode(payload);
    if (!Array.isArray(fields)) throw new Error('a transaction payload decodes to a list of fields, not a byte string');

    const reEncoded = encode(fields);
    expect(toHex(concat(typeByte, reEncoded))).toBe(toHex(raw));
  });
});

// ---------------------------------------------------------------------------
// Test support
// ---------------------------------------------------------------------------

function bytes(...values: number[]): Uint8Array {
  return Uint8Array.from(values);
}

function fill(length: number, value: number): Uint8Array {
  return new Uint8Array(length).fill(value);
}

function concat(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function fromHex(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function toHex(value: Uint8Array): string {
  return `0x${[...value].map((b) => b.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * A typed transaction is `type_byte || rlp_payload`; a legacy one is bare RLP. Splitting them is
 * not RLP's job, which is exactly why it belongs here in the test rather than in the codec.
 */
function splitTypedEnvelope(raw: Uint8Array): { typeByte: Uint8Array; payload: Uint8Array } {
  const first = raw[0] ?? 0;
  return first >= 0xc0 ? { typeByte: bytes(), payload: raw } : { typeByte: raw.slice(0, 1), payload: raw.slice(1) };
}

/** Deterministic PRNG so a property failure is reproducible. */
function xorshift(seed: number): () => number {
  let state = seed >>> 0 || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x1_0000_0000;
  };
}

function randomItem(random: () => number, depth: number): RlpItem {
  if (depth === 0 || random() < 0.6) {
    const length = Math.floor(random() ** 3 * 300);
    const out = new Uint8Array(length);
    for (let i = 0; i < length; i++) out[i] = Math.floor(random() * 256);
    return out;
  }
  const size = Math.floor(random() * 5);
  return Array.from({ length: size }, () => randomItem(random, depth - 1));
}

/** Structural comparison that works for both arms of the union. */
function describeItem(item: RlpItem): unknown {
  return Array.isArray(item) ? item.map(describeItem) : toHex(item);
}
