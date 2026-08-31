/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-wagmi-make-the-balance-update  (fix, difficulty 3)
 * Exercised by: tests/balance-invalidation.spec.ts
 * Run:      pnpm playwright test tests/balance-invalidation.spec.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   You are given an app that reads a balance with `useReadContract` and never updates it after
 *   a transfer. Make it update. Use `useBlockNumber({ watch: true })` together with
 *   `queryClient.invalidateQueries({ queryKey })`, where the query key is built from the
 *   exported `get<X>QueryOptions(config, args)` rather than hand-written. Prove it works by
 *   transferring from a second Anvil account outside the app entirely, so nothing in your own
 *   code path could have triggered the refresh.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Nothing invalidates your cache for you — Chain state changes on its own and wagmi does
 *     not know; freshness is your job, via watch or explicit invalidation.
 *   - Build the key, do not guess it — Query keys come from the exported
 *     get<X>QueryOptions(config, args), so you can construct the exact key to invalidate from
 *     outside React.
 *   - Read hooks are cached queries — useReadContract and friends return TanStack Query
 *     results keyed by a structured queryKey, so identical questions fire one request.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const balanceInvalidationUnimplemented = true;
