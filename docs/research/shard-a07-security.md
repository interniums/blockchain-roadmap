# Shard A07 — Track 06: Security remainder

Research shard for a blockchain curriculum. Raw material, not lesson prose.
Compiled 25 August 2026.

## Status log
- [x] 06.1 — threat modeling
- [x] 06.3 — exploit archaeology
- [x] 06.5 — fuzzing for bugs
- [x] 06.6 — formal verification
- [x] 06.7 — audit craft
- [x] 06.8 — competitive contests

---

## 06.1 — Threat modeling

> Framing for the author: threat modeling is the **design-time** counterpart to 06.2's
> vulnerability catalogue. 06.2 asks "what bugs exist"; 06.1 asks "what would I have to
> believe for this system to be safe, and who can falsify those beliefs". The Bybit hack
> ($1.5B, Feb 2025) is the anchor case because **not a single Solidity bug was involved** —
> every failure was at a trust boundary outside the contract.

### Concepts

- `trust-zone` — A group of components sharing purpose, ownership, or blast radius, treated as equally trusted internally. | requires: [] | contrasts: [trust-boundary]
- `trust-boundary` — The edge between two trust zones, where authentication or authorization must happen because privilege changes. | requires: [trust-zone] | contrasts: [contract-boundary]
- `contract-boundary` — The Solidity `external`/`public` surface; a *subset* of the protocol's trust boundaries, and usually the least interesting one. | requires: [trust-boundary]
- `actor-enumeration` — Listing every party that can touch the system — users, admins, keepers, sequencers, relayers, oracles, MEV searchers, and attackers — before reasoning about any of them. | requires: [trust-zone]
- `capability-not-role` — Model what an actor *can cause to happen*, not the job title in the docs; "the multisig" is a role, "can replace the implementation with arbitrary code in one tx" is a capability. | requires: [actor-enumeration] | contrasts: [access-control-failure]
- `trust-assumption-inventory` — The explicit list of things assumed honest, live, or correct: oracle feeds, admin keys, upgrade paths, bridges, off-chain relayers, block builders. | requires: [actor-enumeration]
- `data-flow-crossing` — Every point where data moves across a trust boundary is a place to ask what happens if that data is attacker-chosen. | requires: [trust-boundary]
- `invariant-as-spec` — A statement that must hold on every state and every path; the machine-checkable form of a security requirement. | requires: [] | contrasts: [unit-test-as-spec]
- `function-level-invariant` — A property of a single computation with no state change, e.g. a pure pricing function is monotonic. | requires: [invariant-as-spec]
- `system-level-invariant` — A property spanning contracts and state transitions, e.g. sum of balances equals total supply, or protocol solvency never decreases outside of fees. | requires: [invariant-as-spec] | contrasts: [function-level-invariant]
- `invariant-driven-development` — Writing the invariants first, then letting fuzzers, formal tools, and runtime monitors all consume the same statements. | requires: [system-level-invariant]
- `threat-scenario` — A named attack story tied to one boundary crossing plus one violated assumption, with an impact and a mitigation, rather than a free-floating "what if". | requires: [data-flow-crossing, capability-not-role]
- `threat-model-document` — The living artifact: component inventory, trust-zone diagram, data-flow map, assumption list, scenario table, and residual-risk statement. | requires: [threat-scenario, trust-assumption-inventory]
- `threat-model-cadence` — The model is refreshed quarterly-to-semiannually and after any architecture change, feature launch, or operational change — otherwise it describes a system that no longer exists. | requires: [threat-model-document]
- `blind-signing` — A signer approving a transaction whose real effect they cannot see; the Bybit root cause, and a boundary failure invisible to contract-level review. | requires: [trust-boundary]
- `offchain-attack-surface` — Workstations, CI, frontends, signing UIs, and deployment pipelines are inside the protocol's trust perimeter even though they contain no Solidity. | requires: [trust-zone]

### Primary sources

- [How Threat Modeling Could Have Prevented the $1.5B Bybit Hack](https://blog.trailofbits.com/2025/02/25/how-threat-modeling-could-have-prevented-the-1.5b-bybit-hack/) — tier: primary-analysis (vendor: Trail of Bits) — published: 2025-02 — the single best teaching text for this module: defines trust zones, boundaries, actor analysis, data-flow analysis, and maps four specific control failures (endpoint security, single verification interface / blind signing, `delegatecall` in the Safe configuration, missing air-gapped signing) onto the largest crypto theft on record.
- [The call for invariant-driven development](https://blog.trailofbits.com/2025/02/12/the-call-for-invariant-driven-development/) — tier: primary-analysis (vendor: Trail of Bits) — published: 2025-02 — defines invariants as "statements about a program that must always hold, regardless of its state or execution path"; splits function-level vs system-level; names the toolchain (Echidna, Medusa, Foundry, Halmos, Certora, KEVM) and the monitoring tier (Hexagate, Tenderly). This is the bridge into 06.5 and 06.6.
- [Building Secure Smart Contracts (handbook)](https://trailofbits.com/guides/building-secure-smart-contracts/) — tier: canonical-docs (vendor) — free, continuously updated; also published as an AI-agent skill. The repo is `crytic/building-secure-contracts`.
- [SCSVS v1.2 — V1 Architecture, Design and Threat Modelling](https://github.com/securing/SCSVS/blob/master/1.2/0x10-V1-Architecture-Design-Threat-modelling.md) — tier: canonical-docs — the checklist form of this module; V1 is specifically the architecture/threat-modelling control family. Now absorbed into the OWASP SCSVS/SCSTG line alongside the 2026 Smart Contract Top 10.
- [Demystifying Invariant Effectiveness for Securing Smart Contracts (Trace2Inv, FSE'24)](https://arxiv.org/pdf/2404.14580) — tier: primary-analysis (peer-reviewed) — published: 2024-04 — empirical study of which invariant classes actually would have stopped real exploits, and at what gas cost. Use it to avoid teaching invariants as universally effective.
- [Maturing your smart contracts beyond private key risk](https://blog.trailofbits.com/2025/06/25/maturing-your-smart-contracts-beyond-private-key-risk/) — tier: primary-analysis (vendor) — published: 2025-06 — treats the admin key itself as the threat model's centre of gravity.
- [NIST SP 800-53](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final) — tier: spec — the control catalogue Trail of Bits draws its boundary controls from; worth knowing exists, not worth reading cover to cover.

### Current state (Aug 2026)

- **Threat modeling moved from "nice to have" to the framing of top-tier engagements after Bybit (Feb 2025).** The Bybit loss (~$1.46–1.5B, Safe{Wallet} front-end compromise attributed to DPRK-linked actors) is the reason: the contracts were fine, the boundary was not. Any 2024-or-earlier curriculum that scopes threat modeling to "the contracts" is now wrong.
- **Invariant-driven development is the dominant 2025–26 framing** and it deliberately unifies three previously separate activities: fuzzing (06.5), formal verification (06.6), and runtime monitoring. The same invariant text feeds Echidna/Medusa, Halmos/Certora, and a Hexagate/Tenderly alert.
- **The 2025 loss data reinforces the module's thesis:** access control leads by value, and access control is a *threat-model* failure, not a coding failure. (See shared baseline: 122 incidents, $905.4M in 2025.)
- **EIP-7702 changed one standard threat-model assumption.** `msg.sender == tx.origin` no longer implies "not a contract", and an EOA in your actor list may now execute arbitrary delegated code. Any threat model written before Pectra (May 2025) that leans on EOA-vs-contract distinction needs revisiting.
- Standards consolidation: SCSVS/SCSTG and the OWASP Smart Contract Top 10 (2026) are converging into one referenceable set, which makes "which checklist" a less useful argument than it was in 2023.

### Misconceptions

- Belief: Threat modeling is about the smart contracts. | Reality: the contract surface is one trust boundary among many — signing UIs, workstations, CI, oracles, bridges, and deployment keys are all inside the perimeter. | Why: contracts are the visible, auditable part, so they absorb all the attention. | Source: https://blog.trailofbits.com/2025/02/25/how-threat-modeling-could-have-prevented-the-1.5b-bybit-hack/
- Belief: A threat model is a document you write once before launch. | Reality: it decays; Trail of Bits recommends refreshing quarterly or semi-annually and after any architectural, feature, or operational change. | Why: the artifact looks like a deliverable rather than a process. | Source: https://blog.trailofbits.com/2025/02/25/how-threat-modeling-could-have-prevented-the-1.5b-bybit-hack/
- Belief: Listing roles (owner, user, keeper) is actor enumeration. | Reality: roles hide capabilities; you need "what can this party cause", including combinations and the attacker who compromises one of them. | Why: role lists come free from the code's modifiers, so they feel complete.
- Belief: Invariants are a testing technique. | Reality: they are the *specification*; testing, formal verification, and monitoring are three consumers of the same statement. | Why: most people meet invariants first as `invariant_` functions in a fuzz harness. | Source: https://blog.trailofbits.com/2025/02/12/the-call-for-invariant-driven-development/
- Belief: If an invariant holds, the protocol is safe. | Reality: Trace2Inv found invariant effectiveness varies sharply by class, and some invariants that would stop an exploit cost prohibitive gas to enforce on-chain. | Why: the word "invariant" implies totality. | Source: https://arxiv.org/pdf/2404.14580
- Belief: "Trusted" means "assumed benign". | Reality: trusted means "if it misbehaves, you lose"; the point of listing trust assumptions is to price them, not to bless them.

### Practice ideas

- kind: write — Build a threat model document for a small real protocol you did not write (pick a ~500-line Foundry repo, e.g. a staking vault). Produce: component inventory, trust-zone diagram, data-flow map with every boundary crossing numbered, actor/capability table, trust-assumption list, and 8+ threat scenarios each tied to one crossing. — Acceptance: at least three scenarios that no static analyser could have surfaced, and one that lives entirely off-chain.
- kind: write — Convert three prose security requirements from a protocol's docs into machine-checkable invariants, one function-level and two system-level, and state for each whether a fuzzer, a prover, or a monitor is the right consumer. — Acceptance: each invariant is a single boolean over state, with no "should" or "usually".
- kind: break — Take a contract that relies on `require(msg.sender == tx.origin)` as an anti-contract guard and defeat it with an EIP-7702 delegation. — Acceptance: a Foundry test on a Pectra-or-later fork where a delegated EOA passes the guard and executes contract logic.
- kind: read — Read the Bybit post-mortem chain and re-derive the four failed controls yourself before reading the Trail of Bits list. — Acceptance: written list compared against theirs, with the gaps named.
- kind: measure — Instrument one system-level invariant as a runtime check and measure its gas cost on a realistic call, then argue whether it belongs on-chain, in a fuzz harness, or in a monitor. — Acceptance: a gas number and a defended placement decision.

### Visual opportunities

- **Trust-zone map with numbered boundary crossings** for one protocol — the single highest-value diagram in the whole security track. Each numbered crossing then indexes a row in the scenario table.
- **Bybit kill chain as a boundary diagram**: developer workstation → Safe{Wallet} front-end → signer's screen → signed `delegatecall` → wallet implementation replaced. Shows the entire loss happening left of the contract.
- **Actor × capability matrix** (rows = actors, columns = capabilities, cells = allowed/forbidden/unclear) — the "unclear" cells are the findings.
- **One invariant, three consumers**: the same statement rendered as an Echidna property, a Certora rule, and a monitoring alert, side by side. Sets up 06.5 and 06.6.
- **Trust-assumption dependency graph**: what breaks downstream if the oracle, the sequencer, or the upgrade key fails.

### Gaps & uncertainties

- **Bybit loss figure**: commonly reported as ~$1.46B and also as $1.5B (Trail of Bits' own title uses $1.5B). These are the same event valued at different ETH prices/times. Do not present a precise figure without a timestamped source.
- No single canonical, non-vendor threat-modeling methodology exists for protocols. Trail of Bits' framing is the best-documented, but it is vendor-published; STRIDE and NIST 800-53 are the general-IT ancestors and map imperfectly onto adversarial, permissionless, economically-motivated systems.
- **SCSVS versioning is unclear.** The `securing/SCSVS` repo's 1.2 is the version I could confirm; the OWASP-branded SCSVS/SCSTG lineage and its current version number were NOT verified. Do not pin a version in a lesson without checking.
- Trace2Inv's effectiveness percentages were not read in detail here — I confirmed the paper's existence and thesis, not its specific numbers.
- Whether "threat model" as a required deliverable is now standard in top-tier audit engagements is an impression from vendor marketing pages, not something I verified against a sample of 2026 audit reports.

---

## 06.3 — Exploit archaeology

> Selection rule used: **depth of available analysis beats fame.** Several famous incidents
> (Ronin, Poly Network) have thin technical coverage because the interesting part was
> operational, not code. Several less-famous ones (Balancer V2, Cetus, Cork) have excellent
> line-level write-ups. Each entry below names the vulnerability class and the one lesson
> that is hard to learn any other way.
>
> **Verification tags:** `[V]` = the linked write-up was surfaced and confirmed in this
> session. `[U]` = incident is well-established but I did **not** verify the exact URL —
> author must check the link before publishing.

### Concepts

- `post-mortem-reading` — Reading an incident write-up is a distinct skill: reconstruct the attacker's transaction, then the invariant it violated, then the design decision that permitted it. | requires: [invariant-as-spec]
- `root-cause-vs-proximate-cause` — The failing line is rarely the root cause; the root cause is the assumption that made that line reachable. | requires: [post-mortem-reading] | contrasts: [exploit-chain]
- `attacker-economics` — Every exploit has a capital cost, a gas cost, and a laundering path; attacks that are technically possible but economically unattractive stay theoretical. | requires: [flash-loan-amplification]
- `rounding-direction-invariant` — Every scaling and division must round in the protocol's favour, consistently, in both directions; a single inverted rounding is a $100M-class bug. | requires: [precision-rounding-bug]
- `toolchain-trust` — The compiler, the library, and the deployment script are part of the trusted computing base; Vyper's broken reentrancy lock proves reviewing only your own source is insufficient. | requires: [trust-assumption-inventory]
- `bridge-message-authority` — In a lock/mint bridge, the cross-chain message *is* the authorization; whoever can forge or mis-verify one message can mint unbacked supply. | requires: [trust-boundary]
- `verifier-quorum-collapse` — A "decentralized" verification set configured as 1-of-1 has the security of one machine, regardless of the protocol's design capability. | requires: [bridge-message-authority]
- `governance-capture` — Acquiring voting power with borrowed capital, or exercising an emergency power, converts governance into an attack primitive. | requires: [capability-not-role]
- `signer-ui-compromise` — When the signing interface lies, multisig thresholds provide no defence, because all signers see the same lie. | requires: [blind-signing]
- `donation-attack` — Pushing assets into a contract without going through its accounting entry point, breaking a ratio or a health check. | requires: [system-level-invariant]
- `cross-protocol-reentrancy` — Re-entering through a *third* protocol that shares state or price with the target; guards are per-contract, invariants are per-system. | requires: [cross-function-reentrancy]
- `recovery-and-negotiation` — Post-exploit outcomes (Euler's full return, Balancer's partial recovery, Nomad's whitehat pool) are part of the incident and shape how protocols design pause/clawback powers. | requires: [governance-capture]
- `copycat-window` — Once a transaction is public, unsophisticated actors replay it with the address swapped; Nomad turned into a public free-for-all within minutes. | requires: [post-mortem-reading]
- `dprk-threat-actor` — A state-level actor with malware, social engineering, and long dwell time is now the dominant loss driver, and it targets people and infrastructure, not Solidity. | requires: [offchain-attack-surface]

### The study list (20 incidents)

**Tier 1 — study line by line**

1. **The DAO (Jun 2016, ~3.6M ETH)** — class: classic reentrancy. Teaches: checks-effects-interactions from first principles, and that a chain-level response (the fork) is the last resort. `[U]` [Analysis of the DAO exploit — Phil Daian](https://hackingdistributed.com/2016/06/18/analysis-of-the-dao-exploit/) — tier: primary-analysis — published: 2016-06.
2. **Parity multisig, both incidents (Jul + Nov 2017)** — class: uninitialized proxy / `delegatecall` + `selfdestruct`. Teaches: library-vs-instance state, initialization as an attack surface, and that "freeze" is a loss mode too (~513k ETH bricked). `[U]` [Parity Wallet Hack Explained — OpenZeppelin](https://blog.openzeppelin.com/on-the-parity-wallet-multisig-hack-405a8c12e8f7) — tier: primary-analysis — published: 2017-07.
3. **Euler Finance (Mar 2023, ~$197M)** — class: missing health check on `donateToReserves` + liquidation discount logic. Teaches: a single unchecked path in an otherwise heavily-audited, formally-verified protocol; also the best-documented full-recovery negotiation. `[U]` — look for the Omniscia and Certora/Sherlock analyses plus Euler's own post-mortem — tier: primary-analysis.
4. **Curve / Vyper reentrancy 0-day (Jul 2023, ~$70M)** — class: compiler bug; the `@nonreentrant` lock was silently broken in Vyper 0.2.15/0.2.16/0.3.0. Teaches: `toolchain-trust` — correct source, broken binary. `[V]` [Curve Finance Analysis and Post-mortem — ChainLight](https://medium.com/chainlight/curve-finance-analysis-and-post-mortem-ba55f2b26909) — tier: primary-analysis — published: 2023-08. Also `[V]` [Highland Security post-mortem](https://www.highlandsecurity.io/post/post-mortem-vyper-reentrancy-0-day-what-we-know-so-far).
5. **Balancer V2 Composable Stable Pools (3 Nov 2025, ~$125–128M)** — class: rounding-direction inconsistency in `_upscaleArray`/downscale around the stable invariant `D`, amplified by `batchSwap`. Teaches: the best modern lesson on `rounding-direction-invariant`; ~65 micro-swaps executed inside a constructor compounded sub-wei error into nine figures, and it propagated to forks on Ethereum, Base, Polygon and Arbitrum. `[V]` [In-Depth Analysis: The Balancer V2 Exploit — BlockSec](https://blocksec.com/blog/in-depth-analysis-the-balancer-v2-exploit) — tier: primary-analysis — published: 2025-11. Cross-read `[V]` [OpenZeppelin](https://www.openzeppelin.com/news/understanding-the-balancer-v2-exploit), `[V]` [Check Point Research](https://research.checkpoint.com/2025/how-an-attacker-drained-128m-from-balancer-through-rounding-error-exploitation/), `[V]` [Coinspect: rate manipulation framing](https://www.coinspect.com/blog/balancer-rate-manipulation-exploit/) — three firms, three different framings of the same bug, which is itself the lesson.
6. **Bybit (21 Feb 2025, ~$1.4–1.5B)** — class: signing-interface compromise + `delegatecall`. Teaches: the largest theft in the industry's history involved zero contract vulnerabilities. `[V]` [Trail of Bits threat-model analysis](https://blog.trailofbits.com/2025/02/25/how-threat-modeling-could-have-prevented-the-1.5b-bybit-hack/) — tier: primary-analysis — published: 2025-02.
7. **Kelp DAO rsETH / LayerZero OFT bridge (18 Apr 2026, ~$290–292M)** — class: `verifier-quorum-collapse` + RPC infrastructure poisoning. Teaches: the protocol supported N-of-M DVNs; the *deployment* used 1-of-1, so forged cross-chain messages released rsETH with no source-chain burn. Configuration, not code. Wrapped ETH stranded across ~20 chains. Attributed to DPRK-linked actors. `[V]` [BlockSec: The Decentralization Dilemma — cascading risk and emergency power in the Kelp DAO crisis](https://blocksec.com/blog/the-decentralization-dilemma-cascading-risk-and-emergency-power-in-the-kelp-dao-crisis) — tier: primary-analysis — published: 2026-04. Also `[V]` [Halborn explainer](https://www.halborn.com/blog/post/explained-the-kelp-dao-hack-april-2026), `[V]` [Innora forensic analysis](https://innora.ai/blog/kelp-dao-layerzero-292m-exploit-forensic-analysis).
8. **Nomad Bridge (1 Aug 2022, ~$190M)** — class: initialization bug — a trusted root set to `0x00` made every message "proven". Teaches: `copycat-window`; hundreds of non-technical addresses copy-pasted the exploit tx with the recipient swapped. `[U]` — the canonical narrative is samczsun's thread plus the Nomad post-mortem — tier: primary-analysis.

**Tier 2 — read carefully, then move on**

9. **Wormhole (Feb 2022, ~$325M)** — class: signature-verification bypass on Solana (unvalidated sysvar account in `verify_signatures`). Teaches: guardian-set verification is only as good as the account validation around it. `[U]`
10. **Beanstalk (Apr 2022, ~$181M)** — class: flash-loan governance capture with an emergency-execute path. Teaches: `governance-capture`, and why voting power must be time-weighted or snapshot-delayed. `[U]`
11. **Fei / Rari Fuse (Apr 2022, ~$80M)** — class: cross-protocol reentrancy via ERC777 callback into a shared Compound-fork oracle path. Teaches: `cross-protocol-reentrancy` — a per-contract guard could not have helped. `[U]`
12. **Mango Markets (Oct 2022, ~$114M)** — class: oracle/market manipulation on a thin market, then borrowing against the inflated position. Teaches: `attacker-economics` and the legal grey zone — the attacker publicly argued it was "profitable trading". `[U]`
13. **KyberSwap Elastic (Nov 2023, ~$48M)** — class: precision/tick-boundary math in concentrated liquidity, exploited by moving price exactly onto a boundary. Teaches: invariants that hold in the interior can fail at the domain edge. `[U]`
14. **Radiant Capital (Oct 2024, ~$50M)** — class: DPRK malware on developer machines producing correct-looking signing UIs. Teaches: the direct rehearsal for Bybit; multisig ≠ defence when every signer sees the same forged payload. `[U]`
15. **Cetus (Sui, May 2025, ~$220M)** — class: integer/overflow bug in Move liquidity math (a mis-specified shift/mask check) letting a near-zero deposit mint enormous liquidity. Teaches: non-EVM VMs do not inherit EVM's arithmetic habits; Move's `u256` shifts have their own footguns. Also teaches chain-level intervention — validators froze attacker funds. `[U]` — details NOT verified this session.
16. **Cork Protocol (28 May 2025, ~$12M)** — class: market/hook manipulation letting an attacker mint redemption assets against a market they controlled. Teaches: an unusually clear, self-published, engineer-written post-mortem — a model of the format. `[V]` [Cork post-mortem](https://www.cork.tech/blog/post-mortem) — tier: primary-analysis — published: 2025-06.
17. **GMX v1 (Jul 2025, ~$40M)** — class: reentrancy into short-position accounting to inflate GLP price during a redeem. Teaches: reentrancy is not dead — it re-emerges wherever a price is computed from mutable in-flight state. `[U]` — figure and mechanism NOT verified this session.
18. **Drift Protocol (Solana, 1 Apr 2026, ~$285M)** — class: governance-structure weakness rather than a code exploit. Teaches: pairs with Kelp DAO to make the 2026 point — the two largest incidents of the year were both governance/configuration, not Solidity. `[V]` context only, via [Travers Smith on 2026 DeFi exploits and recovery](https://www.traverssmith.com/knowledge/knowledge-container/defi-exploits-on-chain-interventions-and-the-private-key-recent-developments-in-crypto-asset-recovery/) — mechanism NOT verified.
19. **Ronin Bridge (Mar 2022, ~$625M)** — class: validator key compromise, 5-of-9 threshold with 4 keys on one operator plus one delegated. Teaches: threshold arithmetic is meaningless if the keys are correlated; also that the theft went unnoticed for six days. `[U]`
20. **bZx (Feb 2020, two incidents, ~$1M)** — class: the original flash-loan-plus-oracle attack. Teaches: small loss, enormous influence — this is where `flash-loan-amplification` entered the vocabulary, and palkeo's transaction-level walkthrough is still one of the best teaching artifacts in the space. `[U]`

### Primary sources (indexes and corpora)

- [pcaversaccio/reentrancy-attacks](https://github.com/pcaversaccio/reentrancy-attacks) — tier: canonical-docs — a chronological, maintained list of every reentrancy attack with links. `[V]`
- [ChainSec — documented timeline of DeFi exploits](https://www.chainsec.io/defi-hacks) — tier: secondary — broad index, useful for finding candidates; verify each entry's numbers elsewhere. `[V]`
- [BlockSec blog — weekly Web3 security incident roundup](https://blocksec.com/blog/weekly-web3-security-incident-roundup-apr-13-apr-19-2026) — tier: primary-analysis (vendor) — the weekly roundup series is the best cadence source for 2025–26 incidents. `[V]`
- [rekt.news](https://rekt.news/) — tier: secondary — the leaderboard is the standard index; the prose is editorial, so use it to find incidents, not to learn mechanisms. `[U]`
- [Immunefi / DeFi hack analyses (`immunefi-team/Web3-Security-Library`)](https://github.com/immunefi-team/Web3-Security-Library) — tier: secondary — curated links to write-ups and PoCs. `[U]`
- [SunWeb3Sec/DeFiHackLabs](https://github.com/SunWeb3Sec/DeFiHackLabs) — tier: primary-analysis — **the single most useful artifact for this module**: runnable Foundry PoCs reproducing hundreds of historical exploits against forked mainnet state. `[U]` — repo existence is well established; verify current maintenance.
- [SoK: root causes of $1 billion loss in smart contract real-world attacks](https://arxiv.org/html/2507.20175) — tier: primary-analysis — published: 2025-07 — the systematic classification behind 06.2's loss data; use it to assign classes consistently.

### Current state (Aug 2026)

- **The centre of gravity has moved off-chain.** 2025's largest loss (Bybit) and 2026's two largest (Drift ~$285M in April, Kelp DAO ~$292M in April) were all key-management, signing-UI, or verifier-configuration failures. A curriculum built on 2020–2022 incidents teaches a threat landscape that no longer produces most of the losses.
- **DPRK-linked actors reportedly account for ~76% of global crypto hack losses through April 2026, up from ~64% in 2025** (single secondary source — see gaps). This changes what "attacker" means in a threat model: persistent, well-resourced, patient, and targeting humans.
- **Balancer V2 (Nov 2025) is the new canonical arithmetic bug** and should displace older precision examples. It is unusually well covered — BlockSec, OpenZeppelin, Check Point, Coinspect and QuillAudits all published independent analyses within days.
- **Reentrancy has not disappeared, it has relocated**: read-only, cross-function, cross-protocol, and compiler-level (Vyper) variants. Teaching "use nonReentrant" as the lesson is now actively misleading.
- **Recovery is now a real outcome.** Euler recovered essentially everything; Balancer recovered ~$45M of ~$125M; Sui validators froze Cetus funds. Protocols increasingly ship pause and clawback powers — which are themselves new attack surface (see the Kelp DAO "emergency power" framing).

### Misconceptions

- Belief: The big hacks are clever Solidity exploits. | Reality: the three largest incidents of 2025–2026 involved no contract vulnerability at all. | Why: contract bugs are the part that gets written up in code, so they dominate teaching material. | Source: https://blocksec.com/blog/the-decentralization-dilemma-cascading-risk-and-emergency-power-in-the-kelp-dao-crisis
- Belief: Rounding errors are cosmetic. | Reality: one inconsistent rounding direction in Balancer's stable-pool scaling produced a ~$125M loss when compounded across ~65 swaps in a single transaction. | Why: sub-wei errors look unexploitable in isolation. | Source: https://blocksec.com/blog/in-depth-analysis-the-balancer-v2-exploit
- Belief: Reviewing your source code is enough. | Reality: Curve's pools were correct Vyper; the compiler emitted a broken reentrancy lock. | Why: the trusted computing base is invisible until it fails. | Source: https://medium.com/chainlight/curve-finance-analysis-and-post-mortem-ba55f2b26909
- Belief: A multisig raises the bar proportionally to its threshold. | Reality: Bybit and Radiant show all signers can be shown the same forged payload; Ronin shows keys can be correlated. | Why: threshold arithmetic assumes independent signers, which deployments rarely have.
- Belief: "Decentralized verifier network" means decentralized. | Reality: Kelp DAO ran LayerZero's OFT path with a 1-of-1 DVN — protocol capability is not deployment configuration. | Why: the security property lives in config, not in the contract's name. | Source: https://innora.ai/blog/kelp-dao-layerzero-292m-exploit-forensic-analysis
- Belief: An exploit needs deep expertise to copy. | Reality: Nomad became a public free-for-all — replaying the tx with a substituted address was sufficient. | Why: people assume exploits are transferable only with understanding.

### Practice ideas

- kind: break — Reproduce three exploits locally with `DeFiHackLabs`-style Foundry forks: one reentrancy (GMX v1 or Curve/Vyper), one arithmetic (Balancer V2), one access-control/configuration. Fork at the block *before* the attack. — Acceptance: three passing PoC tests where the attacker's balance increases, plus one paragraph each naming the violated invariant.
- kind: write — Write a post-mortem for an incident that only has a thin write-up, working from the raw transaction trace on a block explorer. — Acceptance: a document with timeline, root cause, proximate cause, the violated invariant, and the design decision that permitted it — no hand-waving at "a bug".
- kind: fix — Take the Balancer V2 stable-pool scaling code and correct the rounding directions, then write an invariant test that fails on the original and passes on the fix. — Acceptance: a Foundry invariant that detects the drift over 65+ sequential swaps.
- kind: read — Read three independent analyses of the *same* incident (Balancer V2 has five) and list where they disagree on the root cause. — Acceptance: a written disagreement map; the point is that "root cause" is a judgment, not a fact.
- kind: measure — For five incidents, estimate the attacker's capital requirement and gas cost, and classify each as capital-gated or not. — Acceptance: a table showing which attacks flash loans made feasible and which were always feasible.
- kind: implement — Build a small classifier: given a post-mortem, output vulnerability class, trust boundary crossed, and whether a fuzzer, a prover, or a threat model would have caught it. Run it over 20 incidents by hand. — Acceptance: a filled table; the interesting column is "none of the three".

### Visual opportunities

- **Timeline 2016→2026 with two colour-coded bands**: contract-logic failures vs off-chain/config failures. The visual shows the crossover around 2024–25 better than any prose.
- **Balancer V2 rounding cascade**: a single swap's sub-wei error, then the same diagram with a ×65 multiplier and the resulting invariant `D` drift.
- **Kelp DAO message flow**: source chain burn (absent) → forged DVN attestation → destination release, with the 1-of-1 quorum highlighted as the single node.
- **Loss-by-class treemap for 2025 vs 2026 YTD**, showing access control / configuration dwarfing reentrancy.
- **Nomad copycat swarm**: attacker count over time in the minutes after the first successful tx.
- **Reentrancy variant family tree**: classic → cross-function → read-only → cross-protocol → compiler-level, each with its canonical incident.

### Gaps & uncertainties

- **Loss figures conflict across sources and I did not reconcile them. Do not publish a single number without a timestamped source.** Specifically: Bybit ~$1.4B / ~$1.46B / ~$1.5B; Balancer V2 ~$125M / ~$128M (and "over $100M"); Kelp DAO ~$290M / ~$292M. These reflect different asset prices at different snapshot times.
- **Aggregate 2025 numbers conflict outright.** The shared baseline says 122 incidents, $905.4M in smart-contract losses for 2025. A secondary source in this session says "DeFi protocol losses fell 74% to $680M in 2025, 89% from protocol-logic exploits". These almost certainly use different scopes (smart-contract-only vs DeFi-protocol-only vs all-crypto including CEX). **Do not merge them.**
- **The "$840M lost in the first five months of 2026, April alone >$600M" figure** comes from a single secondary aggregator and was not corroborated. Same for **"DPRK-linked actors = 76% of losses through April 2026, up from 64% in 2025."** Treat both as unverified.
- **13 of the 20 entries are tagged `[U]`** — the incident is well established but the specific write-up URL was not opened in this session. Mechanism details for **Cetus, GMX v1, Drift, KyberSwap, Radiant and Wormhole** in particular should be re-verified against a primary write-up before authoring.
- **Drift Protocol (Apr 2026)** — I have only a legal-commentary source characterising it as a governance-structure failure. The actual mechanism is unverified; find a BlockSec/Dedaub-grade analysis before teaching it.
- Euler's own post-mortem URL was not confirmed. The Euler recovery narrative (full return of funds after negotiation) is well established but the primary link is missing.
- `DeFiHackLabs` and `Web3-Security-Library` repo URLs are from memory, not verified this session; check both still exist and are maintained, since the whole "break" practice track depends on the former.

---

## 06.5 — Fuzzing for bugs

> The teaching arc: property quality dominates tool choice. A weak property under a great
> fuzzer finds nothing; a sharp property under Foundry's built-in invariant runner finds the
> bug. Tool selection is the *last* decision in this module, not the first.

### Concepts

- `stateless-fuzzing` — Random inputs to one function in a fresh state; catches argument-domain bugs only. | requires: [] | contrasts: [stateful-fuzzing]
- `stateful-fuzzing` — Random *sequences* of calls against accumulated state; the only kind that finds ordering and accounting bugs. | requires: [stateless-fuzzing]
- `invariant-testing` — Stateful fuzzing where the oracle is a system-level invariant checked after every call in the sequence. | requires: [stateful-fuzzing, system-level-invariant]
- `property-mode` — Echidna's original style: functions named `echidna_*` that take no arguments and return `bool`; the fuzzer reverts state between checks. | requires: [invariant-testing] | contrasts: [assertion-mode]
- `assertion-mode` — Properties expressed as `assert(...)` inside the call itself, letting you check mid-call state and use the call's own arguments. | requires: [property-mode]
- `optimization-mode` — Ask the fuzzer to *maximise* a value (e.g. attacker profit) rather than falsify a boolean; turns "is there a bug" into "how bad is it". | requires: [assertion-mode]
- `handler-contract` — A wrapper that constrains the fuzzer's call surface to realistic actions and realistic actors, instead of letting it hammer raw external functions. | requires: [stateful-fuzzing]
- `input-clamping` — Bounding fuzzed inputs to plausible ranges (`bound()` in Foundry, clamped setters in Echidna) so the campaign spends its budget in reachable state rather than on reverts. | requires: [handler-contract]
- `ghost-variable` — Test-only accumulator tracking something the contract does not store (total deposited, total withdrawn), so conservation invariants become expressible. | requires: [invariant-testing]
- `differential-fuzzing` — Run the same inputs through two implementations and assert equal outputs; the oracle is the other implementation, not a hand-written property. | requires: [stateless-fuzzing] | contrasts: [invariant-testing]
- `reference-model` — The second implementation in a differential test: a prior version, a Python/Rust model, or a trusted library. | requires: [differential-fuzzing]
- `round-trip-property` — `decode(encode(x)) == x`, `withdraw(deposit(x)) <= x`; a cheap, high-yield property family that needs no domain knowledge. | requires: [differential-fuzzing]
- `economic-property` — An invariant about value rather than about data: solvency, no-free-money, fee monotonicity, path-independence of swaps. | requires: [system-level-invariant]
- `solvency-invariant` — Total claimable never exceeds total held; the single highest-value property for any pool, vault or lending market. | requires: [economic-property]
- `path-independence` — Splitting an operation into steps must never beat doing it in one, or the protocol has a free-money path (the Balancer V2 class of bug). | requires: [economic-property, rounding-direction-invariant]
- `coverage-guided-fuzzing` — Mutating inputs that reached new code paths, rather than sampling blindly; the difference between hours and days to a finding. | requires: [stateful-fuzzing]
- `corpus-reuse` — Persisting the interesting call sequences so the next campaign starts where the last one ended; the biggest single-line speedup in practice. | requires: [coverage-guided-fuzzing]
- `sequence-length` — The `seqLen` / depth knob: too short and multi-step bugs are unreachable, too long and each sequence wastes budget in already-explored state. | requires: [stateful-fuzzing]
- `shrinking` — Reducing a failing sequence to a minimal reproducer; without it a finding is unreadable. | requires: [invariant-testing]
- `onchain-fuzzing` — Fuzzing against forked mainnet state so real balances, real oracles and real integrations are in scope. | requires: [stateful-fuzzing]
- `revert-blindness` — A campaign where most calls revert has effectively no throughput; measuring the revert rate is the first diagnostic. | requires: [input-clamping]

### Primary sources

- [Unleashing Medusa: fast and scalable smart contract fuzzing](https://blog.trailofbits.com/2025/02/14/unleashing-medusa-fast-and-scalable-smart-contract-fuzzing/) — tier: primary-analysis (vendor: Trail of Bits) — published: 2025-02 — the Medusa v1 announcement. Go/geth-based, parallel workers, coverage-guided, mutational value generation informed by Slither, HTML coverage report. States their internal benchmark found **Medusa and Echidna perform similarly on coverage and corpus size** — useful for teaching that the choice is ergonomic, not capability-driven.
- [crytic/medusa](https://github.com/crytic/medusa) — tier: canonical-docs — features list confirms: parallel workers, assertion **and** property testing, mutational value generation, coverage collection, coverage-guided fuzzing. The "extensible high-level testing API" is still marked not-implemented.
- [crytic/echidna](https://github.com/crytic/echidna) — tier: canonical-docs — Haskell, the original; property/assertion/optimization/overflow/exploration test modes.
- [Echidna: effective, usable, and fast fuzzing for smart contracts (ISSTA 2020)](https://dl.acm.org/doi/10.1145/3395363.3404366) — tier: primary-analysis (peer-reviewed) — published: 2020-07 — the design paper; still the clearest statement of why property-based fuzzing beats symbolic execution on real contracts.
- [Fuzzing on-chain contracts with Echidna](https://blog.trailofbits.com/2023/07/21/fuzzing-on-chain-contracts-with-echidna/) — tier: primary-analysis (vendor) — published: 2023-07 — the `--rpc-url` / forked-state workflow. This is what makes fuzzing usable against a live protocol you did not write.
- [Differential fuzz testing upgradeable smart contracts with Diffusc](https://blog.trailofbits.com/2023/07/07/differential-fuzz-testing-upgradeable-smart-contracts-with-diffusc/) — tier: primary-analysis (vendor) — published: 2023-07 — auto-generates a Solidity differential harness that calls V1 and V2 with identical inputs and asserts equal results. The clearest concrete instance of `differential-fuzzing` in this ecosystem.
- [Building Secure Contracts — fuzzing chapters (`crytic/building-secure-contracts`)](https://github.com/crytic/building-secure-contracts) — tier: canonical-docs — the "not-so-smart-contracts" and Echidna exercise series; the exercises are the best structured practice available.
- [Stateless vs. stateful fuzzing in smart contract security](https://allthingsfuzzy.substack.com/p/stateless-vs-stateful-fuzzing-in) — tier: secondary — clean articulation of the distinction that most tutorials blur.
- [On-chain fuzzing benchmark: running Echidna on mainnet](https://allthingsfuzzy.substack.com/p/onchain-fuzzing-benchmark-running) — tier: secondary — empirical notes on forked-state campaign cost and throughput.
- [Cyfrin — fuzzing and invariant testing with Foundry](https://www.cyfrin.io/blog/smart-contract-fuzzing-and-invariants-testing-foundry) — tier: secondary (vendor) — the Foundry-native path (`invariant_*`, handlers, `bound`, `targetContract`).
- [Ackee — manually guided fuzzing](https://ackee.xyz/blog/introducing-manually-guided-fuzzing-a-new-approach-in-smart-contract-testing/) — tier: secondary (vendor) — the Wake/Python-based flow; a genuinely different ergonomic point from Solidity-harness fuzzers.
- [Monad — Ultrafuzz: end-to-end agentic fuzzing for Solidity](https://www.monad.xyz/blog/ultrafuzz) — tier: secondary (vendor) — 2026 direction: LLM-generated harnesses and properties. Teach as a trend, not as a tool to rely on.

### Current state (Aug 2026)

- **Three viable stacks, and they are not equivalent in ergonomics:**
  - **Foundry invariant testing** — zero extra install, Solidity handlers, `bound()`, `targetContract`/`targetSelector`, `fail_on_revert`. Lowest friction; where every learner should start.
  - **Medusa** (Go, geth-based, `go install github.com/crytic/medusa@latest`) — parallel workers, coverage-guided, Slither-informed value generation, HTML coverage report. Trail of Bits' recommended default since the v1 push.
  - **Echidna** (Haskell) — still maintained, still the reference for property/assertion/**optimization** modes and for on-chain fuzzing against a fork.
- **Medusa is now the tool Trail of Bits leads with**, and its own benchmark says coverage parity with Echidna. So the honest teaching line is: **pick on ergonomics and CI fit, not on bug-finding power.**
- **Optimization mode is the underused one.** For economic bugs, "maximise attacker profit" is a far better question than "is profit ever > 0", because it quantifies severity in the same run.
- **Agentic/LLM-generated harnesses arrived in 2026** (Monad's Ultrafuzz being one public example). The generated *harness* is genuinely useful; the generated *properties* are the part to distrust, because a wrong property produces a green campaign.
- **What is now wrong to teach:** that fuzzing means `forge test` with a `uint256 x` argument (that is stateless fuzzing and finds almost nothing); that a passing campaign is evidence of correctness (it is evidence about the explored state space only); that Echidna is deprecated (it is not).

### Misconceptions

- Belief: Fuzzing means giving a test function random arguments. | Reality: that is stateless fuzzing. The bugs that cost money need random *sequences* against accumulated state. | Why: Foundry's parameterised tests are the first thing everyone meets and are called "fuzz tests". | Source: https://allthingsfuzzy.substack.com/p/stateless-vs-stateful-fuzzing-in
- Belief: A green fuzz campaign means the invariant holds. | Reality: it means no counterexample was found in the states reached; unreached states are unconstrained. Coverage is the number to look at, not the pass/fail. | Why: the runner prints a pass.
- Belief: The fuzzer will find it if you run it long enough. | Reality: an unclamped harness spends its whole budget on reverting calls. Measuring revert rate and coverage first beats adding runs. | Why: runtime is the visible knob; harness quality is not.
- Belief: Medusa replaced Echidna. | Reality: both are maintained; Trail of Bits' own benchmark reports similar coverage and corpus size. Medusa wins on parallelism and Go tooling, Echidna on optimization mode and maturity. | Source: https://blog.trailofbits.com/2025/02/14/unleashing-medusa-fast-and-scalable-smart-contract-fuzzing/
- Belief: Differential fuzzing needs two full implementations. | Reality: the reference can be one library function, a Python model, or the previous version of the same contract — Diffusc generates the harness for the last case automatically. | Source: https://blog.trailofbits.com/2023/07/07/differential-fuzz-testing-upgradeable-smart-contracts-with-diffusc/
- Belief: Economic bugs need economic simulation. | Reality: most are catchable with four boring properties — solvency, conservation, monotonicity, path-independence. Balancer V2 was a path-independence/rounding violation. | Why: "economic" sounds like it needs agents and price models.
- Belief: You should fuzz the deployed contracts directly. | Reality: without a handler restricting actors and actions, the fuzzer explores an unrealistic call surface and reports findings nobody can reach. | Why: handlers feel like they weaken the test.

### Practice ideas

- kind: implement — Build a handler-based Foundry invariant suite for an ERC-4626 vault with a `solvency-invariant`, a conservation invariant using ghost variables, and a `path-independence` property (n small deposits never beat one large one). — Acceptance: `forge test` reports >70% line coverage of the vault from the invariant runner alone, and the path-independence property fails when you invert one rounding direction.
- kind: break — Reintroduce the Balancer V2 rounding-direction bug into a stable-swap implementation, then write the property that catches it. — Acceptance: a fuzz campaign that produces a minimised counterexample sequence of under 10 calls.
- kind: implement — Write a differential harness comparing a hand-rolled `sqrt`/`mulDiv`/exp-log implementation against Solady or OpenZeppelin, using assertion mode. — Acceptance: at least one input where the two disagree, or a documented argument for why they cannot.
- kind: measure — Take one target and run the same property set under Foundry, Echidna, and Medusa for a fixed wall-clock budget. Record time-to-first-counterexample, coverage, and corpus size. — Acceptance: a table plus a defended recommendation for that codebase; the expected result is that harness quality dominates tool identity.
- kind: measure — Sweep `seqLen`/depth (e.g. 10, 50, 200) and worker count on a known-buggy target, holding total call budget constant. — Acceptance: a curve showing time-to-detection vs sequence length, and a statement of which bug class each end of the curve favours.
- kind: fix — Take a harness with a >90% revert rate, add clamping and a handler, and re-measure. — Acceptance: revert rate below 20% and strictly higher coverage at the same call budget.
- kind: implement — Use optimization mode (Echidna) to maximise attacker profit against a lending pool with a manipulable oracle, rather than asserting profit is zero. — Acceptance: a reported maximum profit figure and the sequence that achieves it.
- kind: implement — Run an on-chain campaign with `echidna --rpc-url` against a forked mainnet protocol you did not write, targeting one solvency property. — Acceptance: the campaign runs against real state and reports coverage; a finding is a bonus, the workflow is the deliverable.

### Visual opportunities

- **Stateless vs stateful vs invariant**, as three pictures of the same contract: one call from genesis / a sequence from genesis / a sequence with an oracle checked after every step.
- **The harness sandwich**: fuzzer → handler (clamping, actor selection) → target contracts → ghost variables → invariant oracle. Shows exactly where each knob lives.
- **Revert-rate vs coverage plot** for an unclamped vs clamped harness — makes `revert-blindness` concrete in one image.
- **Sequence-length sweep curve** with the bug-class annotations (single-call bugs found at any depth; accounting-drift bugs only past depth N).
- **Differential fuzzing diagram**: one input fanning into implementation A and reference B, with the equality assertion as the oracle.
- **Shrinking animation/steps**: a 200-call failing sequence reduced to 6 calls.

### Gaps & uncertainties

- **Current versions are UNRESOLVED and this is a real conflict.** The GitHub releases pages I fetched showed Medusa's newest tag as **v1.5.1 (11 Mar 2024)** and Echidna's as **2.3.3 (27 Jul 2024)** — but Trail of Bits published the "Medusa v1" launch post in **Feb 2025**, which is inconsistent with a v1.5.1 tag a year earlier. Either the fetched pages were stale/truncated, or the version scheme is not what it appears. **Do not pin a version number without checking `github.com/crytic/medusa/releases` and `github.com/crytic/echidna/releases` directly.**
- I did **not** verify Medusa's config-file key names (`workers`, `testLimit`, `callSequenceLength`, `shrinkLimit`, `corpusDirectory`, `targetContracts`, etc.) against current docs. The concepts are right; the exact YAML keys must be checked against `medusa init` output before any lesson prints them.
- Whether Medusa currently supports Foundry cheatcodes and Foundry-style `invariant_*` test discovery was **not confirmed** — the v1.5.1 note mentions `assert*` cheatcode support, which suggests partial coverage. Check before claiming compatibility.
- The shared baseline flags Foundry's exact current stable version as unresolved and notes `forge test --json` still emits non-JSON on stdout (issue #3001). That matters here: any CI story for fuzz results should use `--junit`, not `--json`.
- The Trail of Bits Medusa-vs-Echidna benchmark is **vendor-published and its methodology was not inspected**. Treat "similar coverage and corpus size" as a claim by the authors of both tools.
- No independent, peer-reviewed 2025–26 benchmark of Foundry vs Echidna vs Medusa was found. If one exists it would be worth citing; I could not confirm one.
- Ultrafuzz/agentic fuzzing effectiveness is entirely vendor-claimed. No independent evaluation found.

---

## 06.6 — Formal verification

> The honest framing for this module: **"formally verified" is a claim about a specification
> under a configuration, not about a contract.** Most of the teaching value is in reading
> what a verification report *excludes* — the summarized functions, the loop bound, the
> optimistic assumptions — not in the green checkmarks.

### Concepts

- `formal-verification` — Proving a property holds for *all* inputs in a modelled state space, rather than sampling it. | requires: [invariant-as-spec] | contrasts: [invariant-testing]
- `symbolic-execution` — Running code with symbolic rather than concrete values, accumulating path constraints, and asking an SMT solver whether any assignment violates an assertion. | requires: [formal-verification]
- `smt-solver` — The engine (Z3, Bitwuzla, CVC5) that decides satisfiability of the accumulated constraints; every FV tool is a compiler into this. | requires: [symbolic-execution]
- `counterexample` — The solver's witness when a property fails: a concrete input/state that violates it. The main practical output of FV, more than the proofs. | requires: [smt-solver]
- `bounded-verification` — Verification up to N loop iterations and N call depth; sound within the bound, silent outside it. | requires: [symbolic-execution] | contrasts: [unbounded-verification]
- `unbounded-verification` — Reasoning about loops via invariants rather than unrolling, so the result covers arbitrary iteration counts. | requires: [bounded-verification]
- `loop-invariant` — The hand-supplied property that makes unbounded loop reasoning possible; the main manual cost in K-style tools. | requires: [unbounded-verification]
- `summarization` — Replacing a called function's body with a specified approximation so the solver can finish; the most common source of a "verified" result that does not mean what it says. | requires: [formal-verification]
- `optimistic-assumption` — A tool flag that assumes away a hard case (e.g. that loops terminate within the unroll bound, or that hashes never collide); makes proofs succeed and makes them weaker. | requires: [summarization]
- `spec-language-cost` — CVL and K are separate languages with their own semantics; the cost of FV is mostly learning and maintaining the spec, not running the tool. | requires: [formal-verification]
- `spec-as-test-reuse` — Halmos and Kontrol take existing Foundry tests as specs by replacing concrete inputs with symbolic ones; near-zero adoption cost, weaker properties. | requires: [spec-language-cost] | contrasts: [parametric-rule]
- `parametric-rule` — A Certora rule quantified over *all* public methods, so new functions are covered automatically as the codebase grows. | requires: [spec-language-cost]
- `ghost-and-hook` — Certora's mechanism for tracking quantities the contract does not store, by hooking storage writes; the FV analogue of a fuzz ghost variable. | requires: [ghost-variable, parametric-rule]
- `verification-timeout` — The dominant practical failure mode: the solver does not say "false", it says nothing, and you must decompose or summarize until it can. | requires: [smt-solver]
- `fv-scope-boundary` — FV proves properties of code; it cannot prove things about oracles, governance, key custody, or off-chain infrastructure. | requires: [trust-boundary]
- `fv-roi` — FV pays where code is stable, arithmetic-heavy, and high-value; it does not pay on fast-changing code or where the real risk is economic or operational. | requires: [fv-scope-boundary]

### Primary sources

- [Certora/CertoraProver (open source)](https://github.com/Certora/CertoraProver) — tier: canonical-docs — the Prover was open-sourced; supports EVM, **Solana, and Stellar/Soroban**. This is a significant change from the closed-source, API-key-only era most tutorials describe.
- [Certora Prover changelog](https://docs.certora.com/en/latest/docs/prover/changelog/prover_changelog.html) — tier: canonical-docs — the authoritative version source. Confirmed here: **8.16.1 (15 Jun 2026)**, 8.13.0 (5 May 2026), 8.11.3 (21 Apr 2026).
- [The Certora Prover technology: a gentle introduction](https://hackmd.io/@certora/SJO8BtYpY) — tier: canonical-docs (vendor) — the clearest statement of the architecture: bytecode + CVL spec → mathematical formula → SMT. Good for teaching that CVL is checked against **bytecode**, not source.
- [CVL for Rust (CVLR) — Solana specification language](https://docs.certora.com/en/latest/docs/solana/speclanguage.html) — tier: canonical-docs — evidence that Certora is no longer EVM-only.
- [a16z/halmos](https://github.com/a16z/halmos) — tier: canonical-docs — symbolic testing tool; `check_*` functions, symbolic inputs, no new language, no API key.
- [Symbolic testing with Halmos: leveraging existing tests for formal verification](https://a16zcrypto.com/posts/article/symbolic-testing-with-halmos-leveraging-existing-tests-for-formal-verification/) — tier: primary-analysis (vendor: a16z) — the design rationale. Key line for the module: Halmos checks that tests pass for **all** inputs by symbolically executing them and either proving no assertion is violated or producing a counterexample.
- [Kontrol docs](https://docs.runtimeverification.com/kontrol) — tier: canonical-docs — "compositional symbolic execution"; supports **lemmas, loop invariants, and bounded model checking**; built on KEVM ("validated formal semantics of EVM bytecode"); BSD-3; cloud offering is KaaS.
- [runtimeverification/kontrol](https://github.com/runtimeverification/kontrol) and [runtimeverification/k (K Framework Tools 7.0)](https://github.com/runtimeverification/k) — tier: canonical-docs — the version and maintenance source.
- [How we build formal verification and fuzzing tools with the K Framework](https://runtimeverification.com/blog/how-we-build-formal-verification-and-fuzzing-tools) — tier: primary-analysis (vendor) — RV's own account of the KEVM → Kontrol → Simbolik stack.
- [Formal verification in practice: Halmos, hevm, Certora and Ityfuzz](https://allthingsfuzzy.substack.com/p/formal-verification-in-practice-halmos) — tier: secondary — one of the few non-vendor side-by-side accounts; includes **hevm** (`hevm symbolic`), which most comparisons omit and which is worth teaching as the zero-install baseline.
- [Cyfrin Updraft — Assembly and Formal Verification (Math Masters: Certora + Halmos)](https://updraft.cyfrin.io/courses/formal-verification/math-masters/certora) — tier: secondary (vendor) — free structured course; the closest thing to a standard curriculum for this module.
- [Symbolic execution in practice: a survey (arXiv 2508.06643)](https://arxiv.org/pdf/2508.06643) — tier: primary-analysis (peer-reviewed) — published: 2025-08 — the academic framing of what symbolic execution can and cannot do; useful for the limits discussion.

### Current state (Aug 2026)

**What each tool actually proves**

| | Certora Prover | Halmos | Kontrol |
|---|---|---|---|
| Spec language | **CVL** (separate DSL); CVLR for Rust/Solana | Solidity — existing Foundry tests with `check_*` names | Solidity — existing Foundry tests |
| Reasoning | **Unbounded** (invariants, parametric rules over all methods) | **Bounded** (`--loop`, call depth) | Bounded model checking **plus** lemmas and loop invariants |
| Checked against | Compiled **bytecode** | EVM execution via symbolic interpreter (Z3/Bitwuzla backends) | **KEVM** — machine-checked EVM semantics |
| Cost model | Commercial; Prover source is now open | Free, no API key | Free/BSD-3; KaaS is the paid cloud tier |
| Chains | EVM, Solana, Stellar/Soroban (and Sui work) | EVM | EVM |
| Practical role | The heavyweight: full protocol specs, parametric coverage, used in production audits | The on-ramp: turn your existing test suite into proofs in an afternoon | The rigour tier: strongest semantic foundation, highest manual cost |

**Versions and maintenance**

- **Certora Prover 8.16.1 (15 Jun 2026)** — confirmed from the official changelog. Rapid release cadence (8.11.3 April → 8.13.0 May → 8.16.1 June 2026). Actively developed, clearly the most-invested-in tool. Direction of travel: multi-chain (Solana `--split_rules`, Soroban `--multi_assert_check`), a CVL `links` block for binding storage variables to target contracts, better dataflow visualisation in TAC dumps, stronger `requireInvariant` semantics.
- **Halmos 0.3.3 (31 Jul 2025)** on PyPI is the newest version I could confirm. That is over a year old as of Aug 2026 — either a stable plateau or slowed development; **verify before teaching** (see gaps).
- **Kontrol** — **version UNRESOLVED.** PyPI shows only `1.0.0b1` (Mar 2024), which is almost certainly not how Kontrol actually ships (it distributes via `kup`/Nix and GitHub releases). K Framework Tools are at **7.0**. Maintenance signal to note honestly: in **May 2026 Runtime Verification launched a quadratic-funding donation campaign for "the K Stack"** on Giveth — an open-source-sustainability appeal, not a sign of abandonment, but worth stating plainly to learners choosing a tool.
- **Certora open-sourcing the Prover is the biggest change of the last 18 months** and invalidates the common older claim that FV means "buy a licence and email an engineer".

**What is commonly taught and now wrong**

- "FV is only for EVM." Certora covers Solana (CVLR) and Stellar/Soroban.
- "Certora is closed source." The Prover repo is public.
- "Halmos does full formal verification." It is explicitly **bounded** — it verifies up to the loop/depth limits you give it.
- "FV replaces fuzzing." In practice the workflow is: fuzz to find the property, formally verify the property once it is stable. Trail of Bits' invariant-driven framing puts both downstream of the same invariant text.
- "A verified contract cannot be exploited." Euler was verified work and still lost ~$197M through a path outside the spec.

### Misconceptions

- Belief: "Formally verified" means the contract is proven correct. | Reality: it means specific rules held under a specific configuration, with specific functions summarized and specific loops bounded. The interesting content of a report is its assumptions section. | Why: the phrase is used as marketing. | Source: https://hackmd.io/@certora/SJO8BtYpY
- Belief: Halmos and Certora do the same thing with different syntax. | Reality: Halmos is bounded, Certora is unbounded and parametric over all methods; they prove structurally different statements. | Why: both accept "properties" and both emit counterexamples. | Source: https://a16zcrypto.com/posts/article/symbolic-testing-with-halmos-leveraging-existing-tests-for-formal-verification/
- Belief: The hard part of FV is running the tool. | Reality: the hard parts are writing a spec that is both true and non-trivial, and then keeping it alive as the code changes. | Why: the tool has an install command, the spec does not.
- Belief: If the prover times out, the property is probably fine. | Reality: a timeout is *no information*. It means decompose, summarize, or bound — not proceed. | Why: timeouts look like flaky infrastructure.
- Belief: Summarizing a called contract is a harmless performance trick. | Reality: it moves the summarized function *outside* the proof; every summary is an assumption you now own. | Why: it is the standard advice for making proofs terminate.
- Belief: FV is the highest tier of assurance, so it subsumes audits and fuzzing. | Reality: FV cannot see oracles, governance, key custody, upgrade procedure or front-ends — precisely where 2025–26's largest losses happened. | Source: https://blog.trailofbits.com/2025/02/25/how-threat-modeling-could-have-prevented-the-1.5b-bybit-hack/
- Belief: Kontrol's use of Foundry tests makes it as cheap as Halmos. | Reality: reaching non-trivial results in Kontrol usually requires K lemmas and loop invariants, which is a real expertise cost. | Source: https://docs.runtimeverification.com/kontrol

### Cost model to teach (order of magnitude, not measured)

- **Halmos on an existing suite:** hours to a day. Rename tests to `check_*`, make inputs symbolic, set `--loop`. Highest ratio of insight to effort in the whole security track.
- **Certora on a focused component** (a token, a math library, an access-control matrix): days to a couple of weeks including CVL learning.
- **Certora on a full protocol:** person-weeks to person-months, plus ongoing maintenance every time the code changes. This is why it is bought, not adopted.
- **Kontrol on non-trivial arithmetic:** highest, because of lemma authoring.
- ⚠ These are qualitative and drawn from practitioner accounts, **not** from a measured study. See gaps.

### When FV is worth it / is not

**Worth it:** fixed-point and arithmetic libraries (`mulDiv`, exp/log, sqrt); ERC standard conformance; access-control matrices ("only role X can ever change Y"); state machines with a small, enumerable state set; upgrade/storage-layout safety; anything where a rounding direction carries value; code that is frozen and high-TVL.

**Not worth it:** code still changing weekly; risk concentrated in oracles, governance, or key custody; systems whose failure mode is economic rather than logical; teams that cannot maintain the spec after the engagement ends (an unmaintained spec is worse than none — it produces false confidence).

### Practice ideas

- kind: implement — Take an existing Foundry test suite for a math library, convert it to Halmos `check_*` symbolic tests, and find at least one input class the concrete tests never covered. — Acceptance: a Halmos counterexample the original suite passes on.
- kind: measure — Run the same property in Halmos at `--loop 1,2,4,8` and record verification time and outcome. — Acceptance: a table showing the point where verification stops terminating, plus a written statement of what the bound excludes.
- kind: write — Write a CVL spec for a small ERC-20 with one parametric rule ("no method may increase `totalSupply` except `mint`") and one invariant ("sum of balances == totalSupply", using a ghost + hook). — Acceptance: both pass, and then a deliberately introduced bug makes exactly the right one fail.
- kind: break — Take a passing Certora run, add a summarization for one external call, and construct a bug that lives in the summarized function. — Acceptance: the spec still passes while the contract is exploitable; write the two-sentence explanation.
- kind: read — Read a real audit report's formal-verification appendix and extract the complete list of assumptions, summaries, and unverified functions. — Acceptance: a list of what was *not* proven, longer than the list of what was.
- kind: measure — Time yourself specifying one property in Halmos, then the same property in CVL. — Acceptance: two timings plus an honest note on which produced the better property, not just the faster one.
- kind: implement — Prove a `mulDiv` implementation equivalent to a reference using Halmos, then compare against the differential *fuzzing* result from 06.5 on the same pair. — Acceptance: a statement of what the proof adds over the fuzz campaign, in terms of the input space each covered.

### Visual opportunities

- **The pipeline**: Solidity + spec → symbolic execution → path constraints → SMT solver → {proof | counterexample | timeout}. The three-outcome fan-out is the key insight, because most teaching pretends there are two.
- **Bounded vs unbounded**, drawn as an execution tree: bounded verification covers a truncated tree; a loop invariant covers the whole subtree. Immediately explains Halmos vs Certora.
- **Coverage-of-input-space comparison**: unit test (points) → fuzzing (scattered samples) → bounded FV (a solid but truncated region) → unbounded FV (the whole region, given the spec). One image carries the entire module.
- **A summarization "hole"** drawn into a proof's coverage region — makes `optimistic-assumption` visceral.
- **Tool decision tree**: keyed on code stability, arithmetic density, budget, and whether the risk is logical or economic.

### Gaps & uncertainties

- **Kontrol's current version is UNRESOLVED.** PyPI reports `1.0.0b1` (Mar 2024), which conflicts with Kontrol's active development and its `kup`/Nix distribution. Check `github.com/runtimeverification/kontrol/releases` before printing any version.
- **Halmos 0.3.3 (31 Jul 2025) is the newest I could confirm**, which would mean ~13 months without a PyPI release. That is plausible for a stable tool but should be re-checked against the GitHub releases page; if there are newer tags not on PyPI, the distribution story itself is worth teaching.
- **Note the pattern:** GitHub-releases fetches in this session returned suspiciously stale data (see 06.5, where Medusa/Echidna versions also came back a year+ old). **Treat every version number in this shard that did not come from an official changelog as unconfirmed.** The Certora 8.16.1 figure is the one I trust, because it came from `docs.certora.com`'s changelog.
- **The cost estimates above are not measured.** No public study quantifies spec-writing effort for Certora vs Halmos vs Kontrol. If a lesson gives hours/days figures it must label them as practitioner folklore.
- **No independent, non-vendor benchmark** comparing these three on the same corpus was found. Every comparison surfaced was either vendor-authored or a single practitioner's blog.
- **Kontrol's exact proof strength vs Certora's** — whether Kontrol with loop invariants is genuinely unbounded in the same sense Certora is — I did not verify. The docs say "lemmas, loop invariants, and bounded model checking", which reads as *both* modes available. Do not assert a ranking without confirming.
- **hevm** (`hevm symbolic`) is a fourth tool in this space that the assigned module title omits. It is the zero-install baseline and appears in at least one practitioner comparison. Flagging in case the curriculum should mention it.
- Certora's Sui support was mentioned in a search summary but not confirmed against the docs; Solana (CVLR) and Soroban were confirmed.

---

## 06.7 — Audit craft

> The core skill is not finding bugs — it is **writing findings that get fixed**. A finding
> is a persuasive document with a reproduction, an impact, and a fix, aimed at an engineer
> who does not want to believe you.

### Concepts

- `finding-anatomy` — The canonical structure: title, severity, difficulty, target/location, description, exploit scenario, recommendation, and (post-review) client response. | requires: []
- `severity-vs-difficulty` — Two independent axes: severity is *how bad if exploited*, difficulty is *how hard to exploit*. Collapsing them into one "risk" score loses the information a client needs to prioritise. | requires: [finding-anatomy] | contrasts: [impact-likelihood-matrix]
- `impact-likelihood-matrix` — The competitive-audit convention (Code4rena/Sherlock): severity derived from impact × likelihood. Different from the ToB severity/difficulty split, and the two do not translate cleanly. | requires: [severity-vs-difficulty]
- `exploit-scenario` — A concrete narrative — who, with what capability, in what order, gains what — that converts a theoretical concern into an actionable finding. | requires: [finding-anatomy, threat-scenario]
- `informational-vs-finding` — Style, gas, and hardening notes are real value but must not be inflated into vulnerabilities; inflating severity destroys the report's credibility. | requires: [finding-anatomy]
- `code-maturity-assessment` — A separate, non-finding deliverable rating the codebase across fixed categories, so a client with zero critical findings still learns whether they were lucky. | requires: [finding-anatomy]
- `maturity-category` — Trail of Bits' fixed set: arithmetic, auditing/monitoring, authentication & access controls, complexity management, decentralization, documentation, transaction-ordering/MEV risks, low-level manipulation, and testing & verification. | requires: [code-maturity-assessment]
- `maturity-rating` — Each category rated Strong / Satisfactory / Moderate / Weak / Missing (plus Not Applicable / Not Considered / Further Investigation Required). | requires: [maturity-category]
- `engineer-weeks` — Audit effort is denominated in engineer-weeks and published in the report; it is the single best proxy for how much assurance an engagement actually bought. | requires: []
- `scope-statement` — What was in scope, at which commit, with which assumptions — the part of a report that determines what "audited" means and the part nobody reads. | requires: [finding-anatomy]
- `fix-review` — The follow-up pass confirming fixes are correct and did not introduce new issues; a report without one is a snapshot of a codebase that no longer exists. | requires: [scope-statement]
- `false-positive-cost` — A wrong finding costs the client engineering time and costs you credibility on the next finding; verifying before reporting is part of the craft. | requires: [exploit-scenario]
- `poc-as-proof` — A runnable Foundry PoC turns an argument into a fact and is now expected for high-severity findings. | requires: [exploit-scenario]
- `audit-is-not-a-guarantee` — An audit is a time-boxed review of a specific commit under a specific scope by humans with a budget; it bounds risk, it does not remove it. | requires: [scope-statement]

### Finding format (the template to teach)

```
Title:        <Verb-phrase naming the defect, not the symptom>
Severity:     High | Medium | Low | Informational | Undetermined
Difficulty:   Low | Medium | High | Undetermined
Type:         Access Controls | Data Validation | Timing | ...
Target:       path/to/File.sol#L120-L145 @ <commit sha>

Description:  What the code does and why that is wrong. Include the snippet.
Exploit Scenario: "Alice, who holds role X, calls ... ; because ... , she obtains ..."
Recommendation: Short term: <the fix>. Long term: <the class-level change>.
```

- **Severity** answers "if this fires, how bad", **difficulty** answers "how hard is it to make it fire". Trail of Bits' difficulty scale: **Low** = commonly exploited, public tooling exists; **Medium** = attacker must write an exploit or have in-depth knowledge; **High** = requires privileged access, extremely complex technical detail, or the discovery of other weaknesses; **Undetermined** = not assessed.
- **Short term / long term recommendations** is a Trail of Bits convention worth stealing: the short term fixes the bug, the long term fixes the reason the bug was possible.

### Codebase maturity assessment (the second deliverable)

Rate each category **Strong / Satisfactory / Moderate / Weak / Missing**:

| Category | The question it answers |
|---|---|
| Arithmetic | Are rounding directions consistent and in the protocol's favour? Is precision reasoned about? |
| Auditing & monitoring | Are events emitted for every state change an incident responder would need? |
| Authentication & access controls | Is there an explicit, enumerable role/capability matrix? |
| Complexity management | Can a reviewer hold a function in their head? Is inheritance shallow? |
| Decentralization | What can the admin key do, how fast, and with what notice (timelock, pause, upgrade)? |
| Documentation | Do the specs state invariants, or just describe the happy path? |
| Transaction-ordering / MEV risks | Is the protocol safe under adversarial ordering and sandwiching? |
| Low-level manipulation | Assembly, `delegatecall`, raw storage — justified and reviewed? |
| Testing & verification | Coverage, invariant tests, fuzzing, FV, and whether tests encode invariants or just paths. |

This is the module's highest-transfer artifact: a product engineer can run this rubric on a codebase on day one, before knowing any Solidity idioms.

### Primary sources — reports and rubrics

- [Trail of Bits — public reports index](https://trailofbits.com/reports/) and [trailofbits/publications (GitHub)](https://github.com/trailofbits/publications) — tier: canonical-docs — **the single best corpus for this module.** Every report states engineer-weeks, uses the severity × difficulty grid, and includes a code-maturity table. Confirmed present: **Arbitrum ArbOS 60/61 (Jul 2026, 24 engineer-weeks)**, **Stylus SDK (Apr 2026, 9 engineer-weeks)**, **Arbitrum Nitro External DA (Jan 2026)**, **Scroll Euclid Phase 2 (Apr 2025)**, **Uniswap v4 Core (Jul 2024, 6 engineer-weeks)**, **Arbitrum Stylus (May 2024, 47 engineer-weeks)**.
- [Evaluating blockchain security maturity](https://blog.trailofbits.com/2023/07/14/evaluating-blockchain-security-maturity/) — tier: primary-analysis (vendor) — published: 2023-07 — the rubric explained by its authors. Still the reference text.
- [Cyfrin/cyfrin-audit-reports (GitHub)](https://github.com/Cyfrin/cyfrin-audit-reports) — tier: canonical-docs — public reports, indexed by category. Confirmed 2025–26 entries: **Bunni v2 (Jun 2025)**, **Suzaku Core (Jul 2025)**, **Licredity (Sep 2025, with formal verification)**, **Deriverse DEX (Dec 2025, with FV)**, **StatusL2 (Dec 2025 review)**, **Securitize Solana Bridge (Apr 2026)**, **Molecule OnChainLab (May 2026)**, **Armada Crowdfund & Governance (May 2026, with FV)**, **Linea Yield Manager (Aug 2026)**, **Securitize EVM Async Vault (Aug 2026)**. Repo-level stats shown: **243 reports, 115 critical findings, 20 with formal verification, 52 cross-chain, 22 Solana, 64 TradFi/RWA.**
- [spearbit/portfolio (GitHub)](https://github.com/spearbit/portfolio) — tier: canonical-docs — Spearbit's public review reports. `[U]` URL not verified this session.
- [Cantina — portfolio / competition reports](https://cantina.xyz/portfolio) — tier: canonical-docs — Spearbit's public-competition arm; **Spearbit and Cantina formally merged in May 2025**. Reported: **$46.7M paid across 200+ protocols**, including the **Uniswap v4 competition ($2.35M)** and the **Ethereum Foundation's Pectra hard-fork review ($2M)**. `[U]` URL and figures not independently verified.
- [OpenZeppelin — security audits](https://blog.openzeppelin.com/security-audits) — tier: canonical-docs — long-running public archive; strongest for upgradeability, governance and standards work. `[U]` URL not verified this session.
- [Secureum — Audit Techniques & Tools 101](https://secureum.substack.com/p/audit-techniques-and-tools-101) — tier: secondary — the standard free curriculum for audit process and terminology; dated in places (pre-2023 tooling) but the process framing holds.
- [Sherlock — top smart contract auditing companies 2026](https://sherlock.xyz/post/top-10-best-smart-contract-auditing-companies-in-2026) — tier: secondary (**vendor — Sherlock is itself a competitor in this market**) — useful only as a map of who exists; the ranking is not neutral.

### Five reports to study, and why each

1. **Trail of Bits — Uniswap v4 Core (Jul 2024, 6 engineer-weeks)** — a small engagement on an extremely high-value, novel codebase (singleton, flash accounting, hooks). Teaches how a short audit is scoped and what it deliberately excludes. Pairs with the 2026 reality that v4 is now the default deployment target.
2. **Trail of Bits — Arbitrum Stylus (May 2024, 47 engineer-weeks)** — the opposite extreme. Compare its finding density and maturity table against the Uniswap report to see what 8× the effort buys. This comparison *is* the lesson about `engineer-weeks`.
3. **Trail of Bits — Arbitrum ArbOS 60/61 (Jul 2026, 24 engineer-weeks)** — current, and not a Solidity audit: system-level L2 review. Shows how the rubric survives outside smart contracts.
4. **Cyfrin — Bunni v2 (Jun 2025)** — a Uniswap v4 hook protocol, so the findings are about a genuinely new attack surface (hook permissions encoded in the address, flash accounting). Directly relevant to what learners will actually build in 2026.
5. **Cyfrin — Licredity (Sep 2025)** or **Deriverse DEX (Dec 2025)** — both include a formal-verification component. Read the FV appendix specifically for its assumptions list; this is the practical link back to 06.6.
6. **Cantina — Uniswap v4 competition report** — a competitive audit's aggregate output next to Trail of Bits' private report on the *same protocol*. The overlap and the non-overlap between the two is the most instructive thing in this module, and sets up 06.8.

### Current state (Aug 2026)

- **Two incompatible severity conventions are in daily use.** Firms (Trail of Bits) use **severity × difficulty**; competitive platforms (Code4rena, Sherlock, Cantina) use **impact × likelihood**. Learners must know which they are writing under; a "High" means different things.
- **Formal verification is now a line item inside ordinary audits**, not a separate exotic engagement — Cyfrin's public repo shows ~20 of 243 reports include FV.
- **Spearbit + Cantina merged (May 2025)**, consolidating the private-audit and public-competition markets under one brand. The practical effect: the same researchers appear on both sides.
- **Solana and cross-chain now make up a large minority of the public report corpus** (Cyfrin: 22 Solana, 52 cross-chain of 243). An EVM-only audit curriculum is behind the market.
- **PoCs are expected.** A high-severity finding without a runnable reproduction is increasingly treated as unproven.
- **What is now wrong to teach:** that an audit is a checklist pass; that "audited by a top firm" is a security property (the report's scope, commit, and engineer-weeks are the actual information); that severity is a single number.

### Misconceptions

- Belief: A good auditor finds the most bugs. | Reality: a good auditor produces findings that get fixed, with correct severity and a reproduction — a wrong or inflated finding has negative value. | Why: contests score on finding count, which distorts the perception of the job.
- Belief: "Audited" is a property of a protocol. | Reality: it is a property of a commit, under a scope, for a number of engineer-weeks. Read the scope statement and the effort figure first. | Source: https://github.com/trailofbits/publications
- Belief: Severity and likelihood are the same axis. | Reality: Trail of Bits deliberately separates severity from *difficulty of exploitation*, because a High/High and a High/Low demand different responses. | Source: https://blog.trailofbits.com/2023/07/14/evaluating-blockchain-security-maturity/
- Belief: Zero criticals means the codebase is healthy. | Reality: that is exactly why the maturity assessment exists — a codebase can have no findings and still rate Weak on testing, documentation and decentralization. | Source: https://blog.trailofbits.com/2023/07/14/evaluating-blockchain-security-maturity/
- Belief: Gas optimisations and style notes belong in the findings list. | Reality: they belong in an informational section; mixing them in inflates counts and trains clients to skim. | Why: contest scoring rewards volume.
- Belief: More expensive firm = better outcome. | Reality: engineer-weeks, scope, and codebase maturity going in explain more variance than the logo. Compare the Uniswap v4 (6 e-w) and Stylus (47 e-w) reports.
- Belief: The audit ends when the report is delivered. | Reality: without a fix review, the report describes a commit that no longer exists.

### Practice ideas

- kind: read — Read one Trail of Bits report end to end and extract *only* the scope statement, engineer-weeks, and maturity table. Then predict the findings before reading them. — Acceptance: a written prediction compared against the actual findings, with the misses analysed.
- kind: write — Audit a ~300-line contract you did not write and produce a full report: findings in the template above, plus a nine-category maturity table with justifications. — Acceptance: every High/Medium finding has a runnable Foundry PoC; every maturity rating cites specific evidence in the code.
- kind: write — Take three findings you wrote and re-classify each under both conventions (severity × difficulty, and impact × likelihood). — Acceptance: at least one finding where the two systems disagree, with the disagreement explained.
- kind: read — Diff the Trail of Bits private report on Uniswap v4 Core against the Cantina competition results for the same protocol. — Acceptance: a list of what each found that the other did not, plus a hypothesis about why.
- kind: measure — Run the maturity rubric on two codebases of very different quality and record the time it takes. — Acceptance: two completed tables and a claim about which categories are cheapest to assess and most predictive.
- kind: fix — Take a real Medium finding from a public report, reproduce it, apply the recommended fix, and write the fix-review note confirming it is correct and introduces nothing new. — Acceptance: a test that fails before and passes after, plus the note.

### Visual opportunities

- **Severity × difficulty grid** with real findings plotted, next to the **impact × likelihood grid** with the same findings replotted — makes the convention clash immediately legible.
- **The maturity radar chart** (nine axes) for a strong vs a weak codebase.
- **Anatomy of a finding**, annotated: which section persuades, which section reproduces, which section survives into the fix commit.
- **Effort vs findings scatter** across the public ToB corpus (engineer-weeks on x, findings by severity on y) — a real, buildable measurement exercise, and the answer is probably messier than learners expect.
- **Audit lifecycle timeline**: scoping → kickoff → review → draft → client response → fix review → publication, with the commit hash moving underneath.

### Gaps & uncertainties

- **The exact set and naming of Trail of Bits' maturity categories was reconstructed from two secondary summaries**, not read directly from the rubric page. One summary listed nine categories including "MEV risks"; ToB's published names (e.g. "Transaction Ordering Risks", "Auditing", "Low-Level Manipulation") should be copied verbatim from a current report before publishing the table.
- **The rating scale** — whether the canonical set is {Strong, Satisfactory, Moderate, Weak, Missing, Not Applicable, Not Considered, Further Investigation Required} — was partially reconstructed. One source listed only four (weak/moderate/satisfactory/strong). **Verify against a 2026 report appendix.**
- **URLs marked `[U]`** — `spearbit/portfolio`, `cantina.xyz/portfolio`, `blog.openzeppelin.com/security-audits` — are from memory and were not opened. Check all three.
- **Cantina figures ($46.7M paid, 200+ protocols, Uniswap v4 $2.35M, EF Pectra $2M)** come from a single secondary review site and are **not independently verified**. The EF Pectra review figure in particular should be checked against an Ethereum Foundation announcement.
- I did not verify whether the Trail of Bits Uniswap v4 Core report and the Cantina Uniswap v4 competition covered the same commit/scope — if they did not, the "diff the two" exercise needs reframing.
- The Cyfrin repo statistics (243 reports, 115 criticals, etc.) came from the repo's own README rendering and will drift; treat as as-of-Aug-2026.
- No neutral, non-vendor comparison of audit firm quality exists. Every ranking surfaced was published by a market participant. Say so rather than citing one.

---

## 06.8 — Competitive contests

> Two different games are usually taught as one. **Audit contests** pay a fixed pool split
> across everyone who found each bug in pre-deployment code. **Bug bounties** pay a single
> reporter for a bug in live code. The incentives, the skills, and the realistic income are
> completely different, and conflating them is the most common misconception in this module.

### Concepts

- `audit-contest` — A fixed prize pool, a fixed window (typically 1–4 weeks), a frozen commit, and a pool split across valid unique findings. | requires: [finding-anatomy] | contrasts: [bug-bounty]
- `bug-bounty` — An open-ended program against *live, deployed* code where the first valid reporter of a bug takes the whole payout for it. | requires: [audit-contest]
- `duplicate-split` — In contests, everyone who reports the same bug shares that bug's share; finding a popular bug pays far less than finding a rare one. | requires: [audit-contest]
- `share-formula` — The mechanical rule converting (severity, number of duplicates) into a payout slice; understanding it changes what you spend your last day on. | requires: [duplicate-split]
- `solo-finding` — A valid finding with no duplicates; the entire economics of contest participation rests on these. | requires: [duplicate-split]
- `known-issues-exclusion` — Findings already listed in the contest's known-issues, prior audits, or automated-findings appendix are invalid; not reading this section is the top rookie loss. | requires: [scope-statement]
- `judging-and-escalation` — A post-submission phase where severity and validity are decided, and where participants can formally contest decisions at a cost. | requires: [audit-contest]
- `signal-score` — Sherlock's reputation currency, spent to escalate and to comment on others' issues; makes frivolous escalation expensive. | requires: [judging-and-escalation]
- `severity-inflation` — Submitting Lows as Highs to fish for a favourable judgment; costs reputation and, on some platforms, score. | requires: [informational-vs-finding]
- `primacy-of-impact` — Immunefi's rule that a bug's severity follows the demonstrated impact on assets, even if the specific asset or code path was not enumerated in the program's scope. | requires: [bug-bounty] | contrasts: [primacy-of-rules]
- `primacy-of-rules` — The opposite default: the program's written terms bound what is payable regardless of impact. Which one applies is stated per program. | requires: [primacy-of-impact]
- `proof-of-assets-vault` — Immunefi's on-chain vault system letting a program prove it actually holds the funds it promises, with payouts executed on-chain. | requires: [bug-bounty]
- `contest-as-training` — For most participants the realistic return is skill and reputation, not income; treating it as a paid job produces disappointment and bad submissions. | requires: [audit-contest]
- `first-flight` — CodeHawks' beginner tier: small, deliberately approachable codebases used as an on-ramp before real competitions. | requires: [contest-as-training]

### How each platform works in 2026

**Code4rena** — wardens submit findings during the contest; submissions go through validation/pre-sort, then a judge rules on validity, severity and duplication.
- Award slices, per the docs: **Medium** slice = `3 * (0.85 ^ (split - 1)) / split`; **High** slice = `10 * (0.85 ^ (split - 1)) / split`, where `split` is the number of wardens who found that issue. Two things fall straight out: a High is worth ~3.3× a Medium, and **payout per person decays faster than 1/n** because of the 0.85 factor — duplicates are punished twice.
- The submission **selected for inclusion in the report** gets a **+30% slice bonus**, and the total pie grows accordingly — so report-quality writing is directly monetised.
- **Low-severity and governance/centralization findings go into a single QA report**, scored by the judge; the top 3 QA reports are awarded on a curve.
- **Judges are paid from the pool**, which is what makes judging a scalable role rather than volunteer work.
- **From 23 March 2026: cumulative earnings above $1,000 require successful identity verification before any further payout.**

**Sherlock** — participants are called **Watsons**. Four-phase judging with durations that scale with submission volume:
- Phase 1, real-time judging: `(#issues / 100)` days, minimum 2.
- Phase 2, lead judge: `(#issues / 200)` days, minimum 2.
- Phase 3, escalation: **24 hours** after preliminary results to flag an issue — and **flagging costs Signal Score**.
- Phase 4, final judgments: `(#controversial issues / 20)` days, minimum 2.
- Commenting on other Watsons' issues has a Signal threshold (reported as ≥100 Signal, 2 Signal per escalation — verify).
- Practical consequence to teach: **on Sherlock, being right is not enough — you must be able to afford to argue.**

**CodeHawks (Cyfrin)** — runs competitive audits plus **First Flights**, small beginner codebases designed as a training ladder. This is the correct entry point for a learner, not Code4rena or Cantina.

**Cantina (Spearbit)** — the public competition arm of Spearbit; the two **merged in May 2025**. Runs the largest single-protocol competitions and pulls in the same researchers who do Spearbit's private work.

**Immunefi** — bounties, not contests. Severity starts from **impact**, can be downgraded for elevated-privilege or unusual user-interaction preconditions, and upgraded under **Primacy of Impact**; anything not enumerated falls under **Primacy of Rules**, i.e. the program's own terms. Their **Vaults** system lets programs prove assets on-chain and pay whitehats on-chain from the dashboard.

### A realistic account of a first contest

1. **Choose the smallest live contest, or a CodeHawks First Flight.** A 3,000-line contest is not a beginner exercise; it is a way to spend two weeks and submit nothing valid.
2. **Read the scope docs before the code**, in this order: in-scope file list and commit, **known issues**, previous audit reports, automated-findings appendix, and the protocol's own invariant statements. A large share of first submissions die here, not on technical merit.
3. **Build and run the test suite first.** If you cannot get `forge test` green, you cannot write a PoC, and a High without a PoC will be downgraded or dropped.
4. **Expect the obvious findings to be duplicated 20–60 ways.** Under the C4 formula that is a rounding error of a payout. Your realistic upside is one solo Medium.
5. **Write the finding as if a hostile engineer will read it**, because one will. Title names the defect; the exploit scenario names an actor and an ordering; the PoC runs on their repo at their commit.
6. **Time cost is real:** a serious first attempt is tens of hours over one to two weeks. Budget it as a course, not as freelance work.
7. **Expect to earn nothing on the first attempt, and expect that to be fine.** The deliverable is a calibrated sense of what "Medium" means and a set of findings you can show.
8. **Escalate sparingly.** On Sherlock it costs Signal; everywhere it costs reputation. Escalate when you have a mechanism the judge missed, not when you disagree with a severity call.
9. **Read the final report against your own submissions.** This is where the learning is concentrated — especially the findings you saw and dismissed.

### Primary sources

- [Code4rena — awarding](https://docs.code4rena.com/awarding) and [awarding process](https://docs.code4rena.com/awarding/awarding-process) — tier: canonical-docs — the judging inputs are stated as risk level, validity, number of duplicates, and rank (1st/2nd/3rd, satisfactory/unsatisfactory), fed into C4's award calculation script.
- [Sherlock — judging](https://docs.sherlock.xyz/audits/judging) — tier: canonical-docs — the four-phase timeline with its exact duration formulas; escalation window and Signal cost.
- [Sherlock — community judging](https://docs.sherlock.xyz/audits/judging/community-judging) — tier: canonical-docs — how non-lead participants take part in judging.
- [Sherlock — Watsons](https://docs.sherlock.xyz/audits/watsons) — tier: canonical-docs — the participant role, ranking and Signal Score.
- [Sherlock — how audit contests work (for protocols)](https://docs.sherlock.xyz/audits/protocols/how-it-works-for-protocols) and [the same file on GitHub](https://github.com/sherlock-protocol/sherlock-v2-docs/blob/main/audits/protocols/how-it-works-for-protocols.md) — tier: canonical-docs — the client-side view, which is what explains the incentives.
- [Immunefi — bug bounty programs](https://immunefi.com/bug-bounty/) — tier: canonical-docs — the live program list and severity/scope conventions.
- [Immunefi — issuing payouts](https://immunefisupport.zendesk.com/hc/en-us/articles/4419189405329-Issuing-Payouts) — tier: canonical-docs — the actual payment mechanics.
- [Nearly every long-running bug bounty program on Immunefi has found a critical bug](https://immunefi.com/blog/research/nearly-every-long-running-bug-bounty-program-on-immunefi-has-found-a-critical-bug/) — tier: primary-analysis (vendor) — the strongest available argument that audits alone are insufficient; the headline claim is ~94% of long-running programs surfacing a critical.
- [Complete audit competitions guide & strategies: Cantina, Code4rena, Sherlock & more](https://medium.com/@JohnnyTime/complete-audit-competitions-guide-strategies-cantina-code4rena-sherlock-more-bf55bdfe8542) — tier: secondary — practitioner strategy account; useful for the "realistic first contest" narrative, but it is one person's experience.
- [Smart Contract Hacking — live competitions tracker](https://smartcontractshacking.com/tools/web3-auditing-competitions-and-bug-bounties) — tier: secondary — aggregates active contests across Code4rena, Sherlock, CodeHawks and Cantina; the practical way to find a first contest.

### Current state (Aug 2026)

- **Four contest platforms and one dominant bounty platform:** Code4rena, Sherlock, CodeHawks (Cyfrin), Cantina (Spearbit) for contests; Immunefi for bounties.
- **Consolidation is real.** Spearbit and Cantina merged (May 2025); Cyfrin runs both a private audit practice and CodeHawks. The same top researchers appear across private audits, contests, and bounties — which is why 06.7 and 06.8 are the same career, not two.
- **Code4rena added identity verification** for cumulative earnings above $1,000, effective for competitions starting on or after **23 March 2026**. This is a meaningful practical change for anyone treating contests as income.
- **Sherlock's judging is now heavily formalised**, with volume-scaled phase durations and a Signal-priced escalation market. This is the most interesting mechanism design in the space and worth teaching on its own.
- **Immunefi's Vaults** move bounties toward on-chain proof-of-assets and on-chain payout, addressing the historical complaint that advertised bounty ceilings were not backed by funds.
- **What is now wrong to teach:** that contests are a reliable income source for newcomers; that Code4rena is the only platform; that a bug bounty and an audit contest are the same activity; that submitting many findings is a good strategy (the duplicate decay makes breadth-without-depth actively unprofitable).

### Misconceptions

- Belief: More submissions means more money. | Reality: the C4 slice formula divides by the number of duplicates *and* applies a 0.85^(n-1) decay, so common findings pay almost nothing; one solo Medium beats ten duplicated ones. | Source: https://docs.code4rena.com/awarding/awarding-process
- Belief: Contests and bug bounties are interchangeable. | Reality: contests split a fixed pool across all finders of frozen pre-deployment code; bounties pay one reporter for a bug in live code. The optimal strategy differs completely. | Why: both are "get paid to find bugs".
- Belief: Writing quality does not affect payout. | Reality: on Code4rena the submission selected for the report receives a **+30% slice bonus**, and judges rank submissions satisfactory/unsatisfactory. | Source: https://docs.code4rena.com/awarding/awarding-process
- Belief: If the judge is wrong you just escalate. | Reality: on Sherlock escalation is priced in Signal Score and limited to a 24-hour window after preliminary results. | Source: https://docs.sherlock.xyz/audits/judging
- Belief: Anything you find in the code counts. | Reality: known issues, prior-audit findings, and the automated-findings appendix are all out of scope, and this invalidates a large share of first-timer submissions. | Why: nobody reads the contest README to the end.
- Belief: A protocol that ran a contest is done with security. | Reality: Immunefi's own data reports ~94% of long-running bounty programs eventually surfaced a critical — i.e. bugs persist past audits and contests. | Source: https://immunefi.com/blog/research/nearly-every-long-running-bug-bounty-program-on-immunefi-has-found-a-critical-bug/
- Belief: Severity is negotiable if you argue well. | Reality: severity inflation is visible to judges across your history and is penalised on platforms with reputation scoring.

### Practice ideas

- kind: implement — Complete a CodeHawks First Flight end to end: read scope, run tests, submit findings in the platform's format, then compare against the published results. — Acceptance: at least one valid submission and a written list of every finding you missed, with the reason you missed it.
- kind: measure — Implement the Code4rena slice formula in a spreadsheet or script and plot payout-per-warden vs number of duplicates, for High and Medium, at a fixed pool size. — Acceptance: a chart plus a stated strategy conclusion about where to spend the last 20% of contest time.
- kind: read — Take a finished contest, read the full report, then go back to the original repo and try to find the top three findings *without* looking. — Acceptance: honest timing of how long each took, and which you would not have found at all.
- kind: write — Write the same finding twice: once as a bare description, once with a runnable PoC, an actor-named exploit scenario, and short/long-term recommendations. — Acceptance: give both to someone else and have them predict the judge's severity for each.
- kind: read — Compare one protocol's Code4rena/Cantina contest results against its private audit report. — Acceptance: a table of findings unique to each, and a hypothesis about what contests systematically miss (architectural and off-chain issues are the expected answer).
- kind: write — Before submitting anything in a real contest, produce a one-page "scope brief": in-scope files, commit hash, known issues, prior audits, stated invariants, and the three areas you will actually spend time on. — Acceptance: the brief exists before you read the first contract.

### Visual opportunities

- **Payout decay curve**: Code4rena slice value vs duplicate count for High and Medium, overlaid. This single chart changes behaviour more than any amount of advice.
- **Contest vs bounty comparison**, as two timelines: fixed window + frozen commit + pool split, against open-ended + live code + winner-takes-the-bug.
- **Sherlock judging state machine**, with the four phases, their volume-scaled durations, and the 24-hour escalation gate.
- **The first-contest funnel**: hours spent → submissions → valid → non-duplicate → paid, with realistic (labelled-uncertain) drop-offs at each stage.
- **Platform map 2026**: contest platforms, bounty platforms, and the private-audit firms behind them, with the Spearbit↔Cantina and Cyfrin↔CodeHawks links drawn in.

### Gaps & uncertainties

- **The Code4rena slice formulas** (`3 * 0.85^(split-1) / split` for Medium, `10 * ...` for High) and the **+30% selected-for-report bonus** came from a search summary of the C4 docs; the awarding-process page I fetched did **not** contain them (it only listed the judging inputs). **Verify against `docs.code4rena.com/awarding` directly before publishing the formula or drawing the decay chart.**
- **Sherlock's Signal Score numbers** (2 Signal per escalation, ≥100 Signal to comment on others' issues) came from a search summary, not from the docs page I fetched. The four-phase durations **were** confirmed from `docs.sherlock.xyz/audits/judging`.
- **No verified statistics on participant outcomes.** I found no trustworthy figure for what fraction of contest participants earn nothing, median earnings, or hours-to-first-payout. **Do not publish any such number.** The "realistic first contest" section above is qualitative and drawn from practitioner accounts.
- **Immunefi totals conflict.** One 2026 source says "$134M paid" with a "$16M program setting a record"; another 2026 review says "$112M". Both are secondary. Do not pick one.
- **Cantina's payout figures ($46.7M across 200+ protocols)** are from a secondary review site — same caveat as in 06.7.
- **Sherlock's own coverage/insurance model** (historically Sherlock backstopped audits financially) — I did **not** verify whether that is still part of the 2026 offering. If a lesson mentions it, check first.
- **CodeHawks' current contest cadence and First Flights structure** were not verified against `codehawks.cyfrin.io` this session; the description is from the aggregator and from prior knowledge.
- The `~94% of long-running Immunefi programs surfaced a critical` figure is **vendor-published research about its own platform**. Useful directionally; not an independent result.
