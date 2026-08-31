/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-transaction-ux-replace-and-cancel-on-anvil  (break, grain block, difficulty 3)
 * Run:      pnpm vitest run test/replacement.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   On Anvil with auto-mining disabled, send a transaction at a low fee. Then send a same-nonce
 *   replacement at a higher fee, and separately a same-nonce zero-value self-send. Mine and
 *   observe. Record both hashes, which transaction landed, and what happened to the account's
 *   nonce. Then repeat with a second transaction queued behind the first and show what the stuck
 *   head does to it.
 *
 * Your code goes in src/app-transaction-ux/Replacement.ts. Nothing here imports it yet — a
 * TypeScript module is its named exports, and this scaffold does not invent them. Export what
 * the exercise needs, then import it above.
 */
import { describe, it, expect } from 'vitest';

describe('Two transactions, one nonce', () => {
  // The test asserts exactly one of the same-nonce transactions is present in a block and the
  // account nonce advanced by one, not two
  it('01 — The test asserts exactly one of the same-nonce transactions is present…', () => {
    expect.fail('The test asserts exactly one of the same-nonce transactions is present in a block and the account nonce advanced by one, not two');
  });

  // Both transaction hashes are recorded and shown to differ while the nonce is identical
  it('02 — Both transaction hashes are recorded and shown to differ while the…', () => {
    expect.fail('Both transaction hashes are recorded and shown to differ while the nonce is identical');
  });

  // A further assertion shows the queued higher-nonce transaction was not included while the
  // lower nonce was unmined
  it('03 — A further assertion shows the queued higher-nonce transaction was not…', () => {
    expect.fail('A further assertion shows the queued higher-nonce transaction was not included while the lower nonce was unmined');
  });
});
