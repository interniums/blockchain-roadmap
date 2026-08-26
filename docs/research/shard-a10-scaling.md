# Shard A10 — Track 09: Scaling & L2 Remainder

Research shard for modules 09.2 through 09.9. Raw curriculum material, not lesson prose.
Compiled 25 August 2026.

## Status log
- [x] 09.2
- [x] 09.3
- [x] 09.4
- [x] 09.5
- [x] 09.6
- [x] 09.7
- [x] 09.8
- [x] 09.9

## 09.2 — Sequencers: centralisation, soft confirmations, revenue, decentralisation attempts

> **Verification status: PARTLY VERIFIED.** The mechanism (soft vs hard finality, feed, delayed inbox)
> is verified against Arbitrum's canonical docs. The revenue numbers are NOT verified — see Gaps.

### Concepts

- `sequencer` — The party that receives L2 transactions, chooses their order, and publishes the resulting ordering; on every major L2 in 2026 this is one operator-run process. | requires: [rollup]
- `sequencer-feed` — The real-time stream the sequencer publishes its accepted ordering on, before anything touches L1; this is what wallets and RPCs read to show you a "confirmed" transaction. | requires: [sequencer]
- `soft-confirmation` — A receipt emitted by the sequencer from its own feed, backed only by the sequencer's promise not to reorder. | requires: [sequencer-feed] | contrasts: [hard-finality]
- `hard-finality` — The point at which the batch containing your transaction is posted to and finalised on L1, inheriting L1 consensus; only then is the ordering irreversible. | requires: [soft-confirmation, rollup]
- `sequencer-worst-case-is-bounded` — A malicious or buggy sequencer can reorder, delay, or censor, but cannot forge your signature or commit an invalid state transition, because the proof system and L1 contracts bound it. | requires: [soft-confirmation, forced-inclusion]
- `sequencer-liveness-risk` — If the single sequencer stops, the chain stops producing blocks; users are not robbed but the product is down. | requires: [sequencer] | contrasts: [sequencer-worst-case-is-bounded]
- `sequencer-mev` — Because ordering is unilateral, the sequencer holds the entire MEV of its chain and does not have to auction it. | requires: [sequencer]
- `l2-gross-vs-net-revenue` — L2 gross revenue is user gas fees; net revenue is that minus the L1 cost of posting data and proofs, and the second number is the business. | requires: [sequencer, blob]
- `blob-collapsed-l2-margins` — Once blobs made data posting cheap and then abundant, per-transaction margin fell and L2 economics became a volume game. | requires: [l2-gross-vs-net-revenue, blob]
- `shared-sequencer` — An external sequencing network several rollups outsource ordering to, buying cross-rollup atomicity and shared liveness at the cost of a new dependency. | requires: [sequencer] | contrasts: [based-sequencing]
- `based-sequencing` — Let the L1 proposer/builder sequence the rollup directly, so the rollup inherits L1 liveness and censorship resistance instead of running its own sequencer set. | requires: [sequencer] | contrasts: [shared-sequencer]
- `decentralised-sequencer-does-not-fix-upgrade-keys` — Rotating sequencing to a committee changes liveness and censorship properties only; it does not touch who can upgrade the bridge contracts. | requires: [shared-sequencer, upgrade-key-risk]

### Primary sources

- [The Sequencer and Censorship Resistance](https://docs.arbitrum.io/how-arbitrum-works/deep-dives/sequencer) — tier: canonical-docs — published: 2026 — the clearest statement of what a sequencer can and cannot do to you; explicitly bounds the worst case.
- [Overview: The Lifecycle of an Arbitrum Transaction](https://docs.arbitrum.io/tx-lifecycle) — tier: canonical-docs — published: 2026 — soft finality vs hard finality with the actual stage names.
- [How to read the sequencer feed](https://docs.arbitrum.io/run-arbitrum-node/sequencer/read-sequencer-feed) — tier: canonical-docs — published: 2026 — the feed is a real thing you can connect to; makes soft confirmation concrete in a lab.
- [How to configure Delayed Inbox finality](https://docs.arbitrum.io/launch-arbitrum-chain/chain-config/sequencer/chain-finality) — tier: canonical-docs — published: 2026 — why Arbitrum One waits for L1 finality before ingesting L1 messages, and the reorg risk that setting trades against.
- [Inside Arbitrum Nitro](https://docs.arbitrum.io/how-arbitrum-works/inside-arbitrum-nitro) — tier: canonical-docs — published: 2026 — sequencer inside the whole Nitro pipeline.
- [The Espresso Sequencer](https://hackmd.io/@EspressoSystems/EspressoSequencer) — tier: primary-analysis (vendor) — published: 2023-onward — HotShot BFT design doc; treat as vendor material.
- [Why Layer 2 Sequencers Are Still Centralized in 2026](https://orochi.network/blog/Deep-Dive-into-Layer-2-Sequencers-the-Centralization-Challenge) — tier: secondary (vendor blog) — published: 2026 — useful framing of *why* decentralisation keeps slipping; do not cite its numbers.
- [Ethereum L2 Economics 2026: Arbitrum, Base, Optimism Revenue](https://www.vaasblock.com/news/ethereum-l2-economics-revenue-arbitrum-base-optimism-2026/) — tier: secondary — published: 2026 — revenue framing only; numbers unverified.

### Current state (Aug 2026)

- **Every major L2 still runs a single operator-controlled sequencer.** Offchain Labs runs Arbitrum One and Nova; Coinbase runs Base; OP Labs runs OP Mainnet. This has not changed despite years of roadmaps.
- **Astria shut down in December 2025** (reported final block 15,360,577), after raising ~$18M. Shared sequencing consolidated rather than expanded.
- **Espresso is the surviving shared-sequencer network** (Mainnet 0, HotShot BFT). The Superchain's shared-sequencing plan points at Espresso alongside native interop, with rollout talked about for 2026 — not confirmed shipped.
- **Based sequencing remains mostly research + small chains.** Taiko is the usual production example; no top-5 L2 is based-sequenced.
- **Commonly taught and now wrong:** "sequencer decentralisation is coming next year." It has been next year since 2023. Teach the current trust assumption as the steady state, not a transitional artefact.
- **Also now wrong:** "the sequencer can steal your funds." It cannot — it can only reorder, delay, or censor. Overstating this makes students discount the real risks (liveness, MEV, upgrade keys).
- Post-4844 and post-Fusaka, L1 data cost is no longer the dominant L2 cost line for most chains, which changed the sequencer business from "arbitrage the data cost" to "win transaction volume".

### Misconceptions

- Belief: When my wallet shows the transaction confirmed on an L2, it is final. | Reality: that is a soft confirmation from the sequencer's own feed, with no cryptographic backing; hard finality arrives when the batch finalises on L1, typically minutes later. | Why: L2 UX deliberately hides the difference because the sequencer has, so far, always behaved. | Source: https://docs.arbitrum.io/tx-lifecycle
- Belief: A centralised sequencer means the operator can take my money. | Reality: it can reorder, delay, or censor; it cannot forge transactions or finalise an invalid state, because the L1 contracts and proof system reject that. | Why: "centralised" gets flattened into "custodial". | Source: https://docs.arbitrum.io/how-arbitrum-works/deep-dives/sequencer
- Belief: Shared sequencers are the obvious fix and are being adopted. | Reality: Astria, one of the two leading efforts, shut down in Dec 2025; adoption is the bottleneck, not the technology. | Why: roadmap documents outnumber deployments. | Source: https://orochi.network/blog/Deep-Dive-into-Layer-2-Sequencers-the-Centralization-Challenge
- Belief: Decentralising the sequencer would make an L2 trustless. | Reality: it addresses liveness and censorship only; upgrade keys are a separate and usually larger risk. | Why: the two get bundled under "decentralisation". | Source: https://l2beat.com/stages
- Belief: L2s print money because gas is cheap for users and blobs are cheap for them. | Reality: net revenue is gross fees minus L1 posting cost, and cheap blobs cut what L2s can charge as much as what they pay. | Why: gross revenue charts circulate more than net.

### Practice ideas

- kind: measure — Connect to a public Arbitrum sequencer feed and, for a transaction you send, timestamp (a) feed appearance, (b) batch posted to L1, (c) L1 finalisation. — Acceptance: a three-row table of real wall-clock deltas from one transaction, with the soft/hard boundary labelled.
- kind: implement — Write a TypeScript watcher using viem that subscribes to an L2 RPC and to L1, and prints, for each L2 block, whether the batch containing it has been posted to L1 yet. — Acceptance: the tool distinguishes "sequencer says yes" from "L1 says yes" for live blocks.
- kind: break — Point an app at an L2 RPC while simulating sequencer downtime (kill the RPC / use a chain in outage). Show what your UI does. — Acceptance: a written list of every place the UI silently assumed the sequencer was live.
- kind: write — For a payments product on an L2, write the policy for when you credit a user: on soft confirmation, on batch posting, or on L1 finality — with the loss scenario for each. — Acceptance: one chosen policy with the accepted loss stated in money terms.
- kind: read — Read the Arbitrum sequencer doc and list every capability it explicitly denies the sequencer. — Acceptance: at least four denied capabilities quoted with the mechanism that denies each.

### Visual opportunities

- **Timeline of one transaction** across: submitted → in sequencer feed (soft) → in a batch posted to L1 → L1 finalised (hard), with the trust assumption annotated on each segment. This is the single most valuable diagram in the module.
- **What a malicious sequencer can and cannot do** — two columns, with the blocking mechanism drawn next to each "cannot".
- **Three sequencing models side by side**: single operator, shared sequencer network, based (L1 proposer sequences) — showing where the ordering decision physically happens.
- **Net revenue waterfall**: user fees in, L1 blob/calldata cost out, proof cost out, remainder = operator margin.

### Gaps & uncertainties

- **Sequencer revenue figures are UNVERIFIED.** One secondary source gives "$150–250M/year across top chains"; I could not confirm this against a primary source (L2BEAT, Dune, or company reporting) and it should not be published as fact. If teaching numbers, pull live from L2BEAT/Growthepie at authoring time.
- The claim that 4844 cut data posting cost "by ~90%" is widely repeated but the figure varies by chain and period; do not present a single number.
- Astria's shutdown date and final block height come from one secondary source; the shutdown itself is well reported, the block number is not independently confirmed here.
- Espresso's exact production status in Aug 2026 (which chains, if any, are live on it in production vs testnet) is UNRESOLVED.
- Arbitrum docs state the sequencer on One/Nova ingests L1 messages only after L1 finality; I did not verify whether this is still the default configuration in 2026 or how other chains configure it. Treat as chain-specific.
- Superchain shared sequencing "expected 2026" is a plan, not a shipped fact.

## 09.3 — Data availability: what it guarantees, blobs vs alt-DA, rollup vs validium

> **Verification status: VERIFIED on definitions and the rollup/validium boundary** (L2BEAT glossary,
> Celestia docs). **NOT verified on comparative throughput, cost, or finality numbers** — see Gaps.

### Concepts

- `data-availability` — The guarantee that the data behind a state commitment was actually published, so that anyone who wants to can download it and recompute the state. | requires: [rollup]
- `da-is-not-storage` — DA is a statement about publication at the time of the block, not a promise that anyone will still serve you the bytes years later. | requires: [data-availability] | contrasts: [retrievability]
- `retrievability` — The separate, weaker property that some node still has and will serve historical data; secured by a 1-of-N honest-archiver assumption, not by consensus. | requires: [da-is-not-storage]
- `da-does-not-imply-correctness` — Publishing the data proves nothing about whether the state transition was valid; that is the proof system's job. DA and proofs are orthogonal guarantees. | requires: [data-availability] | contrasts: [validity-rollup, optimistic-rollup]
- `data-availability-sampling` — Light nodes randomly sample small pieces of an erasure-coded block; enough successful samples make withholding statistically impossible without downloading the block. | requires: [data-availability]
- `erasure-coding-for-da` — Data is expanded with redundancy so that any sufficiently large subset reconstructs the whole, which is what makes sampling meaningful. | requires: [data-availability-sampling]
- `ethereum-blob-da` — Ethereum's native DA: blobs carry rollup data, are verified by consensus, and are pruned after ~18 days, which is enough for the challenge/proof window. | requires: [blob, data-availability]
- `alt-da` — Posting rollup data to an external DA network (Celestia, EigenDA, Avail) instead of Ethereum, trading cost for an added trust assumption. | requires: [data-availability] | contrasts: [ethereum-blob-da]
- `rollup-vs-validium` — If the data lives on a permissionless L1 the system is a rollup; if it lives anywhere else it is a validium (with validity proofs) or an optimium (with fraud proofs). | requires: [alt-da, ethereum-blob-da] | contrasts: [rollup]
- `validium-withholding-risk` — With a valid proof but withheld data, the state is provably correct yet nobody can compute their own balance to construct a withdrawal; funds can be frozen without anyone being able to prove misbehaviour on L1. | requires: [rollup-vs-validium, escape-hatch]
- `data-availability-committee` — A fixed member set signing "we have the data"; an on-chain verifier checks a signature threshold before accepting the commitment, so the security is the honesty of that committee. | requires: [alt-da]
- `da-bridge` — The L1 contract that attests an external DA layer's data was published; without one, the rollup's L1 contracts are trusting an off-chain claim entirely. | requires: [alt-da]
- `security-is-the-weaker-link` — A chain's real security is the minimum of its proof system and its DA layer, not the maximum; a validity proof over withheld data buys you nothing operationally. | requires: [validium-withholding-risk, proofs-do-not-imply-trustless]

### Primary sources

- [Glossary — L2BEAT](https://l2beat.com/glossary) — tier: canonical-docs — published: live — the authoritative rollup / validium / optimium / DAC definitions used by the whole industry.
- [Data Availability — L2BEAT](https://l2beat.com/scaling/data-availability) — tier: canonical-docs — published: live — which chain uses which DA layer, per-project; the re-verify target.
- [Data Availability Summary — L2BEAT](https://l2beat.com/data-availability/summary) — tier: canonical-docs — published: live — DA layers with their bridge risk classifications.
- [Celestia — L2BEAT (no bridge)](https://l2beat.com/data-availability/projects/celestia/no-bridge) — tier: canonical-docs — published: live — makes the DA-bridge-vs-no-bridge distinction concrete.
- [Modular Data Availability Layer — Celestia Docs](https://docs.celestia.org/learn/celestia-101/data-availability/) — tier: canonical-docs — published: 2026 — DAS and light-node mechanics from the source.
- [Data availability FAQ — Celestia docs](https://docs.celestia.org/learn/celestia-101/data-availability-faq/) — tier: canonical-docs — published: 2026 — explicitly separates availability from retrievability.
- [A brief data availability and retrievability FAQ](https://hackmd.io/@alexbeckett/a-brief-data-availability-and-retrievability-faq) — tier: primary-analysis — the clearest write-up of the 1-of-N archiver assumption.
- [celestiaorg/celestia-node](https://github.com/celestiaorg/celestia-node) — tier: canonical-docs — published: live — run a light node and actually sample.
- [Choosing Your Data Availability Layer — Celestia, Avail, and EigenDA Compared](https://www.eclipselabs.io/blogs/choosing-your-data-availability-layer-celestia-avail-eigenda-compared) — tier: secondary (vendor) — published: 2025 — comparison framing; **vendor**, numbers unverified.
- [Data Availability using Celestia — AltLayer](https://docs.altlayer.io/altlayer-documentation/external-integrations/data-availability-da-using-celestia) — tier: canonical-docs (vendor) — how a rollup framework actually wires alt-DA.

### Current state (Aug 2026)

- **Blobs are the default and Fusaka made them plentiful.** PeerDAS (EIP-7594) splits blob data into 128 columns so validators sample rather than download everything, which is what let the blob count rise without raising the node requirement. Alt-DA's cost argument is weaker than it was in 2024.
- **Retention is still ~18 days.** That is deliberately just longer than the challenge window; it is not archival storage.
- **The three alt-DA layers have different trust shapes**, and this is the teaching point, not their TPS:
  - Celestia — its own PoS chain + DAS; longest-standing; you trust Celestia's validator set.
  - EigenDA — restaked ETH via EigenLayer; the pitch is Ethereum-grade economic security, but slashing enforcement maturity has been repeatedly questioned.
  - Avail — its own chain, KZG commitments, light-client focus, positioned at validiums.
- **Commonly taught and now wrong:** "DA layers are interchangeable, pick on price." L2BEAT classifies them by *bridge* risk — whether an L1 contract can verify the attestation at all — and that difference dominates price.
- **Also now wrong:** "a validium is just a cheaper rollup." L2BEAT will not call it a rollup, and the withholding failure mode is qualitatively different.
- The OP Stack ships an alt-DA mode, so "is this chain a rollup?" is now a per-deployment configuration question, not a per-stack one.

### Misconceptions

- Belief: Data availability means the data is stored forever. | Reality: it means the data was published and verifiable at the time; blobs are pruned after ~18 days and long-term access rests on a 1-of-N honest-archiver assumption. | Why: "available" reads like "hosted". | Source: https://docs.celestia.org/learn/celestia-101/data-availability-faq/
- Belief: If the data is available, the state is correct. | Reality: DA and validity are orthogonal — DA lets someone check, proofs are what actually check. | Why: both get filed under "rollup security". | Source: https://l2beat.com/glossary
- Belief: A validium with ZK proofs is safer than an optimistic rollup because it has real proofs. | Reality: if the validium's data is withheld, the proof is valid and your funds are still unreachable, because you cannot construct the withdrawal without the state. | Why: proof-type is taught as the security axis. | Source: https://l2beat.com/glossary
- Belief: Using Celestia/EigenDA/Avail means the chain is still secured by Ethereum. | Reality: security becomes the weaker of the proof system and the DA layer; L2BEAT stops calling such a chain a rollup. | Why: marketing says "Ethereum-aligned". | Source: https://l2beat.com/scaling/data-availability
- Belief: Data availability sampling means every light node has the data. | Reality: sampling proves the data *could* be reconstructed by the network; no individual sampler holds it. | Why: sampling is confused with downloading. | Source: https://celestia.org/glossary/data-availability-sampling/

### Practice ideas

- kind: implement — Fetch a blob-carrying transaction on Ethereum via a public RPC, pull the versioned hashes, and then fetch the blob sidecar from a beacon API; then try the same for a blob older than the retention window. — Acceptance: one blob successfully retrieved and one demonstrably unavailable, with the error captured.
- kind: read — Take three L2BEAT project pages with different DA setups (Ethereum blobs, DAC, external DA layer) and write the exact failure that freezes user funds in each. — Acceptance: three distinct failure narratives, each naming the party who would have to misbehave.
- kind: measure — For one alt-DA chain and one blob-posting chain, measure the per-transaction DA cost from public data. — Acceptance: a cost-per-transaction comparison with the date and the caveat that blob base fee moves.
- kind: run — Run a Celestia light node and observe it sampling; record how many samples it takes and what it stores. — Acceptance: node syncs and the student can state what the node does and does not have locally.
- kind: write — Write the one-paragraph risk disclosure distinguishing "rollup" from "validium" that you would put in a product's docs. — Acceptance: a non-technical reader can state who can freeze their funds.

### Visual opportunities

- **The DA decision tree**: where does the data go? → permissionless L1 = rollup; DAC = validium/optimium; external DA chain with bridge = in between. Terminates in L2BEAT's actual labels.
- **The withholding attack, frame by frame**: valid proof accepted on L1, data never published, user tries to compute their balance and cannot. This is the diagram that makes validium risk land.
- **DA vs retrievability on a timeline**: publication moment (consensus-secured) → retention window → archival era (1-of-N).
- **Sampling animation**: erasure-coded square, a light node's random samples, and the probability of undetected withholding falling with sample count.

### Gaps & uncertainties

- **All throughput, cost, and finality numbers for Celestia / EigenDA / Avail are UNVERIFIED.** One secondary source cites Celestia finality "~10 min"; I did not confirm this against Celestia's own docs and it should not be published. Comparative TPS/MB-per-block claims come from vendor blogs.
- **EigenDA slashing status is contested.** Sources say economic security "has not been operating so far"; whether EigenDA slashing is live and enforced as of Aug 2026 is UNRESOLVED and should be checked before teaching either way.
- Current blob count per block and the post-Fusaka target/max were not re-verified in this module; the shard baseline covers PeerDAS mechanics but not the live blob parameter values.
- Whether any top-10 L2 moved from Ethereum blobs to alt-DA (or back) in the last 18 months is not verified here — check L2BEAT's DA page live.
- Avail's mainnet maturity and actual production validium users in 2026 are unverified.

## 09.4 — Blobs & PeerDAS from the rollup side: posting batches, blob fees, post-Fusaka economics

> **Verification status: VERIFIED on blob parameters and BPO schedule** (EIP-7892, EIP-8135, EF blog).
> **NOT verified on per-transaction fee figures or utilisation percentages** — see Gaps.

### Concepts

- `batcher` — The rollup component that collects sequenced L2 transactions, compresses them, and submits them to L1 as a batch; separate from the sequencer that ordered them. | requires: [sequencer, rollup]
- `batch-vs-state-commitment` — Posting the data (batch) and posting the claimed resulting state root are two different L1 submissions with different cadences and different failure modes. | requires: [batcher]
- `blob-transaction` — Transaction type 0x03 carrying blob sidecars, referenced on-chain only by versioned hashes of KZG commitments; the EVM can never read blob bytes. | requires: [blob, batcher]
- `blob-gas-market` — Blobs price on their own EIP-1559-style market, independent of execution gas, with its own base fee that can spike while execution gas is calm (and vice versa). | requires: [blob-transaction]
- `dual-market-batching-decision` — A batcher must continuously compare the cost of a blob (type 3) submission against plain calldata (type 2) and pick the cheaper path per batch. | requires: [blob-gas-market]
- `blob-base-fee-floor` — For most of 2024–2025 blob demand sat below target so the blob base fee pinned at its 1 wei floor, making DA effectively free; that regime ends the moment demand exceeds target. | requires: [blob-gas-market]
- `blob-target-vs-max` — Each block has a blob target and a higher max; the base fee rises when usage is above target and falls when below, so the target is the price-setting parameter. | requires: [blob-gas-market]
- `bpo-fork` — EIP-7892 "blob parameter only" forks: config-only hardforks that change blob target/max and the fee update fraction, decoupled from named upgrades so blob capacity can be raised on its own schedule. | requires: [blob-target-vs-max]
- `peerdas-enables-more-blobs` — PeerDAS lets validators sample columns instead of downloading every blob, which is what makes raising the blob count safe without raising node bandwidth linearly. | requires: [blob, data-availability-sampling]
- `batch-compression` — Rollups compress batches (Brotli/zlib, plus domain-specific encoding) before posting, so the effective L1 cost per L2 transaction is far below the raw byte cost. | requires: [batcher]
- `batch-posting-cadence-tradeoff` — Posting more often shortens time-to-hard-finality and shrinks reorg exposure but wastes blob space on partial blobs; posting less often is cheaper but leaves users on soft confirmations longer. | requires: [batcher, hard-finality]
- `da-cost-no-longer-dominant` — After 4844 and the BPO increases, L1 data is a minor line item for most rollups, so proving cost, ops, and demand now dominate L2 unit economics. | requires: [blob-base-fee-floor, l2-gross-vs-net-revenue]

### Primary sources

- [EIP-7892: Blob Parameter Only Hardforks](https://eips.ethereum.org/EIPS/eip-7892) — tier: spec — published: 2025 — defines BPO forks and the blob schedule format; the primary source for target/max values.
- [EIP-8135: Hardfork Meta — BPO2](https://eips.ethereum.org/EIPS/eip-8135) — tier: spec — published: 2025 — the BPO2 meta EIP.
- [Fusaka Mainnet Announcement](https://blog.ethereum.org/2025/11/06/fusaka-mainnet-announcement) — tier: canonical-docs — published: 2025-11 — official BPO activation dates and parameters.
- [Fulu-Osaka (Fusaka)](https://ethereum.org/roadmap/fusaka/) — tier: canonical-docs — published: live — plain-language PeerDAS and BPO framing.
- [Protocol Priorities Update for 2026](https://blog.ethereum.org/en/2026/02/18/protocol-priorities-update-2026) — tier: canonical-docs — published: 2026-02 — where blob scaling sits in EF priorities after Fusaka.
- [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) — tier: spec — published: 2022–2024 — blob transaction type, blob gas accounting, versioned hashes.
- [EIP-7594: PeerDAS](https://eips.ethereum.org/EIPS/eip-7594) — tier: spec — published: 2025 — column sampling; the reason blob counts could rise.
- [Fusaka Is Live: Scaling Optimism and the Superchain](https://www.optimism.io/blog/fusaka-is-live-scaling-optimism-and-the-superchain) — tier: canonical-docs (vendor) — published: 2025-12 — a rollup operator's own account of what Fusaka changed for its batcher.
- [Impact of EIP-4844 on Ethereum: Consensus Security, Ethereum Usage, Rollup Transaction Dynamics, and Blob Gas Fee Markets](https://ieeexplore.ieee.org/document/11108700/) — tier: primary-analysis (peer-reviewed) — published: 2025 — measured blob fee market behaviour.
- [EIP-4844, Blobs, and Blob Gas: What you need to know](https://www.blocknative.com/blog/eip-4844-blobs-and-blob-gas-what-you-need-to-know) — tier: secondary (vendor) — good mechanical explainer of blob gas accounting.

### Current state (Aug 2026)

- **Verified blob schedule:**
  - Pectra (May 2025): target 6 / max 9.
  - Fusaka (9 Dec 2025) + **BPO1 activated 2025-12-09**: target **10** / max **15**.
  - **BPO2 activated 2026-01-07**: target **14** / max **21**.
  - **BPO3 and BPO4 are NOT shipped.** Core devs paused them pending telemetry review of BPO1/BPO2 rather than raising on schedule. The 128-blobs-per-block figure is the full-danksharding endpoint, not a 2026 parameter.
- **The economically important consequence:** blob supply outran blob demand again after BPO2, so the blob base fee spends most of its time at or near the floor for the second time. Rollup DA cost is small; the differentiator moved elsewhere.
- **Commonly taught and now wrong:** "blobs are scarce and rollups fight over them." That was true in mid-2025 between Pectra and Fusaka. It has not been true since BPO2 for most periods — but it recurs, so build batchers for both regimes.
- **Also now wrong:** "blob target is 3 / max 6" (the original 4844 values) and "target 6 / max 9" (Pectra). Both are stale.
- Batchers must still implement the type-2 vs type-3 decision: when blob base fee spikes and execution gas is cheap, calldata can win.
- PeerDAS means a blob is 128 columns to the network, but the rollup-side interface is unchanged — a rollup still submits whole blobs. This is a common confusion point.

### Misconceptions

- Belief: The EVM can read blob data, so contracts can verify what was posted. | Reality: contracts only see the versioned hash via BLOBHASH; blob bytes never enter the EVM. Verification is done with KZG point evaluation at the 0x0A precompile. | Why: "posted on Ethereum" implies readable on Ethereum. | Source: https://eips.ethereum.org/EIPS/eip-4844
- Belief: PeerDAS made blobs cheaper. | Reality: PeerDAS made *more* blobs safe to carry; the BPO forks then raised the count, and the increased supply is what lowered the price. | Why: the mechanism and its consequence get merged. | Source: https://eips.ethereum.org/EIPS/eip-7892
- Belief: Blob target and max are set by the named hardfork. | Reality: since EIP-7892 they are changed by standalone BPO forks on their own cadence. | Why: pre-Fusaka mental model. | Source: https://eips.ethereum.org/EIPS/eip-7892
- Belief: Blob fees are part of the normal gas market, so a busy Ethereum block makes DA expensive. | Reality: blob gas has an entirely separate base fee; the two markets routinely diverge. | Why: one "gas" word for two markets. | Source: https://www.blocknative.com/blog/eip-4844-blobs-and-blob-gas-what-you-need-to-know
- Belief: The L2 fee you pay is mostly the L1 data cost. | Reality: post-BPO2 the DA component is typically small; L2 fees are increasingly the operator's execution charge and margin. | Why: 2023-era rollup economics diagrams persist.
- Belief: Blobs are stored on Ethereum permanently. | Reality: ~18 days, then pruned. | Source: https://eips.ethereum.org/EIPS/eip-4844

### Practice ideas

- kind: implement — Build a "should I blob?" cost oracle in TypeScript: read `blobBaseFee` and `baseFee` from a public RPC, take a batch size, and output whether type-3 or type-2 is cheaper right now. — Acceptance: correct crossover point, and it flips when you feed it historical spike data.
- kind: measure — Sample blob base fee and execution base fee every block for an hour and plot both. — Acceptance: a chart demonstrating the two markets move independently, with at least one divergence annotated.
- kind: implement — Send your own blob transaction on a testnet using viem/ethers, then read back the versioned hash on-chain and fetch the sidecar from a beacon API. — Acceptance: on-chain BLOBHASH matches the KZG commitment hash of the sidecar you retrieved.
- kind: measure — For one live rollup, compute cost per L2 transaction attributable to L1 posting over a day (batch bytes and blob fees paid ÷ L2 transactions). — Acceptance: a number, with the compression ratio stated separately.
- kind: read — Read EIP-7892 and write the exact set of parameters a BPO fork is allowed to change. — Acceptance: the list matches the spec, including the fee update fraction.
- kind: break — Configure a local rollup (OP Stack devnet) batcher with an absurdly long posting interval and show the effect on hard finality and on a bridge's withdrawal timing. — Acceptance: measured delay difference and a written statement of who is exposed during it.

### Visual opportunities

- **Two-track fee chart**: execution base fee and blob base fee on the same timeline, with the batcher's type-2/type-3 choice shaded underneath. This teaches the dual market instantly.
- **The blob capacity staircase**: 4844 (3/6) → Pectra (6/9) → BPO1 (10/15) → BPO2 (14/21) → [paused] → danksharding endpoint, with what enabled each step.
- **One batch's journey**: L2 txs → compression → blob encoding (4096 field elements) → KZG commitment → versioned hash on L1 → sidecar to the beacon network → pruned at ~18 days.
- **PeerDAS column split**: one blob becoming 128 columns, and a validator holding only a few of them.

### Gaps & uncertainties

- **Per-transaction L2 fee figures are UNVERIFIED and should not be published.** One secondary source gives mid-2026 medians of ~$0.05 (Base), ~$0.09 (Arbitrum One, OP Mainnet), ~$0.07 (zkSync Era). No primary confirmation; also highly volatile.
- **"Blob base fee surged ~15 million times relative to its pre-Fusaka floor" is UNVERIFIED** and, given the floor is 1 wei, the ratio is arithmetically unremarkable and rhetorically misleading. Do not repeat it.
- **Blob utilisation "20–30% of capacity" after BPO2 is UNVERIFIED** — a single secondary source. Sources also disagree on whether demand caught up in September 2025; treat all utilisation claims as needing live data.
- Whether BPO3 has activated between Feb 2026 and Aug 2026 is **UNRESOLVED** — one source says it was held pending telemetry, but I did not find a primary confirmation of the status as of Aug 2026. Check the EF blog and the EIP index before teaching a current target/max.
- Exact current compression ratios per rollup are not verified; they vary with transaction mix.
- The IEEE paper was found via search result metadata only; its specific findings were not read.

## 09.5 — Fraud vs validity proofs: bisection, challenge windows, proving cost, honest comparison

> **Verification status: VERIFIED on mechanism and on the OP/Arbitrum proof-system state**
> (OP Stack specs, Arbitrum BoLD docs, L2BEAT). **Proving cost and latency numbers CONFLICT
> ACROSS SOURCES and are NOT resolved** — see Gaps.

### Concepts

- `fraud-proof` — A protocol where the posted state is assumed correct and anyone may challenge it within a window; if the challenge succeeds the assertion is rejected. Also called a fault proof. | requires: [optimistic-rollup]
- `validity-proof` — A succinct cryptographic proof, verified on L1, that the state transition was computed correctly; no window and no challenger needed. | requires: [validity-rollup] | contrasts: [fraud-proof]
- `interactive-bisection` — The dispute is halved repeatedly — block range, then instruction range — until the two parties disagree about exactly one instruction. | requires: [fraud-proof]
- `one-step-proof` — The final on-chain step: replay that single disputed instruction inside an on-chain VM and see who was right; this is the only thing L1 ever executes. | requires: [interactive-bisection]
- `fault-proof-vm` — A deterministic VM (Cannon for OP Stack, a WASM/WAVM machine for Arbitrum) that emulates the rollup's state transition so a single instruction can be replayed on L1. | requires: [one-step-proof]
- `challenge-window` — The fixed period (~7 days on both major optimistic stacks) during which an assertion can be disputed; withdrawals cannot finalise until it elapses. | requires: [fraud-proof]
- `one-honest-challenger-assumption` — An optimistic rollup is safe only if at least one honest party is watching, funded, and able to get transactions on-chain during the window. | requires: [challenge-window, forced-inclusion]
- `permissionless-challenging` — Whether *anyone* can challenge, or only a whitelist; a whitelisted challenger set is the difference between a real fraud proof and a decorative one, and is a Stage 1 requirement. | requires: [one-honest-challenger-assumption, l2beat-stage-1]
- `delay-attack` — An adversary spams disputes to stall confirmations and drain honest challengers' capital and attention; BoLD's design goal is to bound this delay. | requires: [interactive-bisection]
- `bonded-challenging` — Challengers and asserters post bonds; the loser's bond pays the winner, which funds honest watching and prices spam. | requires: [delay-attack]
- `proving-cost` — Validity rollups pay a real, recurring compute bill per batch to generate proofs, which is an operating cost optimistic rollups simply do not have. | requires: [validity-proof]
- `proving-latency` — Time from executing a batch to having a verifiable proof; this sets how fast a validity rollup can finalise, and it is minutes-to-hours in production, not instant. | requires: [validity-proof]
- `proof-type-is-not-trust-level` — Trust depends on who can upgrade, whether challenging is permissionless, and whether the proof system is actually active in production — not on whether the proof is optimistic or validity. | requires: [permissionless-challenging, proofs-do-not-imply-trustless]

### Primary sources

- [Fault Proof — OP Stack Specification](https://specs.optimism.io/fault-proof/index.html) — tier: spec — published: live — the normative OP fault proof spec.
- [Fault Dispute Game — OP Stack Specification](https://specs.optimism.io/fault-proof/stage-one/fault-dispute-game.html) — tier: spec — published: live — the bisection game in precise terms; the best single artefact for teaching the mechanism.
- [Dispute Game Interface — OP Stack Specification](https://specs.optimism.io/fault-proof/stage-one/dispute-game-interface.html) — tier: spec — published: live — pluggable game types; explains how CANNON vs CANNON_KONA works.
- [Fault proofs explainer](https://docs.optimism.io/op-stack/fault-proofs/explainer) — tier: canonical-docs — published: live — readable version.
- [Fault proof VM: Cannon](https://docs.optimism.io/stack/fault-proofs/cannon) — tier: canonical-docs — published: live — the on-chain MIPS VM.
- [OP-Challenger explainer](https://docs.optimism.io/stack/fault-proofs/challenger) — tier: canonical-docs — published: live — the software an honest challenger actually runs; makes the honest-party assumption concrete.
- [Migrating to permissionless fault proofs on OP Stack](https://docs.optimism.io/operators/chain-operators/tutorials/migrating-permissionless) — tier: canonical-docs — published: live — what a chain must do to stop whitelisting challengers.
- [Challenges: Interactive Fraud Proofs](https://docs.arbitrum.io/how-arbitrum-works/interactive-fraud-proofs) — tier: canonical-docs — published: live — bisection then one-step proof, Arbitrum's framing.
- [BoLD: a technical deep dive](https://docs.arbitrum.io/how-arbitrum-works/bold/bold-technical-deep-dive) — tier: canonical-docs — published: 2025 — all-vs-all dispute resolution with bounded delay.
- [Economics of Disputes in Arbitrum BoLD](https://docs.arbitrum.io/how-arbitrum-works/bold/bold-economics-of-disputes) — tier: canonical-docs — published: 2025 — bond sizing and the cost of attacking.
- [Economic Censorship Games in Fraud Proofs](https://arxiv.org/pdf/2502.20334) — tier: primary-analysis (arXiv) — published: 2025-02 — the adversarial analysis; the honest counterweight to vendor docs.
- [Analyzing Performance Bottlenecks in Zero-Knowledge Proof Based Rollups on Ethereum](https://arxiv.org/pdf/2503.22709) — tier: primary-analysis (arXiv) — published: 2025-03 — measured proving bottlenecks.
- [SP1 Hypercube Achieves Real Time Proving with 16 GPUs](https://blog.succinct.xyz/real-time-proving-16-gpus/) — tier: primary-analysis (vendor) — published: 2025 — **vendor**; the hardware requirement is the interesting part, not the headline.
- [Introducing OP Succinct: Full Validity Proving on the OP Stack](https://blog.succinct.xyz/op-succinct/) — tier: primary-analysis (vendor) — the optimistic/validity boundary is now a config choice.
- [The Fault Proof System is available for the OP Stack](https://blog.oplabs.co/the-fault-proof-system-is-available-for-the-op-stack/) — tier: canonical-docs — the shipping announcement.

### Current state (Aug 2026)

- **Both major optimistic stacks now have live, permissionless proof systems.** This is the biggest change versus 2023-era teaching material, where "optimistic rollups don't actually have working fraud proofs" was a fair criticism.
  - **Arbitrum: BoLD** (launched 2025) — permissionless, all-vs-all, bounded-delay validation. Arbitrum One reached Stage 1 on the back of it.
  - **OP Stack: permissionless fault proofs**, with pluggable game types. **Upgrade 19b "Karst" (op-contracts/v7.0.0), executed 2026-06-25**, switched the respected game type from `CANNON` to `CANNON_KONA` — the Rust `kona-client` running on the Cannon VM instead of `op-program`. **Trust model unchanged.**
- **Challenge window is still ~7 days** on both. It has not shortened.
- **The optimistic/validity line has blurred**: OP Succinct puts validity proofs on the OP Stack, so "which proof type" is increasingly a per-chain configuration rather than a stack property.
- **Commonly taught and now wrong:** "optimistic rollups have no working fraud proofs, it's all theatre." Outdated since 2024–2025.
- **Also now wrong:** "ZK rollups have instant finality." Proving takes real wall-clock time; the L2 still runs on soft confirmations while the proof is generated, exactly like an optimistic rollup. What validity proofs remove is the *withdrawal* delay, not the confirmation delay.
- **Still true and under-taught:** a fraud proof needs a live, funded, uncensored honest challenger. The proof system is not autonomous.

### Misconceptions

- Belief: A fraud proof re-executes the whole disputed batch on L1. | Reality: bisection narrows the dispute to one instruction and L1 executes only that instruction inside the fault-proof VM. | Why: "proving fraud" sounds like re-running everything, which would defeat the point of a rollup. | Source: https://specs.optimism.io/fault-proof/stage-one/fault-dispute-game.html
- Belief: ZK rollups are final immediately, optimistic rollups take 7 days. | Reality: both give you a soft confirmation in ~1s; the 7 days is the optimistic *withdrawal* window, and validity rollups have their own proving latency before L1 finality. | Why: the two delays are different things wearing the same word. | Source: https://arxiv.org/pdf/2503.22709
- Belief: The fraud proof protects me automatically. | Reality: it protects you if at least one honest, funded party is watching and can reach L1 during the window; that is a liveness assumption about people, not code. | Why: "trustless" language. | Source: https://docs.optimism.io/stack/fault-proofs/challenger
- Belief: Anyone can already challenge on every optimistic rollup. | Reality: permissionless challenging is a specific migration a chain has to perform; some chains still whitelist. | Source: https://docs.optimism.io/operators/chain-operators/tutorials/migrating-permissionless
- Belief: Validity proofs cost nothing once written. | Reality: proving is a recurring compute bill per batch, with meaningful GPU requirements; it is an ongoing operating cost optimistic rollups never pay. | Source: https://blog.succinct.xyz/real-time-proving-16-gpus/
- Belief: An attacker can win a dispute by outspending the honest party. | Reality: BoLD is specifically designed so a single honest party bonding the correct state always prevails, with delay bounded; but delay/censorship attacks on the economics are an active research area. | Source: https://arxiv.org/pdf/2502.20334
- Belief: The 7-day window exists because fraud proofs are slow. | Reality: it exists to guarantee an honest challenger has time to get a transaction included on L1 even under censorship. The window is a censorship-resistance budget.

### Practice ideas

- kind: implement — Implement a toy bisection game in Solidity with Foundry: two parties commit to a Merkle root over an execution trace, bisect over N steps, and settle by executing one step. — Acceptance: an honest party wins against a dishonest one in a test, in O(log N) on-chain rounds.
- kind: measure — Instrument your toy game: count on-chain rounds and gas as trace length grows from 2^8 to 2^20. — Acceptance: a table showing rounds growing logarithmically and gas per round roughly flat.
- kind: read — Read the OP fault dispute game spec and write, in your own words, what a "claim" is, what makes it "countered", and how the game resolves. — Acceptance: an explanation that correctly handles the case where both parties stop responding.
- kind: run — Run op-challenger against a testnet OP Stack chain and observe it evaluating proposals. — Acceptance: logs showing it fetched a proposal and decided whether to challenge, plus a written statement of what would have happened if nobody ran it.
- kind: break — In your toy game, implement a delay attacker that always responds at the last possible moment and measure how long an honest party is forced to stay engaged. — Acceptance: measured worst-case honest-party cost, and one mitigation proposed.
- kind: write — For a bridge that fronts withdrawal liquidity, write the risk memo covering both proof types: what the bridge is exposed to if the challenge window is attacked, versus if proving stalls. — Acceptance: two distinct failure narratives with distinct mitigations.

### Visual opportunities

- **Bisection, drawn as a binary search over an execution trace**, ending at a single instruction with the on-chain VM highlighted. This is the module's core diagram and is genuinely hard to grasp without it.
- **Two timelines stacked**: optimistic (execute → assert → 7-day window → withdrawable) vs validity (execute → prove for N minutes → verify → withdrawable), with soft confirmation marked at the same early point on both. Kills the "instant finality" misconception.
- **What L1 actually executes**: a huge greyed-out batch with one tiny highlighted instruction.
- **The honest-challenger dependency graph**: proof system → requires challenger software running → requires funding for bonds → requires L1 inclusion → requires no censorship. Each link is an assumption.
- **Cost shape comparison**: optimistic (near-zero recurring proof cost, capital cost in bonds + latency) vs validity (recurring GPU cost, no window).

### Gaps & uncertainties

- **Proving cost figures CONFLICT and are NOT resolved.** Sources seen in this session variously claim: SP1 ~$0.001/proof (shard baseline), SP1 "0.5–1 cent per transaction", and "as low as tenths of a cent per transaction". These are not even the same unit (per proof vs per transaction). **Do not publish a proving cost number without stating the unit and the source.**
- **Proving latency figures CONFLICT.** Claims seen: "seconds" (SP1 Hypercube, 16 GPUs, block-level), "30 minutes" (zkSync Boojum), "75 minutes" (Linea, gnark), "tens of minutes" (generic). Several of these are from different years and different scopes (single Ethereum block vs a full L2 batch). **Sources disagree; I did not pick one.** The Boojum "30 minutes" and Linea "75 minutes" figures come from secondary sources and may be stale.
- The shard baseline's "SP1 Hypercube proves >93% of Ethereum blocks in under 12s" refers to **L1 block proving on a GPU cluster**, which is a different workload from proving an L2 batch. Do not conflate.
- "BoLD one-week challenge period corresponds to ~50,000 blocks/rounds" was found in secondary summary form; verify against Arbitrum's BoLD docs before teaching the number.
- Whether Arbitrum's challenge window changed with BoLD (vs the pre-BoLD 7 days) is not verified here.
- The exact list of optimistic rollups that still whitelist challengers as of Aug 2026 is UNRESOLVED — check L2BEAT per-project risk rows live.
- Whether OP Succinct or similar validity-proof modes are in production on any significant OP Stack chain (vs testnet/optional) is UNRESOLVED.

## 09.6 — Forced inclusion & escape hatches: the L1 path around a censoring sequencer

> **Verification status: VERIFIED on mechanism and on Arbitrum/OP window values** (Arbitrum docs,
> OP Stack docs, L2BEAT risk framework). **Per-chain coverage beyond those two is NOT verified.**

### Concepts

- `forced-inclusion` — Submitting your L2 transaction to an L1 contract so that, after a delay, the L2 protocol is obliged to include it whether or not the sequencer cooperates. | requires: [sequencer, rollup]
- `delayed-inbox` — The L1 contract queue that forced transactions land in; the sequencer is supposed to drain it, and the escape hatch is what happens when it does not. | requires: [forced-inclusion]
- `force-include-call` — The permissionless L1 function anyone can call after the delay elapses to push queued messages into the canonical L2 ordering. | requires: [delayed-inbox]
- `force-inclusion-delay` — The deliberate waiting period before forcing works, which exists so the sequencer can order normally and so L1 reorgs cannot rewrite L2 history. | requires: [force-include-call]
- `sequencing-window` — OP Stack's version: L1 blocks older than the window must be derived into L2 blocks, so a transaction deposited to L1 is guaranteed to appear on L2 within the window even with the sequencer dead. | requires: [forced-inclusion] | contrasts: [delayed-inbox]
- `censorship-timeout` — Arbitrum's adaptive shortening of the force-inclusion threshold when the sequencer appears to be delaying or censoring, so the escape hatch gets faster exactly when it is needed. | requires: [force-inclusion-delay]
- `sequencer-failure-severity` — L2BEAT's three-level rating: self-sequence (you can complete inclusion yourself from L1), enqueue-via-L1 (you can submit but cannot complete), no-mechanism (you are stuck). | requires: [forced-inclusion]
- `proposer-failure` — A separate failure: even with your transaction included, if only whitelisted proposers can post state roots and they stop, withdrawals freeze. | requires: [forced-inclusion] | contrasts: [sequencer-failure-severity]
- `exit-window` — The time between an upgrade being announced and taking effect, which is the only period in which you can leave before a hostile upgrade lands; instantly-upgradeable contracts have an exit window of zero. | requires: [upgrade-key-risk, escape-hatch]
- `walkaway-test` — Can users exit if the operators are malicious *and* the Security Council vanishes? Passing this is what "escapable" actually means. | requires: [exit-window, forced-inclusion]
- `escape-hatch-requires-l1-liveness` — Every escape path costs L1 gas and requires L1 inclusion, so an escape hatch is unusable during exactly the L1 congestion a mass exit would cause. | requires: [forced-inclusion]
- `forced-inclusion-is-not-forced-execution` — Getting your transaction ordered does not guarantee the outcome you want; the state it lands in may already have moved against you. | requires: [force-include-call]

### Primary sources

- [The Sequencer and Censorship Resistance](https://docs.arbitrum.io/how-arbitrum-works/deep-dives/sequencer) — tier: canonical-docs — published: live — the delayed inbox and `forceInclude` from the source.
- [Transaction lifecycle on Arbitrum](https://docs.arbitrum.io/how-arbitrum-works/deep-dives/transaction-lifecycle) — tier: canonical-docs — published: live — where forced transactions enter the pipeline.
- [How to configure Delayed Inbox finality](https://docs.arbitrum.io/launch-arbitrum-chain/chain-config/sequencer/chain-finality) — tier: canonical-docs — published: live — `delayBlocks` / `delayBuffer` and the censorship timeout, with the actual configurable ranges.
- [Forced transactions — OP Stack](https://docs.optimism.io/op-stack/transactions/forced-transaction) — tier: canonical-docs — published: live — how to force a transaction via the L1 deposit path.
- [Arbitrum Nitro whitepaper](https://docs.arbitrum.io/nitro-whitepaper.pdf) — tier: primary-analysis — published: 2021 — the original justification for the delayed inbox design.
- [Arbitrum One — L2BEAT](https://l2beat.com/scaling/projects/arbitrum) — tier: canonical-docs — published: live — the risk rows for sequencer failure, proposer failure, and exit window on a real chain.
- [Understanding L2Beat (1): Introduction and Risk Assessment Framework](https://nic619.substack.com/p/understanding-l2beat-1-introduction) — tier: secondary — published: 2024–2025 — explains the five risk categories and the colour severities.
- [Ethical Risk Analysis of L2 Rollups](https://arxiv.org/pdf/2512.12732) — tier: primary-analysis (arXiv) — published: 2025-12 — quantifies how many L2s actually have working exits; the source of the "proposer failure can freeze withdrawals in ~50% of projects" style claim.

### Current state (Aug 2026)

- **Arbitrum**: forced inclusion via `forceInclude` on the `SequencerInbox`. The threshold is **the lesser of `delayBuffer` and `delayBlocks`**; `delayBlocks` is currently set to **24 hours**, and `delayBuffer` is configurable in the range **30 minutes to 48 hours**. The **Censorship Timeout** feature lowers the effective threshold when delays look like censorship or outage. Note this is a *range of configurations for Arbitrum chains*, not one fixed number — Orbit/Arbitrum chains set their own.
- **OP Stack**: a **12-hour sequencing window**. Deposits placed on L1 must be derived into L2 blocks within that window; after it, nodes deterministically produce blocks containing only forced transactions. This means an OP Stack chain keeps producing blocks with a dead sequencer, at 12-hour granularity for user-forced traffic.
- **Coverage is very uneven across the long tail.** L2BEAT rates sequencer failure as self-sequence / enqueue-via-L1 / no-mechanism, and plenty of smaller chains sit in the worse two buckets. **Proposer failure freezing withdrawals is reported in roughly half of analysed L2 projects.**
- **Commonly taught and now wrong:** "every rollup has an escape hatch." Having a delayed inbox is not the same as having a path a user can complete alone, and the state-root proposer is a second, independent chokepoint that most curricula ignore entirely.
- **Also now wrong:** "the escape hatch protects you from a bad upgrade." It only does if the exit window is longer than zero. Instantly-upgradeable contracts mean an upgrade can land before you can leave.
- No major chain shortened its forced-inclusion delay in the last 18 months; the notable movement was Arbitrum's adaptive censorship timeout rather than a lower fixed number.

### Misconceptions

- Belief: If the sequencer censors me I can immediately go to L1. | Reality: you can queue immediately, but forcing only becomes possible after the delay — 24h on Arbitrum One's default, up to 12h of sequencing window on OP Stack. | Why: "escape hatch" implies an exit you can use now. | Source: https://docs.arbitrum.io/how-arbitrum-works/deep-dives/sequencer
- Belief: Forced inclusion means my transaction succeeds. | Reality: it means your transaction gets *ordered*. It can still revert, and by then a liquidation or price move may have happened. | Why: inclusion and execution outcome get conflated.
- Belief: The escape hatch means my funds are always recoverable. | Reality: withdrawals also need a state root posted by a proposer; if proposing is whitelisted and the proposer stops, withdrawals freeze regardless of inclusion. | Why: sequencer failure and proposer failure are taught as one thing. | Source: https://l2beat.com/scaling/projects/arbitrum
- Belief: An escape hatch is useful in a crisis. | Reality: it requires L1 gas and L1 inclusion at exactly the moment everyone else is trying the same thing; the mechanism is designed for individual censorship, not a bank run. | Why: nobody models the congested case.
- Belief: The delay exists because forced inclusion is technically hard. | Reality: it exists so normal sequencing works and so L1 reorgs cannot rewrite L2 history; it is a safety parameter, not an implementation limitation. | Source: https://docs.arbitrum.io/launch-arbitrum-chain/chain-config/sequencer/chain-finality
- Belief: All Arbitrum-family chains have a 24-hour force window. | Reality: it is configurable per chain (`delayBlocks` / `delayBuffer`); check the specific chain. | Source: https://docs.arbitrum.io/launch-arbitrum-chain/chain-config/sequencer/chain-finality

### Practice ideas

- kind: implement — On a testnet, submit a transaction through the L1 delayed inbox / deposit path rather than the L2 RPC, and confirm it executes on L2. — Acceptance: an L2 transaction hash whose origin is the L1 contract, plus the measured L1→L2 latency.
- kind: read — For three L2s of different sizes, read the L2BEAT sequencer-failure and proposer-failure rows and classify each into self-sequence / enqueue-only / none. — Acceptance: a table of three chains with the exact severity and the contract or role responsible.
- kind: measure — Read the live `delayBlocks` / force-inclusion parameters straight from the L1 `SequencerInbox` contract with `cast call`, for two Arbitrum-family chains. — Acceptance: two different numbers read from chain, not from docs, showing the parameter is per-chain.
- kind: write — Write the runbook your team would execute if your L2's sequencer went dark with user funds on it: exact contracts, exact calls, expected timeline, and what you tell users on day one and day three. — Acceptance: every step names a real function on a real address.
- kind: break — Estimate the total L1 gas cost if every holder of a mid-size L2 tried to force-exit within 24 hours. — Acceptance: a number, plus a written statement of what that does to L1 base fee and to the exit's feasibility.
- kind: implement — Write a Foundry script that queues a forced message and then, after simulating the delay via `vm.warp` on a fork, calls the force-include function. — Acceptance: the test fails before the delay and passes after it.

### Visual opportunities

- **Two paths for one transaction**: the happy path through the sequencer, and the forced path through the L1 inbox, converging on the same L2 ordering — with the delay drawn to scale so the 24 hours is felt.
- **The four-chokepoint chain**: sequencer includes → batch posted → state root proposed → challenge window / proof → withdrawal. Highlight that forced inclusion only unblocks the first, and proposer failure blocks the third.
- **L2BEAT's severity ladder** as a traffic light with real chains placed on it.
- **The congested-exit scenario**: everyone forcing at once, L1 gas price curve, and the fraction who actually get out.

### Gaps & uncertainties

- **Which chains implement a usable escape hatch as of Aug 2026 is only partly verified.** Arbitrum and OP Stack are confirmed from their own docs. Coverage for zkSync Era, Starknet, Scroll, Linea, and the long tail was **not verified in this module** — L2BEAT's live per-project pages are the authority and should be checked at authoring time.
- The "proposer failure can freeze withdrawals in 50.4% of L2 projects" figure comes from an arXiv paper surfaced via search summary; **I did not read the paper**, and the sample and date are unconfirmed. Treat as indicative, not citable.
- Arbitrum's `delayBuffer` "30 minutes to 48 hours" range and `delayBlocks` "24 hours" are stated in the docs as current configuration; whether Arbitrum One specifically uses the default was not verified on-chain.
- Whether OP Stack's sequencing window is still 12 hours after op-contracts/v7.0.0 (Karst, 2026-06) was not re-verified.
- Real-world usage data — how many forced inclusions have actually been executed on mainnet L2s — is **unknown**. This matters: an untested escape hatch is a claim, not a guarantee.
- No verified account of a mainnet L2 sequencer outage in the last 18 months where users successfully forced their way out; if one exists it would be the best possible case study, so it is worth hunting for.

## 09.7 — Bridges: native vs third-party, message passing, storage proofs, and the exploit record

> **Verification status: VERIFIED on mechanism and on the 2021–2022 exploit record** (which is
> extremely well documented). **2025–2026 incident figures are from LOW-QUALITY SECONDARY SOURCES
> and are NOT verified** — see Gaps.

### Concepts

- `native-bridge` — The bridge built into the rollup itself, whose security is the rollup's own proof system and L1 contracts; no new trust assumption. | requires: [rollup]
- `third-party-bridge` — An independent protocol moving value between chains, adding its own validator set, oracle, or solver network as a trust assumption. | requires: [native-bridge] | contrasts: [native-bridge]
- `lock-and-mint` — The classic bridge pattern: lock the asset on the source chain, mint a representation on the destination; the minted token is only as good as the lock. | requires: [third-party-bridge]
- `cross-domain-messenger` — The L1/L2 contract pair (e.g. `L1CrossDomainMessenger` / `L2CrossDomainMessenger`) that carries arbitrary messages, with the token bridge built on top of it. | requires: [native-bridge]
- `deposit-is-fast-withdrawal-is-slow` — L1→L2 deposits are near-instant because the L2 just has to read L1; L2→L1 withdrawals are slow because L1 must be convinced the L2 state is correct. | requires: [cross-domain-messenger, challenge-window]
- `liquidity-bridge` — A third-party bridge that fronts you funds on the destination immediately and claims the slow native withdrawal itself, selling you time for a fee. | requires: [third-party-bridge, deposit-is-fast-withdrawal-is-slow]
- `storage-proof-bridge` — Prove a specific storage slot's value on the source chain to the destination chain using a Merkle proof against a verified block header, removing the need for a trusted attester. | requires: [third-party-bridge]
- `header-verification-problem` — Storage proofs only shift the trust question to "how does the destination chain learn a real source-chain header?" — via light client, validity proof, or a committee. | requires: [storage-proof-bridge]
- `intent-bridge` — The user signs what outcome they want; a solver fronts their own liquidity on the destination and is reimbursed later through a settlement path. | requires: [liquidity-bridge]
- `erc-7683` — The cross-chain intents standard defining a common order struct so any wallet can emit an order and any solver can fill it. | requires: [intent-bridge]
- `bridge-is-the-honeypot` — A bridge concentrates the value of everything that crossed it into one contract or key set, which is why bridges dominate the largest-exploit list. | requires: [third-party-bridge]
- `signature-verification-failure` — The Wormhole class of bug: the contract accepted a message without actually checking that the authorised signer set had signed it. | requires: [bridge-is-the-honeypot]
- `key-compromise-failure` — The Ronin/Harmony class: the cryptography was fine and the operators' private keys were stolen, usually socially. | requires: [bridge-is-the-honeypot] | contrasts: [signature-verification-failure]
- `initialisation-failure` — The Nomad class: an upgrade left the trusted root at zero, so every message verified as pre-approved and the exploit became copy-pasteable by strangers. | requires: [bridge-is-the-honeypot]

### Primary sources

- [Smart Contract overview — Optimism Docs](https://docs.optimism.io/stack/smart-contracts) — tier: canonical-docs — published: live — the actual bridge and messenger contracts, by name.
- [Cross-Domain Messaging — Scroll Documentation](https://docs.scroll.io/en/technology/bridge/cross-domain-messaging/) — tier: canonical-docs — published: live — a second stack's messaging design; good for showing the pattern is general.
- [Native Bridges vs. Third-Party Bridges for Rollups — Conduit](https://www.conduit.xyz/blog/rollup-native-bridge-vs-third-party-bridge/) — tier: secondary (vendor) — published: 2024–2025 — clean framing of why third-party bridges exist at all: slow withdrawals and non-Ethereum destinations.
- [A fast trust-minimized intent-based bridge solution for Ethereum and L2s powered by multi-proof storage proofs](https://blog.alignedlayer.com/a-fast-trust-minimized-intent-based-bridge-solution-for-ethereum-and-l2s-powered-by-multi-proof-storage-proofs/) — tier: primary-analysis (vendor) — published: 2025 — storage-proof + intent hybrid, with an explicit fallback to the native messenger; the honest treatment of trust assumptions.
- [Wormhole Bridge Hack: Complete Post-Mortem Analysis](https://nomoslabs.io/blog/wormhole-bridge-hack-complete-post-mortem-analysis) — tier: primary-analysis — published: 2024–2025 — the account-confusion / signature-verification root cause in detail.
- [Cross-Chain Vulnerabilities & Bridge Exploits in 2022 — CertiK](https://www.certik.com/blog/cross-chain-vulnerabilities-and-bridge-exploits-in-2022) — tier: primary-analysis (audit firm) — published: 2022-12 — the canonical taxonomy year.
- [7 Cross-Chain Bridge Vulnerabilities Explained — Chainlink](https://chain.link/education-hub/cross-chain-bridge-vulnerabilities) — tier: secondary (vendor) — published: live — useful vulnerability taxonomy; vendor-published.
- [Bridge Security Checklist: 100+ Critical Exploit Checks](https://www.zealynx.io/research/smart-contracts/cross-chain-bridge-security-checklist) — tier: primary-analysis (audit firm) — an actionable review checklist; excellent practice material.
- [Incident report: Router Protocol asset bridge exploit and response](https://routerprotocol.medium.com/incident-report-router-protocol-asset-bridge-exploit-and-response-833f5bb95a31) — tier: primary-analysis — published: 2025-07 — a first-party post-mortem, which is rarer and more useful than journalism.
- [Exploiting Liquidity Exhaustion Attacks in Intent-Based Cross-Chain Bridges](https://arxiv.org/html/2602.17805) — tier: primary-analysis (arXiv) — published: 2026-02 — the new attack surface intents introduce; important because intents are usually taught as strictly safer.
- [Contagion in Decentralized Infrastructure: How Cross-Chain Bridge Exploits Propagate Failure](https://aisel.aisnet.org/amcis2026/sig_dspe/sig_dspe/12/) — tier: primary-analysis (peer-reviewed) — published: 2026 — systemic-risk framing.
- [ERC-7683: A Technical Deep Dive into the Cross-Chain Intents Standard](https://medium.com/coinmonks/erc-7683-a-technical-deep-dive-into-the-cross-chain-intents-standard-1708f537a6ef) — tier: secondary — published: 2026-05 — technical walkthrough of the order struct.

### Current state (Aug 2026)

- **The canonical exploit record (well documented, safe to teach):**
  - **Ronin, Mar 2022, ~$625M** — 5-of-9 validator threshold; attacker obtained 5 keys via spear phishing (4 Sky Mavis + 1 third-party DAO validator). Root cause: **key compromise + a threshold that was too low and had been temporarily widened**.
  - **Poly Network, Aug 2021, ~$611M** — attacker got the contract to change its own keeper role. Root cause: **privileged-function access control**.
  - **Wormhole, Feb 2022, ~$326M** — Solana-side signature verification bypassed via account confusion (a fake system account). Root cause: **failure to verify the guardian set actually signed**.
  - **Nomad, Aug 2022, ~$190M** — an upgrade set the trusted root to zero, so any message verified. Root cause: **initialisation error**, and it became the first crowdsourced hack: hundreds of wallets copy-pasted the exploit within hours.
  - **Harmony Horizon, Jun 2022, ~$100M** — 2-of-5 multisig compromised. Root cause: **key compromise + low threshold**.
- **The pattern is the lesson:** the two dominant root causes are *key/threshold compromise* and *verification that does not actually verify*. Neither is a cryptography failure. This matches the shard baseline's 2025 data where access control dominates loss value.
- **Architecture shift since 2024:** intents have largely displaced lock-and-mint for user-facing transfers. **ERC-7683** was ratified in early 2025 and is implemented by Across, UniswapX, Eco and others; the Ethereum Foundation's **Open Intents Framework (OIF)** launched Feb 2025 with 30+ teams.
- **Commonly taught and now wrong:** "bridging means lock-and-mint." For a user in 2026, bridging usually means signing an intent that a solver fills in seconds; the canonical bridge runs underneath as settlement.
- **Also now wrong:** "intents are safer because there's no honeypot." They move the risk to solver liquidity concentration and delayed settlement — there is 2026 academic work on liquidity-exhaustion attacks specifically.
- **Storage-proof bridges are real but not dominant.** They remove the attester but inherit the header-verification problem; the practical designs fall back to the native messenger when proofs are unavailable.
- **Bridges were still being exploited in 2025–2026.** Cross-chain message forgery has not been solved. See Gaps for why I am not publishing the figures.

### Misconceptions

- Belief: Bridges get hacked because the cryptography is weak. | Reality: the headline losses came from stolen keys, missing access control, and verification code that did not verify — not broken crypto. | Why: "bridge hack" sounds cryptographic. | Source: https://www.certik.com/blog/cross-chain-vulnerabilities-and-bridge-exploits-in-2022
- Belief: The native bridge and the fast bridge give the same guarantees. | Reality: the native bridge's security is the rollup's; a liquidity bridge adds a solver/relayer trust assumption and usually a separate contract holding pooled funds. | Why: both are one button in the same UI. | Source: https://www.conduit.xyz/blog/rollup-native-bridge-vs-third-party-bridge/
- Belief: Bridging back to L1 is slow because the bridge is slow. | Reality: it is slow because L1 has to become convinced the L2 state is correct — the challenge window or the proof. The bridge is just waiting. | Why: users blame the visible component.
- Belief: Wrapped tokens from a bridge are the same asset. | Reality: they are a claim on that specific bridge's lock; if the bridge is drained the wrapper is worthless while the original asset is untouched. Nomad and Wormhole both produced unbacked wrappers. | Source: https://nomoslabs.io/blog/wormhole-bridge-hack-complete-post-mortem-analysis
- Belief: A multisig-secured bridge is decentralised. | Reality: Ronin was 5-of-9 and Harmony was 2-of-5; both fell to key compromise. Threshold size and key custody diversity are the actual security parameters. | Source: https://hackenproof.com/blog/web3-bridge-hacks
- Belief: Storage-proof bridges are trustless. | Reality: they are trust-minimised for *state*, but still need a trusted or proven source of source-chain headers. | Source: https://blog.alignedlayer.com/a-fast-trust-minimized-intent-based-bridge-solution-for-ethereum-and-l2s-powered-by-multi-proof-storage-proofs/
- Belief: Nomad was exploited by a sophisticated attacker. | Reality: after the first transaction, the exploit was copy-pasteable by anyone changing an address; hundreds of ordinary wallets participated. | Why: it makes the "one zero value" root cause vivid.

### Practice ideas

- kind: implement — Bridge a testnet asset L1→L2 via the native bridge and back L2→L1, instrumenting each step: deposit inclusion, withdrawal initiation, state root posted, proof/window elapsed, finalisation claimed. — Acceptance: a five-stage timeline with real timestamps and the two-transaction nature of the withdrawal made explicit.
- kind: implement — Write a Solidity verifier that checks a storage proof: given a block header's state root and a Merkle-Patricia proof, prove one account's storage slot. — Acceptance: passes for a real mainnet slot and reverts on a tampered proof, tested with Foundry against a fork.
- kind: break — Reproduce the Nomad bug in a minimal local bridge: an `initialize` that sets the trusted root, deployed without calling it. Then prove an arbitrary message. — Acceptance: an unauthorised message accepted, followed by a one-line fix and a test that would have caught it.
- kind: break — Reproduce the Wormhole class: a verifier that reads a signer set from an account/argument the caller controls. — Acceptance: a forged message accepted; fix by binding the signer set to immutable or storage the caller cannot influence.
- kind: read — Read three first-party bridge post-mortems and classify each root cause into: key compromise, access control, verification logic, initialisation. — Acceptance: a table of three incidents with the exact function or key at fault.
- kind: write — Design review a bridge's trust model: list every party who, acting alone or in collusion of size k, could mint an unbacked token. — Acceptance: an explicit collusion threshold, and a comparison to the native bridge's threshold.
- kind: measure — For one intent bridge, measure how long a transfer actually takes and how long the underlying settlement takes. — Acceptance: two very different numbers, plus a statement of who bears the risk in the gap.

### Visual opportunities

- **The trust-assumption ladder**: native bridge (rollup's own security) → storage-proof bridge (+ header verification) → intent/liquidity bridge (+ solver) → external validator-set bridge (+ new committee). One diagram that ranks every bridge a student will see.
- **Deposit vs withdrawal, asymmetric by construction** — showing why one direction is instant and the other must wait for a proof.
- **Anatomy of the four canonical failures** side by side: Ronin (keys), Poly (access control), Wormhole (fake verification), Nomad (zero root) — each drawn as the one check that was missing.
- **Intent flow vs canonical flow**: solver fronts funds in seconds on top, settlement crawls along the native path underneath, with the solver's exposure window shaded.
- **The honeypot chart**: bridge TVL against the number of keys guarding it.

### Gaps & uncertainties

- **2025–2026 incident figures are NOT verified and should not be published as fact.** Claims surfaced this session, all from low-quality secondary sources (exchange blogs): "Kelp DAO ~$290–292M, April 2026, forged cross-chain message on a LayerZero-powered bridge, ~116,500 rsETH"; "eight bridge attacks Feb–mid-May 2026 totalling ~$328.6–329M"; "over $750M total 2026 crypto hack losses". **Verify against a primary post-mortem or Rekt/Chainalysis before teaching any of these.** The Kelp figure in particular would be a top-5 all-time bridge loss and deserves primary confirmation.
- Sources give slightly different Ronin figures ($600M / $625M / "173,600 ETH + 25.5M USDC") and different Poly Network figures ($611M / $612M). These are valuation-date differences, not contradictions — teach the approximate scale, not a precise number.
- **ERC-7683 adoption statistics are UNVERIFIED**: "88% of Across volume", "MetaMask native support in 12.4 (March 2026)", "Safe/Argent/Rabby support as of Q1 2026". All from a single vendor support-article family. The standard's existence and its adoption by Across/UniswapX/Eco is well attested; the percentages are not.
- Whether ERC-7683 is finalised or still Draft/Review status on eips.ethereum.org as of Aug 2026 was **not checked** — check the EIP directly.
- I did not verify the current status of major storage-proof bridge providers (Succinct/Telepathy, Polymer, Herodotus) — searches did not surface primary material, so no claims are made about them here.
- The AMCIS 2026 and arXiv 2602.17805 papers were surfaced by title only; **neither was read**.
- Total historical bridge losses are variously cited as "~$1.3B in 2022 alone (57% of Web3 losses that year)" and "~$3B aggregate 2021–2024". Different scopes; do not combine.

## 09.8 — OP Stack: architecture, the Superchain, deriving L2 from L1, and deploying a chain

> **Verification status: VERIFIED** on architecture, derivation, interop design and deployment
> requirements, from the OP Stack specification and Optimism docs. Interop's production status
> is the main open item.

### Concepts

- `op-stack` — A modular, open-source rollup codebase (execution client, consensus/derivation client, batcher, proposer, challenger, L1 contracts) that many chains run as their own L2. | requires: [rollup]
- `two-client-node` — An OP Stack node is a pair: an execution client (`op-geth`) that builds and executes blocks, and a consensus client (`op-node`) that decides what those blocks must contain. | requires: [op-stack]
- `derivation` — The rule that L2 blocks are a deterministic function of L1 data; given L1, every honest node computes the identical L2 chain with no consensus among L2 nodes required. | requires: [two-client-node]
- `derivation-is-the-security-model` — Because L2 state is derived from L1, an L2 node needs no trust in the sequencer for *history*; the sequencer only decides what enters L1 in the first place. | requires: [derivation, soft-confirmation]
- `unsafe-safe-finalized` — The three OP Stack block labels: unsafe (from the sequencer's gossip), safe (derived from L1 data now posted), finalized (derived from L1 data that is L1-finalised). | requires: [derivation, hard-finality]
- `deposit-transaction` — A transaction type created by derivation from an L1 event rather than submitted to L2; the mechanism behind both L1→L2 messaging and forced inclusion. | requires: [derivation, forced-inclusion]
- `superchain` — A set of OP Stack chains sharing a governance-approved contract release, standard configuration, and eventually a common interop mesh. | requires: [op-stack]
- `standard-rollup-charter` — The specific configuration and contract-release requirements a chain must meet to be classified `superchain_level = 2` (Standard Rollup) in the Superchain Registry. | requires: [superchain]
- `superchain-registry` — The public index that is the source of truth for which chains are in the Superchain and whether each is standard. | requires: [standard-rollup-charter]
- `op-deployer` — The mandated deployment tool: since 1 March 2025 a chain must be deployed with `op-deployer` to be added to the Superchain Registry as standard. | requires: [superchain-registry]
- `op-contracts-manager` — The contract that deploys and upgrades an OP Stack chain's L1 contract set as a versioned unit, which is how "governance-approved release" is enforced mechanically. | requires: [op-deployer]
- `superchain-interop` — Native cross-chain messaging inside the Superchain: an initiating message (a log) on the source chain is consumed by an executing message on the destination, and a chain may not advance past an executing message until the initiating one is reproduced from the source. | requires: [derivation, cross-domain-messenger]
- `dependency-set` — The set of chains whose messages a given chain will accept; in the Superchain design this is a fully connected mesh so any chain can message any other. | requires: [superchain-interop]
- `op-supernode` — A node that runs every chain in a dependency set in one process with a shared L1 and beacon client, because following N chains separately is prohibitively expensive. | requires: [dependency-set]
- `configurability-is-not-freedom` — An OP Stack chain can enable alt-DA, custom gas tokens, or L3 mode, but each of those choices can move it out of "standard" and change its L2BEAT classification. | requires: [standard-rollup-charter, alt-da, rollup-vs-validium]

### Primary sources

- [OP Stack Protocol — OP Stack Specification](https://specs.optimism.io/protocol/overview.html) — tier: spec — published: live — the normative architecture; the right primary source for derivation.
- [Interoperability — OP Stack Specification](https://specs.optimism.io/interop/overview.html) — tier: spec — published: live — initiating/executing messages, dependency sets, the safety rules.
- [OP Contracts Manager — OP Stack Specification](https://specs.optimism.io/experimental/op-contracts-manager.html) — tier: spec — published: live — how a chain's L1 contracts are deployed and upgraded as a version.
- [Superchain explainer](https://docs.optimism.io/get-started/superchain) — tier: canonical-docs — published: live — the model in plain terms.
- [Superchain interoperability explainer](https://docs.optimism.io/interop/explainer) — tier: canonical-docs — published: live — the two-transaction message flow and `op-supernode`.
- [What makes a chain standard?](https://docs.optimism.io/superchain/standard-configuration) — tier: canonical-docs — published: live — the Standard Rollup Charter requirements; the concrete answer to "what does joining actually mean".
- [The superchain-registry](https://docs.optimism.io/op-stack/protocol/superchain-registry) — tier: canonical-docs — published: live.
- [ethereum-optimism/superchain-registry](https://github.com/ethereum-optimism/superchain-registry) — tier: canonical-docs — published: live — the actual registry data; `superchain_level` per chain. Good for a real exercise.
- [Smart contract deployment](https://docs.optimism.io/operators/chain-operators/deploy/smart-contracts) — tier: canonical-docs — published: live — the op-deployer mandate and the deployment flow.
- [How to configure challenger for your chain](https://docs.optimism.io/operators/chain-operators/deploy/op-challenger) — tier: canonical-docs — published: live — the part of "deploying a chain" people forget.
- [ethereum-optimism/optimism releases](https://github.com/ethereum-optimism/optimism/releases) — tier: canonical-docs — published: live — the version pin source; op-contracts releases live here.
- [Fusaka Is Live: Scaling Optimism and the Superchain](https://www.optimism.io/blog/fusaka-is-live-scaling-optimism-and-the-superchain) — tier: canonical-docs — published: 2025-12 — what the L1 upgrade changed for OP chains.

### Current state (Aug 2026)

- **A node is still two processes**: `op-geth` (execution) + `op-node` (consensus/derivation). Interop adds cross-chain message verification on top of the same derivation pipeline rather than replacing it.
- **`op-contracts/v7.0.0` ("Karst", Upgrade 19b) executed 2026-06-25** — this is the current contract-release landmark from the 09.5 research: respected game type moved `CANNON` → `CANNON_KONA` (Rust `kona-client` on the Cannon VM). Trust model unchanged. **Verify the exact latest release against the GitHub releases page before pinning.**
- **op-deployer is mandatory for standard chains since 1 March 2025.** Hand-rolled deployments are no longer eligible for standard status in the registry.
- **`superchain_level = 2` marks a Standard Rollup**; other chains can join the registry without meeting the charter, at a lower level. Registry membership alone is not a security claim.
- **Superchain interop is in active development and available for testing** — it is NOT a shipped, universally-live mainnet feature. `op-supernode` exists specifically because a fully connected mesh makes running nodes expensive.
- **Commonly taught and now wrong:** "the Superchain is a shared sequencer." It is currently shared *contracts, standards, governance and (in development) messaging*. Shared sequencing is a plan pointed at Espresso, not a shipped fact (see 09.2).
- **Also now wrong:** "deploying an OP Stack chain is a weekend project." Deploying the contracts is scriptable; running a batcher, proposer, challenger, RPC fleet, monitoring, and an upgrade process is a real operations commitment — which is why RaaS providers exist.
- **Also now wrong:** "every OP Stack chain is a rollup." op-deployer supports alt-DA and custom gas tokens; such a chain may be an optimium, and L2BEAT will classify it accordingly.

### Misconceptions

- Belief: L2 nodes reach consensus with each other. | Reality: OP Stack L2 nodes run no consensus among themselves; the chain is *derived* deterministically from L1 data, which is why one honest sequencer output is enough. | Why: "consensus client" is in the name `op-node`. | Source: https://specs.optimism.io/protocol/overview.html
- Belief: If the sequencer disappears, the chain's history is at risk. | Reality: history is reconstructible from L1 by anyone with `op-node`; what is at risk is *new* block production. | Source: https://specs.optimism.io/protocol/overview.html
- Belief: "Safe" and "finalized" mean the same thing on an L2. | Reality: safe = derived from posted L1 data; finalized = that L1 data is itself finalised. A shallow L1 reorg can un-safe a block that is not yet finalized. | Why: Ethereum's own labels get borrowed without their L2 meaning.
- Belief: Superchain interop means tokens move instantly and trustlessly between OP chains today. | Reality: it is in active development and available for testing; the design requires the destination to reproduce the initiating message from the source before advancing. | Source: https://docs.optimism.io/interop/explainer
- Belief: Being in the Superchain Registry means a chain is secure/standard. | Reality: any OP Stack chain may join; only `superchain_level = 2` attests to the Standard Rollup Charter. | Source: https://github.com/ethereum-optimism/superchain-registry
- Belief: Launching an OP Stack chain gives you Ethereum's security automatically. | Reality: it gives you the codebase. Whether your chain has permissionless fault proofs, a real challenger running, non-custodial upgrade keys, and Ethereum DA are all per-deployment choices. | Source: https://docs.optimism.io/superchain/standard-configuration

### Practice ideas

- kind: implement — Stand up a local OP Stack devnet (`op-geth` + `op-node` + batcher + proposer against an L1 devnet) and send a transaction end to end. — Acceptance: a transaction visible on L2, then its batch located on L1, then the L2 block re-derived by a second `op-node` started from scratch.
- kind: break — Kill the sequencer on your devnet and watch what the derivation pipeline does. Then submit a deposit on L1 and confirm it still lands on L2. — Acceptance: written account of which block label stops advancing and which keeps going.
- kind: measure — On a live OP Stack chain, poll for the `unsafe`, `safe`, and `finalized` head heights over an hour and plot the gaps. — Acceptance: three curves with measured lag, and a statement of which one a payments product should trust.
- kind: read — Read the Standard Rollup Charter and produce a checklist a chain would have to satisfy; then check one real chain in the superchain-registry against it. — Acceptance: a completed checklist with the chain's actual `superchain_level` and the specific items it does or does not meet.
- kind: implement — Write a script that reads the superchain-registry repo and outputs every chain with its `superchain_level`, DA setting, and gas token. — Acceptance: a table showing that "OP Stack chain" spans rollups and non-rollups.
- kind: read — Read the interop spec and write, precisely, what a destination chain must do before it may include an executing message. — Acceptance: the answer correctly states that the initiating message must be reproduced from the source chain.
- kind: write — Write the ops runbook for the chain you deployed: who runs the challenger, who holds the upgrade key, what happens on a contract release, and how a user exits. — Acceptance: a named owner for every item.

### Visual opportunities

- **The derivation pipeline as a function**: L1 blocks in → deterministic L2 blocks out, with the sequencer drawn *outside* the function to show it only influences the input. This is the diagram that makes "no L2 consensus" click.
- **The three heads on one timeline**: unsafe / safe / finalized, with the events that promote a block between them.
- **The full component map of a running chain**: op-geth, op-node, batcher, proposer, challenger, L1 contracts — with the arrows labelled by what data flows and who is trusted.
- **A cross-chain interop message**: initiating log on chain A → executing message on chain B, with the "cannot advance until reproduced" constraint drawn as a gate.
- **Superchain as concentric rings**: registry members → standard rollups (`superchain_level = 2`) → interop mesh participants, so students see these are three different memberships.

### Gaps & uncertainties

- **The current latest `op-contracts` release as of Aug 2026 is UNRESOLVED.** The most recent one confirmed in this session's research is `op-contracts/v7.0.0` ("Karst", Upgrade 19b, 2026-06-25) via a secondary summary of L2BEAT. **Check the GitHub releases page before pinning a version in a lesson.**
- **Superchain interop's mainnet production status is UNRESOLVED.** Docs say "in active development and available for testing"; whether any mainnet chains are live on it in Aug 2026 was not confirmed.
- I did not verify the current number of chains in the Superchain Registry, nor how many are `superchain_level = 2`. Both are easy to read live from the repo and should be, at authoring time.
- Whether shared sequencing (Espresso) has shipped for the Superchain is UNRESOLVED — see 09.2's gaps; the two modules must not contradict each other.
- The current OP Stack sequencing-window value post-Karst was not re-verified (see 09.6 gaps).
- RaaS provider specifics (Conduit, Alchemy, Gelato, Caldera) did not surface in primary sources here; no claims are made about their market positions.
- Exact `op-node`/`op-geth` version numbers were not pinned; the releases page is the source.

## 09.9 — Arbitrum Stylus: Rust/C++ alongside the EVM, interop, gas model, realistic use cases

> **Verification status: VERIFIED from Arbitrum's own docs**, fetched directly this session.
> **Two Arbitrum doc pages give different contract size limits** — flagged in Gaps, not reconciled.

### Concepts

- `stylus` — An Arbitrum Nitro upgrade (from ArbOS 32) adding a second, coequal WASM VM so contracts written in Rust, C, or C++ run on the same chain and state as Solidity contracts. | requires: [rollup]
- `coequal-wasm-vm` — Stylus does not replace or transpile to the EVM; it runs a separate WASM VM sharing the same state, accounts, and storage. | requires: [stylus] | contrasts: [evm]
- `stylus-solidity-interop` — Solidity can call a Stylus contract and vice versa using ordinary ABI calls; from the caller's side there is no observable difference. | requires: [coequal-wasm-vm]
- `abi-is-the-boundary` — Interop works because both VMs speak the same ABI and address space; `cargo stylus export-abi` emits a Solidity interface for a Rust contract. | requires: [stylus-solidity-interop]
- `ink` — Stylus's fine-grained metering unit for WASM instructions, thousands of times smaller than gas, converted to gas at execution time. | requires: [stylus]
- `compute-is-cheap-storage-is-not` — Stylus makes compute roughly 10–100x cheaper, but **storage reads and writes cost the same gas as the EVM**; the saving is only on computation. | requires: [ink]
- `activation` — Stylus code must be activated once on-chain: the WASM is compiled to native code and cached, which is why execution is fast but deployment has an extra step and cost. | requires: [stylus]
- `reactivation` — Activated programs expire and must be reactivated periodically or after chain upgrades; a deployed Stylus contract is not permanently live the way a Solidity one is. | requires: [activation]
- `page-based-memory` — Stylus memory grows in 64 KB pages with near-linear cost, versus the EVM's 32-byte words with quadratic expansion cost — the reason memory-heavy algorithms become feasible. | requires: [stylus] | contrasts: [evm-memory-quadratic]
- `stylus-storage-caching` — The SDK caches repeated storage reads within a call and flushes at call boundaries, so repeated reads are cheaper than in Solidity. | requires: [compute-is-cheap-storage-is-not]
- `missing-evm-features` — Stylus has no inline assembly, no `selfdestruct`, and no Solidity modifiers; idioms ported straight from Solidity will not compile. | requires: [coequal-wasm-vm]
- `stylus-use-case-shape` — Stylus wins where the workload is compute- or memory-bound (ZK verification, custom cryptography, exotic pricing curves, on-chain games/generative art) and wins nothing where the workload is storage-bound (typical ERC-20, ERC-721, vault accounting). | requires: [compute-is-cheap-storage-is-not, page-based-memory]
- `rust-does-not-mean-safe-contracts` — Rust removes memory-safety bugs, not blockchain bugs; reentrancy, access control, and oracle manipulation are unchanged, and the audit ecosystem for WASM contracts is far thinner than for Solidity. | requires: [stylus]

### Primary sources

- [A gentle introduction to Stylus](https://docs.arbitrum.io/stylus/gentle-introduction) — tier: canonical-docs — published: 2026 — the official use-case list and the headline numbers; fetched directly.
- [VM and execution differences](https://docs.arbitrum.io/stylus/concepts/vm-differences) — tier: canonical-docs — published: 2026 — **the single most important page for this module**: storage caching, page memory, activation, size limits, and the missing EVM features; fetched directly.
- [Gas and ink in Stylus](https://docs.arbitrum.io/stylus/concepts/stylus-gas) — tier: canonical-docs — published: 2026 — how ink converts to gas.
- [Gas metering](https://docs.arbitrum.io/stylus/concepts/gas-metering) — tier: canonical-docs — published: 2026 — per-instruction metering detail.
- [Quickstart: write a smart contract in Rust using Stylus](https://docs.arbitrum.io/stylus/quickstart) — tier: canonical-docs — published: 2026 — the hands-on path.
- [OffchainLabs/stylus-sdk-rs](https://github.com/OffchainLabs/stylus-sdk-rs) — tier: canonical-docs — published: live — the SDK; version-pin source.
- [OffchainLabs/cargo-stylus](https://github.com/OffchainLabs/cargo-stylus) — tier: canonical-docs — published: live — `cargo stylus check` / `deploy` / `export-abi`.
- [Troubleshooting Stylus](https://docs.arbitrum.io/stylus/troubleshooting-building-stylus) — tier: canonical-docs — published: live — the real friction list; useful for setting expectations honestly.
- [How to add a new programming language to Stylus](https://docs.arbitrum.io/stylus/how-tos/adding-support-for-new-languages) — tier: canonical-docs — published: live — shows the boundary is WASM, not Rust.
- [Arbitrum Stylus](https://arbitrum.io/stylus) — tier: canonical-docs (vendor marketing) — the 10–100x claim's origin; treat the number as vendor-sourced.

### Current state (Aug 2026)

- **Stylus shipped as an ArbOS upgrade (from ArbOS 32)** and runs on Arbitrum One, Arbitrum Nova, and Arbitrum chains. Docs were updated through July 2026, so it is actively maintained rather than an experiment.
- **`MaxWasmSize` default is 128 KB, raised to 256 KB at ArbOS61+** for decompressed WASM. This is the most recent version-specific fact found.
- **Verified gas facts:** compute is roughly 10–100x cheaper depending on the program; **storage reads and writes cost the same gas as the EVM**; memory is priced per 64 KB page near-linearly rather than quadratically; programs may use up to 8 MB of memory.
- **Commonly taught and now wrong:** "Stylus is Rust compiled to EVM bytecode." It is not — it is a second WASM VM running alongside the EVM on the same state.
- **Also now wrong:** "Stylus makes everything cheaper." Storage costs are identical, so a standard token or vault sees essentially no benefit and pays the activation overhead for nothing.
- **Under-taught:** the **activation and reactivation lifecycle**. A Stylus contract requires a one-time on-chain compilation, and needs reactivating periodically or after chain upgrades. This is an operational obligation Solidity developers have no equivalent for and it belongs in any deployment runbook.
- Stylus remains an Arbitrum-family feature; it is not portable to other L2s.

### Misconceptions

- Belief: Stylus replaces the EVM on Arbitrum. | Reality: it is a second, coequal WASM VM; Solidity contracts are unaffected and the two call each other freely. | Why: "new VM" reads as "migration". | Source: https://docs.arbitrum.io/stylus/gentle-introduction
- Belief: Writing contracts in Rust makes them safer. | Reality: Rust eliminates memory-safety bugs, which were never the cause of DeFi losses; reentrancy, access control, and oracle bugs are identical. Access control dominates real losses regardless of language. | Why: Rust's safety reputation transfers by association.
- Belief: Stylus makes my ERC-20 much cheaper. | Reality: a token is storage-bound and storage costs the same; you gain nothing and add an activation step. | Why: "10–100x cheaper" is quoted without "compute". | Source: https://docs.arbitrum.io/stylus/concepts/vm-differences
- Belief: A deployed Stylus contract stays live forever like a Solidity one. | Reality: activated programs need reactivation periodically and after upgrades. | Why: EVM deployment is genuinely permanent, so nobody thinks to ask. | Source: https://docs.arbitrum.io/stylus/gentle-introduction
- Belief: I can port my Solidity contract to Rust mechanically. | Reality: no inline assembly, no `selfdestruct`, no modifiers; storage layout and idioms differ. | Source: https://docs.arbitrum.io/stylus/concepts/vm-differences
- Belief: Calling a Rust contract from Solidity needs special tooling. | Reality: it is an ordinary ABI call; `cargo stylus export-abi` gives you the Solidity interface to import. | Source: https://github.com/OffchainLabs/cargo-stylus
- Belief: Stylus only supports Rust. | Reality: anything compiling to WASM — Rust, C, C++ — with a documented path for adding languages. | Source: https://docs.arbitrum.io/stylus/how-tos/adding-support-for-new-languages

### Practice ideas

- kind: implement — Write the same contract twice: once in Solidity, once in Rust with the Stylus SDK. Pick something compute-heavy (e.g. a keccak or Poseidon loop, or a fixed-point curve evaluation). Deploy both to Arbitrum Sepolia. — Acceptance: measured gas for both, with the ratio reported and the compute/storage split identified.
- kind: measure — Extend the above with a storage-heavy contract (a mapping write loop) and measure again. — Acceptance: a two-row table demonstrating that the storage case shows little or no saving; the student can state why in one sentence.
- kind: implement — Deploy a Rust Stylus contract, run `cargo stylus export-abi`, and call it from a Solidity contract using the generated interface. — Acceptance: a Foundry test on a fork where Solidity successfully calls the Rust contract and reads a return value.
- kind: measure — Measure the cost of activation itself, and record what the docs say about reactivation cadence. — Acceptance: an activation cost number from a real testnet deployment plus a stated operational obligation.
- kind: break — Write a Rust Stylus contract with a classic reentrancy bug (external call before state update) and exploit it. — Acceptance: the exploit succeeds, demonstrating that Rust's safety guarantees do not cover it; then fix with a checks-effects-interactions ordering.
- kind: read — Read the VM differences page and write the list of Solidity idioms that will not survive a port. — Acceptance: at least four, each with what you would do instead.
- kind: write — Given a product spec (an AMM with a custom curve, plus a standard token), write the decision memo on which components should be Stylus and which Solidity. — Acceptance: the split follows compute-bound vs storage-bound, and names the added operational cost of the Stylus half.

### Visual opportunities

- **Two VMs, one state**: EVM and WASM VM side by side over a shared account/storage layer, with ABI calls crossing between them. This kills the "Stylus replaces the EVM" misconception in one image.
- **Cost profile comparison**: two stacked bars (compute / memory / storage) for the same workload in Solidity and Stylus — the compute band shrinks dramatically, the storage band does not move at all.
- **Memory cost curves**: EVM's quadratic expansion against Stylus's linear per-page cost, with the crossover marked.
- **The Stylus contract lifecycle**: write Rust → compile to WASM → deploy → **activate** (compile to native, cache) → execute → **reactivate**, with the two extra boxes highlighted as the thing Solidity developers will forget.
- **A decision flowchart**: is the hot path compute-bound? → Stylus. Storage-bound? → Solidity. Mixed? → split at the ABI boundary.

### Gaps & uncertainties

- **Two Arbitrum doc pages give different size limits and I did not reconcile them.** The gentle introduction says "the maximum size of a Stylus contract is 96 KB — four times the limit for Solidity contracts"; the VM-differences page says `MaxWasmSize` defaults to **128 KB**, raised to **256 KB at ArbOS61+**, bounding the *decompressed* WASM. These plausibly measure different things (on-chain compressed size vs decompressed WASM bound), but **sources disagree on the headline number and I am not picking one.**
- **The reactivation cadence is unclear from the docs as read.** The gentle introduction states contracts need reactivation "annually or after upgrades" and mentions "a minimum age of about 31 days before a contract can be kept alive" — the latter phrasing is ambiguous and I could not determine what it means operationally. **Verify before teaching.**
- **The "10–100x cheaper compute" figure is vendor-sourced** (Arbitrum's own docs and marketing). No independent benchmark was found. Treat as a range and have students measure it themselves.
- **Activation cost in gas or ETH is UNVERIFIED** — no number found; the practice exercise is written to have students measure it.
- **Current `stylus-sdk-rs` and `cargo-stylus` versions were NOT pinned.** Check the GitHub repos before writing version-specific instructions.
- **Which ArbOS version Arbitrum One currently runs in Aug 2026 is UNRESOLVED**, which matters because the 256 KB limit is ArbOS61+ gated.
- **Real production usage is unverified.** I found no data on how many mainnet Stylus contracts exist or how much value they secure. Given the audit ecosystem for WASM contracts is much thinner than for Solidity, this is a material honesty point for the module and should be researched before recommending Stylus for anything holding funds.
- Whether Stylus reentrancy protection is on or off by default in the SDK was **not determined** — the VM-differences page does not cover it. Check the SDK docs; this materially affects the "break" exercise above.

