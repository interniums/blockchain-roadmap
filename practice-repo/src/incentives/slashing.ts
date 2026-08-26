/**
 * Slashing arithmetic, in Gwei, with integer semantics.
 *
 * Practice: fundamentals-incentives-implement-the-slashing-formula
 * Acceptance: npx vitest run test/slashing.test.ts
 *
 * WHAT SLASHING IS FOR
 *
 * The initial penalty is small and roughly fixed. The correlation penalty scales with how
 * much OTHER stake was slashed in the same window. That asymmetry is the whole design:
 * slashing is anti-CORRELATION, not anti-error. One validator double-signing because of a
 * misconfigured failover loses very little. Ten thousand validators double-signing
 * together because they all ran the same client on the same host lose everything. If your
 * implementation does not reproduce that gap, it is not modelling the incentive.
 *
 * WHY BIGINT
 *
 * The spec works in Gwei with integer division and increment rounding. Floating point
 * will pass tests you wrote yourself and disagree with the spec at the edges — which are
 * the only places anyone will ever check. Use bigint throughout.
 *
 * Note: bigint LITERALS (`32n`) are not available at this project's compile target, so
 * this file uses `BigInt(...)` calls. Same values, uglier.
 *
 * YOUR JOB: fill in the constants FROM ethereum/consensus-specs, citing file and symbol
 * for each, then implement `penalty`. Do not take constants from a blog post; several of
 * them changed across forks and the blog posts did not.
 */

/** A constant, plus where in the specs it came from. The citation is graded. */
export interface SpecConstant {
  value: bigint;
  /** e.g. 'specs/electra/beacon-chain.md' */
  specFile: string;
  /** e.g. 'MIN_SLASHING_PENALTY_QUOTIENT_ELECTRA' */
  symbol: string;
}

/** Placeholder marker. Every constant below must have this replaced with a real citation. */
export const UNCITED = 'TODO: cite consensus-specs file';

/**
 * Divisor for the initial penalty: `effective_balance / QUOTIENT`.
 * Look in `slash_validator`. The quotient is fork-specific — find the one that is live.
 */
export const MIN_SLASHING_PENALTY_QUOTIENT: SpecConstant = {
  value: BigInt(0),
  specFile: UNCITED,
  symbol: 'TODO',
};

/**
 * Multiplier applied to the slashed-in-window sum before the correlation penalty is
 * computed. Look in `process_slashings`. This is the constant that decides whether the
 * curve you plot is the linear one or the quadratic one.
 */
export const PROPORTIONAL_SLASHING_MULTIPLIER: SpecConstant = {
  value: BigInt(0),
  specFile: UNCITED,
  symbol: 'TODO',
};

/**
 * Rounding increment. The spec computes a penalty numerator, divides by total balance
 * INTEGER-wise, then multiplies back by this increment. That double step is where
 * floating point and the spec part company.
 */
export const EFFECTIVE_BALANCE_INCREMENT: SpecConstant = {
  value: BigInt(0),
  specFile: UNCITED,
  symbol: 'TODO',
};

/**
 * Length of the slashings window, in epochs. Determines what "slashed in the window"
 * means, and (at its midpoint) when the correlation penalty is actually applied.
 */
export const EPOCHS_PER_SLASHINGS_VECTOR: SpecConstant = {
  value: BigInt(0),
  specFile: UNCITED,
  symbol: 'TODO',
};

/** Every constant in one place, so the write-up can check them all are cited. */
export const SPEC_CONSTANTS: ReadonlyArray<SpecConstant> = [
  MIN_SLASHING_PENALTY_QUOTIENT,
  PROPORTIONAL_SLASHING_MULTIPLIER,
  EFFECTIVE_BALANCE_INCREMENT,
  EPOCHS_PER_SLASHINGS_VECTOR,
];

/**
 * The two candidate correlation formulas the practice asks you to plot against each other.
 *
 *   linear:     3 * EB * SB / TB
 *   quadratic:  9 * EB * SB^2 / TB^2
 *
 * Substitute SB = TB/3 into both before plotting anything — they meet there, which is why
 * the disagreement is invisible if you only ever check the one-third case.
 */
export type CorrelationForm = 'linear' | 'quadratic';

export interface PenaltyBreakdown {
  /** From `slash_validator`. Independent of what anyone else did. */
  initialGwei: bigint;
  /** From `process_slashings`. Scales with correlated stake. */
  correlationGwei: bigint;
  /** initialGwei + correlationGwei. */
  totalGwei: bigint;
}

/**
 * Compute both penalty terms, separately.
 *
 * Returning them separately is required: the whole finding of this exercise is how the two
 * behave differently as correlated stake grows, and a single total hides it.
 *
 * @param effectiveBalanceGwei         the slashed validator's effective balance
 * @param slashedBalanceInWindowGwei   total effective balance slashed within the window
 * @param totalBalanceGwei             total active effective balance
 * @param form                         which candidate correlation formula to apply
 */
export function penalty(
  _effectiveBalanceGwei: bigint,
  _slashedBalanceInWindowGwei: bigint,
  _totalBalanceGwei: bigint,
  _form: CorrelationForm,
): PenaltyBreakdown {
  throw new Error('TODO: integer arithmetic in Gwei, increment rounding, both terms separately');
}

/** One point on the curve the write-up plots. */
export interface CurvePoint {
  /** slashedBalanceInWindow / totalBalance, from 0 to 1/3. */
  slashedFraction: number;
  /** totalGwei / effectiveBalanceGwei, as a fraction. */
  penaltyFraction: number;
}

/**
 * Sample a correlation form across the range the practice asks you to plot.
 *
 * Acceptance: "A generated plot or table shows both curves from 0 to 1/3 of total stake
 * and marks where they diverge."
 */
export function curve(
  _effectiveBalanceGwei: bigint,
  _totalBalanceGwei: bigint,
  _form: CorrelationForm,
  _steps?: number,
): CurvePoint[] {
  throw new Error('TODO: sample slashedFraction from 0 to 1/3 and evaluate penalty at each');
}
