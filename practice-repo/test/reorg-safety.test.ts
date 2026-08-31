/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-transaction-ux-survive-a-reorg  (fix, grain module, difficulty 4)
 * Run:      pnpm vitest run test/reorg-safety.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   You are given a backend that stores `tx_hash` as the primary key for an order and marks the
 *   order paid on the first receipt it sees. Reorganise the chain under it on a local node - by
 *   mining a competing branch, or with the node's reorg cheatcode if your Foundry build provides
 *   one - and show the order marked paid for a transaction that no longer exists. Then fix it:
 *   key on `(address, chainId, nonce)`, wait a configurable confirmation count before crediting,
 *   and un-credit when a log arrives with the removed flag set.
 */
import { describe, it, expect } from 'vitest';

describe('A backend that survives a reorg', () => {
  // A test reproduces the original bug - an order in the paid state after the transaction was
  // reorged out
  it('01 — A test reproduces the original bug - an order in the paid state after…', () => {
    expect.fail('A test reproduces the original bug - an order in the paid state after the transaction was reorged out');
  });

  // After the fix the same scenario leaves the order unpaid, and the test asserts the un-credit
  // path ran
  it('02 — After the fix the same scenario leaves the order unpaid, and the test…', () => {
    expect.fail('After the fix the same scenario leaves the order unpaid, and the test asserts the un-credit path ran');
  });

  // A test proves a replaced transaction updates the existing order rather than creating a
  // second one
  it('03 — A test proves a replaced transaction updates the existing order rather…', () => {
    expect.fail('A test proves a replaced transaction updates the existing order rather than creating a second one');
  });
});
