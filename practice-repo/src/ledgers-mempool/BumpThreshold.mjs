/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-mempool-find-the-bump-threshold  (implement, difficulty 4)
 * Exercised by: test/bump-threshold.test.mjs
 * Run:      node scripts/measure-bump.mjs && node --test test/bump-threshold.test.mjs
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write a replacement helper that takes a stuck transaction hash and a bump percentage, and
 *   constructs a same-sender, same-nonce replacement with both fee fields raised by that
 *   percentage. Then use it to measure rather than assume: binary-search the smallest bump your
 *   RPC endpoint actually accepts, by submitting replacements at increasing percentages and
 *   recording which are rejected with an underpriced error. Do not hard-code a threshold
 *   anywhere in the helper — read it from the measurement, and note in the output which client
 *   and endpoint you measured, because this is client policy and differs. Then repeat the
 *   measurement for a type-3 blob transaction on the same endpoint and show the two thresholds
 *   are not the same. Emit `out/bump-threshold.json` with both measured thresholds, the endpoint
 *   identity, and every rejected attempt with its error string.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Replacement, not cancellation — There is no cancel and no edit — only broadcasting a
 *     different transaction at the same sender and nonce and letting them race.
 *   - The replacement price bump is client policy — Nodes reject a replacement unless it beats
 *     the incumbent's fees by a configured margin — a client anti-DoS rule, not a consensus
 *     rule.
 *   - Cancelling costs gas and can fail — Cancelling means sending a zero-value self-transfer
 *     at the same nonce with bumped fees; it can lose the race, and it costs gas when it wins.
 *   - The blob pool is a different pool — Blob transactions live in a separate pool with a far
 *     larger replacement bump, a fee floor, and nonce gaps forbidden outright.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const bumpThresholdUnimplemented = true;
