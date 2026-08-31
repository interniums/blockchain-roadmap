// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-calls-delegatecall-context-table  (implement, difficulty 3)
 * Exercised by: test/ContextTable.t.sol
 * Run:      forge test --junit --match-path test/ContextTable.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write Caller and Target, where Target.probe() reports address(this), msg.sender, msg.value
 *   and address(this).balance. Invoke it five ways from Caller: a typed external call, a
 *   low-level .call, a .delegatecall, a .staticcall, and this.probe() on a copy of the function
 *   inside Caller itself. Before running, fill in a five-row by four-column prediction table in
 *   a comment. Then assert every cell in a Foundry test. The staticcall row cannot report by
 *   emitting, since LOG is forbidden in a static context — returning the values instead is part
 *   of the exercise.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Every interaction is a message call — Contracts share no address space; every
 *     contract-to-contract interaction opens a new frame.
 *   - CALL context — Under CALL the callee is address(this), msg.sender is the caller, and the
 *     callee's storage is written.
 *   - DELEGATECALL context — Only the code comes from the target; address, storage, balance,
 *     msg.sender and msg.value stay the caller's.
 *   - STATICCALL context — STATICCALL is CALL with value forced to zero plus a static flag
 *     that propagates into every subcall.
 *   - this.f() is a real external call — this.f() is a full CALL back into the same contract,
 *     and it resets msg.sender to address(this).
 */
contract ContextTable {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
