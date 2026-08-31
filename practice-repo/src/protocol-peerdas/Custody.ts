/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: protocol-peerdas-derive-your-custody  (implement, difficulty 3)
 * Exercised by: test/custody.test.ts
 * Run:      npx vitest run test/custody.test.ts && npx tsx src/coverage.ts --nodes 10000 --out out/coverage.json
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Implement the spec's custody derivation in TypeScript: given a node id and a custody group
 *   count, produce the set of custody groups, and from those the set of column indices and the
 *   gossip subnets the node must subscribe to. Follow the specification's algorithm exactly —
 *   repeated hashing of an incrementing value derived from the node id, taken modulo the group
 *   count, deduplicated until enough groups are collected. Verify against any test vectors the
 *   spec provides. Then run your implementation over 10,000 random node ids at the plain
 *   full-node requirement and measure the distribution: how many nodes cover each custody group,
 *   and what the least-covered group gets. Repeat with the validator requirement and state how
 *   the picture changes.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Custody groups — Custody is assigned in 128 groups derived from a node's id by repeated
 *     hashing, and columns are then derived from groups.
 *   - Custody derived from node id makes peers findable — Because custody follows from the
 *     node id and is advertised in the ENR, peers can be discovered by the columns they hold
 *     rather than asked one at a time.
 *   - How much you must custody — A plain full node custodies 4 custody groups; a node with
 *     validators custodies at least 8, scaling up by one group per 32 ETH of attached balance,
 *     capped at all 128.
 *   - One gossip subnet per column — 128 subnets carry data column sidecars, one per column
 *     index, and a node subscribes only to the subnets it custodies.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const custodyUnimplemented = true;
