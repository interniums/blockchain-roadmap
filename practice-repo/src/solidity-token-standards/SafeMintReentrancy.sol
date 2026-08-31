// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-token-standards-safemint-reentrancy-cap  (break, difficulty 3)
 * Exercised by: test/SafeMintReentrancy.t.sol
 * Run:      forge test --junit --match-path test/SafeMintReentrancy.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write an ERC-721 with a per-wallet mint cap enforced by require(minted[msg.sender] < CAP),
 *   where the counter is incremented after _safeMint. Write an attacker contract whose
 *   onERC721Received calls mint again. Prove the attacker ends up holding more tokens than the
 *   cap allows. Then fix it twice, independently: once by moving the counter increment before
 *   the mint, and once by adding a reentrancy guard, and prove each fix alone reduces the
 *   attacker to exactly the cap.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - The onERC721Received hook — safeTransferFrom calls the recipient contract and requires
 *     the magic selector back.
 *   - safeMint reentrancy — The receiver hook lets an attacker re-enter your mint before the
 *     counter is written.
 *   - Every safety callback is a code-execution point — ERC-777 send hooks, onERC721Received
 *     and the ERC-1155 receivers are all attacker-controlled execution inside your
 *     transaction.
 *   - Checks-Effects-Interactions — Validate, then write all state, then call outside
 *     contracts last, so re-entry sees final state.
 */
contract SafeMintReentrancy {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
