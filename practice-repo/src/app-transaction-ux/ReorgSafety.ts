/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-transaction-ux-survive-a-reorg  (fix, difficulty 4)
 * Exercised by: test/reorg-safety.test.ts
 * Run:      pnpm vitest run test/reorg-safety.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   You are given a backend that stores `tx_hash` as the primary key for an order and marks the
 *   order paid on the first receipt it sees. Reorganise the chain under it on a local node - by
 *   mining a competing branch, or with the node's reorg cheatcode if your Foundry build provides
 *   one - and show the order marked paid for a transaction that no longer exists. Then fix it:
 *   key on `(address, chainId, nonce)`, wait a configurable confirmation count before crediting,
 *   and un-credit when a log arrives with the removed flag set.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - What a reorg does to your screen — An included transaction can return to pending,
 *     re-execute with different results, or vanish - and its logs are re-delivered marked
 *     removed.
 *   - The hash is not a stable identifier — A replaced transaction has a new hash, so any
 *     record, webhook or UI keyed on the original silently orphans.
 *   - How long to wait is a value-at-risk decision — The number of confirmations is set by
 *     what you do next and what it costs to be wrong, not by a constant someone published.
 *   - Where optimistic UI stops — Optimistic rendering is safe for reversible display state
 *     and unsafe for anything that triggers an irreversible off-chain effect.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const reorgSafetyUnimplemented = true;
