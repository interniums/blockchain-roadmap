/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-error-surfaces-five-failure-paths  (break, difficulty 3)
 * Exercised by: test/decode-five.test.ts
 * Run:      forge test --match-path test/FiveReverts.t.sol -vv && pnpm vitest run test/decode-five.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Deploy a contract exposing five failure paths: a `require` with a string message, a custom
 *   error carrying arguments, a failed `assert`, an out-of-bounds array read, and a call to an
 *   address holding no code. Capture the raw revert bytes for each. Build a five-row table
 *   mapping raw hex to selector to decoded meaning, using `cast sig`, `cast decode-error` and
 *   viem's `decodeErrorResult`, and explain why exactly one row has no selector at all.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - The four shapes of revert data — Empty, Error(string) at 0x08c379a0, Panic(uint256) at
 *     0x4e487b71, or a custom error - any other selector plus encoded arguments.
 *   - Error(string) is the legacy path — require with a message and revert with a string
 *     produce Error(string) - the pre-0.8.4 default, paying for the text in both bytecode and
 *     calldata.
 *   - A custom error on the wire — error Foo(uint256 a) encodes as the first four bytes of
 *     keccak of its canonical signature followed by the ABI-encoded arguments.
 *   - Panic codes — Panic(uint256) signals a language-level invariant break, with a numeric
 *     code identifying which one.
 *   - Zero bytes, many causes — Empty revert data has several unrelated causes that are
 *     indistinguishable from the data alone.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const decodeFiveUnimplemented = true;
