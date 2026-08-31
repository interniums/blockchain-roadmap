/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: altvm-pinocchio-observe-p-token-cu  (measure, grain block, difficulty 2)
 * Run:      pnpm vitest run test/p-token-cu.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Fetch a recent mainnet SPL token transfer over a public RPC and read the `consumed X of Y
 *   compute units` line for the token program's invocation out of the transaction logs. Do the
 *   same for a `transfer_checked`. Record both figures against the pre-swap numbers of roughly
 *   4,645 and 6,200 compute units. Then do the part that matters: take the 12M
 *   per-writable-account block ceiling and compute how many token transfers touching one hot
 *   account fit into a single block at the old cost and at the new cost, and write two sentences
 *   stating what that changes for a protocol whose users all write the same pool account. The
 *   transaction you sample must be one you found on chain, and its signature must be recorded in
 *   the output.
 *
 * Your code goes in src/altvm-pinocchio/PTokenCu.ts. Nothing here imports it yet — a
 * TypeScript module is its named exports, and this scaffold does not invent them. Export what
 * the exercise needs, then import it above.
 */
import { describe, it, expect } from 'vitest';

describe('Watch the token program cost a hundred compute units', () => {
  // The test parses the compute units consumed by the token program from a captured real mainnet
  // transaction and asserts the figure is on the order of a hundred rather than thousands
  it('01 — The test parses the compute units consumed by the token program from a…', () => {
    expect.fail('The test parses the compute units consumed by the token program from a captured real mainnet transaction and asserts the figure is on the order of a hundred rather than thousands');
  });

  // The output records the transaction signature and the instruction sampled, so the measurement
  // is reproducible
  it('02 — The output records the transaction signature and the instruction…', () => {
    expect.fail('The output records the transaction signature and the instruction sampled, so the measurement is reproducible');
  });

  // The report states the transfers-per-block figure under the 12M per-account ceiling at both
  // the old and the new cost
  it('03 — The report states the transfers-per-block figure under the 12M…', () => {
    expect.fail('The report states the transfers-per-block figure under the 12M per-account ceiling at both the old and the new cost');
  });
});
