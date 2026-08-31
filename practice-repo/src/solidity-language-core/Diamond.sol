// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-language-core-diamond-order-prediction  (implement, difficulty 3)
 * Exercised by: test/Diamond.t.sol
 * Run:      forge test --junit --match-path test/Diamond.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build four contracts — X, A is X, B is X, C is A, B — where every constructor emits an event
 *   naming itself and every contract overrides foo() to emit and then call super.foo(). Before
 *   running, write your predicted constructor emission order and your predicted foo() resolution
 *   order into a comment at the top of the test file. Then assert both orders in a Foundry test
 *   using vm.recordLogs. Add a second test proving that declaring contract C is B, A produces a
 *   different answer, and a compile-failure note showing that contract C is A, X cannot be
 *   linearised.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - C3 linearisation — Bases are listed most base-like first — the reverse of Python — and
 *     lookup runs right to left.
 *   - Base constructor order — Base constructors run in linearised order, whatever order you
 *     supplied their arguments in.
 *   - virtual and override — Overridable functions must be virtual, and a function inherited
 *     from several bases needs override(A, B).
 *   - Modifier ordering — Multiple modifiers run left to right as written, each nesting inside
 *     the previous.
 */
contract Diamond {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
