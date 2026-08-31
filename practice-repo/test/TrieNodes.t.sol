// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: fundamentals-state-build-the-trie  (implement, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/TrieNodes.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Implement a Merkle Patricia Trie from an empty map upward, using nothing but the four node
 *   types. Insert keys one at a time and, after each insert, print the tree's shape as node
 *   types. Construct an insertion sequence that forces each of the four to appear, including the
 *   null node, and one that turns a leaf into an extension plus a branch. Assert the shape at
 *   each step against a shape you wrote down first. Then show what is actually on the wire: for
 *   one branch, one extension and one leaf, print the encoded bytes and label every field. A
 *   branch has a specific arity and a value slot; say why both are there. Finally, demonstrate
 *   the rule that makes it a Merkle structure rather than just a trie: show that a child shorter
 *   than the threshold is inlined in its parent rather than referenced by hash, and find the key
 *   length at which your implementation flips from one to the other.
 */
contract TrieNodesTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A trie is implemented from scratch supporting insert and lookup over a key-value map
    function test_criterion01_aTrieIsImplementedFromScratchSupportingInsertAnd() public {
        fail("A trie is implemented from scratch supporting insert and lookup over a key-value map");
    }

    /// An insertion sequence forces all four node types to appear, including the null node
    function test_criterion02_anInsertionSequenceForcesAllFourNodeTypesTo() public {
        fail("An insertion sequence forces all four node types to appear, including the null node");
    }

    /// One insertion is shown converting a leaf into an extension plus a branch, with the shape
    /// asserted against a prediction written first
    function test_criterion03_oneInsertionIsShownConvertingALeafIntoAn() public {
        fail("One insertion is shown converting a leaf into an extension plus a branch, with the shape asserted against a prediction written first");
    }

    /// Encoded bytes for a branch, an extension and a leaf are printed with every field labelled
    function test_criterion04_encodedBytesForABranchAnExtensionAndA() public {
        fail("Encoded bytes for a branch, an extension and a leaf are printed with every field labelled");
    }

    /// The write-up explains the branch node's arity and why it also holds a value
    function test_criterion05_theWriteUpExplainsTheBranchNodeSArity() public {
        fail("The write-up explains the branch node's arity and why it also holds a value");
    }

    /// A child below the inlining threshold is shown inlined rather than hash-referenced, with the
    /// flip point identified
    function test_criterion06_aChildBelowTheInliningThresholdIsShownInlined() public {
        fail("A child below the inlining threshold is shown inlined rather than hash-referenced, with the flip point identified");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
