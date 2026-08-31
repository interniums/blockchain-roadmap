/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: protocol-fork-choice-count-real-reorgs  (measure, grain block, difficulty 3)
 * Run:      npx tsx src/scan-reorgs.ts --days 7 --out out/reorgs.json && npx vitest run test/reorgs.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Using a public beacon API, walk at least one week of slots and reconstruct the canonical
 *   chain by parent root. Detect reorgs by finding slots whose block was later replaced, and
 *   record the depth of each. Separately, sample the head and finalized checkpoints at regular
 *   intervals and record the gap between them over the same period. Produce two outputs: a table
 *   of reorg depths with counts, and a time series of head-minus-finalized distance. Then write
 *   the decision note an exchange would use: given your measured reorg depth distribution, how
 *   many slots would you wait before crediting a deposit, and what does the confirmation rule
 *   change about that answer compared with picking a depth from your histogram?
 */
import { describe, it, expect } from 'vitest';

describe('Count what actually reorgs on mainnet in a week', () => {
  // out/reorgs.json lists every detected reorg with its depth and the slots involved, plus the
  // total slots scanned
  it('01 — out/reorgs.json lists every detected reorg with its depth and the slots…', () => {
    expect.fail('out/reorgs.json lists every detected reorg with its depth and the slots involved, plus the total slots scanned');
  });

  // A test verifies the reconstructed chain is internally consistent — every block's parent root
  // resolves to the block recorded at an earlier slot
  it('02 — A test verifies the reconstructed chain is internally consistent —…', () => {
    expect.fail('A test verifies the reconstructed chain is internally consistent — every block\'s parent root resolves to the block recorded at an earlier slot');
  });

  // The head-minus-finalized series is recorded over the same window and its maximum is stated
  it('03 — The head-minus-finalized series is recorded over the same window and…', () => {
    expect.fail('The head-minus-finalized series is recorded over the same window and its maximum is stated');
  });

  // The written credit policy names a slot count, the reorg depth distribution it was derived
  // from, and what assumption the confirmation rule would let it replace
  it('04 — The written credit policy names a slot count, the reorg depth…', () => {
    expect.fail('The written credit policy names a slot count, the reorg depth distribution it was derived from, and what assumption the confirmation rule would let it replace');
  });
});
