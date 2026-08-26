# Track 07 — App & Product Layer · Track 13 — Infrastructure & Data
Source-verified curriculum research. Raw material for lesson authoring — not lesson prose.
Compiled 2026-08-25. Tiers: `spec` > `canonical-docs` > `primary-analysis` > `secondary` (marked).

---

## 07.3–07.5 — Wallet capabilities, EIP-7702 flows, ERC-4337

> **Verification status: VERIFIED for the capability model. EntryPoint versioning PARTIAL — see below.**

### Concepts

- `wallet-capabilities` — Ask the wallet what it supports rather than assuming; the modern replacement for feature-sniffing. | requires: []
- `use-capabilities` — wagmi's `useCapabilities` hook reports what the connected wallet can do. | requires: [wallet-capabilities]
- `erc-5792-sendcalls` — `wallet_sendCalls`: submit multiple calls as one user-visible action. Surfaced as viem's `sendCalls` and wagmi's `useSendCalls`. | requires: [wallet-capabilities]
- `sendcalls-fallback` — `experimental_fallback` makes viem execute the calls sequentially via `eth_sendTransaction` when the wallet lacks EIP-5792, so batching degrades instead of breaking. | requires: [erc-5792-sendcalls]
- `batching-is-not-atomicity` — Batched calls may or may not be atomic depending on the account. Do not assume all-or-nothing without checking capabilities. | requires: [erc-5792-sendcalls]
- `user-operation` — ERC-4337's alternative to a transaction: signed by the user, aggregated by bundlers, validated and executed by a singleton EntryPoint. | requires: [wallet-capabilities]
- `bundler` — A network actor that aggregates UserOperations and submits them on-chain. | requires: [user-operation]
- `entrypoint` — The singleton contract validating and executing UserOperations through the user's smart account. | requires: [user-operation]
- `paymaster` — An optional contract that sponsors gas or lets users pay in ERC-20 instead of ETH. | requires: [entrypoint]
- `paymaster-risk` — Sponsorship is an economic surface: a badly scoped paymaster can be drained by having its sponsorship consumed. | requires: [paymaster]
- `session-key` — A scoped, time-limited key authorising a narrow set of actions without re-prompting. | requires: [paymaster]
- `7702-vs-4337` — 7702 upgrades an *existing EOA* in place; 4337 routes through a *separate smart account*. They compose rather than compete. | requires: [delegation-designator, user-operation] | contrasts: [user-operation]

### Primary sources

- [sendCalls](https://viem.sh/docs/actions/wallet/sendCalls) — tier: canonical-docs — viem; docs last updated 2026-07-18.
- [Viem | Wagmi](https://wagmi.sh/react/guides/viem) — tier: canonical-docs — wagmi Core is a wrapper over viem; every hook wraps a viem action.
- [EIP-5792 getting started](https://www.eip5792.xyz/getting-started) — tier: canonical-docs.
- [ERC-4337 documentation](https://docs.erc4337.io/core-standards/erc-4337.html) — tier: canonical-docs.
- [ERC-4337 bundlers](https://docs.erc4337.io/bundlers/index.html) — tier: canonical-docs.
- [ERC-4337 paymasters: better UX, hidden risks](https://osec.io/blog/2025-12-02-paymasters-evm/) — tier: primary-analysis — OtterSec, published 2025-12. **The security reading for paymasters.**
- [Upgrade an EOA to a smart account](https://docs.metamask.io/tutorials/upgrade-eoa-to-smart-account/) — tier: canonical-docs — MetaMask's 7702 flow.
- [Foundation mission request: EIP-7702 UX & developer tooling](https://github.com/ethereum-optimism/ecosystem-contributions/issues/274) — tier: primary-analysis — what the ecosystem considers unsolved.

### Current state (Aug 2026)

- **EntryPoint v0.7** is described as the current production version, deployed at
  `0x0000000071727De22E5E9d8BAf0edAc6f37da032` across Ethereum, Base, Arbitrum, Optimism, Polygon,
  BNB Chain, Avalanche and most major EVM chains.
- **v0.8 and v0.9 exist**; v0.9 keeps ABI compatibility with v0.8, so existing Accounts and Paymasters
  need no changes unless adopting new features. v0.9 adds parallelizable paymaster signing
  (`paymasterSignature`), block-number-based validity ranges (high bit of `validAfter`/`validUntil`),
  silent `initCode` ignoring when the account exists, and `getCurrentUserOpHash`.
- ⚠ **PARTIAL:** which EntryPoint version is *actually dominant* on mainnet in Aug 2026 is not
  established — "v0.7 is production" and "v0.9 exists" may both be true with adoption lagging.
  **Resolve before writing this module.**

### Misconceptions

- Belief: Account abstraction means ERC-4337. | Reality: 4337 is one route; EIP-7702 upgrades an existing EOA directly, and ERC-5792 is how apps *talk* to either. | Source: https://www.eip5792.xyz/getting-started
- Belief: You should detect the wallet vendor and branch on it. | Reality: query capabilities. Vendor sniffing breaks on every release. | Source: https://wagmi.sh/react/guides/viem
- Belief: Using `sendCalls` breaks wallets that lack EIP-5792. | Reality: `experimental_fallback` degrades to sequential `eth_sendTransaction`. | Source: https://viem.sh/docs/actions/wallet/sendCalls
- Belief: Batched calls are atomic. | Reality: depends on the account implementation — check capabilities rather than assuming.
- Belief: A paymaster is a UX feature. | Reality: it is an economic contract that can be drained. | Source: https://osec.io/blog/2025-12-02-paymasters-evm/

### Practice ideas

- kind: implement — Build a flow that queries capabilities and uses `sendCalls` with fallback, so it works on both modern and legacy wallets. — Acceptance: demonstrated against one wallet supporting 5792 and one that does not.
- kind: implement — Sponsor a user's first transaction with a paymaster scoped to a single contract method. — Acceptance: sponsorship succeeds for the intended call and is refused for anything else.
- kind: break — Deploy a permissive paymaster and drain its balance from an unrelated account. — Acceptance: a test draining it, then a scoped version that resists.
- kind: read — Read the OtterSec paymaster article and list three scoping mistakes with their consequences. — Acceptance: written list with the failure mode for each.
- kind: write — Design the transaction UX for a first-time user with no ETH: what they see, sign and wait for. — Acceptance: a written flow naming the error states.

### Visual opportunities

- Three paths to one outcome: plain EOA, 7702-delegated EOA, 4337 smart account.
- The UserOperation lifecycle: user → bundler → EntryPoint → account → paymaster settlement.
- A capability-negotiation decision tree ending in batched or sequential execution.

---

## 13.3 — Indexing & subgraphs

> **Verification status: VERIFIED. Contains a change that invalidates most existing tutorials.**

### Concepts

- `indexing` — Turning raw chain events into queryable application state, because RPC alone cannot answer product questions. | requires: [logs-and-bloom]
- `subgraph` — The Graph's indexing unit: a manifest, a schema and mappings. The nearest thing to an industry standard. | requires: [indexing]
- `reorg-safe-indexing` — An indexer must unwind and reapply state when the chain reorgs; ignoring this silently corrupts data. | requires: [indexing, reorg]
- `backfill-vs-live` — Historical sync and live tailing are different performance problems; benchmarks usually measure only backfill. | requires: [indexing]
- `hosted-service-retired` — **The Graph fully retired its free hosted service in 2026.** Projects must use the decentralised network (paying in GRT) or an alternative. | requires: [subgraph]
- `graph-compatible-alternatives` — Goldsky and Ormi accept subgraphs with near-zero rewrite, making them the low-friction migration path. | requires: [hosted-service-retired]
- `hyperindex` — Envio's indexer; independent benchmarks showed a **142× speed advantage over The Graph** on the Uniswap V2 Factory workload (Sentio, May 2025), with HyperSync coverage across 85+ EVM chains. | requires: [backfill-vs-live]
- `non-evm-indexing` — Subsquid and SubQuery cover Polkadot, Cosmos, Bitcoin and other non-EVM networks. | requires: [indexing]
- `indexer-choice-axes` — The real decision is speed vs chain coverage vs migration effort — not "which is best". | requires: [hyperindex, graph-compatible-alternatives]

### Primary sources

- [The Graph vs Goldsky vs Envio vs Ponder: indexer comparison (2026)](https://protofire.io/guides/blockchain-indexers/) — tier: primary-analysis — Protofire; the most neutral comparison found.
- [OBIB: an open blockchain indexer benchmark](https://www.sentio.xyz/blog/obib-open-blockchain-indexer-benchmark/index.html) — tier: primary-analysis — Sentio; **the methodology matters more than the numbers** — good material for teaching benchmark literacy.
- [Best blockchain indexers in 2026](https://docs.envio.dev/blog/best-blockchain-indexers-2026) — tier: secondary, **vendor** — Envio comparing itself. Useful for capability claims, not for ranking.
- [HyperIndex](https://github.com/enviodev/hyperindex) — tier: canonical-docs.

### Current state (Aug 2026)

- **The Graph's free hosted service is gone.** Any tutorial that says "deploy to the hosted service"
  is dead on arrival — which is most of them written before 2026.
- Ponder's team **joined Monad in February 2026**; direction may tilt Monad-specific.
- Subsquid/SQD was acquired and mid-rebrand as of late 2025 — verify current status separately.

### Misconceptions

- Belief: You deploy a subgraph to The Graph's hosted service for free. | Reality: retired in 2026; it is the decentralised network (GRT) or an alternative. | Source: https://protofire.io/guides/blockchain-indexers/
- Belief: The fastest indexer is the right choice. | Reality: benchmarks measure backfill; live-tail performance, reorg handling, chain coverage and ops burden usually matter more.
- Belief: An indexer is a database you write once. | Reality: reorg handling means it must unwind and reapply. Ignoring reorgs corrupts data quietly.
- Belief: You can query product data straight from an RPC node. | Reality: RPC answers "what is this value now", not "who did what over time".

### Practice ideas

- kind: implement — Index one contract's events two ways (a subgraph and one alternative), answer the same query with each, and compare sync time and effort. — Acceptance: both return matching results; a written comparison of the experience.
- kind: break — Force a reorg on a local node and show your naive indexer producing wrong data. — Acceptance: demonstrated corruption, then a fix that unwinds correctly.
- kind: read — Read the OBIB methodology and identify what its workload does **not** measure. — Acceptance: written critique naming at least two blind spots.
- kind: measure — Time a backfill of the same contract across two indexers. — Acceptance: measured numbers with a note on how far they are from the published benchmark and why.

### Visual opportunities

- Chain events → indexer → queryable state, with the reorg unwind path drawn as a reverse arrow.
- Indexer decision matrix on the three real axes.
- Backfill vs live-tail as two distinct performance curves.

### Gaps & uncertainties

- Subsquid/SQD current status post-acquisition — unresolved.
- The Graph decentralised network cost model in practice — not researched.
- Ponder's viability after the Monad acquisition — needs a fresh check before recommending it.
