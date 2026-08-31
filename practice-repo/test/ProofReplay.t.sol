// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: zk-onchain-verification-proof-replay-payout  (break, grain block, difficulty 3)
 * Run:      forge test --match-path test/ProofReplay.t.sol -vvv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build a Foundry project with a deployed verifier and a claim contract that pays out when the
 *   verifier returns true. Introduce two independent defects. First, the claim contract records
 *   nothing about which proofs it has already honoured, so the same valid proof can be submitted
 *   repeatedly. Second, the claim contract accepts the Merkle root as a function argument and
 *   passes it straight through as a public input, instead of using the root it has stored. Write
 *   an exploit test for each: one drains the contract by resubmitting one proof, the other
 *   claims against a root the attacker chose and proved against. Then fix both — a nullifier
 *   mapping keyed on the proof's binding public input, and reading the root from the contract's
 *   own storage — and show each exploit now reverts, while an honest claim still succeeds.
 */
contract ProofReplayTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test submits one valid proof twice against the vulnerable contract and asserts the balance
    /// decreased twice
    function test_criterion01_aTestSubmitsOneValidProofTwiceAgainstThe() public {
        fail("A test submits one valid proof twice against the vulnerable contract and asserts the balance decreased twice");
    }

    /// A test claims against an attacker-supplied root on the vulnerable contract and asserts the
    /// payout succeeded
    function test_criterion02_aTestClaimsAgainstAnAttackerSuppliedRootOn() public {
        fail("A test claims against an attacker-supplied root on the vulnerable contract and asserts the payout succeeded");
    }

    /// Against the fixed contract, the replay reverts and the attacker-root claim reverts, each
    /// with a distinct revert reason
    function test_criterion03_againstTheFixedContractTheReplayRevertsAndThe() public {
        fail("Against the fixed contract, the replay reverts and the attacker-root claim reverts, each with a distinct revert reason");
    }

    /// A test asserts an honest first-time claim still succeeds against the fixed contract
    function test_criterion04_aTestAssertsAnHonestFirstTimeClaimStill() public {
        fail("A test asserts an honest first-time claim still succeeds against the fixed contract");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
