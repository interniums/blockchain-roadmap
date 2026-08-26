# Track 06 — Security
Source-verified curriculum research. Raw material for lesson authoring — not lesson prose.
Compiled 2026-08-25. Tiers: `spec` > `canonical-docs` > `primary-analysis` > `secondary` (marked).

---

## 06.2 — Vulnerability classes

> **Verification status: VERIFIED, with one numeric conflict flagged.**
> This module must be built from **2025–26 incident data**, not the 2018 SWC registry.

### The loss data

- **2025:** 122 deduplicated incidents, **$905.4M** in smart-contract losses.
- **2022–2025:** the 50 most severe real-world attacks totalled **>$1.09B**.
- By class: **access control $953.2M**, logic errors $63.8M, reentrancy $35.7M, flash-loan exploits $33.8M.
- The **OWASP Smart Contract Top 10 (2026)** is built directly from 2025 incident data: access control
  leads, business-logic bugs second, reentrancy persists **in new forms**, alongside oracle
  manipulation, flash loans and upgrade risk.

> ⚠ **Numeric conflict:** the $953.2M access-control figure exceeds the $905.4M stated 2025 total, so
> the two must cover different periods (access control is likely 2022–2025 cumulative). **Do not publish
> either number until the periods are pinned down** from the SoK paper directly.

### Concepts

- `access-control-failure` — Missing or wrong authorisation on a state-changing function. **The single largest loss category**, and it is unglamorous. | requires: []
- `business-logic-flaw` — Code that does exactly what it says, where what it says is wrong. Invisible to every static analyser. | requires: [access-control-failure]
- `reentrancy-classic` — An external call re-enters before state is updated. | requires: [call-frames]
- `read-only-reentrancy` — Re-entering a *view* function mid-transaction to read inconsistent state; the modern variant that guards on state-changing functions do not catch. | requires: [reentrancy-classic]
- `cross-function-reentrancy` — Re-entering a *different* function that shares state with the one in progress. | requires: [reentrancy-classic]
- `checks-effects-interactions` — Order state updates before external calls; the structural fix rather than a guard bolted on. | requires: [reentrancy-classic]
- `oracle-manipulation` — Moving the price source rather than attacking the contract logic. | requires: [business-logic-flaw]
- `flash-loan-amplification` — Flash loans are not themselves a vulnerability; they remove the capital requirement from attacks that were always possible. | requires: [oracle-manipulation]
- `precision-rounding-bug` — Rounding in the user's favour, or truncating before multiplying, drains value slowly and legally. | requires: [business-logic-flaw]
- `upgrade-risk` — The admin key and the migration path are attack surface that immutable contracts do not have. | requires: [layout-migration-hazard]
- `signature-replay` — Reusing a valid signature in another context, chain or transaction. | requires: [signature-malleability, domain-separator]
- `exploit-chain` — Real incidents rarely have one cause; they combine economic design, operational failure and an implementation bug. | requires: [business-logic-flaw]

### Primary sources

- [SoK: root causes of $1 billion loss in smart contract real-world attacks](https://arxiv.org/html/2507.20175) — tier: primary-analysis — published: 2025-07 — **the core reading.** Systematic review of 50 severe attacks; establishes that access control and business logic dominate.
- [OWASP Smart Contract Top 10](https://owasp.org/www-project-smart-contract-top-10/) — tier: canonical-docs — the 2026 edition, built from 2025 incidents.
- [The OWASP Smart Contract Top 10: 2026, every vulnerability explained with real exploits](https://dev.to/ohmygod/the-owasp-smart-contract-top-10-2026-every-vulnerability-explained-with-real-exploits-i30) — tier: secondary — useful index into real cases; verify each against its own source.
- [Smart contract vulnerabilities in Ethereum: systematic literature review](https://link.springer.com/article/10.1007/s40998-026-01138-8) — tier: primary-analysis — published: 2026 — peer-reviewed.
- [Smart contract audit landscape 2026](https://blockeden.xyz/blog/2026/01/17/smart-contract-audit-landscape-vulnerabilities-prevention-2026/) — tier: secondary — reports $3.4B in crypto theft driving audit demand; treat the figure as unverified.

### Misconceptions

- Belief: Reentrancy is the archetypal smart contract bug. | Reality: it is **fourth** by loss value ($35.7M) behind access control ($953.2M), logic errors and flash loans. It dominates *curricula*, not incidents. | Source: https://arxiv.org/html/2507.20175
- Belief: A reentrancy guard makes a contract reentrancy-safe. | Reality: read-only reentrancy re-enters view functions that guards do not protect. | Source: https://owasp.org/www-project-smart-contract-top-10/
- Belief: Flash loans are a vulnerability. | Reality: they remove the capital barrier from attacks that were already possible. The bug is elsewhere.
- Belief: Static analysers catch the important bugs. | Reality: the largest loss categories — access control intent and business logic — are exactly what tools cannot infer.
- Belief: Audited means safe. | Reality: audits are a point-in-time review of a specific commit under a specific scope.

### Practice ideas

- kind: write — Take the loss-by-class data and re-rank your own intuition about what to worry about; justify the gap. — Acceptance: written reflection naming at least one belief the data overturned.
- kind: break — Implement and exploit read-only reentrancy against a contract with a standard guard on all state-changing functions. — Acceptance: a test proving the guard did not help.
- kind: read — Pick three 2025 incidents from the SoK paper and classify each by root cause. — Acceptance: three written classifications with the exploit chain traced.

### Visual opportunities

- Loss by vulnerability class as a bar chart — access control dwarfing reentrancy is the whole lesson.
- Reentrancy variants as call-flow diagrams: classic, cross-function, read-only side by side.
- An exploit chain as a sequence: economic design → operational gap → implementation bug → loss.

---

## 06.4 — Static analysis & tooling

> **Verification status: VERIFIED for tool identity and role. Versions NOT established.**

### Concepts

- `static-analysis` — Analysing source or bytecode without executing it; fast, and inherently prone to false positives. | requires: []
- `slither` — Trail of Bits' Python static analyser, **93 detectors**, designed for CI integration. The default first pass. | requires: [static-analysis]
- `aderyn` — Cyfrin's Rust static analyser: traverses the AST, reports in markdown, tuned for low false-positive rate. | requires: [static-analysis]
- `symbolic-execution` — Exploring paths with symbolic rather than concrete inputs to reason about whole input classes. | requires: [static-analysis]
- `halmos` — a16z's bounded symbolic execution tool for Solidity. | requires: [symbolic-execution]
- `property-fuzzing` — Generating random inputs to break an author-stated property; probabilistic, not exhaustive. | requires: []
- `echidna` — Trail of Bits' property-based fuzzer. | requires: [property-fuzzing]
- `medusa` — High-speed parallel fuzzer for long campaigns. | requires: [echidna]
- `formal-verification` — Mathematically proving a property holds for **all** inputs, not merely those sampled. | requires: [symbolic-execution] | contrasts: [property-fuzzing]
- `certora-prover` — Commercial formal verification, typically reserved for high-value contracts. | requires: [formal-verification]
- `tool-stack-not-tool` — Professional practice combines static analysis, fuzzing and formal verification; no single tool has adequate coverage. | requires: [slither, echidna, certora-prover]

### Primary sources

- [Best smart contract auditing and security tools](https://www.cyfrin.io/blog/industry-leading-smart-contract-auditing-and-security-tools) — tier: primary-analysis — Cyfrin; note they author Aderyn, so read for capability not for ranking.
- [Smart contract auditing tools 2026: a reviewer's stack](https://hacken.io/discover/audit-tools-review/) — tier: primary-analysis — Hacken; how a firm actually sequences tools.
- [Top 10 smart contract security tools in 2026](https://www.quillaudits.com/blog/smart-contract/smart-contract-security-tools-guide) — tier: secondary.

### Misconceptions

- Belief: A clean Slither run means the contract is secure. | Reality: static analysis cannot infer intent, and intent bugs are the top loss category.
- Belief: Fuzzing and formal verification are competing choices. | Reality: fuzzing finds counterexamples cheaply; FV proves the absence of them expensively. Both, in that order.
- Belief: More detectors is better. | Reality: false positives cost auditor attention, which is the scarce resource — Aderyn's design explicitly trades coverage for signal.

### Practice ideas

- kind: measure — Run Slither and Aderyn on the same intentionally-vulnerable contract; compare findings and count false positives. — Acceptance: a comparison table with a judgement on each finding.
- kind: implement — Write an Echidna or Medusa property that catches a bug your unit tests miss. — Acceptance: fuzzer finds a counterexample; unit tests stay green.
- kind: write — For one contract, state three properties worth formally verifying and explain why fuzzing is insufficient for each. — Acceptance: written properties in precise language.

### Gaps & uncertainties

- **No tool versions established.** Needed before any lesson pins a command.
- Kontrol (KEVM-based FV) appeared in no result — research separately.
- Mythril's current maintenance status unverified; it may be stale.
