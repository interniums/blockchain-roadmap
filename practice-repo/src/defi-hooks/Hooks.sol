// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-hooks-owing-the-pool  (implement, difficulty 3)
 * Exercised by: test/Hooks.t.sol
 * Run:      forge test --junit --match-path test/Hooks.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Two structural changes that alter what integrating with a pool means. NO DEPLOYMENT. Create
 *   a new pool and show that nothing was deployed: report the address you interact with, before
 *   and after, and show it unchanged. Then state what that does to two things — the gas cost of
 *   creating a pool, and the way you would index pools in a product. Report the creation cost,
 *   and say what an indexer keyed on contract addresses would now miss. OWE, DO NOT PAY.
 *   Implement a sequence that takes tokens out, does something, and settles at the end rather
 *   than paying per step. Show the intermediate state: a point at which you hold tokens you have
 *   not paid for, with the accounting recording a debt. Then fail to settle and show what
 *   happens. Then use it for something that was previously impossible or expensive: chain two
 *   swaps and a liquidity operation with a single net settlement, and compare the token transfer
 *   count against the same sequence done pay-as-you-go. Report both counts and the gas
 *   difference. Close with the risk this introduces: state what an integrator must now check
 *   that it did not have to before, given that the balance changes it observes mid-sequence do
 *   not mean what they used to.
 *
 * The 2 concepts this has to end up demonstrating:
 *   - The singleton PoolManager — v4 holds every pool inside one contract, so creating a pool
 *     is a state update rather than a contract deployment.
 *   - Flash accounting — Balances are tracked as deltas inside a lock and only the net amounts
 *     are actually transferred when it closes.
 */
contract Hooks {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
