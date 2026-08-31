/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-event-pipelines-finality-gated-notifications  (implement, difficulty 4)
 * Exercised by: tests/finality-gate.test.ts
 * Run:      pnpm vitest run tests/finality-gate --reporter=junit
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
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
 * The 5 concepts this has to end up demonstrating:
 *   - A pending view and a finalized table — A workable pattern is a fast optimistic view from
 *     the tip, labelled as pending in the interface, plus a finalized table that only advances
 *     on finality and is what accounting and payouts read.
 *   - You cannot unsend an email — Notifications, payouts, exports and third-party calls
 *     cannot be undone by a rollback, so every irreversible side effect must be gated on
 *     finality even when the read model updates optimistically.
 *   - Finality is the boundary, not a confirmation count — On post-Merge Ethereum the safety
 *     boundary is the consensus layer's finalized checkpoint, not a fixed number of
 *     confirmations - and on an L2 neither number is the right one.
 *   - The rollback stops at the indexer's tables — Frameworks roll their own store back
 *     automatically, and that guarantee ends at their database - anything you copied
 *     downstream is yours to fix.
 *   - Liveness is not the health check — A pipeline must continuously assert two invariants -
 *     no missing block numbers within the ingested range, and cursor lag under a threshold -
 *     because both failures are otherwise silent.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const finalityGateUnimplemented = true;
