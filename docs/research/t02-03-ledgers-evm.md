# Track 02 — Ledgers & Consensus · Track 03 — The Ethereum Machine
Source-verified curriculum research. Raw structured material — not lesson prose.

- Research date: 2026-08-25
- Chain state assumed: post-Pectra (May 2025), post-Fusaka (Dec 2025), pre/early-Glamsterdam (H1 2026)
- Source tiers: `spec` (EIPs, execution-specs, consensus-specs, yellow paper) > `canonical-docs` (ethereum.org, client docs) > `primary-analysis` (core-dev notes, research posts by spec authors) > `secondary` (marked explicitly)
- Concept line format: `- concept-id — statement | requires: [ids] | contrasts: [ids]`

## Status log
- [x] file created 2026-08-25
- [x] raw buffer folded into 03.1 (no content lost)

---

## 03.1 — Accounts & delegation

> **Verification status: VERIFIED.** EIP-7702 spec text and OpenZeppelin/Nethermind analysis both retrieved.
> This module replaces the "EOA vs contract account" framing entirely.

### Concepts

- `account` — An entry in world state holding nonce, balance, storage root and code hash. | requires: [key-value-state]
- `eoa` — An account controlled by a private key. Historically defined by having *no* code — a definition EIP-7702 broke. | requires: [account]
- `contract-account` — An account whose behaviour is defined by deployed code rather than a key. | requires: [account] | contrasts: [eoa]
- `eoa-vs-contract-binary` — **Historical.** The claim that every account is exactly one of the two, distinguished by whether `code.length == 0`. | requires: [eoa, contract-account]
- `delegation-designator` — The 23-byte value `0xef0100 ‖ address` written into an EOA's code slot, pointing at the contract whose code the EVM should execute for that account. | requires: [eoa] | supersedes: [eoa-vs-contract-binary]
- `set-code-transaction` — Transaction type `0x04`, carrying an `authorization_list` that installs delegation designators. | requires: [delegation-designator]
- `authorization-tuple` — The signed `(chain_id, address, nonce)` authorising a delegation; signed by the EOA, but submittable by anyone. | requires: [set-code-transaction]
- `chain-id-scoping` — Setting `chain_id` to a specific chain limits an authorization to it; `chain_id = 0` authorises on **any** chain, which is powerful and dangerous. | requires: [authorization-tuple]
- `delegate-is-total-control` — A malicious or buggy delegate contract gains near-complete control of the signer's EOA, so choosing a delegate is a trust decision on par with handing over the key. | requires: [delegation-designator]
- `code-length-check-broken` — Contracts that use `code.length == 0` to mean "this is an EOA, so it's not a contract" are now wrong, and that check appears throughout pre-2025 code. | requires: [delegation-designator, eoa-vs-contract-binary]
- `delegation-clearing` — Delegating to `address(0)` clears the indicator; code becomes empty and the code hash returns to the empty-code hash. | requires: [delegation-designator]
- `extcode-vs-code-asymmetry` — `EXTCODESIZE`/`EXTCODECOPY`/`EXTCODEHASH` observe the 23-byte *indicator*; `CODESIZE`/`CODECOPY` during delegated execution observe the *target* code. External and internal views disagree. | requires: [delegation-designator]
- `delegation-not-chained` — A call reads the first delegation indicator and stops; delegation chains are not followed. | requires: [delegation-designator]
- `tx-origin-check-broken` — `msg.sender == tx.origin` no longer implies "the caller is not a contract", because a delegated EOA originates transactions and runs code. | requires: [delegation-designator, code-length-check-broken]
- `delegate-storage-collision` — Migrating between delegate implementations can collide storage slots, because the storage belongs to the EOA and persists across delegate changes. | requires: [delegation-designator]
- `sponsored-relay-griefing` — A relayer paying for someone else's authorization can be griefed by balance sweeps or nonce invalidation before inclusion. | requires: [authorization-tuple]

### Spec detail (verified against the EIP text)

#### Normative detail — verified against eips.ethereum.org/EIPS/eip-7702, status Final, shipped in Pectra 2025-05-07)
- Tx type `0x04` (SET_CODE_TX_TYPE). Carries `authorization_list` of tuples `[chain_id, address, nonce, y_parity, r, s]`.
- `chain_id` must be `0` (valid on ANY chain) or the current chain id. `0` is the cross-chain-replay footgun.
- Authority recovered as `ecrecover(keccak256(MAGIC || rlp([chain_id, address, nonce])), y_parity, r, s)` with `MAGIC = 0x05`. `s <= secp256k1n/2` (EIP-2).
- On success the account's **code field** is set to the 23-byte **delegation indicator** `0xef0100 || address`. Authority nonce is incremented by one as part of processing the authorization (this is what makes self-sponsoring work).
- Setting `address = 0x0` clears the delegation: code becomes empty, code hash returns to `0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470`.
- Gas: `PER_AUTH_BASE_COST` = 12,500 per tuple; `PER_EMPTY_ACCOUNT_COST` = 25,000 (the difference is refunded when the authority already exists). Resolving a delegation on access costs cold 2,600 / warm 100 extra.
- `EXTCODESIZE`/`EXTCODECOPY`/`EXTCODEHASH` observe the **indicator** (size 23), NOT the target code. `CODESIZE`/`CODECOPY` during delegated execution observe the **target** code. This asymmetry is a first-class teaching point.
- `CALL`/`CALLCODE`/`STATICCALL`/`DELEGATECALL` follow the delegation. Chains are NOT followed: read the first indicator and stop.
- Delegating to a precompile address executes as empty code (call succeeds, no effect).
- EIP-3607 relaxed: an account whose code is a valid delegation indicator may still originate transactions.
- Security notes from the EIP: `msg.sender == tx.origin` no longer implies "not a contract"; storage-slot collisions when migrating between delegate implementations; sponsored relayers can be griefed by balance sweeps / nonce invalidation; mempool policy should cap pending txs per delegated EOA.
- Related, non-shipped: EIP-7851 (code-controlled EOA delegation), EIP-7819 (`SETDELEGATE` opcode), EIP-8130 (account abstraction by account configuration) — all draft, useful as "where this is going".

### Primary sources

- [EIP-7702: Set Code for EOAs](https://eips.ethereum.org/EIPS/eip-7702) — tier: spec — normative: transaction type `0x4`, designator `0xef0100 ‖ address`, `authorization_list` semantics, and the security considerations section.
- [EOA Delegation](https://docs.openzeppelin.com/contracts/5.x/eoa-delegation) — tier: canonical-docs — OpenZeppelin's implementation guidance; what a safe delegate looks like.
- [EIP-7702 attack surfaces: what developers should know](https://www.nethermind.io/blog/eip-7702-attack-surfaces-what-developers-should-know) — tier: primary-analysis — Nethermind. **The key security reading for this module.**
- [Understanding EIP-7702's impact on our contracts and mitigating security risks](https://tranchess.medium.com/understanding-eip-7702-s-impact-on-our-contracts-and-mitigating-security-risks-de705f249236) — tier: primary-analysis — a live protocol working through what broke in their own code. Excellent `code-read` material.
- [eip7702.io](https://eip7702.io/) — tier: secondary — overview hub; useful for orientation, verify specifics against the EIP.

### Current state (Aug 2026)

- Live on mainnet since **Pectra, May 2025**. Not experimental.
- Ethereum's own 2026 guidance is to build against **wallet capabilities** rather than raw EOAs, pairing 7702 with ERC-4337, and to treat delegation targets as wallet infrastructure rather than app-controlled code.

### Misconceptions

- Belief: An account with code is a contract; an account without code is an EOA. | Reality: a delegated EOA has code (the 23-byte designator) and is still key-controlled. | Why: 7702 broke the binary. | Source: https://eips.ethereum.org/EIPS/eip-7702
- Belief: `address.code.length == 0` proves the caller is not a contract. | Reality: it never proved that (constructor calls), and now it fails in the other direction too. | Source: https://www.nethermind.io/blog/eip-7702-attack-surfaces-what-developers-should-know
- Belief: Delegation is like approving a token allowance — bounded and revocable. | Reality: the delegate executes *as* your account. It is closer to handing over the key than to an approval. | Source: https://docs.openzeppelin.com/contracts/5.x/eoa-delegation
- Belief: An authorization only applies to the chain I signed it on. | Reality: only if you set `chain_id`. Signing with `chain_id = 0` authorises the delegation on every chain where that address holds code — and the code at that address may differ per chain unless deployment was deterministic. | Source: https://eips.ethereum.org/EIPS/eip-7702

### Practice ideas

- kind: read — Find three pre-2025 contracts using `code.length` as an EOA check and assess whether each is now exploitable. — Acceptance: written assessment per contract with the attack path or a reason it's safe.
- kind: implement — Delegate an anvil EOA to a batching contract via a type-4 transaction, then execute two calls atomically from it. — Acceptance: a Foundry test showing both calls land in one transaction from the EOA address.
- kind: break — Write a naive delegate that forwards arbitrary calldata without access control, delegate to it, and drain the account from a third party. — Acceptance: a test proving the drain, then a fixed delegate that prevents it.
- kind: write — Given a protocol that gates rewards on "is not a contract", write the threat model change caused by 7702. — Acceptance: written analysis naming the broken assumption and a replacement design.

### Visual opportunities

- The account record before and after delegation, with the 23-byte designator highlighted in the code slot.
- Call flow: transaction → EOA → designator lookup → delegate code executing in the EOA's storage context. The storage context is the part people get wrong.
- A timeline showing the same address as plain EOA, delegated, and re-delegated.

### Gaps & uncertainties

- ~~Revocation mechanics~~ — resolved: delegating to `address(0)` clears it (see spec detail above).
- Interaction between 7702 delegation and ERC-4337 bundlers not yet researched — needed before Track 07.

---

## 03.3 — Transaction types

> **Verification status: VERIFIED.**

### Concepts

- `eip-2718-envelope` — The typed-transaction wrapper: a one-byte type prefix concatenated with a type-specific payload, with types restricted to `0x00`–`0x7f`. | requires: [rlp]
- `tx-type-0-legacy` — Pre-typed format: `nonce, gasPrice, gasLimit, to, value, data, v, r, s`. No access list, no 1559 fee fields. | requires: [eip-2718-envelope]
- `tx-type-1-access-list` — EIP-2930: adds an `accessList` of addresses and storage keys, pre-warming them for gas savings on cross-contract calls. | requires: [tx-type-0-legacy]
- `tx-type-2-1559` — EIP-1559 (London): replaces `gasPrice` with `maxFeePerGas` and `maxPriorityFeePerGas`. The default for ordinary transactions. | requires: [tx-type-1-access-list, eip-1559-tfm]
- `tx-type-3-blob` — EIP-4844 (Dencun): carries blob commitments and pays a separate blob fee, on its own fee market. | requires: [tx-type-2-1559]
- `tx-type-4-setcode` — EIP-7702 (Pectra): carries an `authorization_list` installing delegation designators. | requires: [tx-type-2-1559, set-code-transaction]
- `separate-fee-markets` — Blob gas and execution gas are priced independently, so blob demand does not raise execution costs and vice versa. | requires: [tx-type-3-blob]
- `nonce-ordering` — A sender's transactions execute in strict nonce order, which is why one stuck transaction blocks everything behind it. | requires: [tx-type-0-legacy]

### Primary sources

- [Transactions](https://ethereum.org/developers/docs/transactions/) — tier: canonical-docs — the reference overview.
- [EIP-2718: Typed Transaction Envelope](https://eips.ethereum.org/EIPS/eip-2718) — tier: spec — the envelope format and the `0x00`–`0x7f` type-number restriction.
- [Transaction types](https://reth.rs/run/faq/transactions/) — tier: canonical-docs — Reth's client-side view; useful because it reflects what a client actually implements.
- [Ethereum transaction types](https://docs.metamask.io/services/concepts/transaction-types/) — tier: canonical-docs — clear per-type field breakdown.

### Misconceptions

- Belief: There is "the" Ethereum transaction format. | Reality: five envelope types coexist on mainnet today, and a wallet must handle all of them. | Source: https://eips.ethereum.org/EIPS/eip-2718
- Belief: Blob transactions make ordinary transactions cheaper or more expensive. | Reality: separate fee markets — they are priced independently by design. | Source: https://ethereum.org/developers/docs/transactions/
- Belief: Legacy type-0 transactions are deprecated and gone. | Reality: still valid and still broadcast; your code must handle them.

### Practice ideas

- kind: read — Fetch one transaction of each of the five types with `cast` and tabulate which fields each carries. — Acceptance: a completed five-row table with the type-specific fields identified.
- kind: implement — Write a decoder that takes a raw transaction hex, identifies its type from the prefix byte, and decodes the correct field set. — Acceptance: correctly decodes at least one real mainnet transaction of each type.
- kind: measure — Send the same call as type-0, type-1 (with access list) and type-2 on anvil; compare gas. — Acceptance: a measured table explaining where the access-list saving comes from.

### Visual opportunities

- All five envelopes stacked, aligned on their shared fields, showing what each type adds.
- Two fee markets side by side over the same block range, demonstrating independence.

---

## 03.6 — Opcodes & memory model (transient storage section)

> **Verification status: VERIFIED.** Spec plus Solidity release notes plus ChainSecurity analysis.

### Concepts

- `transient-storage` — Storage scoped to a single transaction, zeroed automatically when it ends. | requires: [storage-slot] | contrasts: [storage-slot]
- `tstore-tload` — Opcodes `0x5d` (TSTORE) and `0x5c` (TLOAD), taking the same stack arguments as SSTORE/SLOAD, priced at **100 gas** each. | requires: [transient-storage]
- `transient-reentrancy-guard` — The flagship use case: a guard costing ~200 gas per call instead of ~7,100 with regular storage. | requires: [tstore-tload]
- `flash-accounting` — Uniswap v4's pattern: track net balance deltas transiently across a whole transaction, settling once at the end. | requires: [transient-storage]
- `transient-composability-hazard` — Transient state does not survive an untrusted intermediate call frame's own conventions; a lock cannot rely on an intermediate frame to pass it through. | requires: [transient-reentrancy-guard]
- `cheap-reentrancy-economics` — Making guards cheap also makes *attempting* reentrancy cheaper to probe, changing the economics rather than removing the class. | requires: [transient-reentrancy-guard]

### Primary sources

- [EIP-1153: Transient storage opcodes](https://eips.ethereum.org/EIPS/eip-1153) — tier: spec — opcode numbers, pricing, and the composability caveats in the spec's own words.
- [Transient storage opcodes in Solidity 0.8.24](https://www.soliditylang.org/blog/2024/01/26/transient-storage/) — tier: canonical-docs — published: 2024-01 — the language-level story and the explicit warning that advanced uses threaten composability.
- [TSTORE low gas reentrancy](https://www.chainsecurity.com/blog/tstore-low-gas-reentrancy) — tier: primary-analysis — ChainSecurity. **Important:** cheaper guards change reentrancy economics. Core security reading.
- [Demystifying EIP-1153: transient storage](https://medium.com/@organmo/demystifying-eip-1153-transient-storage-faeabbadd0d) — tier: secondary — clear walkthrough; verify against the EIP.

### Current state (Aug 2026)

- Live since **Dencun**; available in Solidity **0.8.24+**. Note Solidity **0.8.34** (Feb 2026) patched a high-severity bug in transient-storage *clearing* in the IR pipeline — pin compiler versions when teaching this.
- Chains supporting it as of 2026 include Ethereum mainnet, Arbitrum One, Base, Optimism and Polygon PoS. **Not universal** — a contract using TSTORE is not portable everywhere.

### Misconceptions

- Belief: Transient storage is just cheap storage. | Reality: it is zeroed at transaction end, so it cannot hold anything across transactions — a different data structure, not a discount. | Source: https://eips.ethereum.org/EIPS/eip-1153
- Belief: A transient reentrancy guard is strictly better than a storage one. | Reality: cheaper, but with composability caveats the spec calls out explicitly, and it changes attack economics. | Source: https://www.chainsecurity.com/blog/tstore-low-gas-reentrancy
- Belief: If it compiles with `transient`, it works on any EVM chain. | Reality: requires Cancun-equivalent support; several chains lag.
- Belief: Transient storage removes the reentrancy vulnerability class. | Reality: it makes the *guard* cheap. Unguarded functions are exactly as vulnerable as before.

### Practice ideas

- kind: measure — Implement the same reentrancy guard with `storage` and with `transient`, measure gas per call. — Acceptance: measured numbers close to the ~7,100 vs ~200 figures, with the SSTORE/SLOAD breakdown explained.
- kind: implement — Build a minimal flash-accounting pool: net deltas transiently, settle once at the end, revert if unsettled. — Acceptance: invariant test proving no path exits with a non-zero delta.
- kind: break — Write a transient guard that relies on an intermediate untrusted frame to relay lock state, then defeat it. — Acceptance: a test demonstrating the bypass and a corrected design.
- kind: read — Read the ChainSecurity TSTORE article and explain how cheaper guards shift attacker economics. — Acceptance: written answer distinguishing "harder to exploit" from "cheaper to attempt".

### Visual opportunities

- Storage vs transient storage lifetime on one timeline across three transactions.
- The ~7,100 vs ~200 gas breakdown as a stacked bar, itemising cold SLOAD, SSTORE set, SSTORE clear and refund.
- Uniswap v4 flash accounting: deltas accumulating across frames, one settlement at the end.

### Gaps & uncertainties

- Details of the 0.8.34 transient-storage clearing bug not retrieved — needed before writing anything version-specific.
- Full current list of chains supporting EIP-1153 unverified; the list above is from a secondary source.

---

## 03.4 — Gas & the fee market

> **Verification status: MOSTLY VERIFIED — one numeric conflict flagged below.**

### Concepts

- `gas` — The unit metering computation, so halting is guaranteed and resource use is paid for. | requires: []
- `gas-limit-vs-gas-used` — The limit is the ceiling you authorise; used is what executed. Unused gas is refunded, the limit is not a price. | requires: [gas]
- `intrinsic-gas` — The fixed cost charged before execution begins: 21,000 base plus calldata cost. | requires: [gas]
- `cold-vs-warm-access` — EIP-2929: the first touch of an address or storage slot in a transaction costs far more than later touches. | requires: [gas]
- `access-list` — EIP-2930's mechanism for pre-declaring addresses and slots to pre-warm them, trading upfront cost for cheaper access. | requires: [cold-vs-warm-access, tx-type-1-access-list]
- `sstore-dynamic-pricing` — SSTORE is priced on the *transition*: zero → non-zero ≈ 20,000, non-zero → different non-zero ≈ 5,000, no-op far less. | requires: [cold-vs-warm-access]
- `memory-expansion-cost` — Memory is charged quadratically beyond a threshold, so large in-memory buffers get expensive fast. | requires: [gas]
- `63-64-rule` — EIP-150: a call forwards at most 63/64 of remaining gas, keeping 1/64 in the caller. | requires: [gas]
- `call-gas-is-a-maximum` — Post-EIP-150 the gas argument to CALL is a ceiling, not a demand: if less is available the call proceeds with less rather than failing. | requires: [63-64-rule]
- `call-depth-attack-dead` — Because forwarded gas decays as `G × (63/64)^d`, gas runs out long before the 1024-frame stack limit, which is why the old call-depth attack no longer works. | requires: [63-64-rule]
- `gas-griefing` — A caller can forward deliberately insufficient gas to make a subcall fail while the outer transaction succeeds. | requires: [call-gas-is-a-maximum]

### Primary sources

- [EIP-2929: Gas cost increases for state access opcodes](https://eips.ethereum.org/EIPS/eip-2929) — tier: spec — the cold/warm model.
- [EIP-150 and the 63/64 rule for gas](https://rareskills.io/post/eip-150-and-the-63-64-rule-for-gas) — tier: primary-analysis — RareSkills; the clearest treatment.
- [63/64 rule and its role in preventing call depth attacks](https://github.com/kadenzipfel/smart-contract-vulnerabilities/issues/36) — tier: primary-analysis — the security framing.
- [The dark side of Ethereum's 1/64th CALL gas reduction](https://medium.com/iovlabs-innovation-stories/the-dark-side-of-ethereum-1-64th-call-gas-reduction-ba661778568c) — tier: primary-analysis — Sergio Demian Lerner on what the rule breaks. Good counter-reading.
- [evm-opcodes/gas.md](https://github.com/wolflo/evm-opcodes/blob/main/gas.md) — tier: primary-analysis — the most complete community gas reference.
- [Testing the limits of EVM stack depth](https://medium.com/arbitrary-execution/testing-the-limits-of-evm-stack-depth-c40ba55ca78e) — tier: primary-analysis — empirical.
- [The pitfalls of `eth_estimateGas`](https://arkis.xyz/blog/the-pitfalls-of-eth-estimategas) — tier: primary-analysis — essential for Track 07.
- [EIP-7686: Linear EVM memory limits](https://eips.ethereum.org/EIPS/eip-7686) — tier: spec — proposed change to memory pricing; track its status.

### ⚠ Numeric conflict to resolve

Sources disagree on `COLD_SLOAD_COST`: one states **2100**, another **800**. 800 appears to be from an
early draft of EIP-2929; the shipped value is believed to be **2100**, with `COLD_ACCOUNT_ACCESS_COST`
**2600** and `WARM_STORAGE_READ_COST` **100**. **Do not publish any of these numbers until confirmed
against the EIP text and a live `forge` gas snapshot.** This is exactly the kind of stale-number
propagation the §12 currency rules exist to catch.

### Misconceptions

- Belief: Setting a high gas limit costs more. | Reality: you pay for gas *used*; the limit only caps exposure. | Source: https://eips.ethereum.org/EIPS/eip-2929
- Belief: `call{gas: x}` guarantees the callee gets `x`. | Reality: it is a maximum — with less available, the call proceeds with less. | Source: https://rareskills.io/post/eip-150-and-the-63-64-rule-for-gas
- Belief: You can exhaust the 1024-frame call stack to attack a contract. | Reality: dead since EIP-150; gas decays exponentially first. | Source: https://github.com/kadenzipfel/smart-contract-vulnerabilities/issues/36
- Belief: `eth_estimateGas` returns the gas the transaction will use. | Reality: it simulates against current state, which may differ at inclusion time. | Source: https://arkis.xyz/blog/the-pitfalls-of-eth-estimategas

### Practice ideas

- kind: measure — Write one function touching the same storage slot twice and another touching two slots once each; compare gas and explain via cold/warm. — Acceptance: measured numbers matching the cold/warm model.
- kind: measure — Send the same call with and without an access list; report the crossover point where the list starts paying. — Acceptance: measured table plus the break-even.
- kind: break — Build a contract that forwards a subcall's result but is exploitable by gas griefing; demonstrate the failure. — Acceptance: a test where the subcall fails and the outer call still succeeds, then a fix.
- kind: implement — Write a helper asserting a subcall received at least N gas, correct under the 63/64 rule. — Acceptance: tests proving it catches an under-forwarded call.

### Pays off in

`05 gas profiling` · `06 vulnerability classes` (gas griefing, DoS by gas) · `07 transaction UX` (estimation failure is a top user-facing error) · `08 MEV`.

### Gaps & uncertainties

- **The cold/warm constants must be re-verified.** See above.
- Post-Fusaka: whether the 60M gas limit changed any per-opcode pricing — not checked.
- Memory expansion formula not retrieved; EIP-7686's status unknown.

---

## 03.8 — Blobs & the data lane

> **Verification status: VERIFIED.**

### Concepts

- `blob` — A fixed-size data chunk of **4,096 field elements × 32 bytes = 128 KiB**, carried by a transaction but not accessible to the EVM. | requires: [tx-type-3-blob]
- `blob-not-in-evm` — Contracts cannot read blob contents, only the versioned hash. This is the whole point: cheap data availability, not cheap storage. | requires: [blob]
- `versioned-hash` — What the transaction actually carries: a versioned hash of the blob's KZG commitment. | requires: [blob, hash-function]
- `kzg-commitment` — A polynomial commitment compressing a degree-4,095 polynomial into a single elliptic-curve point, with fixed-size proofs. | requires: [commitment, blob]
- `blob-pruning` — Blobs are retained by consensus nodes for roughly **18 days**, then dropped. Data availability is a temporary guarantee, not permanent storage. | requires: [blob] | contrasts: [storage-slot]
- `separate-blob-fee-market` — Blob gas is priced independently of execution gas, so the two do not compete. | requires: [blob, separate-fee-markets]
- `data-availability-sampling` — Verifying data was published by checking a few random points, relying on the polynomial commitment for a probabilistic guarantee. | requires: [kzg-commitment]
- `peerdas` — EIP-7594: blob data split into **128 columns** distributed across nodes, each storing and serving a subset, so the network holds everything while no node carries the full load. | requires: [data-availability-sampling]
- `blob-throughput-scaling` — Because no node stores every blob, blob counts can rise without raising per-node bandwidth proportionally — the mechanism behind the post-Fusaka L2 cost collapse. | requires: [peerdas]

### Primary sources

- [EIP-7594: PeerDAS — Peer Data Availability Sampling](https://eips.ethereum.org/EIPS/eip-7594) — tier: spec — the normative PeerDAS text.
- [PeerDAS](https://ethereum.org/roadmap/fusaka/peerdas/) — tier: canonical-docs — ethereum.org's own explainer; gossip for distribution, discovery for custody, peer requests for sampling.
- [EIP-4844: Shard Blob Transactions](https://www.eip4844.com/) — tier: canonical-docs — the reference site.
- [EIP-7918: Blob base fee bounded by execution cost](https://eips.ethereum.org/EIPS/eip-7918) — tier: spec — **newer, and important**: bounds the blob base fee relative to execution cost. Research its status and effect.
- [PANDAS: peer-to-peer adaptive networking for DAS within Ethereum consensus timebounds](https://arxiv.org/pdf/2507.00824) — tier: primary-analysis — published: 2025-07 — the networking constraints DAS operates under.
- [Demystifying EIP-4844: how Ethereum blobs work](https://medium.com/@jayakrishnanashok/demystifying-eip-4844-how-ethereum-blobs-work-and-their-hidden-structure-7a674e602736) — tier: secondary — good structural walkthrough; verify against the EIP.

### Current state (Aug 2026)

- **Fusaka activated 3 December 2025** — the largest change to blob infrastructure since 4844 itself.
- PeerDAS is live; blob data is split into 128 columns with per-node custody subsets.

### Misconceptions

- Belief: Blobs are cheap contract storage. | Reality: the EVM cannot read blob data at all, and it is pruned after ~18 days. | Source: https://www.eip4844.com/
- Belief: A rollup "posts data to Ethereum" and it stays there. | Reality: availability is guaranteed for a window (~18 days) — long enough to challenge or reconstruct, not forever. | Source: https://ethereum.org/roadmap/fusaka/peerdas/
- Belief: Every node downloads every blob. | Reality: since PeerDAS, each node custodies a subset of 128 columns and samples the rest. | Source: https://eips.ethereum.org/EIPS/eip-7594
- Belief: DAS proves the data is available. | Reality: it gives a strong *probabilistic* guarantee from a few sampled points. | Source: https://ethereum.org/roadmap/fusaka/peerdas/

### Practice ideas

- kind: implement — Submit a type-3 blob transaction on a testnet and retrieve the versioned hash on-chain via the blob-hash opcode. — Acceptance: a contract that reads the versioned hash and proves it cannot read the blob body.
- kind: measure — Compare the cost of posting 100 KiB as calldata vs as a blob at current prices. — Acceptance: measured comparison with a written note on which to choose when.
- kind: read — Read EIP-7594's sampling section and explain what an honest node concludes after sampling k columns, and with what confidence. — Acceptance: written answer naming the probabilistic assumption.

### Visual opportunities

- One blob as 4,096 × 32-byte field elements, then as a polynomial, then as a single KZG commitment point. **The key visual of the whole track.**
- PeerDAS column custody: 128 columns across a node set, one node highlighted, showing what it stores vs samples.
- Blob fee market and execution fee market plotted together, showing independence.

### Gaps & uncertainties

- Current blob target/max per block post-Fusaka not verified numerically.
- EIP-7918 status and whether it shipped — unresolved.
- The `BLOBHASH` opcode number and semantics not retrieved.

---

## 02.1 — UTXO & Bitcoin (contrast module)

> **Verification status: VERIFIED.** Conceptual only — no Bitcoin tooling in this curriculum.
> Purpose: make Ethereum's account model feel like a *choice* rather than a given.

### Concepts

- `utxo` — An unspent transaction output: a discrete, indivisible chunk of value with a spending condition attached. | requires: []
- `utxo-inputs-outputs` — A transaction consumes whole UTXOs as inputs and creates new ones as outputs; "change" is an output back to yourself. | requires: [utxo]
- `locking-script` — `scriptPubKey`: the predicate attached to an output defining what it takes to spend it. | requires: [utxo]
- `unlocking-script` — `scriptSig`: what the spender supplies to satisfy the predicate, usually a signature. | requires: [locking-script]
- `script-vm` — Bitcoin Script: a simple, **non-Turing-complete**, stack-based interpreter. Validation concatenates unlocking and locking scripts and executes the result. | requires: [unlocking-script]
- `no-global-state` — Bitcoin has no account balances at the protocol level; a "balance" is a wallet-side sum over UTXOs you can spend. | requires: [utxo] | contrasts: [key-value-state]
- `utxo-parallelism` — Transactions touching disjoint UTXOs have no ordering dependency, which is what makes the model naturally parallel and shard-friendly. | requires: [no-global-state]
- `utxo-privacy` — A fresh address per output means no protocol-level identity accumulates. | requires: [no-global-state]
- `why-ethereum-chose-accounts` — Stateful contracts need mutable, addressable, long-lived state; expressing that over UTXOs is possible but painful. | requires: [no-global-state, account] | contrasts: [utxo]

### Primary sources

- [Deep dive into Bitcoin's UTXO model — structure, transactions, and Script](https://medium.com/@alex1923221/deep-dive-into-bitcoins-utxo-model-structure-transactions-and-script-explained-96d91f8d8026) — tier: secondary — thorough; verify against the Bitcoin developer guide before publishing.
- [Bitcoin P2PKH transaction locking and unlocking scripts](https://www.massmux.com/bitcoin-p2pkh-transaction-locking-and-unlocking-scripts/) — tier: secondary — the canonical worked example.
- [Programming on Bitcoin: a survey of layer 1 and layer 2 technologies](https://arxiv.org/pdf/2409.19622) — tier: primary-analysis — published: 2024-09 — the serious survey.
- [Debt representation in UTXO blockchains](https://arxiv.org/pdf/2102.00059) — tier: primary-analysis — published: 2021-02 — concrete on what is *hard* to express in UTXO. Directly supports the "why accounts" argument.
- [Bithoven: formal safety for expressive Bitcoin smart contracts](https://arxiv.org/pdf/2601.01436) — tier: primary-analysis — published: 2026-01 — recent, shows the frontier of UTXO expressiveness.

### Misconceptions

- Belief: Bitcoin has account balances. | Reality: no protocol-level balances; a wallet sums spendable UTXOs. | Source: https://medium.com/@alex1923221/deep-dive-into-bitcoins-utxo-model-structure-transactions-and-script-explained-96d91f8d8026
- Belief: UTXO is simply a more primitive account model. | Reality: a different trade-off — better parallelism and privacy, worse expressiveness for long-lived mutable state.
- Belief: Bitcoin Script can't do anything interesting. | Reality: non-Turing-complete but not trivial; the constraint is deliberate, bounding validation cost.

### Practice ideas

- kind: write — Model the same "escrow released by either party after a deadline" in UTXO terms and account terms; state what each makes easy and hard. — Acceptance: written comparison naming a specific difficulty in each.
- kind: read — Trace a real Bitcoin P2PKH transaction, identifying inputs, outputs, change and both scripts. — Acceptance: annotated breakdown of every field.

### Pays off in

`02 account model` (the contrast is the lesson) · `03 accounts & delegation` · `09 rollup anatomy` (some rollups revive UTXO-ish designs) · `12 Solana account model` (a third point on the design space).

---

## 02.5 — Proof of stake

> **Verification status: VERIFIED.**

### Concepts

- `validator` — A participant that deposits **32 ETH** into the staking contract to gain the right and duty to propose and attest. | requires: [byzantine-fault]
- `slot-and-epoch` — Time is slots of **12 seconds**, grouped into epochs of **32 slots**. | requires: [validator]
- `slot-timing` — Within a slot the proposer publishes in the first ~4 seconds; the attesting committee votes over the following ~8. This budget is set by real network propagation delay. | requires: [slot-and-epoch, propagation-latency]
- `attestation` — A committee member's signed vote on the head of the chain plus source and target checkpoints. | requires: [slot-timing]
- `committee` — The subset of validators assigned to attest in a given slot, so not everyone votes on everything. | requires: [attestation]
- `slashing` — Destruction of stake for provably malicious behaviour, as opposed to inactivity leaks for merely being offline. | requires: [validator] | contrasts: [inactivity-leak]
- `double-proposal-slashing` — Signing two different blocks for the same slot. | requires: [slashing]
- `double-vote-slashing` — Attesting to two different candidates for the same target. | requires: [slashing]
- `surround-vote-slashing` — An attestation whose source and target surround another of your own, effectively rewriting history. | requires: [slashing]
- `correlation-penalty` — The slashing amount scales with how many validators are slashed near the same time: ~1% of stake alone, up to **100%** in a mass event. Punishes coordinated failure far harder than isolated error. | requires: [slashing]
- `slashing-timeline` — Immediate penalty (up to 1 ETH) on day 1, correlation penalty at day 18, ejection at day 36. | requires: [correlation-penalty]

### Primary sources

- [Upgrading Ethereum — 2.8.7 Slashing](https://eth2book.info/latest/part2/incentives/slashing/) — tier: canonical-docs — **the** reference on slashing mechanics.
- [Proof-of-stake rewards and penalties](https://ethereum.org/developers/docs/consensus-mechanisms/pos/rewards-and-penalties/) — tier: canonical-docs.
- [Proof-of-stake (PoS)](https://ethereum.org/developers/docs/consensus-mechanisms/pos/) — tier: canonical-docs.
- [Ethereum validator lifecycle: a deep dive](https://mixbytes.io/blog/ethereum-validator-lifecycle-a-deep-dive) — tier: primary-analysis — MixBytes; the full state machine.
- [Ethereum PoS consensus layer: participation and decentralization](https://arxiv.org/pdf/2306.10777) — tier: primary-analysis — published: 2023-06 — empirical.
- [Bribers, bribers on the chain: trustless consensus manipulation through bribing contracts](https://arxiv.org/pdf/2509.17185) — tier: primary-analysis — published: 2025-09 — the incentive attack surface; pairs with F6.

### Misconceptions

- Belief: Being offline gets you slashed. | Reality: offline validators leak small inactivity penalties. Slashing requires *provable* malicious behaviour. | Source: https://eth2book.info/latest/part2/incentives/slashing/
- Belief: The slashing penalty is a fixed amount. | Reality: it is correlated — alone costs ~1%, part of a mass event can cost everything. | Source: https://eth2book.info/latest/part2/incentives/slashing/
- Belief: Every validator votes on every block. | Reality: committees are sampled per slot.
- Belief: The correlation penalty is a punishment for scale. | Reality: it is a *design* discouraging correlated infrastructure — the same client, host or operator failing together.

### Practice ideas

- kind: write — Explain why the correlation penalty exists and what behaviour it is designed to price. — Acceptance: written answer connecting it to client and hosting diversity.
- kind: read — Read the three slashing conditions and construct a concrete example of each. — Acceptance: three worked examples with source/target votes written out.
- kind: measure — Query a beacon API for a recent epoch: participation rate, and any slashings. — Acceptance: reported numbers with an interpretation.

### Visual opportunities

- One epoch as 32 slots, committees assigned, proposer highlighted, with the 4s/8s budget on a timeline.
- Surround voting drawn as nested source→target arcs — the only way this ever becomes intuitive.
- Correlation penalty as a curve: slashed-validator count against percentage lost.

---

## 02.6 — Finality, reorgs & block building

> **Verification status: VERIFIED.** Includes MEV-Boost/PBS, which belongs here because it is how
> ~90% of blocks are actually built today.

### Concepts

- `head-vs-justified-vs-finalized` — Three confidence levels, not one: current head (reorg-able), justified checkpoint, finalized checkpoint. | requires: [finality-is-a-spectrum]
- `reorg` — The canonical head changing, so transactions considered included become un-included. | requires: [head-vs-justified-vs-finalized]
- `reorg-depth-in-practice` — Ordinary reorgs are one or two slots; deep reorgs require a coordinated attack and are enormously expensive. | requires: [reorg, correlation-penalty]
- `confirmation-policy` — How many slots an application should wait before treating something as done — a product decision derived from value at risk. | requires: [reorg-depth-in-practice]
- `mev` — Value extractable by choosing what to include in a block and in what order. | requires: [mempool-is-not-a-queue]
- `pbs` — Proposer-builder separation: splitting *who builds* a block from *who proposes* it, so proposers need no MEV sophistication. | requires: [mev]
- `mev-boost` — The out-of-protocol PBS implementation used for roughly **90% of Ethereum blocks**. | requires: [pbs]
- `searcher-builder-relay-proposer` — The four roles: searchers find opportunities, builders assemble blocks, relays escrow and validate, proposers sign headers. | requires: [mev-boost]
- `relay-escrow` — The relay gives the proposer only the *header* of the winning block and holds the payload until the header is signed — preventing the proposer from stealing the contents. | requires: [searcher-builder-relay-proposer]
- `builder-centralization` — As of mid-2026 the top two builders produce ~73% of blocks, and the top four over 95%. The central argument for enshrining PBS in-protocol. | requires: [mev-boost]

### Primary sources

- [MEV-Boost in a nutshell](https://boost.flashbots.net/) — tier: canonical-docs — the reference explanation of the flow.
- [mev-boost](https://github.com/flashbots/mev-boost) — tier: canonical-docs — the implementation.
- [Proposer-builder separation](https://ethereum.org/roadmap/pbs/) — tier: canonical-docs — where in-protocol PBS is headed.
- [Aestus MEV-Boost relay](https://aestus.live/) — tier: canonical-docs — a neutral relay; as of Feb 2026, three years continuous, 650,000+ validators.
- [Proposer-builder separation (PBS) overview](https://www.emergentmind.com/topics/proposer-builder-separation-pbs) — tier: secondary — orientation.

### Current state (Aug 2026)

- ~**90% of blocks** are built through MEV-Boost.
- **Top two builders (Titan, Quasar) ≈ 73% of all blocks**; adding Eureka and BuilderNet exceeds **95%**.
  This is the single most important centralization statistic in the curriculum and directly motivates
  ePBS and FOCIL in Track 11.

### Misconceptions

- Belief: Validators build the blocks they propose. | Reality: ~90% outsource construction to builders via relays. | Source: https://boost.flashbots.net/
- Belief: Finality means a transaction can never be reversed. | Reality: reversal requires at least one third of stake being slashed — a price, not an impossibility. | Source: https://eth2book.info/latest/part2/incentives/slashing/
- Belief: "12 confirmations" is a meaningful Ethereum concept. | Reality: PoS has explicit justified and finalized states; confirmation counting is a Bitcoin-era habit.
- Belief: MEV is purely theft. | Reality: it includes arbitrage and liquidations that protocols *depend on*; the problem is distribution and centralization, not existence.

### Practice ideas

- kind: read — Compare a block as seen on a relay against the same block on-chain; identify the builder and the proposer payment. — Acceptance: written trace of the value flow.
- kind: write — Choose a confirmation policy for three products (a game, a $10 payment, a $10M settlement) and defend each. — Acceptance: three policies with reasoning tied to reversal cost.
- kind: measure — Pull builder market share over the last 1,000 blocks and compare with the figures above. — Acceptance: measured distribution and a note on whether concentration moved.

### Visual opportunities

- The four-role MEV-Boost flow with the escrow step highlighted — the trust assumption people miss.
- Head / justified / finalized on one timeline, with reversal cost annotated at each stage.
- Builder market share as a treemap; the concentration lands instantly.

### Gaps & uncertainties

- Whether ePBS shipped in Glamsterdam or is still pending — must verify for Track 11.
- Current relay set and their trust properties not enumerated.
