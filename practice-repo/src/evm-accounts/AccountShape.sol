// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-accounts-what-the-outside-sees  (break, difficulty 3)
 * Exercised by: test/AccountShape.t.sol
 * Run:      forge test --junit --match-path test/AccountShape.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   An account is four fields, and since delegation arrived, two of the questions people ask
 *   about an account no longer have the answers they used to. THE FOUR FIELDS. For three real
 *   accounts — a plain EOA, a contract, and a delegated EOA — print all four fields of each and
 *   state, for each account, what is different. Then say where the code and the storage of the
 *   contract actually live, since neither is in the record. THE ASYMMETRY. Demonstrate that what
 *   an external observer sees is not what executes. For the delegated EOA, show the code an
 *   `extcodesize`-style check observes and the code that actually runs, and show they are not
 *   the same object. Then write the check that people use to detect a contract and show it
 *   giving the wrong answer for this account. Say concretely what breaks in a contract that
 *   relies on it. NO CHAINING. Show that delegation does not chain: point a delegation at an
 *   account that is itself delegated, and demonstrate what actually happens rather than what a
 *   reader might expect. State the rule in one sentence.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Account — One entry in Ethereum's global address-to-record map, holding nonce, balance,
 *     storage root and code hash.
 *   - Externally owned account — An account whose authority to act comes from a secp256k1
 *     private key rather than from deployed code.
 *   - Contract account — An account whose behaviour when called is defined by code deployed to
 *     it, with no key that can sign for it.
 *   - The outside view and the inside view disagree — EXTCODESIZE on a delegated account
 *     reports 23 bytes of designator; CODESIZE during its execution reports the delegate's
 *     real code.
 *   - Delegations are not chained — A call reads the first delegation designator and stops; if
 *     the delegate is itself delegated, that second hop is not followed.
 */
contract AccountShape {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
