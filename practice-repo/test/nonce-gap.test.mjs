/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-mempool-watch-the-nonce-gap  (break, grain block, difficulty 3)
 * Run:      node scripts/nonce-gap.mjs && node --test test/nonce-gap.test.mjs
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   On a testnet, from an account you control, send the transaction at nonce N+1 first, without
 *   ever sending N. Poll `txpool_content` and record where the transaction sits. Then, without
 *   sending N, try to make it go through: raise the priority fee to an absurd level via a
 *   replacement, wait several blocks, and record that nothing changes. Then send N and capture
 *   the moment both promote and land. Do the whole run against two different RPC endpoints
 *   simultaneously and diff what each reports about the same transaction hash at the same
 *   wall-clock moments. Emit a timeline to `out/nonce-gap.json` with, for each poll, the
 *   timestamp, each endpoint's answer, and the pool bucket the transaction was in. Assertions go
 *   in `test/nonce-gap.test.mjs`.
 */
import { test } from 'node:test';

  // The timeline shows the transaction in the queued bucket for at least ten consecutive polls
  // before N is sent
  test('01 — The timeline shows the transaction in the queued bucket for at least…', () => {
    throw new Error('The timeline shows the transaction in the queued bucket for at least ten consecutive polls before N is sent');
  });

  // A test asserts the fee increase did not move the transaction out of the queued bucket
  test('02 — A test asserts the fee increase did not move the transaction out of the…', () => {
    throw new Error('A test asserts the fee increase did not move the transaction out of the queued bucket');
  });

  // The timeline records at least one poll where the two endpoints disagree about the
  // transaction's state
  test('03 — The timeline records at least one poll where the two endpoints disagree…', () => {
    throw new Error('The timeline records at least one poll where the two endpoints disagree about the transaction\'s state');
  });

  // The promotion from queued to pending is captured in the timeline within one block of N being
  // sent
  test('04 — The promotion from queued to pending is captured in the timeline within…', () => {
    throw new Error('The promotion from queued to pending is captured in the timeline within one block of N being sent');
  });

  // The write-up states, in one sentence, why the wallet UI would have said "pending" for the
  // entire run
  test('05 — The write-up states, in one sentence, why the wallet UI would have said…', () => {
    throw new Error('The write-up states, in one sentence, why the wallet UI would have said "pending" for the entire run');
  });
