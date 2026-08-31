/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-error-surfaces-five-failure-paths  (break, grain block, difficulty 3)
 * Run:      forge test --match-path test/FiveReverts.t.sol -vv && pnpm vitest run test/decode-five.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Deploy a contract exposing five failure paths: a `require` with a string message, a custom
 *   error carrying arguments, a failed `assert`, an out-of-bounds array read, and a call to an
 *   address holding no code. Capture the raw revert bytes for each. Build a five-row table
 *   mapping raw hex to selector to decoded meaning, using `cast sig`, `cast decode-error` and
 *   viem's `decodeErrorResult`, and explain why exactly one row has no selector at all.
 */
import { describe, it, expect } from 'vitest';

describe('Five failures, five byte strings', () => {
  // Both toolchains produce the same error name and arguments for every decodable row
  it('01 — Both toolchains produce the same error name and arguments for every…', () => {
    expect.fail('Both toolchains produce the same error name and arguments for every decodable row');
  });

  // The table records the two builtin selectors explicitly and identifies which panic code each
  // panic row produced
  it('02 — The table records the two builtin selectors explicitly and identifies…', () => {
    expect.fail('The table records the two builtin selectors explicitly and identifies which panic code each panic row produced');
  });

  // The written explanation identifies the no-selector row and lists at least three other causes
  // that produce the same empty data
  it('03 — The written explanation identifies the no-selector row and lists at…', () => {
    expect.fail('The written explanation identifies the no-selector row and lists at least three other causes that produce the same empty data');
  });
});
