// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-gas-fee-market-capstone-a-price-list-you-measured  (measure, difficulty 4)
 * Exercised by: test/capstone/GasPriceList.t.sol
 * Run:      forge test --junit --match-path test/capstone/GasPriceList.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Produce a gas price list for the current fork, every number measured on your machine rather
 *   than copied, and then find at least one widely circulated figure that your measurement
 *   contradicts. INTRINSIC. Measure the fixed charge before any opcode runs, for a plain
 *   transfer, a call with calldata, and a contract creation. Separate the base cost from the
 *   calldata cost and show the calldata floor applying — construct one transaction where the
 *   floor binds and one where it does not, and state the byte pattern that makes the difference.
 *   COLD AND WARM. Measure the cold and warm cost of an account access and a storage read,
 *   independently. This is where the dead-code trap lives: prove your measurement is not being
 *   optimised away, by showing the same harness produces a different number when you defeat the
 *   optimiser and by saying which number is the real one. SSTORE. Measure all the dynamic cases:
 *   zero to non-zero, non-zero to different non-zero, non-zero to zero and the refund, and the
 *   same slot written twice in one transaction. Report each separately; a single "SSTORE costs"
 *   number is the mistake. ACCESS LISTS. Find the break-even for your own workload: the number
 *   of distinct accesses at which paying for the list starts to win. State it as a number, and
 *   show the two measurements either side of it. THE CEILINGS. Demonstrate both 2025–2026
 *   ceilings binding. For the per-transaction cap, construct a transaction that would have been
 *   valid before it and is not now. For the gas-limit-versus-used distinction, show a case where
 *   the two differ enough to matter to a caller. THE CONTRADICTION. Finally, name one figure in
 *   circulation — a docs table, a blog post, a cheat sheet — that your measurements show is
 *   wrong or out of date. Quote it, quote yours, and say why they differ.
 *
 * The 8 concepts this has to end up demonstrating:
 *   - Gas — The unit that meters computation so execution is guaranteed to halt and every
 *     resource used is paid for.
 *   - Intrinsic gas — The fixed charge levied before the first opcode runs — 21,000 base plus
 *     a per-byte charge on calldata and per-entry charges for access lists and authorizations.
 *   - Cold and warm access — The first touch of an address or a storage slot in a transaction
 *     is priced far above every later touch, so identical code costs different gas depending
 *     on what ran before it.
 *   - SSTORE is priced on the transition — What a storage write costs depends on the value
 *     already there and the value being written, not on the fact that a write happened.
 *   - Access list — A pre-declaration of the addresses and slots a transaction will touch,
 *     paid for up front in exchange for warm pricing on each.
 *   - The calldata floor price — Since Pectra, a transaction whose gas is dominated by its
 *     calldata pays a floor of 10 gas per zero byte and 40 per non-zero byte instead of 4 and
 *     16.
 *   - The per-transaction gas cap — Since Fusaka a single transaction may not exceed 2^24 gas,
 *     even though the block limit is far higher.
 *   - Transaction gas limit versus gas used — The limit is the exposure you authorise; the
 *     used amount is what executed, and the difference is never charged.
 */
contract GasPriceList {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
