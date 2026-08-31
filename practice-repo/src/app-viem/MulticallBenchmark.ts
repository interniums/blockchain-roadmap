/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-viem-multicall-vs-loop  (measure, difficulty 2)
 * Exercised by: test/multicall-benchmark.test.ts
 * Run:      pnpm tsx scripts/multicall-benchmark.ts --out results.json && pnpm vitest run test/multicall-benchmark.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Pick a token with at least twenty holders you can enumerate. Read `balanceOf` for all twenty
 *   against the same node, first as twenty sequential `readContract` calls and then as one
 *   `multicall`. Measure wall-clock time for each, and count the JSON-RPC requests actually
 *   issued - from the node's own log if you run Anvil, or from a request-counting transport
 *   wrapper. Report both numbers and explain the difference in terms of round trips rather than
 *   compute.
 *
 * The 2 concepts this has to end up demonstrating:
 *   - Multicall batching — multicall aggregates many reads into one Multicall3 call, trading N
 *     round trips for one.
 *   - Fallback transport — fallback([http(a), http(b)]) ranks and fails over between RPC
 *     endpoints, and http() batches eligible requests by default.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const multicallBenchmarkUnimplemented = true;
