/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-event-pipelines-sigkill-idempotent-ingester  (implement, difficulty 3)
 * Exercised by: tests/ingester-crash-safety.test.ts
 * Run:      pnpm vitest run tests/ingester-crash-safety --reporter=junit
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
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
 *
 * The 5 concepts this has to end up demonstrating:
 *   - The key that identifies an event — The natural key is the chain id plus block number,
 *     transaction index and log index - never the transaction hash, which identifies many logs
 *     and is not stable across branches.
 *   - Idempotent writes on the natural key — Writing with an on-conflict clause keyed on the
 *     natural key means replaying any block range produces the same table, which is what makes
 *     retries and restarts safe.
 *   - The cursor belongs in the same transaction — Persist the last fully-processed block in
 *     the same database transaction as the rows it accounts for, or a crash between the two
 *     writes leaves a gap or a duplicate.
 *   - Chunking against the provider's caps — Backfill is chunked by block range against the
 *     provider's log-range and result-size caps, and every chunk must be independently
 *     retryable and idempotent.
 *   - Every transport delivers at least once — Webhooks, queues, resubscribes and cursor
 *     resumes all redeliver; exactly-once is something you achieve downstream with an
 *     idempotent write, never something a transport gives you.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const ingesterCrashSafetyUnimplemented = true;
