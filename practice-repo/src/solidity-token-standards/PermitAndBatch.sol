// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

/*
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: solidity-token-standards-sign-it-instead-and-batch-it  (implement, difficulty 3)
 * Exercised by: test/PermitAndBatch.t.sol
 * Run:      forge test --junit --match-path test/PermitAndBatch.t.sol
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Two ways to reduce the transaction count, and the failure each one introduces. PERMIT.
 *   Implement a flow that takes a signed allowance instead of an approval transaction. Show the
 *   signature verifying and the allowance appearing without the owner having sent anything. Then
 *   break it twice: replay the same signature and show it rejected, and alter one field of the
 *   signed data and show it rejected. Name the mechanism that stops each. Then find the
 *   practical gap: state what happens when the token does not implement permit, and name the
 *   intermediary approach that covers that case and what it requires the user to trust. BATCHES.
 *   Implement a multi-id transfer moving ten different token ids in one call. Then demonstrate
 *   the property people assume and should check: make one id in the batch fail and show whether
 *   the others applied. State the rule, and say what a caller must do if the answer is not what
 *   they wanted. THE HOOK. Give a receiver a callback and use it to reject a specific id
 *   mid-batch. Then use the same callback to re-enter the sender. Show what the sender's state
 *   looks like at that moment, and state what ordering would have made the re-entry harmless.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - EIP-2612 permit — The holder signs an EIP-712 allowance off-chain and the spender
 *     submits it, collapsing two transactions into one.
 *   - Permit2 — One canonical contract adding signature-based, expiring, per-spender
 *     allowances on top of any ERC-20.
 *   - ERC-1155 semantics — Many token ids in one contract, with balanceOf(account, id)
 *     covering fungible and non-fungible alike.
 *   - Batch transfers are all or nothing — safeBatchTransferFrom reverts entirely if any leg
 *     fails, and emits one TransferBatch, not N TransferSingle.
 *   - ERC-1155 receiver hooks — Two hooks, onERC1155Received and onERC1155BatchReceived, with
 *     the same hand-over-control hazard.
 */
contract PermitAndBatch {
    // Nothing yet. The test deploys this, so the first function you add is callable from it
    // without touching the test's plumbing.
}
