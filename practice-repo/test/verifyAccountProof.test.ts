/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-state-tries-verify-account-proof  (implement, grain module, difficulty 5)
 * Run:      npx vitest run test/verifyAccountProof.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write `verifyAccountProof(stateRoot, address, proof)` in TypeScript with no Merkle library.
 *   Walk the RLP-encoded node list returned by `eth_getProof`: at each step, keccak256 the node,
 *   check the hash equals the reference held by its parent (the state root for the first node),
 *   decode the node, and consume nibbles of keccak256(address) to choose the next child. Return
 *   the decoded `[nonce, balance, storageRoot, codeHash]`. Fetch the proof from one public RPC
 *   provider and the block header's stateRoot from a different one, so the verification is
 *   genuinely cross-checked. Then add negative tests: flip a single byte in any node, and swap
 *   in a leaf belonging to a different account.
 */
import { describe, it, expect } from 'vitest';

describe('Verify a mainnet account against a state root you fetched separately', () => {
  // Verifies a real mainnet account against a stateRoot obtained from a different provider than
  // the proof
  it('01 — Verifies a real mainnet account against a stateRoot obtained from a…', () => {
    expect.fail('Verifies a real mainnet account against a stateRoot obtained from a different provider than the proof');
  });

  // Rejects the proof when any single byte of any node is flipped
  it('02 — Rejects the proof when any single byte of any node is flipped', () => {
    expect.fail('Rejects the proof when any single byte of any node is flipped');
  });

  // Rejects a proof whose final leaf belongs to a different account
  it('03 — Rejects a proof whose final leaf belongs to a different account', () => {
    expect.fail('Rejects a proof whose final leaf belongs to a different account');
  });

  // Handles all three node kinds (leaf, extension, branch) and asserts which kind each proof
  // node was
  it('04 — Handles all three node kinds (leaf, extension, branch) and asserts…', () => {
    expect.fail('Handles all three node kinds (leaf, extension, branch) and asserts which kind each proof node was');
  });
});
