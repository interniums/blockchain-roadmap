// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-proof-of-stake-capstone-price-a-defection  (measure, difficulty 4)
 * Exercised by: test/capstone/Slashing.t.sol
 * Run:      forge test --junit --match-path test/capstone/Slashing.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build a slashing calculator, and use it to make the argument this module exists to make:
 *   that the penalty is not for being wrong, it is for being wrong together. CONSTRUCT ALL THREE
 *   OFFENCES. Produce, as concrete signed message pairs against a real chain config, one double
 *   proposal, one double vote and one surround vote. For the surround vote, demonstrate a pair
 *   that is slashable and a pair that looks similar and is not, with the source and target
 *   epochs of each written out. THE CALCULATOR. Given a validator's balance and the number of
 *   validators slashed in the same window, compute the initial penalty, the correlation penalty,
 *   and the total — and the timeline over which each is applied. Test it against the real values
 *   for at least two historical slashing events. THE CURVE. Plot total loss against the number
 *   of correlated offenders, from one validator to a third of the set. Mark the point where the
 *   loss becomes total. State the number of validators at that point, and what fraction of the
 *   set it is. THE ARGUMENT. In one page: why is the penalty structured this way rather than as
 *   a fixed fine? Answer it in terms of what a fixed fine would fail to deter. Then state what
 *   it costs an honest operator who runs two clients badly and gets slashed alone — and whether
 *   you think that number is correct. THE CLOCK. Finally, show why slot timing makes some of
 *   this unavoidable: given the slot and epoch structure and the committee sampling, say how
 *   long an operator has to notice a misconfiguration before it becomes slashable, and whether
 *   that window is long enough.
 *
 * The 11 concepts this has to end up demonstrating:
 *   - What a validator is — A deposit of at least 32 ETH that buys the right and the duty to
 *     propose blocks and attest to them.
 *   - Slots and epochs — Time is divided into 12-second slots, grouped into epochs of 32
 *     slots, or 6.4 minutes.
 *   - The twelve seconds are spoken for — The proposer publishes in roughly the first four
 *     seconds and the committee attests over the following eight; the budget comes from real
 *     propagation delay.
 *   - An attestation is three votes in one — A committee member's signed vote on the head of
 *     the chain plus the source and target checkpoints.
 *   - Committees keep voting affordable — Only a sampled subset of validators attests in any
 *     given slot, so not everyone votes on everything.
 *   - Slashing versus leaking — Slashing destroys stake for provably contradictory signed
 *     messages; merely being offline leaks small penalties instead.
 *   - Double proposal — Signing two different blocks for the same slot.
 *   - Double vote — Attesting to two different candidates for the same target checkpoint.
 *   - Surround vote — An attestation whose source-to-target span strictly contains, or is
 *     contained by, one of your own earlier attestations.
 *   - The penalty scales with company — How much a slashed validator loses depends on how much
 *     other stake was slashed in the same window — negligible alone, total at scale.
 *   - Slashing happens over weeks — An immediate penalty on day one, the correlation penalty
 *     around day 18, ejection around day 36.
 */
contract Slashing {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
