/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: scaling-blobs-peerdas-should-i-blob  (implement, grain block, difficulty 3)
 * Run:      npx vitest run test/blob-vs-calldata.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Implement a function that decides, for a given batch, whether posting it as a type-3 blob
 *   transaction or as type-2 calldata is cheaper right now. It takes the compressed batch bytes
 *   and reads the current execution base fee and blob base fee from a public RPC. For the blob
 *   path it must account for whole-blob granularity — a batch smaller than one blob still pays
 *   for one blob, and a batch larger than one blob pays for several. For the calldata path it
 *   must price the bytes at the current execution base fee including the calldata floor rules.
 *   Return the cheaper path and both costs. Then test it against three fixtures: blob base fee
 *   pinned at its 1 wei floor, blob base fee spiking with execution gas calm, and the reverse.
 *   Prove the decision flips.
 *
 * Your code goes in src/scaling-blobs-peerdas/BlobVsCalldata.ts. Nothing here imports it yet —
 * a TypeScript module is its named exports, and this scaffold does not invent them. Export
 * what the exercise needs, then import it above.
 */
import { describe, it, expect } from 'vitest';

describe('Build the cost oracle a batcher needs before every submission', () => {
  // Live mode reads both base fees from an RPC and returns a decision with both costs
  it('01 — Live mode reads both base fees from an RPC and returns a decision with…', () => {
    expect.fail('Live mode reads both base fees from an RPC and returns a decision with both costs');
  });

  // Blob costing uses whole-blob granularity, and a test proves a tiny batch still pays for a
  // full blob
  it('02 — Blob costing uses whole-blob granularity, and a test proves a tiny…', () => {
    expect.fail('Blob costing uses whole-blob granularity, and a test proves a tiny batch still pays for a full blob');
  });

  // Three fixtures covering floor, blob spike and execution spike each produce the correct path,
  // and at least one flips the decision
  it('03 — Three fixtures covering floor, blob spike and execution spike each…', () => {
    expect.fail('Three fixtures covering floor, blob spike and execution spike each produce the correct path, and at least one flips the decision');
  });

  // A test asserts the crossover batch size at a fixed pair of base fees, so the boundary is
  // pinned rather than approximated
  it('04 — A test asserts the crossover batch size at a fixed pair of base fees,…', () => {
    expect.fail('A test asserts the crossover batch size at a fixed pair of base fees, so the boundary is pinned rather than approximated');
  });
});
