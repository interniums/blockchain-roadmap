// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-fork-testing-persistent-helper  (fix, difficulty 3)
 * Exercised by: test/MultiFork.t.sol
 * Run:      forge test --junit --match-path test/MultiFork.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   You are given a test that creates two forks, deploys a helper contract while the first is
 *   active, switches to the second, and then reverts on a call into the helper. Diagnose it from
 *   the trace and fix it with a persistence declaration rather than by redeploying. Then, in the
 *   same file, reproduce the second trap: call `vm.createSelectFork` twice with the same URL and
 *   show that state written under the first is invisible afterwards, then fix that by retaining
 *   and reusing the fork id. Add an assertion documenting which accounts were persistent before
 *   you declared anything.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Several forks in one test — Multiple forks coexist with independent state, so one test
 *     can compare or coordinate across chains.
 *   - Switching forks switches the whole world — Each fork id carries its own state, so a
 *     contract deployed while fork A was active does not exist under fork B.
 *   - Persistent accounts — vm.makePersistent(addr) marks accounts whose state survives fork
 *     switches; by default only the test contract and the caller are persistent.
 *   - createSelectFork is not idempotent — Every call creates a NEW fork, so calling it twice
 *     with the same URL gives two independent forks, each starting clean.
 */
contract MultiFork {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
