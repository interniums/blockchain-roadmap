// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-unit-testing-capstone-a-suite-that-cannot-lie  (fix, difficulty 4)
 * Exercised by: test/capstone/SuiteIntegrity.t.sol
 * Run:      forge test --junit --match-path test/capstone/SuiteIntegrity.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Every trap in this module is a documented way a test passes while its subject is broken.
 *   Build a suite that contains one instance of each trap, prove each one passes wrongly, then
 *   fix it — and end with a mutation check that proves the fixed suite actually holds. THE
 *   TRAPS, each demonstrated then fixed. EXPECT-REVERT ON THE WRONG CALL. Write a test where
 *   `expectRevert` catches a revert from a setup call rather than the call under test, and
 *   passes. Fix it. ARGUMENT NESTING. Write one where the reverting call is nested inside
 *   another call's arguments, so the expectation applies to the outer call. Fix it. SELECTOR
 *   VERSUS DATA. Write one that asserts on a selector and passes for a revert carrying entirely
 *   different arguments. Fix it to assert on the data. THE LOW-LEVEL STATUS TRAP. Write one
 *   where the contract's low-level call fails, the boolean is ignored, and the test passes
 *   because nothing reverted. Fix it. EMIT ORDERING AND FLAGS. Write one where `expectEmit`
 *   matches a decoy contract's event, and one where the four booleans let a wrong value through.
 *   Fix both, and state what the flags do not cover. THE FIXTURE. Show that `setUp` runs per
 *   test rather than once, and demonstrate one consequence: state you expected to carry between
 *   tests and does not. Then show the opposite — something that does leak, via the snapshot
 *   model, and say what. PRANKS. Demonstrate all three prank scopes, including the tx.origin
 *   form and the delegatecall form, and one case where the scope ended earlier than the author
 *   expected. THE MUTATION CHECK. Finally, break the contract in five distinct ways, one at a
 *   time, and show the fixed suite catches all five. Any mutation that survives is a hole, and
 *   you either close it or document why it is acceptable.
 *
 * The 16 concepts this has to end up demonstrating:
 *   - Discovery by function-name prefix — forge decides what to run from the function name,
 *     not from an annotation — and the prefix chooses the engine.
 *   - The test contract is the fixture — A test file is a contract inheriting forge-std Test;
 *     its state variables are the fixture and its prefixed functions are the cases.
 *   - setUp runs before every test — setUp() executes before each test function, and nothing
 *     one test mutates is visible to the next.
 *   - What each test inherits from setUp — Every case starts from the post-setUp state —
 *     including any prank, warp or roll left active there.
 *   - Isolation mode, and why gas numbers are not comparable across versions — With --isolate
 *     each top-level external call is metered as its own transaction; on forge 1.7.1 the
 *     default is isolate = false.
 *   - A cheatcode is a CALL to a magic address — `vm` is a typed interface to address
 *     0x7109709ECfa91a80626fF3989D68f67F5b1DD12D, which Foundry's EVM intercepts.
 *   - prank versus startPrank — vm.prank overrides msg.sender for exactly the next external
 *     call; vm.startPrank overrides it until stopPrank.
 *   - The two-argument prank — Only vm.prank(sender, origin) sets tx.origin as well — and
 *     after EIP-7702 that no longer proves anything about EOAs.
 *   - Pranking a delegatecall — A boolean overload extends a prank to delegate calls, but a
 *     delegate call cannot be pranked from an EOA.
 *   - warp and roll are independent — vm.warp sets block.timestamp, vm.roll sets block.number,
 *     and neither moves the other.
 *   - expectRevert binds to the next call — vm.expectRevert applies to the next external call
 *     only, and internal reverts need an opt-in config comment.
 *   - The nested-argument trap — In target.f(other.g()) the next call is g, not f — so the
 *     expectation attaches to the wrong call and the test passes for free.
 *   - How precisely to match a revert — Match a bare revert, a bytes4 selector, full revert
 *     data, a specific reverter, or a count — count 0 asserts no revert at all.
 *   - The low-level call status trap — Around a low-level .call, the returned success boolean
 *     reports whether the expectation was met — not whether the call reverted.
 *   - expectEmit is order-sensitive — Register the expectation, emit the expected event, then
 *     make the call — and expected events must appear in the actual order.
 *   - What the four booleans actually check — The booleans are topics 1-3 and the data body;
 *     topic0 is always checked and the emitter is only checked by the address overload.
 */
contract SuiteIntegrity {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
