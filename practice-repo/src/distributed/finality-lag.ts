/**
 * Finality lag: analysis of (latest, safe, finalized) samples.
 *
 * Practice: fundamentals-distributed-measure-finality-lag
 * Acceptance: node scripts/finality-lag.mjs --minutes 60 --out results/finality-lag.json
 *
 * The acceptance command runs a SCRIPT, not this module. The script is the I/O half: it
 * polls an RPC endpoint once per slot for an hour and writes JSON. Everything in this file
 * is the other half — the part that has an opinion, and therefore the part worth testing.
 *
 * Keep the split. A sampler that computes statistics inline is a sampler you cannot test
 * without waiting an hour.
 *
 * No solutions here. Every function throws. See test/distributed/finality-lag.test.ts.
 */

/** One block position, as reported by `eth_getBlockByNumber` for a tag. */
export interface BlockMarker {
  number: number;
  /** The block's OWN header timestamp, in seconds. Not your clock. */
  timestampSec: number;
}

/** One poll of all three tags, taken as close together as you can manage. */
export interface FinalitySample {
  /** Local wall clock at the moment of sampling, ms. Used to flag exceedances in time. */
  sampledAtMs: number;
  latest: BlockMarker;
  safe: BlockMarker;
  finalized: BlockMarker;
}

export interface Lag {
  /** latest.number - finalized.number */
  blocks: number;
  /**
   * latest.timestampSec - finalized.timestampSec.
   *
   * Derived from the OBSERVED header timestamps, never from `blocks * 12`. The hint in
   * the practice is explicit about this: assuming a fixed slot time hides missed slots,
   * which are exactly the events you are sampling for an hour to catch.
   */
  seconds: number;
}

/**
 * Acceptance: "At least 250 samples of (latest, safe, finalized) with local timestamps
 * are recorded." An hour at one sample per 12s slot is ~300, so 250 leaves room for a few
 * failed polls without invalidating the run.
 */
export const MIN_SAMPLES = 250;

/**
 * Casper FFG finalises two epochs behind under healthy conditions. 2 epochs x 32 slots.
 * This is the NOMINAL expectation, not a guarantee — the whole exercise is about finding
 * the samples that exceed it.
 */
export const NOMINAL_FINALITY_SLOTS = 64;

export function lagHeadToFinalized(_sample: FinalitySample): Lag {
  throw new Error('TODO: blocks from the numbers, seconds from the observed header timestamps');
}

export function lagHeadToSafe(_sample: FinalitySample): Lag {
  throw new Error('TODO: same shape, safe instead of finalized');
}

/**
 * A distribution, because a mean hides the tail and the tail is the finding.
 *
 * Acceptance: "Head-to-finalized lag is reported as a distribution in both blocks and
 * seconds, not a single mean." Report these; if you also want a mean, fine, but it is not
 * the answer to any question a confirmation policy asks.
 */
export interface Distribution {
  count: number;
  min: number;
  p50: number;
  p90: number;
  p99: number;
  max: number;
}

/**
 * Quantiles over an unsorted sample. State your interpolation convention in a comment —
 * nearest-rank and linear interpolation disagree at p99 on 300 samples, and you will be
 * quoting the p99 in a recommendation.
 */
export function distribution(_values: number[]): Distribution {
  throw new Error('TODO: sort, then pick quantiles by a convention you have written down');
}

/** Both distributions, in the two units the acceptance criteria require. */
export interface LagReport {
  sampleCount: number;
  blocks: Distribution;
  seconds: Distribution;
  exceedances: Exceedance[];
}

/** A sample where the head-to-finalized gap exceeded the nominal two-epoch expectation. */
export interface Exceedance {
  /** Acceptance requires the timestamp to be carried with the flag. */
  sampledAtMs: number;
  lag: Lag;
  nominalSlots: number;
}

/**
 * Acceptance: "Any sample exceeding the nominal two-epoch expectation is flagged with its
 * timestamp." Comparison is on blocks, against `nominalSlots`. Note this will produce
 * false positives whenever slots were missed — a missed slot means fewer blocks for the
 * same wall-clock gap. Decide whether you care, and say so in the write-up.
 */
export function flagExceedances(
  _samples: FinalitySample[],
  _nominalSlots?: number,
): Exceedance[] {
  throw new Error('TODO: compute the lag per sample, keep the ones over the threshold');
}

/** True once the run has enough samples for the distribution to mean anything. */
export function hasEnoughSamples(_samples: FinalitySample[]): boolean {
  throw new Error('TODO: MIN_SAMPLES');
}

/** Assemble the JSON the acceptance command writes to results/finality-lag.json. */
export function buildReport(_samples: FinalitySample[]): LagReport {
  throw new Error('TODO: reject a run with too few samples rather than reporting a thin one');
}
