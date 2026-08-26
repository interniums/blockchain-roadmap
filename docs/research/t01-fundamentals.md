# Track 01 — Fundamentals

> Source-verified curriculum research. Compiled 25 Aug 2026.
> Raw material for lesson authoring — NOT lesson prose.
> Audience: experienced product engineer, zero blockchain knowledge. General programming skipped.
> Source tiers: `spec` (normative — EIPs, NIST/IETF/FIPS, yellow paper, execution/consensus-specs) · `canonical-docs` (ethereum.org, project docs/repos) · `primary-analysis` (peer-reviewed / arXiv / core-dev writing) · `secondary` (press, blogs, aggregators — marked, support only).

**Status: IN PROGRESS — modules appended as completed.**

Modules planned, in order:
- F1 Cryptographic primitives
- F2 Data & encoding
- F3 Networks
- F4 Distributed systems
- F5 State & data structures
- F6 Incentives & economics

---

---

## F1 — Cryptographic primitives

> Status: complete.

### Concepts

- `hash-function` — A deterministic map from arbitrary-length input to fixed-length output, cheap forward and infeasible to invert. | requires: [] | contrasts: [encryption]
- `preimage-resistance` — Given `h`, infeasible to find any `m` with `hash(m) = h`. | requires: [hash-function]
- `second-preimage-resistance` — Given `m1`, infeasible to find `m2 ≠ m1` with the same digest. | requires: [preimage-resistance]
- `collision-resistance` — Infeasible to find ANY pair colliding; strictly stronger than second-preimage, and the property birthday attacks target. | requires: [second-preimage-resistance]
- `keccak-vs-sha3` — Ethereum's `keccak256` is the pre-standardisation Keccak (padding byte `0x01`), NOT NIST SHA3-256 (padding `0x06`); identical input yields different digests. | requires: [hash-function] | contrasts: [sha256]
- `keypair` — A private scalar and the public curve point derived from it; derivation is one-way. | requires: [hash-function]
- `ecdsa-secp256k1` — Ethereum's signature scheme; a signature is the triple `(r, s, v)` where `v` enables public-key recovery. | requires: [keypair]
- `ecrecover` — The EVM precompile that recovers a signer address from a hash and `(r,s,v)`; returns `address(0)` on failure rather than reverting. | requires: [ecdsa-secp256k1]
- `signature-malleability` — For any valid `(r, s)`, `(r, n - s)` is also valid over the same message, so a signature's bytes are not a unique identifier for it. | requires: [ecdsa-secp256k1]
- `low-s-normalisation` — EIP-2 constrains transaction signatures to the low half of the curve order; `ecrecover` does NOT enforce this, so contracts must. | requires: [signature-malleability]
- `secp256r1-p256` — The NIST curve used by Apple Secure Enclave, Android Keystore and FIDO2/WebAuthn; different curve from secp256k1. | requires: [keypair] | contrasts: [ecdsa-secp256k1]
- `p256verify-precompile` — EIP-7951's precompile at address `0x100`, 6900 gas, verifying secp256r1 signatures natively so passkeys are cheap on-chain. | requires: [secp256r1-p256]
- `eip-712-typed-data` — A scheme for hashing structured data so wallets can display a readable payload, binding the signature to a chain, contract and version via a domain separator. | requires: [ecdsa-secp256k1, hash-function]
- `domain-separator` — The EIP-712 field that scopes a signature to one chain/contract/version, making cross-domain replay fail by construction. | requires: [eip-712-typed-data]

### Primary sources

- [EIP-7951: Precompile for secp256r1 Curve Support](https://eips.ethereum.org/EIPS/eip-7951) — tier: spec — published: 2025 — normative text: address `0x100`, 6900 gas, 160-byte input (hash ‖ r ‖ s ‖ pubkey x ‖ y), returns 32-byte `0x…01` on success and empty data on failure.
- [EIP-712: Typed structured data hashing and signing](https://eips.ethereum.org/EIPS/eip-712) — tier: spec — the domain-separator construction and encoding rules.
- [EIP-7951 discussion thread](https://ethereum-magicians.org/t/eip-7951-precompile-for-secp256r1-curve-support/24360) — tier: primary-analysis — core-dev debate; records that EIP-7951 fixes security issues found in RIP-7212 while keeping interface compatibility with existing L2 implementations.
- [EIP-2 signature malleability: why low-s instead of dropping v?](https://ethereum-magicians.org/t/eip-2-signature-malleability-why-low-s-instead-of-dropping-v/25387) — tier: primary-analysis — the design rationale, useful as a worked example of protocol trade-offs.
- [Understanding Ethereum signature standards: EIP-191 and EIP-712](https://www.cyfrin.io/blog/understanding-ethereum-signature-standards-eip-191-eip-712) — tier: secondary — clear treatment of the prefix schemes; verify claims against the EIPs.
- [One Signature, Multiple Payments: detecting signature replay vulnerabilities](https://arxiv.org/pdf/2511.09134) — tier: primary-analysis — published: 2025-11 — empirical study of replay bugs; source of real spot-the-bug material.
- [SHA-3 vs Keccak-256: what's the difference](https://byteatatime.dev/posts/sha3-vs-keccak256/) — tier: secondary — the padding difference; confirm against FIPS 202 before publishing.

### Current state (Aug 2026)

- **EIP-7951 is live on mainnet** as part of Fusaka (Dec 2025). Passkey-signed transactions are now economically viable on L1, not just on L2s that shipped RIP-7212. This is new since late 2025 and absent from every pre-2026 curriculum.
- `ecrecover` semantics are unchanged and still return `address(0)` on failure — the oldest footgun in Solidity is still armed.
- Ethereum remains permanently forked from FIPS 202; `keccak256` will never be SHA3-256.

### Misconceptions

- Belief: `keccak256` is SHA-3. | Reality: different padding byte, different digests. | Why: Ethereum's choice predates NIST's 2015 finalisation and was never migrated. | Source: https://byteatatime.dev/posts/sha3-vs-keccak256/
- Belief: A signature uniquely identifies an approval, so hashing it is a safe replay key. | Reality: `(r, n-s)` is an equally valid signature over the same message, so the bytes are not unique. | Why: ECDSA's algebraic symmetry. | Source: https://ethereum-magicians.org/t/eip-2-signature-malleability-why-low-s-instead-of-dropping-v/25387
- Belief: EIP-2's low-s rule protects my contract. | Reality: it constrains *transaction* signatures at the protocol level; `ecrecover` inside a contract enforces nothing. | Why: different layers. | Source: https://eips.ethereum.org/EIPS/eip-2
- Belief: `ecrecover` reverts on a bad signature. | Reality: it returns `address(0)`; an unchecked return compares equal to an uninitialised owner slot. | Why: precompile convention predates custom errors.
- Belief: Passkeys can't sign for Ethereum because they use the wrong curve. | Reality: true before Fusaka, false now — EIP-7951 verifies secp256r1 natively for 6900 gas. | Source: https://eips.ethereum.org/EIPS/eip-7951

### Practice ideas

- kind: implement — Write a Merkle-proof verifier and a signature verifier from scratch in TypeScript, then port the signature verifier to Solidity. — Acceptance: both agree with `viem` on 100 random vectors.
- kind: break — Given a contract that stores `keccak256(signature)` as a used-nonce key, forge a second valid signature over the same message and spend twice. — Acceptance: a Foundry test proving the double-spend, then a fix using low-s normalisation plus a message-derived nonce.
- kind: fix — A contract calls `ecrecover` and compares to `owner` without checking for `address(0)`. — Acceptance: a failing test that authorises with a malformed signature, then a passing test after the fix.
- kind: measure — Compare gas for verifying a secp256k1 signature via `ecrecover` vs a secp256r1 signature via the `0x100` precompile. — Acceptance: a table of measured gas with the delta explained.
- kind: read — Read EIP-7951 end to end and answer: why 160 bytes of input, why return empty data on failure rather than `0x…00`? — Acceptance: written answer citing the spec.

### Pays off in

`03 accounts & delegation` (7702 delegation is authorised by a signature) · `04 ABI & selectors` (`keccak256` derives every function selector) · `04 token standards` (ERC-2612 permit is EIP-712) · `06 vulnerability classes` (signature replay and malleability are a top finding class) · `07 passkeys` (EIP-7951 is what makes passkey wallets viable) · `10 commitments` (hashing is the commitment primitive).

### Visual opportunities

- Side-by-side Keccak vs SHA-3 padding byte, with the resulting digests, showing why they diverge.
- The ECDSA malleability symmetry drawn on the curve: `s` and `n − s` mirrored about the x-axis.
- EIP-712 as nested hashing: domain separator + struct hash → digest, with the wallet display alongside.
- A signature-replay attack sequence diagram: same signature, two contexts, one missing domain separator.

### Gaps & uncertainties

- Did not yet verify the FIPS 202 padding bytes against the NIST document itself — currently resting on a secondary source. **Must confirm before publishing.**
- Real-world gas cost of `ecrecover` (3000) not re-verified post-Fusaka; confirm against current execution-specs.

### F1 addendum — commitments & Merkle trees

#### Concepts

- `commitment` — A value binding you to a secret without revealing it; must be *hiding* and *binding*. | requires: [hash-function]
- `hash-commitment` — `keccak256(value ‖ salt)`; the salt supplies hiding, collision-resistance supplies binding. | requires: [commitment]
- `merkle-tree` — A binary tree of hashes whose root commits to every leaf. | requires: [hash-function, collision-resistance]
- `merkle-inclusion-proof` — The sibling hashes along one root-to-leaf path, letting a verifier confirm membership in `O(log n)` without the full set. | requires: [merkle-tree]
- `merkle-second-preimage` — If leaves and internal nodes are hashed identically, a 64-byte "leaf" can be a disguised internal node, letting an attacker prove membership of data that was never in the tree. | requires: [merkle-inclusion-proof, second-preimage-resistance]
- `domain-separated-hashing` — Hashing leaves and internal nodes differently (prefix byte, double hash, or distinct function) so the two can never be confused. | requires: [merkle-second-preimage]
- `sorted-pair-hashing` — Sorting each hash pair before concatenation makes proofs order-independent, but is exactly what enables the 64-byte confusion; the two design choices interact. | requires: [merkle-inclusion-proof]

#### Primary sources

- [MerkleProof: intermediate nodes can be reinterpreted as leaves](https://github.com/OpenZeppelin/openzeppelin-contracts/issues/3091) — tier: primary-analysis — the canonical write-up on OpenZeppelin's own library; note their documented mitigation is to avoid 64-byte pre-image leaves.
- [Preventing the second preimage attack in Merkle proof verification](https://www.nethermind.io/blog/preventing-the-second-preimage-attack-in-merkle-proof-verification) — tier: primary-analysis — Nethermind; clear mechanics and mitigations.
- [The second preimage attack for Merkle trees in Solidity](https://rareskills.io/post/merkle-tree-second-preimage-attack) — tier: primary-analysis — RareSkills; the clearest worked exploit.
- [Merkle proof implementation subject to tree extension attacks](https://github.com/code-423n4/contracts/issues/39) — tier: primary-analysis — a real Code4rena finding; ideal `code-read` material.
- [FSA: analysing secondary preimage attacks on Merkle-proof-based airdrops](https://www.sciencedirect.com/science/article/pii/S2096720925000958) — tier: primary-analysis — published: 2025 — systematic study; use for the claim that this is a live class, not a curiosity.

#### Misconceptions

- Belief: Using OpenZeppelin's `MerkleProof` makes proofs safe by default. | Reality: the library is sound but the *tree construction* is the caller's responsibility; 64-byte leaves reintroduce the attack. | Source: https://github.com/OpenZeppelin/openzeppelin-contracts/issues/3091
- Belief: Sorting hash pairs is purely a convenience. | Reality: it removes the need to encode left/right, but couples directly to the second-preimage surface. | Source: https://rareskills.io/post/merkle-tree-second-preimage-attack
- Belief: A hash commitment alone is hiding. | Reality: without a salt, a low-entropy value is brute-forced instantly — "commit to a number 1-100" is not hiding.

#### Practice ideas

- kind: break — Build a Merkle airdrop with 64-byte leaves and no domain separation, then claim a payout for an address never in the tree. — Acceptance: a Foundry test proving the forged claim, then a passing test after adding a leaf prefix.
- kind: implement — Build the tree, the proof generator and the on-chain verifier yourself, no libraries. — Acceptance: verifier accepts every real leaf, rejects a mutated one, and rejects the disguised-internal-node forgery.

---

## F2 — Data & encoding

### Concepts

- `byte-word-32` — The EVM's native unit is a 32-byte word; almost every layout rule follows from this. | requires: []
- `endianness` — Byte order convention; the execution layer is big-endian, SSZ integers are little-endian. | requires: [byte-word-32]
- `abi-encoding` — The canonical scheme: each argument padded to 32 bytes, dynamic types stored as an offset plus a length-prefixed payload. | requires: [byte-word-32]
- `function-selector` — The first 4 bytes of `keccak256("name(type1,type2)")`, which is why selectors can collide and why signatures are canonicalised. | requires: [abi-encoding, hash-function]
- `abi-encode-vs-packed` — `abi.encode` pads and length-prefixes; `abi.encodePacked` concatenates tightly with no delimiters. | requires: [abi-encoding]
- `packed-hash-collision` — With two or more dynamic arguments, packed encoding is ambiguous: `("AB","C")` and `("A","BC")` both produce `"ABC"`, so their hashes are equal. | requires: [abi-encode-vs-packed, collision-resistance]
- `rlp` — The execution layer's serialization: exactly two types, byte strings and lists, with length-prefix rules; interpretation is left to higher layers. | requires: [byte-word-32]
- `ssz` — The consensus layer's serialization: richer typed schema, not self-describing, little-endian integers, and it defines Merkleization alongside serialization. | requires: [rlp] | contrasts: [rlp]
- `ssz-merkleization` — SSZ unifies encoding and hashing so Merkle roots and proofs fall out of the type definition. | requires: [ssz, merkle-tree]
- `canonical-serialization` — Exactly one valid byte encoding per value; without it, two encodings of "the same" data hash differently and consensus splits. | requires: [rlp, ssz]

### Primary sources

- [RLP and SSZ: understanding serialization design in Ethereum](https://kourin.jp/posts/01_rlp-and-ssz/) — tier: primary-analysis — published: 2026-03 — the best current side-by-side; verify encoding rules against the specs.
- [Simple Serialize (SSZ) vs Recursive Length Prefix (RLP)](https://hackmd.io/@Jesserc/ryPP2Wnv3) — tier: primary-analysis — concrete worked encodings.
- [Understanding hash collisions: abi.encodePacked in Solidity](https://www.nethermind.io/blog/understanding-hash-collisions-abi-encodepacked-in-solidity) — tier: primary-analysis — Nethermind; the definitive treatment.
- [ABI hash collisions](https://scsfg.io/hackers/abi-hash-collisions/) — tier: primary-analysis — Smart Contract Security Field Guide.
- [Hash collision with multiple variable-length arguments](https://kadenzipfel.github.io/smart-contract-vulnerabilities/vulnerabilities/hash-collision.html) — tier: primary-analysis — catalogued vulnerability entry.

### Current state (Aug 2026)

- The layer split holds: **execution clients use RLP, consensus clients use SSZ.** The exception is peer discovery — discv5 is shared by both layers and still uses RLP.
- There is long-running interest in SSZ-ifying execution-layer objects; treat any claim that this has happened as needing a fresh check against execution-specs.

### Misconceptions

- Belief: `abi.encodePacked` is just a cheaper `abi.encode`. | Reality: it is ambiguous with two or more dynamic arguments and is a live vulnerability class. | Source: https://www.nethermind.io/blog/understanding-hash-collisions-abi-encodepacked-in-solidity
- Belief: Ethereum has one serialization format. | Reality: two, split by layer, plus discv5 as a deliberate exception. | Source: https://kourin.jp/posts/01_rlp-and-ssz/
- Belief: SSZ is self-describing like JSON. | Reality: the schema must be known in advance to decode at all. | Source: https://hackmd.io/@Jesserc/ryPP2Wnv3
- Belief: Serialization is a boring implementation detail. | Reality: non-canonical encoding is a consensus-split bug; determinism is a security property.

### Practice ideas

- kind: implement — Write an RLP encoder and decoder from scratch; round-trip a real mainnet transaction fetched with `cast`. — Acceptance: your encoding is byte-identical to the raw transaction from the node.
- kind: break — Write a contract that keys authorisation on `keccak256(abi.encodePacked(a, b))` with two string arguments, then collide it. — Acceptance: a Foundry test showing two distinct inputs passing the same check, then a fix using `abi.encode`.
- kind: read — Hand-decode a mainnet transaction's calldata: selector, then each argument, including a dynamic one. — Acceptance: written byte-offset table matching what `cast calldata-decode` reports.
- kind: measure — Compare gas and byte length for `abi.encode` vs `abi.encodePacked` on the same fixed-size arguments. — Acceptance: measured table, with a note on when the saving is safe to take.

### Pays off in

`03 transaction types` (transactions are RLP) · `03 state & tries` (trie nodes are RLP) · `04 ABI & selectors` · `06 vulnerability classes` (packed-encoding collisions) · `11 consensus specs` (SSZ everywhere) · `10 commitments` (SSZ Merkleization).

### Visual opportunities

- One transaction shown three ways: raw bytes, RLP structure, decoded fields.
- The `("AB","C")` vs `("A","BC")` collision animated as bytes concatenating into the same string.
- ABI layout of a call with one static and one dynamic argument, offsets drawn as arrows.

### Gaps & uncertainties

- RLP length-prefix boundary rules quoted from secondary sources; confirm against the execution-specs RLP definition before publishing.
- Whether any execution-layer object has moved to SSZ as of Aug 2026 — unverified, needs a spec check.

---

## F5 — State & data structures (partial)

### Concepts

- `key-value-state` — Ethereum's world state is a mapping from address to account, and each contract holds its own slot mapping. | requires: []
- `trie` — A prefix tree where position in the structure encodes the key, rather than storing the key at a node. | requires: [key-value-state]
- `nibble` — Half a byte, four bits; the MPT's traversal unit, which is why branch nodes have 16 slots. | requires: [trie]
- `mpt-branch-node` — A 17-item node: sixteen nibble slots plus a seventeenth for a key terminating exactly here. | requires: [nibble]
- `mpt-extension-node` — Compresses a shared path prefix into one node holding the path and the child hash, so no branch has a single non-zero entry. | requires: [mpt-branch-node]
- `mpt-leaf-node` — Terminates a path and holds the value. | requires: [mpt-extension-node]
- `state-root` — The MPT root in each block header, committing to the entire world state in 32 bytes. | requires: [mpt-leaf-node, merkle-tree]
- `storage-proof` — A Merkle proof against the state root proving one account or slot value, enabling light clients and cross-chain reads. | requires: [state-root, merkle-inclusion-proof]
- `exclusion-proof` — Proving a key is *absent*, which tries support and plain Merkle trees do not. | requires: [storage-proof] | contrasts: [merkle-inclusion-proof]
- `verkle-trie` — A proposed replacement using vector commitments to make proofs small enough for stateless clients. | requires: [state-root] | contrasts: [mpt-branch-node]

### Primary sources

- [Ethereum Merkle Patricia Trie explained](https://flow.com/engineering-blogs/ethereum-merkle-patricia-trie-explained) — tier: primary-analysis — clearest structural walkthrough found.
- [An introduction to Merkle Patricia Trie](https://blog.lambdaclass.com/an-introduction-to-merkle-patricia-trie/) — tier: primary-analysis — LambdaClass; implementation-oriented.
- [Modified Merkle Patricia Trie — how Ethereum saves a state](https://medium.com/codechain/modified-merkle-patricia-trie-how-ethereum-saves-a-state-e6d7555078dd) — tier: primary-analysis — good on the encoding of paths.
- [Historical and multichain storage proofs](https://arxiv.org/pdf/2411.00193) — tier: primary-analysis — published: 2024-11 — why storage proofs matter beyond one chain.

### Misconceptions

- Belief: The state trie stores keys at nodes. | Reality: the *path* through the trie is the key; nodes store structure and values. | Source: https://blog.lambdaclass.com/an-introduction-to-merkle-patricia-trie/
- Belief: A Merkle tree and a Patricia trie are the same thing. | Reality: the trie gives key-addressed lookup and exclusion proofs; a plain Merkle tree gives neither.
- Belief: Extension nodes are an optimisation you can ignore. | Reality: they are required — no branch node may have exactly one non-zero entry, so the structure is canonical and roots are deterministic.

### Practice ideas

- kind: implement — Build a working MPT with all three node types, insert a handful of accounts, and generate an inclusion proof. — Acceptance: your root matches a reference implementation on the same input set.
- kind: read — Fetch a real account proof with `eth_getProof` and verify it by hand against the block's state root. — Acceptance: written walkthrough of each node in the path.

### Pays off in

`03 state & tries` · `09 bridges` (storage proofs are how trustless bridges read the other chain) · `11 Verkle & statelessness` · `10 commitments`.

### Gaps & uncertainties

- Verkle status as of Aug 2026 unverified — Hegota discussion only, not shipped. Confirm before writing anything definite.
- Path encoding (hex-prefix / compact encoding) not yet researched; needed before the `implement` exercise is writable.

---

## F3 — Networks

> **Verification status: SOURCES VERIFIED, SYNTHESIS NOT.** The searches returned strong primary
> sources but truncated summaries. Concept list below is authored scaffolding; every claim must be
> checked against the linked source before any of it reaches a lesson.

### Concepts

- `p2p-overlay` — Ethereum has no server; every node maintains connections to a handful of peers and the network is the union of those links. | requires: []
- `devp2p` — The execution layer's networking stack, carrying transactions and blocks between execution clients. | requires: [p2p-overlay]
- `discv5` — The discovery protocol both layers share for finding peers; notably still RLP-encoded even on the consensus side. | requires: [devp2p]
- `gossipsub` — The consensus layer's pub/sub propagation protocol, designed for attack resilience rather than raw speed. | requires: [p2p-overlay]
- `propagation-latency` — A block or transaction reaches the network over hundreds of milliseconds, not instantly; slot timing is built around this. | requires: [gossipsub]
- `mempool-is-not-a-queue` — Each node holds its own view of pending transactions, ordered by its own policy; there is no single global pending list. | requires: [propagation-latency] | contrasts: [key-value-state]
- `eclipse-attack` — An attacker who controls all of a victim's peer connections controls the victim's entire view of the chain. | requires: [p2p-overlay]
- `sybil-resistance` — Identities are free in a p2p network, so protocols must not assume peer count implies distinct participants. | requires: [eclipse-attack]

### Primary sources

- [Eclipsing Ethereum peers with false friends](https://arxiv.org/pdf/1908.10141) — tier: primary-analysis — published: 2019-08 — the canonical eclipse-attack paper against Ethereum specifically.
- [GossipSub: attack-resilient message propagation in Filecoin and ETH2.0](https://arxiv.org/pdf/2007.02754) — tier: primary-analysis — published: 2020-07 — the design rationale for the consensus-layer propagation protocol.
- [discv5: collect more eclipse attack countermeasures](https://github.com/ethereum/devp2p/issues/109) — tier: canonical-docs — the protocol authors working the problem in the open; excellent `code-read` material.
- [discv5: attack mitigation proposal](https://github.com/ethereum/devp2p/issues/161) — tier: canonical-docs — same, with concrete proposals.
- [Discovering the Ethereum2 P2P network](https://arxiv.org/pdf/2012.14728) — tier: primary-analysis — published: 2020-12 — measurement study of the real topology.
- [The Hitchhiker's guide to P2P overlays in Ethereum consensus](https://hackmd.io/@dmarz/ethereum_overlays) — tier: primary-analysis — the clearest overview of how the layers' networking fits together.
- [Tikuna: an Ethereum blockchain network security monitoring system](https://arxiv.org/pdf/2310.09193) — tier: primary-analysis — published: 2023-10 — what attacks look like from a monitoring perspective.

### Practice ideas

- kind: implement — Run a node, subscribe to pending transactions, and log arrival timestamps for the same transaction hash from two different providers. — Acceptance: a measured distribution of propagation delta, with a written explanation of why they disagree.
- kind: measure — Compare your own node's mempool against a public one at the same instant. — Acceptance: quantified overlap and disjoint sets, proving the mempool is a local view.
- kind: read — Read the two discv5 eclipse-countermeasure issues and summarise the attack and each proposed mitigation. — Acceptance: written summary naming the trade-off in each.

### Pays off in

`02 mempool` · `02 finality & reorgs` · `06 threat modeling` (network-level assumptions) · `08 MEV` (propagation timing is the whole game) · `11 client architecture` · `13 running nodes`.

### Gaps & uncertainties

- **Every synthesis claim above is unverified.** Sources are real and relevant; the summaries were truncated.
- Current discv5 version and which eclipse countermeasures actually shipped — not established.
- Whether devp2p has changed post-Fusaka — not checked.

---

## F4 — Distributed systems

> **Verification status: SOURCES VERIFIED, SYNTHESIS NOT.** Same caveat as F3.

### Concepts

- `state-machine-replication` — Every node runs the same deterministic transition function over the same ordered inputs, so they agree by construction, not by voting on outcomes. | requires: []
- `determinism-requirement` — Any non-determinism (wall-clock time, floating point, iteration order) splits the network; this is why the EVM has none of them. | requires: [state-machine-replication]
- `byzantine-fault` — A participant that behaves arbitrarily, including maliciously, rather than merely crashing. | requires: [state-machine-replication] | contrasts: [crash-fault]
- `safety-property` — "Nothing bad happens" — two conflicting blocks are never both finalised. | requires: [byzantine-fault]
- `liveness-property` — "Something good eventually happens" — the chain keeps making progress. | requires: [safety-property] | contrasts: [safety-property]
- `availability-finality-dilemma` — Under network partition a protocol must choose: stay available and risk conflicting finalisation, or stay safe and stall. Ethereum deliberately chooses differently in different components. | requires: [safety-property, liveness-property]
- `finality-is-a-spectrum` — "Confirmed" is not binary: probabilistic head, justified, then finalised, each a different guarantee with a different cost to reverse. | requires: [availability-finality-dilemma]
- `casper-ffg` — The finality gadget: validators vote on checkpoints, and two-thirds agreement justifies then finalises them. | requires: [finality-is-a-spectrum]
- `lmd-ghost` — The fork-choice rule selecting the head between finalised checkpoints, weighted by validators' latest messages. | requires: [casper-ffg] | contrasts: [casper-ffg]
- `ebb-and-flow` — Ethereum runs an available chain and a finalised chain simultaneously, which is how it sidesteps having to pick one horn of the dilemma. | requires: [availability-finality-dilemma]

### Primary sources

- [Upgrading Ethereum — 2.3.2 Consensus overview](https://eth2book.info/latest/part2/consensus/overview/) — tier: canonical-docs — Ben Edgington's book; the best single reference on Ethereum consensus in existence.
- [Upgrading Ethereum — 2.3.4 Casper FFG](https://eth2book.info/latest/part2/consensus/casper_ffg/) — tier: canonical-docs — the finality gadget in detail.
- [Ebb-and-flow protocols: a resolution of the availability-finality dilemma](https://arxiv.org/pdf/2009.04987) — tier: primary-analysis — published: 2020-09 — the formal treatment of why Ethereum runs two chains at once. **Core reading for this module.**
- [Validated, staking on eth2: two ghosts in a trench coat](https://blog.ethereum.org/2020/02/12/validated-staking-on-eth2-2-two-ghosts-in-a-trench-coat) — tier: canonical-docs — the EF's own explanation of how FFG and GHOST combine.
- [Goldfish: no more attacks on Ethereum?!](https://arxiv.org/pdf/2209.03255) — tier: primary-analysis — published: 2022-09 — known attacks on the current fork choice and a proposed replacement.
- [Commitment attacks on Ethereum's reward mechanism](https://arxiv.org/pdf/2407.19479) — tier: primary-analysis — published: 2024-07 — recent, and a good bridge into the incentives module.
- [Formal verification of blockchain Byzantine fault tolerance](https://arxiv.org/pdf/1909.07453) — tier: primary-analysis — published: 2019-09.

### Misconceptions

> To be written after verifying against eth2book. Candidate: "finality means irreversible" — it means
> reversal costs at least one third of stake being slashed, which is a price, not an impossibility.

### Practice ideas

- kind: write — Classify three real chain incidents as safety failures, liveness failures, or neither, and defend each classification. — Acceptance: written analysis citing what was actually violated.
- kind: read — Read the ebb-and-flow paper's problem statement and explain, in your own words, why a single chain cannot have both properties under partition. — Acceptance: written explanation that does not use the words "CAP theorem".

### Pays off in

`02 proof of stake` · `02 finality & reorgs` · `09 rollup anatomy` (a rollup inherits L1 finality, which is why the spectrum matters) · `11 fork choice` · `11 consensus specs`.

### Gaps & uncertainties

- **Synthesis unverified.** Concept statements are authored scaffolding.
- CAP and FLP need careful framing — both are routinely misapplied to blockchains and I have not yet found a treatment I trust enough to cite. Flagged as a research task.

---

## F6 — Incentives & economics

> **Verification status: PARTIALLY VERIFIED.** The Roughgarden result below came through the search
> substantively and is citable. The cost-of-attack search failed (classifier timeout) and is unstarted.

### Concepts

- `mechanism-design` — Designing rules so that participants acting in self-interest produce the outcome you want; the inverse of game theory. | requires: []
- `incentive-compatibility` — A mechanism where honest behaviour is the participant's best strategy, so honesty needs no enforcement. | requires: [mechanism-design]
- `first-price-auction` — Bidders pay their bid, so everyone must guess how much to shade; strategically complex and wasteful. | requires: [mechanism-design]
- `second-price-auction` — Bidders pay the runner-up's bid, making truthful bidding dominant — but trivially gamed by a block producer who can insert fake bids. | requires: [first-price-auction] | contrasts: [first-price-auction]
- `dsic` — Dominant-strategy incentive compatibility: truthful bidding is optimal regardless of what others do. | requires: [incentive-compatibility]
- `mmic` — Myopic miner incentive compatibility: the block producer cannot profit by deviating within one block. | requires: [incentive-compatibility]
- `oca-proofness` — Off-chain-agreement proofness: no side deal between producer and users beats following the protocol. | requires: [mmic]
- `base-fee-burn` — Burning the base fee is what makes EIP-1559 resistant to producer manipulation — the producer cannot pay it to themselves. | requires: [oca-proofness]
- `eip-1559-tfm` — Ethereum's transaction fee mechanism: an algorithmically-adjusted burned base fee plus a priority tip. | requires: [base-fee-burn]
- `cost-of-attack` — Security expressed as a price: what it would cost to violate a given property, versus what violating it is worth. | requires: [incentive-compatibility]

### Primary sources

- [Transaction fee mechanism design (Roughgarden)](https://timroughgarden.org/papers/eip1559.pdf) — tier: primary-analysis — published: 2021 — **the** formal analysis of EIP-1559. Introduces MMIC and OCA-proofness; establishes that EIP-1559 satisfies both, and is DSIC except during sudden demand spikes.
- [Transaction fee mechanism design (arXiv)](https://arxiv.org/pdf/2106.01340) — tier: primary-analysis — published: 2021-06 — the arXiv version of the same work.
- [Dynamical analysis of the EIP-1559 Ethereum fee market](https://arxiv.org/pdf/2102.10567) — tier: primary-analysis — published: 2021-02 — records that VCG and second-price auctions reduce bidder complexity but are exploitable by producers who can inflate demand for their own blocks. This is the argument for why Ethereum did *not* use a second-price auction.
- [A treatment of EIP-1559: enhancing the transaction fee mechanism through Nth-price auction](https://link.springer.com/chapter/10.1007/978-981-97-9412-6_20) — tier: primary-analysis — proposes a burning N-price mechanism satisfying UIC, MIC and c-SCP simultaneously under congestion.
- [Dynamics of Ethereum's EIP-1559 transaction fee mechanism](https://dl.acm.org/doi/10.1145/3773291) — tier: primary-analysis — ACM; empirical behaviour.
- [Price elasticity of gas demand on L1 and L2](https://arxiv.org/pdf/2606.13555) — tier: primary-analysis — published: 2026-06 — recent, and directly relevant to the post-Fusaka cost story in Track 03.

### Misconceptions

- Belief: EIP-1559 was about lowering fees. | Reality: it was about making fee *estimation* tractable and the mechanism manipulation-resistant; average cost was never the target. | Source: https://timroughgarden.org/papers/eip1559.pdf
- Belief: A second-price auction would have been the textbook-correct choice. | Reality: textbook second-price assumes the auctioneer is not also a bidder. The block producer is, so they can insert fake bids. | Source: https://arxiv.org/pdf/2102.10567
- Belief: Burning the base fee is a monetary-policy decision. | Reality: it is a mechanism-design necessity — an unburned base fee paid to the producer destroys OCA-proofness. | Source: https://timroughgarden.org/papers/eip1559.pdf
- Belief: EIP-1559 is incentive compatible, full stop. | Reality: DSIC holds except under sudden demand spikes, which is exactly when fee markets matter most. | Source: https://timroughgarden.org/papers/eip1559.pdf

### Practice ideas

- kind: write — Model the cost of a specific attack (e.g. reverting one finalised block) and defend every input number. — Acceptance: written model with sources for each parameter and a stated conclusion.
- kind: measure — Pull base fee and priority tip across 1,000 recent blocks and plot the relationship to block fullness. — Acceptance: a chart plus a written explanation of the adjustment mechanism's behaviour.
- kind: read — Read Roughgarden §1 and explain why MMIC and OCA-proofness had to be invented rather than reusing standard DSIC. — Acceptance: written answer naming what is different about the blockchain setting.

### Pays off in

`03 gas & fee market` · `08 MEV` (the whole field is mechanism design under adversarial conditions) · `08 oracles & manipulation cost` · `09 sequencers` (an L2 sequencer is an auctioneer with the same conflict) · `11 ePBS`.

### Gaps & uncertainties

- **Cost-of-attack module is unstarted** — the search failed with a classifier timeout. Needs: 51%/finality-reversal cost models, current staked-ETH figures, and the slashing arithmetic.
- No source yet for the pedagogically important framing "security is a price, not a guarantee".
