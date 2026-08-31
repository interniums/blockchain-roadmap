// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-yul-assembly-erc1967-fallback  (implement, grain block, difficulty 4)
 * Run:      forge test --junit --match-path test/Erc1967Fallback.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Implement an ERC-1967-style proxy fallback in inline assembly: copy the whole of calldata
 *   into memory, `delegatecall` the implementation read from the ERC-1967 slot, copy the return
 *   data back, and either `return` or `revert` with it unchanged. Decide whether the block can
 *   honestly carry the `("memory-safe")` annotation and write a comment justifying the decision
 *   against the documented permitted regions — quoting them, not paraphrasing. Add the
 *   code-existence check that raw `delegatecall` does not perform, and explain in a comment why
 *   the high-level equivalent would have inserted it for you.
 */
contract Erc1967FallbackTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// Forwards a function taking dynamic arguments and returns a dynamic return value unchanged
    function test_criterion01_forwardsAFunctionTakingDynamicArgumentsAndReturnsA() public {
        fail("Forwards a function taking dynamic arguments and returns a dynamic return value unchanged");
    }

    /// Bubbles a custom-error revert from the implementation with its selector and arguments intact
    function test_criterion02_bubblesACustomErrorRevertFromTheImplementationWith() public {
        fail("Bubbles a custom-error revert from the implementation with its selector and arguments intact");
    }

    /// A test proves the proxy reverts rather than silently succeeding when the implementation slot
    /// points at an address with no code
    function test_criterion03_aTestProvesTheProxyRevertsRatherThanSilently() public {
        fail("A test proves the proxy reverts rather than silently succeeding when the implementation slot points at an address with no code");
    }

    /// A comment justifies the memory-safe decision against the documented permitted regions
    function test_criterion04_aCommentJustifiesTheMemorySafeDecisionAgainstThe() public {
        fail("A comment justifies the memory-safe decision against the documented permitted regions");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
