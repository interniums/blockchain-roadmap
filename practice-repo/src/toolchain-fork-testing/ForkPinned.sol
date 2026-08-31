// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-fork-testing-pinned-whale  (implement, difficulty 3)
 * Exercised by: test/ForkPinned.t.sol
 * Run:      forge test --junit --match-path test/ForkPinned.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write a test that forks mainnet at an explicitly pinned block, reads a real USDC balance of
 *   a known large holder through the live token contract, pranks that holder to move funds into
 *   a contract of yours, and asserts on the result. Reference the endpoint through an
 *   `[rpc_endpoints]` alias with the URL supplied by an environment variable — no keyed URL in
 *   source. Time the first run and the second. Then clear Foundry's cache directory and time a
 *   third run. Finally, remove the pin, run twice, and record what changes.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - What fork testing is for — Running your contracts against the real deployed state of a
 *     live chain instead of against mocks you wrote yourself.
 *   - State is fetched lazily, per slot — The local EVM starts empty and fetches accounts,
 *     code and storage slots over RPC the first time each is touched.
 *   - Pin the block — An unpinned fork tracks latest, so the same test runs against different
 *     state every hour and goes red for reasons unrelated to your code.
 *   - The cache is keyed by chain and block — Cached state is keyed by chain id and block
 *     number, so an unpinned "latest" fork essentially never hits cache.
 *   - Naming your endpoints — [rpc_endpoints] maps aliases to URLs with ${ENV_VAR}
 *     interpolation, so tests say `mainnet` instead of embedding a keyed URL.
 */
contract ForkPinned {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
