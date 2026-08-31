/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-pos-measure-an-epoch  (measure, grain block, difficulty 3)
 * Run:      node scripts/epoch-report.mjs --epoch finalized && node --test test/epoch-report.test.mjs
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Query a beacon API for one recent finalized epoch and report what actually happened in it:
 *   the participation rate, the number of distinct committees, the committee size, how many
 *   slots were missed, and any slashings recorded. Then do the arithmetic that makes the design
 *   visible — multiply committee size by committees per slot by slots per epoch and check it
 *   against the active validator count, so you can see for yourself that each validator attests
 *   exactly once per epoch. Report the total active stake in ETH rather than in validator count,
 *   and state why those two numbers no longer track each other. Emit `out/epoch-report.json` and
 *   assert its contents in `test/epoch-report.test.mjs`.
 */
import { test } from 'node:test';

  // The report contains participation rate, committee count, committee size, missed slots and
  // slashings for one epoch
  test('01 — The report contains participation rate, committee count, committee…', () => {
    throw new Error('The report contains participation rate, committee count, committee size, missed slots and slashings for one epoch');
  });

  // A test asserts committee size times committees per slot times 32 is within rounding of the
  // active validator count
  test('02 — A test asserts committee size times committees per slot times 32 is…', () => {
    throw new Error('A test asserts committee size times committees per slot times 32 is within rounding of the active validator count');
  });

  // Total active stake is reported in ETH and is not derived by multiplying validator count by
  // 32
  test('03 — Total active stake is reported in ETH and is not derived by multiplying…', () => {
    throw new Error('Total active stake is reported in ETH and is not derived by multiplying validator count by 32');
  });

  // A test asserts the epoch spans exactly 32 slots and that missed slots are counted as
  // absences rather than as errors
  test('04 — A test asserts the epoch spans exactly 32 slots and that missed slots…', () => {
    throw new Error('A test asserts the epoch spans exactly 32 slots and that missed slots are counted as absences rather than as errors');
  });

  // The report records which beacon endpoint answered, since participation figures are
  // node-local until finalized
  test('05 — The report records which beacon endpoint answered, since participation…', () => {
    throw new Error('The report records which beacon endpoint answered, since participation figures are node-local until finalized');
  });
