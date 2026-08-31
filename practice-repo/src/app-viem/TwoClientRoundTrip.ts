/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-viem-two-client-round-trip  (implement, difficulty 2)
 * Exercised by: test/two-client-round-trip.test.ts
 * Run:      pnpm vitest run test/two-client-round-trip.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Against a local Anvil node, write a TypeScript script that does the whole round trip for an
 *   ERC-20 transfer. Create a public client over `http()` and read the token's `decimals` and
 *   the sender's `balanceOf` in a single `multicall`. Format the balance for display with
 *   `formatUnits` - no floating-point arithmetic anywhere in the file. Create a wallet client
 *   from one of Anvil's private keys as a local account. Call `simulateContract` for the
 *   transfer, pass the returned `request` straight to `writeContract`, then
 *   `waitForTransactionReceipt`, and print the formatted balance again. The script must contain
 *   no call to `writeContract` that is not preceded by a successful `simulateContract` on the
 *   same line of reasoning.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Public client — createPublicClient exposes read-only actions and never holds a key.
 *   - Wallet client — createWalletClient exposes signing and sending, backed either by a local
 *     key or by the user's wallet.
 *   - Multicall batching — multicall aggregates many reads into one Multicall3 call, trading N
 *     round trips for one.
 *   - Simulate, then write — simulateContract runs the call against pending state and returns
 *     a `request` you hand straight to writeContract.
 *   - Every EVM integer is a bigint — EVM integers cross into JavaScript as bigint, never
 *     number, and float math on token amounts is always a bug.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const twoClientRoundTripUnimplemented = true;
