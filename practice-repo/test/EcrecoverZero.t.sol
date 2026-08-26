// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test} from "forge-std/Test.sol";
import {EcrecoverVault, HardenedEcrecoverVault} from "../src/crypto/EcrecoverVault.sol";

/*
 * Practice: fundamentals-crypto-ecrecover-returns-zero  (kind: fix)
 * Run:      forge test --match-path test/EcrecoverZero.t.sol -vvv
 *
 * Read this file as the specification for src/crypto/EcrecoverVault.sol.
 *
 * The `vulnerable_` tests pass already. They are the evidence: a signature that is not a signature
 * at all authorises a privileged call. Leave them alone.
 *
 * The `hardened_` tests fail. Make them pass by completing the TODOs in
 * HardenedEcrecoverVault, then answer the write-up prompt at the bottom of this file.
 */
contract EcrecoverZeroTest is Test {
    /// A digest the caller has no signature for. Any 32 bytes will do; nothing is signed over it.
    bytes32 internal constant DIGEST = keccak256("chainpath.ecrecover-zero.digest");

    /// secp256k1 group order. `s` values at or above it are outside the curve's scalar field,
    /// so `ecrecover` cannot recover a point and gives up.
    uint256 internal constant SECP256K1_N =
        0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141;

    uint256 internal ownerKey;
    address internal ownerAddr;

    function setUp() public {
        ownerKey = 0xA11CE;
        ownerAddr = vm.addr(ownerKey);
    }

    // ------------------------------------------------------------------
    // Evidence: the vault as written
    // ------------------------------------------------------------------

    /// A vault deployed with an unset owner accepts a signature whose recovery byte is out of range.
    function test_vulnerable_outOfRangeVAuthorisesACallWithNoSignature() public {
        EcrecoverVault vault = new EcrecoverVault(address(0));
        assertEq(vault.owner(), address(0), "fixture: this vault is meant to have no owner");

        uint8 v = 29; // valid values are 27 and 28 only
        bytes32 r = bytes32(uint256(1));
        bytes32 s = bytes32(uint256(1));

        assertEq(ecrecover(DIGEST, v, r, s), address(0), "ecrecover should have failed and returned address(0)");

        vault.execute(DIGEST, v, r, s);
        assertEq(vault.executed(), 1, "an unsigned call was authorised as the owner");
    }

    /// Same outcome from a different direction: an `s` above the group order.
    function test_vulnerable_sAboveCurveOrderAuthorisesACallWithNoSignature() public {
        EcrecoverVault vault = new EcrecoverVault(address(0));

        uint8 v = 27;
        bytes32 r = bytes32(uint256(1));
        bytes32 s = bytes32(SECP256K1_N); // exactly the order: out of the scalar field

        assertEq(ecrecover(DIGEST, v, r, s), address(0), "ecrecover should have failed and returned address(0)");

        vault.execute(DIGEST, v, r, s);
        assertEq(vault.executed(), 1, "an unsigned call was authorised as the owner");
    }

    /// The zero address is not a signer anybody controls; it is what failure looks like.
    function test_vulnerable_recoveredAddressIsExactlyZero() public pure {
        assertEq(ecrecover(DIGEST, 29, bytes32(uint256(1)), bytes32(uint256(1))), address(0));
        assertEq(ecrecover(DIGEST, 27, bytes32(uint256(1)), bytes32(SECP256K1_N)), address(0));
    }

    // ------------------------------------------------------------------
    // The fix
    // ------------------------------------------------------------------

    /// Defect 1: a vault with no owner must not come into existence.
    function test_hardened_refusesToDeployWithoutAnOwner() public {
        vm.expectRevert(HardenedEcrecoverVault.OwnerUnset.selector);
        new HardenedEcrecoverVault(address(0));
    }

    /// Defect 2: a failed recovery must be named as a failed recovery, not silently compared.
    /// This vault has a real owner, so `NotOwner()` would already stop the call - and that is
    /// precisely why the check is easy to leave out and worth writing down.
    function test_hardened_namesAFailedRecoveryRatherThanComparingIt() public {
        HardenedEcrecoverVault vault = new HardenedEcrecoverVault(ownerAddr);

        vm.expectRevert(HardenedEcrecoverVault.ZeroRecovery.selector);
        vault.execute(DIGEST, 29, bytes32(uint256(1)), bytes32(uint256(1)));

        vm.expectRevert(HardenedEcrecoverVault.ZeroRecovery.selector);
        vault.execute(DIGEST, 27, bytes32(uint256(1)), bytes32(SECP256K1_N));

        assertEq(vault.executed(), 0, "nothing should have been authorised");
    }

    /// The fix must not break the thing the vault is for.
    function test_hardened_stillAuthorisesAGenuineOwnerSignature() public {
        HardenedEcrecoverVault vault = new HardenedEcrecoverVault(ownerAddr);

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerKey, DIGEST);
        assertEq(ecrecover(DIGEST, v, r, s), ownerAddr, "fixture: signature should recover to the owner");

        vault.execute(DIGEST, v, r, s);
        assertEq(vault.executed(), 1, "a genuine owner signature must still authorise the call");
    }

    /// A real signature from somebody who is not the owner is still rejected, and rejected as
    /// `NotOwner()` - a different failure from a signature that did not recover at all.
    function test_hardened_rejectsAGenuineSignatureFromANonOwner() public {
        HardenedEcrecoverVault vault = new HardenedEcrecoverVault(ownerAddr);

        uint256 strangerKey = 0xB0B;
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(strangerKey, DIGEST);

        vm.expectRevert(HardenedEcrecoverVault.NotOwner.selector);
        vault.execute(DIGEST, v, r, s);
    }

    // ------------------------------------------------------------------
    // TODO (write-up)
    //
    // Two defects were available here: the missing zero check inside `execute`, and the owner that
    // was allowed to be unset at deployment. Say which one you fixed first, and write two or three
    // sentences on why fixing only that one leaves the vault broken. Be concrete: name the
    // deployment or upgrade path that reintroduces the problem.
    //
    // Your answer:
    //
    //
    // ------------------------------------------------------------------
}
