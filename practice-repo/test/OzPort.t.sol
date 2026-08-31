// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-openzeppelin-port-4x-to-5x  (fix, grain block, difficulty 2)
 * Run:      forge test --junit --match-path test/OzPort.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Take a contract written against OpenZeppelin 4.x — Ownable with an implicit owner, Counters,
 *   an ERC-20 with _beforeTokenTransfer, and a call to increaseAllowance — and port it to 5.7.0.
 *   Every removal has a different replacement and one of them has none. Rewrite the tests so
 *   they assert custom-error selectors rather than revert strings. If the contract has an
 *   upgradeable variant, fix the imports so stateless contracts come from the main package.
 */
contract OzPortTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// The project compiles against openzeppelin-contracts v5.7.0 with no deprecated or removed
    /// imports
    function test_criterion01_theProjectCompilesAgainstOpenzeppelinContractsV570() public {
        fail("The project compiles against openzeppelin-contracts v5.7.0 with no deprecated or removed imports");
    }

    /// Tests assert OwnableUnauthorizedAccount and at least one other 5.x custom error by selector,
    /// not by string
    function test_criterion02_testsAssertOwnableunauthorizedaccountAndAtLeastOneOther5() public {
        fail("Tests assert OwnableUnauthorizedAccount and at least one other 5.x custom error by selector, not by string");
    }

    /// A comment records, for each removed 4.x API, what replaced it and where the behaviour is not
    /// equivalent
    function test_criterion03_aCommentRecordsForEachRemoved4XApi() public {
        fail("A comment records, for each removed 4.x API, what replaced it and where the behaviour is not equivalent");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
