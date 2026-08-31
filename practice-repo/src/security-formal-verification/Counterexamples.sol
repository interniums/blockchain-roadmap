// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: security-formal-verification-halmos-on-existing-tests  (implement, difficulty 3)
 * Exercised by: test/Counterexamples.t.sol
 * Run:      bash -c 'set -e; halmos --match-contract MathSpec --loop 4 | tee halmos.log; forge test --junit --match-path test/Counterexamples.t.sol'
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Take an existing Foundry test suite for a fixed-point maths library. Convert its tests into
 *   symbolic checks - rename them to the tool's check prefix, replace every concrete literal
 *   with a symbolic parameter, and add the preconditions that make the original scenario a
 *   special case rather than the whole claim. Run the checker with an explicit loop bound. Find
 *   at least one input class the concrete tests never covered, reproduce the counterexample as
 *   an ordinary Foundry test so it is readable by someone who does not use the tool, and record
 *   the bound you ran under next to each result.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Specification by test reuse — Turn existing Foundry tests into specifications by making
 *     their inputs symbolic — near-zero adoption cost, weaker properties.
 *   - Counterexample — The solver's witness when a property fails — a concrete input and state
 *     that violates it.
 *   - Bounded verification — Verification up to N loop iterations and N call depth — sound
 *     inside the bound, silent outside it.
 *   - SMT solver — The engine that decides whether the accumulated constraints have a
 *     satisfying assignment; every verification tool compiles into one.
 */
contract Counterexamples {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
