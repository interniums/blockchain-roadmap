// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: defi-mev-capstone-follow-one-swap  (measure, difficulty 4)
 * Exercised by: test/capstone/Mev.t.sol
 * Run:      forge test --junit --match-path test/capstone/Mev.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Take one real swap that was sandwiched on mainnet. Reconstruct the whole supply chain around
 *   it, and price every mitigation against it. THE ATTACK, RECONSTRUCTED. Fork before the
 *   bundle. Reproduce the sandwich: front-run, victim, back-run. Compute the attacker's profit
 *   and the victim's loss, and show they are not the same number — say where the difference
 *   went. THE BUDGET. Show the victim's slippage tolerance was the attacker's budget: sweep the
 *   tolerance and plot attacker profit against it. Find the tolerance at which the attack stops
 *   being worth it, and state what that tolerance would have cost the victim in failed
 *   transactions instead. THE TAXONOMY, APPLIED. Classify four extractions from the same block —
 *   including one atomic arbitrage and one liquidation — as requiring a specific user to be
 *   worse off, or as capture of a public inconsistency. Then take the arbitrage and argue it is
 *   loss-versus-rebalancing borne by liquidity providers rather than a victimless correction.
 *   Name who paid. THE SUPPLY CHAIN. For the block your swap landed in, name every hop from
 *   wallet to proposer and state, per hop, who could see the transaction and who could reorder
 *   it. Identify the relay and say what trusting it means concretely. FOUR MITIGATIONS, PRICED.
 *   Private order flow, an intent with solver competition, an encrypted mempool, and an
 *   oracle-position auction. For each: what it prevents, what it moves rather than prevents, who
 *   is now trusted instead, and the latency or fee cost. The write-up must say which one you
 *   would actually ship and what you are accepting. THE L2 CASE. Finally, take the same swap on
 *   an L2 and say why the analysis collapses to one party, and what that means for a user who
 *   assumed the mitigations above apply.
 *
 * The 17 concepts this has to end up demonstrating:
 *   - Maximal extractable value — The value obtainable purely by choosing which transactions
 *     go in a block and in what order.
 *   - Searchers — Bots that find an ordering-dependent profit and bid for the right to be
 *     placed at a specific position in a block.
 *   - Atomic arbitrage — Buy on the cheap venue and sell on the expensive one inside one
 *     transaction, reverting if unprofitable — pure competition on latency and bid.
 *   - Arbitrage is loss-versus-rebalancing — The arbitrageur's profit is the liquidity
 *     provider's loss, seen from the other side.
 *   - The sandwich — Buy ahead of a victim's swap to push the price, let them execute worse,
 *     then sell behind them — funded entirely by their slippage tolerance.
 *   - Slippage tolerance is a security parameter — Setting a wide tolerance does not make the
 *     trade succeed; it authorises up to that much extraction.
 *   - Liquidation MEV — The race to be first after a health-factor breach or an oracle update
 *     — the clearest case where MEV is load-bearing rather than parasitic.
 *   - The axis that actually matters — Not good versus bad, but whether extraction requires a
 *     specific user to get a worse outcome or merely captures a public inconsistency.
 *   - Proposer-builder separation — Splitting propose a block from order its transactions, so
 *     proposers sell the slot to the highest bidder without needing MEV expertise.
 *   - Builders — The actual ordering monopolists — exclusive orderflow compounds into better
 *     bids, which win more slots, which attract more flow.
 *   - Relay trust — A relay holds the block body until the proposer has signed the header,
 *     which is an out-of-protocol trust assumption that enshrined PBS is meant to remove.
 *   - Private orderflow — Routing to a builder instead of the public mempool protects the user
 *     from public-mempool attacks and entrenches the builders who receive that flow.
 *   - Orderflow auctions — Sell the right to backrun a user's transaction and refund part of
 *     the proceeds to that user, converting extraction into rebate.
 *   - Intents — Sign the outcome you want, not the path — so there is no executable
 *     transaction to front-run.
 *   - Encrypted mempools — Hide transaction contents until ordering is fixed — attacking MEV
 *     at the information layer, at the cost of a new liveness and trust assumption.
 *   - Oracle-extractable value as an auction — Auctioning the block position immediately after
 *     an oracle update lets a protocol recapture liquidation value that would otherwise go to
 *     searchers.
 *   - MEV on a single-sequencer rollup — The sequencer holds the entire ordering right, so L2
 *     MEV is a policy question rather than an auction.
 */
contract Mev {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
