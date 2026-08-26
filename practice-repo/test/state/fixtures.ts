/**
 * Captured `eth_getProof` fixtures.
 *
 * Practice: fundamentals-state-verify-a-real-getproof
 *
 * The practice is a live-network exercise, but iterating against mainnet on every run is
 * slow and makes failures non-reproducible. Capture each proof ONCE and commit it here.
 *
 * How to capture (three runs, matching the three the acceptance criteria ask for):
 *
 *   cast rpc eth_getProof <address> '["<written-slot>"]'   <block>
 *   cast rpc eth_getProof <address> '["<unwritten-slot>"]' <block>
 *   cast block <block> --json          # take .stateRoot from here, separately
 *
 * Fetching the stateRoot from the block header rather than from the proof response is the
 * whole point: the proof must be checked against a root you got from somewhere else.
 *
 * Fill these in and the guarded tests in proof-walk.test.ts start running.
 */

export interface ProofFixture {
  /** 20-byte address for an account proof, 32-byte slot for a storage proof. */
  key: Uint8Array;
  /** The `accountProof` / `storageProof[i].proof` array, hex-decoded. */
  nodes: Uint8Array[];
  /** `stateRoot` from the block header, or `storageRoot` from the account leaf. */
  root: Uint8Array;
  /** Block number the proof was taken at. Proofs are only valid at one block. */
  blockNumber: number;
}

/** Account proof for a mainnet account. Return null until you have captured one. */
export function accountProofFixture(): ProofFixture | null {
  return null; // TODO: capture with `cast rpc eth_getProof`
}

/** Storage proof for a slot the contract HAS written. */
export function writtenSlotFixture(): ProofFixture | null {
  return null; // TODO: capture with `cast rpc eth_getProof`
}

/** Storage proof for a slot the contract has NEVER written — the exclusion case. */
export function unwrittenSlotFixture(): ProofFixture | null {
  return null; // TODO: capture with `cast rpc eth_getProof`
}
