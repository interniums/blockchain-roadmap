/**
 * Pricing a finality reversal from live stake data.
 *
 * Practice: fundamentals-incentives-price-the-attack-live
 * Acceptance: node scripts/attack-cost.mjs --source beacon --out results/attack-cost.json
 *
 * The acceptance command runs a SCRIPT that fetches live data. This module is the part
 * that does not touch the network: the arithmetic, and the rules about what may be printed.
 *
 * TWO RULES THIS MODULE ENFORCES, BOTH OF WHICH ARE THE POINT OF THE EXERCISE
 *
 * 1. STAKE IS NOT VALIDATOR COUNT x 32. Since EIP-7251 raised the maximum effective
 *    balance to 2048 ETH, validator count and total stake have decoupled. Read the
 *    aggregate balance from your source. Deriving stake from the count is the single
 *    error this practice is built to catch.
 *
 * 2. NO UNLABELLED FIAT. A dollar figure is a derived estimate that goes stale in
 *    minutes. It may only appear when a price was explicitly supplied, and it must carry
 *    the price and the timestamp it was derived from.
 *
 * No solutions here.
 */

/**
 * Casper FFG's accountable-safety threshold. Reverting a finalised checkpoint requires
 * two conflicting supermajority links, which pins at least one third of stake as
 * provably equivocating and therefore slashable.
 *
 * This is the COST OF CORRUPTION — what an attacker forfeits. It is not the cost of
 * ACQUIRING the stake, and it is emphatically not the attacker's profit. Keep the three
 * apart in the memo.
 */
export const FINALITY_REVERSAL_STAKE_FRACTION = 1 / 3;

/** What the script read off the wire, with provenance attached. */
export interface StakeSnapshot {
  /** Aggregate effective balance across active validators, in ETH. */
  totalStakedEth: number;
  /** Active validator count. Reported for context; NOT an input to the cost. */
  activeValidatorCount: number;
  /** ISO 8601, from the moment of the fetch. */
  fetchedAtIso: string;
  /**
   * The exact URL the numbers came from.
   *
   * Reported August 2026 staked totals disagree between sources. Recording which one you
   * used is not bookkeeping — it is the difference between a number someone can check and
   * a number someone has to trust.
   */
  sourceUrl: string;
}

/** A fiat figure, only ever present when a price was supplied. */
export interface FiatEstimate {
  /** Always true. Present so the field cannot be read without seeing the label. */
  derived: true;
  ethPriceUsd: number;
  /** ISO 8601 of the price, echoed back so a stale price is visible. */
  pricedAtIso: string;
  costUsd: number;
}

export interface AttackCostReport extends StakeSnapshot {
  /** totalStakedEth * FINALITY_REVERSAL_STAKE_FRACTION */
  finalityReversalCostEth: number;
  /** Absent unless --eth-price was passed. */
  fiat?: FiatEstimate;
}

/** One third of the staked supply, in ETH. */
export function finalityReversalCostEth(_totalStakedEth: number): number {
  throw new Error('TODO: the fraction is above; do not reach for validator count');
}

export interface BuildReportOptions {
  snapshot: StakeSnapshot;
  /** Only supplied when the caller passed --eth-price. Undefined means: print no fiat. */
  ethPriceUsd?: number;
  /** ISO 8601 of the price. Required whenever ethPriceUsd is given. */
  pricedAtIso?: string;
}

/**
 * Build the JSON written to results/attack-cost.json.
 *
 * Must throw when `ethPriceUsd` is supplied without `pricedAtIso` — an unstamped price is
 * exactly the kind of number this exercise is trying to stop you from publishing.
 */
export function buildReport(_options: BuildReportOptions): AttackCostReport {
  throw new Error('TODO: always the ETH figure; fiat only when a stamped price was supplied');
}
