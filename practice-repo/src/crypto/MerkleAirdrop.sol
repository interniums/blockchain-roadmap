// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * Practice: fundamentals-crypto-forge-a-merkle-claim
 * Run:      forge test --match-path test/MerkleForgery.t.sol -vvv
 *
 * The proof-verification loop lives in the shared base below and is deliberately the same code for
 * both airdrops. The exercise forbids changing it, so the structure of this file forbids it too:
 * `leafHash` is the only thing a subclass may decide.
 */

interface IERC20Minimal {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/// @notice Everything an airdrop does apart from deciding what a leaf is.
abstract contract MerkleAirdropBase {
    /// @notice Root of the published distribution tree.
    bytes32 public immutable root;
    /// @notice Token paid out to claimants.
    IERC20Minimal public immutable token;
    /// @notice One claim per address.
    mapping(address => bool) public claimed;

    error AlreadyClaimed();
    error InvalidProof();
    error TransferFailed();

    constructor(bytes32 root_, IERC20Minimal token_) {
        root = root_;
        token = token_;
    }

    /// @notice How an entry in the distribution becomes a 32-byte commitment.
    /// @dev    The single point of difference between the two airdrops in this file.
    function leafHash(address account, uint256 amount) public pure virtual returns (bytes32);

    /// @notice Sorted-pair fold from a leaf up to the root.
    /// @dev    Correct as written, and identical in both airdrops. Do not edit this.
    ///         Sorted pairs mean a node carries no record of which side it came from, or how deep
    ///         it sits.
    function claim(address account, uint256 amount, bytes32[] calldata proof) external {
        if (claimed[account]) revert AlreadyClaimed();

        bytes32 node = leafHash(account, amount);
        for (uint256 i = 0; i < proof.length; ++i) {
            bytes32 sibling = proof[i];
            node = node < sibling
                ? keccak256(abi.encodePacked(node, sibling))
                : keccak256(abi.encodePacked(sibling, node));
        }
        if (node != root) revert InvalidProof();

        claimed[account] = true;
        if (!token.transfer(account, amount)) revert TransferFailed();
    }
}

/// @notice The airdrop as shipped. Evidence. DO NOT EDIT IT.
contract MerkleAirdrop is MerkleAirdropBase {
    constructor(bytes32 root_, IERC20Minimal token_) MerkleAirdropBase(root_, token_) {}

    /// @dev `abi.encode(address, uint256)` is two padded words: exactly 64 bytes of pre-image.
    ///      An internal node's pre-image is two 32-byte child hashes: also exactly 64 bytes.
    function leafHash(address account, uint256 amount) public pure override returns (bytes32) {
        return keccak256(abi.encode(account, amount));
    }
}

/// @notice Your hardened copy.
contract HardenedMerkleAirdrop is MerkleAirdropBase {
    constructor(bytes32 root_, IERC20Minimal token_) MerkleAirdropBase(root_, token_) {}

    function leafHash(address account, uint256 amount) public pure override returns (bytes32) {
        // TODO: make it impossible for one byte string to be read both as a leaf pre-image and as
        //   an internal node's pre-image. The whole fix belongs on this line. Do not touch
        //   `claim`, and do not add an allowlist of addresses - both would hide the defect rather
        //   than remove it.
        //
        //   Whatever you choose here, the tree generator in the test has to agree with it in the
        //   same edit. A verifier and a builder that disagree about leaf hashing produce a
        //   contract that rejects every honest claim, so keep an eye on
        //   test_hardened_everyLegitimateRecipientStillClaims.
        return keccak256(abi.encode(account, amount));
    }
}
