# Conflict register
Claims where sources disagreed and no agent picked a winner. **Nothing here may be published to a lesson until resolved.**
Generated from the research sweep of 25 Aug 2026 (14 agents, 78 modules).

Each entry is a place where the curriculum would have stated a confident number that is not actually supported.


---

## ✅ RESOLVED BY MEASUREMENT — 2026-08-25

See `MEASURED.md` for method and full table. Settled empirically on forge 1.7.1 / solc 0.8.36:

- **`COLD_SLOAD_COST` = 2100**, not 800. The 800 figure came from an early EIP-2929 draft. Measured 2116 minus ~16 harness overhead.
- **Warm storage read = 100**; **cold account access (BALANCE, EXTCODESIZE) = 2600**; warm = 100.
- **TSTORE = TLOAD = 100.**
- **SSTORE:** zero→non-zero 20000, non-zero→non-zero 2900, warm no-op 100 (each plus 2100 when the slot is cold).
- **LOG = 375 per topic.**
- **Reentrancy guard overhead: storage 3104 (warm) vs transient 284.** All three circulating figures (~7100, ~5000, ~200) were wrong for this configuration. Storage cost is cold/warm dependent, ~3100–7100; transient is flat ~284. **Teach the range, not a number.**

**Also resolved without measurement:** Foundry stable is **1.7.1** (`forge --version` on this machine), not 1.5.1 and not the 1.8.0 nightly. solc **0.8.36** confirmed installed.

---

## Unresolved conflicts (120)


### a01-fundamentals-ledgers

- Correlation slashing penalty formula: mikeneuder's analysis presents 3*EB*SB/TB as CURRENT and 9*EB*SB^2/TB^2 as PROPOSED; a 2026 secondary source states Pectra shipped the quadratic version. I could not confirm from consensus-specs which is live in Electra. Both agree at SB = TB/3, so the '1/3 of stake' headline is safe either way, but the intermediate curve is unresolved.
- Empty-trie root 0x56e81f...b421 was confirmed only via secondary sources after the execution-specs raw URL 404'd (repo restructure). Empty code hash 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470 and ommersHash 0x1dcc4de8...49347 are stated FROM MEMORY and were NOT verified this session - recompute before publishing.
- Glamsterdam timing: a June 2026 article says 'Q3 2026'; the shared baseline says 'H2 2026, no mainnet date'. Not resolved - do not print a date.
- MIN_SLASHING_PENALTY_QUOTIENT_ELECTRA = 4096 comes from secondary sources (Figment, Coinbase) plus a self-consistent derived anchor (2048 ETH -> 0.5 ETH). Not read out of consensus-specs this session.
- Private orderflow share: one 2026 source says '80% usage of private RPCs'; the same search shows top builders (Titan, Beaver) filling 'over 50% of their blocks with private gas used' while Rsync/Flashbots are under 50%; Blocknative's Dec 2023 baseline was ~15% of transactions. These mix three different metrics (share of transactions vs share of gas vs share of value). I did NOT pick one. Do not publish a single percentage.
- The 21-field execution header list and its exact RLP ordering was assembled from individual EIPs, not read from the execution-specs Header dataclass. Verify field order before shipping the 'RLP-encode the header yourself' exercise, which depends on it.
- Total staked ETH: Aug 2026 reporting says 41.41M ETH / 33.98% of supply (4 Aug 2026), but a mid-2026 explainer surfaced in the same search says 'over 34 million ETH staked' with a '>$35B' finality-reversal cost. Inconsistent; not resolved.
- Whether Fusaka added any execution header field: my searches returned nothing indicating one, but I could not positively confirm absence. Diff Osaka vs Prague Header in execution-specs.

### a02-evm-machine

- EIP-7685 requestsHash exact construction: confident it is SHA-256-based rather than an MPT root, but the precise nesting (whether sha256(sha256(req_0) || sha256(req_1) || ...) and whether empty request types are skipped) was not confirmed against the final Pectra text.
- EIP-7864 performance claims: secondary summaries assert ~4x shorter branches, ~3x faster proving with BLAKE3, and 'up to 100x' with Poseidon variants. These did not come from the EIP text or any benchmark I read. Not published as fact in the file.
- Foundry current stable version remains UNRESOLVED (baseline flagged this and I did not resolve it): v1.5.1 referenced as stable with solc 0.8.31 support, vs 1.8.0-nightly dated 2026-08-04. Do not pin a Foundry version in exercises without checking foundryup output.
- Gas constants across all five modules were NOT re-verified this session and are flagged as unverified in each module's Gaps section: LOG base/per-topic/per-byte (recalled as 375/375/8), SSTORE tiers (20000/2900/100), EIP-3529 refund caps (4800 per slot, gasUsed/5 total), cold/warm access (2600/100, SLOAD 2100/100), the 2300 stipend, 9000 value transfer, 25000 new-account, 200/byte code deposit. Any of these could have been repriced.
- My own derived figures in 03.6b (1 MiB memory ≈ 2.2M gas; ~3 MB practical memory ceiling under the 16.78M tx cap) are arithmetic on the memory formula, not sourced. Flagged in the file as needing re-derivation.
- SELFDESTRUCT usage statistic (957,324 internal transactions in 2025, 99.999% same-transaction) came from a secondary summary, not a primary dataset. Directionally credible, precise number not citable.
- Whether STATICCALL forbids TSTORE: believed yes (matching SSTORE) but not confirmed against EIP-1153's final text.
- Whether legacy codegen and via-IR differ in expression/argument evaluation order: believed yes, not verified against the IR-breaking-changes page.

### a03-solidity-core

- Current CALL/DELEGATECALL/STATICCALL gas costs under the osaka and amsterdam EVM revisions: EIP-150's 700 and EIP-2929's cold/warm 2600/100 layer on each other and I did not confirm no later repricing landed in Fusaka. No number published.
- Custom errors vs revert strings gas: the Solidity blog gives a REVERT-DATA-SIZE comparison (4 bytes vs 100 bytes), not a gas figure. Circulating gas numbers come from blog benchmarks with unstated optimiser settings and disagree with each other. I published no gas number and flagged this explicitly.
- Function dispatch shape: Philogy's 'Constant Gas Function Dispatchers' (2022, updated 2023) describes Solidity's dispatcher as a linear if-else chain; argotorg/solidity develop source (ContractCompiler.cpp) shows recursive binary-search splitting. I did NOT reconcile these — I recorded the source-tree behaviour and flagged the blog as conflicting.
- Legacy vs via-IR dispatcher: ContractCompiler.cpp emits explicit binary search; IRGenerator::dispatchRoutine emits a Yul `switch selector case <sel>` and leaves lowering to the Yul code transform. I could not confirm the two pipelines produce the same dispatcher shape or the same gas profile. Do not claim they do.
- Whether TSTORE throws under the EIP-214 STATIC flag: EIP-214's enumerated opcode list predates EIP-1153 and does not mention TSTORE. It is near-certainly forbidden, but I did not confirm it against EIP-1153's own text and said so.
- createDataGas: confirmed as 200 from libevmasm/GasMeter.h (GAS_CODE_DEPOSIT), giving an always-split threshold of --optimize-runs > 566. Verified from source but never measured against a real compile — the derived 566 is arithmetic, not observation.

### a04

- EIP-1167 deployment gas savings: no canonical figure exists, sources differ widely because the saving depends on the implementation contract's bytecode size. Left as a measurement exercise rather than a published number.
- ERC-6909 EIP status: a secondary source states it is still Standards Track DRAFT as of April 2026, but OpenZeppelin's 5.5.0 changelog (Oct 2025) removed its 'draft-' prefix and changed import paths - and OZ only drops that prefix when an EIP finalizes. Did not check eips.ethereum.org directly. Status left unresolved in the file.
- July 2023 Curve/Vyper incident loss total: sources give $52M (MetaTrust), ~$61M, ~$70M (several), and ~$73M, with a large but unquantified fraction later returned. No number published; mechanism taught instead.
- Vyper 0.5.0a release notes advertise 'unbounded types', which would soften one of Vyper's signature constraints (everything bounded at compile time). Unverified what it actually means; the bounded-types teaching point is flagged as possibly version-dependent.
- Vyper latest stable: PyPI info.version read 0.4.3 (2025-06-18) on 2026-08-25 and search agrees, but that is a ~14-month stable gap while 0.5.0 alphas (a1-a3, May-Jun 2025) sat open. Possible that a 0.5.0 or 0.4.4 shipped and is not reflected in fetchable data. Flagged as moderate-confidence, re-verify before pinning.
  - **RESOLVED 26 Aug 2026 against the PyPI JSON API.** The alpha dates in this entry were wrong by a
    year: `0.5.0a1` 2026-05-07, `0.5.0a2` 2026-05-29, `0.5.0a3` 2026-06-14 — **2026, not 2025**. The
    lessons that say "May and June 2026" are correct and were flagged against this entry in error.
    `0.4.3` uploaded 2025-06-18T20:09:52Z, confirming the ~14-month stable gap. No 0.4.4 or stable
    0.5.0 exists. Read `upload_time_iso_8601` per release rather than trusting a summarised date.
- Whether AccessManager or AccessControl dominates real 2026 deployments: OZ docs recommend AccessManager, but that is a vendor position and no adoption data was found.

### a05

- Current STABLE Foundry version: baseline says v1.5.1; GitHub releases/tags surfaced only nightlies plus v1.4.0-rc3 (Oct 2025). No number published in the shard.
- Fork RPC cache path: the current fork-testing page states `~/.foundry/cache/rpc/<chain>/<block>/`, while other Foundry docs surfaced via search state `$HOME/.foundry/cache/<chain id>/<block number>` with no `rpc/` segment. Did not pick one — both are recorded in the file. Matters directly for CI cache keys.
- Whether stateless fuzz counterexamples are SHRUNK: `shrink_run_limit = 5000` is documented under [invariant] only; I found no [fuzz] equivalent. Did not assert either way.
- Whether vm.prank applies to internal function calls: the prank reference says 'next call'/'subsequent calls' and does not state it. Implied external-only, but unconfirmed.
- Which solc versions the current stable forge can download: baseline's 'supports solc 0.8.31' vs solc 0.8.36 being current. Not resolved.

### a06-foundry-shipping

- Etherscan API V1 sunset date: secondary sources place the V2 consolidation anywhere in 2024-2025. No date published.
- Foundry stable version (see corrections): v1.5.1 vs 1.8.0-nightly leaves an unexplained gap in the stable line. Not resolved, not guessed.
- Hardhat 3 default web3 library (viem vs ethers) — both listed as supported, no default asserted. Also could not confirm the config keys for build profiles or for chainType / OP Stack simulation.
- Hardhat 3 performance claims. A secondary blog says '2-5x faster compilation and test execution'; other comparison posts give different numbers and none show methodology. I did not publish any multiplier.
- Hardhat 3 stable/GA date: 3.0.0 was tagged Aug 2025 with the wording 'now in beta, and ready for production use', and Nomic separately describes 3.x as stable. No separate GA announcement located, so no date published. Hardhat 2 EOL date also unknown.
- Invariant campaign runs/depth settings for CI: one source cites runs=512 depth~500, the official Foundry CI profile example uses invariant = { runs = 1000 } with no depth stated. These are conventions with no evidence behind them; I presented both as examples and picked neither.
- On-disk output path for the cheatcode gas snapshots (vm.startSnapshotGas / vm.stopSnapshotGas). Community references mention a snapshots/ directory with JSON; docs I read did not state it. Unverified.
- Sourcify match terminology: historically 'full match' / 'partial match', more recent material suggests a rename to 'exact match' / 'match'. Described the concept, avoided the label.
- Whether Foundry's isolation mode is on by default. Docs reference BOTH --isolate (opt-in framing) and --no-isolate / isolate = false (opt-out framing). I did not pick a default and flagged it for empirical verification.
- Whether forge script --multi actually enables multichain-in-one-run. The scripting docs say run the script per RPC endpoint; the CLI reference lists a --multi flag. These do not obviously agree and I did not resolve it.
- Whether forge snapshot --check still supports a --tolerance flag in the 1.x line (older versions had it). Unconfirmed — flagged before anyone designs a CI gate around it.

### a07-security

- 13 of the 20 exploit-archaeology entries are tagged [U] — incident well established, exact write-up URL not opened this session. Mechanism details for Cetus, GMX v1, Drift, KyberSwap, Radiant and Wormhole in particular need re-verification. Drift (Apr 2026) has only a legal-commentary source characterising it as a governance failure; no technical analysis found.
- Bybit loss reported variously as ~$1.4B, ~$1.46B and $1.5B (Trail of Bits' own title says $1.5B). Balancer V2 reported as ~$125M and ~$128M and 'over $100M'. Kelp DAO as ~$290M and ~$292M. Different snapshot prices; no figure picked.
- Code4rena slice formulas and the +30% report bonus came from a search summary of the docs; the awarding-process page I actually fetched did NOT contain them. Sherlock's four-phase judging durations WERE confirmed from docs.sherlock.xyz, but the Signal Score costs (2 to escalate, >=100 to comment) were not.
- GENERAL: every GitHub-releases fetch in this session returned suspiciously old data. Only the Certora version (8.16.1) came from an official changelog and should be trusted. Every other version number in this shard is flagged unconfirmed in-file.
- Halmos newest confirmed version is 0.3.3 (31 Jul 2025) from PyPI — roughly 13 months stale as of Aug 2026. Could be a stable plateau or a distribution mismatch; unverified.
- Immunefi lifetime payouts conflict across two 2026 secondary sources: $134M vs $112M. Not resolved, neither picked.
- Kontrol current version UNRESOLVED. PyPI shows only 1.0.0b1 (Mar 2024); Kontrol actually distributes via kup/Nix and GitHub releases. K Framework Tools are at 7.0. Separately: Runtime Verification launched a quadratic-funding donation campaign for 'the K Stack' in May 2026 — a sustainability signal worth stating honestly.
- Medusa and Echidna current versions UNRESOLVED. GitHub releases fetches returned Medusa v1.5.1 (11 Mar 2024) and Echidna 2.3.3 (27 Jul 2024), which contradicts Trail of Bits' 'Medusa v1' launch post dated Feb 2025. Either the pages were stale/truncated or the version scheme differs. Do not pin either version without a direct check.
- No independent non-vendor benchmark exists for either fuzzers (Foundry vs Echidna vs Medusa) or FV tools (Certora vs Halmos vs Kontrol), and no neutral audit-firm ranking exists — every comparison surfaced was authored by a market participant.
- Trail of Bits code-maturity rating scale: one source lists four ratings (weak/moderate/satisfactory/strong), another implies a longer set including Missing / Not Applicable / Not Considered / Further Investigation Required. Category names were also reconstructed from secondary summaries, not read verbatim from a report appendix.
- Unverified aggregate claims deliberately NOT adopted: '$840M lost in first five months of 2026, April alone >$600M'; 'DPRK-linked actors = 76% of losses through April 2026, up from 64% in 2025'; Cantina '$46.7M paid across 200+ protocols, Uniswap v4 $2.35M, EF Pectra $2M'. All single-secondary-source.

### a08

- Confirmation-count guidance: a low-tier secondary source claimed '12 to 32 confirmations is standard for dApps'. I did not corroborate this and explicitly flagged it as not publishable as guidance.
- Ethereum finality wall-clock: the mechanism gives ~12.8 minutes (2 epochs = 64 slots x 12s), but one benchmark source (openchainbench) reported 15.9 minutes p50 over 24h. Both figures left in the file, neither picked.
- Pure-Solidity P-256 verifier gas cost: 'hundreds of thousands of gas' is the ecosystem's directional claim but I have no measured number and did not confirm one; the practice exercise asks learners to measure it instead.
- Replacement-transaction minimum fee bump: commonly cited as 10% (or 12.5%). This is a client mempool policy (geth default), not a protocol rule, and I did not verify the current value or cross-client variation. Not presented as a spec number.
- Solidity Panic code table: docs.soliditylang.org returned HTTP 403 to automated fetches, so the table came from a secondary aggregation (cross-checked against OpenZeppelin Panic.sol constants). Wording for 0x22 and 0x51 unverified against the normative source, and 0x00 (generic compiler-inserted panic) was absent from the recovered table.
- secp256r1 precompile gas on L2 vs L1: EIP-7951 is confirmed at 6900 gas on L1. RIP-7212 on L2s (same address 0x100) is widely cited at 3450 gas. I did not verify RIP-7212's exact number or whether L2s re-priced post-Fusaka. Do not publish an L2 gas figure.
- wagmi v3 minimum TypeScript version: a search-result summary reported 5.7.3; the official migrate-from-v2-to-v3 page reported 5.9.3. Not resolved — check package.json peer deps before publishing a number.

### a09-defi

- 10 Oct 2025 liquidation total: $19B is the universal headline, but exchange liquidation feeds are known to under-report (many venues publish only one liquidation per second per symbol) and some analysts argue the true figure is materially higher. Presented as a reported floor, not a precise number.
- Aave Umbrella activation date: cryptoslate says 5 June 2025 on Ethereum; another summary said 'June 5' with no year. Likely 2025, not confirmed.
- Aave bad debt from the April 2026 Kelp DAO exploit: sources give ~$177M, ~$200M, ~$230M and ~$236M; the Kelp loss itself is quoted as both $292M and $293M. Variance is mostly ETH mark and whether Arbitrum is included. Range stated, no single figure picked.
- Ethereum builder concentration: shared baseline says Titan + Quasar ~73% of blocks; a 2026 source says Titan + BuilderNet ~80%. Cannot both be current. Neither published - file directs the author to re-measure from relayscan/mevboost.pics.
- Umbrella per-asset first-loss offsets: one summary cited '100,000 USDT' as the DAO's first-loss layer for USDT. Not verified against the governance ARFC and deliberately not published as a number.

### a10-scaling

- 2025-2026 bridge exploit figures: 'Kelp DAO ~$290-292M April 2026 via forged LayerZero cross-chain message (~116,500 rsETH)', 'eight bridge attacks Feb-mid-May 2026 totalling ~$329M', 'over $750M total 2026 losses'. All from exchange blogs (KuCoin, Phemex). The Kelp figure would be a top-5 all-time bridge loss and needs primary confirmation. NOT verified.
- BPO3 status as of Aug 2026 is UNRESOLVED - one source says it was held pending telemetry review of BPO1/BPO2, but no primary confirmation of the current target/max was found.
- ERC-7683 adoption statistics ('88% of Across volume', 'MetaMask native support in 12.4, March 2026', 'Safe/Argent/Rabby as of Q1 2026') all trace to one vendor support-article family. The standard's existence and adoption by Across/UniswapX/Eco is well attested; the percentages are not. Its EIP status (Draft vs Final) was not checked.
- EigenDA slashing enforcement: sources say economic security 'has not been operating so far'. Whether EigenDA slashing is live and enforced as of Aug 2026 is UNRESOLVED.
- L2 sequencer revenue: one secondary source gives '$150-250M/year across top chains'. No primary confirmation found (L2BEAT, Dune, or company reporting). NOT published as fact.
- Post-Fusaka L2 per-transaction fee medians: one source gives ~$0.05 Base, ~$0.09 Arbitrum One / OP Mainnet, ~$0.07 zkSync Era (mid-2026). Unverified and volatile. Also 'blob utilisation dropped to 20-30% after BPO2' - single secondary source, unverified.
- Stylus max contract size: the Arbitrum gentle-introduction page says 96 KB ('four times the Solidity limit'); the VM-differences page says MaxWasmSize defaults to 128 KB, raised to 256 KB at ArbOS61+. These may measure compressed on-chain size vs decompressed WASM, but the docs disagree on the headline number. NOT resolved.
- Superchain interop mainnet production status is UNRESOLVED - docs say 'in active development and available for testing'; whether any mainnet chains are live on it was not confirmed. Same for whether Espresso shared sequencing has shipped for the Superchain.
- Whether Stylus SDK reentrancy protection is on or off by default was NOT determined - this materially affects one of my proposed practice exercises.
- ZK proving COST: shard baseline says SP1 ~$0.001 per proof; secondary sources this session said '0.5-1 cent per transaction' and 'as low as tenths of a cent per transaction'. Different units (per proof vs per transaction). NOT resolved - no number should be published without its unit and source.
- ZK proving LATENCY: claims found were 'seconds' (SP1 Hypercube, 16 GPUs, L1 blocks), '30 minutes' (zkSync Boojum), '75 minutes' (Linea gnark), 'tens of minutes' (generic). Different years and different scopes. NOT resolved.

### a11-zk

- Aztec alpha mainnet: reported as launched 31 March 2026 with ~$1.2B TVL, but only by low-quality secondary sources (a KuCoin flash, an exchange blog, an 'ecosystem analysis' site). The TVL figure in particular is implausible for a privacy L2 four months in. Flagged as unverified, not adopted.
- BLS12-381 security level: quoted variously as '~126 bits', 'slightly below 128 bits', and '128-bit target'. Sources disagree; I did not pick one.
- BN254 post-exTNFS security level: quoted as 100, 102, and 103 bits across sources. I did not pick one - say 'approximately 100 bits, down from an original 128-bit claim'.
- Current Noir version: a 2026-07-31 nightly reportedly carried 1.0.0-beta.26, but the GitHub releases feed I fetched (through 2026-08-11) showed only dated nightlies and no stable 1.0. Exact current beta number unresolved.
- EIP-1108's exact post-Istanbul pairing constants (believed 45000 base + 34000 per pair) and EIP-4844's point-evaluation precompile gas (believed 50000) were recalled from memory and NOT re-verified this session. Both flagged in-file for verification before publishing.
- EIP-8079 EXECUTE precompile semantics: some sources describe it as literal L1 re-execution of L2 blocks ('no ZK circuits, no proof systems'), others as an enshrined interface eventually discharged by proofs. I did not resolve which the EIP actually specifies.
- No gas benchmark for UltraHonk verifiers (the Noir/Barretenberg default) could be found at all - search for 'Honk verifier gas' returns an unrelated memecoin. This is a genuine gap for anyone teaching the Noir-to-L1 path.
- Post-Fusaka blob target/max counts: BPO (blob-parameter-only) forks step these up without a full hard fork, and I could not establish the current pair as of Aug 2026. No number published.
- SP1 Hypercube block-proving percentage: >93% under 12s (baseline) vs 99.7% under 12s vs 95.4% under 10s (two different Succinct blog posts). Not reconciled - do not publish a single number.
- Verifier gas formulas (Groth16 ~207k + 7.16k per public input; FFLONK ~200k + 0.9k per public input) come from a single 2024 Orbiter Finance community analysis, not a spec. Widely repeated but not independently confirmed.

### a12-protocol

- Consensus-client share: clientdiversity.org publishes two irreconcilable datasets on the same page. Miga Labs (node crawl): Lighthouse 50.95%, Prysm 20.8%, Nimbus 9.19%, Teku 7.87%, Lodestar 3.21%, Grandine 1.75%, Unknown 2.44%. Rated.Network (stake/attestation fingerprinting): Teku 53.86%, Prysm 21.17%, Lighthouse 20.6%, Nimbus 3.12%, Grandine 0.72%, Lodestar 0.53%. Did NOT pick one — the methodologies measure different things (nodes vs stake) and the Teku gap is extreme.
- Current mainnet blob target/max as of Aug 2026 is UNVERIFIED. Confirmed only up to BPO2 (Jan 2026, 14/21). Whether further BPO forks landed Feb–Aug 2026 was not checked; talk of 48 and 72 blobs is explicitly speculative in the sources found.
- Execution-client share: Ethernodes gives Geth 50.13%, Nethermind 25.46%, Besu 9.45%, Reth 7.67%, Erigon 6.53%. supermajority.info's manual survey gives Geth 43%, Nethermind 43%, Besu 8%, Reth 3%, Erigon 3%. Did NOT pick one.
- Glamsterdam/ePBS mainnet timing: shared baseline says no mainnet date; secondary sources retrieved say variously 'Q4 2026' and 'Sepolia Aug 3 / mainnet ~Sept 16'. Mutually inconsistent. Did NOT pick one — deferred to ethereum/pm ACD notes.
- PROPOSER_SCORE_BOOST exact value NOT verified. Universally cited as 40 (reduced from an earlier 70) but I could not read the constant from the spec this session. Explicitly flagged as do-not-publish-without-checking. Same for the optional late-block-reorg thresholds (commonly 20 / 160 / 2 epochs).
- Verkle's cancellation rationale (post-quantum + SNARK-unfriendliness) is consistent across secondary sources and consistent with EIP-7864's rationale, but no single authoritative EF announcement of the cancellation was located. Also unresolved: whether EIP-7748 (state conversion) has been updated from Verkle to binary or superseded, and whether state expiry is formally abandoned or merely parked.
- Whether engine_newPayloadV5 is an Osaka method or a Glamsterdam/Amsterdam addition tied to EIP-7928 block-level access lists — not resolved. The Osaka spec surfaced only getPayloadV5 and getBlobsV2/V3.
- consensus-specs release DATES unverified — the releases page fetch returned tags v1.7.0-alpha.10 through alpha.14 with a year that was almost certainly mis-rendered (reported 2024 for 2026 content). Tags treated as reliable, dates as unconfirmed.
- ePBS validation-window widening: sources give both '~2s to ~9s' and '~4s to ~6-9s' depending on what they treat as today's baseline. Both recorded; did NOT average.
- study.epf.wiki content could not be read properly (the fetch returned Moodle backend/cache output). Three track names, Discord and YouTube links confirmed; enrolment mechanics, live-cohort schedule, week-by-week syllabi and any assessment/certificate are UNKNOWN and flagged as needing a direct human inspection before lessons point learners at specific courses.

### a13-altvm

- Agave version at which the greedy scheduler replaced prio-graph as default: search results say 'since Agave 2.3' but I did not confirm against release notes. The existence of the switch is well supported; the version pin is not.
- Anchor 1.0.0 release date: 'April 2026' comes from a secondary summary. I saw dated entries for 1.0.2 (2 May 2026) and 1.0.3/1.1.2 (26 June 2026), which is consistent with but does not prove an April 1.0.0.
- Anchor-vs-Pinocchio CU savings quoted at 84% from a conference-talk summary with unstated methodology ('almost identical code'). Directional only; the p-token numbers (4,645->76, 6,200->105) are far better attested.
- Cashio exploit loss: sources in this session say $52.8M; the widely repeated figure elsewhere is ~$48M. Not resolved - do not pick one.
- Drift 2026 exploit loss: CoinDesk reports ~$270M; Crowdfund Insider, PYMNTS, TRM Labs and Chainalysis report ~$285M. Different valuation snapshots. State the range.
- Is IBC Eureka live for Ethereum MAINNET transfers today? The 2026 Cosmos roadmap describes IBC v2 / IBC Solidity as ENABLING Ethereum connectivity and lists Solana/L2 support as a Q2 2026 item; secondary sources imply it is already live. Unresolved.
- Pinocchio release dates: the GitHub releases fetch returned 2024 dates for 2026 releases (almost certainly a relative-date misparse). Version numbers (0.11.2 latest, no 1.0) are trusted; the dates are not.
- SIMD-0110 (dynamic write-lock fees on contentious accounts, 1,000 micro-lamports/CU initial rate, 1%/block adjustment): described in all sources as PROPOSED. Could not confirm mainnet activation status as of Aug 2026 - do not teach as live.
- p-token activation date: sources variously say 'epoch 971', 'spring 2026', 'expected April 2026', and 'reported live 13 May 2026'. Consistent but not identical; no precise calendar date confirmed.
- p-token blockspace impact: one source says '~10% of total blockspace freed', another says '~12% of all chain compute including votes' over a specific Aug 2025 sampling window. Different definitions AND different magnitudes - do not merge.

### a14-infra

- 2026 DeFi loss totals: an aggregator claims '$840M lost in 2026' which is not reconcilable with the shared baseline's 2025 figure of $905.4M across 122 incidents. No 2026 total should be published.
- Alchemy eth_getLogs compute-unit cost: the fetched Alchemy docs table says 60 CU flat; a secondary comparison blog says 75 CU per log returned. Not resolved.
- Cross-provider CU multipliers ('eth_call = 1 Dwellir / 20 QuickNode / 26 Alchemy / 80 Infura / 200 Ankr') come from a competitor's blog; only Alchemy's 26 CU is first-party confirmed.
- Current stable versions for all execution/consensus clients, Ponder, Envio HyperIndex, Squid SDK, and Foundry (baseline's v1.5.1-vs-1.8.0-nightly ambiguity) remain unresolved.
- Forta Network's 2026 operational status and its claimed adoption by dYdX/Balancer/Compound are from a secondary blog only.
- Full-node disk growth rate: Geth's own docs say ~14 GB/week (~2 GB/day); a vendor blog says ~1 GB/day. Not resolved.
- Fusaka BPO fork schedule and current blob target/max (search claims 14/21 from 7 Jan 2026) not verified against a spec source.
- Geth archive node size: geth.ethereum.org/docs still states 'more than 12TB', while secondary sources claim a new path-based archive mode brings it to ~2 TB. Did not resolve; do not publish either as the current figure.
- Infura/MetaMask Developer 2026 credit tiers (3M/15M/75M credits per day, 500 credits/sec free tier) come only from a secondary summary; both official docs URLs I tried returned 404. Unverified.
- Monitoring alert thresholds: one secondary source gives TVL drop >5%/block, mint spike >10x, flows >$500K/5min, price deviation >15%; the arXiv TVL-fragility paper gives $5M absolute / 200% relative / MAD>12. Two orders of magnitude apart and measuring different things. Present as 'derive from your own baseline', not as defaults.
- Per-client 2026 disk figures (Reth ~1.2 TB full / ~2.8 TB archive, Erigon ~1.8-2.2 TB archive) come only from SEO-style secondary blogs, contradicted by first-party Geth docs on the archive number. Unverified.
- The Resolv USR exploit (22 March 2026), cited as the canonical good-incident-response example, is attested by exactly one secondary blog. Date, mechanism and outcome all unverified.


## Baseline corrections (48)

Changes the sweep made to facts established earlier in the session.


### a01-fundamentals-ledgers

- No factual corrections to the shared baseline were found; every baseline item my shard touched (EIP-7702 delegation designator and nonce semantics, Fusaka 30M->60M gas limit and ~16.78M per-tx cap, FOCIL declined for Glamsterdam, MEV-Boost ~90% / top-2 builders ~73%, blob sizing) was consistent with primary sources.
- Refinement, not correction: the baseline lists FOCIL as the only Glamsterdam declination. EIP-7782 (6s slots) was also declined and deferred to Hegota.

### a02-evm-machine

- BASELINE CORRECTION — Solidity 0.8.36 stack-to-memory spilling: the baseline says it 'effectively solves stack-too-deep'. True only on the EXPERIMENTAL SSA CFG code generator, enabled with `--experimental --via-ssa-cfg`. It is NOT the default for --via-ir, and --via-ir is itself STILL NOT the default pipeline as of 0.8.36 (July 2026) — legacy codegen remains the compiler default. Stabilising the SSA CFG codegen is stated as the maintainers' priority for the next six months. Do not teach stack-too-deep as solved for ordinary projects.
- Baseline says Glamsterdam headline EIPs are 7732 and 7928 — accurate, but EIP-7668 and EIP-7745 (bloom filter removal/replacement) are also listed in the proposed Glamsterdam meta (EIP-7773). Neither is confirmed for inclusion; worth adding to the Glamsterdam watch list.
- The Solidity repository has moved to the `argotorg/solidity` GitHub org, with the Argot Collective publishing the roadmap. Issue links and contribution docs in older material point at the wrong org.

### a03-solidity-core

- Addition to baseline (not a contradiction): the Solidity repository moved to github.com/argotorg/solidity. Baseline's Solidity items should carry this so source links resolve.
- Addition to baseline: default solc EVM version has been `osaka` since 0.8.31, so MCOPY/TSTORE/TLOAD/BLOBHASH are assumed present unless the target is lowered for an older L2.
- Baseline says 'Solidity 0.8.36 ... SSA codegen gained stack-to-memory spilling which effectively solves stack-too-deep'. Correction: the SSA CFG codegen is experimental and must be enabled via --experimental / settings.experimental (gate introduced 0.8.35). It does not solve stack-too-deep for a default 0.8.36 compile.
- Baseline's Foundry version item is unresolved but my shard did not need it; I resolved nothing there. Flagging so it is not assumed covered.
- Baseline's transient-reentrancy-guard figures (~200 vs ~7100 gas) are order-of-magnitude, cold/warm and optimiser dependent; I could not source them primarily and recorded them as unverified in the file rather than restating them as fact.

### a04

- Baseline said nothing about OZ versioning, but a common assumption to correct: OZ 5.x removed increaseAllowance/decreaseAllowance from ERC20 itself (they survive only in SafeERC20 as safeIncreaseAllowance/safeDecreaseAllowance, plus forceApprove). Any curriculum text recommending token.increaseAllowance() is wrong against current OZ.
- Baseline's transient reentrancy guard figure (~200 gas vs ~7100 with storage) conflicts with widely circulated secondary sources quoting ~5000 for the storage guard. The storage number depends on cold/warm slot state and refunds. Flagged in the file as measure-don't-quote; neither number was picked.
- Correction to my own 04.6 draft, resolved while researching 04.9: Clones.cloneWithImmutableArgs landed in OZ 5.4.0 (2025-07-17), not 5.2.x as I initially guessed. The file was patched in place.
- Correction to my own 04.6 draft: CREATE3 is no longer only a third-party (Solady/Solmate) pattern - OZ 5.7.0 ships a first-party Create3 library.

### a05

- Baseline implies 'Foundry v1.5.1 supports solc 0.8.31' while also stating solc 0.8.36 (Jul 2026) is current. If both hold, a project pinning solc 0.8.36 may need a nightly Foundry. I flagged this as an unresolved conflict rather than resolving it; it materially affects any 'pin your solc' lesson.
- Baseline says 'Foundry v1.5.1 referenced as stable'. I could NOT confirm this. The GitHub releases API and the tags page both render nightlies only; the only non-nightly tags I could surface were v1.4.0-rc2/rc3 from Oct 2025. Nightlies are confirmed cut daily through 2026-08-25. The stable pin remains genuinely UNRESOLVED — it needs `foundryup --list` / `forge --version` on a real machine, not a web source.
- Documentation location changed: the canonical Foundry docs site is now getfoundry.sh, not book.getfoundry.sh. book.* still serves some legacy pages (make-persistent, roll-fork) but many tutorial links are stale, and several new-site paths that appear in search results 404 on direct fetch (e.g. /forge/tests/fuzz-testing, /forge/advanced-testing/fuzz-testing/, /forge/tests/forking). Every doc link in curriculum material needs re-verification before shipping.

### a06-foundry-shipping

- Baseline correctly notes forge test --json is broken (#3001) — confirmed still open and still the reason to use --junit in CI. No correction, just re-confirmed for the CI module.
- Baseline framing that calldata is a flat 4/16 gas cost model is incomplete post-Pectra: EIP-7623 added a floor price making data-heavy, computation-light transactions cost more than the old model implies. This matters directly for gas-optimisation teaching.
- Baseline said 'Foundry v1.5.1 referenced as stable... Exact current stable is UNRESOLVED - resolve if your shard touches it.' I could NOT resolve it. My shard touches it heavily and it remains unresolved: v1.5.1 is the newest stable I could name, nightly reads 1.8.0-nightly (2026-08-04). Someone must run `foundryup && forge --version` — this is a 60-second task that gates every version pin in Track 05.

### a07-security

- Baseline entry on 2025 loss data (122 incidents, $905.4M) directly conflicts with a 2026 secondary aggregator claiming 'DeFi protocol losses fell 74% to $680M in 2025, 89% from protocol-logic exploits'. Almost certainly different scopes (smart-contract-only vs DeFi-protocol-only vs all-crypto incl. CEX). Neither was corrected — both are flagged in the file as not-mergeable.
- EIP-7702 has a concrete threat-modeling consequence worth propagating to other shards: any threat model or contract guard relying on msg.sender == tx.origin to mean 'not a contract' is now unsound post-Pectra. Added as a practice exercise in 06.1.
- The baseline's note that Foundry's exact current stable is unresolved matters directly for 06.5: any CI story for fuzz results must use --junit, not --json (issue #3001 still open). No new Foundry version information was found in this shard.

### a08

- Baseline framed ERC-5792 sendCalls as the batching story; add that session keys/permissions (ERC-7715 wallet_grantPermissions + ERC-7710 delegation manager) are the adjacent standard, both still DRAFT and shipped only experimentally (MetaMask Delegation Toolkit ships them under an 'experimental' namespace).
- Baseline listed EIP-7951 as 'secp256r1 precompile at 0x100 costing 6900 gas' — confirmed correct, but add the two load-bearing details it omits: no low-s enforcement (signatures are malleable by design), and failure returns zero-length output rather than reverting.
- Baseline said 'Foundry: v1.5.1 referenced as stable ... Exact current stable is UNRESOLVED'. Partially resolved: the Foundry installed on this machine is cast/forge 1.7.1, commit 4072e487, build timestamp 2026-05-08. Stable is therefore at least 1.7.1 as of Aug 2026, not 1.5.1.
- Baseline said 'viem + wagmi is the default EVM app stack' without a version. Correct to: viem@latest = 2.55.19 (viem@next = 3.0.0-next.10, prerelease), wagmi@latest = 3.7.6. Teach viem 2.x and wagmi 3.x; wagmi 3 hook names differ from every v2 tutorial.
- The ERC-4337 documentation explicitly states session-key patterns 'are not yet standardized and are implemented wallet-by-wallet' — session keys should not be taught as an ERC-4337 feature; 4337 does not define them.

### a09-defi

- Baseline builder-share figure needs re-checking. Baseline says top-2 builders (Titan, Quasar) ~73%. A 2026 source instead reports ~80% of blocks built by two builders named as Titan and BuilderNet. Not resolved - flagged in the file as a live conflict, neither number published as fact.
- Baseline is silent on Aave v4 status, but April 2026 incident reporting states the attacker 'repeated the trick on Aave V4', implying v4 was live on mainnet by then. Could not confirm from primary Aave sources. Flagged as unresolved in 08.4 and 08.5.
- Commonly-taught 'Aave close factor is always 0.5' appears outdated - v3.2/v3.3 permit a 100% close factor for small or deeply-underwater positions. The v3 Pool docs still state 0.5. Flagged as needing verification against aave-v3-origin rather than asserted.

### a10-scaling

- Baseline says 'Foundry v1.5.1 stable, exact current stable UNRESOLVED'. Still unresolved - my shard's practice exercises use Foundry but I did not need or verify a version pin, so this remains open for a shard that touches toolchain versions directly.
- Baseline says 'SP1 Hypercube proves >93% of Ethereum blocks in under 12s'. This is L1 BLOCK proving on a 16-GPU cluster, a different workload from proving an L2 batch. It must not be cited as L2 proving latency - production L2 provers were variously reported at 30min (zkSync Boojum) to 75min (Linea).
- Baseline's 'Fusaka: PeerDAS, 128 columns' is correct but incomplete for L2 teaching: the blob TARGET/MAX changes came from separate EIP-7892 BPO forks (BPO1 2025-12-09, BPO2 2026-01-07), not from Fusaka itself. Fusaka enabled them; the BPOs delivered them.

### a11-zk

- Baseline blob facts (4096 field elements x 32 bytes = 128 KiB, versioned hash of a KZG commitment, EVM cannot read blob contents) all confirmed against EIP-4844. Added detail: the versioned hash is 0x01 || sha256(commitment)[1:], and the point-evaluation precompile at 0x0a takes exactly 192 bytes.
- Baseline said SP1 Hypercube 'proves >93% of Ethereum blocks in under 12s'. Succinct's own posts also claim 99.7% under 12s and 95.4% under 10s on 16x RTX 5090. These figures are from different posts/hardware configs and I did NOT reconcile them. The baseline number is not wrong so much as under-specified - always state the hardware and source post.
- Baseline's L2BEAT stage framing is confirmed and is more load-bearing for Track 10 than it looks: zkSync Era and Linea sit at Stage 0 DESPITE validity proofs because upgrade keys are centralised. This is the counterexample that kills 'a verifier contract makes a rollup trustless'.

### a12-protocol

- Baseline lists PeerDAS as '128 columns' which is correct, but it omits that blob capacity has already been raised twice by BPO forks after Fusaka: BPO1 (9 Dec 2025) target 10 / max 15, BPO2 (7 Jan 2026) target 14 / max 21. BPO ('blob parameter only') forks are a new lightweight upgrade class and are now the normal way blob capacity changes.
- Baseline says FOCIL (EIP-7805) was deferred to 'Hegota'. That is the execution-layer codename; the consensus-specs repo lists the corresponding CL fork as 'Heze' (unstable, epoch TBD), sitting after Gloas. The pairing Heze<->Hegota is inferred from ordering, not confirmed by a primary source.
- Baseline's 'Glamsterdam: final devnet mid-June 2026, targeted H2 2026, no mainnet date' is the safest statement and I kept it. Secondary news sources retrieved today contradict it and each other (one says 'mainnet Q4 2026', another says 'Sepolia Aug 3, mainnet ~Sept 16'). I did not adopt any of those dates.
- Baseline's blob framing ('~18 day retention') is confirmed and now has a spec constant behind it: MIN_EPOCHS_FOR_DATA_COLUMN_SIDECARS_REQUESTS = 4096 epochs = ~18.2 days. Note that post-Fusaka the retained/served unit on mainnet is the DataColumnSidecar, not a whole blob — nodes no longer download whole blobs at all.
- Client-share figures often carried in curricula (Geth ~85%, Prysm supermajority) are stale. By Aug 2026 Geth is roughly half of nodes and Lighthouse — not Prysm — is the largest CL by node count. But see unresolved conflicts: the two published datasets disagree badly.

### a13-altvm

- Baseline says 'Sealevel parallelism from declared account access' - correct, but worth sharpening for authors: Solana is PESSIMISTIC (reader/writer locks derived from the declared account list, no abort-and-retry), which is the opposite of Aptos Block-STM's optimistic execute-and-re-execute. Both are commonly described as 'parallel execution' and students conflate them.
- Baseline security loss data (122 incidents, $905.4M in 2025; access control dominant) is cross-chain, not Solana-specific. I found no verified 2026 Solana-specific aggregate loss figures. Authors should not present the baseline numbers as Solana statistics.
- The baseline's Solana entry does not mention that the scheduler is client-specific, not protocol-specified. Agave's greedy scheduler and Firedancer's scheduler differ; claims of the form 'Solana's scheduler does X' are really 'Agave's scheduler does X'.

### a14-infra

- Baseline says 'Envio HyperIndex is fastest'. Refinement: only on the events-only workload. In Sentio's OBIB open benchmark, Sentio wins events+RPC-calls (7.78 vs Envio 8.54 min) and Subsquid wins bulk transactions (1.25 min) with three platforms unable to run that workload at all. Speed ranking inverts by workload — teach it as workload-dependent, and teach capability/completeness (traces, factory templates, RPC-in-handler) as the dominant selection axis.
- Baseline says 'Ponder's team joined Monad Feb 2026' — confirmed, and the important addendum is that Ponder is explicitly continuing as open source, so it should not be presented as deprecated.
- Baseline says 'SQD/Subsquid acquired and mid-rebrand' — the acquirer is Rezolve AI and the date is October 2025 (not 2026).


## Notable findings (84)

Facts that change how a topic must be taught.


### a01-fundamentals-ledgers

- Aug 2026 staking: ~41.4M ETH staked = ~34% of supply across ~897k validators; native APR compressed to ~2.66-2.78% (from 5.06% peak Jun 2023). Finality-reversal cost anchor is therefore ~13.8M ETH destroyed. Teach the ETH quantity, never a fiat figure.
- Blob transactions have a SEPARATE mempool with different rules that break naive tooling: geth blobpool PriceBump = 100 (100% fee bump to replace, vs 10% for the legacy pool), a fee floor, and nonce-gapped blob transactions are DISALLOWED outright. This is client policy, not an EIP, and is essentially untaught.
- EIP-7782 (12s -> 6s slots) was DECLINED for Glamsterdam and deferred to Hegota, for the same reason class as FOCIL. Slot time stays 12s. This is a second 'declined for Glamsterdam' item the shared baseline did not list.
- Post-Electra slashing is far softer than every pre-2025 source says: MIN_SLASHING_PENALTY_QUOTIENT went 32 -> 4096, so a slashed 32 ETH validator loses ~0.0078 ETH up front (was ~1 ETH); a 2048 ETH validator loses ~0.5 ETH. Total loss still occurs only when ~1/3 of all stake is slashed in the same 8192-epoch window. Slashing prices correlation, not mistakes.
- The execution block header is 21 fields as of Prague; Fusaka appears to have added none. requestsHash (EIP-7685) is a SHA256 accumulator, NOT a Merkle Patricia root - the only non-MPT root-shaped field in the header.
- Verkle trees are DEAD as the MPT successor. The live direction is EIP-7864 (unified BINARY tree, merging accounts+storage+code, 31-byte stems, hash function still TBD with BLAKE3 as the experimental placeholder). Status: Draft, not in any named fork. Any curriculum teaching 'Verkle is coming' is wrong.

### a02-evm-machine

- EIP-7623 (Pectra, LIVE) means 'calldata costs 16/4 gas per byte' is now conditionally wrong — data-heavy transactions pay a floor of 40 gas per non-zero byte and 10 per zero byte. EIP-7976 would raise that floor to a flat 64 gas/byte but is unscheduled peer review.
- EIP-7825's ~16.78M single-transaction gas cap (Fusaka) interacts with quadratic memory pricing to set a hard practical ceiling on memory allocatable in one transaction — a new constraint that did not exist before Dec 2025.
- SELFDESTRUCT is effectively vestigial post-EIP-6780: it only erases code/storage if the contract was created in the same transaction, otherwise it just sweeps balance. Nearly all remaining 2025 usage is the same-tx create-and-destroy pattern.
- The 2048-bit logs bloom filter is on death row: EIP-7668 (force blooms empty) and EIP-7745 (adaptive, provable two-dimensional log index) are both Draft and both proposed for Glamsterdam. Reason is bloom saturation making false-positive rates useless at current log volumes.
- Verkle trees are DEAD as Ethereum's state-format migration path — superseded by EIP-7864's unified binary tree, which freezes the existing MPT and starts a new empty binary tree for new writes. Hash function (BLAKE3 vs Poseidon2) still undecided. Any curriculum teaching 'Verkle is next' is wrong.
- requestsHash (EIP-7685, Pectra) is a SHA-256 commitment, not a Merkle Patricia root — the first block-header commitment to break the 'every root is an MPT root' pattern. Good teaching hook, but exact nesting formula unverified.

### a03-solidity-core

- 0.8.36 fixed an unintentional reversal of the linearizedBaseContracts annotation that 'would affect analysis and code generation dependent on the inheritance order' — a real correctness bug in inheritance handling present in 0.8.31–0.8.35.
- 0.8.36's stack-to-memory spilling in the SSA CFG codegen is EXPERIMENTAL, gated behind the --experimental CLI flag / settings.experimental introduced in 0.8.35. It is not the default behaviour of solc 0.8.36 — the shared baseline overstates this.
- Solidity's canonical GitHub repo is now argotorg/solidity, not ethereum/solidity — the GitHub API resolves ethereum/solidity to argotorg/solidity. Source paths and issue links in all older curricula are stale.
- require(cond, CustomError()) has been supported since 0.8.26 (via-IR) and 0.8.27 (legacy pipeline). The canonical 2021 Solidity blog post on custom errors still says it is unsupported and has never been amended — this is the single most widely-repeated stale claim in this shard.
- solc 0.8.31 (3 Dec 2025) deprecated send and transfer on address, deprecated virtual modifiers, deprecated ABI coder v1, and set the default EVM version to `osaka`. The 2300-gas-stipend advice that dominates existing material is now actively against compiler guidance.
- solc's legacy dispatcher is a BINARY SEARCH over selectors sorted as integers, not a linear if-else chain. Verified from ContractCompiler::appendInternalSelector: never splits for <=4 selectors, split condition is `_runs * 6 * (n - 4) > 17 * createDataGas` with createDataGas=200 (GasMeter.h), so --optimize-runs > 566 always splits. Dispatch gas therefore varies by where a selector sorts. The widely-cited Philogy blog post (2022) says linear and is now wrong.

### a04

- EIP-7702 invalidates a load-bearing assumption in several of these patterns at once: msg.sender==tx.origin and address.code.length==0 no longer identify an EOA (delegated EOAs carry 23 bytes of code). This breaks pre-2025 anti-contract guards, airdrop/claim EOA checks, and 'pushing ETH to an EOA cannot execute code'. Should be taught alongside pull-over-push, not only in the EIP-7702 module.
- OZ 5.6.0 changed ERC-1155 receiver semantics: a batch transfer with a single item now calls onERC1155BatchReceived, not onERC1155Received. This is a live integration break for any receiver contract that only implements the single hook.
- OZ 5.6.0 made proxy initialization MANDATORY - ERC1967Proxy reverts with ERC1967ProxyUninitialized if deployed with no initializer. This closes the classic uninitialized-proxy footgun and changes how the factory/clone lesson should be framed.
- OZ's direction of travel in the last 18 months is account abstraction and crosschain, not tokens. 5.4/5.5 added Account, AccountERC7579, SignerECDSA/P256/RSA/WebAuthn, ERC-7913 multi-signer; 5.6/5.7 added ERC-7786 messaging gateways, ERC-20/721/1155 bridges, GovernorCrosschain, ERC-7930 interoperable addresses, TrieProof, and paymasters. 'OZ provides nothing for AA' is now wrong.
- OpenZeppelin Contracts current version is 5.7.0, released 2026-07-29 (verified from the raw CHANGELOG). There is NO 6.0; 5.0 (Oct 2023) is still the last breaking major. Cadence in the 5.x line is roughly quarterly: 5.2.0 (2025-01-08), 5.3.0 (2025-04-09), 5.4.0 (2025-07-17), 5.5.0 (2025-10-31), 5.6.0/5.6.1 (2026-02-25/27), 5.7.0 (2026-07-29).
- Vyper's worst incident is the strongest teaching artifact in this whole track: versions 0.2.15/0.2.16/0.3.0 mis-assigned storage slots for @nonreentrant locks, so CORRECT source compiled to bypassable bytecode and Curve pools were drained (July 2023). The lesson is 'the compiler is inside your TCB', which generalizes far beyond Vyper.

### a05

- 'prefer bound over assume' is now an EXPLICIT documented recommendation on the vm.assume reference page, not community folklore. Confirmed Aug 2026 fuzz defaults: runs 256, max_test_rejects 65536, dictionary_weight 40, include_storage/include_push_bytes true, failures persisted to ./cache/fuzz/failures and replayed automatically.
- Block pinning in fork tests is a COST and CACHE decision, not just determinism: the RPC cache is keyed by chain id AND block number, so an unpinned 'latest' fork can essentially never hit cache and re-fetches every slot over RPC on every run.
- Call isolation is ON by default: each top-level external call from a test runs as a separate transaction in a separate EVM context. Gas numbers from any pre-isolation tutorial are not comparable, and --no-isolate / isolate=false is the opt-out. This must be flagged wherever gas is taught.
- Inline per-test config comments are PROFILE-SCOPED: '/// forge-config: default.fuzz.runs = 10000' silently does nothing when CI runs with FOUNDRY_PROFILE=ci. Easy-to-miss trap worth its own teaching beat.
- testFail* is GONE from Foundry's documented test prefixes. Current documented set is test/test_, testFuzz, invariant*/statefulFuzz*, table* (data-driven), and check*/prove* which only run under --symbolic. Foundry now ships a symbolic path in-tree, weakening the old 'use halmos/Echidna separately' framing.
- vm.expectRevert now requires opt-in for internal calls via a '/// forge-config: default.allow_internal_expect_revert = true' comment, and gained reverter-address and uint64 count overloads (count=0 asserts NO revert), plus expectPartialRevert for parameterised custom errors. Older material saying 'expectRevert just works on internal functions' is wrong.

### a06-foundry-shipping

- ERC-7955 (Draft) proposes a permissionless CREATE2 factory at 0xC0DEb853af168215879d284cc8B4d0A645fA9b0E bootstrapped via EIP-7702, because the ubiquitous 0x4e59b44847b379578588920cA78FbF26c0B4956C proxy uses Nick's method and CANNOT be deployed on chains requiring EIP-155 replay protection or using a different gas schedule. 'CREATE2 gives the same address everywhere' is false in a specific, teachable way.
- Etherscan consolidated all its explorers behind a single V2 endpoint (api.etherscan.io/v2/api?chainid=N) with ONE API key. Every tutorial telling learners to collect separate Arbiscan/Basescan/Polygonscan keys is now wrong. For unknown chains, --verifier etherscan --verifier-url with the chainid parameter works.
- Foundry gas reports systematically UNDER-report vs mainnet: test setup leaves accounts/slots warm and there is no cheatcode to force a slot cold (foundry issue #5494). --isolate restores realistic cold/warm accounting but breaks tests that legitimately depend on warmth persisting across calls in one transaction. Any gas lesson must teach this bias before teaching optimisation.
- Hardhat 3 is ESM-only and abolished the global hre.network — connections are created explicitly via await hre.network.create(), plugins are registered explicitly instead of by import side effect, and extendConfig/subtask overriding was replaced by a hooks system. It is a different program, not a version bump. Gas reporting and coverage are now first-party (hardhat-gas-reporter and solidity-coverage are Hardhat 2 material). Hardhat 3 also runs Solidity tests as first-class, so 'Hardhat = JS tests, Foundry = Solidity tests' is dead framing.
- Official Foundry CI guidance now lists 'forge lint --deny warnings' alongside 'forge fmt --check', and FOUNDRY_PROFILE: ci with raised fuzz/invariant budgets. Also: the toolchain action's cache: true caches ~/.foundry/cache (RPC + Etherscan responses) but the cache does NOT help unless the fuzz seed is fixed.
- forge coverage is the weakest link in the Foundry toolchain and this has not been fixed: it fails with 'stack too deep' on --via-ir projects, and the --ir-minimum workaround compiles with different settings than production and degrades source-map accuracy (foundry #3357, #6592; solidity #15775). Coverage should be taught as a rough signal, never as a merge gate.

### a07-security

- Certora open-sourced the Prover (github.com/Certora/CertoraProver) and it now covers Solana (CVLR spec language) and Stellar/Soroban, not just EVM. Current version confirmed from the official changelog: 8.16.1 (15 Jun 2026). This invalidates the common teaching that Certora is closed-source, EVM-only, and licence-gated.
- Code4rena's payout decays faster than 1/n on duplicates (Medium slice = 3*(0.85^(split-1))/split, High = 10*...), plus a +30% bonus for the submission selected for the report — so breadth-without-depth is actively unprofitable and writing quality is directly monetised. Also new: from 23 Mar 2026, cumulative earnings above $1,000 require identity verification.
- The 2025-26 loss landscape has moved off-chain: Bybit (Feb 2025, ~$1.4-1.5B), Drift (Apr 2026, ~$285M) and Kelp DAO (Apr 2026, ~$292M) involved NO contract vulnerability. Kelp DAO was a 1-of-1 DVN configuration on a LayerZero OFT bridge plus RPC poisoning — protocol capability vs deployment configuration. Any security curriculum scoped to Solidity bugs teaches a minority of current losses.
- The three FV tools prove structurally different things: Certora is unbounded with parametric rules over all methods against bytecode; Halmos is explicitly BOUNDED (loop/call-depth limits) reusing Foundry tests; Kontrol is KEVM-based compositional symbolic execution with lemmas plus loop invariants plus bounded model checking. Teaching them as syntax variants is wrong.
- Trail of Bits publishes engineer-weeks on every report, which is the best available proxy for assurance purchased — e.g. Uniswap v4 Core (Jul 2024) = 6 engineer-weeks vs Arbitrum Stylus (May 2024) = 47 engineer-weeks. Comparing those two reports is a ready-made lesson about what 'audited' means.
- Two incompatible severity conventions are in daily use and do not translate: firms use severity x DIFFICULTY (Trail of Bits), competitive platforms use impact x LIKELIHOOD. A 'High' means different things depending on which system produced it.

### a08

- EIP-7951 explicitly does NOT enforce low-s, because NIST FIPS 186-5 does not require non-malleable ECDSA. Every passkey signature therefore has a second valid form. This is the opposite of secp256k1/EIP-2 intuition and is a real exploit class for accounts that key replay protection off signature bytes. Also: the precompile returns EMPTY output (not 32 zero bytes, not a revert) on failure while still charging 6900 gas, so a require(success) check treats an invalid signature as valid.
- EIP-7966 (eth_sendRawTransactionSync) exists and viem ships sendTransactionSync / writeContractSync on top of it. Docs explicitly say it is only suitable for chains with low block times and fast finality, not mainnet. It is a genuinely new transaction-UX primitive absent from all pre-2025 material.
- eth_estimateGas throwing does NOT mean the transaction would revert. geth's 'gas required exceeds allowance' is a balance/allowance check, not a revert. Estimation is a dry-run plus binary search whose monotonicity assumption breaks on gas-dependent branches, and EIP-150's 63/64 rule means an exactly-estimated limit can still fail deep in the call tree.
- viem exact input layout for EIP-7951 precompile 0x100 confirmed: exactly 160 bytes as h(32) || r(32) || s(32) || qx(32) || qy(32); success returns 32-byte 0x...01, failure returns zero-length output, 6900 gas charged either way.
- wagmi v3 is current (npm wagmi@3.7.6, checked 2026-08-25) and it RENAMED useAccount -> useConnection, useAccountEffect -> useConnectionEffect, useSwitchAccount -> useSwitchConnection. It also removed .connectors from useConnect/useReconnect/useDisconnect/useSwitchConnection (use useConnectors()/useConnections()) and .chains from useSwitchChain (use useChains()), and normalised custom mutate names to mutate/mutateAsync. Essentially every wagmi tutorial written before v3 is wrong at the first line of code.
- wagmi v3 made ALL connector dependencies optional peer deps: baseAccount needs @base-org/account, coinbaseWallet needs @coinbase/wallet-sdk, metaMask needs @metamask/connect-evm, safe needs @safe-global/safe-apps-provider + @safe-global/safe-apps-sdk, walletConnect needs @walletconnect/ethereum-provider. A v2 app breaks at connect time after upgrade unless these are installed.

### a09-defi

- 10 October 2025 replaces Black Thursday as the canonical cascade: ~$19B liquidated across ~1.6M accounts (~9x prior record) into $217B open interest with no circuit breakers. It also produced on-chain failure - Curve's CRV-long LlamaLend market took ~$700K bad debt because price velocity outran keepers while gas spiked, and Curve chose a market-based StableSwap recovery pool rather than Aave's donation bailout the same month.
- 2 March 2026 sDOLA/crvUSD LlamaLend exploit proves LLAMMA soft liquidation is not oracle-immune: a flash loan first forced every position into soft-liquidation via a large LLAMMA swap, then an unpermissioned DolaSavings.stake() call inflated the sDOLA exchange-rate oracle, hard-liquidating 27 borrowers (~$10.9M debt). Yield-bearing-wrapper rate oracles (ERC-4626 convertToAssets, LST rates, LP virtual prices) are the live 2026 oracle attack surface, not spot-price flash loans.
- April 2026 Kelp DAO bridge exploit is the new canonical bad-debt case: attacker released ~116,500 unbacked rsETH (~$293M), supplied it to Aave as collateral, borrowed real WETH (~52,834 on Ethereum, ~29,782 WETH + 821 wstETH on Arbitrum), leaving Aave with ~$177M-$236M bad debt. Aave's code was not exploited - the collateral listing decision was. This reframes bad debt away from the usual 'liquidators were too slow' story.
- Sandwich MEV on L1 was suppressed by private orderflow, not protocol changes - reportedly ~$10M/month late 2024 down to ~$2.5M/month by Oct 2025. Academic work (arXiv 2601.19570, Jan 2026) finds sandwiching endemic on L1 but rare and unprofitable on rollups with private mempools. The remedy shifted trust rather than eliminating extraction.
- The standard three-way stablecoin taxonomy (fiat-backed / crypto-backed / algorithmic) cannot classify the actual 2025-2026 failures. Stream Finance xUSD and Elixir deUSD (Nov 2025, ~$93M loss, ~$285M interconnected debt, xUSD -77%, deUSD -98%) were opaque yield-bearing fund shares marketed as dollars, listed as collateral on Euler/Morpho/Silo/Gearbox. A fourth category is needed.
- arXiv 2606.03548 (FC'26 DeFi Workshop, June 2026) gives the current state of the art on AMM oracle manipulation cost: cost = attacker mark-to-market loss (not capital deployed), and liquidity-weighted aggregation provably maximises the minimum cost of manipulation for weighted medians at any distortion level. Equal-weight multi-source aggregation is now a demonstrably weaker design.

### a10-scaling

- Astria, one of the two leading shared sequencers, SHUT DOWN in December 2025. Espresso is the surviving network. Sequencer decentralisation has been 'next year' since 2023 and should be taught as the steady state, not a transitional artefact.
- Blob schedule is now VERIFIED from primary sources and most curricula are stale: EIP-7892 BPO forks decouple blob params from named hardforks. BPO1 activated 2025-12-09 (target 10 / max 15), BPO2 activated 2026-01-07 (target 14 / max 21). BPO3/BPO4 are NOT shipped - paused pending telemetry review. Teaching '3/6' or '6/9' is wrong.
- Both major optimistic stacks now have LIVE permissionless proof systems, which invalidates the 2023-era 'fraud proofs are theatre' criticism. Arbitrum BoLD launched 2025; OP Stack op-contracts/v7.0.0 'Karst' (Upgrade 19b) executed 2026-06-25 switched the respected game type CANNON -> CANNON_KONA (Rust kona-client on the Cannon VM), trust model unchanged.
- Forced inclusion only unblocks the first of four chokepoints. Proposer failure (whitelisted state-root proposers stopping) freezes withdrawals independently, and instantly-upgradeable contracts mean an exit window of zero. OP Stack uses a 12-hour sequencing window; Arbitrum uses forceInclude with delayBlocks=24h / delayBuffer 30min-48h plus an adaptive Censorship Timeout.
- Stylus's headline '10-100x cheaper' applies to COMPUTE ONLY - Arbitrum's own VM-differences page states storage reads and writes cost the same gas as the EVM. A standard ERC-20 gains nothing and pays activation overhead. Also under-taught: Stylus contracts require on-chain activation and periodic REACTIVATION, an operational obligation with no Solidity equivalent.
- The most important honest correction for 09.5: 'ZK rollups have instant finality' is wrong. Both proof types give ~1s soft confirmations; validity proofs remove the WITHDRAWAL window, not the confirmation delay, and add real proving latency (minutes to over an hour depending on system).

### a11-zk

- BN254 is roughly 100-bit security, not 128-bit, after exTNFS. This now collides with EF's 2026 zkEVM roadmap demanding 128-bit provable security, which structurally pushes L1-facing verification toward BLS12-381 or hash-based systems.
- EIP-2537 (BLS12-381 precompiles, Pectra) is live at 0x0b-0x11 with verified gas: G1ADD 375, G2ADD 600, PAIRING_CHECK 32600*k + 37700, MAP_FP_TO_G1 5500, MAP_FP2_TO_G2 23800, MSM (k*12000*discount(k))/1000 for G1 and base 22500 for G2. Critically, precompile encoding is PADDED UNCOMPRESSED (Fp 64B, G1 128B, G2 256B) - not the 48-byte compressed form used for KZG commitments. Same curve, two encodings, a real bug source.
- EIP-8079 native rollups (EXECUTE precompile) got a working proof-of-concept in March 2026 on the Ethrex client with EF researchers, which would make per-rollup bespoke verifier contracts optional. It is a prototype with no fork assignment - Glamsterdam's scope is ePBS and BALs.
- Ethereum L1 DROPPED Poseidon as its ZK-friendly hash, pivoting to SHA/BLAKE-family for post-quantum reasons. Every curriculum that teaches 'Poseidon is the standard ZK hash on Ethereum' is now wrong for L1. Reported via secondary sources (crypto.news, zkm.io) - the EF-side decision record was not located.
- PeerDAS changed the blob transaction wrapper: blob txs now carry per-CELL KZG proofs, not one proof per blob. This broke library assumptions (ethers.js issue #5062). Any EIP-4844-era teaching material showing a 1:1:1 blobs/commitments/proofs triple is outdated.
- Tornado Cash OFAC sanctions were LIFTED on 21 March 2025 after the Van Loon appellate decision. Separately, Roman Storm's Aug 2025 trial produced a split verdict (convicted on unlicensed money transmission, hung on the two serious counts) and prosecutors sought an October 2026 retrial. Sanctions status and criminal liability are two different stories and both are commonly taught wrong.

### a12-protocol

- Consensus-specs fork codenames: stable through Fulu (epoch 411392 = Fusaka); unstable are Gloas (Glamsterdam) and Heze (the fork after). Release line has moved to v1.7.0-alpha.* for Gloas; v1.6.x carried Fulu. Repo now uses `uv` as package manager, and publishes nightly-generated unstable test vectors for in-development forks separately from release-attached stable vectors.
- EIP-7732 (ePBS) has changed materially since its 2024 draft: builders are now in-protocol STAKED entities with a beacon-chain balance (min 1 ETH in current draft), a `builders` registry in beacon state, and payment via builder_pending_payments/withdrawals. The container is SignedExecutionPayloadBid (not SignedExecutionPayloadHeader). BeaconBlockBody LOSES execution_payload, blob_kzg_commitments and execution_requests — a breaking change for every beacon-block parser. PTC_SIZE=512 and PTC members explicitly do NOT validate the payload, only timeliness+availability. A valid beacon block can now have NO payload (execution_payload_availability bitvector).
- EPF/Studies structure verified: EPF Cohort 7 announced 30 Apr 2026, applications closed 13 May 2026, cohort runs June–November 2026, deliberately SMALLER and more selective, stipend only for *select* participants. Ethereum Protocol Studies 2026 relaunched 23 Feb 2026 with a NEW self-paced Moodle platform at study.epf.wiki carrying three tracks: Ethereum Protocol 101, Cryptography of Ethereum, Lean Ethereum/zkEVM. epf.wiki (wiki + applications) and study.epf.wiki (course platform) are two different sites.
- Fusaka Engine API additions: engine_getPayloadV5 returning BlobsBundleV2 (cell proofs), plus engine_getBlobsV2 (all-or-nothing) and engine_getBlobsV3 (partial, null at missing positions). getBlobsV1 errors post-Osaka; getPayloadV4 errors for timestamps >= Osaka. getBlobs* is a real latency mechanism: the CL pulls missing blob data from the local EL blob mempool rather than waiting on gossip.
- PeerDAS constants verified directly from consensus-specs master (specs/fulu/das-core.md, p2p-interface.md, validator.md): NUMBER_OF_COLUMNS=128, NUMBER_OF_CUSTODY_GROUPS=128, DATA_COLUMN_SIDECAR_SUBNET_COUNT=128, CUSTODY_REQUIREMENT=4, VALIDATOR_CUSTODY_REQUIREMENT=8, BALANCE_PER_ADDITIONAL_CUSTODY_GROUP=32 ETH, SAMPLES_PER_SLOT=8, FIELD_ELEMENTS_PER_CELL=64, CELLS_PER_EXT_BLOB=128, MIN_EPOCHS_FOR_DATA_COLUMN_SIDECARS_REQUESTS=4096 epochs (~18.2 days). Custody is assigned in GROUPS derived by hashing the node id, then mapped to columns — earlier drafts assigned columns directly, so pre-mid-2025 material is wrong.
- VERKLE TREES ARE OFF THE ROADMAP. Dropped in favour of hash-based binary trees (EIP-7864, unified binary tree, Draft, created Jan 2025), with Partitioned Binary Trees (PBT) flagged as the successor. Stated reasons: Verkle's polynomial commitments are elliptic-curve based (not post-quantum) and are SNARK-unfriendly. State expiry was deprioritised in the same 2026 roadmap rewrite. Any curriculum teaching 'the Verge = Verkle' is teaching a cancelled design.

### a13-altvm

- Anchor left 0.x - 1.0.0 shipped April 2026, latest release v1.1.2 (26 June 2026). Reported breaking changes: TS client renamed @coral-xyz/anchor -> @anchor-lang/core, Surfpool replaces solana-test-validator, LiteSVM is the default test template. Repo also moved from coral-xyz to solana-foundation. Every existing Anchor tutorial is a generation behind.
- Cosmos retracted two things people still teach as the future: CometBFT v1 and v2 development was abandoned (v0.38 is production standard, v0.39 next), and 'Cosmos SDK v2' was dropped in favour of continuing the v0.5x line (v0.53 current, v0.54 targeted early Q2 2026). Cosmos is also adopting Block-STM parallelisation - the same technique as Aptos.
- Solana block CU limit is now 100M (SIMD-0286, epoch 1009, 29 July 2026) but the per-writable-account cap stayed at 12M CU - so local fee markets got relatively TIGHTER, not looser. Any curriculum citing 48M/50M/60M block limits is stale.
- The 2026 Solana security story is NOT account validation. Drift Protocol lost ~$270-285M on 1 April 2026 with audited, uncompromised contracts: six months of social engineering, device compromise, then multisig signers induced to pre-sign DURABLE NONCE transactions (which never expire) carrying hidden admin authorizations, plus a fabricated wash-traded collateral asset the oracles priced at hundreds of millions. A curriculum that stops at 'check the owner' is teaching 2022.
- Token-2022's sharpest foot-gun is not transfer fees but mint close-and-reinit: a mint with a close authority can be closed and reinitialized at the same address with a different extension set, leaving pre-existing token accounts under stale rules (e.g. accounts created before a fee existed can still transfer fee-free). Checking a mint's CURRENT extensions is therefore insufficient.
- p-token (SPL Token rewritten in Pinocchio) went live on mainnet via SIMD-0266 at epoch 971 in spring 2026. transfer dropped ~4,645 CU -> ~76 CU, transfer_checked ~6,200 -> ~105. It swapped the implementation behind the SAME program address, so every dApp got the savings with zero code change. Teaching implication: most devs benefit from Pinocchio without writing Pinocchio.

### a14-infra

- Ponder VERIFIED viable: Monad Foundation acquired the 3-person team (founder Kevin Koste + 2) in Feb 2026; the framework stays open source and actively developed. First-party confirmation at monad.xyz/blog/ponder-team-joins. Risk to teach is roadmap alignment and bus factor, not abandonment.
- Reorg handling has moved INTO the frameworks (Envio keeps unfinalized entity-state history with a rollback_on_reorg flag; Ponder keeps a trigger-based DB transaction log and rolls back to the common ancestor). Hand-written reorg logic in handlers is now an anti-pattern. The teachable risk moved downstream: the indexer rollback does not undo notifications, payouts or exports.
- SEAL (Security Alliance) is the ecosystem's de facto incident-response institution in 2026 — SEAL 911 free 24/7 hotline, crypto-native ISAC, SEAL Intel (a 2Q 2026 threat summary exists), SEAL Wargames, Whitehat Safe Harbor Agreement, Security Research Legal Defense Fund. Any 2026 incident-response module omitting SEAL 911 is incomplete.
- SQD/Subsquid VERIFIED: acquired by Rezolve AI in October 2025 (first-party press release), rebrand and token migration still in progress Aug 2026, direction now set by an AI-commerce strategy. Technology still wins some workloads. Highest continuity risk of the four indexers.
- Trail of Bits' current position: pause efficacy DECLINES over time as attackers automate, and key-centric controls are the thing to mature past. The mature pause pattern is low-threshold guardian to pause / governance-only to unpause / forced auto-expiry / re-pause cooldown — pause as a bounded, two-sided power rather than a safety feature.
- eth_simulateV1 is now a STANDARDISED Ethereum execution-API method (multi-tx, multi-block, state + block overrides). Simulation is no longer a vendor capability — teaching 'you need Tenderly to simulate' is wrong as a default. Tenderly's remaining value is decoding, persistence, sharing, CI and Virtual TestNets. Tenderly's public API is v2 (api.tenderly.co/api/v2/); v1 tutorials are stale.

---

## Resolved during P7b authoring — 2026-08-26

Two Stylus entries in this register are now answerable from first-party docs, and one new
disagreement was found. Recorded so the register does not keep flagging settled questions.

- **RESOLVED — "whether Stylus SDK reentrancy protection is on or off by default was NOT determined".**
  The `reentrant` feature flag and the `deny_reentrant` entrypoint guard were **deprecated in SDK
  0.10.5**, because the high-level call functions now flush the storage cache before every external
  call. Note the precise scope: that protects the *cache*, not your invariants. Checks-effects-
  interactions is still required. (docs.arbitrum.io/stylus/best-practices/security)

- **RESOLVED — Stylus reactivation cadence, previously "described ambiguously and not resolved".**
  `ExpiryDays` defaults to **365 days**, `KeepaliveDays` to **31 days**, both configurable ArbOS
  parameters. Teach `programTimeLeft` as the source of truth rather than either constant.

- **NEW CONFLICT — Stylus memory pricing curve.** Two Arbitrum pages disagree: the gas-metering page
  calls it "a novel exponential pricing mechanism" while stating in the same paragraph that cost grows
  "near-linearly"; the VM-differences page says "Linear cost per page through `pay_for_memory_grow`".
  Commit only to *sub-quadratic, measure it yourself*.

- **STILL UNRESOLVED — Stylus max contract size.** Now understood to be **three different quantities**
  conflated across pages: 96 KB (fragment-based deployment), `MaxWasmSize` bounding the *decompressed*
  WASM at 128 KB (256 KB from ArbOS61+, chain-configurable), and a 24 KB *compressed* per-code-account
  limit that triggers automatic fragmentation. Publish none as a headline; direct readers to
  `cargo stylus check` against their target chain.

---

## Resolved during P7c authoring — 2026-08-26

Two entries flagged "recalled from memory, not verified" were re-fetched from the normative EIP text
and are now source-confirmed. Two others were sharpened rather than resolved.

- **RESOLVED — EIP-1108 pairing constants.** Read from the EIP body: ECADD 500 -> **150**, ECMUL
  40000 -> **6,000**, pairing 80000k+100000 -> **34,000k + 45,000**, with the 25.86-gas-per-microsecond
  derivation. Also confirms EIP-197's 192-byte input chunks. Safe to publish.

- **RESOLVED — EIP-4844 point-evaluation precompile gas.** `POINT_EVALUATION_PRECOMPILE_GAS = 50000`
  at address `0x0A`, confirmed in the EIP body. Safe to publish.

- **SHARPENED — SP1 Hypercube block-proving percentage.** Still not reducible to one number, but the
  reason is now clear: Succinct's own posts report different percentages at different thresholds and
  hardware counts, and none of them reconcile. The 20 May 2025 post says 93% under 12s (average 10.3s)
  on **~160 RTX 4090s ($300-400k)**, explicitly excluding RPC witness fetching. Note the concept YAML's
  "sixteen consumer GPUs" figure contradicts the first-party post by an order of magnitude — the
  concept statement should be corrected to ~160 or drop the count.

- **SHARPENED — BLS12-381 security level.** Publish as a range, not a point: IETF draft says 126 bits,
  NCC Group analysis 117-120, EIP-2537's own motivation "120+". BN254 post-exTNFS is ~100 bits against
  an original 128-bit claim, with EIP-2537 itself citing 80. Sources genuinely disagree.

---

## Found during source corroboration

Added 26 Aug 2026 while giving single-source empirical concepts a second independent source. One
corroboration attempt produced a contradiction rather than a confirmation.

- **NEW CONFLICT — "Access control is the largest category of on-chain loss."** Two independent
  counts put a different category first, and the disagreement is about *what is counted*, not about
  arithmetic.
  - **OWASP Smart Contract Top 10 (2025)**, ranking 149 documented 2024 incidents by realised loss,
    puts **Access Control first at $953.2M**, then Logic Errors $63.8M, then **Reentrancy $35.7M**.
    It ranks smart-contract *vulnerability* categories only. `sok-root-cause-losses` (arXiv 2507.20175)
    reaches the same ordering on the same kind of population.
  - **Beyer 2026, "The Audit Gap in Blockchain Security"** (arXiv 2606.15465), 218 incidents from
    rekt.news over 1 Jan 2022 – 27 Mar 2026 totalling $7.76B, puts **Private Key Compromise first at
    $1,894M (24.4%)**, **Phishing / Social Engineering second at $1,511M (19.5%)**, and **Access
    Control third at $994M (12.8%)**. Reentrancy is $256M. It counts every documented incident,
    including operational compromise that never touched a contract bug.
  - **What both support, and may be published:** access-control failure costs far more than
    reentrancy — about 27x in the OWASP data, about 4x in Beyer's.
  - **What may NOT be published as fact:** that access control is *the* top loss category. That is
    true only of the smart-contract-vulnerability population. Widen the frame and stolen keys and
    phishing both rank above it. Whichever ranking a lesson quotes, it must quote the inclusion
    criteria with it.
  - Note also that Beyer's own framing is that audit findings and exploit losses "describe different
    populations", which is the same caution one level up. `access-control-is-top-loss` has been
    rewritten to state the disagreement rather than either headline.

## Currency checks that came back clean (26 Aug 2026)

Recorded so the same claims are not re-verified next time. Each was flagged as *possibly* stale by an
agent and checked against the ethereum/ERCs repository headers.

- **ERC-7715 "Request Permissions from Wallets"** — `status: Draft`, `created: 2024-05-24`. The
  session-key lessons state exactly this. A two-year-old Draft on a `volatility: hot` lesson looks
  like rot but is the finding: the standard has not moved.
- **ERC-7710 "Smart Contract Delegation"** — `status: Draft`, `created: 2024-05-20`.
- **ERC-7579 "Minimal Modular Smart Accounts"** — `status: Draft`, `created: 2023-12-14`.
- **Vyper 0.5.0 alphas** — a1 2026-05-07, a2 2026-05-29, a3 2026-06-14 (PyPI `upload_time_iso_8601`).
  See the resolution note above; the register, not the lessons, held the wrong year.
- **foundry-rs/foundry-toolchain@v1** — commit `908c540300062bd5a7e473851cdb4282204cee09`,
  2026-07-20. Used to pin the action in the CI lessons' corrected workflows.

- **RESOLVED 26 Aug 2026 — fork-choice constants, read from `consensus-specs` v1.6.1.** These were
  flagged do-not-publish-without-checking. They were checked, against
  `raw.githubusercontent.com/ethereum/consensus-specs/v1.6.1/configs/mainnet.yaml` and
  `presets/mainnet/phase0.yaml` at the same tag, and all eight read as the register recorded:
  `PROPOSER_SCORE_BOOST 40` · `REORG_HEAD_WEIGHT_THRESHOLD 20` · `REORG_PARENT_WEIGHT_THRESHOLD 160` ·
  `REORG_MAX_EPOCHS_SINCE_FINALIZATION 2` · `PROPOSER_REORG_CUTOFF_BPS 1667` ·
  `ATTESTATION_DUE_BPS 3333` · `SLOT_DURATION_MS 12000` · `SLOTS_PER_EPOCH 32`.
  Safe to publish at that tag. Re-verify against the tag a lesson pins, not against memory.

