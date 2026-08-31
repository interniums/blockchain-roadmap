// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-openzeppelin-port-4x-to-5x  (fix, difficulty 2)
 * Exercised by: test/OzPort.t.sol
 * Run:      forge test --junit --match-path test/OzPort.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Take a contract written against OpenZeppelin 4.x — Ownable with an implicit owner, Counters,
 *   an ERC-20 with _beforeTokenTransfer, and a call to increaseAllowance — and port it to 5.7.0.
 *   Every removal has a different replacement and one of them has none. Rewrite the tests so
 *   they assert custom-error selectors rather than revert strings. If the contract has an
 *   upgradeable variant, fix the imports so stateless contracts come from the main package.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - What changed from 4.x to 5.x — Custom errors replaced revert strings, Ownable takes
 *     initialOwner, hooks collapsed to _update, gaps became namespaces.
 *   - Custom errors throughout — 5.x reverts with typed errors like
 *     OwnableUnauthorizedAccount, not with strings to regex.
 *   - The 5.x line — 5.7.0 shipped 29 July 2026; 5.0 (October 2023) remains the last breaking
 *     major, and there is no 6.0.
 *   - contracts-upgradeable is transpiled — It is machine-generated from the main package,
 *     replacing constructors with __Contract_init.
 *   - Stateless contracts are no longer transpiled — From 5.5.0, contracts with no storage are
 *     imported from the main package even in upgradeable projects.
 */
contract OzPort {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
