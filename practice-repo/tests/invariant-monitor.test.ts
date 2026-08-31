/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-monitoring-invariant-to-production  (implement, grain module, difficulty 4)
 * Run:      forge test --junit --match-path test/VaultInvariant.t.sol && pnpm vitest run tests/invariant-monitor --reporter=junit
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Take a simple vault and write a Foundry invariant test asserting that total assets are never
 *   less than the sum of user shares valued at the current rate. Then write a TypeScript monitor
 *   that evaluates the identical predicate against a forked chain every block, batching its
 *   reads through multicall so one block costs one round trip. The predicate must exist in
 *   exactly one place - export it from a shared module or generate both from one definition - so
 *   the two cannot drift. Corrupt the vault's accounting on the fork with a storage write, and
 *   show the monitor reporting failure within one block. Make the failure output enriched: which
 *   term of the predicate broke, by how much, and the balance deltas that produced it.
 */
import { describe, it, expect } from 'vitest';

describe('Ship the same invariant to your test suite and to mainnet', () => {
  // The Foundry invariant test passes against the healthy vault and the monitor prints PASS
  // every block on a healthy fork
  it('01 — The Foundry invariant test passes against the healthy vault and the…', () => {
    expect.fail('The Foundry invariant test passes against the healthy vault and the monitor prints PASS every block on a healthy fork');
  });

  // After the storage corruption, the monitor reports FAIL within one block, and a test asserts
  // the detection latency
  it('02 — After the storage corruption, the monitor reports FAIL within one…', () => {
    expect.fail('After the storage corruption, the monitor reports FAIL within one block, and a test asserts the detection latency');
  });

  // A test proves the predicate is defined once, failing if the two implementations diverge
  it('03 — A test proves the predicate is defined once, failing if the two…', () => {
    expect.fail('A test proves the predicate is defined once, failing if the two implementations diverge');
  });

  // The failure output names the broken term, the magnitude of the breach, and the per-address
  // balance deltas
  it('04 — The failure output names the broken term, the magnitude of the breach,…', () => {
    expect.fail('The failure output names the broken term, the magnitude of the breach, and the per-address balance deltas');
  });
});
