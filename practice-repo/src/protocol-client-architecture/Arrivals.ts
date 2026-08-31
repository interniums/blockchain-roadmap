/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: protocol-client-architecture-slot-arrival-histogram  (measure, difficulty 2)
 * Exercised by: test/arrivals.test.ts
 * Run:      npx tsx src/sample-slots.ts --slots 200 --out out/arrivals.json && npx vitest run test/arrivals.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Using a public beacon-chain HTTP API or your own synced node, sample at least 200
 *   consecutive recent slots. For each slot record whether a block exists at all, and for those
 *   that do, the wall-clock arrival time relative to the start of the slot — derive slot start
 *   from the genesis time and the 12-second slot length reported by the node's config endpoint,
 *   not from a hardcoded constant. Produce a histogram of arrival times with the four-second
 *   attestation deadline drawn on it, and state your observed missed-slot rate. Then answer in
 *   writing: what fraction of blocks arrived after the deadline, and what would you expect to
 *   happen to those blocks in fork choice.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - The deadlines inside a 12-second slot — Proposal at t=0, attestation deadline at t=4s,
 *     aggregation deadline at t=8s — and attesters who see no block by 4s vote for the
 *     previous head.
 *   - What a validator actually does all day — Attest once per epoch, occasionally aggregate,
 *     rarely propose, and serve on a sync committee if selected.
 *   - The consensus client drives, the execution client follows — The EL never decides
 *     finality, never gossips beacon blocks, and one CL can legally drive several ELs.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const arrivalsUnimplemented = true;
