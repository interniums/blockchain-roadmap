/**
 * SPECIFICATION — slashing arithmetic.
 *
 * Practice: fundamentals-incentives-implement-the-slashing-formula
 * Acceptance: npx vitest run test/slashing.test.ts
 *
 * These fail until src/incentives/slashing.ts is implemented. Read them as the spec.
 *
 * This file lives at the repo root rather than under test/incentives/ because the
 * practice's acceptance command names this exact path.
 *
 * A note on what these tests can and cannot decide for you: the practice asks which of two
 * candidate correlation formulas is actually live. These tests deliberately do NOT answer
 * that. They check both forms behave as each form claims, and they check the one point
 * where the two agree. Deciding which is live is your reading of `process_slashings`, and
 * "I could not tell, here is what would settle it" is an accepted answer.
 */
import { describe, it, expect } from 'vitest';
import {
  EFFECTIVE_BALANCE_INCREMENT,
  EPOCHS_PER_SLASHINGS_VECTOR,
  MIN_SLASHING_PENALTY_QUOTIENT,
  PROPORTIONAL_SLASHING_MULTIPLIER,
  SPEC_CONSTANTS,
  UNCITED,
  curve,
  penalty,
} from '../src/incentives/slashing';
import type { CorrelationForm } from '../src/incentives/slashing';

const GWEI_PER_ETH = BigInt(1_000_000_000);
const eth = (n: number): bigint => BigInt(n) * GWEI_PER_ETH;

const EB = eth(32); // one validator's effective balance
const TB = eth(33_000_000); // total active effective balance
const FORMS: CorrelationForm[] = ['linear', 'quadratic'];

describe('constants are cited, not guessed', () => {
  /**
   * Acceptance: "Every constant used is annotated with the consensus-specs file and symbol
   * it came from." This test is what makes that criterion mechanical rather than a matter
   * of opinion. It fails until you have actually opened the specs.
   */
  it('every constant names a real consensus-specs file', () => {
    for (const c of SPEC_CONSTANTS) {
      expect(c.specFile).not.toBe(UNCITED);
      expect(c.specFile).toMatch(/^specs\/.+\.md$/);
    }
  });

  it('every constant names the symbol it was taken from', () => {
    for (const c of SPEC_CONSTANTS) {
      expect(c.symbol).not.toBe('TODO');
      expect(c.symbol).toMatch(/^[A-Z][A-Z0-9_]+$/);
    }
  });

  it('every constant has a non-zero value', () => {
    for (const c of SPEC_CONSTANTS) {
      expect(c.value > BigInt(0)).toBe(true);
    }
  });

  it('the four constants are distinct symbols', () => {
    const symbols = [
      MIN_SLASHING_PENALTY_QUOTIENT.symbol,
      PROPORTIONAL_SLASHING_MULTIPLIER.symbol,
      EFFECTIVE_BALANCE_INCREMENT.symbol,
      EPOCHS_PER_SLASHINGS_VECTOR.symbol,
    ];
    expect(new Set(symbols).size).toBe(4);
  });
});

describe('the two terms are reported separately', () => {
  it('total is exactly initial plus correlation', () => {
    for (const form of FORMS) {
      const p = penalty(EB, eth(1_000), TB, form);
      expect(p.totalGwei).toBe(p.initialGwei + p.correlationGwei);
    }
  });

  it('the initial penalty does not depend on what anyone else did', () => {
    const alone = penalty(EB, EB, TB, 'linear');
    const crowded = penalty(EB, TB / BigInt(4), TB, 'linear');
    expect(alone.initialGwei).toBe(crowded.initialGwei);
  });

  it('the initial penalty is effective balance over its quotient', () => {
    const p = penalty(EB, EB, TB, 'linear');
    expect(p.initialGwei).toBe(EB / MIN_SLASHING_PENALTY_QUOTIENT.value);
  });
});

describe('slashing is anti-correlation, not anti-error', () => {
  /**
   * This is the design claim of the whole module, stated as arithmetic. A lone offender
   * pays a rounding error; a coordinated third of the network pays everything.
   */
  it('a lone slashing costs a small fraction of the stake', () => {
    for (const form of FORMS) {
      const p = penalty(EB, EB, TB, form);
      expect(p.totalGwei).toBeLessThan(EB / BigInt(10));
    }
  });

  it('the correlation term is near zero when almost nobody else was slashed', () => {
    for (const form of FORMS) {
      expect(penalty(EB, EB, TB, form).correlationGwei).toBeLessThan(EB / BigInt(1_000));
    }
  });

  it('the correlation term grows monotonically with correlated stake', () => {
    for (const form of FORMS) {
      const fractions = [1, 2, 4, 8, 16, 32];
      let previous = BigInt(-1);
      for (const denominator of fractions.slice().reverse()) {
        const current = penalty(EB, TB / BigInt(denominator * 3), TB, form).correlationGwei;
        expect(current >= previous).toBe(true);
        previous = current;
      }
    }
  });

  it('is zero-correlation when no other stake was slashed in the window', () => {
    for (const form of FORMS) {
      expect(penalty(EB, BigInt(0), TB, form).correlationGwei).toBe(BigInt(0));
    }
  });
});

describe('the one-third point, where both candidate formulas agree', () => {
  /**
   * Acceptance: "The function returns effectiveBalance exactly when
   * slashedBalanceInWindow equals totalBalance divided by three, under both candidate
   * formulas."
   *
   *   linear     3 * EB * (TB/3) / TB      = EB
   *   quadratic  9 * EB * (TB/3)^2 / TB^2  = EB
   *
   * Both land on EB. That coincidence is why checking only this case tells you nothing
   * about which formula is live — which is exactly why the practice asks you to plot the
   * whole range.
   */
  it('the correlation term equals the full effective balance under both forms', () => {
    for (const form of FORMS) {
      expect(penalty(EB, TB / BigInt(3), TB, form).correlationGwei).toBe(EB);
    }
  });

  it('the two forms agree at exactly one third and nowhere else in the range', () => {
    const atThird = TB / BigInt(3);
    expect(penalty(EB, atThird, TB, 'linear').correlationGwei).toBe(
      penalty(EB, atThird, TB, 'quadratic').correlationGwei,
    );

    const atSixth = TB / BigInt(6);
    expect(penalty(EB, atSixth, TB, 'linear').correlationGwei).not.toBe(
      penalty(EB, atSixth, TB, 'quadratic').correlationGwei,
    );
  });

  it('below one third the quadratic form is the gentler of the two', () => {
    for (const denominator of [4, 6, 10, 100]) {
      const slashed = TB / BigInt(denominator);
      const lin = penalty(EB, slashed, TB, 'linear').correlationGwei;
      const quad = penalty(EB, slashed, TB, 'quadratic').correlationGwei;
      expect(quad < lin).toBe(true);
    }
  });
});

describe('integer arithmetic in Gwei', () => {
  /**
   * The practice's third hint: floating point passes your own tests and disagrees with the
   * spec at the edges. These tests are the edges.
   */
  it('returns bigints, not numbers', () => {
    const p = penalty(EB, eth(1_000), TB, 'linear');
    expect(typeof p.initialGwei).toBe('bigint');
    expect(typeof p.correlationGwei).toBe('bigint');
    expect(typeof p.totalGwei).toBe('bigint');
  });

  it('rounds down to a whole increment, per the spec\'s divide-then-multiply', () => {
    const p = penalty(EB, eth(7), TB, 'linear');
    expect(p.correlationGwei % EFFECTIVE_BALANCE_INCREMENT.value).toBe(BigInt(0));
  });

  it('never returns a negative penalty', () => {
    for (const form of FORMS) {
      const p = penalty(EB, BigInt(0), TB, form);
      expect(p.initialGwei >= BigInt(0)).toBe(true);
      expect(p.correlationGwei >= BigInt(0)).toBe(true);
    }
  });

  it('rejects a zero total balance rather than dividing by it', () => {
    expect(() => penalty(EB, BigInt(0), BigInt(0), 'linear')).toThrow();
  });

  it('rejects a slashed-in-window sum larger than the total', () => {
    expect(() => penalty(EB, TB + BigInt(1), TB, 'linear')).toThrow();
  });

  it('handles a post-EIP-7251 consolidated validator, not just 32 ETH', () => {
    const big = eth(2048);
    const p = penalty(big, TB / BigInt(3), TB, 'linear');
    expect(p.correlationGwei).toBe(big);
  });
});

describe('the curve the write-up plots', () => {
  it('spans zero to one third of total stake', () => {
    const points = curve(EB, TB, 'linear', 34);
    expect(points.length).toBeGreaterThan(1);
    expect(points[0].slashedFraction).toBeCloseTo(0, 6);
    expect(points[points.length - 1].slashedFraction).toBeCloseTo(1 / 3, 6);
  });

  it('reaches a penalty of the full effective balance at the right-hand end', () => {
    for (const form of FORMS) {
      const points = curve(EB, TB, form, 34);
      expect(points[points.length - 1].penaltyFraction).toBeCloseTo(1, 3);
    }
  });

  it('is monotonically non-decreasing', () => {
    for (const form of FORMS) {
      const points = curve(EB, TB, form, 34);
      for (let i = 1; i < points.length; i++) {
        expect(points[i].penaltyFraction).toBeGreaterThanOrEqual(points[i - 1].penaltyFraction);
      }
    }
  });

  it('the two curves diverge in the middle of the range — this is the finding', () => {
    const lin = curve(EB, TB, 'linear', 34);
    const quad = curve(EB, TB, 'quadratic', 34);
    const midpoint = Math.floor(lin.length / 2);
    expect(lin[midpoint].penaltyFraction).toBeGreaterThan(quad[midpoint].penaltyFraction);
  });
});
