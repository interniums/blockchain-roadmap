/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-rpc-economics-failover-and-pin  (implement, grain block, difficulty 3)
 * Run:      pnpm vitest run tests/rpc-resilience --reporter=junit
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build a small dashboard backend that reads four values per refresh - a balance, a contract
 *   read, a log slice and the current head. Give it a fallback transport ranking two independent
 *   providers, with backoff and jitter on 429. Then implement the pinned-block pattern: read the
 *   block number once per refresh cycle and issue every subsequent read at that explicit number
 *   rather than at `latest`. Write two test harnesses: one that stubs provider A to return 429
 *   for every request, and one that stubs a fleet whose reported head oscillates between two
 *   heights across consecutive calls. The application must serve correct, mutually consistent
 *   data under both.
 */
import { describe, it, expect } from 'vitest';

describe('Survive a dead provider and a height that moves backwards', () => {
  // With provider A returning 429 for every request, the endpoint still returns correct data
  // sourced from provider B
  it('01 — With provider A returning 429 for every request, the endpoint still…', () => {
    expect.fail('With provider A returning 429 for every request, the endpoint still returns correct data sourced from provider B');
  });

  // All four reads in a single refresh cycle carry the same explicit block number, asserted at
  // the transport layer
  it('02 — All four reads in a single refresh cycle carry the same explicit block…', () => {
    expect.fail('All four reads in a single refresh cycle carry the same explicit block number, asserted at the transport layer');
  });

  // Against the oscillating-head stub, no refresh returns a mix of values from two different
  // blocks
  it('03 — Against the oscillating-head stub, no refresh returns a mix of values…', () => {
    expect.fail('Against the oscillating-head stub, no refresh returns a mix of values from two different blocks');
  });

  // The retry path is asserted to use exponential backoff with jitter, and a test proves it does
  // not retry immediately on 429
  it('04 — The retry path is asserted to use exponential backoff with jitter, and…', () => {
    expect.fail('The retry path is asserted to use exponential backoff with jitter, and a test proves it does not retry immediately on 429');
  });
});
