# Track 08 — DeFi Mechanics & Track 09 — Scaling & L2
## Source-verified curriculum research

Compiled: 2026-08-25. Raw material for lesson authoring — not lesson prose.

Source tiers used throughout:
- `spec` — EIPs, protocol specifications, formal whitepapers
- `canonical-docs` — official protocol/project documentation
- `primary-analysis` — peer-reviewed or arXiv papers, audit reports, official post-mortems, L2BEAT
- `secondary` — journalism, blogs, aggregators (marked, used only as support)

---

---

## 08.1–08.3 — AMM math, concentrated liquidity, Uniswap v4 hooks

> **Verification status: VERIFIED.**

### Concepts

- `constant-product` — `x · y = k`. Price is the reserve ratio; every trade moves it along the curve. | requires: []
- `price-impact` — Larger trades move further along the curve, so the marginal price worsens with size. | requires: [constant-product]
- `impermanent-loss` — An LP's holdings rebalance against price movement, so the position underperforms simply holding. | requires: [constant-product]
- `virtual-reserves` — v3 positions behave like a v2 curve restricted to a price interval, described by reserves that need not exist. | requires: [constant-product]
- `tick` — A discrete price level where `price(t) = 1.0001^t`, so each tick is one basis point. | requires: [virtual-reserves]
- `sqrt-price-x96` — The pool stores √price as a fixed-point number scaled by 2⁹⁶, linearising the price/liquidity relationship and keeping all arithmetic in integers. | requires: [tick]
- `liquidity-L` — `L = √(x·y)` over virtual reserves; stored as a root for gas efficiency. In price/liquidity space a v3 position is a single bar. | requires: [virtual-reserves, sqrt-price-x96]
- `v3-is-v2-piecewise` — The v3 curve is a v2 curve whose liquidity changes at preset ticks depending on where LPs placed it. **The single most clarifying framing.** | requires: [liquidity-L] | contrasts: [constant-product]
- `singleton-poolmanager` — v4 holds every pool in **one** contract; creating a pool is a state update, not a deployment. | requires: [constant-product]
- `v4-flash-accounting` — Balances are tracked internally under a lock and only **net** amounts are transferred at the end. | requires: [singleton-poolmanager, transient-storage]
- `hook` — A contract attached to a pool at creation; the PoolManager calls it at lifecycle points such as `beforeSwap` and `afterSwap`. | requires: [singleton-poolmanager]
- `hook-permission-bits` — Which callbacks a hook receives is encoded in its address, so the address must be mined to match the intended permissions. | requires: [hook]
- `hook-is-trusted-code` — A pool's hook can reorder, tax or block swaps. Choosing a pool means trusting its hook. | requires: [hook]

### Primary sources

- [Hooks](https://docs.uniswap.org/concepts/protocol/hooks) — tier: canonical-docs — the hook lifecycle.
- [PoolManager](https://developers.uniswap.org/docs/protocols/v4/concepts/poolmanager) — tier: canonical-docs — singleton and locking design.
- [Our vision for Uniswap v4](https://blog.uniswap.org/uniswap-v4) — tier: canonical-docs — design rationale.
- [Liquidity math in Uniswap v3 (technical note)](https://atiselsts.github.io/pdfs/uniswap-v3-liquidity-math.pdf) — tier: primary-analysis — Atis Elsts. **The derivation to work through.**
- [A primer on Uniswap v3 math, part 2](https://blog.uniswap.org/uniswap-v3-math-primer-2) — tier: canonical-docs.
- [How concentrated liquidity in Uniswap v3 works](https://rareskills.io/post/uniswap-v3-concentrated-liquidity) — tier: primary-analysis — RareSkills; source of the "v2 curve with piecewise liquidity" framing.
- [Uniswap V3 ticks — dive into concentrated liquidity](https://mixbytes.io/blog/uniswap-v3-ticks-dive-into-concentrated-liquidity) — tier: primary-analysis — MixBytes.
- [Uniswap v4 security guide: hooks, risks, and audit path](https://www.zealynx.io/blogs/uniswap-v4) — tier: primary-analysis — the hook attack surface.

### Current state (Aug 2026)

- **Uniswap v4 launched on Ethereum mainnet 30 January 2026**, with simultaneous deployments on
  Arbitrum, Base, Optimism, Polygon and BNB Chain.
- By mid-2026 v4 is live on **15+ networks** (adding Unichain, Monad, Tempo among others) and has
  **overtaken v3 as the default deployment target** for new DEX work.

### Misconceptions

- Belief: Impermanent loss becomes permanent only on withdrawal. | Reality: the divergence is realised continuously in the position's composition; "impermanent" is a misleading name.
- Belief: Concentrated liquidity is a different AMM. | Reality: it is the same constant-product curve with liquidity varying piecewise across ticks. | Source: https://rareskills.io/post/uniswap-v3-concentrated-liquidity
- Belief: Prices are stored as prices. | Reality: √price in Q64.96 fixed point, to keep everything in integer arithmetic. | Source: https://atiselsts.github.io/pdfs/uniswap-v3-liquidity-math.pdf
- Belief: Trading on a v4 pool is as safe as v3 because it's the same protocol. | Reality: each pool has a hook that can reorder, tax or block swaps. The hook is trusted code. | Source: https://www.zealynx.io/blogs/uniswap-v4
- Belief: Hook permissions are configured after deployment. | Reality: they are encoded in the hook's address, so the address is mined.

### Practice ideas

- kind: implement — Build a constant-product AMM from scratch with swap, add and remove liquidity. — Acceptance: `k` is non-decreasing across every operation, proven by an invariant test.
- kind: implement — Given a tick range and a liquidity amount, compute the token amounts required; verify against a real v3 position. — Acceptance: your numbers match on-chain within rounding.
- kind: measure — Derive and then measure price impact for trades of 0.1%, 1% and 10% of reserves. — Acceptance: measured values match the derivation.
- kind: implement — Write a v4 hook applying a dynamic fee based on volatility. — Acceptance: tests showing the fee changes and the permission bits are correctly encoded in the address.
- kind: break — Write a malicious hook that extracts value from swappers, then explain what a user would need to check before trading against a pool. — Acceptance: a working demonstration plus a written checklist.

### Visual opportunities

- The v2 hyperbola, then the v3 piecewise version, then a single position as a bar in price/liquidity space.
- Ticks as discrete steps on the price axis with liquidity depth as a histogram.
- v4 flash accounting: many hops, net settlement once at the end.
- Hook lifecycle: PoolManager calling `beforeSwap`/`afterSwap` around the core swap.

---

## 09.1 — Rollup anatomy & security stages

> **Verification status: VERIFIED.** L2BEAT's framework is the honest way to teach rollup trust.

### Concepts

- `rollup` — Execute off-chain, publish data and proofs to L1, inherit L1's data availability and settlement. | requires: [blob]
- `sequencer` — The party ordering L2 transactions; almost always a single centralised operator today. | requires: [rollup]
- `optimistic-rollup` — Assume validity, allow challenges within a window; withdrawals wait out the window. | requires: [rollup]
- `validity-rollup` — Prove each batch with a validity (ZK) proof, so no challenge window is needed. | requires: [rollup] | contrasts: [optimistic-rollup]
- `forced-inclusion` — An L1 path to get your transaction into the L2 even if the sequencer censors you. The property that makes a rollup escapable. | requires: [sequencer]
- `escape-hatch` — The ability to exit with your funds without operator cooperation. | requires: [forced-inclusion]
- `upgrade-key-risk` — A multisig able to change the rollup's contracts can override every other guarantee, including a valid proof system. | requires: [rollup]
- `l2beat-stage-0` — Operational but with centralised multisig upgrade authority; a compromised key set can unilaterally alter the protocol. | requires: [upgrade-key-risk]
- `l2beat-stage-1` — Governed by smart contracts with a functional proof system, decentralised fraud-proof submission and user exits without the operator; a Security Council remains for bugs. | requires: [l2beat-stage-0]
- `l2beat-stage-2` — Fully trust-minimised: no administrator can override the protocol, no emergency admin capability. | requires: [l2beat-stage-1]
- `proofs-do-not-imply-trustless` — A validity proof constrains *execution*; it says nothing about who can upgrade the contracts. | requires: [l2beat-stage-0, validity-rollup]

### Primary sources

- [Stages](https://l2beat.com/stages) — tier: canonical-docs — L2BEAT's framework and live per-chain classifications. **The re-verify target for this module.**
- [Introducing Stages — a framework to evaluate rollup maturity](https://medium.com/l2beat/introducing-stages-a-framework-to-evaluate-rollups-maturity-d290bb22befe) — tier: primary-analysis — Luca Donno; the reasoning.
- [Stages update: Security Council requirements](https://medium.com/l2beat/stages-update-security-council-requirements-4c79cea8ef52) — tier: primary-analysis — how the bar moved.
- [Beyond L2s maturity: a formal approach to building secure blockchain rollups](https://blog.zksecurity.xyz/posts/l2_formal_paper/) — tier: primary-analysis — zkSecurity; the formal treatment.
- [Understanding L2BEAT: L2 types, maturity stages, and project analysis](https://nic619.substack.com/p/understanding-l2beat-2-l2-types-maturity) — tier: secondary — good orientation.

### Current state (Aug 2026)

- **No major Stage 2 rollups exist.** Every significant L2 retains some override capability.
- **Stage 1 (as of May 2026):** Arbitrum One, Base, OP Mainnet, Starknet, Scroll.
- **zkSync Era and Linea remain Stage 0** *despite shipping validity proofs*, because upgrade keys and
  operator control stay centralised. **This is the module's headline teaching point.**
- Sources differ slightly on Stage 1 membership — check L2BEAT directly, it is the live source.

### Misconceptions

- Belief: A ZK rollup is trustless because the proof is mathematical. | Reality: zkSync Era and Linea are Stage 0. The proof constrains execution; the upgrade key constrains everything else. | Source: https://l2beat.com/stages
- Belief: "Secured by Ethereum" means my funds are as safe as on L1. | Reality: at Stage 0 a compromised multisig can alter the protocol unilaterally. | Source: https://medium.com/l2beat/introducing-stages-a-framework-to-evaluate-rollups-maturity-d290bb22befe
- Belief: Optimistic rollups are less secure than ZK rollups. | Reality: stage is determined by governance and exit guarantees, not proof type. Several optimistic rollups outrank several ZK ones.
- Belief: The 7-day withdrawal delay is the main downside of optimistic rollups. | Reality: bridges front the delay for a fee. The deeper issues are sequencer centralisation and upgrade keys.

### Practice ideas

- kind: read — Pick three L2s, read their L2BEAT risk rows, and write what would have to be true for each to reach Stage 2. — Acceptance: three written gap analyses naming specific contracts or keys.
- kind: write — For a product holding user funds on an L2, write the risk disclosure you would honestly give users. — Acceptance: names the upgrade authority and the exit path explicitly.
- kind: implement — Execute a forced-inclusion transaction from L1 on a testnet L2. — Acceptance: the transaction lands on L2 without the sequencer's cooperation.
- kind: measure — Compare the cost of the same transaction on three L2s and on L1 post-Fusaka. — Acceptance: measured table with a note on how much blob pricing changed the comparison.

### Visual opportunities

- The three stages as a ladder with each guarantee gained, and real chains placed on it.
- Two rollups side by side — one ZK/Stage 0, one optimistic/Stage 1 — making "proof type ≠ trust level" unmissable.
- The forced-inclusion path drawn from L1 through to L2 execution.

### Gaps & uncertainties

- Stage assignments move; **this module needs `volatility: hot`** and a short re-verify window.
- Whether any chain reached Stage 2 after May 2026 — unverified.
