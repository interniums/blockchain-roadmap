// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-fork-testing-capstone-a-moment-you-can-return-to  (implement, difficulty 4)
 * Exercised by: test/capstone/ForkMoment.t.sol
 * Run:      forge test --junit --match-path test/capstone/ForkMoment.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Pick a real event on mainnet — a large swap, a liquidation, an exploit — and build a suite
 *   that reproduces the moment before it, runs your own code against that state, and does so
 *   identically on a machine with no network. PIN AND REPRODUCE. Fork at the block before your
 *   chosen event. Run your code against real deployed contracts, not mocks. Then delete the
 *   cache, run again with the network on, and assert the same result. Then run a third time with
 *   the network OFF and assert the same result again. All three numbers go in the write-up.
 *   PROVE IT IS LAZY. Show that a fork is not a download: count the RPC requests your suite
 *   makes, then add one storage read to your test and show the count go up by a specific amount.
 *   State what that implies about the cost of a large fork suite. TWO WORLDS. Create two forks
 *   in one test at different blocks and show their state is isolated — the same contract holding
 *   different values. Then make one address persistent across both and show what changes. MOVE
 *   THROUGH TIME. Use roll-fork to advance past your event and assert the state changed the way
 *   the real chain did. Then use vm.transact to replay the actual transaction and compare your
 *   prediction against what really happened. Any difference is a finding, not an error. THE
 *   BILL. Report the RPC request count, the wall-clock time cold and warm, and an estimate of
 *   what running this suite a hundred times a day would cost at your provider's prices. Then
 *   state whether an archive node was required and why. CI. Get the suite green in CI with a
 *   restored cache, and report the time saved against a cold run.
 *
 * The 15 concepts this has to end up demonstrating:
 *   - What fork testing is for — Running your contracts against the real deployed state of a
 *     live chain instead of against mocks you wrote yourself.
 *   - State is fetched lazily, per slot — The local EVM starts empty and fetches accounts,
 *     code and storage slots over RPC the first time each is touched.
 *   - Forking from inside a test — vm.createFork returns a fork id, vm.selectFork activates
 *     one, vm.createSelectFork does both, vm.activeFork reports the current one.
 *   - Several forks in one test — Multiple forks coexist with independent state, so one test
 *     can compare or coordinate across chains.
 *   - Switching forks switches the whole world — Each fork id carries its own state, so a
 *     contract deployed while fork A was active does not exist under fork B.
 *   - Persistent accounts — vm.makePersistent(addr) marks accounts whose state survives fork
 *     switches; by default only the test contract and the caller are persistent.
 *   - rollFork moves the fork, roll does not — vm.rollFork(n) moves a fork to another block
 *     and changes the real state it reads; vm.roll only rewrites block.number locally.
 *   - Replaying a real transaction — vm.transact(txHash) executes a real historical
 *     transaction inside the fork, so a test can reproduce an exploit verbatim.
 *   - Pin the block — An unpinned fork tracks latest, so the same test runs against different
 *     state every hour and goes red for reasons unrelated to your code.
 *   - The cache is keyed by chain and block — Cached state is keyed by chain id and block
 *     number, so an unpinned "latest" fork essentially never hits cache.
 *   - Controlling what gets cached — no_storage_caching disables RPC caching entirely; the
 *     [rpc_storage_caching] block selects which chains and which endpoints are cached.
 *   - Old blocks need an archive node — Reading state at a block outside a node's retention
 *     window requires an archive node; pruned and free public endpoints error out.
 *   - Fork tests are billed per slot, not per test — A forked suite issues a request for every
 *     uncached account, code and storage slot it touches, which is how it exhausts free tiers.
 *   - Restoring the fork cache in CI — Persisting ~/.foundry/cache keyed on the pinned block
 *     turns a forked suite from a per-run RPC bill into a nearly offline run.
 *   - Keep the forked suite thin — Even cached, forked tests are far slower than local ones,
 *     so the pattern is a fast local suite plus a small, separately-tagged fork suite.
 */
contract ForkMoment {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
