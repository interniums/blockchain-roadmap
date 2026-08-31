// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-calls-delegatecall-capstone-the-context-table  (break, difficulty 4)
 * Exercised by: test/capstone/CallContext.t.sol
 * Run:      forge test --junit --match-path test/capstone/CallContext.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build a small proxied system, derive the full context table from it by running code rather
 *   than by reading a doc, and then exploit the row that matters. THE TABLE. For CALL,
 *   DELEGATECALL and STATICCALL, and for each of `address(this)`, `msg.sender`, `msg.value` and
 *   whose storage is written: predict every cell in a comment, then assert it. Twelve cells,
 *   twelve predictions written before the run. CALL TO NOTHING. Show that a delegatecall to an
 *   address with no code succeeds and returns true. Then write the check that would have caught
 *   it, and say why that check is now unreliable under EIP-7702. THIS.F() IS NOT FREE.
 *   Demonstrate that `this.f()` is an external call: show the context difference and the gas
 *   difference against calling `f()` directly. STATICCALL ENFORCES. Show that `view` is not what
 *   makes a view function safe by making a `view` function attempt a state change and observing
 *   where it fails — and then show the same code succeeding when not reached through a
 *   staticcall. THE BOOLEAN AND THE BYTES. Make a low-level call fail and ignore the boolean, so
 *   the caller proceeds as if it succeeded. Then bubble the revert properly and show the
 *   difference in what the caller learns. Then send a returndata bomb and show what naive
 *   returndata copying costs — with a number. THE DRAIN. Finally: overwrite the proxy's
 *   implementation pointer from a function that was never meant to touch it, using nothing but
 *   slot arithmetic, and take control. A comment names the slot and says how the collision arose
 *   from the two contracts' layouts. THE GUARD THAT IS NOT ONE. Add a `tx.origin` check
 *   somewhere and show it does not mean what it looks like it means.
 *
 * The 13 concepts this has to end up demonstrating:
 *   - Every interaction is a message call — Contracts share no address space; every
 *     contract-to-contract interaction opens a new frame.
 *   - CALL context — Under CALL the callee is address(this), msg.sender is the caller, and the
 *     callee's storage is written.
 *   - DELEGATECALL context — Only the code comes from the target; address, storage, balance,
 *     msg.sender and msg.value stay the caller's.
 *   - Storage matching is the whole risk — Delegatecall matches storage by slot position,
 *     never by variable name.
 *   - A call to an address with no code succeeds — The EVM returns success with empty data
 *     when the target has no code; low-level calls skip Solidity's check.
 *   - STATICCALL context — STATICCALL is CALL with value forced to zero plus a static flag
 *     that propagates into every subcall.
 *   - Staticcall turns a promise into a guarantee — Solidity compiles external view calls to
 *     STATICCALL, which is what makes the promise enforceable.
 *   - A low-level call returns a boolean — .call, .delegatecall and .staticcall return (bool
 *     success, bytes returndata) — and do not revert.
 *   - Bubbling a revert reason — Re-throwing a subcall's reason requires re-reverting the raw
 *     returndata yourself.
 *   - The returndata bomb — A hostile callee can return megabytes and make the caller pay for
 *     the memory expansion.
 *   - Proxies keep their state out of the numbered range — Proxy state lives at pseudorandom
 *     slots such as keccak256('eip1967.proxy.implementation') - 1.
 *   - tx.origin no longer identifies an EOA — Since EIP-7702 a delegated EOA runs contract
 *     code in its own top-level frame.
 *   - this.f() is a real external call — this.f() is a full CALL back into the same contract,
 *     and it resets msg.sender to address(this).
 */
contract CallContext {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
