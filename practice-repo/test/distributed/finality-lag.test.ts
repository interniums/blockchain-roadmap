/**
 * SPECIFICATION — finality lag analysis.
 *
 * Practice: fundamentals-distributed-measure-finality-lag
 *
 * The acceptance command for this practice is a live one-hour sampling run, which no unit
 * test can stand in for. What these tests pin down is the reasoning the run depends on, so
 * that when the hour is up you are not debugging your quantile function.
 *
 * Note in particular the test that a fixed 12-second slot assumption is NOT used. That is
 * the one the practice hints at, and the one that silently produces a plausible-looking
 * wrong answer.
 */
import { describe, it, expect } from 'vitest';
import {
  MIN_SAMPLES,
  NOMINAL_FINALITY_SLOTS,
  buildReport,
  distribution,
  flagExceedances,
  hasEnoughSamples,
  lagHeadToFinalized,
  lagHeadToSafe,
} from '../../src/distributed/finality-lag';
import type { FinalitySample } from '../../src/distributed/finality-lag';

/** A healthy sample: head 64 blocks and 768 seconds ahead of finalized. */
function healthy(index: number): FinalitySample {
  const headNumber = 20_000_000 + index;
  const headTs = 1_760_000_000 + index * 12;
  return {
    sampledAtMs: 1_760_000_000_000 + index * 12_000,
    latest: { number: headNumber, timestampSec: headTs },
    safe: { number: headNumber - 32, timestampSec: headTs - 384 },
    finalized: { number: headNumber - 64, timestampSec: headTs - 768 },
  };
}

describe('constants', () => {
  it('two epochs of 32 slots is the nominal finality distance', () => {
    expect(NOMINAL_FINALITY_SLOTS).toBe(64);
  });

  it('an hour of 12-second slots is ~300 samples, so the floor sits below that', () => {
    expect(MIN_SAMPLES).toBe(250);
    expect(MIN_SAMPLES).toBeLessThan(300);
  });
});

describe('lag is measured in both units', () => {
  it('reports the block gap between head and finalized', () => {
    expect(lagHeadToFinalized(healthy(0)).blocks).toBe(64);
  });

  it('reports the second gap between head and finalized', () => {
    expect(lagHeadToFinalized(healthy(0)).seconds).toBe(768);
  });

  it('reports the head-to-safe gap separately — safe is one epoch, not two', () => {
    expect(lagHeadToSafe(healthy(0)).blocks).toBe(32);
    expect(lagHeadToSafe(healthy(0)).seconds).toBe(384);
  });
});

describe('seconds come from observed timestamps, never from blocks * 12', () => {
  /**
   * This is the test the practice's second hint exists for.
   *
   * Missed slots mean the chain advanced fewer blocks than seconds/12 would suggest. Here
   * the head is 64 blocks ahead but 900 seconds ahead, because 11 slots were missed. A
   * implementation that multiplies the block gap by a constant slot time reports 768 and
   * quietly erases the event you spent an hour sampling to find.
   */
  it('a run with missed slots reports the real elapsed time, not blocks * 12', () => {
    const sample: FinalitySample = {
      sampledAtMs: 1_760_000_000_000,
      latest: { number: 20_000_064, timestampSec: 1_760_000_900 },
      safe: { number: 20_000_032, timestampSec: 1_760_000_450 },
      finalized: { number: 20_000_000, timestampSec: 1_760_000_000 },
    };
    const lag = lagHeadToFinalized(sample);
    expect(lag.blocks).toBe(64);
    expect(lag.seconds).toBe(900);
    expect(lag.seconds).not.toBe(768); // 64 * 12
  });
});

describe('distribution, not a mean', () => {
  it('reports the five order statistics the write-up quotes', () => {
    const d = distribution([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(d.count).toBe(10);
    expect(d.min).toBe(1);
    expect(d.max).toBe(10);
  });

  it('is monotonic: min <= p50 <= p90 <= p99 <= max', () => {
    const values = Array.from({ length: 300 }, (_, i) => (i === 299 ? 400 : 64 + (i % 5)));
    const d = distribution(values);
    expect(d.min).toBeLessThanOrEqual(d.p50);
    expect(d.p50).toBeLessThanOrEqual(d.p90);
    expect(d.p90).toBeLessThanOrEqual(d.p99);
    expect(d.p99).toBeLessThanOrEqual(d.max);
  });

  it('does not let a single outlier move the median — which is why the tail is reported separately', () => {
    const flat = Array.from({ length: 300 }, () => 64);
    const spiked = [...flat.slice(0, 299), 5_000];
    expect(distribution(spiked).p50).toBe(distribution(flat).p50);
    expect(distribution(spiked).max).toBe(5_000);
  });

  it('accepts unsorted input', () => {
    expect(distribution([5, 1, 4, 2, 3]).min).toBe(1);
    expect(distribution([5, 1, 4, 2, 3]).max).toBe(5);
  });

  it('rejects an empty sample rather than inventing a quantile', () => {
    expect(() => distribution([])).toThrow();
  });
});

describe('exceedance flagging', () => {
  it('flags nothing on a healthy run', () => {
    const samples = Array.from({ length: 300 }, (_, i) => healthy(i));
    expect(flagExceedances(samples)).toHaveLength(0);
  });

  it('flags a stall and carries its wall-clock timestamp', () => {
    const samples = Array.from({ length: 300 }, (_, i) => healthy(i));
    const stalled: FinalitySample = {
      ...healthy(150),
      finalized: { number: 20_000_150 - 200, timestampSec: 1_760_000_000 + 150 * 12 - 2_400 },
    };
    samples[150] = stalled;

    const flagged = flagExceedances(samples);
    expect(flagged).toHaveLength(1);
    // Acceptance: "flagged with its timestamp".
    expect(flagged[0].sampledAtMs).toBe(stalled.sampledAtMs);
    expect(flagged[0].lag.blocks).toBe(200);
    expect(flagged[0].nominalSlots).toBe(NOMINAL_FINALITY_SLOTS);
  });

  it('a lag of exactly the nominal distance is not an exceedance', () => {
    expect(flagExceedances([healthy(0)])).toHaveLength(0);
  });

  it('accepts an explicit threshold, so you can test your own reading of "nominal"', () => {
    expect(flagExceedances([healthy(0)], 32)).toHaveLength(1);
  });
});

describe('sample count floor', () => {
  it('rejects a short run', () => {
    expect(hasEnoughSamples(Array.from({ length: 249 }, (_, i) => healthy(i)))).toBe(false);
  });

  it('accepts a full run', () => {
    expect(hasEnoughSamples(Array.from({ length: 250 }, (_, i) => healthy(i)))).toBe(true);
  });

  it('buildReport refuses a short run rather than publishing a thin distribution', () => {
    expect(() => buildReport(Array.from({ length: 10 }, (_, i) => healthy(i)))).toThrow();
  });
});

describe('the report written to results/finality-lag.json', () => {
  it('carries both distributions and the exceedance list', () => {
    const report = buildReport(Array.from({ length: 300 }, (_, i) => healthy(i)));
    expect(report.sampleCount).toBe(300);
    expect(report.blocks.p50).toBe(64);
    expect(report.seconds.p50).toBe(768);
    expect(report.exceedances).toEqual([]);
  });
});
