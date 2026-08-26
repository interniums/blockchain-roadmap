// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {
    PermissionRegistryBase,
    PackedPermissionRegistry,
    SafePermissionRegistry,
    EncodingCost
} from "../src/encoding/PermissionRegistry.sol";

/*
 * Practice: fundamentals-encoding-collide-a-packed-authorisation  (kind: break)
 * Run:      forge test --match-path test/PackedCollision.t.sol -vvv --gas-report
 *
 * Your work is `_collidingPair` at the bottom of this file, and then the one TODO line in
 * SafePermissionRegistry.permissionHash.
 *
 * `--gas-report` is part of the acceptance command on purpose. The saving you are giving up by
 * switching encodings should end up as a number you can quote, not a feeling.
 */
contract PackedCollisionTest is Test {
    /// The one permission the registry is deployed with.
    string internal constant SCOPE = "ADMIN";
    string internal constant ACTION = "WITHDRAW";

    PackedPermissionRegistry internal packed;
    EncodingCost internal cost;

    address internal attacker = address(0xA77ACC);

    function setUp() public {
        packed = new PackedPermissionRegistry(keccak256(abi.encodePacked(SCOPE, ACTION)));
        cost = new EncodingCost();
    }

    // ------------------------------------------------------------------
    // Evidence: the registry as written
    // ------------------------------------------------------------------

    function test_evidence_theRegisteredPairGrantsTheRole() public {
        vm.prank(attacker);
        packed.claimRole(SCOPE, ACTION);
        assertTrue(packed.hasRole(attacker), "the registered pair should grant the role");
    }

    function test_evidence_anUnrelatedPairDoesNot() public {
        vm.expectRevert(PermissionRegistryBase.UnknownPermission.selector);
        packed.claimRole("USER", "READ");
    }

    // ------------------------------------------------------------------
    // The break
    // ------------------------------------------------------------------

    /// Two different pairs of strings, one byte string, one permission hash.
    function test_break_thePackedEncodingsAreIdenticalWhileTheArgumentsAreNot() public pure {
        (string memory scope, string memory action) = _collidingPair();

        assertTrue(
            keccak256(bytes(scope)) != keccak256(bytes(SCOPE)) || keccak256(bytes(action)) != keccak256(bytes(ACTION)),
            "that is the registered pair; find a different one"
        );
        assertEq(
            keccak256(abi.encodePacked(scope, action)),
            keccak256(abi.encodePacked(SCOPE, ACTION)),
            "the two pairs do not pack to the same bytes"
        );
        assertEq(
            abi.encodePacked(scope, action),
            abi.encodePacked(SCOPE, ACTION),
            "the packed encodings differ byte for byte"
        );
    }

    /// And so the registry hands out a role it was never asked to hand out.
    function test_break_aPairThatWasNeverRegisteredGrantsTheRole() public {
        (string memory scope, string memory action) = _collidingPair();

        vm.prank(attacker);
        packed.claimRole(scope, action);

        assertTrue(packed.hasRole(attacker), "the colliding pair did not grant the role");
        console2.log("granted on scope :", scope);
        console2.log("granted on action:", action);
    }

    // ------------------------------------------------------------------
    // What the fix costs
    // ------------------------------------------------------------------

    /// Calldata size and gas for the same two strings under both encodings.
    /// `--gas-report` attributes the two hashing calls separately; the numbers below make the
    /// byte-size difference explicit in the test output as well.
    function test_cost_theSavingBeingTradedAway() public view {
        uint256 packedBytes = cost.packedLength(SCOPE, ACTION);
        uint256 encodedBytes = cost.encodedLength(SCOPE, ACTION);

        uint256 g0 = gasleft();
        cost.hashPacked(SCOPE, ACTION);
        uint256 packedGas = g0 - gasleft();

        uint256 g1 = gasleft();
        cost.hashEncoded(SCOPE, ACTION);
        uint256 encodedGas = g1 - gasleft();

        console2.log("abi.encodePacked bytes:", packedBytes);
        console2.log("abi.encode       bytes:", encodedBytes);
        console2.log("abi.encodePacked gas  :", packedGas);
        console2.log("abi.encode       gas  :", encodedGas);
        console2.log("extra bytes for the fix:", encodedBytes - packedBytes);

        assertGt(encodedBytes, packedBytes, "abi.encode is the larger encoding; that is the trade");
    }

    // ------------------------------------------------------------------
    // The fix
    // ------------------------------------------------------------------

    function test_safe_hashesTheSamePairDifferentlyFromThePackedRegistry() public {
        SafePermissionRegistry safe = _deploySafe();
        assertTrue(
            safe.permissionHash(SCOPE, ACTION) != packed.permissionHash(SCOPE, ACTION),
            "SafePermissionRegistry.permissionHash still hashes exactly what the packed one hashes"
        );
    }

    function test_safe_rejectsTheCollidingPair() public {
        SafePermissionRegistry safe = _deploySafe();
        (string memory scope, string memory action) = _collidingPair();

        vm.prank(attacker);
        vm.expectRevert(PermissionRegistryBase.UnknownPermission.selector);
        safe.claimRole(scope, action);

        assertFalse(safe.hasRole(attacker), "the colliding pair still granted the role");
    }

    function test_safe_stillGrantsTheRegisteredPair() public {
        SafePermissionRegistry safe = _deploySafe();

        vm.prank(attacker);
        safe.claimRole(SCOPE, ACTION);
        assertTrue(safe.hasRole(attacker), "the fix must not break the legitimate grant");
    }

    // ==================================================================
    // YOUR WORK
    // ==================================================================

    /// @notice Return a (scope, action) pair that is not the registered one but packs to the same
    ///         bytes as ("ADMIN", "WITHDRAW").
    /// @dev    Write out `abi.encodePacked(SCOPE, ACTION)` byte by byte first, and ask what marks
    ///         the boundary between the two arguments in that byte string.
    function _collidingPair() internal pure returns (string memory scope, string memory action) {
        // TODO: set scope and action, then delete the guard below.
        require(
            bytes(scope).length != 0 && bytes(action).length != 0,
            "TODO: _collidingPair in test/PackedCollision.t.sol is unimplemented"
        );
    }

    // ------------------------------------------------------------------
    // TODO (write-up)
    //
    // Quote the two numbers test_cost_theSavingBeingTradedAway printed, and the two gas figures
    // --gas-report attributed to hashPacked and hashEncoded. Then answer in one sentence: for a
    // permission check that runs once per grant, is that a saving worth having?
    //
    // Your answer:
    //
    //
    // ------------------------------------------------------------------

    function _deploySafe() internal returns (SafePermissionRegistry safe) {
        // Deployed against the registered permission under the safe registry's own encoding, the
        // way an operator redeploying the registry would.
        SafePermissionRegistry hasher = new SafePermissionRegistry(bytes32(0));
        safe = new SafePermissionRegistry(hasher.permissionHash(SCOPE, ACTION));
    }
}
