// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * Practice: fundamentals-crypto-malleable-double-spend
 * Run:      forge test --match-path test/Malleability.t.sol -vvv
 *
 * Three contracts, on purpose:
 *
 *   MalleablePayout - the payout contract as written. Evidence. DO NOT EDIT IT.
 *   LowSPayout      - fix one in isolation: reject non-canonical signatures. No replay guard at
 *                     all, so that what low-s does and does not buy you is visible.
 *   NoncePayout     - fix two, kept together with fix one: the replay key stops being the
 *                     signature bytes and becomes a nonce that is part of what was signed.
 */

/// @dev Group order of secp256k1. Every valid signature has a partner at `N - s`.
uint256 constant SECP256K1_N = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141;

/// @notice Pays out on an owner signature, and refuses to honour the same signature twice.
/// @dev    Frozen. This contract is the bug, not the exercise.
contract MalleablePayout {
    address public immutable owner;

    /// @notice Replay guard, keyed on the 65 signature bytes as they appear on the wire.
    mapping(bytes32 => bool) public usedSignatures;

    error BadSignature();
    error SignatureAlreadyUsed();
    error TransferFailed();

    constructor(address owner_) {
        owner = owner_;
    }

    receive() external payable {}

    /// @notice What the owner signs to approve a payout.
    function digest(address to, uint256 amount) public view returns (bytes32) {
        return keccak256(abi.encode(address(this), to, amount));
    }

    function spend(address to, uint256 amount, uint8 v, bytes32 r, bytes32 s) external {
        bytes32 key = keccak256(abi.encodePacked(r, s, v));
        if (usedSignatures[key]) revert SignatureAlreadyUsed();
        if (ecrecover(digest(to, amount), v, r, s) != owner) revert BadSignature();

        usedSignatures[key] = true;
        (bool ok,) = to.call{value: amount}("");
        if (!ok) revert TransferFailed();
    }
}

/// @notice Fix one, alone: refuse signatures that are not in canonical form.
/// @dev    Deliberately has no replay guard. Do not add one here - NoncePayout is where the replay
///         story belongs, and keeping them apart is what makes the difference measurable.
contract LowSPayout {
    address public immutable owner;

    error BadSignature();
    /// @notice `s` is above half the group order, so this is the mirror of a canonical signature.
    error NonCanonicalS();
    error TransferFailed();

    constructor(address owner_) {
        owner = owner_;
    }

    receive() external payable {}

    function digest(address to, uint256 amount) public view returns (bytes32) {
        return keccak256(abi.encode(address(this), to, amount));
    }

    function spend(address to, uint256 amount, uint8 v, bytes32 r, bytes32 s) external {
        // TODO: exactly one signature over a digest should be acceptable. Reject the other one
        //   with `NonCanonicalS()`. SECP256K1_N is declared at the top of this file.

        if (ecrecover(digest(to, amount), v, r, s) != owner) revert BadSignature();

        (bool ok,) = to.call{value: amount}("");
        if (!ok) revert TransferFailed();
    }
}

/// @notice Fix one and fix two together: canonical signatures only, and a replay key that lives in
///         the signed message rather than in the signature bytes.
contract NoncePayout {
    address public immutable owner;

    /// @notice Replay guard, keyed on something the signer committed to.
    mapping(uint256 => bool) public usedNonces;

    error BadSignature();
    error NonCanonicalS();
    error NonceAlreadyUsed();
    error TransferFailed();

    constructor(address owner_) {
        owner = owner_;
    }

    receive() external payable {}

    /// @notice What the owner signs. The nonce is part of it, which is the whole point.
    function digest(address to, uint256 amount, uint256 nonce) public view returns (bytes32) {
        return keccak256(abi.encode(address(this), to, amount, nonce));
    }

    function spend(address to, uint256 amount, uint256 nonce, uint8 v, bytes32 r, bytes32 s) external {
        // TODO (1 of 2): same canonical-form check as LowSPayout, with `NonCanonicalS()`.

        // TODO (2 of 2): consume `nonce` so that no signature over this digest - the original bytes
        //   or any variant of them - can be honoured a second time. Revert with
        //   `NonceAlreadyUsed()`. Mark it used before the transfer, not after.

        if (ecrecover(digest(to, amount, nonce), v, r, s) != owner) revert BadSignature();

        (bool ok,) = to.call{value: amount}("");
        if (!ok) revert TransferFailed();
    }
}
