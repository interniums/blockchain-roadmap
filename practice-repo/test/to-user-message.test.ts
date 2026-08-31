/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-error-surfaces-to-user-message  (implement, grain block, difficulty 3)
 * Run:      pnpm vitest run test/to-user-message.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write `toUserMessage(error)`. It walks a viem error's cause chain, decodes custom errors
 *   against a supplied set of ABIs covering every contract in your call path, classifies the
 *   failure into one of the four triage buckets, and returns a message that names what failed
 *   and the one thing the reader should do. Cover at least eight distinct failures: a decodable
 *   custom error, an undecodable one from a contract whose ABI you withheld, panic 0x11, panic
 *   0x32, an empty revert, insufficient funds, user rejection, and an RPC timeout.
 *
 * Your code goes in src/app-error-surfaces/ToUserMessage.ts. Nothing here imports it yet — a
 * TypeScript module is its named exports, and this scaffold does not invent them. Export what
 * the exercise needs, then import it above.
 */
import { describe, it, expect } from 'vitest';

describe('One function from any error to one next action', () => {
  // Eight table-driven cases each map to a distinct message, and every message names a next
  // action
  it('01 — Eight table-driven cases each map to a distinct message, and every…', () => {
    expect.fail('Eight table-driven cases each map to a distinct message, and every message names a next action');
  });

  // No output contains raw hex, a four-byte selector, or the string "execution reverted"
  it('02 — No output contains raw hex, a four-byte selector, or the string…', () => {
    expect.fail('No output contains raw hex, a four-byte selector, or the string "execution reverted"');
  });

  // The panic cases produce an app-bug message rather than a business message, and the test
  // asserts an alert hook was called for them
  it('03 — The panic cases produce an app-bug message rather than a business…', () => {
    expect.fail('The panic cases produce an app-bug message rather than a business message, and the test asserts an alert hook was called for them');
  });
});
