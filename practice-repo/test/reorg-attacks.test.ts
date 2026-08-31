/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: protocol-fork-choice-run-an-ex-ante-reorg  (break, grain module, difficulty 4)
 * Run:      npx vitest run test/reorg-attacks.test.ts && npx tsx src/sweep.ts --out out/thresholds.json
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Using the LMD-GHOST implementation you built, script both reorg attacks against it. For the
 *   ex-ante attack, have the adversary withhold a block and a chosen number of attestations, let
 *   an honest block be published and attested, then release the withheld fork and check whether
 *   the head moves. For the ex-post attack, have the adversary propose in the following slot on
 *   the honest block's parent, with its own proposer boost and any withheld votes. For each
 *   attack, sweep the adversarial stake fraction and the boost value and record the minimum
 *   fraction that succeeds. Plot both curves on one chart against boost value. The two curves
 *   must move in opposite directions; if they do not, your simulation is wrong.
 */
import { describe, it, expect } from 'vitest';

describe('Find the adversarial stake fraction that reorgs an honest block', () => {
  // A test demonstrates a successful ex-ante reorg at a stated adversarial fraction and boost
  // value, and its failure one step below that fraction
  it('01 — A test demonstrates a successful ex-ante reorg at a stated adversarial…', () => {
    expect.fail('A test demonstrates a successful ex-ante reorg at a stated adversarial fraction and boost value, and its failure one step below that fraction');
  });

  // A test demonstrates a successful ex-post reorg at a stated adversarial fraction and boost
  // value
  it('02 — A test demonstrates a successful ex-post reorg at a stated adversarial…', () => {
    expect.fail('A test demonstrates a successful ex-post reorg at a stated adversarial fraction and boost value');
  });

  // out/thresholds.json contains the success threshold for both attacks across a sweep of boost
  // values, and the two series move in opposite directions
  it('03 — out/thresholds.json contains the success threshold for both attacks…', () => {
    expect.fail('out/thresholds.json contains the success threshold for both attacks across a sweep of boost values, and the two series move in opposite directions');
  });

  // A written conclusion names the boost value that minimises the worse of the two thresholds
  // under your own stated definition of worse
  it('04 — A written conclusion names the boost value that minimises the worse of…', () => {
    expect.fail('A written conclusion names the boost value that minimises the worse of the two thresholds under your own stated definition of worse');
  });
});
