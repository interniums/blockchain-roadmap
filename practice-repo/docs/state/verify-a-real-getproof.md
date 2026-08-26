# Verify a real account proof by hand against the block's state root

Practice: `fundamentals-state-verify-a-real-getproof`
Acceptance: `node scripts/verify-getproof.mjs --address <address> --slot <slot> --block <block>`

## What you are building

`scripts/verify-getproof.mjs`, on top of the modules in `src/state/`:

- `rlp.ts` — decode the nodes. No library.
- `node.ts` — classify each node as branch, extension or leaf.
- `nibbles.ts` / `compact.ts` — the path arithmetic.
- `proof.ts` — the walk, the child-reference rule, the root recomputation.

The tests in `test/state/node-types.test.ts` and `test/state/proof-walk.test.ts`
specify all of it. Build against them before you point anything at mainnet.

## Getting the data

```
cast rpc eth_getProof <address> '["<slot>"]' <blockNumber>
cast block <blockNumber> --json          # take .stateRoot from here
```

Fetch the `stateRoot` **separately, from the block header**. That is the whole
exercise. A proof checked against a root that came from the same response as
the proof has proved nothing at all.

Capture your proofs into `test/state/fixtures.ts` once. Proofs are only valid at
one block, and a fixture turns a live-network exercise into something you can
iterate on in a second.

## Three runs are required

1. An account proof, verified against the header's `stateRoot`.
2. A storage proof for a slot the contract **has** written, verified against
   that account's `storageRoot`.
3. A storage proof for a slot the contract has **never** written — the
   exclusion case.

## The three things that will actually cost you time

### The path is not the key

Ethereum's state trie is a *secure* trie. The path is `keccak256(key)`, not the
key. For an account proof the key is the 20-byte address; for a storage proof
it is the 32-byte slot. Hash first, then take nibbles. Every account proof is
therefore exactly 64 nibbles deep at most.

### A proof is a list of nodes, not a list of sibling hashes

Unlike a plain Merkle proof, you are handed the actual nodes along the path and
you re-derive the root from them. Walk down to find the value; hash back up to
check the root. Both directions matter.

### The child-reference rule

A parent references a child by `keccak256(rlp(child))` — but only when that RLP
is 32 bytes or longer. Shorter children are **inlined** verbatim in the parent.

If your recomputed root is correct for some accounts and wrong for others, this
is your bug. It is the third hint in the practice for a reason: the failure is
data-dependent, so it survives every test you write against the one account you
happened to pick first.

## Annotating the walk

The acceptance criteria ask for annotation, not just a pass/fail. For every node
print:

- its type, and the **deciding evidence** — 17 items means branch; for a 2-item
  node, the flag nibble of item 0 is 0 or 1 for extension, 2 or 3 for leaf;
- the nibble path of `keccak256(address)` alongside the slot chosen at each
  branch node;
- whether the child was inlined or referenced by hash.

`verifyProof` returns a `steps` array shaped for exactly this.

## The exclusion proof

This is the part worth thinking about slowly.

The walk terminates before the key is consumed — an empty branch slot, or a
leaf or extension whose stored path diverges from yours. That termination *is*
the proof of absence. The trie is deterministic: if the key were present, the
node at that position would have to look different, and the chain of hashes up
to a state root you already trust says it does not.

Now the subtlety. `eth_getStorageAt` returns the same zero for a slot that was
never written and a slot explicitly set to zero. The proofs are not the same
shape — clients delete zero-valued slots from the trie, so "written to zero"
may well end up as absence too. Work out what is actually true for the contract
you picked, and say so in the annotation. Getting this right is the difference
between "the proof shows zero" and "the proof shows nothing is there".

## What a good answer addresses

- Why a light client can trust a value from an untrusted server given only a
  block header.
- What an exclusion proof buys you that a returned zero does not.
- What changes about all of this under a binary trie with a different hash.
