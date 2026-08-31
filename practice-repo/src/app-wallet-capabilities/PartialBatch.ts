/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-wallet-capabilities-partial-batch-failure  (break, difficulty 3)
 * Exercised by: tests/partial-batch.spec.ts
 * Run:      pnpm playwright test tests/partial-batch.spec.ts && forge test --match-path test/PartialBatch.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Take the flow from the previous exercise and make the second call fail - insufficient
 *   allowance, a paused contract, whatever is convenient. Run it once against an account that
 *   executes the batch atomically and once through the sequential fallback. Capture the on-chain
 *   state after each. Then write the UI copy for the state the sequential run leaves the user
 *   in, and add the code that detects it.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Batched is not atomic — Whether a batch is all-or-nothing depends on the account
 *     executing it, and the capability query is where you find out.
 *   - Degrading instead of breaking — viem's experimental_fallback executes the calls
 *     sequentially over eth_sendTransaction when the wallet lacks EIP-5792.
 *   - wallet_sendCalls — One request submits several calls as a single user-visible action,
 *     tracked by one status query.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const partialBatchUnimplemented = true;
