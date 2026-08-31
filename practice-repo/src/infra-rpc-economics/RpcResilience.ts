/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-rpc-economics-failover-and-pin  (implement, difficulty 3)
 * Exercised by: tests/rpc-resilience.test.ts
 * Run:      pnpm vitest run tests/rpc-resilience --reporter=junit
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build a small dashboard backend that reads four values per refresh - a balance, a contract
 *   read, a log slice and the current head. Give it a fallback transport ranking two independent
 *   providers, with backoff and jitter on 429. Then implement the pinned-block pattern: read the
 *   block number once per refresh cycle and issue every subsequent read at that explicit number
 *   rather than at `latest`. Write two test harnesses: one that stubs provider A to return 429
 *   for every request, and one that stubs a fleet whose reported head oscillates between two
 *   heights across consecutive calls. The application must serve correct, mutually consistent
 *   data under both.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Two providers, because outages correlate with the moments you need the chain —
 *     Production apps run at least two providers behind a fallback transport, because provider
 *     degradation is correlated with congestion, depegs and exploits.
 *   - The height can go backwards — A load-balanced provider fleet can answer two consecutive
 *     requests from nodes at different heights, so correctness-sensitive reads must pin an
 *     explicit block number.
 *   - Two limits, enforced independently — Throughput limits produce 429s during bursts and
 *     volume caps produce a hard cutoff, and an app can be far under one while hitting the
 *     other.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const rpcResilienceUnimplemented = true;
