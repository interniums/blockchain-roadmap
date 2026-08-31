/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-error-surfaces-to-user-message  (implement, difficulty 3)
 * Exercised by: test/to-user-message.test.ts
 * Run:      pnpm vitest run test/to-user-message.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write `toUserMessage(error)`. It walks a viem error's cause chain, decodes custom errors
 *   against a supplied set of ABIs covering every contract in your call path, classifies the
 *   failure into one of the four triage buckets, and returns a message that names what failed
 *   and the one thing the reader should do. Cover at least eight distinct failures: a decodable
 *   custom error, an undecodable one from a contract whose ABI you withheld, panic 0x11, panic
 *   0x32, an empty revert, insufficient funds, user rejection, and an RPC timeout.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Four buckets — Every chain error is user-can-fix, app bug, transient chain or wallet
 *     state, or user declined - and each gets different UI.
 *   - A message that names the next action — State what failed, why, and the one thing the
 *     user should do - raw hex, selectors and "execution reverted" fail all three tests.
 *   - Decoding in practice — decodeErrorResult({ abi, data }) turns revert bytes into
 *     errorName and args; BaseError.walk finds the error in the cause chain that carries them.
 *   - The reverting contract is often not the one you called — Errors defined in a library, a
 *     token, or the implementation behind a proxy need that contract's ABI, not the one you
 *     called.
 *   - The same failure looks different on every provider — RPC providers wrap, truncate and
 *     sometimes drop revert data, so an error that decodes locally can be opaque in
 *     production.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const toUserMessageUnimplemented = true;
