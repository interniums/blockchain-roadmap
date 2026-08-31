/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: altvm-parallel-execution-write-lock-census  (measure, grain block, difficulty 3)
 * Run:      pnpm vitest run test/write-lock-census.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Pull 200 consecutive recent blocks from a public RPC with `getBlock` at
 *   `maxSupportedTransactionVersion: 0`. For every transaction, extract the account keys marked
 *   writable - including keys resolved through address lookup tables - and the compute units the
 *   transaction consumed. Aggregate two distributions: write-lock count per account, and
 *   consumed compute units per writable account per block. Produce a report naming the five most
 *   write-contended accounts in your sample, the largest share of a single block's compute that
 *   any one writable account took, and how close that came to the 12M per-account ceiling. Then
 *   take the single hottest account and one cold account and chart `getRecentPrioritizationFees`
 *   for both over at least an hour, and state - with the numbers - whether the two had
 *   materially different fee floors.
 *
 * Your code goes in src/altvm-parallel-execution/WriteLockCensus.ts. Nothing here imports it
 * yet — a TypeScript module is its named exports, and this scaffold does not invent them.
 * Export what the exercise needs, then import it above.
 */
import { describe, it, expect } from 'vitest';

describe('Count who is holding the write locks', () => {
  // The test runs the collector against a fixture of at least 50 captured blocks and asserts the
  // top-five ranking is reproducible from that fixture
  it('01 — The test runs the collector against a fixture of at least 50 captured…', () => {
    expect.fail('The test runs the collector against a fixture of at least 50 captured blocks and asserts the top-five ranking is reproducible from that fixture');
  });

  // The test asserts the reported per-account per-block compute maximum never exceeds 12,000,000
  it('02 — The test asserts the reported per-account per-block compute maximum…', () => {
    expect.fail('The test asserts the reported per-account per-block compute maximum never exceeds 12,000,000');
  });

  // The report file records the observed prioritization-fee floors for the hot and cold account
  // and states a conclusion about locality
  it('03 — The report file records the observed prioritization-fee floors for the…', () => {
    expect.fail('The report file records the observed prioritization-fee floors for the hot and cold account and states a conclusion about locality');
  });
});
