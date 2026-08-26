/**
 * SPECIFICATION — identifying MPT node types from the wire form.
 *
 * Practice: fundamentals-state-verify-a-real-getproof
 *
 * There is no acceptance command pointing at this file. It exists because the practice's
 * script (scripts/verify-getproof.mjs) has to classify every node it is handed, and
 * getting that wrong is the first way the exercise goes sideways. Build this first, then
 * the script is mostly plumbing.
 */
import { describe, it, expect } from 'vitest';
import {
  BRANCH_ITEM_COUNT,
  BRANCH_VALUE_INDEX,
  MalformedNodeError,
  classifyNode,
  readPathNode,
} from '../../src/state/node';
import type { RlpItem } from '../../src/state/rlp';

const bytes = (...b: number[]): Uint8Array => new Uint8Array(b);
const emptyBranch = (): RlpItem[] => Array.from({ length: BRANCH_ITEM_COUNT }, () => bytes());

describe('branch nodes', () => {
  it('has 17 items: 16 children and one value slot', () => {
    expect(BRANCH_ITEM_COUNT).toBe(17);
    expect(BRANCH_VALUE_INDEX).toBe(16);
  });

  it('is identified by item count alone — nothing else has 17 items', () => {
    const node = classifyNode(emptyBranch());
    expect(node.type).toBe('branch');
    expect(node.evidence).toContain('17');
  });
});

describe('two-item nodes are separated by the flag nibble of item 0', () => {
  // Item 0 of a 2-item node is a hex-prefix-encoded path. Its top nibble is the flag.
  const cases: ReadonlyArray<{ flagByte: number; type: 'extension' | 'leaf'; why: string }> = [
    { flagByte: 0x00, type: 'extension', why: 'flag 0 — even extension' },
    { flagByte: 0x11, type: 'extension', why: 'flag 1 — odd extension' },
    { flagByte: 0x20, type: 'leaf', why: 'flag 2 — even leaf' },
    { flagByte: 0x3f, type: 'leaf', why: 'flag 3 — odd leaf' },
  ];

  for (const c of cases) {
    it(`${c.why} -> ${c.type}`, () => {
      const node = classifyNode([bytes(c.flagByte, 0x23), bytes(0xde, 0xad)]);
      expect(node.type).toBe(c.type);
    });
  }

  it('states the deciding evidence, not just the verdict', () => {
    const node = classifyNode([bytes(0x20), bytes(0x01)]);
    // Acceptance: "annotated as branch, extension or leaf, with the deciding evidence stated".
    expect(node.evidence).toMatch(/2 items/);
    expect(node.evidence).toMatch(/flag|nibble/i);
  });

  it('preserves the decoded items untouched', () => {
    const items = [bytes(0x20), bytes(0x01)];
    expect(classifyNode(items).items).toEqual(items);
  });
});

describe('malformed nodes', () => {
  it('rejects an item count that is neither 2 nor 17', () => {
    expect(() => classifyNode([bytes(1), bytes(2), bytes(3)])).toThrow(MalformedNodeError);
    expect(() => classifyNode([])).toThrow(MalformedNodeError);
  });

  it('rejects a 2-item node whose item 0 is a list rather than a byte string', () => {
    expect(() => classifyNode([[bytes(1)], bytes(2)])).toThrow(MalformedNodeError);
  });
});

describe('readPathNode', () => {
  it('decodes a leaf path and returns the value as payload', () => {
    // 0x20 = flag 2, even leaf, empty path.
    const read = readPathNode([bytes(0x20), bytes(0xca, 0xfe)]);
    expect(read.isLeaf).toBe(true);
    expect(read.path).toEqual([]);
    expect(Array.from(read.payload)).toEqual([0xca, 0xfe]);
  });

  it('decodes an extension path and returns the child reference as payload', () => {
    // 0x11 = flag 1, odd extension, path [1, 2, 3].
    const read = readPathNode([bytes(0x11, 0x23), bytes(0xbe, 0xef)]);
    expect(read.isLeaf).toBe(false);
    expect(read.path).toEqual([1, 2, 3]);
    expect(Array.from(read.payload)).toEqual([0xbe, 0xef]);
  });

  it('agrees with classifyNode on the leaf flag', () => {
    const items = [bytes(0x3f), bytes(0x01)];
    expect(readPathNode(items).isLeaf).toBe(classifyNode(items).type === 'leaf');
  });
});
