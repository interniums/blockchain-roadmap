// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: scaling-forced-inclusion-force-it-through  (implement, difficulty 4)
 * Exercised by: test/ForceInclude.t.sol
 * Run:      forge test --match-path test/ForceInclude.t.sol --fork-url $ETH_RPC_URL -vvv
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write a Foundry test against a mainnet or testnet fork of an Arbitrum-family chain's L1
 *   contracts. First, read the live force-inclusion parameters straight from the SequencerInbox
 *   contract rather than from documentation, and assert on the values you find. Then queue a
 *   message through the delayed inbox, attempt the force-include call immediately and assert
 *   that it reverts, warp past the delay with `vm.warp` and `vm.roll`, and assert that the same
 *   call now succeeds. Do this for two different Arbitrum-family chains and show that the
 *   parameter differs between them. Finally, add a test showing that a forced transaction which
 *   would have succeeded at queue time reverts after the delay because the state moved — for
 *   example an allowance that was revoked.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Delayed inbox — The L1 contract queue that forced transactions land in, which the
 *     sequencer is supposed to drain.
 *   - The force-include call — The permissionless L1 function anyone can call, after the delay
 *     elapses, to push queued messages into the canonical L2 ordering.
 *   - The force-inclusion delay — The deliberate waiting period before forcing works, so the
 *     sequencer can order normally and L1 reorgs cannot rewrite L2 history.
 *   - Inclusion is not the outcome you wanted — Getting your transaction ordered does not
 *     guarantee it succeeds; the state it lands in may have already moved against you.
 */
contract ForceInclude {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
