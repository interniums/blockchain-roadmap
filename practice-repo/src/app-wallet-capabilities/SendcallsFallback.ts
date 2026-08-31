/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-wallet-capabilities-batch-with-fallback  (implement, difficulty 3)
 * Exercised by: tests/sendcalls-fallback.spec.ts
 * Run:      pnpm playwright test tests/sendcalls-fallback.spec.ts --project=capable --project=legacy
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build an approve-then-deposit flow that submits both calls through `sendCalls` with
 *   `experimental_fallback` enabled, after querying the connected wallet's capabilities and
 *   rendering what it reported. Run the same build against two connectors: one wallet that
 *   implements `wallet_sendCalls` and one that does not. The application code must be identical
 *   in both runs - all branching happens on the capability response and inside viem's fallback,
 *   not on the wallet's name.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Capability negotiation — Ask the wallet what it supports rather than inferring it from
 *     the vendor name.
 *   - Reading capabilities from React — wagmi's useCapabilities hook reports what the
 *     connected wallet can do, per chain.
 *   - wallet_sendCalls — One request submits several calls as a single user-visible action,
 *     tracked by one status query.
 *   - Degrading instead of breaking — viem's experimental_fallback executes the calls
 *     sequentially over eth_sendTransaction when the wallet lacks EIP-5792.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const sendcallsFallbackUnimplemented = true;
