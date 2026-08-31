/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-wagmi-ssr-no-flash  (implement, grain block, difficulty 3)
 * Run:      pnpm playwright test tests/ssr-no-flash.spec.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
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
 * Your code goes in src/app-wagmi/SsrNoFlash.ts. Nothing here imports it yet — a TypeScript
 * module is its named exports, and this scaffold does not invent them. Export what the
 * exercise needs, then import it above.
 */
import { test } from '@playwright/test';

test.describe('A connected address in the first paint', () => {
  // The test connects a mock wallet, reloads, and asserts the address string is present in the
  // initial HTML response body before any client JavaScript runs
  test('01 — The test connects a mock wallet, reloads, and asserts the address…', async ({ page }) => {
    void page;
    throw new Error('The test connects a mock wallet, reloads, and asserts the address string is present in the initial HTML response body before any client JavaScript runs');
  });

  // The test asserts the browser console contains no React hydration mismatch warning during the
  // reload
  test('02 — The test asserts the browser console contains no React hydration…', async ({ page }) => {
    void page;
    throw new Error('The test asserts the browser console contains no React hydration mismatch warning during the reload');
  });

  // A source assertion proves the QueryClient is constructed inside a component, not at module
  // scope
  test('03 — A source assertion proves the QueryClient is constructed inside a…', async ({ page }) => {
    void page;
    throw new Error('A source assertion proves the QueryClient is constructed inside a component, not at module scope');
  });
});
