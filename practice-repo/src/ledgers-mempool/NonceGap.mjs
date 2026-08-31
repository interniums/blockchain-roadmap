/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-mempool-watch-the-nonce-gap  (break, difficulty 3)
 * Exercised by: test/nonce-gap.test.mjs
 * Run:      node scripts/nonce-gap.mjs && node --test test/nonce-gap.test.mjs
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   On a testnet, from an account you control, send the transaction at nonce N+1 first, without
 *   ever sending N. Poll `txpool_content` and record where the transaction sits. Then, without
 *   sending N, try to make it go through: raise the priority fee to an absurd level via a
 *   replacement, wait several blocks, and record that nothing changes. Then send N and capture
 *   the moment both promote and land. Do the whole run against two different RPC endpoints
 *   simultaneously and diff what each reports about the same transaction hash at the same
 *   wall-clock moments. Emit a timeline to `out/nonce-gap.json` with, for each poll, the
 *   timestamp, each endpoint's answer, and the pool bucket the transaction was in. Assertions go
 *   in `test/nonce-gap.test.mjs`.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - A nonce gap is not slowness — Sending nonce N+1 before N leaves N+1 structurally
 *     ineligible until N lands — not slow, ineligible.
 *   - Pending and queued are different states — Pending transactions are executable now;
 *     queued transactions sit behind a nonce gap and are neither gossiped nor mined.
 *   - Every pending query answers for one node — `txpool_content`, unmined
 *     `eth_getTransactionByHash` and pending subscriptions all answer for the node you asked,
 *     and only that node.
 *   - Transactions can silently disappear — Pools are bounded and time-limited, so a
 *     transaction can be dropped by every node and simply never be mined.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const nonceGapUnimplemented = true;
