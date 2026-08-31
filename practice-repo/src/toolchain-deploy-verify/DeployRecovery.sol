// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: toolchain-deploy-verify-resume-a-broken-deploy  (fix, difficulty 4)
 * Exercised by: test/DeployRecovery.t.sol
 * Run:      forge test --junit --match-path test/DeployRecovery.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write a script that deploys five contracts in sequence against a local anvil, arranged so
 *   the fourth fails — for example by giving that transaction a gas limit that cannot cover it.
 *   Run it first without `--broadcast` and note what was written and what was not. Run it with
 *   `--broadcast`, observe the failure, then recover with `--resume` rather than rerunning from
 *   the start. Prove the recovery worked by writing a Solidity test that reads
 *   `broadcast/Deploy.s.sol/31337/run-latest.json` with `vm.readFile` and `vm.parseJson`,
 *   asserts exactly five deployments with five distinct addresses, and asserts the first three
 *   addresses match what the failed run had already recorded. You will need an `fs_permissions`
 *   entry for the broadcast directory.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - One flag separates a rehearsal from the real thing — Without --broadcast the script
 *     simulates against the RPC's state and sends nothing; with it, the transactions are
 *     irreversible.
 *   - What broadcast/ records — Results land in
 *     broadcast/<Script>.s.sol/<chainId>/run-latest.json — each transaction, its receipt, and
 *     the deployed contractAddress.
 *   - Reading addresses back out — Later scripts parse deployed addresses out of the broadcast
 *     JSON, so the file is deployment state rather than a log.
 *   - resume and slow — --resume continues a partially-broadcast run from the artifacts;
 *     --slow sends one transaction at a time and waits for each receipt.
 */
contract DeployRecovery {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
