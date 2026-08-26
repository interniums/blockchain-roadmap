/**
 * SPECIFICATION — finality-reversal cost, and the rules about printing it.
 *
 * Practice: fundamentals-incentives-price-the-attack-live
 *
 * The acceptance command hits a live beacon source, so it cannot be a unit test. These
 * tests cover the two things that go wrong without a network: deriving stake from
 * validator count, and printing an unlabelled dollar figure.
 */
import { describe, it, expect } from 'vitest';
import {
  FINALITY_REVERSAL_STAKE_FRACTION,
  buildReport,
  finalityReversalCostEth,
} from '../../src/incentives/attack-cost';
import type { StakeSnapshot } from '../../src/incentives/attack-cost';

const snapshot = (over: Partial<StakeSnapshot> = {}): StakeSnapshot => ({
  totalStakedEth: 33_000_000,
  activeValidatorCount: 1_030_000,
  fetchedAtIso: '2026-08-25T12:00:00.000Z',
  sourceUrl: 'https://example-beacon.invalid/eth/v1/beacon/states/head/validator_balances',
  ...over,
});

describe('the threshold', () => {
  it('is one third of stake — the accountable-safety bound, not a majority', () => {
    expect(FINALITY_REVERSAL_STAKE_FRACTION).toBeCloseTo(1 / 3, 12);
  });

  it('scales linearly with staked supply', () => {
    expect(finalityReversalCostEth(33_000_000)).toBeCloseTo(11_000_000, 6);
    expect(finalityReversalCostEth(66_000_000)).toBeCloseTo(22_000_000, 6);
  });

  it('is zero at zero stake', () => {
    expect(finalityReversalCostEth(0)).toBe(0);
  });
});

describe('stake is read, not derived from validator count', () => {
  /**
   * The practice's first hint: since EIP-7251 raised MAX_EFFECTIVE_BALANCE to 2048 ETH,
   * count and stake have decoupled. Two snapshots with identical stake but wildly
   * different validator counts must price identically. An implementation that multiplies
   * count by 32 fails here and only here.
   */
  it('two snapshots with the same stake price identically regardless of validator count', () => {
    const many = buildReport({ snapshot: snapshot({ activeValidatorCount: 1_030_000 }) });
    const few = buildReport({ snapshot: snapshot({ activeValidatorCount: 200_000 }) });
    expect(many.finalityReversalCostEth).toBe(few.finalityReversalCostEth);
  });

  it('count x 32 is not the answer', () => {
    const report = buildReport({
      snapshot: snapshot({ totalStakedEth: 33_000_000, activeValidatorCount: 500_000 }),
    });
    expect(report.finalityReversalCostEth).not.toBeCloseTo((500_000 * 32) / 3, 0);
    expect(report.finalityReversalCostEth).toBeCloseTo(11_000_000, 0);
  });
});

describe('provenance is part of the output', () => {
  it('carries stake, count, the derived figure, the fetch time and the source URL', () => {
    const report = buildReport({ snapshot: snapshot() });
    expect(report.totalStakedEth).toBe(33_000_000);
    expect(report.activeValidatorCount).toBe(1_030_000);
    expect(report.finalityReversalCostEth).toBeCloseTo(11_000_000, 6);
    expect(report.fetchedAtIso).toBe('2026-08-25T12:00:00.000Z');
    expect(report.sourceUrl).toMatch(/^https?:\/\//);
  });
});

describe('fiat is gated', () => {
  it('omits fiat entirely when no price was supplied', () => {
    // Acceptance: "Running without a --eth-price argument prints no fiat figure and exits
    // successfully." Absent, not zero, not null.
    const report = buildReport({ snapshot: snapshot() });
    expect(report.fiat).toBeUndefined();
    expect(JSON.stringify(report)).not.toMatch(/usd/i);
  });

  it('labels fiat as derived and echoes the price and its timestamp', () => {
    const report = buildReport({
      snapshot: snapshot(),
      ethPriceUsd: 4_000,
      pricedAtIso: '2026-08-25T12:00:05.000Z',
    });
    expect(report.fiat).toBeDefined();
    expect(report.fiat?.derived).toBe(true);
    expect(report.fiat?.ethPriceUsd).toBe(4_000);
    expect(report.fiat?.pricedAtIso).toBe('2026-08-25T12:00:05.000Z');
    expect(report.fiat?.costUsd).toBeCloseTo(44_000_000_000, 0);
  });

  it('refuses an unstamped price — a dollar figure with no time on it is not a figure', () => {
    expect(() => buildReport({ snapshot: snapshot(), ethPriceUsd: 4_000 })).toThrow();
  });

  it('still reports the ETH figure when fiat is refused', () => {
    const report = buildReport({ snapshot: snapshot() });
    expect(report.finalityReversalCostEth).toBeGreaterThan(0);
  });
});
