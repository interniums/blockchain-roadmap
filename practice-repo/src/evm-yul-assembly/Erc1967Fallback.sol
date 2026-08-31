// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-yul-assembly-erc1967-fallback  (implement, difficulty 4)
 * Exercised by: test/Erc1967Fallback.t.sol
 * Run:      forge test --junit --match-path test/Erc1967Fallback.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Implement an ERC-1967-style proxy fallback in inline assembly: copy the whole of calldata
 *   into memory, `delegatecall` the implementation read from the ERC-1967 slot, copy the return
 *   data back, and either `return` or `revert` with it unchanged. Decide whether the block can
 *   honestly carry the `("memory-safe")` annotation and write a comment justifying the decision
 *   against the documented permitted regions — quoting them, not paraphrasing. Add the
 *   code-existence check that raw `delegatecall` does not perform, and explain in a comment why
 *   the high-level equivalent would have inserted it for you.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - When assembly is justified — Custom storage slots, proxy fallbacks, hot loops in widely
 *     reused libraries, and things Solidity cannot express — not gas-shaving ordinary logic.
 *   - Storage is reached through .slot and .offset — Solidity storage variables are not
 *     directly addressable in assembly; you use x.slot and x.offset, and calldata arrays use
 *     x.offset and x.length.
 *   - The memory-safe annotation — `assembly ("memory-safe")` is a promise to the optimizer
 *     about which memory the block touches — not a check the compiler performs.
 *   - A raw call does not check the target has code — In assembly a `call` to an address with
 *     no code returns success; Solidity's high-level calls insert an EXTCODESIZE check that
 *     assembly drops.
 */
contract Erc1967Fallback {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
