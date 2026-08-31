// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: security-fuzzing-differential-math  (implement, difficulty 3)
 * Exercised by: test/DifferentialMath.t.sol
 * Run:      forge test --junit --match-path test/DifferentialMath.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write your own fixed-point helpers - a full-precision mulDiv, a square root, and one of exp
 *   or log - then build an assertion-mode differential harness comparing each against an
 *   established library implementation over the same symbolic inputs. Where the two disagree,
 *   decide which is right and write down why; where you believe they cannot disagree, write the
 *   argument. Add round-trip properties on the pairs that have inverses. The deliverable is
 *   either at least one genuine disagreement, or a written argument for equivalence precise
 *   enough that someone could attack it.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Differential fuzzing — Run the same inputs through two implementations and assert equal
 *     outputs; the oracle is the other implementation.
 *   - Reference model — The second implementation in a differential test — a prior version, a
 *     trusted library, or a model in another language.
 *   - Assertion mode — Properties expressed as assertions inside the call, so mid-call state
 *     and the call's own arguments are in scope.
 *   - Round-trip property — Decoding an encoding returns the original, and withdrawing a
 *     deposit never returns more than was put in.
 */
contract DifferentialMath {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
