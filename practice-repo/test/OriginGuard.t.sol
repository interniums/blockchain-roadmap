// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";
import {OriginGuard} from "../src/ledgers-accounts/OriginGuard.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-accounts-defeat-the-origin-guard  (break, grain module, difficulty 4)
 * Run:      forge test --match-path test/OriginGuard.t.sol -vvv
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write a contract with the classic anti-contract guard, `require(msg.sender == tx.origin, "no
 *   contracts")`, protecting a function that should only ever be callable by a human — a mint, a
 *   claim, whatever fits. Then defeat it. Have an EOA sign a delegation to an attacker contract
 *   using Foundry's `vm.signAndAttachDelegation`, and call the guarded function from that
 *   account. The guard will pass, because the caller really is the transaction origin, while
 *   arbitrary attacker code executes as that caller. Prove both halves in
 *   `test/OriginGuard.t.sol`: one test showing a plain contract caller is correctly rejected,
 *   and one showing the delegated EOA sails through and runs code. Finish by writing a second
 *   guard that actually expresses the property the first one was reaching for, and a test that
 *   your bypass fails against it.
 */
contract OriginGuardTest is Test {
    /// The subject, from src/ledgers-accounts/OriginGuard.sol. Add functions there and call them here.
    OriginGuard internal subject;

    function setUp() public {
        subject = new OriginGuard();
    }

    /// A test proves a normal contract caller is rejected by the guard
    function test_criterion01_aTestProvesANormalContractCallerIsRejected() public {
        fail("A test proves a normal contract caller is rejected by the guard");
    }

    /// A test proves a delegated EOA passes the same guard while attacker contract code executes
    function test_criterion02_aTestProvesADelegatedEoaPassesTheSame() public {
        fail("A test proves a delegated EOA passes the same guard while attacker contract code executes");
    }

    /// The delegated test asserts that `EXTCODESIZE` on the caller is non-zero at the moment the
    /// guard passes
    function test_criterion03_theDelegatedTestAssertsThatOnTheCallerIs() public {
        fail("The delegated test asserts that `EXTCODESIZE` on the caller is non-zero at the moment the guard passes");
    }

    /// A replacement check is implemented and a test proves the same bypass fails against it
    function test_criterion04_aReplacementCheckIsImplementedAndATestProves() public {
        fail("A replacement check is implemented and a test proves the same bypass fails against it");
    }

    /// A comment states what property the replacement check actually enforces, in one sentence
    function test_criterion05_aCommentStatesWhatPropertyTheReplacementCheckActually() public {
        fail("A comment states what property the replacement check actually enforces, in one sentence");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
