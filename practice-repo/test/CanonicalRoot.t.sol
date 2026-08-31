// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {CanonicalRoot} from "../src/fundamentals-state/CanonicalRoot.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: fundamentals-state-one-root-every-client  (break, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/CanonicalRoot.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   The trie has no design freedom left in it, and this exercise is to find out why by removing
 *   some. Take your trie implementation and insert the same key-value set in two different
 *   orders. Assert the roots are identical. Then deliberately break canonicality in three ways,
 *   one at a time, and show each producing a different root from the same logical data: skip the
 *   inlining threshold, allow a non-minimal path encoding, and permit an extension node with an
 *   empty path. For each, name the rule you violated and state what would happen on a live
 *   network if two clients disagreed that way. Then connect it to the header: show that your
 *   root changes when any single account in the set changes, and that it does not change when
 *   the insertion order does. That pair of facts is what the state root in a block header is
 *   for. Close with two sentences on the replacement that did not happen: what Verkle promised
 *   about this structure, and what is being pursued instead.
 */
contract CanonicalRootTest is Test {
    /// The subject, from src/fundamentals-state/CanonicalRoot.sol. Add functions there and call them here.
    CanonicalRoot internal subject;

    function setUp() public {
        subject = new CanonicalRoot();
    }

    /// The same key-value set inserted in two orders produces an identical root
    function test_criterion01_theSameKeyValueSetInsertedInTwoOrders() public {
        fail("The same key-value set inserted in two orders produces an identical root");
    }

    /// Three distinct canonicality violations each produce a different root from the same logical
    /// data
    function test_criterion02_threeDistinctCanonicalityViolationsEachProduceADifferentRoot() public {
        fail("Three distinct canonicality violations each produce a different root from the same logical data");
    }

    /// Each violation names the rule broken and the live-network consequence of two clients
    /// disagreeing that way
    function test_criterion03_eachViolationNamesTheRuleBrokenAndTheLive() public {
        fail(
            "Each violation names the rule broken and the live-network consequence of two clients disagreeing that way"
        );
    }

    /// A single account change is shown changing the root
    function test_criterion04_aSingleAccountChangeIsShownChangingTheRoot() public {
        fail("A single account change is shown changing the root");
    }

    /// Insertion order is shown not to change the root
    function test_criterion05_insertionOrderIsShownNotToChangeTheRoot() public {
        fail("Insertion order is shown not to change the root");
    }

    /// Two sentences state what Verkle promised and what replaced it
    function test_criterion06_twoSentencesStateWhatVerklePromisedAndWhatReplaced() public {
        fail("Two sentences state what Verkle promised and what replaced it");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
