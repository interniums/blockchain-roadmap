/**
 * Merkle-Patricia trie node types, identified from the wire form alone.
 *
 * Practice: fundamentals-state-verify-a-real-getproof
 *
 * There are exactly three node types and you distinguish them with two cheap tests, in
 * this order:
 *
 *   1. ITEM COUNT.  17 items => branch. Nothing else has 17 items.
 *   2. FIRST NIBBLE OF ITEM 0.  For a 2-item node, item 0 is a hex-prefix-encoded path.
 *      Its flag nibble is 0 or 1 => extension. 2 or 3 => leaf.
 *
 * The acceptance criteria demand that each node be annotated "with the deciding evidence
 * stated", so `classifyNode` returns the evidence, not just the verdict. Do not reduce
 * this to a bare enum — the whole point is being able to show your work.
 */

import type { RlpItem } from './rlp';

export type MptNodeType = 'branch' | 'extension' | 'leaf';

/** A branch node holds 16 child slots plus one value slot. */
export const BRANCH_ITEM_COUNT = 17;

/** Index of the value slot in a branch node. */
export const BRANCH_VALUE_INDEX = 16;

export interface ClassifiedNode {
  type: MptNodeType;
  /** Human-readable justification, e.g. "17 items" or "2 items, flag nibble 3". */
  evidence: string;
  /** The decoded RLP items, unchanged. */
  items: RlpItem[];
}

/** Thrown when a decoded node matches none of the three shapes. */
export class MalformedNodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MalformedNodeError';
  }
}

/**
 * Classify a decoded node and state why.
 *
 * Must throw `MalformedNodeError` for any item count other than 2 or 17, and for a
 * 2-item node whose item 0 is a list rather than a byte string.
 */
export function classifyNode(_items: RlpItem[]): ClassifiedNode {
  throw new Error('TODO: item count first, then the flag nibble of item 0');
}

/**
 * For a leaf or extension node, return the decoded path and, for a leaf, the value.
 * For an extension, `value` is the child reference instead.
 *
 * Reuse `compactDecode`. If you find yourself re-implementing the flag-nibble logic here,
 * stop — that is the bug the practice is trying to make you feel.
 */
export function readPathNode(_items: RlpItem[]): { path: number[]; isLeaf: boolean; payload: Uint8Array } {
  throw new Error('TODO: compactDecode item 0, item 1 is the payload');
}
