// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-gas-fee-market-access-list-breakeven  (measure, difficulty 3)
 * Exercised by: test/AccessListBreakeven.t.sol
 * Run:      forge test -vv --junit --match-path test/AccessListBreakeven.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Take a call path that touches several external contracts and several storage slots. Send it
 *   on anvil three ways: as a type-0 transaction, as a type-1 transaction with an access list
 *   containing exactly the items the call touches, and as a type-1 transaction with an access
 *   list that over-declares — listing items the call never touches. Record total gas used for
 *   each. Then vary the number of correctly declared entries and find the break-even point at
 *   which the up-front charge is repaid by warm pricing. Report the crossover as a number of
 *   entries, with the reasoning.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Access list — A pre-declaration of the addresses and slots a transaction will touch,
 *     paid for up front in exchange for warm pricing on each.
 *   - Cold and warm access — The first touch of an address or a storage slot in a transaction
 *     is priced far above every later touch, so identical code costs different gas depending
 *     on what ran before it.
 *   - Intrinsic gas — The fixed charge levied before the first opcode runs — 21,000 base plus
 *     a per-byte charge on calldata and per-entry charges for access lists and authorizations.
 *   - Transaction gas limit versus gas used — The limit is the exposure you authorise; the
 *     used amount is what executed, and the difference is never charged.
 */
contract AccessListBreakeven {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
