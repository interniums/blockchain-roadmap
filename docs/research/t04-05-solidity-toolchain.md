# T04–T05 — Solidity & Contracts / Toolchain — Source-Verified Research

Compiled: 2026-08-25
Scope: Track 04 (Solidity & Contracts), Track 05 (Toolchain), plus a build-blocking
investigation into machine-readable `forge test` output.

Source tiers used throughout:
- `spec` — EIP / formal standard text
- `canonical-docs` — official project documentation or release notes
- `primary-analysis` — maintainer-written blog posts, GitHub issues/PRs, audit reports
- `secondary` — third-party write-ups (explicitly marked)

Status legend for claims under verification: [VERIFIED] / [CORRECTED] / [UNCONFIRMED]

---

## Test-runner integration notes — BUILD BLOCKER RESOLVED

> **Verification status: VERIFIED.** Foundry docs plus the open issue tracker.

**Finding: use `--junit`, not `--json`.**

`forge test` supports **both** `--json` and `--junit` output formats. The `--json` path still has the
long-standing defect ([issue #3001](https://github.com/foundry-rs/foundry/issues/3001), still open):
it writes compiler diagnostics and failing-test information to **stdout alongside** the JSON, so the
stream is not machine-parseable without heuristics. You cannot reliably pipe it to `jq`, and
[issue #2210](https://github.com/foundry-rs/foundry/issues/2210) — a request for a separate
`--json-file` so human and machine output can coexist — remains open.

`--junit` emits JUnit XML, a stable, widely-specified schema with per-test-case pass/fail, timing and
failure messages. Every CI system on earth parses it, so the format is far less likely to drift, and
mature Node parsers exist.

**Recommended approach for the practice harness:**

1. Invoke `forge test --junit --match-path <path from practice YAML>` via `spawn` with an argument
   array — never a shell string (see plan §17 on execution safety).
2. Parse the JUnit XML for per-testcase results. Map each `<testcase>` to an acceptance criterion.
3. Capture stderr separately for compiler errors — a compile failure is a distinct UI state from a
   test failure, and the learner needs to be told which one happened.
4. Treat a non-zero exit with no parseable XML as "could not run", not "you failed".

**Do not** attempt to parse `--json` unless a future release closes #3001.

**Open question:** whether `--junit` suppresses stdout pollution as cleanly as expected — not
verified experimentally. **Verify with a real run before building on it.** This is a 10-minute
experiment and should be P5's first task.

### Sources

- [forge test reference](https://www.getfoundry.sh/reference/forge/test) — tier: canonical-docs — documents both `--json` and `--junit`.
- [`forge test --json` writes non-json to stdout](https://github.com/foundry-rs/foundry/issues/3001) — tier: canonical-docs — the defect, still open.
- [Add an optional `--json-file` argument](https://github.com/foundry-rs/foundry/issues/2210) — tier: canonical-docs — the unimplemented fix.

---

## Current state — versions (Aug 2026)

> **Verification status: VERIFIED for Solidity. PARTIAL for Foundry.**

### Solidity — 0.8.36 is current

**Released 9 July 2026.** This CORRECTS the plan document, which named 0.8.35 as latest.

- **Two security fixes**, both medium severity.
- **Stack-too-deep is effectively solved** on the SSA backend: the SSA-form code generator introduced
  in 0.8.35 gained **stack-to-memory spilling** in 0.8.36. This is the long-promised fix for the
  single most notorious Solidity papercut.
- **The experimental EOF backend was REMOVED** — EOF was *rejected* for inclusion in the Fusaka
  network upgrade, so the backend was obsolete. Any material teaching EOF as upcoming is wrong.
- **Adds support for the upcoming EVM version "Amsterdam."**
- Bug fixes: `PostTypeContractLevelChecker` inheritance-order reversal affecting analysis and
  codegen; Yul optimizer call-graph cycle detection misclassifying mutually recursive functions.

Prior context, still true: 0.8.35 (Apr 2026) introduced the SSA CFG code generator; 0.8.34 (Feb 2026)
patched a **high-severity** transient-storage clearing bug in the IR pipeline.

### Foundry — needs one more check

- **v1.5.1** is described as a bugfix release supporting **solc 0.8.31**.
- **Nightly is 1.8.0-nightly**, built 2026-08-04.
- Install and pin via `foundryup`; `foundryup -v stable` installs the stable channel.
- **UNCONFIRMED:** whether stable has advanced past 1.5.1, and which solc versions current stable
  supports. Note the apparent lag: if stable tops out below 0.8.36, lessons pinning 0.8.36 may not
  compile on stable Foundry. **Resolve before P3 pins any version.**

### Sources

- [Solidity 0.8.36 release announcement](https://www.soliditylang.org/blog/2026/07/09/solidity-0.8.36-release-announcement/) — tier: canonical-docs — published: 2026-07-09.
- [Solidity releases blog](https://www.soliditylang.org/blog/category/releases/) — tier: canonical-docs — the running list; the right place for the re-verify queue to check.
- [Foundry stable release](https://getfoundry.sh/releases/stable/) — tier: canonical-docs.
- [CLI reference: versions](https://www.getfoundry.sh/reference/versions) — tier: canonical-docs.
- [Foundry versioning and changelog](https://github.com/foundry-rs/foundry/issues/7506) — tier: canonical-docs — context on their versioning approach.

### Misconceptions

- Belief: Stack-too-deep is a permanent fact of Solidity life. | Reality: solved on the SSA backend as of 0.8.36 via stack-to-memory spilling. | Source: https://www.soliditylang.org/blog/2026/07/09/solidity-0.8.36-release-announcement/
- Belief: EOF is coming to the EVM soon. | Reality: **rejected** for Fusaka; Solidity removed its EOF backend in 0.8.36. | Source: same
- Belief: `forge test --json` is the machine-readable output. | Reality: it is polluted by non-JSON stdout; `--junit` is the reliable path. | Source: https://github.com/foundry-rs/foundry/issues/3001

### Gaps & uncertainties

- Current Foundry **stable** version and its max supported solc — unresolved, and it gates version pinning.
- Whether "Amsterdam" EVM version corresponds to the Glamsterdam network upgrade — **inferred, not verified.**
- The two 0.8.36 security fixes are described only as "medium severity"; details not retrieved.

---

## 04.2 — Storage layout

> **Verification status: VERIFIED** against the Solidity docs (latest tree shows 0.8.37-develop,
> consistent with 0.8.36 being the current release).

### Concepts

- `storage-slot` — Storage is a mapping from 256-bit slot number to 32-byte word; state variables are assigned slots starting at 0. | requires: [key-value-state]
- `slot-packing` — Contiguous variables smaller than 32 bytes share a slot when they fit; the first is stored lower-order aligned. | requires: [storage-slot]
- `packing-order-matters` — `uint128, uint128, uint256` occupies two slots; `uint128, uint256, uint128` occupies three. Declaration order is a gas decision. | requires: [slot-packing]
- `struct-array-new-slot` — Structs and array data always begin a new slot, packing tightly within themselves. | requires: [slot-packing]
- `mapping-slot-derivation` — A mapping's values live at `keccak256(key ‖ slot)`; the declared slot itself stays empty but must exist so two adjacent mappings get different hash distributions. | requires: [storage-slot, hash-function]
- `dynamic-array-layout` — The declared slot holds the length; elements start at `keccak256(slot)` and run contiguously. Byte arrays and strings are special-cased. | requires: [mapping-slot-derivation]
- `no-in-between-storage` — Mappings and dynamic arrays cannot be stored between the variables around them, which is why their data is hashed elsewhere. | requires: [mapping-slot-derivation]
- `transient-storage-layout` — Transient storage has its own layout rules, documented alongside storage in recent versions. | requires: [storage-slot, transient-storage]

### Primary sources

- [Layout of state variables in storage and transient storage](https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html) — tier: canonical-docs — **normative**. Now covers transient storage too.

### Misconceptions

- Belief: Declaration order is stylistic. | Reality: it directly determines slot count and therefore gas. | Source: the docs above
- Belief: A mapping's declared slot holds data. | Reality: it stays empty; it exists to seed the hash derivation.
- Belief: Packing always saves gas. | Reality: reading one variable from a shared slot may require masking; a packed layout can cost more if fields are accessed independently and often.

### Practice ideas

- kind: measure — Deploy two contracts with identical fields in different orders; compare deployment and write gas. — Acceptance: measured difference plus a slot map for each.
- kind: implement — Given a contract, compute by hand the slot of `myMapping[addr]` and a dynamic array element, then verify with `cast storage`. — Acceptance: hand-computed slots match the chain.
- kind: read — Read the storage layout of a well-known deployed proxy and identify where the implementation address lives. — Acceptance: the ERC-1967 slot identified and explained.

### Pays off in

`04 proxies & upgrades` (storage collisions are layout bugs) · `03 state & tries` · `05 gas profiling` · `06 vulnerability classes` · `13 indexing` (decoding raw storage).

---

## 04.7 — Proxies & upgrades

> **Verification status: VERIFIED.** Includes a 2026 production incident that is ideal teaching material.

### Concepts

- `delegatecall-proxy` — A proxy holds the storage and delegatecalls an implementation for logic, so code and state live in different accounts. | requires: [delegatecall, storage-slot]
- `storage-collision` — If proxy and implementation both use sequential slots, implementation writes can overwrite proxy control variables. | requires: [delegatecall-proxy, slot-packing]
- `erc-1967-slots` — Standardised pseudo-random slots such as `keccak256('eip1967.proxy.implementation') - 1`, chosen so sequential Solidity variables cannot collide with them. | requires: [storage-collision]
- `transparent-proxy` — Routes admin calls to the proxy and everything else to the implementation, avoiding function-selector clashes at the cost of extra runtime checks. | requires: [erc-1967-slots]
- `uups-proxy` — Puts the upgrade function in the *implementation*, making the proxy cheaper — but every future implementation must keep a correctly guarded upgrade function. | requires: [erc-1967-slots] | contrasts: [transparent-proxy]
- `uups-bricking-risk` — Ship one implementation without the upgrade function and the contract is **permanently** locked. | requires: [uups-proxy]
- `beacon-proxy` — Many proxies read their implementation from one beacon, so a single upgrade moves them all. | requires: [erc-1967-slots]
- `erc-7201-namespaced-storage` — Namespaced layouts placing each component's storage at a derived, non-sequential root. | requires: [storage-collision] | contrasts: [erc-1967-slots]
- `layout-migration-hazard` — Migrating a live proxy between layout schemes can violate encoding invariants and **irrecoverably brick** the contract. | requires: [erc-7201-namespaced-storage, uups-bricking-risk]

### Primary sources

- [EIP-1967 storage slots for proxies](https://rareskills.io/post/erc1967) — tier: primary-analysis — RareSkills; the clearest treatment of why the slots are derived that way.
- [The transparent upgradeable proxy pattern explained in detail](https://rareskills.io/post/transparent-upgradeable-proxy) — tier: primary-analysis.
- [Unrecoverable deadlock upgrading a UUPS proxy from v4 sequential storage to v5 ERC-7201](https://github.com/openzeppelin/openzeppelin-contracts/issues/6362) — tier: primary-analysis — **the key case study.** A live BNB Smart Chain proxy was permanently deadlocked: v4's `_initialized` flag (`0x01`) landed in the same slot as v5's first ERC-7201 string, violating Solidity's string encoding invariant. The contract cannot be initialized, upgraded, or administered by any on-chain transaction.
- [UUPS vs Transparent vs Beacon: proxy security guide 2026](https://www.zealynx.io/blogs/upgrade-patterns-security) — tier: primary-analysis — current comparison.
- [UPC Sentinel: detecting upgradeability proxy contracts in Ethereum](https://arxiv.org/pdf/2501.00674) — tier: primary-analysis — published: 2025-01 — how proxies are identified at scale.

### Misconceptions

- Belief: ERC-1967 makes storage collisions impossible. | Reality: it removes proxy-vs-implementation collisions. Implementation-vs-*next*-implementation collisions across upgrades remain entirely possible. | Source: https://github.com/openzeppelin/openzeppelin-contracts/issues/6362
- Belief: Upgrading to a newer OpenZeppelin major version is routine maintenance. | Reality: the v4→v5 layout scheme change bricked a live contract. | Source: same
- Belief: UUPS is simply the better modern choice. | Reality: cheaper, but it moves the bricking risk into every future implementation you ship. | Source: https://www.zealynx.io/blogs/upgrade-patterns-security
- Belief: An upgradeable contract is safer because bugs can be fixed. | Reality: it adds an admin key — a trust assumption and an attack surface that immutable contracts do not have.

### Practice ideas

- kind: break — Build a proxy whose implementation uses sequential storage, then overwrite the implementation pointer from a normal-looking setter and take control. — Acceptance: a test proving the takeover, then a fix using ERC-1967 slots.
- kind: read — Read the OpenZeppelin deadlock issue end to end and write out exactly which slot collided and why the string invariant broke. — Acceptance: written analysis identifying the mechanism.
- kind: implement — Write a minimal transparent proxy and a minimal UUPS proxy; upgrade each once. — Acceptance: tests proving state survives the upgrade in both.
- kind: fix — Given a UUPS implementation missing its upgrade guard, identify the risk and repair it. — Acceptance: a test showing the unguarded version is takeover-able and the fixed version is not.

### Visual opportunities

- Storage-collision animation: implementation writes `totalSupply`, proxy's implementation pointer changes.
- Slot maps side by side: sequential vs ERC-1967 vs ERC-7201 namespaced.
- The v4→v5 collision drawn slot by slot — this makes an abstract encoding invariant concrete.

---

## 04.8 — Token standards (ERC-4626 section)

> **Verification status: VERIFIED.**

### Concepts

- `erc-4626-vault` — A standard interface for tokenized yield vaults: deposit assets, receive shares, redeem later. | requires: [erc-20]
- `shares-vs-assets` — Shares are claims on a growing asset pool; the conversion rate is `totalAssets / totalSupply`. | requires: [erc-4626-vault]
- `rounding-direction` — Every conversion must round in the vault's favour; rounding toward the user is a slow drain. | requires: [shares-vs-assets]
- `donation-attack` — Sending assets directly to the vault, bypassing `deposit`, inflates `totalAssets` without minting shares and so manipulates the rate. | requires: [shares-vs-assets]
- `inflation-first-depositor-attack` — Deposit 1 wei for 1 share, donate a large amount directly, then the next depositor's share calculation rounds down to **zero** and their deposit accrues to the attacker. | requires: [donation-attack, rounding-direction]
- `virtual-shares-offset` — The mitigation: include virtual shares and virtual assets in the conversion so an empty vault has a defined rate and the decimal offset shrinks rounding error. | requires: [inflation-first-depositor-attack]
- `internal-accounting-vs-balanceof` — Tracking deposits internally rather than reading `balanceOf(this)` removes the donation surface entirely. | requires: [donation-attack]

### Primary sources

- [A novel defense against ERC-4626 inflation attacks](https://www.openzeppelin.com/news/a-novel-defense-against-erc4626-inflation-attacks) — tier: primary-analysis — OpenZeppelin's virtual-offset design and its reasoning. **Core reading.**
- [ERC-4626](https://docs.openzeppelin.com/contracts/5.x/erc4626) — tier: canonical-docs — the reference implementation.
- [ERC-4626 vaults: secure design, risks & best practices](https://speedrunethereum.com/guides/erc-4626-vaults) — tier: primary-analysis — SpeedRunEthereum.
- [How to detect an ERC-4626 first-depositor attack](https://dev.to/ohmygod/how-to-detect-erc4626-first-depositor-attack-a-security-researchers-guide-19bo) — tier: primary-analysis — the auditor's checklist framing.

### Misconceptions

- Belief: Using the ERC-4626 interface makes a vault safe. | Reality: the standard defines an interface, not safe math. Vaults without inflation mitigations have lost funds in production. | Source: https://www.openzeppelin.com/news/a-novel-defense-against-erc4626-inflation-attacks
- Belief: The donation attack needs a flash loan or special access. | Reality: it needs a plain ERC-20 transfer to the vault address.
- Belief: Rounding is a precision nicety. | Reality: rounding direction is a security property; rounding toward users is exploitable.
- Belief: Seeding the vault with a first deposit fully solves it. | Reality: it raises the attack's cost; virtual offsets or internal accounting address the mechanism.

### Practice ideas

- kind: break — Implement a naive ERC-4626 vault and execute the full first-depositor inflation attack against it. — Acceptance: a Foundry test where the victim receives 0 shares and the attacker withdraws their deposit.
- kind: fix — Add virtual shares and re-run the attack. — Acceptance: the same test now fails to profit, with the residual loss quantified.
- kind: implement — Write an invariant test asserting that no sequence of deposits, donations and withdrawals lets any user extract more than they put in plus their share of yield. — Acceptance: the invariant holds over a fuzz campaign and catches the naive version.
- kind: read — Read the OpenZeppelin virtual-offset article and explain what the decimal offset controls. — Acceptance: written answer relating offset size to residual attacker profit.

### Visual opportunities

- The inflation attack as a four-step share/asset ledger: 1 wei deposit, donation, victim deposit, attacker withdrawal.
- The conversion curve with and without a virtual offset, showing rounding-to-zero disappear.

### Gaps & uncertainties

- Remaining ERC-20/721/1155 material not yet researched — this section covers 4626 only.
- Current OpenZeppelin Contracts version not established (needed for the v4/v5 discussion above).

---

## 05.4 — Invariant testing

> **Verification status: VERIFIED.**

### Concepts

- `unit-vs-fuzz-vs-invariant` — Unit tests check known paths; fuzz tests check input ranges; invariant tests check properties that must hold across **all sequences**. | requires: []
- `stateful-fuzzing` — State persists across calls within a run, so the fuzzer builds interaction sequences rather than testing one call in isolation. | requires: [unit-vs-fuzz-vs-invariant]
- `invariant` — A property that must hold after **any** sequence of valid operations. | requires: [stateful-fuzzing]
- `runs-and-depth` — The two campaign dimensions: `runs` is how many sequences are generated, `depth` is how many calls per sequence. | requires: [stateful-fuzzing]
- `handler-pattern` — A thin wrapper that bounds inputs and only makes calls that can realistically succeed, so the fuzzer spends its budget on reachable states instead of reverts. | requires: [stateful-fuzzing]
- `ghost-variable` — A running tally kept by the handler of what the contract *should* hold, letting the invariant compare against an independent model. | requires: [handler-pattern]
- `solvency-invariant` — `assets >= liabilities`. The best first invariant, because it maps directly onto what an attacker wants to break. | requires: [invariant]
- `revert-metrics` — `show_metrics = true` reports which handler functions revert or get discarded; a high revert rate means the campaign is testing almost nothing. | requires: [handler-pattern]

### Primary sources

- [Invariant testing](https://foundry-book.zksync.io/forge/invariant-testing) — tier: canonical-docs — handler pattern and configuration.
- [Invariant testing in Foundry](https://rareskills.io/post/invariant-testing-solidity) — tier: primary-analysis — RareSkills.
- [Fuzz / invariant tests: the new bare minimum for smart contract security](https://patrickalphac.medium.com/fuzz-invariant-tests-the-new-bare-minimum-for-smart-contract-security-87ebe150e88c) — tier: primary-analysis — Patrick Collins; the argument that this is now table stakes.
- [Full guide to smart contract fuzz tests using Foundry](https://www.cyfrin.io/blog/smart-contract-fuzz-testing-using-foundry) — tier: primary-analysis — Cyfrin.
- [Foundry cheatcodes part 7: invariant testing explained](https://threesigma.xyz/blog/foundry/foundry-cheatcodes-invariant-testing) — tier: primary-analysis.

### Misconceptions

- Belief: Invariant testing is fuzzing with more runs. | Reality: fuzzing tests one call with random inputs; invariant testing tests random *sequences*, which is where state-dependent bugs live. | Source: https://rareskills.io/post/invariant-testing-solidity
- Belief: A passing invariant campaign proves the property. | Reality: it failed to find a counterexample within `runs × depth`. That is evidence, not proof. Formal verification proves.
- Belief: Just point the fuzzer at the contract. | Reality: without a handler most calls revert on unmet preconditions and the campaign explores almost nothing. | Source: https://foundry-book.zksync.io/forge/invariant-testing
- Belief: High run counts mean a good campaign. | Reality: check `show_metrics` — high revert rates mean the budget was wasted.

### Practice ideas

- kind: implement — Write a handler with a ghost variable and a solvency invariant for a simple vault. — Acceptance: invariant holds on the correct implementation and fails on a seeded bug.
- kind: fix — Given an invariant campaign with a 90% revert rate, diagnose it via `show_metrics` and repair the handler. — Acceptance: revert rate drops substantially and the campaign reaches deeper states.
- kind: break — Seed a rounding bug that only appears after a specific 3-call sequence; show unit tests pass and the invariant catches it. — Acceptance: both results demonstrated in one test run.
- kind: write — For a protocol of your choice, state five invariants in precise language. — Acceptance: each is falsifiable and independently checkable.

### Visual opportunities

- Unit vs fuzz vs invariant as coverage over a state space — three differently-shaped regions.
- A handler bounding the input domain, with reverted calls greyed out.
- Ghost variable vs actual contract state diverging at the exact call that introduces the bug.
