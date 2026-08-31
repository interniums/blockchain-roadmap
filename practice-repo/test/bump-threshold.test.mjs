/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-mempool-find-the-bump-threshold  (implement, grain module, difficulty 4)
 * Run:      node scripts/measure-bump.mjs && node --test test/bump-threshold.test.mjs
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write a replacement helper that takes a stuck transaction hash and a bump percentage, and
 *   constructs a same-sender, same-nonce replacement with both fee fields raised by that
 *   percentage. Then use it to measure rather than assume: binary-search the smallest bump your
 *   RPC endpoint actually accepts, by submitting replacements at increasing percentages and
 *   recording which are rejected with an underpriced error. Do not hard-code a threshold
 *   anywhere in the helper — read it from the measurement, and note in the output which client
 *   and endpoint you measured, because this is client policy and differs. Then repeat the
 *   measurement for a type-3 blob transaction on the same endpoint and show the two thresholds
 *   are not the same. Emit `out/bump-threshold.json` with both measured thresholds, the endpoint
 *   identity, and every rejected attempt with its error string.
 *
 * Your code goes in src/ledgers-mempool/BumpThreshold.mjs. Nothing here imports it yet — a
 * TypeScript module is its named exports, and this scaffold does not invent them. Export what
 * the exercise needs, then import it above.
 */
import { test } from 'node:test';

  // The measured legacy-pool threshold is derived from observed accept/reject boundaries, not
  // from a constant in the source
  test('01 — The measured legacy-pool threshold is derived from observed…', () => {
    throw new Error('The measured legacy-pool threshold is derived from observed accept/reject boundaries, not from a constant in the source');
  });

  // At least one attempt below the measured threshold is recorded with the node's verbatim
  // rejection error
  test('02 — At least one attempt below the measured threshold is recorded with the…', () => {
    throw new Error('At least one attempt below the measured threshold is recorded with the node\'s verbatim rejection error');
  });

  // The blob-transaction threshold is measured on the same endpoint and asserted to be strictly
  // larger than the legacy one
  test('03 — The blob-transaction threshold is measured on the same endpoint and…', () => {
    throw new Error('The blob-transaction threshold is measured on the same endpoint and asserted to be strictly larger than the legacy one');
  });

  // The output records the endpoint and, where obtainable, the client name and version
  test('04 — The output records the endpoint and, where obtainable, the client name…', () => {
    throw new Error('The output records the endpoint and, where obtainable, the client name and version');
  });

  // A test asserts the helper raises both `maxFeePerGas` and `maxPriorityFeePerGas`, not only
  // one of them
  test('05 — A test asserts the helper raises both `maxFeePerGas` and…', () => {
    throw new Error('A test asserts the helper raises both `maxFeePerGas` and `maxPriorityFeePerGas`, not only one of them');
  });
