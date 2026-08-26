// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test} from "forge-std/Test.sol";
import {MalleablePayout, LowSPayout, NoncePayout, SECP256K1_N} from "../src/crypto/Payout.sol";

/*
 * Practice: fundamentals-crypto-malleable-double-spend  (kind: break)
 * Run:      forge test --match-path test/Malleability.t.sol -vvv
 *
 * Your work is `_mirror` at the bottom of this file, and then the TODOs in LowSPayout and
 * NoncePayout. The assertions here are the specification; read them before you write anything.
 *
 * The three payout contracts are three points on one argument:
 *   MalleablePayout - a replay guard keyed on the signature bytes
 *   LowSPayout      - canonical signatures only, and no replay guard at all
 *   NoncePayout     - both fixes, kept together
 */
contract MalleabilityTest is Test {
    uint256 internal constant AMOUNT = 1 ether;
    address internal constant PAYEE = address(0xB0B);

    uint256 internal ownerKey = 0xA11CE;
    address internal ownerAddr;

    MalleablePayout internal malleable;
    LowSPayout internal lowS;
    NoncePayout internal nonced;

    function setUp() public {
        ownerAddr = vm.addr(ownerKey);

        malleable = new MalleablePayout(ownerAddr);
        lowS = new LowSPayout(ownerAddr);
        nonced = new NoncePayout(ownerAddr);

        vm.deal(address(malleable), 10 ether);
        vm.deal(address(lowS), 10 ether);
        vm.deal(address(nonced), 10 ether);
        vm.deal(PAYEE, 0);
    }

    // ------------------------------------------------------------------
    // Evidence: the payout contract as written
    // ------------------------------------------------------------------

    function test_evidence_oneApprovalSpendsOnce() public {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerKey, malleable.digest(PAYEE, AMOUNT));
        malleable.spend(PAYEE, AMOUNT, v, r, s);
        assertEq(PAYEE.balance, AMOUNT, "the approved payout did not arrive");
    }

    function test_evidence_theSameBytesAreRejectedTheSecondTime() public {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerKey, malleable.digest(PAYEE, AMOUNT));
        malleable.spend(PAYEE, AMOUNT, v, r, s);

        vm.expectRevert(MalleablePayout.SignatureAlreadyUsed.selector);
        malleable.spend(PAYEE, AMOUNT, v, r, s);
    }

    // ------------------------------------------------------------------
    // The break
    // ------------------------------------------------------------------

    /// Two different byte strings, one signer, one approval, two payouts.
    function test_break_theMirroredSignatureSpendsTheSameApprovalTwice() public {
        bytes32 d = malleable.digest(PAYEE, AMOUNT);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerKey, d);
        (uint8 mv, bytes32 mr, bytes32 ms) = _mirror(v, r, s);

        assertTrue(
            keccak256(abi.encodePacked(r, s, v)) != keccak256(abi.encodePacked(mr, ms, mv)),
            "the mirrored signature must be a different byte string, or the guard would catch it"
        );

        malleable.spend(PAYEE, AMOUNT, v, r, s);
        malleable.spend(PAYEE, AMOUNT, mv, mr, ms);

        assertEq(PAYEE.balance, 2 * AMOUNT, "one approval should not have paid out twice");
    }

    /// Nothing was forged. Both byte strings are the owner's signature over the same digest.
    function test_break_bothSignaturesRecoverToTheSameSigner() public view {
        bytes32 d = malleable.digest(PAYEE, AMOUNT);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerKey, d);
        (uint8 mv, bytes32 mr, bytes32 ms) = _mirror(v, r, s);

        assertEq(ecrecover(d, v, r, s), ownerAddr, "the original signature does not recover to the owner");
        assertEq(ecrecover(d, mv, mr, ms), ownerAddr, "the mirrored signature does not recover to the owner");
    }

    /// Exactly one of the two is in canonical form.
    function test_break_exactlyOneOfTheTwoHasLowS() public view {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerKey, malleable.digest(PAYEE, AMOUNT));
        (uint8 mv, bytes32 mr, bytes32 ms) = _mirror(v, r, s);
        mv;
        mr;

        bool originalLow = uint256(s) <= SECP256K1_N / 2;
        bool mirroredLow = uint256(ms) <= SECP256K1_N / 2;
        assertTrue(originalLow != mirroredLow, "one of the pair must be above half the group order");
    }

    // ------------------------------------------------------------------
    // Fix one, alone: canonical signatures only
    // ------------------------------------------------------------------

    function test_lowS_rejectsTheMirroredSignature() public {
        bytes32 d = lowS.digest(PAYEE, AMOUNT);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerKey, d);
        (uint8 mv, bytes32 mr, bytes32 ms) = _mirror(v, r, s);

        vm.expectRevert(LowSPayout.NonCanonicalS.selector);
        lowS.spend(PAYEE, AMOUNT, mv, mr, ms);
    }

    function test_lowS_stillAcceptsTheCanonicalSignature() public {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerKey, lowS.digest(PAYEE, AMOUNT));
        lowS.spend(PAYEE, AMOUNT, v, r, s);
        assertEq(PAYEE.balance, AMOUNT, "a canonical owner signature must still pay out");
    }

    /// The point of this contract. Rejecting the mirror is not replay protection: the original
    /// bytes still spend as many times as anyone cares to submit them.
    function test_lowS_doesNothingAboutResubmittingTheOriginalBytes() public {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerKey, lowS.digest(PAYEE, AMOUNT));
        lowS.spend(PAYEE, AMOUNT, v, r, s);
        lowS.spend(PAYEE, AMOUNT, v, r, s);
        lowS.spend(PAYEE, AMOUNT, v, r, s);
        assertEq(PAYEE.balance, 3 * AMOUNT, "low-s rejection is not a replay guard, and this test says so");
    }

    // ------------------------------------------------------------------
    // Fix two, kept together with fix one
    // ------------------------------------------------------------------

    function test_nonce_rejectsTheMirroredSignature() public {
        bytes32 d = nonced.digest(PAYEE, AMOUNT, 0);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerKey, d);
        (uint8 mv, bytes32 mr, bytes32 ms) = _mirror(v, r, s);

        vm.expectRevert(NoncePayout.NonCanonicalS.selector);
        nonced.spend(PAYEE, AMOUNT, 0, mv, mr, ms);
    }

    function test_nonce_rejectsAResubmissionOfTheOriginalBytes() public {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerKey, nonced.digest(PAYEE, AMOUNT, 0));
        nonced.spend(PAYEE, AMOUNT, 0, v, r, s);

        vm.expectRevert(NoncePayout.NonceAlreadyUsed.selector);
        nonced.spend(PAYEE, AMOUNT, 0, v, r, s);

        assertEq(PAYEE.balance, AMOUNT, "the approval paid out more than once");
    }

    /// A nonce guard must not become a single-payment contract.
    function test_nonce_allowsTwoSeparatelyApprovedPayouts() public {
        (uint8 v0, bytes32 r0, bytes32 s0) = vm.sign(ownerKey, nonced.digest(PAYEE, AMOUNT, 0));
        (uint8 v1, bytes32 r1, bytes32 s1) = vm.sign(ownerKey, nonced.digest(PAYEE, AMOUNT, 1));

        nonced.spend(PAYEE, AMOUNT, 0, v0, r0, s0);
        nonced.spend(PAYEE, AMOUNT, 1, v1, r1, s1);

        assertEq(PAYEE.balance, 2 * AMOUNT, "two distinct approvals must both pay out");
    }

    // ==================================================================
    // YOUR WORK
    // ==================================================================

    /// @notice Return the other signature the owner's key produces over the same digest.
    /// @dev    You are not signing anything again, and you do not have a second private key. There
    ///         is a second valid `(v, r, s)` derivable from this one by arithmetic alone. The group
    ///         order is exported from src/crypto/Payout.sol as SECP256K1_N.
    function _mirror(uint8 v, bytes32 r, bytes32 s) internal pure returns (uint8 mv, bytes32 mr, bytes32 ms) {
        // TODO: set mv / mr / ms, then delete the guard below.
        require(
            mr != bytes32(0) && (mr != r || ms != s || mv != v),
            "TODO: _mirror in test/Malleability.t.sol is unimplemented"
        );
    }

    // ------------------------------------------------------------------
    // TODO (write-up)
    //
    // test_lowS_doesNothingAboutResubmittingTheOriginalBytes passes on purpose. In two or three
    // sentences, say why rejecting non-canonical signatures closes the mirror but leaves
    // resubmission wide open, and why the nonce fix closes both. Then say what you would do if you
    // could only ship one of the two, and what you would lose.
    //
    // Your answer:
    //
    //
    // ------------------------------------------------------------------
}
