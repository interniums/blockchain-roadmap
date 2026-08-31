// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-proxies-upgrades-slot-zero-collision-and-fix  (break, difficulty 3)
 * Exercised by: test/ProxyCollision.t.sol
 * Run:      forge test --junit --match-path test/ProxyCollision.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build a proxy that keeps its implementation address and its admin address as ordinary
 *   declared state variables, and an implementation whose first two state variables are an
 *   unrelated uint256 and an unrelated address. Through the proxy, call an ordinary setter on
 *   the implementation and take over the proxy — first repointing the implementation, then, in a
 *   second scenario, becoming the admin. Fix by moving both proxy variables to their EIP-1967
 *   slots with inline assembly, and re-run both attacks.
 *
 * The 3 concepts this has to end up demonstrating:
 *   - The delegatecall proxy — The proxy holds the storage and the balance; the implementation
 *     supplies only the code.
 *   - Storage collision — If both sides number their variables from slot 0, implementation
 *     writes overwrite proxy control state.
 *   - ERC-1967 storage slots — Standardised pseudorandom slots such as
 *     keccak256('eip1967.proxy.implementation') - 1.
 */
contract ProxyCollision {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
