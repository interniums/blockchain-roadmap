// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/// @notice Builder for the sorted-pair tree the airdrop verifies against.
/// @dev    Test support, not an exercise. This is the ordinary, working tooling an airdrop
///         operator would publish alongside the root: it builds every level and hands out proofs
///         for real leaves. It is complete and correct for the job it claims to do.
library NaiveMerkleTree {
    /// @notice Build every level of the tree, bottom-up.
    /// @param  leaves Leaf hashes. Length must be a power of two; pad before calling.
    /// @return levels levels[0] is the leaf row; levels[levels.length - 1] is a one-element row
    ///         holding the root.
    function build(bytes32[] memory leaves) internal pure returns (bytes32[][] memory levels) {
        require(leaves.length > 1, "NaiveMerkleTree: need at least two leaves");
        require(leaves.length & (leaves.length - 1) == 0, "NaiveMerkleTree: leaf count must be a power of two");

        uint256 depth = 1;
        for (uint256 n = leaves.length; n > 1; n >>= 1) depth++;

        levels = new bytes32[][](depth);
        levels[0] = leaves;

        for (uint256 level = 1; level < depth; ++level) {
            bytes32[] memory below = levels[level - 1];
            bytes32[] memory row = new bytes32[](below.length / 2);
            for (uint256 i = 0; i < row.length; ++i) {
                row[i] = hashPair(below[2 * i], below[2 * i + 1]);
            }
            levels[level] = row;
        }
    }

    /// @notice The root of a built tree.
    function root(bytes32[][] memory levels) internal pure returns (bytes32) {
        return levels[levels.length - 1][0];
    }

    /// @notice The proof an honest claimant is handed for the leaf at `leafIndex`.
    function proof(bytes32[][] memory levels, uint256 leafIndex) internal pure returns (bytes32[] memory path) {
        path = new bytes32[](levels.length - 1);
        uint256 index = leafIndex;
        for (uint256 level = 0; level + 1 < levels.length; ++level) {
            uint256 sibling = index ^ 1;
            path[level] = levels[level][sibling];
            index >>= 1;
        }
    }

    /// @notice The same sorted-pair rule the on-chain fold uses.
    function hashPair(bytes32 a, bytes32 b) internal pure returns (bytes32) {
        return a < b ? keccak256(abi.encodePacked(a, b)) : keccak256(abi.encodePacked(b, a));
    }
}
