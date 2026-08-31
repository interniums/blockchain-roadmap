/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-wagmi-count-the-requests  (measure, difficulty 2)
 * Exercised by: test/count-rpc.test.ts
 * Run:      pnpm tsx scripts/count-rpc.ts --report report.json && pnpm vitest run test/count-rpc.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Render the same `useReadContract` call in five separate components on one page against a
 *   local Anvil node. Count the RPC requests Anvil actually receives. Then change one argument
 *   in one of the five components and count again. Finally, remove the explicit `chainId` from
 *   all five while the wallet is on a different chain than the config's default, and record what
 *   the components display. Write down the request counts and what changed the answer.
 *
 * The 2 concepts this has to end up demonstrating:
 *   - Read hooks are cached queries — useReadContract and friends return TanStack Query
 *     results keyed by a structured queryKey, so identical questions fire one request.
 *   - Two chains, silently — The wallet's selected chain and the chain your hook reads are
 *     independent, and mixing them returns confidently wrong data.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const countRpcUnimplemented = true;
