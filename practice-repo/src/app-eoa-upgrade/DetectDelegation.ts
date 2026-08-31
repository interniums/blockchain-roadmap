/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-eoa-upgrade-detect-delegation-in-ui  (fix, difficulty 2)
 * Exercised by: test/detect-delegation.test.ts
 * Run:      pnpm vitest run test/detect-delegation.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   You are given an app with a code path that treats an address as a user account when its code
 *   length is zero and as a contract otherwise, and which renders a different flow for each.
 *   Point it at a delegated EOA and show that it takes the wrong branch. Then replace the check
 *   with a proper detection that reads the account's code, recognises the delegation designator
 *   prefix, extracts the delegate address, and returns one of three answers: plain EOA,
 *   delegated EOA, or contract. Render all three distinctly, and show the delegate address for
 *   the middle case.
 *
 * The 2 concepts this has to end up demonstrating:
 *   - Detecting a delegated account — Read the account's code and check for the delegation
 *     designator prefix; do not ask whether code exists.
 *   - The wallet picks the code, not your app — In a wallet-mediated upgrade the wallet
 *     decides which delegate implementation the account points at; apps negotiate
 *     capabilities, not addresses.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const detectDelegationUnimplemented = true;
