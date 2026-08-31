/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: protocol-epbs-diff-the-trust-model  (read, grain block, difficulty 2)
 * Run:      npx vitest run test/trust-model.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Read the current builder API specification and the MEV-Boost flow it defines, then read
 *   EIP-7732's specification section. Produce a machine-checkable comparison as JSON: for each
 *   step of block delivery, record who holds the payload, who can withhold it, who can censor at
 *   that step, who must be trusted, and what happens if that party fails. Do this once for the
 *   out-of-protocol flow and once for the enshrined flow, using the same step vocabulary for
 *   both so the two are diffable. Then write the diff: which rows vanish, which rows change
 *   hands, and which rows are unchanged. Cite the specific container or endpoint name behind
 *   each row.
 */
import { describe, it, expect } from 'vitest';

describe('Put the relay\'s job in a table, then delete the row', () => {
  // A JSON model of both flows exists with the same step keys in each, so a structural diff is
  // possible
  it('01 — A JSON model of both flows exists with the same step keys in each, so a…', () => {
    expect.fail('A JSON model of both flows exists with the same step keys in each, so a structural diff is possible');
  });

  // A test asserts every row carries a citation field naming a real container or endpoint from
  // the two specifications
  it('02 — A test asserts every row carries a citation field naming a real…', () => {
    expect.fail('A test asserts every row carries a citation field naming a real container or endpoint from the two specifications');
  });

  // A test asserts that the enshrined flow has no step whose trusted party is a relay, and that
  // at least one step changed which party can withhold
  it('03 — A test asserts that the enshrined flow has no step whose trusted party…', () => {
    expect.fail('A test asserts that the enshrined flow has no step whose trusted party is a relay, and that at least one step changed which party can withhold');
  });

  // The written diff explicitly identifies the row that unconditional payment removes, and the
  // new risk that appears in its place
  it('04 — The written diff explicitly identifies the row that unconditional…', () => {
    expect.fail('The written diff explicitly identifies the row that unconditional payment removes, and the new risk that appears in its place');
  });
});
