# Tracks 10–12 — Cryptography & ZK · Protocol Internals · Alt VMs

> Source-verified curriculum research. Compiled 25 Aug 2026.
> Raw material for lesson authoring — NOT lesson prose.
> Source tiers: `spec` (normative) · `canonical-docs` (project's own docs/repo) · `primary-analysis` (researcher/core-dev writing) · `secondary` (press, aggregators, community).

**Status: IN PROGRESS — modules appended as completed.**


---

## 10.1 — zkVMs (the entry point to Track 10)

> **Verification status: VERIFIED.** Confirms the plan's "teach ZK backwards, zkVM first" decision.

### Concepts

- `zkvm` — Prove that a program executed correctly, without hand-writing a circuit. Write ordinary Rust, get a proof. | requires: [commitment]
- `guest-program` — The code whose execution is proven; compiled to RISC-V for both SP1 and RISC Zero. | requires: [zkvm]
- `proof-vs-execution-cost` — Proving costs orders of magnitude more than executing; the question is always whether verification savings justify it. | requires: [zkvm]
- `onchain-verification` — The proof is verified by an L1 contract, which is what makes off-chain computation trustworthy on-chain. | requires: [zkvm]
- `sp1` — Succinct's zkVM, built on **Plonky3**. Audited by Veridise, Cantina, Zellic and KALOS. | requires: [zkvm]
- `sp1-hypercube` — SP1 V6's multilinear proof system; proves **over 93% of Ethereum blocks in under 12 seconds** — real-time block proving. | requires: [sp1]
- `risc-zero` — An alternative zkVM using its own STARK construction, with the Bonsai proving service (~1M RISC-V cycles/sec). | requires: [zkvm] | contrasts: [sp1]
- `cpu-vs-gpu-proving` — SP1 is fast on CPU; RISC Zero effectively needs GPU. This drives the cost gap far more than raw algorithmic difference. | requires: [sp1, risc-zero]
- `circuits-are-the-descent` — Circom/Halo2 circuits are what you descend into when you need to know *why* the proof is small — not where you start in 2026. | requires: [zkvm]

### Primary sources

- [SP1](https://github.com/succinctlabs/sp1) — tier: canonical-docs — the implementation.
- [Succinct docs — introduction](https://docs.succinct.xyz/docs/sp1/introduction) — tier: canonical-docs.
- [SP1 Hypercube: proving Ethereum in real-time](https://blog.succinct.xyz/sp1-hypercube/) — tier: canonical-docs, **vendor** — the >93%-in-12s claim. Vendor-published; treat the number as a claim.
- [Introducing SP1](https://blog.succinct.xyz/introducing-sp1/) — tier: canonical-docs, vendor — design rationale.
- [RISC Zero rolls out production-ready zkVM](https://www.theblock.co/post/300554/risc-zero-rolls-out-production-ready-zkvm) — tier: secondary.
- [Comparative analysis of SP1 and RISC Zero](https://medium.com/@gwrx2005/comparative-analysis-of-sp1-and-risc-zero-zero-knowledge-virtual-machines-4abf806daa70) — tier: secondary — independent-ish comparison.

### Current state (Aug 2026)

- **Cost gap is roughly 100×:** RISC Zero ≈ **$0.10** per mid-sized proof, SP1 ≈ **$0.001**.
- SP1 reports faster proving on Fibonacci and SHA-256 benchmarks; RISC Zero reports lower memory use
  on large programs.
- **Benchmarks are contested.** The honest guidance — and a good lesson in itself — is to run *your*
  guest program on both rather than trusting published comparisons.

### Misconceptions

- Belief: Using ZK means learning circuit programming. | Reality: in 2026 the mainstream path is a zkVM taking ordinary Rust. | Source: https://docs.succinct.xyz/docs/sp1/introduction
- Belief: ZK proofs make computation cheaper. | Reality: proving is far *more* expensive than executing; the saving is in **verification**, paid once on-chain for arbitrarily large off-chain work.
- Belief: Zero-knowledge means private. | Reality: in zkVMs the dominant use is **succinctness**, not privacy. Most deployments prove public computations.
- Belief: Published zkVM benchmarks settle the choice. | Reality: they vary by workload, and the CPU-vs-GPU requirement often dominates real cost.

### Practice ideas

- kind: implement — Write a Rust guest program that verifies a Merkle proof, prove it with SP1, and verify the proof on-chain. — Acceptance: an on-chain verifier accepting a valid proof and rejecting a tampered one.
- kind: measure — Prove the same program on SP1 and RISC Zero; record wall-clock, memory and cost. — Acceptance: measured table plus a written recommendation for that workload.
- kind: write — For a given feature, decide whether a zkVM is justified over simply executing on-chain. — Acceptance: written analysis with the break-even reasoning.

### Visual opportunities

- Prover vs verifier cost as an asymmetry diagram — the whole value proposition in one image.
- The zkVM pipeline: Rust → RISC-V → trace → proof → on-chain verifier.

---

## 11.x — Protocol internals: the upgrade pipeline

> **Verification status: VERIFIED. Contains two corrections to the plan document.**

### Current state (Aug 2026) — CORRECTIONS

- **Glamsterdam has NOT shipped.** It reached its final devnet stage in **mid-June 2026** with
  multi-client devnets running the full EIP slate, and is **targeted for H2 2026 with no mainnet date
  locked**. The plan document said "H1 2026" — wrong.
- **FOCIL (EIP-7805) was DECLINED for inclusion in Glamsterdam.** Teams warned that combining ePBS and
  FOCIL in one upgrade would create too much untested interaction at mainnet scale. FOCIL is now the
  headliner for **Hegotá**, the upgrade after Glamsterdam. The plan listed FOCIL among Glamsterdam's
  contents — wrong.
- **Glamsterdam's two headline EIPs:** EIP-7732 (enshrined PBS) and EIP-7928 (Block-Level Access Lists).

### Concepts

- `enshrined-pbs` — EIP-7732: moves proposer-builder coordination from out-of-protocol relays into the protocol itself. | requires: [pbs, mev-boost]
- `why-enshrine-pbs` — MEV-Boost relays are trusted intermediaries and builders are heavily concentrated; enshrining removes the relay trust assumption. | requires: [enshrined-pbs, builder-centralization]
- `block-level-access-list` — EIP-7928: declares all state a block will touch upfront, enabling parallel transaction execution on the L1. | requires: [access-list]
- `bal-enables-parallelism` — Knowing every read and write in advance lets a client schedule non-conflicting transactions concurrently. | requires: [block-level-access-list] | contrasts: [sealevel]
- `focil` — EIP-7805: fork-choice enforced inclusion lists, a censorship-resistance mechanism. **Deferred to Hegotá.** | requires: [enshrined-pbs]
- `upgrade-scoping` — EIPs get cut from upgrades to limit untested interactions. FOCIL's removal is a live case study in shipping discipline. | requires: [focil]

### Primary sources

- [Ethereum Glamsterdam upgrade: what's coming in H1 2026](https://blog.quicknode.com/ethereum-glamsterdam-upgrade-whats-coming-in-h1-2026/) — tier: secondary — **note the title is now outdated**; content is useful, timing is not.
- [Glamsterdam: what changes for infrastructure](https://chainstack.com/ethereum-glamsterdam-upgrade/) — tier: secondary — the client-operator view.
- [Network upgrades](https://eipsinsight.com/upgrade) — tier: primary-analysis — **the live tracker.** Best re-verify target for this module.
- [Ethereum Glamsterdam: upgrade overview and EIPs explained](https://everstake.one/resources/blog/ethereum-glamsterdam-upgrade-explained) — tier: secondary.

### Misconceptions

- Belief: Glamsterdam shipped in H1 2026. | Reality: final devnet mid-June 2026, targeted H2 2026, no mainnet date locked. | Source: https://eipsinsight.com/upgrade
- Belief: FOCIL is part of Glamsterdam. | Reality: declined for inclusion, moved to Hegotá.
- Belief: An EIP with a number and a spec is going to ship. | Reality: EIPs are cut regularly — FOCIL is the current example.

### Gaps & uncertainties

- **This module is `volatility: hot`.** Anything written here may be wrong within weeks.
- Whether Glamsterdam has a mainnet date now — must be re-checked at authoring time.

---

## 12.1 — Solana account model (the contrast that justifies Track 12)

> **Verification status: VERIFIED.**

### Concepts

- `solana-account` — The atomic unit of state: a 32-byte ed25519 address, usually base58-encoded. | requires: [account]
- `state-externalized` — Where Ethereum keeps storage *inside* a contract, Solana makes each piece of state its own addressable account. **The core contrast.** | requires: [solana-account] | contrasts: [storage-slot]
- `program-is-stateless` — Solana programs hold no state; all state is passed in as accounts. | requires: [state-externalized] | contrasts: [contract-account]
- `pda` — A Program Derived Address: an address a program deterministically owns and controls, used for vaults, metadata and per-user state. | requires: [program-is-stateless]
- `rent-exemption` — Storing data requires a refundable lamport deposit sized to the data (up to 10 MiB); rent-exempt accounts are never purged. | requires: [solana-account]
- `declared-account-access` — Every transaction must declare in advance which accounts it reads and writes. | requires: [state-externalized]
- `sealevel` — The parallel execution engine: transactions touching disjoint accounts run simultaneously across cores. | requires: [declared-account-access]
- `parallelism-requires-declaration` — Solana gets parallelism by making developers declare access upfront — precisely what EIP-7928 brings to Ethereum at block level. | requires: [sealevel, block-level-access-list]

### Primary sources

- [Sealevel — parallel processing thousands of smart contracts](https://solana.com/news/sealevel---parallel-processing-thousands-of-smart-contracts) — tier: canonical-docs — the original design note.
- [Solana development for EVM developers](https://www.quicknode.com/guides/solana-development/getting-started/solana-development-for-evm-developers) — tier: canonical-docs — **exactly the right framing for this learner.**
- [Solana: architecture, account model and transactions](https://chainstack.com/solana-architecture-account-model-and-transactions/) — tier: primary-analysis.
- [Accounts, Sealevel and the SPL](https://docs.gridplus.io/blockchain-basics/solana/accounts-sealevel-and-the-spl) — tier: primary-analysis.

### Misconceptions

- Belief: A Solana program is a smart contract with a different syntax. | Reality: programs are stateless; state lives in accounts passed in per call. Rewriting a Solidity contract one-to-one produces bad Solana code.
- Belief: Solana is fast because of better hardware or lower decentralisation. | Reality: the architectural reason is declared account access enabling parallel scheduling. | Source: https://solana.com/news/sealevel---parallel-processing-thousands-of-smart-contracts
- Belief: Rent is an ongoing fee. | Reality: rent-exemption is a refundable deposit sized to data; exempt accounts never lose lamports.
- Belief: Ethereum and Solana made opposite choices with no convergence. | Reality: EIP-7928 brings declared access to Ethereum at block level — the same insight arriving by a different route.

### Practice ideas

- kind: write — Take a Solidity contract with a mapping of per-user balances and redesign it for Solana's account model. — Acceptance: written design naming which accounts exist and which are PDAs.
- kind: implement — Write an Anchor program with a PDA-backed per-user counter. — Acceptance: tests proving the PDA derives deterministically and only the program can write it.
- kind: read — Read the Sealevel note and explain what makes two transactions conflict. — Acceptance: written answer with a worked example of a conflicting and non-conflicting pair.

### Visual opportunities

- Same application modelled twice: Ethereum storage slots inside one contract vs Solana accounts outside a stateless program. **The key visual of Track 12.**
- Sealevel scheduling: transactions as blocks on a timeline, non-conflicting ones stacked in parallel.

### Gaps & uncertainties

- Anchor and Pinocchio current versions not established.
- Token-2022 extensions not researched.
