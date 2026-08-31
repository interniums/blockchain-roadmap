/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: protocol-fork-choice-build-lmd-ghost  (implement, difficulty 3)
 * Exercised by: test/lmd-ghost.test.ts
 * Run:      npx vitest run test/lmd-ghost.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Implement LMD-GHOST from scratch in TypeScript. You need three things: a block tree with
 *   parent links, a map from validator index to that validator's latest attestation and
 *   effective balance, and a getHead function that starts at the justified root and repeatedly
 *   descends into the child whose subtree carries the most attesting weight. Weight must be
 *   summed effective balance, not a count of votes or of blocks. Then add proposer boost as a
 *   temporary weight applied to one node for the duration of one slot, and a way to remove it.
 *   Build a fixture in which a late block plus the boost outweighs an earlier sibling: your
 *   implementation must pick the late block with the boost applied and the earlier one with it
 *   removed. Add a second fixture in which a validator re-votes and the head moves as a result,
 *   with no new blocks and no new validators.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Weight is stake, not block count — A subtree's weight is the effective-balance-weighted
 *     stake of the validators voting for it — "heaviest" never means "longest".
 *   - Only a validator's latest message counts — Each validator contributes weight in exactly
 *     one place — wherever its newest attestation points — and that weight moves when it
 *     re-votes.
 *   - Proposer boost — A timely block gets a temporary fork-choice weight bonus, sized as a
 *     percentage of one committee's weight, applied only during its own slot.
 *   - Gasper — GHOST filtered by FFG — LMD-GHOST picks the head each slot, Casper FFG
 *     finalises checkpoints, and fork choice only ever considers blocks descending from the
 *     last justified checkpoint.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const lmdGhostUnimplemented = true;
