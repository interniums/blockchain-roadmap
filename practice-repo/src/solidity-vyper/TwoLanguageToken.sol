// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-vyper-same-token-two-languages  (implement, difficulty 3)
 * Exercised by: test/TwoLanguageToken.t.sol
 * Run:      forge test --junit --match-path test/TwoLanguageToken.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Implement the same ERC-20 twice: once in Vyper against the version you pin, and once in
 *   Solidity 0.8.36 using OpenZeppelin. Drive both from one Foundry test suite through the ABI,
 *   so the same tests run against both deployments. Record deployed bytecode size for each. Then
 *   write down, for the Solidity version, every behaviour that comes from an inherited function
 *   or a modifier you cannot see from the function body, and what the Vyper version writes
 *   inline instead.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Pythonic, but not Python — Python syntax, implemented in Python, compiling to EVM
 *     bytecode with the same ABI as Solidity.
 *   - Decorators are mandatory — @external, @internal, @deploy, @payable, @view, @pure,
 *     @nonreentrant — no defaults to remember.
 *   - No inheritance, explicit modules instead — There is no contract inheritance and no
 *     linearization; 0.4.0 added an explicit module system.
 *   - Dynamic types carry their maximum — DynArray[uint256, 100], String[64], Bytes[1024] —
 *     there is no unbounded bytes, string or array.
 *   - The price of the omissions — Far smaller library ecosystem, fewer auditors, fewer tools,
 *     and patterns that need dedicated builtins.
 */
contract TwoLanguageToken {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
