/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-transaction-ux-replace-and-cancel-on-anvil  (break, difficulty 3)
 * Exercised by: test/replacement.test.ts
 * Run:      pnpm vitest run test/replacement.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   On Anvil with auto-mining disabled, send a transaction at a low fee. Then send a same-nonce
 *   replacement at a higher fee, and separately a same-nonce zero-value self-send. Mine and
 *   observe. Record both hashes, which transaction landed, and what happened to the account's
 *   nonce. Then repeat with a second transaction queued behind the first and show what the stuck
 *   head does to it.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Replacement is the only edit — You cannot modify or withdraw a pending transaction; you
 *     can only broadcast a different one at the same nonce with a higher fee.
 *   - Cancel is a replacement that does nothing — A cancel is a zero-value self-send at the
 *     same nonce - it costs gas, it can lose the race, and the original may still land.
 *   - The hash is not a stable identifier — A replaced transaction has a new hash, so any
 *     record, webhook or UI keyed on the original silently orphans.
 *   - One stuck transaction blocks the account — An account's transactions execute in strict
 *     nonce order, so a pending transaction at nonce N blocks every later nonce behind it.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const replacementUnimplemented = true;
