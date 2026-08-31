/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-viem-error-with-and-without-abi  (break, difficulty 3)
 * Exercised by: test/typed-revert.test.ts
 * Run:      pnpm vitest run test/typed-revert.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Deploy a contract declaring `error InsufficientBalance(uint256 available, uint256 required)`
 *   and a function that reverts with it. From TypeScript, trigger that revert twice: once
 *   passing viem the full ABI, and once passing an ABI with the error definition stripped out.
 *   In both cases catch the thrown error and walk its `cause` chain rather than reading
 *   `error.message`. Record what you get in each case, and write one paragraph explaining the
 *   difference in terms of where decoding information lives.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - The error cause chain — Every viem error extends BaseError and wraps a cause chain;
 *     error.walk(fn) finds the specific class instead of matching strings.
 *   - Typed revert data — ContractFunctionRevertedError exposes errorName and args only when
 *     that error is in the ABI you passed.
 *   - Simulate, then write — simulateContract runs the call against pending state and returns
 *     a `request` you hand straight to writeContract.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const typedRevertUnimplemented = true;
