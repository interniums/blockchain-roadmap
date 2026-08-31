// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, console2} from "forge-std/Test.sol";

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-exit-vault-that-survives  (implement, grain exit, difficulty 5)
 * Run:      forge test --match-path test/exit/Vault.t.sol
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Build a share-accounting vault, behind a proxy, that takes deposits in an arbitrary ERC-20
 *   and survives every failure in this track. This is the track's whole content as one contract,
 *   and the test suite is the argument. What it has to withstand. FIRST-DEPOSITOR INFLATION. A
 *   first depositor must not be able to make the share price a number that rounds every later
 *   depositor to zero. State your defence — virtual shares, a dead-share mint, a minimum deposit
 *   — and prove it with a test that would pass on a naive implementation and fails on yours only
 *   because the defence is there. ROUNDING. Every conversion rounds in the vault's favour. A
 *   test asserts that no sequence of deposits, withdrawals and donations leaves the vault owing
 *   more than it holds. WEIRD TOKENS. It must stay solvent against a token that returns no data
 *   on success, one that taxes transfers, and one that rebases downward overnight. Not "reverts
 *   safely" — solvent, with share accounting that still means something afterwards. UPGRADE.
 *   Ship v2 behind the same proxy, adding at least one state variable, without corrupting state.
 *   Include a slot map before and after. Then include a THIRD version, v2-bad, which bricks the
 *   contract, and a test that demonstrates the bricking — with a comment naming the slot
 *   collision from the map that caused it. ACCESS. Choose between Ownable, AccessControl and
 *   AccessManager, and for every privileged key, state its blast radius: exactly what the holder
 *   can take or destroy. CONTEXT. A test asserts, for one CALL, one DELEGATECALL and one
 *   STATICCALL path through your code, what `address(this)`, `msg.sender` and `msg.value` are
 *   and whose storage is written — predicted in a comment before the assertion, not derived from
 *   the failure. SURFACE. Events and custom errors an indexer and a frontend can still decode
 *   after v2. At least one event must have an indexed dynamic argument, and a comment stating
 *   what is unrecoverable because of that.
 */
contract VaultTest is Test {
    function setUp() public {
        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.
    }

    /// An inflation-attack test passes against a naive vault and fails against yours, with the
    /// defence named in a comment
    function test_criterion01_anInflationAttackTestPassesAgainstANaiveVault() public {
        fail("An inflation-attack test passes against a naive vault and fails against yours, with the defence named in a comment");
    }

    /// An invariant campaign over deposits, withdrawals and donations never leaves the vault owing
    /// more than it holds
    function test_criterion02_anInvariantCampaignOverDepositsWithdrawalsAndDonationsNever() public {
        fail("An invariant campaign over deposits, withdrawals and donations never leaves the vault owing more than it holds");
    }

    /// The vault stays solvent and its share accounting stays meaningful against a no-return-data
    /// token, a fee-on-transfer token and a downward-rebasing token
    function test_criterion03_theVaultStaysSolventAndItsShareAccountingStays() public {
        fail("The vault stays solvent and its share accounting stays meaningful against a no-return-data token, a fee-on-transfer token and a downward-rebasing token");
    }

    /// v2 adds a state variable behind the same proxy with state intact, and slot maps before and
    /// after are included
    function test_criterion04_v2AddsAStateVariableBehindTheSameProxy() public {
        fail("v2 adds a state variable behind the same proxy with state intact, and slot maps before and after are included");
    }

    /// A v2-bad upgrade demonstrably bricks the contract, and a comment names the colliding slot
    /// from the map
    function test_criterion05_aV2BadUpgradeDemonstrablyBricksTheContractAnd() public {
        fail("A v2-bad upgrade demonstrably bricks the contract, and a comment names the colliding slot from the map");
    }

    /// Every privileged key is listed with the concrete assets or capabilities its holder can take
    function test_criterion06_everyPrivilegedKeyIsListedWithTheConcreteAssets() public {
        fail("Every privileged key is listed with the concrete assets or capabilities its holder can take");
    }

    /// CALL, DELEGATECALL and STATICCALL paths each have their context predicted in a comment
    /// before the assertion that checks it
    function test_criterion07_callDelegatecallAndStaticcallPathsEachHaveTheirContext() public {
        fail("CALL, DELEGATECALL and STATICCALL paths each have their context predicted in a comment before the assertion that checks it");
    }

    /// An indexed dynamic event argument is present with a comment stating what it makes
    /// unrecoverable
    function test_criterion08_anIndexedDynamicEventArgumentIsPresentWithA() public {
        fail("An indexed dynamic event argument is present with a comment stating what it makes unrecoverable");
    }

    /// Custom errors and events from v1 still decode against the v2 ABI, proven by a test rather
    /// than by inspection
    function test_criterion09_customErrorsAndEventsFromV1StillDecodeAgainst() public {
        fail("Custom errors and events from v1 still decode against the v2 ABI, proven by a test rather than by inspection");
    }

    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.
    function _note(string memory what) internal pure {
        console2.log(what);
    }
}
