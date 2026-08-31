/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: protocol-fork-choice-build-lmd-ghost  (implement, grain block, difficulty 3)
 * Run:      npx vitest run test/lmd-ghost.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Implement LMD-GHOST from scratch in TypeScript. You need three things: a block tree with
 *   parent links, a map from validator index to that validator's latest attestation and
 *   effective balance, and a getHead function that starts at the justified root and repeatedly
 *   descends into the child whose subtree carries the most attesting weight. Weight must be
 *   summed effective balance, not a count of votes or of blocks. Then add proposer boost as a
 *   temporary weight applied to one node for the duration of one slot, and a way to remove it.
 *   Build a fixture in which a late block plus the boost outweighs an earlier sibling: your
 *   implementation must pick the late block with the boost applied and the earlier one with it
 *   removed. Add a second fixture in which a validator re-votes and the head moves as a result,
 *   with no new blocks and no new validators.
 */
import { describe, it, expect } from 'vitest';

describe('Write the head rule, then make the boost flip it', () => {
  // A test asserts the head over a fixed tree matches a hand-computed answer, with validators of
  // unequal effective balance so weight cannot be a vote count
  it('01 — A test asserts the head over a fixed tree matches a hand-computed…', () => {
    expect.fail('A test asserts the head over a fixed tree matches a hand-computed answer, with validators of unequal effective balance so weight cannot be a vote count');
  });

  // A test proves that applying proposer boost flips the head and removing it flips the head
  // back, on the same tree
  it('02 — A test proves that applying proposer boost flips the head and removing…', () => {
    expect.fail('A test proves that applying proposer boost flips the head and removing it flips the head back, on the same tree');
  });

  // A test proves the head changes when a single validator replaces its own earlier attestation,
  // with no other input changing
  it('03 — A test proves the head changes when a single validator replaces its own…', () => {
    expect.fail('A test proves the head changes when a single validator replaces its own earlier attestation, with no other input changing');
  });

  // A test asserts that a block outside the subtree of the justified checkpoint is never
  // returned as head, however much weight points at it
  it('04 — A test asserts that a block outside the subtree of the justified…', () => {
    expect.fail('A test asserts that a block outside the subtree of the justified checkpoint is never returned as head, however much weight points at it');
  });
});
