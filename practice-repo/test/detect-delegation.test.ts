/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-eoa-upgrade-detect-delegation-in-ui  (fix, grain block, difficulty 2)
 * Run:      pnpm vitest run test/detect-delegation.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
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
 * Your code goes in src/app-eoa-upgrade/DetectDelegation.ts. Nothing here imports it yet — a
 * TypeScript module is its named exports, and this scaffold does not invent them. Export what
 * the exercise needs, then import it above.
 */
import { describe, it, expect } from 'vitest';

describe('The check that used to mean "this is a person"', () => {
  // A test case with a delegated EOA fixture asserts the original check returns "contract" and
  // the new one returns "delegated" with the correct delegate address extracted
  it('01 — A test case with a delegated EOA fixture asserts the original check…', () => {
    expect.fail('A test case with a delegated EOA fixture asserts the original check returns "contract" and the new one returns "delegated" with the correct delegate address extracted');
  });

  // Plain EOA and ordinary contract fixtures still classify correctly under the new check
  it('02 — Plain EOA and ordinary contract fixtures still classify correctly under…', () => {
    expect.fail('Plain EOA and ordinary contract fixtures still classify correctly under the new check');
  });

  // The new implementation does not branch on code length alone anywhere
  it('03 — The new implementation does not branch on code length alone anywhere', () => {
    expect.fail('The new implementation does not branch on code length alone anywhere');
  });
});
