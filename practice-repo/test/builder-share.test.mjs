/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-finality-measure-builder-share  (measure, grain block, difficulty 3)
 * Run:      node scripts/builder-share.mjs --blocks 1000 && node --test test/builder-share.test.mjs
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Do not take a published builder-share figure on faith — the two most-cited 2026 numbers name
 *   different builder pairs and cannot both be current. Measure it. Over the last 1,000 mainnet
 *   blocks, identify the builder for each block and compute the share held by the top one, top
 *   two and top four. For the same sample, determine how many blocks were delivered through a
 *   relay at all, which gives you the MEV-Boost share. Then take one block and trace its value
 *   flow end to end: find it on a relay, identify the builder, and identify the payment from the
 *   builder to the proposer, stating where in the block that payment appears. Emit
 *   `out/builder-share.json` with the distribution, the sample range, and the source you
 *   measured from, and record how your top-two figure compares with the two published claims.
 */
import { test } from 'node:test';

  // The distribution covers 1,000 consecutive blocks and names the top four builders with their
  // shares
  test('01 — The distribution covers 1,000 consecutive blocks and names the top four…', () => {
    throw new Error('The distribution covers 1,000 consecutive blocks and names the top four builders with their shares');
  });

  // The relay-delivered share of the sample is reported separately from the builder distribution
  test('02 — The relay-delivered share of the sample is reported separately from the…', () => {
    throw new Error('The relay-delivered share of the sample is reported separately from the builder distribution');
  });

  // One block is traced from relay bid to on-chain proposer payment, and the payment's location
  // in the block is named
  test('03 — One block is traced from relay bid to on-chain proposer payment, and…', () => {
    throw new Error('One block is traced from relay bid to on-chain proposer payment, and the payment\'s location in the block is named');
  });

  // The output records both published top-two claims alongside the measured figure and states
  // which, if either, the measurement supports
  test('04 — The output records both published top-two claims alongside the measured…', () => {
    throw new Error('The output records both published top-two claims alongside the measured figure and states which, if either, the measurement supports');
  });

  // The sample range and the data source are recorded so the measurement can be repeated
  test('05 — The sample range and the data source are recorded so the measurement…', () => {
    throw new Error('The sample range and the data source are recorded so the measurement can be repeated');
  });
