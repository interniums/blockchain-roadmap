// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-hooks-malicious-hook  (break, difficulty 5)
 * Exercised by: test/MaliciousHook.t.sol
 * Run:      forge test --match-path test/MaliciousHook.t.sol -vv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build a Uniswap v4 hook that looks ordinary and extracts value from swappers. Mine a CREATE2
 *   salt so the deployed address carries the permission bits for the callbacks you need. In the
 *   swap callbacks, take a share of the swap beyond the pool's advertised fee, and route it to
 *   an address you control. Make the extraction conditional so that a naive static simulation
 *   from a fresh address does not reveal it — for example, exempt the first caller, or behave
 *   differently for a caller with no prior interaction. Then write, as a document in the
 *   repository, the checklist a user or router would have to run to detect this class of hook
 *   before trading, and honestly mark which of your checks your own hook would defeat.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - Hook — A contract bound to a pool at creation that the PoolManager calls at fixed
 *     lifecycle points such as beforeSwap and afterSwap.
 *   - Permission bits in the hook address — Which callbacks a hook receives is encoded in the
 *     low bits of its own address, so the address must be mined to match the intended
 *     permissions.
 *   - The hook is trusted code — A pool's hook can retax, reorder, degrade or block swaps, so
 *     choosing a pool is choosing whose code to trust.
 */
contract MaliciousHook {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
