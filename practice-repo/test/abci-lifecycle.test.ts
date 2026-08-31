/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: altvm-cosmos-abci-in-one-file  (implement, grain block, difficulty 4)
 * Run:      npx vitest run test/abci-lifecycle.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   ABCI is a strict request/response interface between the consensus engine and the
 *   application. Three calls carry the work: CheckTx validates transactions before they enter
 *   the mempool, FinalizeBlock is invoked after consensus is reached and is where state
 *   transitions occur, and Commit persists the finalised state to local disk. Implement that
 *   seam. Write a consensus driver that calls those three in order and an application that
 *   implements them, with one SDK-style module owning a slice of state and its own message
 *   handler. Make the boundary real: the application must not be able to reach the mempool, and
 *   the driver must not know what a message means. Then show what instant finality is. A block
 *   that has been committed is final; there is no confirmation depth to wait for and no
 *   probabilistic reasoning to do. Assert that, and contrast it with a reorg test your driver
 *   should be unable to perform. Finally, add a second module that interprets a message as
 *   arbitrary bytecode rather than a typed message, and note in a comment why that layer is
 *   optional here when it is mandatory on a shared chain.
 *
 * Your code goes in src/altvm-cosmos/AbciLifecycle.ts. Nothing here imports it yet — a
 * TypeScript module is its named exports, and this scaffold does not invent them. Export what
 * the exercise needs, then import it above.
 */
import { describe, it, expect } from 'vitest';

describe('The seam between consensus and your application', () => {
  // CheckTx, FinalizeBlock and Commit are implemented as separate functions, and a test asserts
  // a transaction rejected by CheckTx never reaches FinalizeBlock
  it('01 — CheckTx, FinalizeBlock and Commit are implemented as separate…', () => {
    expect.fail('CheckTx, FinalizeBlock and Commit are implemented as separate functions, and a test asserts a transaction rejected by CheckTx never reaches FinalizeBlock');
  });

  // State transitions happen only in FinalizeBlock, asserted by checking state is unchanged
  // after CheckTx alone
  it('02 — State transitions happen only in FinalizeBlock, asserted by checking…', () => {
    expect.fail('State transitions happen only in FinalizeBlock, asserted by checking state is unchanged after CheckTx alone');
  });

  // Commit persists a state root, and a test asserts a committed block cannot be reverted by the
  // driver
  it('03 — Commit persists a state root, and a test asserts a committed block…', () => {
    expect.fail('Commit persists a state root, and a test asserts a committed block cannot be reverted by the driver');
  });

  // One SDK-style module owns its slice of state and its own handler, and a test asserts the
  // driver never inspects message contents
  it('04 — One SDK-style module owns its slice of state and its own handler, and a…', () => {
    expect.fail('One SDK-style module owns its slice of state and its own handler, and a test asserts the driver never inspects message contents');
  });

  // A second module interprets a message as bytecode rather than a typed message, with a comment
  // on why that layer is optional here
  it('05 — A second module interprets a message as bytecode rather than a typed…', () => {
    expect.fail('A second module interprets a message as bytecode rather than a typed message, with a comment on why that layer is optional here');
  });

  // A test asserts a committed height is final with no confirmation depth, and a second test
  // shows the reorg the driver cannot perform
  it('06 — A test asserts a committed height is final with no confirmation depth,…', () => {
    expect.fail('A test asserts a committed height is final with no confirmation depth, and a second test shows the reorg the driver cannot perform');
  });
});
