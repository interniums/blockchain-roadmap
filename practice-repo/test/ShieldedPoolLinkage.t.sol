// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: zk-privacy-applications-link-your-own-withdrawal  (break, grain module, difficulty 5)
 * Run:      forge test --match-path test/ShieldedPoolLinkage.t.sol -vvv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build a minimal fixed-denomination shielded pool in Foundry: deposits append a note
 *   commitment to an on-chain Merkle tree, withdrawals present a proof of membership and publish
 *   a nullifier that the contract records. Then break it twice. First, cryptographically:
 *   implement the nullifier as a hash of the note commitment rather than of the spending secret,
 *   and write a script that reconstructs the deposit-to-withdrawal mapping from public data
 *   alone. Second, operationally: with the correct nullifier in place, deposit from address A,
 *   withdraw to a fresh address B, then fund B's gas from A, and write the heuristic that
 *   recovers the A-to-B link anyway. Fix the first by deriving the nullifier from the spending
 *   key, and the second by routing the withdrawal through a relayer. Then compute the effective
 *   anonymity set for one withdrawal — deposits of the same denomination inside a plausible time
 *   window — and state your filtering assumptions.
 */
contract ShieldedPoolLinkageTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test asserts an honest withdrawal succeeds and a replayed nullifier reverts
    function test_criterion01_aTestAssertsAnHonestWithdrawalSucceedsAndA() public {
        fail("A test asserts an honest withdrawal succeeds and a replayed nullifier reverts");
    }

    /// A test using the commitment-derived nullifier reconstructs the full deposit-to-withdrawal
    /// mapping and asserts it is exactly correct
    function test_criterion02_aTestUsingTheCommitmentDerivedNullifierReconstructsThe() public {
        fail("A test using the commitment-derived nullifier reconstructs the full deposit-to-withdrawal mapping and asserts it is exactly correct");
    }

    /// The same test against the key-derived nullifier asserts no such mapping can be built from
    /// the emitted events
    function test_criterion03_theSameTestAgainstTheKeyDerivedNullifierAsserts() public {
        fail("The same test against the key-derived nullifier asserts no such mapping can be built from the emitted events");
    }

    /// A test or script recovers the A-to-B link from the gas-funding transaction and reports the
    /// effective anonymity set as a number smaller than the total deposit count, with the filtering
    /// assumptions stated
    function test_criterion04_aTestOrScriptRecoversTheAToB() public {
        fail("A test or script recovers the A-to-B link from the gas-funding transaction and reports the effective anonymity set as a number smaller than the total deposit count, with the filtering assumptions stated");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
