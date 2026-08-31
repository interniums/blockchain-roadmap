/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: protocol-statelessness-measure-a-real-proof  (measure, grain block, difficulty 3)
 * Run:      npx tsx src/measure-proofs.ts --slots config/slots.json --out out/proofs.json && npx vitest run test/proofs.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Using a public archive RPC, fetch state proofs for a set of real storage slots — pick a
 *   widely used ERC-20 and prove several balance-mapping slots, plus a few account-level proofs.
 *   Measure the actual encoded byte size of each returned proof, and decompose it: how many
 *   bytes are the values, and how many are sibling hashes. Then compute what the same set of
 *   proofs would cost in a binary tree with the same number of leaves, from the sibling
 *   arithmetic alone. Finally, pull a recent mainnet block, count the distinct accounts and
 *   storage slots it touched, and produce an estimated full-block witness size under each
 *   structure. State clearly which of your numbers are measured and which are derived.
 *
 * Your code goes in src/protocol-statelessness/Proofs.ts. Nothing here imports it yet — a
 * TypeScript module is its named exports, and this scaffold does not invent them. Export what
 * the exercise needs, then import it above.
 */
import { describe, it, expect } from 'vitest';

describe('Measure a real state proof, then estimate its replacement', () => {
  // out/proofs.json records, per proof, the measured encoded byte size and the split between
  // values and sibling hashes
  it('01 — out/proofs.json records, per proof, the measured encoded byte size and…', () => {
    expect.fail('out/proofs.json records, per proof, the measured encoded byte size and the split between values and sibling hashes');
  });

  // A test asserts the sibling-byte count is consistent with the trie's arity and the observed
  // path depth, so the decomposition is checked rather than asserted
  it('02 — A test asserts the sibling-byte count is consistent with the trie\'s…', () => {
    expect.fail('A test asserts the sibling-byte count is consistent with the trie\'s arity and the observed path depth, so the decomposition is checked rather than asserted');
  });

  // A binary-tree estimate is computed for the same leaf count and the ratio to the measured
  // hexary size is reported
  it('03 — A binary-tree estimate is computed for the same leaf count and the…', () => {
    expect.fail('A binary-tree estimate is computed for the same leaf count and the ratio to the measured hexary size is reported');
  });

  // A full-block witness estimate is produced from a real block's touched-state count, with
  // measured and derived figures labelled separately
  it('04 — A full-block witness estimate is produced from a real block\'s…', () => {
    expect.fail('A full-block witness estimate is produced from a real block\'s touched-state count, with measured and derived figures labelled separately');
  });
});
