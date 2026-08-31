/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-event-pipelines-finality-gated-notifications  (implement, grain module, difficulty 4)
 * Run:      pnpm vitest run tests/finality-gate --reporter=junit
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Extend the ingester with two read paths over the same rows: a pending view computed from the
 *   tip, and a finalized table whose rows only appear once the consensus layer's finalized block
 *   has passed the row's block number. Wire a notification job that reads exclusively from the
 *   finalized table and records every notification it sends. Then build a reorg simulator on a
 *   local chain - mine, snapshot, revert, mine a different branch containing different events -
 *   and run the whole pipeline across it. Add the two invariant queries from the module as a
 *   scheduled check running in a separate process.
 *
 * Your code goes in src/infra-event-pipelines/FinalityGate.ts. Nothing here imports it yet — a
 * TypeScript module is its named exports, and this scaffold does not invent them. Export what
 * the exercise needs, then import it above.
 */
import { describe, it, expect } from 'vitest';

describe('A notification that can never fire for an event that stopped existing', () => {
  // After the induced reorg, the pending view matches the canonical branch and no row from the
  // abandoned branch survives anywhere
  it('01 — After the induced reorg, the pending view matches the canonical branch…', () => {
    expect.fail('After the induced reorg, the pending view matches the canonical branch and no row from the abandoned branch survives anywhere');
  });

  // The notification log contains zero entries corresponding to events that existed only on the
  // abandoned branch
  it('02 — The notification log contains zero entries corresponding to events that…', () => {
    expect.fail('The notification log contains zero entries corresponding to events that existed only on the abandoned branch');
  });

  // A test proves the notification job cannot read the pending view, by construction rather than
  // by convention
  it('03 — A test proves the notification job cannot read the pending view, by…', () => {
    expect.fail('A test proves the notification job cannot read the pending view, by construction rather than by convention');
  });

  // The contiguity and cursor-lag checks run in a separate process, return zero rows on a
  // healthy run, and fire on an injected gap
  it('04 — The contiguity and cursor-lag checks run in a separate process, return…', () => {
    expect.fail('The contiguity and cursor-lag checks run in a separate process, return zero rows on a healthy run, and fire on an injected gap');
  });
});
