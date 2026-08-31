/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-indexing-break-it-with-a-reorg  (break, difficulty 4)
 * Exercised by: tests/reorg-indexer.test.ts
 * Run:      forge script script/ReorgDrill.s.sol && pnpm vitest run tests/reorg-indexer --reporter=junit
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
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
 * The 3 concepts this has to end up demonstrating:
 *   - Unwinding is part of the job — When the chain replaces recent blocks, an indexer must
 *     unwind the state it derived from them and reapply the new branch - and an indexer that
 *     does not corrupts its data silently.
 *   - An indexer is a fold over a rewritable stream — An indexer is a deterministic fold from
 *     an ordered event stream into a database, and every hard part of indexing follows from
 *     the stream being rewritable.
 *   - Catching up and keeping up — Historical backfill is a throughput problem with a
 *     deterministic input; live tailing is a latency problem whose input can be rewritten -
 *     and published benchmarks measure only the first.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const reorgIndexerUnimplemented = true;
