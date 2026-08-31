// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-execution-create2-factory  (implement, difficulty 4)
 * Exercised by: test/Create2Factory.t.sol
 * Run:      forge test --junit --match-path test/Create2Factory.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build a factory with `deploy(bytes32 salt, bytes memory initcode)` using CREATE2, plus a
 *   pure `predict(bytes32 salt, bytes32 initcodeHash)` that implements `keccak256(0xff ‖
 *   address(this) ‖ salt ‖ initcodeHash)[12:]` by hand in assembly. Prove `predict` matches the
 *   deployed address for three different salts. Then prove the trap: deploy the same contract
 *   source with a different constructor argument and show the address changes, and deploy
 *   through CREATE instead and show the address depends on the factory's nonce rather than on
 *   the initcode.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - CREATE2 derives an address from the initcode — keccak256(0xff ‖ deployer ‖ salt ‖
 *     keccak256(initcode)) truncated to 20 bytes — predictable before deployment, and
 *     dependent on constructor arguments.
 *   - CREATE derives an address from the deployer's nonce — The new address is the last 20
 *     bytes of keccak256(rlp([sender, nonce])), so it depends on deployment order.
 *   - Initcode is not the deployed code — Deployment executes the initcode, and whatever bytes
 *     it RETURNs become the account's permanent code; the constructor is not part of it.
 *   - Code size limits and the reserved prefix — Deployed code is capped at 24,576 bytes,
 *     initcode at 49,152, deployed code may not begin with 0xEF, and storing code is charged
 *     per byte.
 */
contract Create2Factory {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
