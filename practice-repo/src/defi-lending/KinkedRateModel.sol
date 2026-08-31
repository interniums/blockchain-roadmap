// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-lending-kinked-rate-model  (implement, difficulty 3)
 * Exercised by: test/KinkedRateModel.t.sol
 * Run:      forge test --match-path test/KinkedRateModel.t.sol -vv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Implement a KinkedRateModel contract with configurable base rate, slope1, slope2, optimal
 *   utilisation and reserve factor, exposing borrowRate(U) and supplyRate(U). Use ray or wad
 *   fixed point throughout and document your unit convention at the top of the file. Then write
 *   a Foundry fuzz suite that establishes the model's properties rather than spot-checking
 *   values: monotonicity of the borrow rate in utilisation, continuity at the kink, and the
 *   relationship between supply and borrow rates. Finally add a test that instantiates the
 *   parameters of a real Aave v3 reserve and reproduces its published borrow and supply rates at
 *   that reserve's current utilisation.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Utilisation — Total borrows divided by total supplied — the one state variable that both
 *     prices money and determines whether suppliers can leave.
 *   - The kinked rate curve — A two-slope borrow rate whose second slope is deliberately
 *     brutal, so price rather than a queue rations the last units of liquidity.
 *   - Where the supply rate comes from — Supply rate equals borrow rate times utilisation
 *     times one minus the reserve factor — nobody sets it.
 */
contract KinkedRateModel {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
