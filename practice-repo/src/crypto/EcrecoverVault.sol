// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * Practice: fundamentals-crypto-ecrecover-returns-zero
 * Run:      forge test --match-path test/EcrecoverZero.t.sol -vvv
 *
 * Two contracts live here on purpose.
 *
 *   EcrecoverVault          - the vault as it was written. Evidence. DO NOT EDIT IT.
 *                             The tests that attack it are meant to keep passing, because they
 *                             document a real defect rather than a hypothetical one.
 *   HardenedEcrecoverVault  - your copy. Every TODO in it is your job.
 *
 * The suite fails until the hardened vault behaves. That is the correct starting state.
 */

/// @notice A vault that authorises privileged calls by recovering a signature and comparing the
///         recovered address to `owner`.
/// @dev    Frozen. This contract is the bug, not the exercise.
contract EcrecoverVault {
    /// @notice The only address allowed to authorise `execute`.
    /// @dev    Nothing here rejects address(0). A factory that reads an unconfigured registry entry
    ///         and passes it straight through will deploy a vault whose owner is the zero address.
    address public owner;

    /// @notice Number of successfully authorised calls. Stands in for "something privileged happened".
    uint256 public executed;

    error NotOwner();

    constructor(address owner_) {
        owner = owner_;
    }

    /// @notice Authorise a privileged call with an owner signature over `hash`.
    function execute(bytes32 hash, uint8 v, bytes32 r, bytes32 s) external {
        address recovered = ecrecover(hash, v, r, s);
        if (recovered != owner) revert NotOwner();
        executed += 1;
    }
}

/// @notice Your hardened copy of the vault above.
/// @dev    Same storage, same external signature, same error. Change only what the TODOs mark.
contract HardenedEcrecoverVault {
    address public owner;
    uint256 public executed;

    /// @notice The recovered address is not the owner.
    error NotOwner();
    /// @notice `ecrecover` could not recover anything and returned the zero address.
    error ZeroRecovery();
    /// @notice The vault was asked to deploy without an owner.
    error OwnerUnset();

    constructor(address owner_) {
        // TODO (defect 1 of 2): a vault with no owner must not exist.
        //   Refuse this deployment with `OwnerUnset()` when `owner_` is the zero address.
        owner = owner_;
    }

    function execute(bytes32 hash, uint8 v, bytes32 r, bytes32 s) external {
        address recovered = ecrecover(hash, v, r, s);

        // TODO (defect 2 of 2): read the signature of `ecrecover` and ask what it returns when it
        //   cannot recover anything. It does not revert. Reject that outcome with `ZeroRecovery()`
        //   *before* the owner comparison below, so a failed recovery is never mistaken for an
        //   identity claim.

        if (recovered != owner) revert NotOwner();
        executed += 1;
    }
}
