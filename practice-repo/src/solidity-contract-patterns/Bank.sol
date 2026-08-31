// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-contract-patterns-capstone-where-the-money-goes  (break, difficulty 4)
 * Exercised by: test/capstone/Bank.t.sol
 * Run:      forge test --junit --match-path test/capstone/Bank.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build a deliberately naive bank that pays out to a list of recipients, then attack it four
 *   times, then rebuild it. Each attack corresponds to one pattern in this module, and the order
 *   is the argument: the one that takes the most money is not the one curricula put first.
 *   ATTACK ONE — REENTRANCY. Drain it. Then fix with CEI and show the drain fails. Then
 *   demonstrate what CEI does not cover, with a second attack that survives correct ordering.
 *   Add a guard, and compare the storage guard against the transient one with measured gas.
 *   ATTACK TWO — PUSH PAYMENT DOS. Add one recipient that reverts on receive and brick the whole
 *   distribution. Convert to pull payments and show the same recipient now harms only itself.
 *   State what the conversion cost in gas and in interface complexity. ATTACK THREE — ACCESS
 *   CONTROL. This is the one that actually takes the money, and the exercise is to treat it that
 *   way. Find or plant a privileged-function mistake and take the bank with it. Then implement
 *   three authorization models over the same contract — Ownable2Step, roles, and a manager — and
 *   for each state the blast radius of every key: what its holder can take, and what they can
 *   destroy that cannot be recovered. ATTACK FOUR — THE PAUSE. Add pausability. Then argue
 *   against it: state exactly who can now freeze the contract, and construct the scenario where
 *   the pause is the attack rather than the defence. THE FACTORY. Deploy the fixed bank a
 *   thousand times with clones. Show a clone has no constructor and demonstrate what goes wrong
 *   if you assume it does. Compare CREATE and CREATE2 for this, and say which you chose and why.
 *   Then state, in one sentence, what a clone cannot do that a full deployment can.
 *
 * The 17 concepts this has to end up demonstrating:
 *   - Checks-Effects-Interactions — Validate, then write all state, then call outside
 *     contracts last, so re-entry sees final state.
 *   - What CEI does not cover — CEI protects one function; cross-function, cross-contract and
 *     read-only reentrancy survive it.
 *   - Reentrancy guard — A mutex flag that blocks re-entry into any guarded function of the
 *     same contract.
 *   - Transient reentrancy guard — Holding the mutex in EIP-1153 transient storage makes the
 *     guard roughly an order of magnitude cheaper.
 *   - Pull payments — Record a credit and let the recipient call withdraw(), instead of
 *     pushing value out mid-logic.
 *   - Push payments are a liveness bug — One recipient that reverts or burns gas can brick a
 *     whole distribution loop for everyone.
 *   - Ownable — A single-address privilege bit; OZ 5.x requires the initial owner as a
 *     constructor argument.
 *   - Ownable2Step — Transfer is split into a pending transferOwnership and an acceptOwnership
 *     by the new owner.
 *   - AccessControl — Per-contract bytes32 roles, each with an admin role; DEFAULT_ADMIN_ROLE
 *     administers itself.
 *   - AccessManager — One contract holding permissions per (target, function selector) for a
 *     whole protocol, with per-role delays.
 *   - Access control is where the money goes — Access-control failure costs far more than
 *     reentrancy in every published count — though counts disagree on whether it is the single
 *     largest loss category, because they disagree on what to count.
 *   - Pausable — Pausable supplies whenNotPaused and whenPaused modifiers and ships with no
 *     access control at all.
 *   - A pause switch is a trust assumption — Pausing is a live centralisation vector users
 *     must be told about, not a neutral safety feature.
 *   - CREATE versus CREATE2 — CREATE derives the address from deployer and nonce; CREATE2 from
 *     deployer, salt and initcode hash.
 *   - EIP-1167 minimal proxy — A fixed 45-byte runtime that delegatecalls every call to one
 *     hard-coded implementation address.
 *   - A clone runs no constructor — State must be set by an initialize() callable exactly
 *     once, and the implementation must disable its own.
 *   - A clone is not upgradeable — The implementation address is immutable bytecode inside the
 *     clone: cheap, and frozen.
 */
contract Bank {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
