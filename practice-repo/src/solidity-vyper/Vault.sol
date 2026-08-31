// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-exit-vault-that-survives  (implement, difficulty 5)
 * Exercised by: test/exit/Vault.t.sol
 * Run:      forge test --match-path test/exit/Vault.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
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
 *
 * The 4 concepts this has to end up demonstrating:
 *   - What reading Vyper teaches a Solidity engineer — How much control flow inheritance and
 *     modifiers hide, that unbounded loops are a liveness bug, and that the compiler can be
 *     wrong.
 *   - The compiler is in your trusted computing base — The compiler version is a
 *     security-relevant deployment parameter: pin it, record it, check advisories against it.
 *   - Checks on by default, unsafe named at the call site — Overflow, bounds and division
 *     checks are always on; the escape hatches are named unsafe_add and friends.
 *   - Only major releases carry the audit promise — Vyper's stated policy audits x.0.0
 *     releases; point releases carry no such guarantee.
 */
contract Vault {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
