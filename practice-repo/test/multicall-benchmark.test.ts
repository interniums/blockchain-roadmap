/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-viem-multicall-vs-loop  (measure, grain block, difficulty 2)
 * Run:      pnpm tsx scripts/multicall-benchmark.ts --out results.json && pnpm vitest run test/multicall-benchmark.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Pick a token with at least twenty holders you can enumerate. Read `balanceOf` for all twenty
 *   against the same node, first as twenty sequential `readContract` calls and then as one
 *   `multicall`. Measure wall-clock time for each, and count the JSON-RPC requests actually
 *   issued - from the node's own log if you run Anvil, or from a request-counting transport
 *   wrapper. Report both numbers and explain the difference in terms of round trips rather than
 *   compute.
 *
 * Your code goes in src/app-viem/MulticallBenchmark.ts. Nothing here imports it yet — a
 * TypeScript module is its named exports, and this scaffold does not invent them. Export what
 * the exercise needs, then import it above.
 */
import { describe, it, expect } from 'vitest';

describe('Twenty reads, two ways', () => {
  // results.json contains wall-clock milliseconds and an issued-request count for both
  // strategies
  it('01 — results.json contains wall-clock milliseconds and an issued-request…', () => {
    expect.fail('results.json contains wall-clock milliseconds and an issued-request count for both strategies');
  });

  // The test asserts the multicall path issued strictly fewer requests than the sequential path
  it('02 — The test asserts the multicall path issued strictly fewer requests than…', () => {
    expect.fail('The test asserts the multicall path issued strictly fewer requests than the sequential path');
  });

  // The written explanation states that both strategies execute the same twenty reads on-chain
  // and identifies the saving as network round trips
  it('03 — The written explanation states that both strategies execute the same…', () => {
    expect.fail('The written explanation states that both strategies execute the same twenty reads on-chain and identifies the saving as network round trips');
  });
});
