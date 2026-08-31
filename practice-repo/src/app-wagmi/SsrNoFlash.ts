/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-wagmi-ssr-no-flash  (implement, difficulty 3)
 * Exercised by: tests/ssr-no-flash.spec.ts
 * Run:      pnpm playwright test tests/ssr-no-flash.spec.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build a Next.js App Router page that shows a connect button and, once connected, the account
 *   address and an ERC-20 balance. Configure wagmi with `ssr: true` and `storage:
 *   createStorage({ storage: cookieStorage })`, read the request's cookie header on the server,
 *   and pass `cookieToInitialState(config, cookie)` into `WagmiProvider`. Put `WagmiProvider`
 *   and `QueryClientProvider` in a `"use client"` component and create the `QueryClient` per
 *   mount rather than at module scope. Hard-refresh while connected: the address must be in the
 *   server-rendered HTML.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Why server HTML cannot know your wallet — Connection state lives in localStorage and in
 *     browser-only discovery events, so the server renders disconnected and React complains.
 *   - Cookie storage closes the flash — ssr true plus cookieStorage plus cookieToInitialState
 *     lets the server render the connected state from the request's cookie header.
 *   - The provider is a client component, and the QueryClient is per mount — WagmiProvider and
 *     QueryClientProvider must live in a "use client" component, and a module-scope
 *     QueryClient leaks cache between requests.
 *   - The config is the single source of truth — createConfig({ chains, connectors,
 *     transports, storage }) holds everything; WagmiProvider only puts it in context.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const ssrNoFlashUnimplemented = true;
