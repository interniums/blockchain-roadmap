// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-simulation-rehearse-a-real-upgrade  (implement, difficulty 4)
 * Exercised by: test/UpgradeRehearsal.t.sol
 * Run:      forge test --junit --match-path test/UpgradeRehearsal.t.sol --fork-url $RPC_URL
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write a Foundry fork test that rehearses a proxy upgrade at a pinned recent block: fork,
 *   impersonate the proxy admin, execute the real upgrade calldata, then run an existing
 *   integration test against the upgraded proxy and diff the storage layout of the old and new
 *   implementations. Extend it into a full governance rehearsal - grant voting power by writing
 *   storage, propose, vote, queue, advance past the timelock, execute - and assert the target
 *   parameter holds its new value at the end. Then deliberately introduce a storage-layout shift
 *   in the new implementation and show the rehearsal catching it. Wire the whole thing into CI,
 *   pinned and cached.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Rehearsing an upgrade at head — Fork at a recent block, impersonate the admin, execute
 *     the real upgrade calldata, then run the existing integration suite plus a storage-layout
 *     diff - because upgrades fail on live storage, not on fresh state.
 *   - Rehearsal as a test suite — Running the test suite against real mainnet state at a
 *     pinned block is the cheapest way to rehearse anything that touches live protocols, and
 *     pinning is required for determinism and for cache reuse.
 *   - Impersonation and time travel — Prank, warp, roll, store and deal let a fork test act as
 *     a multisig or timelock and skip a delay, which is what makes a full governance rehearsal
 *     expressible as a unit test.
 *   - Rehearsing the whole governance flow — Propose, reach quorum, queue, skip the timelock
 *     and execute on a fork - because most governance failures are in the payload's encoding
 *     or the executor's permissions, not in the intent.
 *   - A rehearsal that runs on every change — Running the fork-based upgrade and governance
 *     rehearsal in continuous integration, pinned to a recent block, converts "we simulated it
 *     once" into a standing regression check.
 */
contract UpgradeRehearsal {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
