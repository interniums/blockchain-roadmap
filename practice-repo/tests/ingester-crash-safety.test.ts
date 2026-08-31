/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-event-pipelines-sigkill-idempotent-ingester  (implement, grain block, difficulty 3)
 * Run:      pnpm vitest run tests/ingester-crash-safety --reporter=junit
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build a minimal TypeScript ingester: chunked log backfill into Postgres, writing rows with
 *   an on-conflict clause keyed on chain id, block number and log index, and updating the cursor
 *   row inside the same database transaction as the inserts it accounts for. Run it once to
 *   completion over a fixed block range and take a checksum of the resulting table. Then run it
 *   again from empty, sending SIGKILL at ten randomly chosen points and restarting each time.
 *   The final table must checksum identically. Then break it deliberately: move the cursor
 *   update into a second transaction, repeat the SIGKILL run, and demonstrate and name the
 *   resulting failure.
 */
import { describe, it, expect } from 'vitest';

describe('An ingester that does not care when you kill it', () => {
  // The interrupted run's table checksum is byte-identical to the uninterrupted run's over the
  // same range
  it('01 — The interrupted run\'s table checksum is byte-identical to the…', () => {
    expect.fail('The interrupted run\'s table checksum is byte-identical to the uninterrupted run\'s over the same range');
  });

  // A test asserts the inserts and the cursor update share one transaction, and fails if they
  // are separated
  it('02 — A test asserts the inserts and the cursor update share one transaction,…', () => {
    expect.fail('A test asserts the inserts and the cursor update share one transaction, and fails if they are separated');
  });

  // The two-transaction variant is shown to produce either duplicate rows or a permanent gap,
  // and the test names which
  it('03 — The two-transaction variant is shown to produce either duplicate rows…', () => {
    expect.fail('The two-transaction variant is shown to produce either duplicate rows or a permanent gap, and the test names which');
  });

  // A contiguity query over the ingested range returns zero missing block numbers after every
  // run
  it('04 — A contiguity query over the ingested range returns zero missing block…', () => {
    expect.fail('A contiguity query over the ingested range returns zero missing block numbers after every run');
  });
});
