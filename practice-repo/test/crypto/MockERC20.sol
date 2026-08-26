// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {IERC20Minimal} from "../../src/crypto/MerkleAirdrop.sol";

/// @notice The smallest token that can be drained. Test support only - not an exercise.
contract MockERC20 is IERC20Minimal {
    mapping(address => uint256) public balances;

    /// @notice Unrestricted on purpose. This is a fixture, not a token.
    function mint(address to, uint256 amount) external {
        balances[to] += amount;
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balances[msg.sender] >= amount, "MockERC20: insufficient balance");
        unchecked {
            balances[msg.sender] -= amount;
            balances[to] += amount;
        }
        return true;
    }
}
