/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-indexer-selection-factory-blind-spot  (break, grain module, difficulty 4)
 * Run:      forge script script/DeployFactory.s.sol --broadcast && pnpm vitest run tests/factory-indexing --reporter=junit
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Deploy a factory contract and several child contracts created by it on a local chain, and
 *   have the children emit swap-like events. Write an indexer that registers only the factory's
 *   creation event and not the children, so the child events are never subscribed to. Show
 *   exactly which events go missing and quantify them. Then fix it with the platform's
 *   dynamic-contract or template mechanism so children created at runtime are indexed from their
 *   creation block. Finally, add a value transfer that moves ETH through an internal call
 *   emitting no event, and demonstrate whether your chosen platform can see it at all.
 */
import { describe, it, expect } from 'vitest';

describe('Lose half your data to a factory you forgot to register', () => {
  // A test reports the exact count and identity of child-contract events missed by the
  // unregistered version
  it('01 — A test reports the exact count and identity of child-contract events…', () => {
    expect.fail('A test reports the exact count and identity of child-contract events missed by the unregistered version');
  });

  // After adding dynamic registration, every child event from its creation block onward appears
  // in the table
  it('02 — After adding dynamic registration, every child event from its creation…', () => {
    expect.fail('After adding dynamic registration, every child event from its creation block onward appears in the table');
  });

  // A written finding states whether the platform can observe the event-less internal transfer,
  // with the evidence
  it('03 — A written finding states whether the platform can observe the…', () => {
    expect.fail('A written finding states whether the platform can observe the event-less internal transfer, with the evidence');
  });

  // The write-up maps each finding onto one of the four capability gates and says which
  // platforms it would eliminate
  it('04 — The write-up maps each finding onto one of the four capability gates…', () => {
    expect.fail('The write-up maps each finding onto one of the four capability gates and says which platforms it would eliminate');
  });
});
