# Concept ID reconciliation

Concept IDs defined in more than one research file. Each must collapse to **one** graph node before P1.
Duplicate coverage is a bonus (two independent takes), not waste — merge the better statement and keep both source sets.

- Unique concept ids: **1489**
- Defined in >1 file: **26**
- Total definitions: **1515**


## Two categories — handle differently

**1. True duplicates (most of the 26).** Two agents described the same idea. Merge: keep the more precise
statement, union the source lists, keep both misconception sets. Example: `formal-verification` — the two
statements are the same claim in different words.

**2. ID collisions (rarer, and the dangerous kind).** The same id was used for *different* concepts.
These must be **renamed apart**, not merged, or the graph will silently conflate two ideas.

Confirmed collision:

- **`gas-limit-vs-gas-used`** — one definition is the *block* gas limit ("validator-adjustable ceiling,
  ±1/1024 per block"), the other is the *transaction* gas limit ("the ceiling you authorise; unused gas
  is refunded"). Two genuinely different concepts sharing one id. Split into `block-gas-limit` and
  `tx-gas-limit-vs-used`.

Check every row below against this distinction before merging. **A merge that flattens a collision is
worse than leaving the duplicate** — the graph would teach two ideas as one and no linter would catch it.

| Concept id | Files | Statements to merge |
|---|---|---|
| `casper-ffg` | a12-protocol, t01-fundamentals | — Casper FFG justifies and finalizes epoch-boundary checkpoints with 2/3 supermajority links; finality is what makes reorg <br>— The finality gadget: validators vote on checkpoints, and two-thirds agreement justifies then finalises them. |
| `cell-kzg-proof` | a11-zk, a12-protocol | — A cell proof attests that a given cell is the correct opening of the blob's KZG commitment at that cell's positions, so  <br>— Each cell carries its own KZG proof against the blob's commitment, so a sampled cell can be verified in isolation withou |
| `copycat-window` | a07-security, a14-infra | — Once a transaction is public, unsophisticated actors replay it with the address swapped; Nomad turned into a public free <br>— Once an exploit is public, copycats replay it against forks and sibling deployments within minutes, so notifying similar |
| `create2-address-derivation` | a01-fundamentals-ledgers, a06-foundry-shipping | — `CREATE2` derives the address from `0xff ++ sender ++ salt ++ keccak256(initcode)`, deliberately removing the nonce so t <br>— `CREATE2` gives `keccak256(0xff ‖ deployer ‖ salt ‖ keccak256(initcode))[12:]` — no nonce, so the same deployer + salt + |
| `das-security-argument` | a11-zk, a12-protocol | — Data availability sampling gives probabilistic assurance: an adversary withholding more than the reconstruction threshol <br>— If more than 50% of columns are withheld the data is unrecoverable, but a node sampling k random columns detects that wi |
| `data-availability-sampling` | a10-scaling, t02-03-ledgers-evm | — Light nodes randomly sample small pieces of an erasure-coded block; enough successful samples make withholding statistic <br>— Verifying data was published by checking a few random points, relying on the polynomial commitment for a probabilistic g |
| `donation-attack` | a07-security, t04-05-solidity-toolchain | — Pushing assets into a contract without going through its accounting entry point, breaking a ratio or a health check. <br>— Sending assets directly to the vault, bypassing `deposit`, inflates `totalAssets` without minting shares and so manipula |
| `engine-api-jwt` | a12-protocol, a14-infra | — The Engine API is authenticated with a shared HS256 JWT secret written to a `jwt.hex` file that both clients read; a mis <br>— EL and CL talk over the Engine API on port 8551 authenticated by a shared 32-byte hex JWT secret file; a mismatched or m |
| `forced-inclusion` | a10-scaling, t08-09-defi-scaling | — Submitting your L2 transaction to an L1 contract so that, after a delay, the L2 protocol is obliged to include it whethe <br>— An L1 path to get your transaction into the L2 even if the sequencer censors you. The property that makes a rollup escap |
| `formal-verification` | a07-security, t06-security | — Proving a property holds for *all* inputs in a modelled state space, rather than sampling it. <br>— Mathematically proving a property holds for **all** inputs, not merely those sampled. |
| `gas-limit-vs-gas-used` | a01-fundamentals-ledgers, t02-03-ledgers-evm | — `gasLimit` is a validator-adjustable ceiling (±1/1024 per block) and `gasUsed` is the realised total; `baseFeePerGas` is <br>— The limit is the ceiling you authorise; used is what executed. Unused gas is refunded, the limit is not a price. |
| `ghost-variable` | a07-security, t04-05-solidity-toolchain | — Test-only accumulator tracking something the contract does not store (total deposited, total withdrawn), so conservation <br>— A running tally kept by the handler of what the contract *should* hold, letting the invariant compare against an indepen |
| `hash-commitment` | a11-zk, t01-fundamentals | — A plain hash is a commitment to a whole blob, but proving anything about *part* of the data requires revealing it or a M <br>— `keccak256(value ‖ salt)`; the salt supplies hiding, collision-resistance supplies binding. |
| `lmd-ghost` | a12-protocol, t01-fundamentals | — Latest Message Driven Greediest Heaviest Observed SubTree: walk down from the justified root, at each node follow the ch <br>— The fork-choice rule selecting the head between finalised checkpoints, weighted by validators' latest messages. |
| `merkle-patricia-trie` | a02-evm-machine, a12-protocol | — The state is stored in a hexary (16-way) Merkle Patricia Trie: a radix trie whose every node is identified by the keccak <br>— Today's state commitment is a hexary (16-way) Merkle-Patricia Trie; its arity is why proofs are fat — each level of the  |
| `mpt-branch-node` | a01-fundamentals-ledgers, t01-fundamentals | — A branch is `[v0, v1, ... v15, value]`: sixteen child slots indexed by the next nibble plus a 17th slot holding the valu <br>— A 17-item node: sixteen nibble slots plus a seventeenth for a key terminating exactly here. |
| `mpt-extension-node` | a01-fundamentals-ledgers, t01-fundamentals | — An extension is `[compactEncode(sharedNibbles, false), childRef]` and exists only to compress a run of nibbles that ever <br>— Compresses a shared path prefix into one node holding the path and the child hash, so no branch has a single non-zero en |
| `mpt-leaf-node` | a01-fundamentals-ledgers, t01-fundamentals | — A leaf is `[compactEncode(remainingNibbles, true), value]`; the terminator flag in the first nibble is the ONLY thing di <br>— Terminates a path and holds the value. |
| `sequencer` | a10-scaling, t08-09-defi-scaling | — The party that receives L2 transactions, chooses their order, and publishes the resulting ordering; on every major L2 in <br>— The party ordering L2 transactions; almost always a single centralised operator today. |
| `slot-and-epoch` | a12-protocol, t02-03-ledgers-evm | — Time is divided into 12-second slots and 32-slot (6.4-minute) epochs; one validator is chosen to propose per slot and th <br>— Time is slots of **12 seconds**, grouped into epochs of **32 slots**. |
| `solvency-invariant` | a07-security, t04-05-solidity-toolchain | — Total claimable never exceeds total held; the single highest-value property for any pool, vault or lending market. <br>— `assets >= liabilities`. The best first invariant, because it maps directly onto what an attacker wants to break. |
| `ssz` | a12-protocol, t01-fundamentals | — Simple Serialize is the consensus layer's canonical encoding and Merkleization scheme; every consensus object has a dete <br>— The consensus layer's serialization: richer typed schema, not self-describing, little-endian integers, and it defines Me |
| `stateful-fuzzing` | a07-security, t04-05-solidity-toolchain | — Random *sequences* of calls against accumulated state; the only kind that finds ordering and accounting bugs. <br>— State persists across calls within a run, so the fuzzer builds interaction sequences rather than testing one call in iso |
| `stateless-fuzzing` | a05-foundry-testing, a07-security | — Stateless (`testFuzz*`) fuzzing calls ONE function with randomised arguments from a fresh post-setUp state each run; it  <br>— Random inputs to one function in a fresh state; catches argument-domain bugs only. |
| `symbolic-execution` | a07-security, t06-security | — Running code with symbolic rather than concrete values, accumulating path constraints, and asking an SMT solver whether  <br>— Exploring paths with symbolic rather than concrete inputs to reason about whole input classes. |
| `versioned-hash` | a11-zk, t02-03-ledgers-evm | — The EVM never sees a blob or its 48-byte commitment directly; it sees a 32-byte versioned hash `0x01 <br>— What the transaction actually carries: a versioned hash of the blob's KZG commitment. |

---

## Resolved during P1 authoring — 2026-08-25

**`gas-limit-vs-gas-used` — the collision, split as predicted.** The authoring agents correctly emitted two
concepts: `block-gas-limit` (in `ledgers-blocks`, the validator-adjustable ±1/1024 ceiling) and
`tx-gas-limit-vs-used` (in `evm-gas-fee-market`, the per-transaction ceiling you authorise). Five
references in other tracks still pointed at the retired id; all five were transaction-level in context
and were repointed to `tx-gas-limit-vs-used`.

**The retired id must never be reused.** It is ambiguous by construction — that is what made it a
collision rather than a duplicate.

**`create2-address-derivation` → `create2-address`.** A synonym mismatch: eight references across five
tracks used a longer form than the id actually defined in `evm-execution`. Repointed. This is the exact
failure the shared `CONCEPT-IDS.txt` inventory exists to prevent, and it still happened eight times —
worth a linter rule that rejects near-miss ids rather than only unknown ones.
