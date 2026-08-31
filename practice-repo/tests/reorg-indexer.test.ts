/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-indexing-break-it-with-a-reorg  (break, grain block, difficulty 4)
 * Run:      forge script script/ReorgDrill.s.sol && pnpm vitest run tests/reorg-indexer --reporter=junit
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write the naive indexer first: a loop that reads logs from the tip and appends derived rows,
 *   with no notion of the branch a row came from. Point it at a local Anvil chain. Mine a few
 *   blocks containing token transfers, snapshot, then revert to the snapshot and mine a
 *   different branch containing different transfers to the same addresses. Show that the naive
 *   indexer's table now contains rows from the abandoned branch alongside rows from the
 *   canonical one, and that nothing in the process logged an error. Then fix it: record the
 *   block hash with every row, detect the common ancestor when the parent hash of a new block
 *   does not match the hash you stored, delete every row above it, and reapply.
 *
 * Your code goes in src/infra-indexing/ReorgIndexer.ts. Nothing here imports it yet — a
 * TypeScript module is its named exports, and this scaffold does not invent them. Export what
 * the exercise needs, then import it above.
 */
import { describe, it, expect } from 'vitest';

describe('Corrupt your own indexer with a two-block reorg', () => {
  // A test proves the naive indexer's final table differs from the canonical chain's true state,
  // and names the exact rows that should not be there
  it('01 — A test proves the naive indexer\'s final table differs from the…', () => {
    expect.fail('A test proves the naive indexer\'s final table differs from the canonical chain\'s true state, and names the exact rows that should not be there');
  });

  // A test proves the naive run exited zero and logged no error while producing that wrong table
  it('02 — A test proves the naive run exited zero and logged no error while…', () => {
    expect.fail('A test proves the naive run exited zero and logged no error while producing that wrong table');
  });

  // After the fix, the table matches the canonical branch exactly, with no rows attributable to
  // the abandoned blocks
  it('03 — After the fix, the table matches the canonical branch exactly, with no…', () => {
    expect.fail('After the fix, the table matches the canonical branch exactly, with no rows attributable to the abandoned blocks');
  });

  // The fixed indexer is shown to be idempotent - rerunning it over the same range produces an
  // identical table
  it('04 — The fixed indexer is shown to be idempotent - rerunning it over the…', () => {
    expect.fail('The fixed indexer is shown to be idempotent - rerunning it over the same range produces an identical table');
  });
});
