/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: altvm-move-one-language-two-state-models  (measure, grain block, difficulty 3)
 * Run:      npx vitest run test/move-state-models.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   There is no single Move. The Aptos lineage keeps global storage keyed by account address,
 *   where a module reaches into an account and reads a resource stored under it. Sui has no such
 *   storage: everything is an object with an id and an owner, and a transaction names the
 *   objects it touches. Model both. Implement two small state stores in TypeScript, one
 *   address-keyed and one object- keyed with an owner field, then run the same three operations
 *   through each: create an asset, transfer it, and read a third party's asset. Record, for each
 *   operation in each model, what the transaction has to name up front and whose signature it
 *   needs. The third-party read is where the models diverge most visibly, so make that the row
 *   you can explain. Then write down which of the two you would find easier to reason about as
 *   an auditor, in one sentence that does not use the word simpler.
 *
 * Your code goes in src/altvm-move/MoveStateModels.ts. Nothing here imports it yet — a
 * TypeScript module is its named exports, and this scaffold does not invent them. Export what
 * the exercise needs, then import it above.
 */
import { describe, it, expect } from 'vitest';

describe('One language, two places state lives', () => {
  // Two state stores are implemented, one keyed by account address and one keyed by object id
  // with an explicit owner field
  it('01 — Two state stores are implemented, one keyed by account address and one…', () => {
    expect.fail('Two state stores are implemented, one keyed by account address and one keyed by object id with an explicit owner field');
  });

  // The same three operations run against both models, with tests asserting the outcome of each
  it('02 — The same three operations run against both models, with tests asserting…', () => {
    expect.fail('The same three operations run against both models, with tests asserting the outcome of each');
  });

  // A table records, per operation per model, what the transaction must name up front and whose
  // signature it requires
  it('03 — A table records, per operation per model, what the transaction must…', () => {
    expect.fail('A table records, per operation per model, what the transaction must name up front and whose signature it requires');
  });

  // A test shows the third-party read behaving differently between the models, with the
  // difference asserted rather than described in prose
  it('04 — A test shows the third-party read behaving differently between the…', () => {
    expect.fail('A test shows the third-party read behaving differently between the models, with the difference asserted rather than described in prose');
  });

  // One sentence states which model is easier to audit and why, without using the word simpler
  it('05 — One sentence states which model is easier to audit and why, without…', () => {
    expect.fail('One sentence states which model is easier to audit and why, without using the word simpler');
  });
});
