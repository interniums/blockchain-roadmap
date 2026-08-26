/**
 * SPECIFICATION — hex-prefix (compact) encoding.
 *
 * Practice: fundamentals-state-compact-encoding-from-scratch
 * Acceptance: npx vitest run test/compact-encoding.test.ts
 *
 * These tests fail until you implement src/state/compact.ts and src/state/nibbles.ts.
 * That is the point. Read them as the spec; do not edit them to make them pass.
 *
 * This file lives at the repo root rather than under test/state/ because the practice's
 * acceptance command names this exact path.
 */
import { describe, it, expect } from 'vitest';
import { compactEncode, compactDecode } from '../src/state/compact';
import {
  NIBBLE_TERMINATOR,
  NibbleRangeError,
  assertNibbles,
  stripTerminator,
  toNibbles,
  fromNibbles,
} from '../src/state/nibbles';

const hex = (bytes: Uint8Array): string =>
  '0x' + Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

/**
 * The four published vectors, written the way the practice spec writes them — that is,
 * with the terminator marker (16) still on the leaf paths.
 *
 * `stripTerminator` is what turns the published form into the (nibbles, isLeaf) pair your
 * encoder takes. Deciding whether your representation carries the terminator is part of
 * the exercise; this file fixes the convention as "it does not, and isLeaf carries it".
 */
const VECTORS: ReadonlyArray<{
  published: number[];
  isLeaf: boolean;
  expected: string;
  note: string;
}> = [
  {
    published: [1, 2, 3, 4, 5],
    isLeaf: false,
    expected: '0x112345',
    note: 'odd extension: flag 1, first real nibble shares the flag byte',
  },
  {
    published: [0, 1, 2, 3, 4, 5],
    isLeaf: false,
    expected: '0x00012345',
    note: 'even extension: flag 0, then a zero padding nibble',
  },
  {
    published: [0, 0xf, 1, 0xc, 0xb, 8, NIBBLE_TERMINATOR],
    isLeaf: true,
    expected: '0x200f1cb8',
    note: 'even leaf: flag 2, then a zero padding nibble',
  },
  {
    published: [0xf, 1, 0xc, 0xb, 8, NIBBLE_TERMINATOR],
    isLeaf: true,
    expected: '0x3f1cb8',
    note: 'odd leaf: flag 3, first real nibble shares the flag byte',
  },
];

describe('the flag nibble', () => {
  it('is 2 * isLeaf + isOdd, and each of the four values appears in the vectors', () => {
    const flags = VECTORS.map((v) => {
      const { nibbles } = stripTerminator(v.published);
      return 2 * (v.isLeaf ? 1 : 0) + (nibbles.length % 2);
    });
    expect(flags.slice().sort().join(',')).toBe('0,1,2,3');
  });
});

describe('compactEncode — published vectors', () => {
  for (const v of VECTORS) {
    it(`${JSON.stringify(v.published)} isLeaf=${v.isLeaf} -> ${v.expected} (${v.note})`, () => {
      const { nibbles } = stripTerminator(v.published);
      expect(hex(compactEncode(nibbles, v.isLeaf))).toBe(v.expected);
    });
  }
});

describe('compactDecode — published vectors, in reverse', () => {
  for (const v of VECTORS) {
    it(`${v.expected} -> ${JSON.stringify(v.published)} isLeaf=${v.isLeaf}`, () => {
      const bytes = new Uint8Array(
        (v.expected.slice(2).match(/../g) ?? []).map((h) => parseInt(h, 16)),
      );
      const decoded = compactDecode(bytes);
      const { nibbles } = stripTerminator(v.published);
      expect(decoded.nibbles).toEqual(nibbles);
      // Acceptance: "Decoding recovers the isLeaf flag as well as the nibble list."
      expect(decoded.isLeaf).toBe(v.isLeaf);
    });
  }
});

describe('terminator convention', () => {
  it('stripTerminator reports whether the published form carried one', () => {
    expect(stripTerminator([1, 2, 3]).hadTerminator).toBe(false);
    expect(stripTerminator([1, 2, NIBBLE_TERMINATOR]).hadTerminator).toBe(true);
    expect(stripTerminator([1, 2, NIBBLE_TERMINATOR]).nibbles).toEqual([1, 2]);
  });

  it('only the leaf vectors carry a terminator', () => {
    for (const v of VECTORS) {
      expect(stripTerminator(v.published).hadTerminator).toBe(v.isLeaf);
    }
  });
});

describe('nibble validation', () => {
  it('rejects a value above 15 with a distinguishable error', () => {
    expect(() => assertNibbles([1, 2, 16])).toThrow(NibbleRangeError);
    expect(() => compactEncode([1, 2, 16], false)).toThrow(NibbleRangeError);
  });

  it('rejects a negative value', () => {
    expect(() => assertNibbles([1, -1, 3])).toThrow(NibbleRangeError);
  });

  it('rejects a non-integer', () => {
    expect(() => assertNibbles([1, 2.5, 3])).toThrow(NibbleRangeError);
  });

  it('names the offending index', () => {
    try {
      assertNibbles([0, 1, 99, 3]);
      throw new Error('expected assertNibbles to throw');
    } catch (e) {
      expect(e).toBeInstanceOf(NibbleRangeError);
      expect((e as NibbleRangeError).index).toBe(2);
      expect((e as NibbleRangeError).value).toBe(99);
    }
  });

  it('accepts the full legal range', () => {
    expect(() => assertNibbles([0, 15])).not.toThrow();
  });
});

describe('edge cases', () => {
  it('encodes the empty path for both flags', () => {
    expect(hex(compactEncode([], false))).toBe('0x00');
    expect(hex(compactEncode([], true))).toBe('0x20');
  });

  it('round-trips the empty path', () => {
    expect(compactDecode(compactEncode([], true))).toEqual({ nibbles: [], isLeaf: true });
    expect(compactDecode(compactEncode([], false))).toEqual({ nibbles: [], isLeaf: false });
  });

  it('rejects an empty buffer — there is nowhere for the flag nibble to live', () => {
    expect(() => compactDecode(new Uint8Array())).toThrow();
  });

  it('rejects a flag nibble above 3', () => {
    expect(() => compactDecode(new Uint8Array([0x40, 0x12]))).toThrow();
  });

  it('rejects a malformed even path whose padding nibble is not zero', () => {
    // flag 0 (even extension) demands a zero pad; 0x01 puts a 1 there.
    expect(() => compactDecode(new Uint8Array([0x01, 0x23]))).toThrow();
  });
});

describe('nibbles <-> bytes', () => {
  it('splits high nibble first', () => {
    expect(toNibbles(new Uint8Array([0xab, 0xcd]))).toEqual([0xa, 0xb, 0xc, 0xd]);
  });

  it('doubles the length', () => {
    expect(toNibbles(new Uint8Array([0x00, 0xff, 0x10]))).toHaveLength(6);
  });

  it('fromNibbles inverts toNibbles', () => {
    const bytes = new Uint8Array([0xde, 0xad, 0xbe, 0xef]);
    expect(Array.from(fromNibbles(toNibbles(bytes)))).toEqual(Array.from(bytes));
  });

  it('fromNibbles rejects an odd count', () => {
    expect(() => fromNibbles([1, 2, 3])).toThrow();
  });
});

/**
 * Acceptance: "A property test round-trips 10,000 random nibble arrays covering both
 * parities and both flag values."
 *
 * A fixed seed is used so a failure is reproducible. A property test you cannot re-run on
 * the exact failing input is a property test that wastes your time.
 */
describe('property: decode(encode(x)) === x over 10,000 random paths', () => {
  it('round-trips both parities and both flag values', () => {
    let seed = 0x1234_5678;
    const next = (): number => {
      // xorshift32 — deterministic, dependency-free, good enough to shuffle nibbles.
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return (seed >>> 0) / 0x1_0000_0000;
    };

    const seen = { evenLeaf: 0, oddLeaf: 0, evenExt: 0, oddExt: 0 };

    for (let i = 0; i < 10_000; i++) {
      const length = Math.floor(next() * 65); // 0..64 nibbles, both parities
      const nibbles = Array.from({ length }, () => Math.floor(next() * 16));
      const isLeaf = next() < 0.5;

      const round = compactDecode(compactEncode(nibbles, isLeaf));
      if (round.nibbles.join(',') !== nibbles.join(',') || round.isLeaf !== isLeaf) {
        throw new Error(
          `round trip failed on iteration ${i}: ` +
            `nibbles=${JSON.stringify(nibbles)} isLeaf=${isLeaf} ` +
            `got=${JSON.stringify(round)}`,
        );
      }

      const odd = length % 2 === 1;
      if (isLeaf && odd) seen.oddLeaf++;
      else if (isLeaf) seen.evenLeaf++;
      else if (odd) seen.oddExt++;
      else seen.evenExt++;
    }

    // All four flag values must actually have been exercised, or the property proved nothing.
    expect(seen.evenLeaf).toBeGreaterThan(0);
    expect(seen.oddLeaf).toBeGreaterThan(0);
    expect(seen.evenExt).toBeGreaterThan(0);
    expect(seen.oddExt).toBeGreaterThan(0);
  });
});
