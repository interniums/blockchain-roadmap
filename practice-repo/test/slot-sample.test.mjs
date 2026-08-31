/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-blocks-count-the-missed-slots  (measure, grain block, difficulty 3)
 * Run:      node scripts/sample-slots.mjs --slots 1000 && node --test test/slot-sample.test.mjs
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Sample 1,000 consecutive slots from a beacon API and, over the same range, the execution
 *   blocks they produced. Count the missed slots, and show that the slot delta and the
 *   block-number delta across the sample are different numbers. Then chart, for the same range,
 *   `gasUsed / gasLimit`, `baseFeePerGas`, `blobGasUsed` and the blob base fee derived from
 *   `excessBlobGas`. Report the observed gas limit and say whether it matches the current
 *   default. Write the collector so the numbers are reproducible: cache the raw responses, and
 *   emit a JSON summary at `out/slot-sample.json` containing the miss count, the two deltas, the
 *   observed gas limit, and the correlation between the execution base fee and the blob base fee
 *   over the sample. Assertions live in `test/slot-sample.test.mjs` and run against the emitted
 *   summary.
 */
import { test } from 'node:test';

  // The summary reports a missed-slot count and the sample covers at least 1,000 consecutive
  // slots
  test('01 — The summary reports a missed-slot count and the sample covers at least…', () => {
    throw new Error('The summary reports a missed-slot count and the sample covers at least 1,000 consecutive slots');
  });

  // A test asserts the slot delta and the block-number delta across the sample are not equal
  test('02 — A test asserts the slot delta and the block-number delta across the…', () => {
    throw new Error('A test asserts the slot delta and the block-number delta across the sample are not equal');
  });

  // The observed `gasLimit` is reported and compared against the current default rather than
  // assumed
  test('03 — The observed `gasLimit` is reported and compared against the current…', () => {
    throw new Error('The observed `gasLimit` is reported and compared against the current default rather than assumed');
  });

  // Both fee series are present per block, and the reported correlation between them is close to
  // zero rather than close to one
  test('04 — Both fee series are present per block, and the reported correlation…', () => {
    throw new Error('Both fee series are present per block, and the reported correlation between them is close to zero rather than close to one');
  });

  // Raw API responses are cached so a rerun produces an identical summary without new network
  // calls
  test('05 — Raw API responses are cached so a rerun produces an identical summary…', () => {
    throw new Error('Raw API responses are cached so a rerun produces an identical summary without new network calls');
  });
