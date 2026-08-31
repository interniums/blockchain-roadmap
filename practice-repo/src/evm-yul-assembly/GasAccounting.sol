// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-exit-account-for-every-gas-unit  (measure, difficulty 5)
 * Exercised by: test/exit/GasAccounting.t.sol
 * Run:      forge test --match-path test/exit/GasAccounting.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Pick one mainnet transaction that costs more than 200,000 gas and touches at least three
 *   contracts. Produce a post-mortem that accounts for its cost down to the frame, and then a
 *   rewrite that is measurably cheaper — with the measurement defended rather than asserted. SIX
 *   parts. ONE. Name the envelope type and say what that envelope bought: which fields exist
 *   because of it, and what the transaction would have paid under the previous one. TWO.
 *   Attribute the gas. Intrinsic cost, calldata, each frame's execution, each cold and warm
 *   access, each storage write and its refund. The numbers must sum to the receipt. If they do
 *   not, the gap is the finding and you say what you have not accounted for. THREE. Verify one
 *   storage slot the transaction wrote, against the post-state root, without trusting the RPC
 *   that reported it. FOUR. Audit the contracts for "is this a contract" checks. Find every
 *   `extcodesize`, `code.length` and `isContract` in the reachable code and say, for each,
 *   whether a delegated EOA under EIP-7702 breaks it — and what specifically goes wrong when it
 *   does. Nothing to find is an acceptable answer only if you show where you looked. FIVE.
 *   Predict the address of one contract the transaction interacts with, from its deployment
 *   inputs, and state exactly which single change to those inputs would move it. SIX. Take the
 *   most expensive frame and rewrite it. For each value it holds, choose between stack,
 *   calldata, memory, transient storage and storage, and defend the choice with measured gas —
 *   then state which of your numbers mainnet will not reproduce, and why. If your rewrite uses
 *   assembly, it carries a memory-safe annotation and you argue the annotation is honest.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Assembly's real price is review cost — The cost is paid in audit hours and in the
 *     reviewers who can no longer read the contract — usually to optimise the risk that does
 *     not lose money.
 *   - The memory-safe annotation — `assembly ("memory-safe")` is a promise to the optimizer
 *     about which memory the block touches — not a check the compiler performs.
 *   - When assembly is justified — Custom storage slots, proxy fallbacks, hot loops in widely
 *     reused libraries, and things Solidity cannot express — not gas-shaving ordinary logic.
 *   - Solidity's memory conventions are a contract — The scratch space, free-memory pointer
 *     and zero slot are relied on by compiler-generated code, so assembly that breaks them
 *     corrupts code it never touched.
 */
contract GasAccounting {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
