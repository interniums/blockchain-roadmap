// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {MerkleAirdropBase, MerkleAirdrop, HardenedMerkleAirdrop, IERC20Minimal} from "../src/crypto/MerkleAirdrop.sol";
import {MockERC20} from "./crypto/MockERC20.sol";
import {NaiveMerkleTree} from "./crypto/NaiveMerkleTree.sol";

/*
 * Practice: fundamentals-crypto-forge-a-merkle-claim  (kind: break)
 * Run:      forge test --match-path test/MerkleForgery.t.sol -vvv
 *
 * Your job is `_forgeClaim` at the bottom of this file, and then the one TODO line in
 * HardenedMerkleAirdrop.leafHash. Everything else here - the tree builder, the token, the
 * assertions - is the fixture, and the assertions are the specification.
 *
 * FIXTURE NOTE, worth reading before you decide this cannot be done.
 * The distribution has five funded recipients. The generator pads the leaf row out to a power of
 * two so the tree is balanced, and writes each unallocated slot as a reserved 20-byte address word
 * rather than as a hash. That is how this particular operator's tooling works; it is a property of
 * the fixture, not a hint about what to do with it.
 */
contract MerkleForgeryTest is Test {
    using NaiveMerkleTree for bytes32[][];

    /// The published distribution. Five funded recipients, three unallocated slots.
    uint256 internal constant FUNDED = 5;
    uint256 internal constant SLOTS = 8;

    address[FUNDED] internal recipients = [
        address(0x1111111111111111111111111111111111111111),
        address(0x2222222222222222222222222222222222222222),
        address(0x3333333333333333333333333333333333333333),
        address(0x4444444444444444444444444444444444444444),
        address(0x5555555555555555555555555555555555555555)
    ];
    uint256[FUNDED] internal amounts = [uint256(100 ether), 250 ether, 40 ether, 7 ether, 1_000 ether];

    MockERC20 internal token;
    MerkleAirdrop internal naive;
    bytes32[][] internal naiveLevels;

    function setUp() public {
        token = new MockERC20();

        bytes32[] memory leaves = _naiveLeafRow();
        bytes32[][] memory levels = NaiveMerkleTree.build(leaves);
        _store(levels);

        naive = new MerkleAirdrop(NaiveMerkleTree.root(levels), IERC20Minimal(address(token)));

        // Funded generously so that a successful forgery shows up as a transfer rather than as an
        // out-of-balance revert.
        token.mint(address(naive), type(uint256).max);
    }

    // ------------------------------------------------------------------
    // The distribution works
    // ------------------------------------------------------------------

    function test_fixture_everyFundedRecipientCanClaim() public {
        bytes32[][] memory levels = _levels();
        for (uint256 i = 0; i < FUNDED; ++i) {
            naive.claim(recipients[i], amounts[i], NaiveMerkleTree.proof(levels, i));
            assertEq(token.balanceOf(recipients[i]), amounts[i], "funded recipient did not receive their allocation");
        }
    }

    function test_fixture_anAddressOutsideTheTreeCannotJustAskForMoney() public {
        address stranger = address(0xBAD);
        bytes32[] memory emptyProof = new bytes32[](3);
        vm.expectRevert(MerkleAirdropBase.InvalidProof.selector);
        naive.claim(stranger, 1 ether, emptyProof);
    }

    // ------------------------------------------------------------------
    // The forgery
    // ------------------------------------------------------------------

    /// The claim the contract accepts is not a leaf of the tree at all.
    function test_forgery_theForgedLeafIsAnInternalNodeOfThePublishedTree() public view {
        bytes32[][] memory levels = _levels();
        ForgedClaim memory forged = _forgeClaim(levels);

        assertGt(forged.nodeLevel, 0, "a leaf is not a forgery; name an internal node");
        assertLt(forged.nodeLevel, levels.length, "no such level in this tree");
        assertLt(forged.nodeIndex, levels[forged.nodeLevel].length, "no such node on that level");

        assertEq(
            naive.leafHash(forged.account, forged.amount),
            levels[forged.nodeLevel][forged.nodeIndex],
            "the claim does not hash to the internal node it names"
        );

        console2.log("forged leaf reuses internal node at level", forged.nodeLevel);
        console2.log("                                    index", forged.nodeIndex);
    }

    /// No hash was broken. The claim is simply read as the wrong kind of object.
    function test_forgery_naiveAirdropPaysAnAddressThatWasNeverInTheDistribution() public {
        bytes32[][] memory levels = _levels();
        ForgedClaim memory forged = _forgeClaim(levels);

        assertFalse(_isFundedRecipient(forged.account), "pick an account the distribution never contained");
        assertEq(token.balanceOf(forged.account), 0, "fixture: the forged account starts with nothing");

        uint256 before = token.balanceOf(address(naive));
        naive.claim(forged.account, forged.amount, forged.proof);

        assertEq(token.balanceOf(forged.account), forged.amount, "the forged claim did not pay out");
        assertEq(token.balanceOf(address(naive)) + forged.amount, before, "the airdrop was not debited");
        assertGt(forged.amount, amounts[4], "a forgery worth less than the largest honest claim is not the interesting one");
    }

    // ------------------------------------------------------------------
    // The fix
    // ------------------------------------------------------------------

    /// The leaf encoding has to change. Nothing else may.
    function test_hardened_leafEncodingDiffersFromTheNaiveOne() public {
        HardenedMerkleAirdrop hasher = _hardenedHasher();
        assertTrue(
            hasher.leafHash(recipients[0], amounts[0]) != naive.leafHash(recipients[0], amounts[0]),
            "HardenedMerkleAirdrop.leafHash still hashes exactly what MerkleAirdrop.leafHash hashes"
        );
    }

    /// The identical forged calldata, against the hardened airdrop.
    function test_hardened_rejectsTheIdenticalForgedCalldata() public {
        ForgedClaim memory forged = _forgeClaim(_levels());
        HardenedMerkleAirdrop hardened = _deployHardened();

        vm.expectRevert(MerkleAirdropBase.InvalidProof.selector);
        hardened.claim(forged.account, forged.amount, forged.proof);

        assertEq(token.balanceOf(forged.account), 0, "the forged account was paid anyway");
    }

    /// And the honest distribution still works, rebuilt under the new leaf rule.
    function test_hardened_everyLegitimateRecipientStillClaims() public {
        HardenedMerkleAirdrop hardened = _deployHardened();
        bytes32[][] memory levels = NaiveMerkleTree.build(_hardenedLeafRow());

        for (uint256 i = 0; i < FUNDED; ++i) {
            hardened.claim(recipients[i], amounts[i], NaiveMerkleTree.proof(levels, i));
            assertEq(token.balanceOf(recipients[i]), amounts[i], "funded recipient lost their allocation to the fix");
        }
    }

    // ==================================================================
    // YOUR WORK
    // ==================================================================

    struct ForgedClaim {
        /// The address the airdrop will pay. It must not be one of `recipients`.
        address account;
        /// The amount the airdrop will pay it.
        uint256 amount;
        /// The proof handed to `claim`.
        bytes32[] proof;
        /// Which level of the published tree the accepted "leaf" actually sits on (0 = leaf row).
        uint256 nodeLevel;
        /// Its index within that level.
        uint256 nodeIndex;
    }

    /// @notice Build a claim the naive airdrop accepts for an entry that was never in the tree.
    /// @param  levels The published tree, exactly as an airdrop operator would publish it:
    ///                levels[0] is the leaf row, the last level holds the root.
    ///                This is everything the attacker knows, and it is enough.
    /// @dev    You are not looking for a hash collision, and you will not find one. You are looking
    ///         for a byte string this contract is willing to read as two different kinds of object.
    ///         Start by writing down, in bytes, what `leafHash` hashes and what the fold hashes.
    function _forgeClaim(bytes32[][] memory levels) internal pure returns (ForgedClaim memory forged) {
        // TODO: fill in every field of `forged` from `levels`, then delete the guard below.
        require(
            levels.length != 0 && forged.proof.length != 0,
            "TODO: _forgeClaim in test/MerkleForgery.t.sol is unimplemented"
        );
    }

    // ------------------------------------------------------------------
    // TODO (write-up)
    //
    // In one or two sentences: name the internal node you reused, and say what property of the
    // fixture's leaf row made that node usable when most nodes in the tree are not. Then say which
    // of the fixes in the lesson you chose, and what the tree generator had to change to match.
    //
    // Your answer:
    //
    //
    // ------------------------------------------------------------------

    // ==================================================================
    // Fixture plumbing - nothing below here is part of the exercise
    // ==================================================================

    /// The leaf row the operator committed to: five funded entries, then reserved slots.
    function _naiveLeafRow() internal view returns (bytes32[] memory leaves) {
        leaves = new bytes32[](SLOTS);
        for (uint256 i = 0; i < FUNDED; ++i) {
            leaves[i] = keccak256(abi.encode(recipients[i], amounts[i]));
        }
        for (uint256 i = FUNDED; i < SLOTS; ++i) {
            leaves[i] = _reservedSlot(i);
        }
    }

    /// The same row under the hardened leaf rule. Calls the contract so the generator can never
    /// drift away from the verifier.
    function _hardenedLeafRow() internal returns (bytes32[] memory leaves) {
        HardenedMerkleAirdrop hasher = _hardenedHasher();
        leaves = new bytes32[](SLOTS);
        for (uint256 i = 0; i < FUNDED; ++i) {
            leaves[i] = hasher.leafHash(recipients[i], amounts[i]);
        }
        for (uint256 i = FUNDED; i < SLOTS; ++i) {
            leaves[i] = _reservedSlot(i);
        }
    }

    /// An unallocated slot, written as a reserved address word so the operator can fill it later.
    function _reservedSlot(uint256 i) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(uint256(keccak256(abi.encode("chainpath.airdrop.reserved", i))))));
    }

    function _isFundedRecipient(address account) internal view returns (bool) {
        for (uint256 i = 0; i < FUNDED; ++i) {
            if (recipients[i] == account) return true;
        }
        return false;
    }

    /// `leafHash` is pure, so a throwaway instance is enough to ask the hardened contract what a
    /// leaf is before we know the root we want to deploy with.
    function _hardenedHasher() internal returns (HardenedMerkleAirdrop) {
        return new HardenedMerkleAirdrop(bytes32(0), IERC20Minimal(address(token)));
    }

    function _deployHardened() internal returns (HardenedMerkleAirdrop hardened) {
        bytes32[][] memory levels = NaiveMerkleTree.build(_hardenedLeafRow());
        hardened = new HardenedMerkleAirdrop(NaiveMerkleTree.root(levels), IERC20Minimal(address(token)));
        token.mint(address(hardened), type(uint256).max);
    }

    function _store(bytes32[][] memory levels) internal {
        delete naiveLevels;
        for (uint256 i = 0; i < levels.length; ++i) {
            naiveLevels.push(levels[i]);
        }
    }

    function _levels() internal view returns (bytes32[][] memory levels) {
        levels = new bytes32[][](naiveLevels.length);
        for (uint256 i = 0; i < naiveLevels.length; ++i) {
            levels[i] = naiveLevels[i];
        }
    }
}
