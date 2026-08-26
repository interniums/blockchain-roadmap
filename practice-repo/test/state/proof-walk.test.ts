/**
 * SPECIFICATION — proof walking, the child-reference rule, and exclusion proofs.
 *
 * Practice: fundamentals-state-verify-a-real-getproof
 *
 * The practice's acceptance command runs a script against live mainnet data, which cannot
 * be a unit test. What CAN be pinned down is the logic the script depends on, and that is
 * what this file does. If these pass and your script still disagrees with the header's
 * stateRoot, the bug is in your RPC plumbing, not your trie reasoning.
 */
import { describe, it, expect } from 'vitest';
import { childReference, keccak256, verifyProof } from '../../src/state/proof';
import { toNibbles } from '../../src/state/nibbles';
import { accountProofFixture, unwrittenSlotFixture, writtenSlotFixture } from './fixtures';

const bytes = (...b: number[]): Uint8Array => new Uint8Array(b);
const filled = (length: number, value = 0xaa): Uint8Array => new Uint8Array(length).fill(value);

describe('the child-reference rule', () => {
  it('inlines a child whose RLP is under 32 bytes', () => {
    const ref = childReference(filled(31));
    expect(ref.inlined).toBe(true);
    expect(Array.from(ref.reference)).toEqual(Array.from(filled(31)));
  });

  it('hashes a child whose RLP is exactly 32 bytes — the boundary is inclusive on the hash side', () => {
    const ref = childReference(filled(32));
    expect(ref.inlined).toBe(false);
    expect(ref.reference).toHaveLength(32);
  });

  it('hashes a child whose RLP is over 32 bytes', () => {
    expect(childReference(filled(80)).inlined).toBe(false);
  });

  it('a hashed reference is keccak256 of the child RLP, not of anything else', () => {
    const child = filled(64);
    expect(Array.from(childReference(child).reference)).toEqual(Array.from(keccak256(child)));
  });

  it('an inlined child is never 32 bytes long, so the two cases are unambiguous on the wire', () => {
    for (const length of [0, 1, 17, 31]) {
      expect(childReference(filled(length)).reference.length).toBeLessThan(32);
    }
  });
});

describe('the secure trie: the path is keccak256(key), not the key', () => {
  const address = bytes(...new Array(20).fill(0x11));

  it('walks 64 nibbles for an account proof, because the path is a 32-byte hash', () => {
    const result = verifyProof({
      key: address,
      proofNodes: [],
      expectedRoot: filled(32),
    });
    expect(result.pathNibbles).toHaveLength(64);
  });

  it('the path equals the nibbles of keccak256(address), not the nibbles of the address', () => {
    const result = verifyProof({
      key: address,
      proofNodes: [],
      expectedRoot: filled(32),
    });
    expect(result.pathNibbles).toEqual(toNibbles(keccak256(address)));
    expect(result.pathNibbles).not.toEqual(toNibbles(address));
  });
});

describe('root verification', () => {
  it('fails loudly when the recomputed root does not equal the expected root', () => {
    // A single leaf node that plainly does not hash to this root.
    expect(() =>
      verifyProof({
        key: bytes(...new Array(20).fill(0x22)),
        proofNodes: [bytes(0xc2, 0x20, 0x01)],
        expectedRoot: filled(32, 0x00),
      }),
    ).toThrow();
  });

  it('rejects an empty proof against a non-empty root', () => {
    expect(() =>
      verifyProof({
        key: bytes(...new Array(20).fill(0x33)),
        proofNodes: [],
        expectedRoot: filled(32, 0x99),
      }),
    ).toThrow();
  });
});

describe('walk annotation', () => {
  it('records the chosen nibble at every branch and null everywhere else', () => {
    // Skips until you capture a fixture. See test/state/fixtures.ts.
    const captured = accountProofFixture();
    if (captured === null) return;

    const result = verifyProof({
      key: captured.key,
      proofNodes: captured.nodes,
      expectedRoot: captured.root,
    });

    for (const step of result.steps) {
      if (step.nodeType === 'branch') {
        expect(step.chosenNibble).not.toBeNull();
        expect(step.chosenNibble).toBeGreaterThanOrEqual(0);
        expect(step.chosenNibble).toBeLessThan(16);
      } else {
        expect(step.chosenNibble).toBeNull();
      }
      expect(step.evidence.length).toBeGreaterThan(0);
    }
  });

  it('nibbleOffset advances monotonically down the walk', () => {
    const captured = accountProofFixture();
    if (captured === null) return;

    const result = verifyProof({
      key: captured.key,
      proofNodes: captured.nodes,
      expectedRoot: captured.root,
    });
    for (let i = 1; i < result.steps.length; i++) {
      expect(result.steps[i].nibbleOffset).toBeGreaterThan(result.steps[i - 1].nibbleOffset - 1);
    }
  });
});

describe('exclusion proofs', () => {
  /**
   * Acceptance: "A third run against an unwritten slot is annotated to show where the path
   * terminates and why that constitutes an exclusion proof."
   *
   * The distinction that matters: a slot that was never written and a slot explicitly set
   * to zero return the same thing from eth_getStorageAt, but they produce DIFFERENT proofs.
   * The first terminates early; the second does not exist in the trie either, because the
   * client deletes zero-valued slots. Work out which of those is actually true for your
   * chosen contract before you write the annotation — that is the real content of this task.
   */
  it('returns outcome "exclusion" rather than throwing, and rather than a zero value', () => {
    const captured = unwrittenSlotFixture();
    if (captured === null) return;

    const result = verifyProof({
      key: captured.key,
      proofNodes: captured.nodes,
      expectedRoot: captured.root,
    });
    expect(result.outcome).toBe('exclusion');
    expect(result.value).toBeNull();
    expect(result.exclusionReason.length).toBeGreaterThan(0);
  });

  it('an inclusion result carries a value and an empty exclusion reason', () => {
    const captured = writtenSlotFixture();
    if (captured === null) return;

    const result = verifyProof({
      key: captured.key,
      proofNodes: captured.nodes,
      expectedRoot: captured.root,
    });
    expect(result.outcome).toBe('inclusion');
    expect(result.value).not.toBeNull();
    expect(result.exclusionReason).toBe('');
  });
});
