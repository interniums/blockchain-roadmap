/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: altvm-pinocchio-observe-p-token-cu  (measure, difficulty 2)
 * Exercised by: test/p-token-cu.test.ts
 * Run:      pnpm vitest run test/p-token-cu.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Fetch a recent mainnet SPL token transfer over a public RPC and read the `consumed X of Y
 *   compute units` line for the token program's invocation out of the transaction logs. Do the
 *   same for a `transfer_checked`. Record both figures against the pre-swap numbers of roughly
 *   4,645 and 6,200 compute units. Then do the part that matters: take the 12M
 *   per-writable-account block ceiling and compute how many token transfers touching one hot
 *   account fit into a single block at the old cost and at the new cost, and write two sentences
 *   stating what that changes for a protocol whose users all write the same pool account. The
 *   transaction you sample must be one you found on chain, and its signature must be recorded in
 *   the output.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - p-token — SPL Token rewritten in Pinocchio - transfer from about 4,645 CU to about 76,
 *     transfer_checked from about 6,200 to about 105.
 *   - Swapped in behind the same address — SIMD-0266 replaced the token program's
 *     implementation at its existing address, so every caller got the saving for free.
 *   - The prize is headroom, not fees — Cheaper instructions buy room under the 1.4M
 *     per-transaction and 12M per-account ceilings, not meaningful fee savings.
 *   - Frequency decides — Fixed per-invocation overhead only matters where invocations are
 *     constant - primitives, not application logic.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const pTokenCuUnimplemented = true;
