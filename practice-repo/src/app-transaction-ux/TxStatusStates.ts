/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-transaction-ux-six-state-component  (implement, difficulty 3)
 * Exercised by: tests/tx-status-states.spec.ts
 * Run:      pnpm playwright test tests/tx-status-states.spec.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build a transaction-status component that renders six distinct states - simulating, awaiting
 *   signature, pending, replaced with its reason, reverted, and confirmed at N - driven by
 *   `simulateContract` then `writeContract` then `waitForTransactionReceipt` with an
 *   `onReplaced` handler. Each state must have its own copy and its own affordances; a spinner
 *   counts as one state, not three. Make every one of the six reachable on Anvil.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - The transaction state machine — Constructed, simulated, signed, broadcast, pending,
 *     included, confirmed, finalized - plus replaced, dropped, and included-and-reverted.
 *   - Mined is not succeeded — A receipt with status reverted means the transaction was
 *     included, did nothing useful, and consumed gas.
 *   - Three kinds of replacement — viem classifies a replacement as repriced, cancelled, or
 *     replaced - and they are three different things to tell the user.
 *   - Simulate before you ask for a signature — Simulating against pending state converts most
 *     reverts into a message shown before the user signs anything.
 *   - Sending is not a request — Broadcasting returns only a hash; success, failure and
 *     never-happened are discovered later and are three distinct outcomes.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const txStatusStatesUnimplemented = true;
