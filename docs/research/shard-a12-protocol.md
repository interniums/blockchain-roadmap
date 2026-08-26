# Shard A12 — Track 11: Protocol Internals (remainder)

Research shard for the blockchain curriculum. Raw material, not lesson prose.
Compiled: 2026-08-25.

## Status log
- [x] 11.1 — client architecture (EL/CL split, Engine API, client diversity 2026, per-slot duties)
- [x] 11.2 — consensus specs (repo layout, executable Python specs, test vectors, reading a spec change)
- [x] 11.3 — fork choice (LMD-GHOST, proposer boost, attacks, proposed replacements)
- [x] 11.4 — ePBS / EIP-7732 (design, proposer & builder changes, relay trust removal, status)
- [x] 11.5 — PeerDAS internals (column custody, sampling, reconstruction, networking timebound)
- [x] 11.6 — Verkle & statelessness (vector commitments vs MPT, witness sizes, state expiry, status)
- [x] 11.7 — contributing to a client (Geth, Reth, Lighthouse, Prysm, EPF/study.epf.wiki)

---

## 11.1 — Client architecture: EL/CL split, the Engine API, diversity, per-slot duties

### Concepts
- el-cl-split — Since the Merge an Ethereum node is two separate processes: an execution client (EVM, state, mempool) and a consensus client (proof-of-stake, fork choice, attestations), each independently implemented. | requires: [] | contrasts: [pre-merge-monolith]
- execution-client-role — The execution client holds the world state, runs the EVM, keeps the public transaction mempool, and serves JSON-RPC to apps; it does NOT decide which block is canonical. | requires: [el-cl-split] | contrasts: [consensus-client-role]
- consensus-client-role — The consensus client speaks the p2p beacon-chain protocol, tracks validators and attestations, runs fork choice, and tells the execution client which head to build on. | requires: [el-cl-split] | contrasts: [execution-client-role]
- engine-api — A private authenticated JSON-RPC namespace (`engine_*`) on a local port (default 8551) that is the ONLY interface between CL and EL; it is not exposed publicly and is not the same as the user-facing `eth_*` JSON-RPC. | requires: [el-cl-split] | contrasts: [json-rpc-public]
- engine-api-jwt — The Engine API is authenticated with a shared HS256 JWT secret written to a `jwt.hex` file that both clients read; a mismatched secret is the single most common "my node won't sync" failure. | requires: [engine-api] | contrasts: []
- engine-newpayload — `engine_newPayloadVn` hands the EL a block body to execute and validate; the EL replies VALID / INVALID / SYNCING / ACCEPTED. This is "here is a block, is it good?". | requires: [engine-api] | contrasts: [engine-forkchoiceupdated]
- engine-forkchoiceupdated — `engine_forkchoiceUpdatedVn` tells the EL the new head / safe / finalized hashes, and optionally starts a build job by passing payload attributes; it returns a `payloadId`. This is "this is the canonical chain, and maybe start building". | requires: [engine-api] | contrasts: [engine-newpayload]
- engine-getpayload — `engine_getPayloadVn` retrieves the block the EL has been assembling for a `payloadId`; the EL returns the most recent version of that build, so calling later yields a fuller (higher-value) block. | requires: [engine-forkchoiceupdated] | contrasts: []
- cl-drives-el — The CL is the driver and the EL is a slave: the EL never decides finality, never gossips beacon blocks, and one CL can legally drive several ELs. | requires: [engine-api] | contrasts: [execution-client-role]
- client-diversity-thresholds — The dangerous thresholds are 33% (a buggy client that big can stall finality) and 66% (a buggy supermajority client can finalise an invalid chain and the minority cannot recover by rolling back). | requires: [consensus-client-role] | contrasts: []
- supermajority-client-risk — A supermajority-client bug is worse than a minority-client bug: minority-client validators that go offline get small inactivity penalties, but a supermajority that finalises a bad chain gets the honest minority slashed or forces a social fork. | requires: [client-diversity-thresholds] | contrasts: []
- slot-and-epoch — Time is divided into 12-second slots and 32-slot (6.4-minute) epochs; one validator is chosen to propose per slot and the rest of that slot's committee attests. | requires: [consensus-client-role] | contrasts: []
- slot-phases — Within a 12s slot the deadlines are: t=0 block proposal, t=4s attestation deadline, t=8s aggregate deadline; attesters who see no block by 4s attest to the previous head instead. | requires: [slot-and-epoch] | contrasts: [epbs-slot-structure]
- validator-duties — A validator's per-slot work is: attest every epoch (source/target/head vote), occasionally propose, occasionally aggregate, plus sync-committee duty if selected for a 256-epoch period. | requires: [slot-and-epoch] | contrasts: []
- validator-client-separation — Most CL stacks further split into a beacon node (network, state) and a validator client (holds keys, signs), so keys can live on a different machine from the p2p-exposed node. | requires: [consensus-client-role] | contrasts: []

### Primary sources
- [Engine API specification (execution-apis)](https://github.com/ethereum/execution-apis/tree/main/src/engine) — tier: spec — published: 2026-ongoing — the normative CL↔EL interface; per-fork files (paris.md, shanghai.md, cancun.md, prague.md, osaka.md) show how methods version up.
- [Engine API common definitions](https://github.com/ethereum/execution-apis/blob/main/src/engine/common.md) — tier: spec — published: 2026-ongoing — JWT authentication rules, error codes, ordering requirements for forkchoiceUpdated.
- [Engine API: A Visual Guide (Daniel Rachi)](https://hackmd.io/@danielrachi/engine_api) — tier: primary-analysis — published: 2024 — the clearest sequence diagram of newPayload / forkchoiceUpdated / getPayload; still accurate for the method shapes.
- [clientdiversity.org](https://clientdiversity.org/) — tier: canonical-docs — published: live — the community dashboard; note it publishes two conflicting data sources side by side.
- [ethereum.org — Client diversity](https://ethereum.org/developers/docs/nodes-and-clients/client-diversity/) — tier: canonical-docs — published: live — explains the 33%/66% thresholds and why supermajority is the real hazard.
- [ethereum.org — Nodes and clients](https://ethereum.org/developers/docs/nodes-and-clients/) — tier: canonical-docs — published: live — baseline EL/CL taxonomy for a newcomer.
- [Besu Engine API reference](https://besu.hyperledger.org/public-networks/reference/engine-api) — tier: canonical-docs — published: live — a client-side view of the same methods, useful to contrast with the spec.
- [An analysis of attestation timings in a 6-s slot (Robust Incentives Group)](https://rig.ethereum.org/post/an-analysis-of-attestation-timings-in-a-6-s-slot) — tier: primary-analysis — published: 2025 — measured data behind the slot-timing debate; good source for "why 4s".

### Current state (Aug 2026)
- The EL/CL split is unchanged since the Merge. Engine API is still the only CL→EL channel and still JWT-authenticated on port 8551.
- Fusaka (3 Dec 2025) added Osaka-fork Engine methods: `engine_getPayloadV5` returning `BlobsBundleV2` (cell proofs instead of blob proofs, for PeerDAS/EIP-7594), plus `engine_getBlobsV2` (all-or-nothing) and `engine_getBlobsV3` (partial responses with `null` at missing positions). `engine_getBlobsV1` returns an unsupported-fork error after Osaka, and `engine_getPayloadV4` errors for timestamps at/after Osaka activation.
- `engine_getBlobs*` exists so a CL that received a beacon block but not its blobs can pull them from the EL's own blob mempool instead of waiting on gossip — a real latency win that did not exist before Pectra.
- Slot structure is STILL 12 seconds with the 4s/8s deadlines. EIP-7782 (6-second slots) was proposed for Glamsterdam and DECLINED — it is a live idea for a later fork, not shipped. Do not teach 6s slots as current.
- Reth is now a serious production EL (single-digit % of nodes and rising) rather than a research toy; teaching "Geth, Nethermind, Besu, Erigon" as the complete EL list is out of date.
- Client-diversity numbers commonly quoted from 2023–24 ("Geth 85%", "Prysm supermajority") are stale in both directions: Geth is around half, and Prysm is no longer the largest CL — Lighthouse is, by node count.

### Misconceptions
- Belief: A node is one program. | Reality: Running a full node means running two processes that must both be configured, both be synced, and share a JWT secret. | Why: Pre-Merge Geth alone was a full node, and most tutorials predate 2022. | Source: https://ethereum.org/developers/docs/nodes-and-clients/
- Belief: The Engine API is just another JSON-RPC endpoint you can call. | Reality: It is authenticated with a local JWT secret and is meant to be reachable only by the paired CL; exposing it publicly is a node-compromise vector. | Why: It looks like `eth_*` RPC and speaks the same protocol. | Source: https://github.com/ethereum/execution-apis/blob/main/src/engine/common.md
- Belief: The execution client decides which chain is canonical. | Reality: The EL only validates and executes what it is told; the CL's fork choice picks the head and pushes it down via `forkchoiceUpdated`. | Why: Pre-Merge the EL did run fork choice (total difficulty). | Source: https://github.com/ethereum/execution-apis/tree/main/src/engine
- Belief: Client diversity matters because "decentralisation is nice". | Reality: It is a concrete liveness/safety threshold — >33% breaks finality on a bug, >66% can finalise an invalid chain and leave honest minority validators slashed. | Why: Diversity is usually framed as an ideology rather than a bug-blast-radius argument. | Source: https://ethereum.org/developers/docs/nodes-and-clients/client-diversity/
- Belief: Geth has ~85% share so Ethereum is one bug from death. | Reality: That figure is from 2023–24; by 2026 Geth is roughly half of nodes with Nethermind ~a quarter. The concern is real but the number is wrong. | Why: The 85% stat was heavily circulated during the 2024 diversity push. | Source: https://clientdiversity.org/
- Belief: A validator's main job is proposing blocks. | Reality: Proposing is rare (roughly once every few months at 32 ETH); the constant job is attesting once per epoch, and attestation rewards dominate income. | Why: Block production is the visible, dramatic part. | Source: https://ethereum.org/developers/docs/consensus-mechanisms/pos/attestations/

### Practice ideas
- kind: implement — Run a local EL+CL pair (e.g. Reth + Lighthouse, or Geth + Lodestar) on Hoodi testnet, generating your own `jwt.hex`; then deliberately corrupt the JWT and observe the exact error each side logs. — Acceptance: you can state, from logs alone, which side reports the auth failure and what the CL does while it cannot reach the EL.
- kind: measure — With a synced node (or a public archive RPC), sample 100 consecutive slots and record how many had a block vs were missed, and the wall-clock arrival time of each block relative to slot start. — Acceptance: a histogram of block arrival times and a stated missed-slot rate, with the 4-second attestation deadline drawn on the chart.
- kind: read — Diff `src/engine/prague.md` against `src/engine/osaka.md` in ethereum/execution-apis and list every method that changed. — Acceptance: a written list naming `engine_getPayloadV5`, `BlobsBundleV2`, and the getBlobs version changes, with one sentence on why PeerDAS forced each.
- kind: write — Write a 20-line pseudocode loop for a beacon node's slot handler: what it calls on the Engine API at t=0 if it is proposing, and at t=0/t=4s if it is attesting. — Acceptance: the sequence forkchoiceUpdated(with attributes) → getPayload → publish → newPayload appears in the right order.
- kind: break — Point one CL at an EL that is still syncing and document the `SYNCING` responses flowing back through `newPayload`. — Acceptance: you can explain why `SYNCING` is not an error and what the CL does with an optimistically-imported block.

### Visual opportunities
- Two-box diagram (EL | CL) with the Engine API as the only arrow between them, and `eth_*` JSON-RPC / devp2p / libp2p arrows leaving each box outward — makes the "two processes, one private channel" point instantly.
- Slot timeline: 0s propose → 4s attestation deadline → 8s aggregation deadline → 12s next slot, annotated with which Engine API call fires when.
- Sequence diagram for the proposer path: forkchoiceUpdated(payloadAttributes) → payloadId → getPayload → SignedBeaconBlock → gossip.
- A 2x2 blast-radius grid: minority client bug vs supermajority client bug × liveness vs safety failure.
- Stacked bar of EL and CL share with the 33% and 66% lines drawn across it.

### Gaps & uncertainties
- CONFLICT, unresolved: clientdiversity.org publishes two disagreeing consensus-client datasets on the same page. Miga Labs (node-count crawl) shows Lighthouse ~50.95%, Prysm ~20.8%, Nimbus ~9.19%, Teku ~7.87%, Lodestar ~3.21%, Grandine ~1.75%. Rated.Network (stake/attestation-fingerprint based) shows Teku ~53.86%, Prysm ~21.17%, Lighthouse ~20.6%. These are not reconcilable; Rated's Teku figure is plausibly a large-custodian stake-weighting artefact. Do NOT publish a single CL share number — teach the methodology gap instead.
- Execution-client numbers also conflict: Ethernodes shows Geth ~50.13%, Nethermind ~25.46%, Besu ~9.45%, Reth ~7.67%, Erigon ~6.53%; supermajority.info's manual survey shows Geth ~43%, Nethermind ~43%, Besu 8%, Reth 3%, Erigon 3%. Both retrieved Aug 2026; snapshot dates not stated on the page.
- Could NOT confirm whether `engine_newPayloadV5` exists as an Osaka method or is a Glamsterdam/Amsterdam-fork addition tied to EIP-7928 block-level access lists. The Osaka spec page surfaced `getPayloadV5` and `getBlobsV2/V3` only. Verify against `src/engine/osaka.md` and `amsterdam.md` before teaching a version number.
- The default Engine API port (8551) is a convention across clients, not a spec-mandated value.
---

## 11.2 — Consensus specs: repo layout, executable Python, test vectors, reading a spec change

### Concepts
- consensus-specs-repo — `ethereum/consensus-specs` is the normative definition of the beacon chain: markdown documents containing Python that IS the specification, not pseudocode illustrating it. | requires: [consensus-client-role] | contrasts: [execution-specs-repo]
- execution-specs-repo — `ethereum/execution-specs` is the separate normative EVM/execution-layer spec (also executable Python, EELS); `ethereum/EIPs` holds proposals, and `ethereum/execution-apis` holds the RPC/Engine interfaces. | requires: [] | contrasts: [consensus-specs-repo]
- executable-spec — The Python in the spec markdown is extracted by tooling into a runnable package, so the spec can be executed against inputs and cannot silently contain code that does not typecheck or run. | requires: [consensus-specs-repo] | contrasts: [prose-spec]
- pyspec-build — `make pyspec` extracts the markdown code blocks into `tests/core/pyspec/eth2spec/<fork>/`, one complete importable module per fork, which is how you actually read or debug the spec. | requires: [executable-spec] | contrasts: []
- fork-layered-specs — Each fork's spec is written as a diff layer over the previous one (Altair over Phase0, ... Fulu over Electra), so reading one fork alone is incomplete — you must read the chain of layers. | requires: [consensus-specs-repo] | contrasts: []
- cl-fork-codenames — The consensus layer uses star names (Phase0, Altair, Bellatrix, Capella, Deneb, Electra, Fulu, Gloas, Heze) while the execution layer uses city names (Shanghai, Cancun, Prague, Osaka, Amsterdam); the combined upgrade name (Pectra = Prague+Electra, Fusaka = Fulu+Osaka, Glamsterdam = Gloas+Amsterdam) is the concatenation. | requires: [consensus-specs-repo, execution-specs-repo] | contrasts: []
- presets-vs-configs — `presets/` holds compile-time constants that change the shape of the spec (mainnet vs minimal, e.g. SLOTS_PER_EPOCH), `configs/` holds runtime values that differ per network (fork epochs, deposit contract address, chain id). | requires: [consensus-specs-repo] | contrasts: []
- minimal-preset — The `minimal` preset shrinks epochs, committees and validator counts so the spec and its tests run in seconds; it is what makes local spec experimentation practical. | requires: [presets-vs-configs] | contrasts: []
- state-transition-function — The core of the spec is a pure function `state_transition(state, signed_block) -> state`, decomposed into per-slot processing, block processing, and per-epoch processing. | requires: [executable-spec] | contrasts: []
- ssz — Simple Serialize is the consensus layer's canonical encoding and Merkleization scheme; every consensus object has a deterministic serialization and a `hash_tree_root`, and light clients / proofs depend on those roots. | requires: [consensus-specs-repo] | contrasts: [rlp]
- consensus-spec-tests — `ethereum/consensus-spec-tests` publishes generated test vectors (SSZ-encoded pre-state, input, expected post-state) per release; every consensus client runs these in CI, which is what makes independent implementations agree. | requires: [executable-spec] | contrasts: []
- test-vector-generation — Vectors are not hand-written: generator scripts in the specs repo run the pyspec to produce them, so the vectors are by construction consistent with the spec text. | requires: [consensus-spec-tests, pyspec-build] | contrasts: []
- reading-a-spec-change — A spec change is read as: the EIP for intent, the consensus-specs PR diff for the normative change, the new/changed test vectors for the observable behaviour, and the client PRs for how it is really implemented. | requires: [consensus-specs-repo, consensus-spec-tests] | contrasts: []
- spec-release-channels — Stable releases carry generated reference tests as release assets; in-development forks get nightly-generated unstable tests, so "which tests do I run" depends on whether the fork has stabilised. | requires: [consensus-spec-tests] | contrasts: []

### Primary sources
- [ethereum/consensus-specs](https://github.com/ethereum/consensus-specs) — tier: spec — published: 2026-ongoing — the normative beacon-chain spec; the README's stable/unstable fork table is the fastest way to see what is live.
- [consensus-specs releases](https://github.com/ethereum/consensus-specs/releases) — tier: spec — published: 2026-ongoing — release notes are the real changelog for each fork.
- [pyspec README](https://github.com/ethereum/consensus-specs/blob/dev/tests/core/pyspec/README.md) — tier: spec — published: 2026-ongoing — how to build and run the executable spec locally.
- [ethereum/consensus-spec-tests](https://github.com/ethereum/consensus-spec-tests/releases) — tier: spec — published: 2026-ongoing — the generated test vectors every client's CI consumes.
- [ethereum/execution-specs](https://github.com/ethereum/execution-specs) — tier: spec — published: 2026-ongoing — the EL counterpart (EELS); useful to show the two-spec structure.
- [Upgrading Ethereum (eth2book) — Running the spec](https://eth2book.info/latest/appendices/running/) — tier: primary-analysis — published: ongoing — Ben Edgington's annotated spec; the single best on-ramp for a newcomer reading consensus-specs.
- [How to use Executable Consensus Pyspec (Devcon VI)](https://archive.devcon.org/archive/watch/6/how-to-use-executable-consensus-pyspec/) — tier: primary-analysis — published: 2022-10 — talk + PDF walking through pyspec usage; mechanics still current.
- [SSZ spec (consensus-specs/ssz)](https://github.com/ethereum/consensus-specs/blob/dev/ssz/simple-serialize.md) — tier: spec — published: ongoing — the encoding/Merkleization rules.

### Current state (Aug 2026)
- Stable fork sequence in the repo README: Phase0 (epoch 0), Altair (74240), Bellatrix (144896), Capella (194048), Deneb (269568), Electra (364032), **Fulu (411392 — the Fusaka CL fork, activated 3 Dec 2025)**.
- Unstable / in-development: **Gloas** (the Glamsterdam CL fork, epoch TBD) and **Heze** (the fork after that, epoch TBD). Heze is where FOCIL (EIP-7805) landed after being declined for Glamsterdam — note the baseline's "Hegota" is the *execution*-layer codename for that upgrade; the CL side is Heze.
- Release lines map to forks: the v1.6.x line carried Fulu/Fusaka; the repo is now publishing **v1.7.0-alpha.\*** pre-releases carrying Gloas. There is no stable v1.7.0 yet.
- Tooling modernised in the last 18 months: the repo now uses **`uv`** as its Python package manager (not plain pip/venv instructions), with a Makefile front-end. Older tutorials telling you to `pip install -r requirements.txt` are out of date.
- The repo now explicitly separates stable reference tests (attached to releases) from **nightly-generated unstable tests** for in-development forks — so you can run Gloas vectors before Gloas ships.
- Commonly taught and now wrong: that consensus-specs contains "pseudocode". It is real, executed Python. Also wrong: treating `ethereum/EIPs` as the source of truth for consensus changes — for CL behaviour the consensus-specs PR is normative and the EIP often lags.

### Misconceptions
- Belief: The spec is prose and clients interpret it. | Reality: The spec is executable Python; ambiguity is reduced because the reference implementation and the document are literally the same artifact. | Why: Most protocol specs (TCP, HTTP) are prose RFCs. | Source: https://github.com/ethereum/consensus-specs
- Belief: There is one Ethereum specification. | Reality: There are at least four normative repos — consensus-specs, execution-specs, execution-apis, and EIPs — and they change on different cadences. | Why: "The Ethereum spec" is spoken about as a single thing. | Source: https://github.com/ethereum/execution-specs
- Belief: An EIP being merged means the change is live. | Reality: EIP merge only means the proposal is formatted and assigned; inclusion is decided at ACD, specified in consensus-specs/execution-specs, then shipped by clients — EOF and FOCIL both had merged EIPs and were still cut. | Why: "Merged" reads as "accepted" to anyone coming from normal open source. | Source: https://github.com/ethereum/EIPs
- Belief: Test vectors are written by hand to test the spec. | Reality: They are generated by running the spec, so they test *client agreement with the spec*, not the spec's own correctness. | Why: In normal software, tests are an independent check on the implementation. | Source: https://github.com/ethereum/consensus-spec-tests
- Belief: You can read one fork's spec file to understand that fork. | Reality: Each fork document is a diff over the previous one; the full behaviour is the composition of all layers, which is exactly what `make pyspec` flattens for you. | Why: The files are named per-fork and look self-contained. | Source: https://github.com/ethereum/consensus-specs
- Belief: presets and configs are the same kind of knob. | Reality: presets change spec-level constants (mainnet vs minimal) and require recompiling the spec; configs are runtime network values like fork epochs. | Why: Both are YAML files full of constants. | Source: https://github.com/ethereum/consensus-specs

### Practice ideas
- kind: implement — Clone consensus-specs, run `make pyspec`, then in a Python REPL import the Fulu spec, build a genesis state with the `minimal` preset and apply a few empty slots with `process_slots`. — Acceptance: you can print `state.slot` advancing and `state.latest_block_header` and explain where each came from in the markdown.
- kind: read — Pick one Fusaka consensus change (e.g. EIP-7594 blob column custody) and trace it across four artifacts: the EIP, the consensus-specs PR diff, the generated test vectors it added, and one client's implementing PR. — Acceptance: a one-page trace naming all four URLs and stating what each layer added that the previous one did not.
- kind: break — Mutate one line in the built pyspec (e.g. change a slashing penalty divisor or an epoch-processing ordering) and run the spec test suite for that fork. — Acceptance: you can name which specific test vectors fail and explain why the failure is a *consensus* failure rather than a unit-test failure.
- kind: measure — Download the consensus-spec-tests release asset for the current stable fork and count vectors by category (operations, sanity, fork transition, ssz_static, fork_choice). — Acceptance: a table of counts plus a sentence on which category would catch a fork-choice bug.
- kind: write — Write a short "how to read a spec change" checklist for your own team, using a real recent PR as the worked example. — Acceptance: the checklist distinguishes intent (EIP), normative change (specs PR), observable behaviour (vectors), and reality (client PR).

### Visual opportunities
- Map of the four normative repos (EIPs / consensus-specs / execution-specs / execution-apis) with arrows showing what flows between them and at what stage of the ACD process.
- Layer-cake diagram of fork specs stacking Phase0 → Altair → ... → Fulu → Gloas, with a callout showing that `make pyspec` flattens the stack.
- Pipeline: markdown code block → `make pyspec` → eth2spec module → generator script → SSZ test vector → client CI. One picture explains the whole trust chain.
- Two-column table of CL star names vs EL city names with the combined upgrade names bridging them — this naming confusion is a persistent beginner tax.
- Anatomy of the state transition: per-slot / per-block / per-epoch boxes with what runs in each.

### Gaps & uncertainties
- Release DATES are unverified. The releases listing returned tags v1.7.0-alpha.10 through v1.7.0-alpha.14 with month/day labels but the fetched year was almost certainly mis-rendered (it reported 2024 for content that must be 2026). Treat the tag names as reliable and the dates as unconfirmed; check the releases page directly before publishing any date.
- "Heze" as the CL codename for the post-Glamsterdam fork comes from the consensus-specs README's unstable list. Its pairing with the EL name in the shared baseline ("Hegota") is inferred, not verified — confirm before teaching the pairing.
- Fork activation epochs quoted above are from the repo README; the Fulu epoch (411392) was not independently cross-checked against a beacon explorer.
- Exact test-vector category counts were not measured; the practice idea asks the learner to do it rather than asserting a number.
- Whether the repo has fully dropped pip in favour of `uv` (vs supporting both) was not verified beyond the README mention.
---

## 11.3 — Fork choice: LMD-GHOST, proposer boost, attacks, proposed replacements

### Concepts
- fork-choice-purpose — Fork choice answers "given every block and vote I have seen, which block is the head?" — it is the tie-breaker for the unfinalized tip, not a finality mechanism. | requires: [consensus-client-role] | contrasts: [casper-ffg]
- gasper — Ethereum's consensus is Gasper: LMD-GHOST picks the head each slot, Casper FFG finalizes checkpoints; fork choice only ever considers blocks descending from the last justified/finalized checkpoint. | requires: [fork-choice-purpose] | contrasts: []
- lmd-ghost — Latest Message Driven Greediest Heaviest Observed SubTree: walk down from the justified root, at each node follow the child whose subtree has the most *attesting validator weight*, counting only each validator's most recent vote. | requires: [gasper] | contrasts: [longest-chain-rule]
- latest-message-only — Only a validator's newest attestation counts, and its weight moves with it; this bounds memory but means an old vote can be silently replaced, which is the seed of several attacks. | requires: [lmd-ghost] | contrasts: []
- weight-is-stake — Subtree weight is effective-balance-weighted validator weight, not block count — "heaviest" means most staked ETH voting for it. | requires: [lmd-ghost] | contrasts: [longest-chain-rule]
- casper-ffg — Casper FFG justifies and finalizes epoch-boundary checkpoints with 2/3 supermajority links; finality is what makes reorgs economically impossible, and it lags the head by roughly two epochs (~12.8 min). | requires: [gasper] | contrasts: [fork-choice-purpose]
- proposer-boost — A timely block gets a temporary fork-choice weight bonus equal to PROPOSER_SCORE_BOOST percent of one committee's weight, applied only for the duration of its own slot, then removed. | requires: [lmd-ghost] | contrasts: [view-merge]
- proposer-boost-tradeoff — The boost value is a dial with two failure modes: too low and an adversary can run ex-ante reorgs / balancing attacks; too high and a malicious proposer can cheaply run ex-post reorgs. There is no value that removes both. | requires: [proposer-boost] | contrasts: []
- balancing-attack — An adversary with a small stake and control of message timing splits honest validators into two roughly equal views by releasing equivocating votes selectively, keeping the chain from converging and stalling finality. | requires: [lmd-ghost, latest-message-only] | contrasts: [ex-post-reorg]
- ex-ante-reorg — The attacker withholds a block and votes, lets an honest block be proposed, then releases the hidden fork with enough accumulated weight to displace a block that was already published — an attack launched *before* the victim block exists. | requires: [lmd-ghost] | contrasts: [ex-post-reorg]
- ex-post-reorg — The attacker sees an honest block already published, then uses its own proposer boost plus withheld attestations to build a sibling that outweighs it — an attack launched *after* seeing the victim block. | requires: [proposer-boost] | contrasts: [ex-ante-reorg]
- equivocation-handling — Because only the first vote from an equivocating validator in a slot is counted, an attacker can leak conflicting votes to different halves of the network; proposer boost alone did not close this, and (block, slot) style refinements were needed. | requires: [balancing-attack] | contrasts: []
- honest-reorg-of-late-blocks — Clients ship an optional rule letting a proposer legitimately reorg a *late* previous block (thresholds on head weight, parent weight, and epochs since finalization), which reduced late blocks in practice; it is optional in the spec, not mandatory. | requires: [proposer-boost] | contrasts: [ex-post-reorg]
- view-merge — A proposed replacement for proposer boost: attesters freeze their view before the slot and the proposer publishes its view alongside the block, so everyone merges to the same view instead of being nudged by a weight bonus. | requires: [proposer-boost-tradeoff] | contrasts: [proposer-boost]
- rlmd-ghost — Recent-Latest-Message-Driven GHOST expires votes older than a window η, making the rule robust under dynamic participation where plain LMD-GHOST is not. | requires: [lmd-ghost] | contrasts: [lmd-ghost]
- three-slot-finality — 3SF replaces the head-then-finalize split with a protocol that finalizes within a small constant number of slots via multiple vote rounds, so the fork-choice surface shrinks dramatically. | requires: [casper-ffg] | contrasts: [gasper]
- orbit-ssf — Orbit is the validator-set-scaling half of the SSF plan: sample a rotating committee (~100k validators) large enough for economic security instead of voting the whole set every slot. | requires: [three-slot-finality] | contrasts: []
- confirmation-rule — A fork-choice-derived rule that tells a user "this block cannot be reorged unless >X% of stake is adversarial", giving a ~15–30s strong probabilistic confirmation far ahead of the ~13-minute finality. | requires: [lmd-ghost, casper-ffg] | contrasts: [casper-ffg]

### Primary sources
- [consensus-specs — phase0/fork-choice.md](https://github.com/ethereum/consensus-specs/blob/dev/specs/phase0/fork-choice.md) — tier: spec — published: ongoing — normative `get_head`, proposer boost, and the safe-block / reorg helper definitions.
- [Two Attacks on Proof-of-Stake GHOST/Ethereum (Neu, Tas, Tse)](https://arxiv.org/pdf/2203.01315) — tier: primary-analysis — published: 2022-03 — the canonical write-up of the balancing attack surviving proposer boost, and the avalanche attack.
- [Recent Latest Message Driven GHOST (D'Amato, Zanolini)](https://eprint.iacr.org/2023/279.pdf) — tier: primary-analysis — published: 2023 — RLMD-GHOST and the dynamic-availability argument.
- [Goldfish: No More Attacks on Ethereum?! (D'Amato et al.)](https://arxiv.org/pdf/2209.03255) — tier: primary-analysis — published: 2022-09 — vote expiry + view-merge as a principled replacement for proposer boost.
- [3-Slot-Finality Protocol for Ethereum (D'Amato et al.)](https://arxiv.org/html/2411.00558v1) — tier: primary-analysis — published: 2024-11 — the leading concrete SSF-family design.
- [3-Slot-Finality: SSF is not about "Single" Slot (ethresear.ch)](https://ethresear.ch/t/3-slot-finality-ssf-is-not-about-single-slot/20927) — tier: primary-analysis — published: 2024 — the readable framing of why "single slot" is a misnomer.
- [Mitigation of ex-ante reorgs (Caspar Schwarz-Schilling)](https://notes.ethereum.org/@casparschwa/HkPjIzUQY) — tier: primary-analysis — published: 2021-2022 — the note that led to proposer boost, with the attack worked through.
- [Proposal for mitigation against balancing attacks to LMD GHOST (Buterin)](https://notes.ethereum.org/@vbuterin/lmd_ghost_mitigation) — tier: primary-analysis — published: 2021 — the original boost proposal.
- [Upgrading Ethereum — 3.7 Fork Choice (eth2book)](https://eth2book.info/latest/part3/forkchoice/) — tier: primary-analysis — published: ongoing — best line-by-line annotation of the fork-choice spec for a newcomer.
- [ethereum.org — PoS attack and defense](https://ethereum.org/developers/docs/consensus-mechanisms/pos/attack-and-defense/) — tier: canonical-docs — published: ongoing — accessible catalogue of the attack families.
- [Visualising the 7-block reorg on the beacon chain (Monnot)](https://barnabe.substack.com/p/pos-ethereum-reorg) — tier: primary-analysis — published: 2022-05 — the real mainnet incident, useful as the concrete anchor.
- [ethereum.org — Single slot finality roadmap](https://ethereum.org/roadmap/single-slot-finality/) — tier: canonical-docs — published: ongoing — official framing of where SSF sits.

### Current state (Aug 2026)
- Fork choice on mainnet is still Gasper: LMD-GHOST filtered by Casper FFG, with proposer boost. Nothing has replaced it. SSF/3SF/Orbit are research tracks with no fork assignment.
- `PROPOSER_SCORE_BOOST` is expressed as a percentage of a single committee's weight, applied only during the proposer's own slot. The value was reduced from its original setting after analysis showed the higher value made ex-post reorgs too cheap — **verify the exact current integer in `specs/phase0/fork-choice.md` before publishing it (widely cited as 40; not independently confirmed here).**
- Post-2023 fork choice hardening that is now standard and often missing from older teaching material: unrealized-justification handling (so a client does not follow a chain whose justification it has not yet computed), equivocation discounting, and the optional "reorg a late block" proposer rule with head/parent weight thresholds.
- The **fast confirmation rule** is the practically important 2026 development: rather than waiting ~13 minutes for finality, clients can expose a rule giving strong probabilistic confirmation in roughly 15–30 seconds under a stated adversary bound. Check per-client whether it is exposed on the API yet.
- EIP-7732 (ePBS) changes the slot's internal structure (see 11.4) and therefore changes what fork choice votes on — a payload-availability vote is added. Fork choice and ePBS cannot be taught independently once Glamsterdam ships.
- Commonly taught and now wrong: "proposer boost fixed the balancing attack." It mitigated it; the academic literature showed variants that survive it, which is why view-merge and RLMD-GHOST exist.
- Also wrong: describing Ethereum PoS as "longest chain". It has never been longest-chain; it is heaviest-attested-subtree.

### Misconceptions
- Belief: Ethereum PoS follows the longest chain. | Reality: It follows the subtree with the greatest attesting stake weight (GHOST), and only within the branch descending from the last justified checkpoint. | Why: Bitcoin's rule is the mental default for anyone new to consensus. | Source: https://eth2book.info/latest/part3/forkchoice/
- Belief: Finality and fork choice are the same thing. | Reality: Fork choice runs every slot on unfinalized blocks; Casper FFG finalizes checkpoints every couple of epochs and is what makes a reorg require slashing a third of stake. | Why: Both are described as "deciding the chain". | Source: https://github.com/ethereum/consensus-specs/blob/dev/specs/phase0/fork-choice.md
- Belief: Proposer boost eliminated balancing attacks. | Reality: It raised the cost but a balancing variant survives it because of how equivocating votes are counted, and it made ex-post reorgs *easier*. | Why: The boost was announced as the fix. | Source: https://arxiv.org/pdf/2203.01315
- Belief: Reorgs on Ethereum are theoretical. | Reality: A 7-block reorg happened on mainnet in May 2022 from a fork-choice implementation/deployment interaction, and short 1-block reorgs of late blocks are routine. | Why: "Finality" is heard as "nothing ever reorgs". | Source: https://barnabe.substack.com/p/pos-ethereum-reorg
- Belief: Single Slot Finality means finality in one slot. | Reality: The leading design (3SF) finalizes in a small constant number of slots; "SSF" is a family name, not a literal latency claim. | Why: The name says single slot. | Source: https://ethresear.ch/t/3-slot-finality-ssf-is-not-about-single-slot/20927
- Belief: More attestations for a block always means it is safer. | Reality: Only each validator's *latest* message counts, so weight can move away from a block as validators re-vote; safety comes from justification, not from an attestation count snapshot. | Why: Attestation counts look like confirmations. | Source: https://eth2book.info/latest/part3/forkchoice/phase0/
- Belief: A missed slot means someone attacked. | Reality: Most missed slots are offline or late proposers; attacks are rare and the base rate of ordinary misses is much higher. | Why: Every gap in the block list looks suspicious. | Source: https://ethereum.org/developers/docs/consensus-mechanisms/pos/attack-and-defense/

### Practice ideas
- kind: implement — Write LMD-GHOST from scratch in TypeScript or Rust: a block tree, a map validator→latest vote, and `get_head()` that walks greedily by subtree weight. Then add proposer boost as a temporary weight on one node. — Acceptance: given a fixture where a late block plus boost flips the head, your implementation flips it, and removing the boost flips it back.
- kind: break — Using your toy implementation, script an ex-ante reorg: withhold a block plus k attestations, publish an honest block, then release the withheld fork. Find the minimum adversarial fraction that succeeds at a given boost value. — Acceptance: a plot of success threshold vs boost value showing the ex-ante/ex-post tradeoff crossing.
- kind: break — Script a two-view balancing attack: an equivocating proposer plus timed vote releases that keep two subtrees within one validator's weight of each other for N slots. — Acceptance: your simulation shows honest validators split and no branch gaining a decisive lead, and you can state exactly which spec rule the attack exploits.
- kind: measure — Query a public beacon API (e.g. `/eth/v1/beacon/headers`) or a beacon explorer over a week of slots and count reorgs by depth and missed slots. — Acceptance: a table of reorg depth counts, plus the observed gap between head and finalized checkpoint over time.
- kind: read — Read `specs/phase0/fork-choice.md` end to end and write down every constant it defines and what breaks if each is set to zero. — Acceptance: a list including the proposer boost constant and the late-block reorg thresholds, with a one-line failure mode each.
- kind: write — Explain to a product audience why an exchange might credit a deposit after N slots rather than after finality, and what the confirmation rule changes about that decision. — Acceptance: the answer distinguishes probabilistic confirmation, the confirmation rule's adversary bound, and economic finality.

### Visual opportunities
- Block tree with per-subtree weights annotated, animated as `get_head` walks down — the single most load-bearing diagram in this module.
- Same tree twice: with and without proposer boost, showing the head flipping. Makes "boost is a temporary thumb on the scale" concrete.
- Ex-ante vs ex-post reorg as two timelines side by side, with a vertical line marking "victim block published" so the *ante/post* naming becomes obvious.
- Balancing attack: two honest halves with a see-saw of equivocating votes keeping the scales level.
- Layer diagram: LMD-GHOST head selection sitting on top of the FFG-filtered subtree, with the justified and finalized checkpoints marked.
- Timeline of confirmation strength: block seen → confirmation rule (~15–30s) → justified (~6.4 min) → finalized (~12.8 min).

### Gaps & uncertainties
- Exact current value of `PROPOSER_SCORE_BOOST` NOT verified in this session. It is very widely cited as 40 (reduced from an earlier 70), but I could not read the constant directly. Do not publish the number without checking `specs/phase0/fork-choice.md`.
- The late-block reorg thresholds (commonly cited as head weight 20, parent weight 160, max 2 epochs since finalization) were not verified and are optional in the spec; confirm before teaching.
- Whether the fast confirmation rule is exposed in any client's public beacon API by Aug 2026, and under which flag, is UNVERIFIED — one secondary source describes it as "deploying during 2026". Check Lighthouse/Prysm release notes.
- The 3SF vs 2-slot-variant finalization-latency figures (~46% higher than idealised SSF at β=1/3, ~18% for the 2-slot variant) come from one secondary summary of the paper; verify against arXiv 2411.00558 before quoting.
- No fork has been assigned to any SSF-family change. Any claim about *when* SSF ships is speculation.
- Orbit's "~100k validators" committee size is a research parameter from a secondary summary, not a fixed spec value.
---

## 11.4 — ePBS (EIP-7732): design, proposer/builder changes, removing relay trust

### Concepts
- pbs-problem — Building a maximally profitable block requires MEV expertise and low-latency infrastructure; if proposers had to do it themselves, staking would centralise into a few sophisticated operators. PBS separates the two roles so a hobbyist proposer can still capture MEV. | requires: [validator-duties] | contrasts: []
- mev-boost-today — Today PBS is *out of protocol*: proposers run MEV-Boost, which talks to relays, which hold builder blocks. Roughly 90% of mainnet blocks are built this way. | requires: [pbs-problem] | contrasts: [epbs]
- relay-trust-assumption — The relay is a trusted third party doing escrow: it verifies the builder's block, shows the proposer only a header, and releases the body once the proposer signs. Proposer and builder must both trust it, and there are only a handful of relays. | requires: [mev-boost-today] | contrasts: [epbs]
- relay-failure-modes — Relay trust has failed in production: a malformed-block relay incident in April 2023 let a searcher unbundle and drain sandwich bots (~$20M), and relays are also a censorship chokepoint and an operational single point of failure. | requires: [relay-trust-assumption] | contrasts: []
- epbs — EIP-7732 enshrines PBS: builders become in-protocol staked entities, the proposer commits to a builder *bid* inside the beacon block, and the protocol itself guarantees the payment — no relay in the loop. | requires: [relay-trust-assumption] | contrasts: [mev-boost-today]
- payload-bid — The beacon block body no longer carries the execution payload. It carries a `SignedExecutionPayloadBid` committing to a block hash, the builder index, and the promised value. | requires: [epbs] | contrasts: []
- payload-envelope — The builder separately broadcasts a `SignedExecutionPayloadEnvelope` containing the actual payload, execution requests and blob commitments, later in the same slot. | requires: [payload-bid] | contrasts: []
- ptc — The Payload Timeliness Committee is a per-slot subset of validators (PTC_SIZE = 512) that votes only on whether the payload was revealed on time and its data was available — it does NOT re-execute the payload. | requires: [payload-envelope] | contrasts: [validator-duties]
- payload-availability-bit — Beacon state gains an `execution_payload_availability` bitvector; a slot can now have a valid beacon block with *no* payload, which is a genuinely new chain state that fork choice and every downstream tool must handle. | requires: [ptc] | contrasts: []
- builder-registry — Beacon state gains a `builders` registry: builders stake (minimum 1 ETH per the current draft), have withdrawal credentials and a beacon-chain balance, and payment is deducted from that balance via `builder_pending_payments` / `builder_pending_withdrawals`. | requires: [epbs] | contrasts: []
- unconditional-payment — Once the proposer signs the bid, the proposer is paid whether or not the builder reveals the payload; that is precisely what removes the need for relay escrow. | requires: [builder-registry, payload-bid] | contrasts: [relay-trust-assumption]
- free-option-problem — Because the builder can choose not to reveal after the bid is committed, it holds a short-dated option on the payload; it forfeits the payment but may find withholding profitable. Simulations show this is not negligible. | requires: [unconditional-payment] | contrasts: []
- deferred-execution — Execution validation moves off the critical path: the payload is verified against the *next* block rather than inside the attestation deadline, widening the propagation+validation budget from roughly 2–4 seconds to roughly 6–9 seconds. | requires: [payload-envelope] | contrasts: [slot-phases]
- epbs-slot-structure — The slot gains internal phases: beacon block (with bid) → attestation → builder payload reveal → PTC payload attestation, instead of one monolithic block at t=0. | requires: [deferred-execution] | contrasts: [slot-phases]
- epbs-and-scaling — The reason ePBS is a *scaling* prerequisite: bigger blocks and bigger blobs need more time to propagate and verify, and deferred execution is what buys that time without lengthening the slot. | requires: [deferred-execution] | contrasts: []
- epbs-does-not-fix-centralisation — ePBS removes relay trust but does not decentralise *building*; the two-builder concentration (top 2 ≈ 73% of blocks) is an economic outcome that enshrining PBS does not change. Inclusion lists (FOCIL) are the separate censorship remedy. | requires: [epbs] | contrasts: [pbs-problem]

### Primary sources
- [EIP-7732: Enshrined Proposer-Builder Separation](https://eips.ethereum.org/EIPS/eip-7732) — tier: spec — published: 2024-06, revised through 2026 — the normative proposal; read the Specification section for the exact SSZ containers.
- [consensus-specs — Gloas fork specs](https://github.com/ethereum/consensus-specs/tree/dev/specs/_features) — tier: spec — published: 2026-ongoing — where ePBS lands in the executable spec; check the Gloas directory for the merged version, which is more current than the EIP text.
- [ePBS design docs / ethresear.ch ePBS threads](https://ethresear.ch/c/proof-of-stake/34) — tier: primary-analysis — published: 2024-2026 — Potuz's payload-timeliness design and the follow-on debates about the free option.
- [EIP-7732 (ePBS) Selected as Glamsterdam Headliner (EtherWorld)](https://etherworld.co/eip-7732-epbs-selected-as-glamsterdam-headliner/) — tier: secondary — published: 2025 — records the ACD decision and the competing headliner candidates.
- [Flashbots MEV-Boost docs](https://docs.flashbots.net/flashbots-mev-boost/introduction) — tier: canonical-docs — published: ongoing — the *current* out-of-protocol architecture ePBS replaces; needed as the contrast.
- [mev-boost relay specs (builder-specs)](https://github.com/ethereum/builder-specs) — tier: spec — published: ongoing — the existing builder API, useful to diff against the enshrined design.
- [Glamsterdam upgrade meta / ACD notes (ethereum/pm)](https://github.com/ethereum/pm) — tier: canonical-docs — published: ongoing — the authoritative record of what is actually scheduled; use this over any news article.

### Current state (Aug 2026)
- **Status: NOT SHIPPED.** EIP-7732 is the Glamsterdam headliner and has moved from draft into devnet testing. As of Aug 2026 Glamsterdam is in its final devnet phase and targeted for H2 2026; core devs have not published a confirmed mainnet activation date. Any specific mainnet date you see is speculation.
- The EIP text has evolved materially since the 2024 draft. The current design uses `SignedExecutionPayloadBid` (earlier discussions said `SignedExecutionPayloadHeader`), and builders are now **in-protocol staked entities with a beacon-chain balance and a minimum stake (1 ETH in the current draft)** rather than paying from an EL account. Teaching the 2024 version of this EIP will be wrong on the payment mechanism.
- `BeaconBlockBody` loses `execution_payload`, `blob_kzg_commitments` and `execution_requests`, and gains `signed_execution_payload_bid` and `payload_attestations`. This is a breaking change for anything that parses beacon blocks — explorers, indexers, MEV tooling, and any code assuming a block contains its payload.
- New beacon state fields: `builders`, `builder_pending_payments`, `builder_pending_withdrawals`, `execution_payload_availability`, `payload_expected_withdrawals`.
- PTC_SIZE = 2^9 = 512. PTC members vote on *timeliness and availability only*, explicitly not on payload validity.
- Glamsterdam's other headline item is EIP-7928 block-level access lists; ePBS + BALs together are the "make blocks bigger safely" package that supports the 200M gas-limit ambition being discussed for later.
- FOCIL (EIP-7805) was DECLINED for Glamsterdam. So the first version of ePBS ships **without** enshrined inclusion lists — the censorship-resistance story is deferred.
- Commonly taught and now wrong: "ePBS gets rid of builders." It does the opposite — it makes builders first-class protocol citizens. What it gets rid of is *relays*.

### Misconceptions
- Belief: ePBS decentralises block building. | Reality: It removes the trusted relay; building remains concentrated because it is an economies-of-scale business. Top-2 builder share (~73%) is unaffected by enshrinement. | Why: "Enshrined PBS" sounds like it fixes the whole MEV supply chain. | Source: https://eips.ethereum.org/EIPS/eip-7732
- Belief: Today's proposers choose their own transactions. | Reality: About 90% of mainnet blocks are built by external builders and delivered through relays; the proposer usually signs a header it has never seen the contents of. | Why: The mental model of "validator = block producer" survives from pre-Merge mining. | Source: https://docs.flashbots.net/flashbots-mev-boost/introduction
- Belief: With ePBS the proposer risks not being paid if the builder disappears. | Reality: Payment is unconditional once the bid is signed — that is the entire point. The risk that moves is that the *slot may have no payload*. | Why: Intuition from escrow: no goods, no payment. | Source: https://eips.ethereum.org/EIPS/eip-7732
- Belief: The PTC validates the execution payload. | Reality: PTC members attest only that the payload was revealed on time and its data was available; execution validity is checked later, against the next block. | Why: "Committee attests to the payload" reads as validation. | Source: https://eips.ethereum.org/EIPS/eip-7732
- Belief: Every slot with a valid beacon block has an execution block. | Reality: Under ePBS a beacon block can be valid while the payload was never revealed — hence the `execution_payload_availability` bitvector. Downstream tooling must handle empty-payload slots. | Why: The two have been 1:1 since the Merge. | Source: https://eips.ethereum.org/EIPS/eip-7732
- Belief: ePBS is a fairness/MEV-redistribution change. | Reality: Its practical driver is *scaling* — deferring execution validation off the attestation critical path is what makes larger blocks and blobs safe. | Why: PBS is filed mentally under MEV politics. | Source: https://etherworld.co/eip-7732-epbs-selected-as-glamsterdam-headliner/

### Practice ideas
- kind: read — Fetch the current builder-spec relay API and MEV-Boost flow, then diff it conceptually against EIP-7732's containers. Produce a two-column table: who holds the payload, who can withhold, who must be trusted, at each step. — Acceptance: the table makes the relay's escrow role explicit and shows exactly which cell disappears under ePBS.
- kind: measure — Use a public relay data API or mevboost.pics-style data to measure, over 1000 recent slots, what fraction of blocks came via MEV-Boost, and the distribution across relays and builders. — Acceptance: numbers you derived yourself for relay concentration, compared against the ~90% / top-2-73% figures.
- kind: implement — Model the free-option problem: simulate a builder that has committed to a bid of value V and then observes a price move of size X; compute when withholding (forfeiting V) beats revealing. — Acceptance: a chart of withholding rate vs volatility, and a stated break-even condition.
- kind: write — Write the migration note an indexer team would need: list every assumption in a beacon-block parser that breaks when `execution_payload` leaves `BeaconBlockBody`. — Acceptance: at least five concrete breakages, including empty-payload slots and blob commitments moving to the envelope.
- kind: break — Take an existing beacon-block-parsing script against a public beacon API and enumerate which of its field accesses would raise under a Gloas-shaped block. — Acceptance: a failing-field list, verified against the Gloas SSZ container definitions.

### Visual opportunities
- Two side-by-side sequence diagrams: MEV-Boost today (proposer → mev-boost → relay → builder, with the relay drawn as a trusted box) and ePBS (proposer → bid in block → builder reveals envelope → PTC attests). The relay box vanishing is the whole lesson.
- ePBS slot timeline with four phases marked, overlaid on today's 12s slot, showing the validation window widening from ~2–4s to ~6–9s.
- Anatomy-of-a-BeaconBlockBody before/after: fields removed in red, fields added in green.
- Payment flow diagram: builder stake → `builder_pending_payments` → proposer balance, annotated "happens even if no payload arrives".
- Decision tree for the builder after signing a bid: reveal (pay, get MEV) vs withhold (pay anyway, lose MEV, deny the slot a payload) — makes the free option visible.

### Gaps & uncertainties
- CONFLICT on timing, unresolved: the shared baseline says Glamsterdam has NO mainnet date and final devnet was mid-June 2026. Secondary news sources retrieved today variously claim "mainnet Q4 2026" and "Sepolia August 3, mainnet around September 16". These are inconsistent with each other and with the baseline. Do NOT publish a mainnet date; cite ethereum/pm ACD notes instead.
- The EIP status field could not be read reliably — the fetched page still surfaced 2024-era "in the process of being peer-reviewed" text alongside 2026 design details, suggesting the fetched rendering mixed revisions. Verify the Status header (Draft/Review/Last Call) directly on eips.ethereum.org.
- The 1 ETH minimum builder stake is from the current draft and is exactly the kind of parameter that changes late. Re-verify before teaching.
- "~2s to ~9s" and "~6–9s" validation-window figures come from different sources with different baselines (one says today's window is ~2s, the EIP framing implies ~4s). Both are in the file deliberately; do not average them.
- The April 2023 relay/malformed-block incident loss figure (~$20M) is from memory of widely reported coverage and was NOT re-verified this session. Confirm before publishing the number.
- Whether the Gloas consensus-specs directory has fully merged ePBS (vs it still living under `specs/_features/eip7732/`) was not confirmed — check the repo path before linking learners at it.
- EIP-8037 was named as a Glamsterdam inclusion by one secondary source; its content was not investigated here.
---

## 11.5 — PeerDAS internals: custody, sampling, reconstruction, networking

### Concepts
- data-availability-problem — A rollup must convince Ethereum that its data was published, but making every node download every byte does not scale; DAS lets a node be statistically certain the data exists while downloading only a fraction of it. | requires: [] | contrasts: [full-download]
- blob-baseline — A blob is 4096 field elements x 32 bytes = 128 KiB, referenced from the EVM only by the versioned hash of its KZG commitment; the EVM can never read blob bytes. | requires: [] | contrasts: [calldata]
- erasure-extension — Each blob is Reed-Solomon extended to 2x its length (`FIELD_ELEMENTS_PER_EXT_BLOB = 2 * FIELD_ELEMENTS_PER_BLOB`), so any 50% of the extended data reconstructs the original. | requires: [blob-baseline] | contrasts: []
- cell — A cell is the smallest independently authenticatable unit: `FIELD_ELEMENTS_PER_CELL = 64` field elements, giving `CELLS_PER_EXT_BLOB = 128` cells per extended blob. | requires: [erasure-extension] | contrasts: []
- data-matrix — All blobs in a slot form a matrix: one row per blob, `NUMBER_OF_COLUMNS = 128` columns. A column is the same cell index taken across every blob in the block. | requires: [cell] | contrasts: []
- column-not-row-custody — Nodes custody COLUMNS, not rows, so no node holds any single blob in full; this is what makes per-node bandwidth independent of the number of blobs in a block. | requires: [data-matrix] | contrasts: [full-download]
- cell-kzg-proof — Each cell carries its own KZG proof against the blob's commitment, so a sampled cell can be verified in isolation without the rest of the blob. Proofs are computed by the *sender* (expensive) because verification is cheap. | requires: [cell] | contrasts: []
- custody-groups — Custody is assigned in groups, not raw columns: `NUMBER_OF_CUSTODY_GROUPS = 128`, and `get_custody_groups(node_id, count)` deterministically derives a node's groups by repeatedly hashing its node id. | requires: [column-not-row-custody] | contrasts: []
- custody-requirement — A plain full node custodies `CUSTODY_REQUIREMENT = 4` custody groups. A node with validators attached custodies at least `VALIDATOR_CUSTODY_REQUIREMENT = 8`, scaling up by one group per `BALANCE_PER_ADDITIONAL_CUSTODY_GROUP = 32 ETH` of attached balance, capped at 128 (a supernode). | requires: [custody-groups] | contrasts: []
- deterministic-custody-from-nodeid — Because custody derives from the node id, peers can be *discovered* by what they custody (advertised in the ENR) rather than asked — that is what makes column-targeted peering possible. | requires: [custody-groups] | contrasts: []
- sampling — Beyond what it custodies, an honest node samples `SAMPLES_PER_SLOT = 8` groups' worth of columns per slot; sampling `max(SAMPLES_PER_SLOT, custody_group_count)` groups is what gives probabilistic assurance the whole matrix exists. | requires: [custody-groups] | contrasts: [full-download]
- das-security-argument — If more than 50% of columns are withheld the data is unrecoverable, but a node sampling k random columns detects that with probability 1 - (1/2)^k; a handful of samples already makes successful withholding vanishingly unlikely across thousands of nodes. | requires: [sampling, erasure-extension] | contrasts: []
- reconstruction-rule — A node that obtains 50%+ of columns SHOULD reconstruct the full matrix via `recover_matrix`; the spec explicitly suggests a *random delay* before reconstructing so nodes desynchronise and the network does not spend CPU redundantly. | requires: [erasure-extension] | contrasts: []
- cross-seeding — After reconstructing a column a node MUST re-expose it as if received from the network (gossip it to its mesh, or at minimum advertise availability), then MAY delete it if outside its custody — this is how a partially-withheld block heals. | requires: [reconstruction-rule] | contrasts: []
- column-subnets — Gossip uses `DATA_COLUMN_SIDECAR_SUBNET_COUNT = 128` subnets, one per column (`subnet = column_index % 128`); a node subscribes only to the subnets it custodies. | requires: [custody-groups] | contrasts: []
- das-timebound — Sampling must complete inside the slot's consensus deadline: a validator has to decide by the attestation deadline whether the block's data is available, so DAS is a hard real-time networking problem, not a background download. | requires: [sampling, slot-phases] | contrasts: []
- is-data-available — Fork choice is modified: `is_data_available(block_root)` gates a block, and it checks only the node's *custodied* columns, retained for `MIN_EPOCHS_FOR_DATA_COLUMN_SIDECARS_REQUESTS = 4096` epochs (~18 days). | requires: [das-timebound, fork-choice-purpose] | contrasts: []
- bpo-forks — Blob-Parameter-Only forks are a new lightweight upgrade type that changes only blob target/max, letting blob capacity be raised on a fast cadence without a full network upgrade. | requires: [blob-baseline] | contrasts: []
- getblobs-shortcut — `engine_getBlobsV2/V3` let a CL that is missing blob data pull it from the local EL's blob mempool instead of waiting on gossip — a latency escape hatch that materially helps DAS meet its deadline. | requires: [engine-api, das-timebound] | contrasts: []

### Primary sources
- [EIP-7594: PeerDAS — Peer Data Availability Sampling](https://eips.ethereum.org/EIPS/eip-7594) — tier: spec — published: 2024, activated 2025-12 — the proposal and its motivation.
- [consensus-specs — specs/fulu/das-core.md](https://github.com/ethereum/consensus-specs/blob/master/specs/fulu/das-core.md) — tier: spec — published: 2025-2026 — normative constants, `get_custody_groups`, `compute_columns_for_custody_group`, reconstruction and cross-seeding rules, plus an unusually good FAQ section.
- [consensus-specs — specs/fulu/p2p-interface.md](https://github.com/ethereum/consensus-specs/blob/master/specs/fulu/p2p-interface.md) — tier: spec — published: 2025-2026 — subnet mapping, ENR custody advertisement, req/resp for column sidecars, retention window.
- [consensus-specs — specs/fulu/validator.md](https://github.com/ethereum/consensus-specs/blob/master/specs/fulu/validator.md) — tier: spec — published: 2025-2026 — `VALIDATOR_CUSTODY_REQUIREMENT`, balance-scaled custody.
- [consensus-specs — specs/fulu/fork-choice.md](https://github.com/ethereum/consensus-specs/blob/master/specs/fulu/fork-choice.md) — tier: spec — published: 2025-2026 — the modified `is_data_available`.
- [Fusaka Mainnet Announcement (Ethereum Foundation)](https://blog.ethereum.org/2025/11/06/fusaka-mainnet-announcement) — tier: canonical-docs — published: 2025-11 — activation slot/date and the BPO schedule.
- [ethereum.org — PeerDAS](https://ethereum.org/roadmap/fusaka/peerdas/) — tier: canonical-docs — published: 2025-2026 — the accessible explanation.
- [PeerDAS fork-choice (Francesco D'Amato)](https://notes.ethereum.org/@fradamt/das-fork-choice) — tier: primary-analysis — published: 2024 — why DAS interacts with fork choice and what the timing constraint really is.
- [EIP-4844 (proto-danksharding)](https://eips.ethereum.org/EIPS/eip-4844) — tier: spec — published: 2023, activated 2024-03 — the blob primitive PeerDAS builds on; needed as prerequisite reading.

### Current state (Aug 2026)
- PeerDAS is **LIVE on mainnet** since Fusaka, slot 13,164,544 (3 Dec 2025, 21:49:11 UTC). This is no longer roadmap material.
- Verified constants (read from consensus-specs master, Aug 2026): `NUMBER_OF_COLUMNS = 128`, `NUMBER_OF_CUSTODY_GROUPS = 128`, `DATA_COLUMN_SIDECAR_SUBNET_COUNT = 128`, `CUSTODY_REQUIREMENT = 4`, `VALIDATOR_CUSTODY_REQUIREMENT = 8`, `BALANCE_PER_ADDITIONAL_CUSTODY_GROUP = 32 ETH`, `SAMPLES_PER_SLOT = 8`, `FIELD_ELEMENTS_PER_CELL = 64`, `CELLS_PER_EXT_BLOB = 128`, `MIN_EPOCHS_FOR_DATA_COLUMN_SIDECARS_REQUESTS = 4096` epochs (~18.2 days).
- **BPO forks are the new normal.** Fusaka shipped with a schedule of blob-parameter-only forks: BPO1 (9 Dec 2025) raised blob target/max to 10/15; BPO2 (7 Jan 2026) raised them to 14/21. Further BPO forks toward much higher counts (48 and 72 blobs have both been discussed) are speculative — verify the *current* target/max against a live source before teaching a number.
- The custody model changed during development: earlier PeerDAS drafts assigned columns directly; the shipped spec assigns **custody groups** and derives columns from groups. Material written before mid-2025 uses the old model.
- `is_data_available` no longer means "I have all the data" — it means "I have my custodied columns and my samples passed". This is a genuine weakening of what a node individually knows, traded for scalability, and it is the conceptual heart of the module.
- Commonly taught and now wrong: "blobs are gossiped as whole blobs to everyone." Post-Fusaka, blob *sidecars* on mainnet are data column sidecars on 128 subnets; a node no longer downloads whole blobs at all.
- Also worth flagging: cell proofs moved proof *computation* to the transaction sender. Blob-submitting rollups/tooling had to change: the tx wrapper now carries `cell_proofs`.

### Misconceptions
- Belief: DAS means nodes download a random sample of the blob's bytes. | Reality: They sample from the *erasure-extended* data. Extension is what makes sampling meaningful — without it, withholding 1% of the original data would be undetectable by sampling. | Why: "Sampling" sounds like statistics on the raw data. | Source: https://eips.ethereum.org/EIPS/eip-7594
- Belief: If a node's samples pass, the data definitely exists. | Reality: It is probabilistic per-node. Security comes from many nodes sampling independently, so an adversary would have to fool nearly all of them simultaneously. | Why: Availability is presented as a binary. | Source: https://github.com/ethereum/consensus-specs/blob/master/specs/fulu/das-core.md
- Belief: Every node stores blob data. | Reality: A plain full node custodies 4 of 128 custody groups; only "supernodes" custody all 128. Most nodes hold a small slice. | Why: Pre-4844 mental model where every node stores everything. | Source: https://github.com/ethereum/consensus-specs/blob/master/specs/fulu/das-core.md
- Belief: Custody is randomly assigned or self-chosen. | Reality: It is deterministically derived from the node id by hashing, which is exactly what lets peers be discovered by the columns they hold. | Why: "Assignment" implies a coordinator. | Source: https://github.com/ethereum/consensus-specs/blob/master/specs/fulu/das-core.md
- Belief: Reconstruction is a rare recovery path. | Reality: It is a normal part of operation and the spec even tells nodes to add a random delay so they do not all reconstruct at once — cross-seeding is how partially-propagated blocks heal. | Why: "Reconstruct" sounds like disaster recovery. | Source: https://github.com/ethereum/consensus-specs/blob/master/specs/fulu/das-core.md
- Belief: PeerDAS lets Ethereum store rollup data forever. | Reality: Nodes must serve column sidecars for only 4096 epochs (~18 days); after that they may prune. Long-term availability is the rollup's / third parties' problem. | Why: "Data availability layer" is heard as "data storage layer". | Source: https://github.com/ethereum/consensus-specs/blob/master/specs/fulu/p2p-interface.md
- Belief: More blobs per block means more bandwidth for every node. | Reality: Custody is per-column, so adding blob rows grows the matrix vertically while a node's column slice stays the same fraction — that is precisely why blob counts can be raised via BPO forks. | Why: Pre-PeerDAS, blob count did scale node bandwidth linearly. | Source: https://ethereum.org/roadmap/fusaka/peerdas/

### Practice ideas
- kind: implement — Implement `get_custody_groups(node_id, custody_group_count)` from the spec in TypeScript or Rust (repeated sha256 of an incrementing id, mod 128, dedup), then run it over 10,000 random node ids and check the distribution of group coverage. — Acceptance: every custody group is covered by roughly 1/32 of nodes at CUSTODY_REQUIREMENT=4, and you can explain the birthday-style coverage argument.
- kind: measure — Compute the sampling security curve: probability of detecting a >50% withholding for k samples, for k = 1..32. Overlay the network-wide detection probability for N=5000 independently sampling nodes. — Acceptance: a chart showing why SAMPLES_PER_SLOT=8 is enough network-wide even though it is weak per node.
- kind: implement — Implement 1D Reed-Solomon extension and recovery over a small prime field: extend a vector to 2x, delete a random 50%, recover. — Acceptance: recovery succeeds at exactly 50% known and fails at 50% minus one element, and you can state why that boundary is where the reconstruction rule sits.
- kind: measure — Query a public beacon API for recent blocks and record blob counts per block over a day; compare against the current BPO target/max. — Acceptance: a histogram of blobs-per-block plus the observed max, and a statement of whether blocks are hitting the target.
- kind: read — Read `specs/fulu/das-core.md`'s FAQ section ("Why don't nodes custody rows?", "Why don't we rotate custody over time?") and write the argument for each in your own words. — Acceptance: the row-custody answer correctly identifies that reconstruction needs 50% of *columns* and that row custody would not give per-node bandwidth independence.
- kind: break — Simulate a withholding adversary: build a 128-column matrix, withhold 64 columns, and run 5000 simulated nodes each sampling 8 columns. Count how many nodes fail to detect. — Acceptance: a number, and the observation that even a few detecting nodes plus cross-seeding changes the outcome.

### Visual opportunities
- The data matrix: rows = blobs, columns = 128 cell indices, with one node's 4 custody groups highlighted as vertical stripes. This single diagram carries most of the module.
- Same matrix animated as blob count grows: rows added, the highlighted stripe stays the same width — the "why BPO forks are safe" argument, made visually.
- Erasure extension: original 4096 elements | extended 4096, with 50% of the whole struck out and the original still recoverable.
- Sampling probability curve: 1-(1/2)^k against k, with SAMPLES_PER_SLOT=8 marked, plus the network-wide compound curve on a second axis.
- Slot-timing overlay: gossip arrival, sampling requests, `is_data_available` decision point, and the attestation deadline — makes the real-time constraint visceral.
- Cross-seeding sequence: node holds 50%+ → reconstructs → re-gossips missing columns → neighbours' samples now succeed.

### Gaps & uncertainties
- The CURRENT blob target/max is UNVERIFIED. Confirmed: BPO1 (9 Dec 2025) → target 10 / max 15; BPO2 (7 Jan 2026) → target 14 / max 21. Whether further BPO forks landed between Jan and Aug 2026 was NOT checked. Do not publish a current blob count without re-checking; discussion of 48 and 72 blobs is explicitly speculative in the sources found.
- `MAX_REQUEST_DATA_COLUMN_SIDECARS` was not located in the files read; it is referenced in the p2p spec but the value was not extracted.
- Constants were read from the `master` branch of consensus-specs in Aug 2026 and reflect Fulu as shipped. If a later fork (Gloas) modifies any of them, this section goes stale.
- The precise per-node bandwidth numbers for PeerDAS at various blob counts were not measured or sourced. Several vendor blogs quote figures; none were verified here.
- I did not verify how many mainnet nodes actually run as supernodes (custody_group_count = 128) vs the minimum 4 — this materially affects real-world reconstruction behaviour and would be worth measuring.
- The claim that cell proofs are computed by the sender rather than the block producer comes from the EIP text; the exact division of labour between transaction sender, EL, and CL was not traced end to end.
---

## 11.6 — Verkle & statelessness: commitments, witnesses, state expiry, and what actually replaced Verkle

### Concepts
- ethereum-state — Ethereum state is the set of all accounts (balance, nonce, code hash, storage root) plus every contract's storage; it is hundreds of GB and grows monotonically, and it is the real reason running a node is expensive. | requires: [] | contrasts: [chain-history]
- state-vs-history — State (current balances/storage) and history (old blocks and receipts) are different problems: EIP-4444 prunes *history*, statelessness/expiry addresses *state*. Conflating them produces wrong conclusions about node cost. | requires: [ethereum-state] | contrasts: []
- merkle-patricia-trie — Today's state commitment is a hexary (16-way) Merkle-Patricia Trie; its arity is why proofs are fat — each level of the path must include up to 15 sibling hashes. | requires: [ethereum-state] | contrasts: [binary-state-tree]
- witness — A witness is the set of state values plus sibling hashes needed to prove that executing a block's transactions read and wrote exactly what it claims — the input a stateless verifier needs instead of the whole state. | requires: [merkle-patricia-trie] | contrasts: []
- statelessness — A stateless client verifies a block using only the block plus its witness, holding no state at all; weak statelessness is the practical variant where block *builders* hold state and everyone else verifies statelessly. | requires: [witness] | contrasts: [full-node]
- witness-size-is-the-blocker — Statelessness only works if witnesses are small enough to gossip inside the slot; MPT witnesses for a full block are megabytes, which is why the state commitment has to change first. | requires: [witness, das-timebound] | contrasts: []
- vector-commitment — A vector commitment commits to a list of values so that any single position can be opened with a proof whose size does not grow with the list's width — this is what makes high-arity trees cheap to prove. | requires: [] | contrasts: [merkle-hash-commitment]
- verkle-tree — Verkle trees use polynomial (KZG/IPA) vector commitments so a wide node (arity 256) can be opened without publishing siblings, shrinking witnesses by roughly an order of magnitude versus MPT. | requires: [vector-commitment, merkle-patricia-trie] | contrasts: [binary-state-tree]
- verkle-is-off-the-roadmap — Verkle has been DROPPED. It relies on elliptic-curve cryptography, which is not post-quantum, and its proofs are hostile to SNARK recursion; the roadmap moved to hash-based binary trees instead. | requires: [verkle-tree] | contrasts: [binary-state-tree]
- binary-state-tree — EIP-7864 replaces the 16-way MPT with a binary (arity-2) tree using only a hash function; branch length for an equivalent tree drops from ~2,880 bytes at k=16 to ~768 bytes at k=2. | requires: [merkle-patricia-trie] | contrasts: [verkle-tree]
- unified-key-space — In EIP-7864 account headers, code and storage all live in ONE 32-byte key space (HEADER_SUBTREE=0, CODE_SUBTREE=1, STORAGE_SUBTREE=255), removing the per-account storage sub-trie entirely. | requires: [binary-state-tree] | contrasts: [merkle-patricia-trie]
- stem-and-suffix — Keys split into a 31-byte stem and a 1-byte suffix, so 256 related values share a stem and one branch opening covers all of them; this is a *locality* optimisation, not just a shape change. | requires: [unified-key-space] | contrasts: []
- hash-choice-tbd — The binary tree's hash function is explicitly not final: BLAKE3 in reference implementations, with Keccak and Poseidon2 as candidates. Poseidon2 is SNARK-friendly but less battle-tested; the choice trades proving cost against cryptanalytic confidence. | requires: [binary-state-tree] | contrasts: []
- frozen-mpt-migration — The migration plan is not a big-bang conversion: the new tree starts empty and takes new writes while the old MPT is frozen, with a separate later fork (EIP-7748) sweeping remaining state across. | requires: [binary-state-tree] | contrasts: []
- state-expiry — State expiry would make untouched state stop being part of the active state after a period, requiring a resurrection proof to use it again; it has repeatedly been deferred because resurrection UX and address-format changes are brutal. | requires: [ethereum-state] | contrasts: [statelessness]
- pbt — Partitioned Binary Trees are the successor construction Buterin has flagged beyond EIP-7864 — the binary tree is positioned as a stepping stone, not the endpoint. | requires: [binary-state-tree] | contrasts: []
- statelessness-vs-zk — Real-time ZK proving of L1 blocks is now a competing (and in some framings superseding) route to the same goal: if a block comes with a validity proof, a verifier needs neither the state nor a big witness. | requires: [statelessness] | contrasts: [witness-size-is-the-blocker]

### Primary sources
- [EIP-7864: Ethereum state using a unified binary tree](https://eips.ethereum.org/EIPS/eip-7864) — tier: spec — published: 2025-01, status Draft — the current state-tree direction; authors include Buterin, Ballet, Feist, Hagopian.
- [EIP-7864 discussion (Ethereum Magicians)](https://ethereum-magicians.org/t/eip-7864-ethereum-state-using-a-unified-binary-tree/22611) — tier: primary-analysis — published: 2025-2026 — where the hash-function and arity debates actually happen.
- [Ethereum Stateless Book — Binary Tree](https://stateless.fyi/trees/binary-tree.html) — tier: canonical-docs — published: 2025-2026 — the best structured explainer of the new tree and of statelessness generally.
- [EIP-6800: Ethereum state using a unified verkle tree](https://eips.ethereum.org/EIPS/eip-6800) — tier: spec — published: 2023 — the superseded Verkle design; read for the contrast, not as current plan.
- [EIP-7748: State conversion to binary tree](https://eips.ethereum.org/EIPS/eip-7748) — tier: spec — published: 2024-2025 — the migration mechanism; verify its current status and whether it still targets binary rather than Verkle.
- [EIP-4444: Bound historical data in execution clients](https://eips.ethereum.org/EIPS/eip-4444) — tier: spec — published: 2021-ongoing — the *history* side of the pruning story, needed to keep state and history separate.
- [You Pay For What You Touch: Locality as Ethereum's Next Cost Model (Dedaub)](https://dedaub.com/blog/locality-as-ethereum-next-cost-model/) — tier: primary-analysis — published: 2025-2026 — why stem locality has gas-pricing consequences for contract developers.
- [EIP-7928: Block-level access lists](https://eips.ethereum.org/EIPS/eip-7928) — tier: spec — published: 2025 — the Glamsterdam EIP that pre-declares state access per block; adjacent to statelessness and shipping much sooner.

### Current state (Aug 2026)
- **VERKLE IS NOT ON THE ROADMAP.** This is the single most important correction in this module. Verkle trees were the plan through roughly 2024, were deferred out of Pectra, and have since been dropped entirely in favour of hash-based binary trees. Any curriculum that teaches "the Verge = Verkle trees" is teaching a cancelled design.
- Stated reasons for the drop: Verkle's polynomial commitments rest on elliptic-curve cryptography (not post-quantum), and they are expensive to verify inside a SNARK, which conflicts with the real-time-ZK-proving direction. Hash-based trees are quantum-safe and SNARK-friendly.
- **EIP-7864 (unified binary tree) is the current direction.** Status: Draft, created 20 Jan 2025. Binary arity, stem (31 bytes) + suffix (1 byte), one unified key space for headers/code/storage, branch ~768 bytes vs ~2,880 bytes hexary for a 2^24-element tree. Hash function NOT final (BLAKE3 in reference impls; Keccak and Poseidon2 are candidates).
- Buterin has since signalled a further evolution to **Partitioned Binary Trees (PBT)**, so even EIP-7864 is described as intermediate. Nothing here is fork-scheduled.
- **State expiry is likewise not scheduled.** The 2026 roadmap rewrite pushed quantum-readiness and privacy up the priority list; state expiry was dropped alongside Verkle in that reshuffle.
- Migration approach changed shape too: rather than converting the MPT, the new tree starts **empty** and the MPT is **frozen**, with a later fork sweeping the remainder (EIP-7748 lineage).
- What IS shipping in this neighbourhood: EIP-7928 block-level access lists in Glamsterdam. It pre-declares which state a block touches, enabling parallel disk reads and parallel execution — a concrete step toward the same goals without changing the state tree.
- Commonly taught and now wrong: (a) "Verkle trees are coming"; (b) "the Verge is about Verkle"; (c) "state expiry will fix state growth"; (d) that statelessness is the only route — real-time ZK proving is now a serious competitor and arguably the favoured one.

### Misconceptions
- Belief: Verkle trees are Ethereum's next big upgrade. | Reality: They were dropped. The direction is hash-based binary trees (EIP-7864), later PBT. | Why: Verkle was heavily promoted 2022–2024 and is in almost every "Ethereum roadmap" article and course. | Source: https://eips.ethereum.org/EIPS/eip-7864
- Belief: Verkle was dropped because it was too slow. | Reality: The decisive objections were post-quantum security (it uses elliptic curves) and poor SNARK-friendliness, not raw speed. | Why: "Dropped" is usually assumed to mean performance. | Source: https://ethereum-magicians.org/t/eip-7864-ethereum-state-using-a-unified-binary-tree/22611
- Belief: A binary tree gives bigger proofs than a wide tree, since it has more levels. | Reality: More levels but only one sibling per level; arity 2 minimises total proof size for hash-based trees. Wide arity only wins when you have a vector commitment that avoids publishing siblings. | Why: "Deeper tree = more work" is the wrong intuition here. | Source: https://eips.ethereum.org/EIPS/eip-7864
- Belief: Statelessness means nobody stores state. | Reality: *Weak* statelessness is the actual target — block builders keep full state, everyone else verifies with witnesses. Someone must still hold state to build blocks. | Why: The name implies total elimination. | Source: https://stateless.fyi/trees/binary-tree.html
- Belief: State expiry and history pruning are the same. | Reality: EIP-4444 prunes old blocks/receipts and is largely a solved direction; state expiry deletes *unused current state* and is unscheduled with unsolved resurrection UX. | Why: Both are "Ethereum forgets old stuff". | Source: https://eips.ethereum.org/EIPS/eip-4444
- Belief: Changing the state tree is invisible to smart contract developers. | Reality: The unified key space and stem locality change what a state access costs to prove, and there is active work on making gas reflect locality — access patterns become an optimisation surface. | Why: Trie shape feels like a pure implementation detail. | Source: https://dedaub.com/blog/locality-as-ethereum-next-cost-model/
- Belief: The migration will convert all state in one hard fork. | Reality: The plan is a frozen MPT plus an empty new tree taking writes, with conversion swept later. | Why: A one-shot migration is the obvious design. | Source: https://eips.ethereum.org/EIPS/eip-7864

### Practice ideas
- kind: measure — Using a public archive RPC, fetch `eth_getProof` for a handful of contract storage slots (e.g. a popular ERC-20's balance mapping) and measure the actual byte size of the returned proof. Then compute what the same proof would cost at arity 2 with equal element count. — Acceptance: real measured MPT proof sizes plus a defensible binary-tree estimate, and a statement of why the ratio is roughly what the EIP claims.
- kind: implement — Implement both a hexary and a binary Merkle tree over the same 2^16 leaves and compare inclusion-proof sizes and verification times. — Acceptance: your measured size ratio is in the same ballpark as 2880:768, and you can explain the sibling-count arithmetic.
- kind: implement — Implement EIP-7864's key derivation: given an address and a storage slot, compute the tree key (stem + suffix) and show that two adjacent storage slots of the same contract share a stem. — Acceptance: a demonstration that N adjacent slots need one branch opening rather than N.
- kind: read — Read EIP-6800 (Verkle) and EIP-7864 (binary) side by side and write a one-page "why the change" memo. — Acceptance: the memo names post-quantum security and SNARK-friendliness, not performance, as the decisive factors.
- kind: measure — Pull a recent mainnet block and count distinct accounts and storage slots touched; estimate the witness size under MPT and under EIP-7864's structure. — Acceptance: a number for each and a judgement on whether the witness fits comfortably in a slot's gossip budget.
- kind: write — Write the "what changed since 2024" correction sheet for an existing course module that teaches Verkle. — Acceptance: it explicitly marks Verkle as cancelled rather than delayed, and names the replacement lineage MPT → EIP-7864 → PBT.

### Visual opportunities
- Side-by-side proof anatomy: one path through a hexary MPT (15 siblings per level, few levels) vs a binary tree (1 sibling per level, many levels), with total bytes summed under each — this single picture defeats the "deeper = bigger" intuition.
- Timeline of the state-tree plan: MPT → Verkle (2022–2024, cancelled) → EIP-7864 unified binary (2025–) → PBT (proposed), with the reason for each transition annotated.
- Unified key space diagram: one 32-byte keyspace with HEADER (0) / CODE (1) / STORAGE (255) subtree prefixes, contrasted against today's account-trie-plus-per-account-storage-trie nesting.
- Stem/suffix locality: 256 suffixes under one stem, with a highlighted contract's adjacent storage slots landing in the same stem.
- Two routes to a light verifier: (a) block + witness (statelessness) vs (b) block + validity proof (real-time ZK), showing they solve the same problem differently.
- State vs history split, with EIP-4444 pointing at history and statelessness/expiry pointing at state.

### Gaps & uncertainties
- The *reasons* Verkle was dropped (post-quantum, SNARK-unfriendliness) are consistently reported across secondary sources and are consistent with the EIP-7864 rationale, but I did NOT read a single authoritative EF statement announcing the cancellation. Find the primary source (an EF roadmap post or an ACD/interop write-up) before teaching the reasoning as settled.
- EIP-7864's status is Draft as of Aug 2026 and it is NOT assigned to any fork. Do not imply a shipping date.
- "PBT / Partitioned Binary Trees" comes from secondary coverage of Buterin's 2026 roadmap update; I did not find a numbered EIP or a spec for it. Treat as a research direction only.
- Whether EIP-7748 (state conversion) has been updated from Verkle to binary, or superseded, was NOT verified. Check before linking it.
- The ~768 vs ~2,880 byte branch figures are the EIP's own claims for a 2^24-element tree; they are branch sizes, not full-block witness sizes. Do not present them as block witness sizes.
- Actual expected full-block witness sizes under EIP-7864 were NOT found. Older Verkle-era estimates (commonly quoted in the low hundreds of KB) do not transfer to the binary design.
- State expiry's status is "not scheduled / deprioritised" per secondary roadmap coverage; whether it is formally abandoned or merely parked is unclear and sources do not agree in emphasis.
- The relationship between statelessness and real-time ZK proving as roadmap priorities is contested framing, not a settled decision — present both, do not declare a winner.
---

## 11.7 — Contributing to a client: codebases, first issues, and the EPF pathway

### Concepts
- client-codebase-landscape — There is no one "Ethereum codebase": four EL clients (Geth/Go, Nethermind/C#, Besu/Java, Erigon/Go, Reth/Rust) and five-plus CL clients (Lighthouse/Rust, Prysm/Go, Teku/Java, Nimbus/Nim, Lodestar/TypeScript, Grandine/Rust) each implement the same spec. Pick by language first, not prestige. | requires: [el-cl-split] | contrasts: []
- geth — go-ethereum is the reference EL: oldest, largest, most-depended-on, and the place where "how Ethereum actually works" is often decided in practice. High bar, slow review, enormous surface area. | requires: [client-codebase-landscape] | contrasts: [reth]
- reth — Reth (Paradigm, Rust) is the modular EL: explicitly designed as a library of crates you can reuse, with the best contributor documentation of any EL and a much lower barrier to a first merged PR. | requires: [client-codebase-landscape] | contrasts: [geth]
- lighthouse — Lighthouse (Sigma Prime, Rust) is the largest CL by node count and has a mature contributor process with labelled issues and a book-style developer guide. | requires: [client-codebase-landscape] | contrasts: [prysm]
- prysm — Prysm (Offchain Labs, Go) is the second-largest CL; Go makes it the most approachable CL for a backend engineer without Rust experience. | requires: [client-codebase-landscape] | contrasts: [lighthouse]
- spec-conformance-as-entry-point — The lowest-risk first contribution is usually in the test/spec/tooling layer — consensus-spec-tests wiring, EEST/execution-spec-tests cases, hive integration tests, docs — because correctness is checkable and review is fast. | requires: [consensus-spec-tests] | contrasts: []
- good-first-issue-labels — Every major client maintains labelled entry points (`good first issue`, `help wanted`, `C-enhancement`/`D-good-first-issue` in Reth, `meta-goodfirstissue` style labels elsewhere); these are curated, not automatic. | requires: [client-codebase-landscape] | contrasts: []
- non-code-contributions — Client teams are chronically short on documentation, benchmark harnesses, devnet operation, bug triage and reproduction — all of which are real contributions and are the fastest way to become a known name. | requires: [] | contrasts: []
- acd-process — Protocol changes flow through All Core Devs calls (ACDE for execution, ACDC for consensus) recorded in `ethereum/pm`; reading those notes is how you learn what work is actually wanted before you write code. | requires: [reading-a-spec-change] | contrasts: []
- devnets-and-interop — New forks are exercised on ephemeral devnets before public testnets (Hoodi, Sepolia); running a devnet node and reporting a reproducible failure is a high-value, low-skill-ceiling contribution. | requires: [acd-process] | contrasts: []
- epf — The Ethereum Protocol Fellowship is the EF's structured cohort programme (currently Cohort 7, June–November 2026) pairing accepted participants with core-dev mentors, a stipend for selected participants, and a required public project. | requires: [] | contrasts: [epf-study-group]
- epf-study-group — Ethereum Protocol Studies is the open, no-application on-ramp *below* the fellowship: anyone can join, it runs public cohorts, and it is the explicitly recommended path for people not yet ready to apply to EPF. | requires: [] | contrasts: [epf]
- study-epf-wiki — study.epf.wiki is the study group's self-paced learning platform (a Moodle instance) introduced for the 2026 cohort, carrying tracks: Ethereum Protocol 101, Cryptography of Ethereum, and Lean Ethereum/zkEVM. | requires: [epf-study-group] | contrasts: [epf-wiki]
- epf-wiki — epf.wiki is the community-built protocol wiki (repo: eth-protocol-fellows/protocol-studies) — the reference material and the application entry point, distinct from the study.epf.wiki course platform. | requires: [epf-study-group] | contrasts: [study-epf-wiki]
- epf-selection-signal — Cohort 7 deliberately went smaller and more focused; the realistic way to get accepted is to arrive with prior public contributions and a concrete project proposal, not a CV. | requires: [epf] | contrasts: []
- public-work-log — EPF fellows publish weekly/biweekly development updates in the cohort repo; that public log is both the programme's accountability mechanism and the artefact that gets people hired. | requires: [epf] | contrasts: []

### Primary sources
- [Announcing Cohort 7 of the Ethereum Protocol Fellowship](https://blog.ethereum.org/2026/04/30/epf-7) — tier: canonical-docs — published: 2026-04 — dates, structure, stipend framing for the current cohort.
- [Ethereum Protocol Studies 2026](https://blog.ethereum.org/2026/02/17/ethereum-protocol-studies-26) — tier: canonical-docs — published: 2026-02 — the 2026 study-group relaunch, new tracks and the new self-paced platform.
- [study.epf.wiki](https://study.epf.wiki/) — tier: canonical-docs — published: 2026 — the actual course platform; Moodle-based, three tracks, Discord + YouTube playlist attached.
- [epf.wiki](https://epf.wiki/) — tier: canonical-docs — published: ongoing — the protocol wiki and application entry point.
- [eth-protocol-fellows/protocol-studies (GitHub)](https://github.com/eth-protocol-fellows/protocol-studies) — tier: canonical-docs — published: ongoing — the wiki's source repo; contributing to it is itself a viable first contribution.
- [eth-protocol-fellows (GitHub org)](https://github.com/eth-protocol-fellows) — tier: canonical-docs — published: ongoing — per-cohort repos with every fellow's project and update log; the best evidence of what a realistic EPF project looks like.
- [EPF Cohort 6 recap](https://ps.ethereum.foundation/blog/epf6-recap) — tier: canonical-docs — published: 2025-2026 — concrete outcomes and project examples from the previous cohort.
- [Introducing the EPF Study Group](https://blog.ethereum.org/en/2024/02/07/epf-study-group) — tier: canonical-docs — published: 2024-02 — origin and intent of the study group.
- [go-ethereum repository](https://github.com/ethereum/go-ethereum) — tier: canonical-docs — published: ongoing — reference EL; see CONTRIBUTING.md and the geth developer docs.
- [Reth repository and book](https://github.com/paradigmxyz/reth) — tier: canonical-docs — published: ongoing — the most contributor-friendly EL, with an architecture book and labelled issues.
- [Lighthouse book — contributing](https://lighthouse-book.sigmaprime.io/) — tier: canonical-docs — published: ongoing — CL contributor guide and development setup.
- [Prysm docs](https://www.offchainlabs.com/prysm/docs) — tier: canonical-docs — published: ongoing — Go CL, contributor and dev-environment docs.
- [ethereum/pm (All Core Devs)](https://github.com/ethereum/pm) — tier: canonical-docs — published: ongoing — agendas and notes; the real map of what work is wanted.
- [ethereum/hive](https://github.com/ethereum/hive) — tier: spec — published: ongoing — cross-client integration test harness; a good, under-staffed contribution target.
- [ethereum/execution-spec-tests (EEST)](https://github.com/ethereum/execution-spec-tests) — tier: spec — published: ongoing — where EL fork test cases are written in Python; unusually beginner-accessible for a core repo.

### Current state (Aug 2026)
- **EPF Cohort 7** was announced 30 April 2026, applications closed 13 May 2026, and the cohort runs **June–November 2026**. So as of Aug 2026 EPF7 is mid-flight; the next application window will be for Cohort 8, presumably spring 2027. Anyone reading this now should target the study group, not the fellowship.
- Cohort 7 explicitly moved to "a smaller, more focused cohort, prioritizing depth of engagement over breadth" — i.e. acceptance is *harder* than in earlier cohorts, and prior public contribution matters more.
- Stipend is for *selected* participants, not automatic for everyone accepted. Do not teach EPF as a paid job.
- **Ethereum Protocol Studies 2026** relaunched on 23 February 2026 with three tracks — Ethereum Protocol 101, Cryptography of Ethereum, and Lean Ethereum/zkEVM — and, new this year, a **self-paced learning platform at study.epf.wiki** (Moodle) rather than only live calls. The "Lean Ethereum / zkEVM" track is new and reflects the roadmap's shift toward hash-based crypto and real-time proving.
- Two domains, two things: **epf.wiki** = the wiki + application hub; **study.epf.wiki** = the course platform. Learners confuse these constantly.
- Reth's rise means "learn Rust to contribute to Ethereum" is now true on both layers (Reth + Lighthouse), which is a real change from the Go-dominated 2021–2023 era.
- Commonly taught and now wrong: that the study group is a live-cohort-only, calendar-locked thing. Since Feb 2026 it is self-paced with a persistent platform, so there is no "wait for the next cohort" excuse.

### Misconceptions
- Belief: You need to be accepted to EPF to work on the protocol. | Reality: Every client repo takes public PRs, and the study group has no application at all. EPF is an accelerator for people already contributing, not a gate. | Why: The programme is the most visible on-ramp. | Source: https://blog.ethereum.org/2026/02/17/ethereum-protocol-studies-26
- Belief: A first contribution means writing consensus-critical code. | Reality: The highest-acceptance first PRs are tests, docs, benchmarks, tooling and bug reproductions; consensus-critical changes get the most scrutiny and the slowest review. | Why: "Core dev" implies core code. | Source: https://github.com/ethereum/execution-spec-tests
- Belief: Contributing to Geth is the goal because it is the reference client. | Reality: Geth's size and review bar make it one of the hardest entry points; Reth and Lodestar are far more tractable for a first merged PR. | Why: Reference implementation reads as "the real one". | Source: https://github.com/paradigmxyz/reth
- Belief: EPF pays everyone a stipend. | Reality: The announcement says *select* participants receive a monthly stipend. | Why: Fellowships are usually funded by default. | Source: https://blog.ethereum.org/2026/04/30/epf-7
- Belief: epf.wiki and study.epf.wiki are the same site. | Reality: epf.wiki is the community wiki and application hub; study.epf.wiki is a separate Moodle course platform launched for the 2026 study group. | Why: Shared branding and domain. | Source: https://study.epf.wiki/
- Belief: You should read the whole client codebase before contributing. | Reality: Successful contributors start from a specific failing test or issue and read outward; nobody has the whole of Geth or Lighthouse in their head. | Why: Product engineers are used to owning a whole service. | Source: https://github.com/eth-protocol-fellows/protocol-studies
- Belief: Protocol work requires deep cryptography. | Reality: Most client work is systems engineering — networking, databases, sync, concurrency, performance. Cryptography is a specialised minority of the work. | Why: Blockchain is marketed as a cryptography field. | Source: https://github.com/paradigmxyz/reth

### Practice ideas
- kind: read — Enrol in Ethereum Protocol 101 on study.epf.wiki and complete it, keeping a running list of every term you had to look up. — Acceptance: a personal glossary of 30+ terms and the ability to state what each client component does per slot without looking.
- kind: fix — Clone Reth and Lighthouse, get both building and their test suites passing locally, then pick one `good first issue` from either and open a PR. — Acceptance: a PR link, plus notes on how long the build took and what broke — that friction log is itself useful data.
- kind: implement — Write a new test case in ethereum/execution-spec-tests for an existing opcode edge case (e.g. a TSTORE/TLOAD interaction, or an EIP-7702 delegation edge case from the baseline). — Acceptance: the test runs, and you can explain which clients it would catch a divergence in.
- kind: measure — Run a Hoodi or Sepolia node for a week and log resource usage, sync time, and every warning/error class emitted. File one reproducible issue against a client from what you find. — Acceptance: an issue with a reproduction, logs, versions, and hardware — the format maintainers actually act on.
- kind: read — Read the last three months of ACDE and ACDC notes in ethereum/pm and write down every item flagged as needing help or blocked on implementation. — Acceptance: a shortlist of three concrete workstreams a new contributor could plausibly join, each with a named person or team.
- kind: write — Pick a page on epf.wiki that is thin or outdated (e.g. anything still describing Verkle as the plan, per 11.6) and submit a correction PR to eth-protocol-fellows/protocol-studies. — Acceptance: a merged or reviewed PR correcting a factual claim, with a source cited.
- kind: fix — Reproduce a closed consensus bug from a client's changelog on a local devnet and confirm the fix commit actually resolves it. — Acceptance: a before/after demonstration and a written explanation of the failure mode.

### Visual opportunities
- Matrix of clients: rows = clients, columns = layer, language, team, approximate share, contributor-friendliness, "best first issue type". This is the single most decision-useful artefact in the module.
- Contribution ladder: run a node → file a reproducible issue → docs PR → test PR → tooling PR → client code PR → EPF application, with rough effort and rough time at each rung.
- The EPF/Studies funnel: study.epf.wiki (open, self-paced) → public contributions → EPF application (annual, competitive) → cohort project → client team. Shows the study group as an on-ramp, not a consolation prize.
- Annual calendar: study group cohort start (Feb), EPF announcement (Apr), applications close (May), cohort runs (Jun–Nov) — so a learner can see where in the year they are standing.
- Map of the repo ecosystem a contributor touches: EIPs, consensus-specs, execution-specs, execution-apis, hive, execution-spec-tests, and the client repos, with arrows for "a change flows this way".

### Gaps & uncertainties
- study.epf.wiki's page content could not be read properly — the fetch returned mostly Moodle backend/cache output. Confirmed: it is a Moodle instance with three named tracks (Ethereum Protocol 101, Cryptography of Ethereum, Lean Ethereum/zkEVM), a Discord chat link, and a YouTube playlist. NOT confirmed: whether enrolment is open/self-serve, whether there is a current live cohort schedule alongside the self-paced content, week-by-week syllabi, or any assessment/certificate. **Someone should log in and inspect it directly before writing lessons that point learners at specific courses.**
- EPF7 acceptance numbers, cohort size, and the stipend amount are NOT published in the sources found. Do not quote figures.
- Cohort 8 timing is inferred from the pattern (EPF6 announced Apr 2025, EPF7 announced Apr 2026), not announced. Flag as inference.
- Specific `good first issue` label names per client were not verified individually — I asserted the general pattern. Check each repo's actual label taxonomy before putting label names in a lesson.
- Client share figures referenced here inherit the conflict flagged in 11.1; do not restate a single number.
- Whether Erigon and Grandine are actively taking new contributors, and their contributor-doc quality, was not assessed.
- The claim that Reth has "the best contributor documentation of any EL" is a judgement from its public book and modular design, not a measured comparison.
