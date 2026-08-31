/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-viem-error-with-and-without-abi  (break, grain block, difficulty 3)
 * Run:      pnpm vitest run test/typed-revert.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Deploy a contract declaring `error InsufficientBalance(uint256 available, uint256 required)`
 *   and a function that reverts with it. From TypeScript, trigger that revert twice: once
 *   passing viem the full ABI, and once passing an ABI with the error definition stripped out.
 *   In both cases catch the thrown error and walk its `cause` chain rather than reading
 *   `error.message`. Record what you get in each case, and write one paragraph explaining the
 *   difference in terms of where decoding information lives.
 *
 * Your code goes in src/app-viem/TypedRevert.ts. Nothing here imports it yet — a TypeScript
 * module is its named exports, and this scaffold does not invent them. Export what the
 * exercise needs, then import it above.
 */
import { describe, it, expect } from 'vitest';

describe('The same revert, decoded and undecoded', () => {
  // With the full ABI, the test asserts the walked error is a `ContractFunctionRevertedError`
  // whose `data.errorName` is `InsufficientBalance` and whose `data.args` are the two expected
  // numbers
  it('01 — With the full ABI, the test asserts the walked error is a…', () => {
    expect.fail('With the full ABI, the test asserts the walked error is a `ContractFunctionRevertedError` whose `data.errorName` is `InsufficientBalance` and whose `data.args` are the two expected numbers');
  });

  // With the stripped ABI, the test asserts no `errorName` is available and the raw revert data
  // is present as hex
  it('02 — With the stripped ABI, the test asserts no `errorName` is available and…', () => {
    expect.fail('With the stripped ABI, the test asserts no `errorName` is available and the raw revert data is present as hex');
  });

  // Neither branch of the test matches on any substring of `error.message`
  it('03 — Neither branch of the test matches on any substring of `error.message`', () => {
    expect.fail('Neither branch of the test matches on any substring of `error.message`');
  });
});
