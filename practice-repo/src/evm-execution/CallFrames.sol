// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-execution-a-call-is-a-new-machine  (implement, difficulty 3)
 * Exercised by: test/CallFrames.t.sol
 * Run:      forge test --junit --match-path test/CallFrames.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Three properties of the execution model, each demonstrated by hitting its edge. MEMORY IS
 *   PER FRAME. Write a contract that writes to memory, calls another contract, and reads its
 *   memory back. Show it unchanged. Then have the callee write to the same offsets and show the
 *   caller still unaffected. State in one sentence what is shared between frames and what is
 *   not. THE DEPTH LIMIT. Recurse until you hit it. Report the exact depth at which the call
 *   fails, and — the part that matters — show how the failure presents to the caller. It is not
 *   a revert, and code that treats it as one is wrong. Then construct a case where hitting the
 *   limit makes a contract behave incorrectly rather than merely fail. GAS IS A COUNTDOWN. Show
 *   that gas forwarded to a call is a ceiling and not a promise: forward a specific amount and
 *   show the callee receiving less. Report both numbers and name the rule. THE NEUTERED OPCODE.
 *   Deploy a contract that calls `selfdestruct` and show what now happens: what is destroyed,
 *   what is not, and under what single circumstance the old behaviour still occurs. Then state
 *   what breaks in a contract written against the old semantics.
 *
 * The 7 concepts this has to end up demonstrating:
 *   - The execution loop — Fetch the opcode at the program counter, check the stack, charge
 *     gas, mutate state, advance — until a halting instruction or an exception.
 *   - Gas is charged before the operation — Gas is deducted before each instruction executes,
 *     and hitting zero is not an error the code can catch — it is an immediate exceptional
 *     halt.
 *   - Deterministic and single-threaded — One transaction executes alone, in order, with no
 *     concurrency, clock, I/O or randomness — because every node must reach byte-identical
 *     results.
 *   - Call frame — Every call-family instruction opens a new machine with its own stack,
 *     memory, program counter and gas allowance.
 *   - Memory belongs to the frame — A frame's memory starts zeroed, is invisible to every
 *     other frame, and disappears when the frame ends.
 *   - The 1024-frame depth limit — Call depth is hard-capped at 1024, and exceeding it makes
 *     the call return failure rather than throwing.
 *   - SELFDESTRUCT no longer deletes — Since EIP-6780 it erases code and storage only if the
 *     contract was created in the same transaction; otherwise it merely sweeps the balance.
 */
contract CallFrames {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
