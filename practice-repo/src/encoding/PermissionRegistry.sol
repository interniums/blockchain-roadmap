// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * Practice: fundamentals-encoding-collide-a-packed-authorisation
 * Run:      forge test --match-path test/PackedCollision.t.sol -vvv --gas-report
 *
 * The registry grants a role when the hash of a (scope, action) pair matches the one permission it
 * was deployed with. How that pair becomes a hash is the only thing that differs between the two
 * registries below.
 */

/// @notice Everything a permission registry does apart from deciding how a pair becomes a hash.
abstract contract PermissionRegistryBase {
    /// @notice The one permission this registry recognises.
    bytes32 public immutable permission;

    /// @notice Who has been granted the role.
    mapping(address => bool) public hasRole;

    error UnknownPermission();

    constructor(bytes32 permission_) {
        permission = permission_;
    }

    /// @notice How a (scope, action) pair becomes the 32 bytes that authorise a grant.
    function permissionHash(string memory scope, string memory action) public pure virtual returns (bytes32);

    /// @notice Grant the caller the role, if they can name the registered permission.
    function claimRole(string calldata scope, string calldata action) external {
        if (permissionHash(scope, action) != permission) revert UnknownPermission();
        hasRole[msg.sender] = true;
    }
}

/// @notice The registry as written. Evidence. DO NOT EDIT IT.
contract PackedPermissionRegistry is PermissionRegistryBase {
    constructor(bytes32 permission_) PermissionRegistryBase(permission_) {}

    /// @dev `abi.encodePacked` writes each string's bytes with no length prefix and no separator.
    function permissionHash(string memory scope, string memory action) public pure override returns (bytes32) {
        return keccak256(abi.encodePacked(scope, action));
    }
}

/// @notice Your hardened copy.
contract SafePermissionRegistry is PermissionRegistryBase {
    constructor(bytes32 permission_) PermissionRegistryBase(permission_) {}

    function permissionHash(string memory scope, string memory action) public pure override returns (bytes32) {
        // TODO: the whole fix is on this line. Take the gas and byte-size measurement in
        //   test_cost_theSavingBeingTradedAway *before* you change it, so you can say what the fix
        //   costs rather than guessing.
        return keccak256(abi.encodePacked(scope, action));
    }
}

/// @notice Measurement harness for the encode-versus-encodePacked comparison.
/// @dev    External functions so that `--gas-report` attributes a real call to each. Not an
///         exercise; nothing here needs changing.
contract EncodingCost {
    function hashPacked(string calldata scope, string calldata action) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(scope, action));
    }

    function hashEncoded(string calldata scope, string calldata action) external pure returns (bytes32) {
        return keccak256(abi.encode(scope, action));
    }

    function packedLength(string calldata scope, string calldata action) external pure returns (uint256) {
        return abi.encodePacked(scope, action).length;
    }

    function encodedLength(string calldata scope, string calldata action) external pure returns (uint256) {
        return abi.encode(scope, action).length;
    }
}
