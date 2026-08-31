/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: altvm-move-one-language-two-state-models  (measure, difficulty 3)
 * Exercised by: test/move-state-models.test.ts
 * Run:      npx vitest run test/move-state-models.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
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
 * The 3 concepts this has to end up demonstrating:
 *   - There is no single Move — Aptos Move keeps account-rooted global storage; Sui Move
 *     removed global storage for an object model.
 *   - Aptos global storage — Resources live inside accounts and are addressed by (account
 *     address, type), at most one per type per account.
 *   - Sui objects — Every stateful thing is an object with a unique id, passed explicitly into
 *     transactions rather than fetched.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const moveStateModelsUnimplemented = true;
