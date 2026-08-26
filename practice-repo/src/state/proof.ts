/**
 * Verifying an `eth_getProof` response by hand.
 *
 * Practice: fundamentals-state-verify-a-real-getproof
 *
 * THREE THINGS THIS EXERCISE IS ACTUALLY ABOUT
 *
 * 1. A PROOF IS A LIST OF NODES, not a list of sibling hashes. Unlike a plain Merkle
 *    proof, you are handed the actual nodes along the path and you re-derive the root
 *    from them. If the list is a valid chain and the top node hashes to the state root,
 *    the leaf is in the trie. Nothing else needs to be trusted.
 *
 * 2. THE PATH IS NOT THE KEY. Ethereum's state trie is a SECURE trie: the path is
 *    `keccak256(key)`, not the key. For an account proof the key is the 20-byte address;
 *    for a storage proof it is the 32-byte slot. Hash first, then take nibbles. Skipping
 *    this is the single most common way to spend an hour on a proof that "should work".
 *
 * 3. THE CHILD REFERENCE RULE. A parent references a child by `keccak256(rlp(child))` —
 *    but ONLY when that RLP is 32 bytes or longer. When it is shorter, the child's RLP is
 *    INLINED directly in the parent. Hash an inlined child and your root comes out right
 *    for most accounts and wrong for a few, which is the most annoying possible failure
 *    mode. See the third hint in the practice.
 *
 * No solutions here.
 */

/**
 * Keccak-256. Deliberately left to you.
 *
 * The practice forbids a trie library, not a hash function — you are not expected to
 * implement the sponge. Wire this to whatever you have (`ethereum-cryptography/keccak`,
 * `viem`'s `keccak256`, a native binding) and keep it behind this one function so the
 * rest of the module stays dependency-free.
 */
export function keccak256(_bytes: Uint8Array): Uint8Array {
  throw new Error('TODO: wire to a keccak-256 implementation of your choosing');
}

/**
 * Resolve how a parent refers to a child, given the child's RLP encoding.
 *
 * `inlined === true` means the reference IS the child's RLP, verbatim.
 * `inlined === false` means the reference is `keccak256(childRlp)`.
 *
 * The threshold is 32 bytes, and it is on the RLP length, not the node's item count.
 */
export function childReference(_childRlp: Uint8Array): { reference: Uint8Array; inlined: boolean } {
  throw new Error('TODO: < 32 bytes is inlined, >= 32 bytes is hashed');
}

/** One step of the walk, recorded so you can print your work. */
export interface ProofWalkStep {
  /** 0 for the root node. */
  depth: number;
  nodeType: 'branch' | 'extension' | 'leaf';
  /** Why that type — from `classifyNode`. */
  evidence: string;
  /** How many nibbles of the path had been consumed on entering this node. */
  nibbleOffset: number;
  /** For a branch: the nibble that selected the next child. Null for extension and leaf. */
  chosenNibble: number | null;
  /** The reference this node holds for the next node down, or null at a terminal node. */
  childReferenceHex: string | null;
  /** True when the next node was inlined rather than referenced by hash. */
  childWasInlined: boolean;
}

export type ProofOutcome =
  /** The path reached a leaf whose remaining path matched: the value is present. */
  | 'inclusion'
  /**
   * The path terminated before the key was consumed: an empty branch slot, or a leaf or
   * extension whose stored path diverges from ours. That termination IS the proof of
   * absence — the trie is deterministic, so if the key were present the node at this
   * position would have to look different, and the chain of hashes up to a state root we
   * already trust says it does not.
   */
  | 'exclusion';

export interface ProofResult {
  outcome: ProofOutcome;
  /** Root recomputed bottom-up from the supplied nodes. Compare this to the header. */
  recomputedRoot: Uint8Array;
  /** The full nibble path actually walked, i.e. nibbles of keccak256(key). */
  pathNibbles: number[];
  steps: ProofWalkStep[];
  /** Decoded leaf payload on inclusion, null on exclusion. */
  value: Uint8Array | null;
  /** On exclusion, why the walk stopped, in words. Empty string on inclusion. */
  exclusionReason: string;
}

export interface VerifyProofOptions {
  /** 20-byte address for an account proof, 32-byte slot for a storage proof. */
  key: Uint8Array;
  /** The `accountProof` or `storageProof[i].proof` array, already hex-decoded. */
  proofNodes: Uint8Array[];
  /** `stateRoot` from the block header, or `storageRoot` from the account leaf. */
  expectedRoot: Uint8Array;
}

/**
 * Walk the proof and rebuild the root.
 *
 * Requirements the acceptance criteria put on this function:
 *  - it must ASSERT the recomputed root equals `expectedRoot` and fail loudly otherwise;
 *  - it must record every node's type and the evidence for it;
 *  - it must record the chosen nibble at each branch;
 *  - it must return `'exclusion'` (not an error, and not a zero value) when the key is
 *    absent, with a reason naming where the path terminated.
 *
 * Note the asymmetry that makes exclusion proofs subtle: an absent storage slot and a
 * slot explicitly written to zero produce DIFFERENT proofs but the same `eth_getStorageAt`
 * answer. Your annotation should be able to tell them apart.
 */
export function verifyProof(_options: VerifyProofOptions): ProofResult {
  throw new Error('TODO: hash the key, walk the nibbles, recompute bottom-up, then assert');
}
