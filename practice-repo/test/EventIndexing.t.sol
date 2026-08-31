// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-errors-events-indexed-string-is-a-hash  (break, grain block, difficulty 2)
 * Run:      forge test --junit --match-path test/EventIndexing.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Emit an event with an indexed string parameter and try to reconstruct the original string
 *   from the logs. You cannot: the topic is a hash. Fix it by emitting the value twice, once
 *   indexed and once not, and show that filtering by topic and reading the value both now work.
 *   In the same test file, emit one four-field event with 0, 1, 2 and 3 indexed parameters and
 *   record the gas of each so you can decompose the total into base, per-topic and per-byte
 *   components.
 */
contract EventIndexingTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// A test asserts the indexed-string topic equals keccak256 of the string and that the string
    /// itself appears nowhere in the log
    function test_criterion01_aTestAssertsTheIndexedStringTopicEqualsKeccak256() public {
        fail("A test asserts the indexed-string topic equals keccak256 of the string and that the string itself appears nowhere in the log");
    }

    /// A test filters by the indexed topic and separately reads the plain value from the data
    /// field, both succeeding on the fixed event
    function test_criterion02_aTestFiltersByTheIndexedTopicAndSeparately() public {
        fail("A test filters by the indexed topic and separately reads the plain value from the data field, both succeeding on the fixed event");
    }

    /// Measured per-topic gas deltas land near 375 and the file decomposes one emit into base,
    /// topics and data bytes
    function test_criterion03_measuredPerTopicGasDeltasLandNear375And() public {
        fail("Measured per-topic gas deltas land near 375 and the file decomposes one emit into base, topics and data bytes");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
