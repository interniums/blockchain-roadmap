// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {SelectorClash} from "../src/solidity-abi-selectors/SelectorClash.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-abi-selectors-mine-a-clashing-selector  (break, grain block, difficulty 4)
 * Run:      forge test --junit --match-path test/SelectorClash.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Brute-force a function name of the form attack_<n>() whose four-byte selector equals the
 *   selector of upgradeTo(address). Deploy a minimal proxy whose fallback forwards to an
 *   implementation, give the implementation your mined function, and show that a call the admin
 *   believes goes to the proxy's upgrade path instead reaches the implementation, or the
 *   reverse, depending on which dispatcher sees the calldata first. Then swap in a
 *   transparent-proxy-style caller split and re-run the same test to show the clash is no longer
 *   reachable.
 */
contract SelectorClashTest is Test {
    /// The subject, from src/solidity-abi-selectors/SelectorClash.sol. Add functions there and call them here.
    SelectorClash internal subject;

    function setUp() public {
        subject = new SelectorClash();
    }

    /// The mined function name is in the test source and a test asserts its selector equals the
    /// target selector
    function test_criterion01_theMinedFunctionNameIsInTheTestSource() public {
        fail("The mined function name is in the test source and a test asserts its selector equals the target selector");
    }

    /// A test proves a single calldata payload reaches the wrong code path on the naive proxy
    function test_criterion02_aTestProvesASingleCalldataPayloadReachesThe() public {
        fail("A test proves a single calldata payload reaches the wrong code path on the naive proxy");
    }

    /// The same test passes safely against the caller-splitting proxy, with an assertion that the
    /// admin path and the user path now differ
    function test_criterion03_theSameTestPassesSafelyAgainstTheCallerSplitting() public {
        fail(
            "The same test passes safely against the caller-splitting proxy, with an assertion that the admin path and the user path now differ"
        );
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
