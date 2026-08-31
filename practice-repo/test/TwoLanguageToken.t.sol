// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-vyper-same-token-two-languages  (implement, grain block, difficulty 3)
 * Run:      forge test --junit --match-path test/TwoLanguageToken.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Implement the same ERC-20 twice: once in Vyper against the version you pin, and once in
 *   Solidity 0.8.36 using OpenZeppelin. Drive both from one Foundry test suite through the ABI,
 *   so the same tests run against both deployments. Record deployed bytecode size for each. Then
 *   write down, for the Solidity version, every behaviour that comes from an inherited function
 *   or a modifier you cannot see from the function body, and what the Vyper version writes
 *   inline instead.
 */
contract TwoLanguageTokenTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// One test contract runs the same assertions against both deployments, addressed only through
    /// the shared ABI
    function test_criterion01_oneTestContractRunsTheSameAssertionsAgainstBoth() public {
        fail("One test contract runs the same assertions against both deployments, addressed only through the shared ABI");
    }

    /// Deployed bytecode size is recorded for both, with the exact compiler versions named
    function test_criterion02_deployedBytecodeSizeIsRecordedForBothWithThe() public {
        fail("Deployed bytecode size is recorded for both, with the exact compiler versions named");
    }

    /// A written list names at least three behaviours the Solidity version inherits and where the
    /// Vyper version states them inline
    function test_criterion03_aWrittenListNamesAtLeastThreeBehavioursThe() public {
        fail("A written list names at least three behaviours the Solidity version inherits and where the Vyper version states them inline");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
