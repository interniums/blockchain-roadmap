// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-language-core-capstone-where-the-resemblance-breaks  (implement, difficulty 4)
 * Exercised by: test/capstone/LanguageCore.t.sol
 * Run:      forge test --junit --match-path test/capstone/LanguageCore.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   One contract, deliberately built so that each of this module's four traps is live in it and
 *   provable by test. Every prediction goes in a comment BEFORE the assertion that checks it —
 *   the exercise is predicting, not observing. DATA LOCATION. Include one assignment that copies
 *   and one that aliases, where the two lines look the same. A test shows mutating through one
 *   changes the original and the other does not. Then include a storage pointer that is dangling
 *   after the array it points into shrinks, and demonstrate what reading through it returns.
 *   VISIBILITY IS NOT PRIVACY. Give the contract a `private` state variable holding something
 *   that looks like a secret, and read it from outside the contract entirely. State in a comment
 *   which slot you read and how you knew it was that slot. VIEW AND PURE PROMISE LESS THAN YOU
 *   THINK. Write a `view` function that does something a reader would not expect a view function
 *   to be able to do, and a `pure` one likewise. Say precisely what each keyword does and does
 *   not enforce, and where the enforcement actually happens. MODIFIERS SPLICE. Write two
 *   modifiers whose order changes the outcome, and a third with the placeholder in a position
 *   that makes the function body run twice. Predict all three behaviours in comments first. THE
 *   DIAMOND. Build a four-contract inheritance diamond. Before running anything, write down in a
 *   comment the constructor order and the linearised override order the compiler will choose.
 *   Then assert both. Getting this wrong on the first attempt and leaving the wrong prediction
 *   visible, with a note on why you expected it, is worth more than getting it right. INTERFACE
 *   OR ABSTRACT. Finally, refactor one part of the contract to use an interface and one to use
 *   an abstract contract, and justify each choice in two sentences.
 *
 * The 11 concepts this has to end up demonstrating:
 *   - Data location — Every reference-type variable is storage, memory or calldata, and there
 *     is no default.
 *   - Assignment copies or aliases — storage<->memory and calldata->anything deep-copy;
 *     memory->memory and storage->local-storage alias.
 *   - Local storage pointer — A local T storage p is a slot pointer: reassigning p retargets
 *     it, p.field = x writes state.
 *   - Visibility is not privacy — private and internal restrict which contracts may read
 *     state, never which humans may.
 *   - view and pure — view promises no state modification and is enforced by STATICCALL; pure
 *     additionally promises no state reads.
 *   - The modifier placeholder — _; marks where the function body is spliced in; a path that
 *     never reaches _; skips the body silently.
 *   - Modifier ordering — Multiple modifiers run left to right as written, each nesting inside
 *     the previous.
 *   - C3 linearisation — Bases are listed most base-like first — the reverse of Python — and
 *     lookup runs right to left.
 *   - Base constructor order — Base constructors run in linearised order, whatever order you
 *     supplied their arguments in.
 *   - virtual and override — Overridable functions must be virtual, and a function inherited
 *     from several bases needs override(A, B).
 *   - Interface versus abstract contract — An interface may hold no state, no constructor and
 *     no modifiers, and every function must be external.
 */
contract LanguageCore {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
