# Shard A06 — Track 05: Profiling, Deployment, CI

Raw curriculum research. Audience: experienced product engineer, zero blockchain background.
Compiled 2026-08-25.

## Status log
- [x] 05.6 — gas profiling
- [x] 05.7 — deploy & verify
- [x] 05.8 — CI
- [x] 05.9 — Hardhat 3 literacy

---

## 05.6 — Gas profiling: reports, snapshots, and what actually matters

### Concepts

- `gas-report` — `forge test --gas-report` prints, per contract, a deployment cost/size row plus one row per function with min / avg / median / max / # calls. | requires: [forge-test, gas-unit]
- `gas-report-is-test-shaped` — Those numbers describe *your test suite's* call distribution, not production: add one test that calls a function cheaply and the avg moves. | requires: [gas-report] | contrasts: [gas-report-is-truth]
- `gas-report-filtering` — `gas_reports = ["Token"]` and `gas_reports_ignore = ["Test","Script"]` in `foundry.toml` keep the report to contracts you actually ship. | requires: [gas-report, foundry-toml]
- `gas-snapshot-file` — `forge snapshot` writes one line per test to `.gas-snapshot`, a committed text file that turns gas into a reviewable diff. | requires: [gas-report]
- `snapshot-diff-vs-check` — `--diff` prints the delta and exits 0; `--check` prints the delta and exits 1 on mismatch, which is the CI-gating form. | requires: [gas-snapshot-file] | contrasts: [gas-report]
- `snapshot-cheatcodes` — `vm.startSnapshotGas("name")` / `vm.stopSnapshotGas()` measure a named region inside one test instead of the whole test function, so the harness cost is excluded. | requires: [gas-snapshot-file, cheatcode]
- `gas-metering-control` — `vm.pauseGasMetering()` / `vm.resumeGasMetering()` / `vm.resetGasMetering()` exclude setup from a measurement; `gasleft()` deltas do the same by hand. | requires: [snapshot-cheatcodes]
- `isolate-mode` — `--isolate` runs each top-level external call from a test as its own transaction, restoring realistic cold/warm accounting at the cost of no longer modelling a single multi-call transaction. | requires: [warm-cold-access, gas-report]
- `test-warmth-bias` — Setup code warms accounts and slots, so an un-isolated test systematically *under*-reports gas versus mainnet; there is no cheatcode to force a slot cold. | requires: [isolate-mode, warm-cold-access]
- `fuzz-seed-determinism` — Fuzz tests move gas numbers run to run; pin `--fuzz-seed` (or a dedicated non-fuzz gas suite) or every snapshot diff is noise. | requires: [gas-snapshot-file, fuzz-testing]
- `storage-dominates` — Cold SLOAD 2100 vs warm 100, and SSTORE 20000 for zero→nonzero vs 2900 for nonzero→nonzero, mean *how many distinct slots you touch* dwarfs almost every opcode-level trick. | requires: [warm-cold-access, storage-slot]
- `refund-cap` — Clearing storage refunds gas, but EIP-3529 caps total refund at 1/5 of the transaction's gas used, which killed the gas-token business and limits "clear state to save money" designs. | requires: [storage-dominates]
- `calldata-cost-model` — Calldata is 4 gas per zero byte and 16 per non-zero byte, plus (since EIP-7623) a floor price that makes data-heavy, computation-light transactions cost more than the old model implied. | requires: [gas-unit] | contrasts: [storage-dominates]
- `l2-cost-inversion` — On rollups the dominant cost is publishing data to L1, not execution, so calldata size and compression beat opcode micro-optimisation by orders of magnitude. | requires: [calldata-cost-model, rollup]
- `gas-folklore` — Most repeated tips (`uint8` is cheaper, `++i` beats `i++`, cache `array.length`) are worth single-digit gas or are already done by the optimizer, and several are net-negative. | contrasts: [storage-dominates]
- `optimizer-runs-tradeoff` — `optimizer_runs` trades deployment size against runtime cost; a low value shrinks bytecode, a high value inlines more and costs more to deploy. | requires: [gas-report]

### Primary sources

- [Gas tracking](https://www.getfoundry.sh/forge/gas-tracking) — tier: canonical-docs — published: 2026 — the report columns, `.gas-snapshot`, config keys, and the snapshot cheatcodes in one place.
- [forge snapshot reference](https://www.getfoundry.sh/reference/forge/snapshot) — tier: canonical-docs — exact semantics of `--diff` / `--check`, including that `--check` exits 1.
- [Gas optimization guide](https://www.getfoundry.sh/guides/gas-optimization) — tier: canonical-docs — Foundry's own framing of which measurements are trustworthy.
- [Forge testing docs — isolation mode](https://www.getfoundry.sh/forge/testing) — tier: canonical-docs — why isolated calls change cold/warm accounting and when to turn it off.
- [Gas Profiling · foundry-rs/foundry discussion #8323](https://github.com/foundry-rs/foundry/discussions/8323) — tier: primary-analysis — maintainer + user discussion of what the profiler can and cannot see.
- [forge test -vvvv reports less gasUsed than the actual tx on mainnet · issue #5494](https://github.com/foundry-rs/foundry/issues/5494) — tier: primary-analysis — the canonical statement of the warm/cold under-reporting bias.
- [Rubilmax/foundry-gas-diff](https://github.com/Rubilmax/foundry-gas-diff) — tier: secondary (community action) — the de-facto PR gas-diff action; carries the "use a separate, rarely-updated gas suite and a fixed fuzz seed" advice.
- [emo-eth/forge-gas-metering](https://github.com/emo-eth/forge-gas-metering) — tier: primary-analysis — utilities for realistic metering including intrinsic/calldata cost, i.e. the part `--gas-report` omits.
- [EIP-3529: reduction in refunds](https://eips.ethereum.org/EIPS/eip-3529) — tier: spec — the refund cap.
- [EIP-7623: increase calldata cost](https://eips.ethereum.org/EIPS/eip-7623) — tier: spec — the floor-price model that changed calldata economics in Pectra (May 2025).

### Current state (Aug 2026)

- Foundry stable is in the **1.x** line (v1.5.1 is the last version I could confirm by name; nightly reads `1.8.0-nightly`, built 2026-08-04). **The exact current stable tag is UNRESOLVED** — see Gaps.
- Since Foundry 1.0 there are **two** gas-snapshot mechanisms that coexist and are easy to confuse: the old whole-test `forge snapshot` → `.gas-snapshot`, and the newer cheatcode-driven named snapshots (`vm.startSnapshotGas` / `vm.stopSnapshotGas`). Teach both and say which one a repo is using.
- **`--isolate` is the flag that makes gas numbers mean something.** Docs now also reference `--no-isolate` / `isolate = false`, which implies isolation is the default in at least some configurations — verify against the installed version before teaching a default.
- **Post-Pectra (May 2025) calldata is no longer flat 4/16 in effect.** EIP-7623 added a floor cost for transactions that are mostly data. Any 2023-era gas lesson that says "calldata is 16 gas a byte, full stop" is now incomplete.
- **Post-Fusaka (Dec 2025) the L1 block gas limit is 60M with a per-transaction cap of ~16.78M (EIP-7825).** A single deployment or migration transaction can no longer consume an entire block, which is a real constraint on batch-migration scripts.
- Transient storage (EIP-1153) is the one genuinely large, genuinely easy win of the last three years: a transient reentrancy guard is ~200 gas versus ~7100 for the storage version.
- Commonly taught and now wrong: gas tokens (dead since EIP-3529); "always use `uint8` for small numbers"; "the optimizer won't hoist `array.length`".

### Misconceptions

- Belief: The `--gas-report` avg is what users will pay. | Reality: it is the mean over your test suite's calls, which you control; median and min/max spread matter more. | Why: tests over-sample cheap paths and warm state. | Source: https://www.getfoundry.sh/forge/gas-tracking
- Belief: Foundry gas numbers match mainnet. | Reality: they under-report, because test setup leaves accounts and slots warm and the 21000 intrinsic + calldata cost is outside the measured call. | Why: no cheatcode can force a slot cold; the report measures the call, not the transaction. | Source: https://github.com/foundry-rs/foundry/issues/5494
- Belief: `--isolate` makes tests more realistic, so always use it. | Reality: it also breaks tests that legitimately depend on warmth persisting across calls within one transaction. | Why: each top-level call becomes a separate transaction context. | Source: https://www.getfoundry.sh/forge/testing
- Belief: `uint8` costs less than `uint256`. | Reality: the EVM word is 256 bits; narrow types add masking instructions unless they let you pack multiple values into one slot. | Why: the saving comes from slot packing, not from the type. | Source: https://www.getfoundry.sh/guides/gas-optimization
- Belief: `++i` instead of `i++` is a meaningful optimisation. | Reality: single-digit gas, frequently zero after the optimizer; it is a code-review tax with no measurable payoff. | Why: the IR pipeline eliminates the temporary. | Source: https://www.getfoundry.sh/guides/gas-optimization
- Belief: Gas optimisation is the same job on L1 and on an L2. | Reality: on a rollup, calldata/DA size usually dominates execution, so a change that adds opcodes but shrinks calldata is a win. | Why: L2 fees are mostly the cost of publishing data to L1. | Source: https://eips.ethereum.org/EIPS/eip-7623
- Belief: A red gas diff in CI means the PR is worse. | Reality: adding or changing a test changes the numbers with no production change at all. | Why: snapshots key off test names and call counts. | Source: https://github.com/Rubilmax/foundry-gas-diff

### Practice ideas

- kind: measure — Write one function, snapshot it three ways: plain `forge test --gas-report`, with `--isolate`, and with a `vm.startSnapshotGas` region. — Acceptance: learner reports three different numbers and explains, for each, what is included and excluded.
- kind: measure — Take a "gas optimisation checklist" from a blog post, apply five of its tips to a real contract, and snapshot before/after each one individually. — Acceptance: a table of measured deltas; at least one tip must be shown to save ≤10 gas or cost gas.
- kind: implement — Convert a storage-based reentrancy guard to a transient-storage one and measure. — Acceptance: measured saving in the thousands of gas, plus a test proving the guard still blocks reentrancy.
- kind: break — Add a new test to an existing suite without touching any production code, then run `forge snapshot --check`. — Acceptance: learner explains why CI failed and what the correct fix is (regenerate, or isolate the gas suite).
- kind: measure — Encode the same payload two ways (verbose ABI struct vs packed bytes), compare *transaction* cost including intrinsic + calldata, not just the internal call. — Acceptance: the packed version wins on calldata but may lose on execution; learner states which wins on an L2 and why.
- kind: read — Read EIP-7623 and compute the cost of a 10 KB-calldata transaction under both the old and the floor model. — Acceptance: two numbers and a statement of which applies.

### Visual opportunities

- A stacked bar of one real transaction's gas: 21000 intrinsic, calldata bytes, execution, refund — with the slice `--gas-report` actually measures highlighted. This single picture kills most gas confusion.
- Cold vs warm access as a timeline of one transaction: first SLOAD 2100, every later one 100 — and the same picture with `--isolate` splitting it into separate transactions.
- Gas-optimisation payoff chart: measured savings of ten common "tips", sorted, with storage-slot reduction and transient storage at one end and `++i` at the other.
- L1 vs L2 cost split as two pie charts (execution vs data availability) to make `l2-cost-inversion` obvious.

### Gaps & uncertainties

- **Foundry stable version is unresolved.** v1.5.1 is the newest stable I could name; nightly is 1.8.0-nightly (2026-08-04). Do not pin a version in lesson text until someone runs `forge --version` on a fresh `foundryup`.
- **Whether isolation is now on by default.** Docs reference both `--isolate` and `--no-isolate`/`isolate = false`. Sources are ambiguous about the default. Verify empirically; do not teach a default.
- **Where cheatcode gas snapshots are written.** The docs describe `vm.startSnapshotGas`/`vm.stopSnapshotGas` but I could not confirm the on-disk output path (community references mention a `snapshots/` directory with JSON). Unverified.
- **EIP-7623 exact constants not re-verified this session.** The floor model is real and shipped in Pectra; the specific per-token constants should be read straight from the EIP before appearing in a lesson.
- **Whether `forge snapshot --check` has a tolerance flag** in the current stable. Older versions had `--tolerance`; not confirmed for 1.x. Verify before designing a CI gate around it.
- SSTORE/SLOAD constants above are the post-Berlin (EIP-2929/EIP-2200) values and were not re-derived this session; treat as "check against the current Yellow Paper / execution-specs before publishing".

---

## 05.7 — Deploy & verify: scripts, broadcast files, CREATE2, explorers, multichain

### Concepts

- `forge-script` — A deployment "script" is a Solidity contract with a `run()` entrypoint, executed by `forge script`; deployment logic is written in the same language as the contracts. | requires: [solidity-contract, cheatcode] | contrasts: [js-deploy-script]
- `broadcast-cheatcode` — Only calls between `vm.startBroadcast()` and `vm.stopBroadcast()` become real transactions; everything else is local computation the chain never sees. | requires: [forge-script]
- `simulate-then-broadcast` — Without `--broadcast` the script is a dry run: it simulates against the RPC's state and writes artifacts but sends nothing. `--broadcast` is the irreversible flag. | requires: [forge-script] | contrasts: [broadcast-cheatcode]
- `broadcast-artifacts` — Results land in `broadcast/<Script>.s.sol/<chainId>/run-latest.json` (dry runs go to a separate dry-run folder), recording each transaction, its receipt and the deployed `contractAddress`. | requires: [simulate-then-broadcast]
- `broadcast-as-source-of-truth` — Later scripts read deployed addresses back out of the broadcast JSON (`vm.parseJsonAddress(json, ".transactions[0].contractAddress")`), so the file is deployment state, not a log. | requires: [broadcast-artifacts]
- `resume-and-slow` — `--resume` continues a partially-broadcast run using those artifacts; `--slow` sends transactions one at a time and waits for each receipt, which some chains and sequencers require. | requires: [broadcast-artifacts]
- `signer-selection` — `--account <keystore>` (imported with `cast wallet import`) or `--ledger` is the correct way to sign; `--private-key` puts a live key in shell history and process args. | requires: [forge-script] | contrasts: [private-key-env-var]
- `chain-flag-trap` — `--chain` only sets `block.chainid` inside the EVM; the network you actually talk to is whatever `--rpc-url` points at. | requires: [forge-script]
- `create-address-derivation` — A plain `CREATE` address is `keccak256(rlp(sender, nonce))[12:]`, so it depends on the deployer's nonce and cannot be reproduced across chains once the nonce diverges. | requires: [account-nonce] | contrasts: [create2-address-derivation]
- `create2-address-derivation` — `CREATE2` gives `keccak256(0xff ‖ deployer ‖ salt ‖ keccak256(initcode))[12:]` — no nonce, so the same deployer + salt + initcode yields the same address on every chain. | requires: [create-address-derivation]
- `initcode-hash-fragility` — Constructor arguments and compiler settings are part of the initcode hash, so one changed argument, optimizer setting or solc version silently changes the address. | requires: [create2-address-derivation]
- `deterministic-deployer-proxy` — The community CREATE2 factory at `0x4e59b44847b379578588920cA78FbF26c0B4956C` exists at the same address on most chains; Foundry's `new C{salt: s}()` routes through it by default, overridable via `create2_deployer` / `--create2-deployer`. | requires: [create2-address-derivation]
- `nicks-method` — That factory got its cross-chain address from a keyless, pre-EIP-155 signed transaction anyone can replay — which also means it cannot be deployed on chains that require replay-protected transactions or use a different gas schedule. | requires: [deterministic-deployer-proxy] | contrasts: [erc-7955-factory]
- `erc-7955-factory` — A Draft ERC proposing a permissionless CREATE2 factory at `0xC0DEb853af168215879d284cc8B4d0A645fA9b0E`, bootstrapped with EIP-7702 instead of Nick's method, to fix the chains where the old trick fails. | requires: [nicks-method, eip-7702]
- `create3-pattern` — A two-step deploy (CREATE2 a tiny proxy, which CREATEs the real contract) makes the final address independent of the initcode, so constructor args can differ per chain. | requires: [initcode-hash-fragility]
- `verification-is-bytecode-matching` — "Verified source" means the explorer recompiled your source with your stated settings and got bytecode matching what is on chain; it proves correspondence, not safety. | requires: [solidity-compiler] | contrasts: [audited]
- `metadata-hash-match` — Solidity appends a metadata hash to bytecode; matching it too gives an "exact/full" match, while matching only the executable part gives a "partial" match that can hide comment- or path-level differences. | requires: [verification-is-bytecode-matching]
- `etherscan-v2-single-key` — Etherscan consolidated its per-explorer APIs into one V2 endpoint plus a `chainid` parameter, so one key now covers Etherscan, Arbiscan, Basescan, Polygonscan and the rest. | requires: [verification-is-bytecode-matching]
- `sourcify-alternative` — Sourcify is the open, chain-agnostic verification service, used via `--verifier sourcify`; Blockscout-based explorers are a third target. | requires: [verification-is-bytecode-matching] | contrasts: [etherscan-v2-single-key]
- `same-address-not-same-contract` — Identical addresses across chains say nothing about identical code or identical constructor configuration; each chain must be verified independently. | requires: [create2-address-derivation, verification-is-bytecode-matching]

### Primary sources

- [Scripting / deploying with Forge](https://getfoundry.sh/forge/deploying/) — tier: canonical-docs — `run()`, broadcast cheatcodes, `broadcast/<Script>.s.sol/<chainId>/run-latest.json`, `--resume`, signer options including `--account`, `--ledger`, `--browser`.
- [forge script reference](https://getfoundry.sh/forge/reference/forge-script/) — tier: canonical-docs — full flag surface including `--slow`, `--multi`, `--skip-simulation`.
- [forge verify-contract reference](https://getfoundry.sh/forge/reference/forge-verify-contract/) — tier: canonical-docs — `--verifier`, `--verifier-url`, `--watch`, `--guess-constructor-args`.
- [Deterministic deployments using CREATE2](https://www.getfoundry.sh/guides/deterministic-deployments-using-create2) — tier: canonical-docs — the `0x4e59…` default deployer, `create2_deployer` config, `--create2-deployer`.
- [ERC-7955: Permissionless CREATE2 Factory](https://eips.ethereum.org/EIPS/eip-7955) — tier: spec — status Draft — the EIP-7702-bootstrapped factory at `0xC0DEb853af168215879d284cc8B4d0A645fA9b0E` and an explicit list of what is wrong with Nick's method.
- [Verify with Foundry — Etherscan docs](https://docs.etherscan.io/contract-verification/verify-with-foundry) — tier: canonical-docs — the vendor's own Foundry instructions; V2 endpoint form.
- [foundry issue #9196 — use the single Etherscan V2 endpoint](https://github.com/foundry-rs/foundry/issues/9196) — tier: primary-analysis — the migration tracked in Foundry itself; useful for dating the change.
- [foundry issue #2435 — `--verify` fails with "Etherscan could not detect the deployment"](https://github.com/foundry-rs/foundry/issues/2435) — tier: primary-analysis — the classic race between broadcast and indexing; explains why `--watch` and retry exist.
- [Deploy deterministic addresses — LayerZero](https://docs.layerzero.network/v2/developers/evm/tooling/uniform-address) — tier: canonical-docs (vendor) — a production multichain team's recipe for uniform addresses.
- [Deterministic deployment in Foundry with a vanity address](https://blog.oighty.com/deterministic-deployments-in-foundry) — tier: secondary — practical salt-mining walkthrough.

### Current state (Aug 2026)

- **One Etherscan API key, not twelve.** The V2 API consolidated all Etherscan-family explorers behind `https://api.etherscan.io/v2/api?chainid=<id>`. For a chain Foundry doesn't know natively, pass `--verifier etherscan --verifier-url "https://api.etherscan.io/v2/api?chainid=<id>"` with the same key. Any tutorial telling learners to collect a separate Arbiscan/Basescan/Polygonscan key is out of date.
- **Keystore signing is the taught default.** `cast wallet import` + `--account` (and `--ledger`, plus a newer `--browser` option for browser wallets) has displaced `--private-key`; treat raw-key examples as a smell.
- **EIP-7702 changed what "an address with no code" means** for deployment safety: an EOA can carry a delegation designator, so `extcodesize == 0` is no longer a reliable "nobody is here" check before a CREATE2 deploy or during factory logic.
- **ERC-7955 is Draft, not shipped.** The `0x4e59…` proxy is still the practical answer in Aug 2026. Teach 7955 as "the known problem with Nick's method and the proposed fix", not as current practice.
- **Post-Fusaka per-transaction gas cap (~16.78M)** bounds how much you can deploy or migrate in a single transaction — relevant to scripts that deploy a large system in one shot.
- Commonly taught and now wrong: "verified on Etherscan means audited"; "one key per explorer"; "`--private-key $PK` is fine for testnets" (it teaches a habit that leaks on mainnet).

### Misconceptions

- Belief: Running `forge script` deploys the contract. | Reality: without `--broadcast` it only simulates; with `--broadcast` it is irreversible. | Why: the same command does both, distinguished by one flag. | Source: https://getfoundry.sh/forge/deploying/
- Belief: `--chain base` sends the transaction to Base. | Reality: `--chain` only sets `block.chainid` in the EVM; `--rpc-url` selects the network. | Why: the two concepts are separately configurable and the names mislead. | Source: https://getfoundry.sh/forge/deploying/
- Belief: CREATE2 guarantees the same address everywhere. | Reality: only if deployer, salt **and initcode hash** are identical — and initcode includes constructor args and compiler settings. | Why: the address is a hash of all four inputs. | Source: https://www.getfoundry.sh/guides/deterministic-deployments-using-create2
- Belief: The `0x4e59…` factory exists on every chain. | Reality: it cannot be deployed by Nick's method on chains that mandate EIP-155 replay protection or use a different gas schedule; several chains lack it. | Why: the keyless transaction has a sealed gas price and no chain id. | Source: https://eips.ethereum.org/EIPS/eip-7955
- Belief: A verified contract is a safe contract. | Reality: verification proves source matches deployed bytecode, nothing more; malicious code verifies fine. | Why: the check is a recompile-and-compare. | Source: https://docs.etherscan.io/contract-verification/verify-with-foundry
- Belief: Verification failing means the deployment failed. | Reality: the usual cause is the explorer not having indexed the transaction yet, which is why `--watch`/retry exists. | Why: broadcast and indexing are asynchronous. | Source: https://github.com/foundry-rs/foundry/issues/2435
- Belief: Deploy once to mainnet, then repeat the same script per chain and you are done. | Reality: chain-specific constructor arguments break address determinism, and each chain needs its own verification and its own ownership/permission setup. | Why: initcode differs when args differ. | Source: https://docs.layerzero.network/v2/developers/evm/tooling/uniform-address
- Belief: The `broadcast/` directory is disposable output. | Reality: `--resume` and downstream scripts read it; deleting it after a partial failure loses your recovery path. | Why: it is the only local record of which transactions were sent. | Source: https://getfoundry.sh/forge/deploying/

### Practice ideas

- kind: implement — Write a deploy script, run it three times against a local Anvil: dry run, `--broadcast`, then a second script that reads the address out of `run-latest.json`. — Acceptance: second script reads the address from disk, not from a hardcoded constant.
- kind: measure — Compute a CREATE2 address by hand (`keccak256(0xff ‖ deployer ‖ salt ‖ keccak256(initcode))`) with `cast`, then deploy and confirm it matches. — Acceptance: hand-computed address equals the deployed address.
- kind: break — Deploy the same contract with CREATE2 to two Anvil instances, changing one constructor argument on the second. — Acceptance: learner predicts the address will differ before running, and explains the initcode-hash mechanism.
- kind: fix — Given a script that fails halfway through a five-contract deployment, recover using `--resume` rather than redeploying. — Acceptance: no duplicate deployments; the broadcast file shows one continuous run.
- kind: implement — Verify one contract on a testnet explorer with `forge verify-contract --watch`, then deliberately verify with a different optimizer setting. — Acceptance: learner explains why the second attempt fails and what the metadata hash has to do with it.
- kind: read — Read ERC-7955's motivation section and list the three failure modes of Nick's method. — Acceptance: replay protection, sealed gas parameters, and non-standardisation across chains all named.
- kind: write — Write the deployment runbook for a two-chain launch: address strategy, signer, verification, and the ownership handover step. — Acceptance: the runbook names who holds the keys after deployment and how that is verified on chain.

### Visual opportunities

- The three-phase pipeline of `forge script`: local simulation → onchain simulation against RPC state → broadcast, with the artifacts each phase writes.
- CREATE vs CREATE2 address derivation side by side, with the inputs colour-coded so `nonce` vs `salt ‖ initcodeHash` is visually obvious.
- A "same address, different chains" diagram showing the four inputs that must be byte-identical, with one changed constructor argument shown poisoning the result.
- Verification as a recompile-and-compare loop: source + settings → compiler → bytecode → compared against chain, with the metadata-hash tail drawn separately to explain exact vs partial match.
- Timeline of a failed multichain deploy: chain A succeeded, chain B ran out of gas, what `broadcast/` looks like on disk and what `--resume` does.

### Gaps & uncertainties

- **`--multi` semantics unverified.** The scripting docs I read say multichain deployment means running the script per RPC endpoint, while the CLI reference lists a `--multi` flag associated with scripts that switch forks. These do not obviously agree. Do not teach a multichain-in-one-run workflow until someone runs it.
- **Etherscan V1 sunset date unconfirmed.** Multiple secondary sources place the V2 consolidation in 2024–2025 and describe single-key config as the 2026 norm, but I did not confirm the exact V1 shutdown date. Do not state a date.
- **Sourcify match terminology.** Sourcify historically used "full match" / "partial match"; more recent material suggests a rename (exact match / match). Unverified — describe the concept, avoid the label.
- **Exact broadcast dry-run folder name** (`dry-run/` vs a suffixed path) not confirmed against the current version.
- **ERC-7955 is Draft** — the factory address `0xC0DEb853af168215879d284cc8B4d0A645fA9b0E` comes from the draft text and may change. Flag it as provisional in any lesson.
- Whether Foundry's default `create2_deployer` has changed in the 1.x line was not checked against the current stable binary.

---

## 05.8 — CI: Foundry in GitHub Actions, caching, gas diffs, coverage, invariant gates

### Concepts

- `ci-pipeline-shape` — The baseline Foundry job is: `actions/checkout@v4` with `submodules: recursive` → `foundry-rs/foundry-toolchain@v1` → `forge build` → `forge test -vvv`, on push to main and on pull requests. | requires: [forge-test, git]
- `submodule-checkout` — Forge dependencies are git submodules, so a checkout without `submodules: recursive` fails at compile time with confusing missing-import errors. | requires: [ci-pipeline-shape, forge-install]
- `foundry-version-pinning` — The toolchain action defaults to a channel, not a fixed build; CI that installs "latest nightly" is a pipeline whose behaviour changes without a commit. | requires: [ci-pipeline-shape] | contrasts: [reproducible-build]
- `ci-profile` — `FOUNDRY_PROFILE: ci` selects a `foundry.toml` profile that raises effort — e.g. `verbosity = 3`, `fuzz = { runs = 10000 }`, `invariant = { runs = 1000 }` — so local runs stay fast while CI runs hard. | requires: [ci-pipeline-shape, fuzz-testing]
- `fork-cache` — `foundry-rs/foundry-toolchain@v1` with `cache: true` persists `~/.foundry/cache` (RPC responses, Etherscan queries), which is what makes fork tests fast and cheap in CI. | requires: [fork-testing, ci-pipeline-shape]
- `fuzz-seed-in-ci` — Cached fork state does not help if fuzzing picks different inputs each run; a fixed fuzz seed is required for the cache to hit and for gas numbers to be comparable. | requires: [fork-cache, fuzz-seed-determinism]
- `gas-diff-comment` — A PR bot re-runs the gas report on base and head and comments the delta, turning gas into review feedback instead of a hidden regression. | requires: [gas-snapshot-file, ci-pipeline-shape]
- `snapshot-check-gate` — `forge snapshot --check` in CI hard-fails on any gas increase; useful for a frozen gas suite, hostile when the suite churns. | requires: [snapshot-diff-vs-check, gas-diff-comment] | contrasts: [gas-diff-comment]
- `coverage-lcov` — `forge coverage --report lcov` emits LCOV, which downstream actions filter (drop `test/`, `script/`), render as a PR comment, and threshold. | requires: [ci-pipeline-shape]
- `coverage-via-ir-breakage` — `forge coverage` regularly fails with "stack too deep" on projects that need `--via-ir`; the `--ir-minimum` workaround enables viaIR with minimal optimisation and degrades source-map accuracy. | requires: [coverage-lcov, via-ir]
- `coverage-is-not-correctness` — Line coverage counts executed lines; it says nothing about assertions, and a suite can hit 100% while asserting almost nothing. | requires: [coverage-lcov] | contrasts: [invariant-testing]
- `format-and-lint-gates` — `forge fmt --check` and `forge lint --deny warnings` are cheap, deterministic gates that should run before the expensive test job. | requires: [ci-pipeline-shape]
- `junit-machine-output` — For programmatic result parsing use `forge test --junit`; `--json` still interleaves non-JSON on stdout (foundry issue #3001). | requires: [ci-pipeline-shape]
- `campaign-tiering` — Fuzzing and invariants are split by budget: a short bounded run gates the PR, a long scheduled campaign runs nightly and files an issue on failure. | requires: [invariant-testing, ci-profile]
- `corpus-persistence` — Echidna/Medusa campaigns get cumulatively better only if the corpus directory is cached between runs; without it every nightly run restarts from zero. | requires: [campaign-tiering]
- `flaky-gate-hazard` — A randomised search used as a required check produces intermittent red builds unrelated to the diff, which trains reviewers to re-run rather than read. | requires: [campaign-tiering] | contrasts: [snapshot-check-gate]
- `fork-pr-secrets` — GitHub does not expose repository secrets to workflows triggered by pull requests from forks, so RPC-dependent jobs must degrade gracefully or run only on trusted events. | requires: [fork-cache]
- `action-supply-chain` — Third-party actions run arbitrary code with access to the job's secrets; pin them to a commit SHA rather than a moving tag. | requires: [ci-pipeline-shape]

### Primary sources

- [CI integration](https://www.getfoundry.sh/config/ci) — tier: canonical-docs — the official workflow, `cache: true`, `FOUNDRY_PROFILE: ci`, `ETH_RPC_URL` secret wiring, plus GitLab/CircleCI via `ghcr.io/foundry-rs/foundry:latest`.
- [foundry-rs/foundry-toolchain](https://github.com/foundry-rs/foundry-toolchain) — tier: canonical-docs — the action itself; documents caching of `~/.foundry/cache` and the fuzz-seed caveat.
- [forge coverage reference](https://www.getfoundry.sh/reference/forge/coverage) — tier: canonical-docs — report types (`summary`, `lcov`, `debug`, `bytecode`) and LCOV version support.
- [foundry issue #3357 — `forge coverage` stack too deep with `--ir-minimum`, report not accurate](https://github.com/foundry-rs/foundry/issues/3357) — tier: primary-analysis — the honest statement of the coverage limitation.
- [foundry issue #6592 — `forge coverage` doesn't use via-ir/optimizer settings](https://github.com/foundry-rs/foundry/issues/6592) — tier: primary-analysis — why coverage can disagree with your real build.
- [solidity issue #15775 — coverage fails with stack too deep under `--via-ir` while `forge test` works](https://github.com/argotorg/solidity/issues/15775) — tier: primary-analysis — the compiler-side view of the same problem.
- [foundry issue #3001 — `forge test --json` writes non-json to stdout](https://github.com/foundry-rs/foundry/issues/3001) — tier: primary-analysis — still open; the reason to use `--junit`.
- [ScopeLift/foundry-template](https://github.com/ScopeLift/foundry-template) — tier: secondary — an opinionated reference `ci.yml`: LCOV filtering of `test/` and `script/`, coverage PR comment, coverage threshold gate.
- [Rubilmax/foundry-gas-diff](https://github.com/Rubilmax/foundry-gas-diff) — tier: secondary — the standard PR gas-diff action.
- [crytic/echidna-action](https://github.com/crytic/echidna-action) — tier: canonical-docs (Trail of Bits) — running Echidna as a CI job.
- [Recon-Fuzz/create-chimera-app](https://github.com/Recon-Fuzz/create-chimera-app) — tier: secondary — write-once property tests runnable under Foundry, Echidna, Medusa and Halmos; the practical shape of a multi-engine campaign.
- [step-security/foundry-toolchain](https://github.com/step-security/foundry-toolchain) — tier: secondary (vendor) — a hardened drop-in fork; its existence is itself the evidence that CI supply chain is a live concern.

### Current state (Aug 2026)

- **`forge lint` is part of the standard gate now.** Foundry ships a first-party linter and the official CI page lists `forge lint --deny warnings` alongside `forge fmt --check`. Older curricula that reach for solhint as the only option are behind.
- **`cache: true` on the toolchain action is the documented default advice** for fork-test-heavy repos; it caches `~/.foundry/cache` including RPC and Etherscan responses.
- **Coverage remains the weakest link in the Foundry toolchain.** `forge coverage` still breaks on `--via-ir` projects, and `--ir-minimum` is explicitly a workaround with degraded source maps. Issues #3357 and #6592 are long-lived. Teach coverage as a rough signal, not a gate, unless the project compiles without via-ir.
- **CI supply chain became a first-class concern after the March 2025 `tj-actions/changed-files` compromise**, which leaked secrets from a very large number of repositories via a retagged action. Pinning actions by commit SHA moved from pedantry to baseline. (Incident details not re-verified this session — see Gaps.)
- **`--junit` is still the right machine-readable output**; `--json` pollution (#3001) is unfixed.
- Commonly taught and now wrong: "install nightly in CI so you get the latest fixes" (nondeterministic pipeline); "gate merges on 100% coverage" (unreachable and gameable on Solidity); "run the full invariant campaign on every PR" (slow and flaky).

### Misconceptions

- Belief: CI is just "run the tests". | Reality: for contracts CI also carries the gas budget, the format/lint gate, the coverage signal and the fuzz/invariant campaign — four different feedback loops with four different latencies. | Why: contract regressions are economic as well as functional. | Source: https://www.getfoundry.sh/config/ci
- Belief: Caching makes fork tests deterministic. | Reality: unseeded fuzzing changes the calls made, so the cache misses and results vary. | Why: the cache is keyed by the RPC requests actually issued. | Source: https://github.com/foundry-rs/foundry-toolchain
- Belief: A green `forge coverage` number reflects the code you ship. | Reality: coverage may be compiled with different optimizer/via-ir settings than your build, and `--ir-minimum` distorts source maps. | Why: coverage needs a different compilation mode than production. | Source: https://github.com/foundry-rs/foundry/issues/6592
- Belief: High coverage means well tested. | Reality: coverage measures execution, not assertion; invariant and property tests catch classes of bug that 100% line coverage misses entirely. | Why: an empty test that calls everything scores perfectly. | Source: https://www.getfoundry.sh/reference/forge/coverage
- Belief: Invariant tests either pass or fail. | Reality: they are bounded random searches — "passed" means "found nothing in N runs of depth D", which is a budget statement, not a proof. | Why: run/depth parameters bound the search. | Source: https://www.getfoundry.sh/config/ci
- Belief: A nightly fuzz campaign is just the PR job with a longer timeout. | Reality: without a persisted corpus each run restarts the search from scratch and never gets deeper. | Why: coverage-guided fuzzers accumulate a corpus. | Source: https://github.com/crytic/echidna-action
- Belief: Secrets are available to CI on every PR. | Reality: fork PRs get no repository secrets, so fork-test jobs silently skip or fail for outside contributors. | Why: a deliberate GitHub security boundary.
- Belief: `@v1` on an action is a safe pin. | Reality: tags are mutable; the 2025 changed-files incident propagated through a retagged release. | Why: only a commit SHA is immutable.

### Practice ideas

- kind: implement — Write a `ci.yml` from scratch with four jobs: fmt/lint, build+test, gas snapshot check, coverage. Make the cheap jobs fail fast. — Acceptance: a PR with a formatting error fails in under 60 seconds without running the test suite.
- kind: break — Land a PR that adds a test but changes no production code, with `forge snapshot --check` as a required gate. — Acceptance: learner explains the false positive and proposes either a frozen gas suite or a diff-comment-not-gate policy.
- kind: implement — Add a gas-diff PR comment and deliberately regress one function by 500 gas. — Acceptance: the comment shows the regression on the right function, and the number matches a local `--gas-report`.
- kind: fix — Take a project that compiles with `via_ir = true` and make `forge coverage` run at all. — Acceptance: learner produces a working command *and* writes down which numbers they now distrust and why.
- kind: implement — Split fuzzing into two workflows: a 256-run PR gate and a scheduled nightly campaign with a cached corpus that opens an issue on failure. — Acceptance: nightly run reuses the corpus from the previous night (demonstrated by cache hit + increasing coverage).
- kind: measure — Run the same invariant suite at runs=64/depth=50 and runs=1000/depth=500 on a contract with a known deep bug. — Acceptance: the short run passes, the long run fails; learner states what "passed" meant in the first case.
- kind: write — Audit an open-source contract repo's CI: list which actions are pinned to tags versus SHAs, and what secrets each job can read. — Acceptance: a table plus one concrete hardening recommendation.

### Visual opportunities

- The four feedback loops on one time axis: lint (seconds) → unit tests (minutes) → PR fuzz gate (tens of minutes) → nightly campaign (hours), with what each can and cannot catch.
- A PR page mock showing the three bot comments a mature contract repo produces — coverage delta, gas delta, invariant status — as the concrete target state.
- Corpus growth over successive nightly runs, cached vs uncached: two curves, one flat.
- Secret-exposure map: which jobs in a workflow can read `ETH_RPC_URL`, and where the fork-PR boundary cuts.

### Gaps & uncertainties

- **The `tj-actions/changed-files` compromise is stated from memory, not re-verified this session.** The date (March 2025), the CVE identifier and the blast radius should be confirmed before appearing in lesson text.
- **`foundry-rs/foundry-toolchain` major version**: the docs example shows `@v1`. Whether a `@v2` exists in Aug 2026 was not checked.
- **Whether `forge lint` is stable or still experimental** in the current stable release — it appears in official CI guidance, but its stability guarantees were not verified.
- **Concrete invariant runs/depth numbers vary widely between sources** (one source cites runs=512 depth≈500 for CI, the official CI profile example uses `invariant = { runs = 1000 }` with no depth). These are conventions, not recommendations with evidence behind them — present them as examples, and do not present any single pair as "the right setting".
- **Coverage thresholds**: every number in circulation (80%, 90%, 100%) is folklore. No source gives evidence linking a coverage threshold to defect rates in smart contracts. Do not publish a target number.
- Whether Foundry's own repos gate merges on invariant campaigns — not checked; would be a strong exemplar if true.

---

## 05.9 — Hardhat 3 literacy: what changed, when it is justified, how to read one

### Concepts

- `two-toolchain-world` — Foundry is Solidity-native and CLI-first; Hardhat is a TypeScript program that orchestrates compilation, testing and deployment. Most real repos contain one, some contain both. | contrasts: [forge-script]
- `hardhat-config-is-code` — The project is defined by `hardhat.config.ts`, a TypeScript module — not a declarative TOML file — so behaviour can depend on arbitrary code. | requires: [two-toolchain-world] | contrasts: [foundry-toml]
- `hardhat3-solidity-tests` — Hardhat 3 made Solidity tests first-class alongside TypeScript tests; both can live in one project and run in one command. | requires: [two-toolchain-world] | contrasts: [hardhat2-mocha-only]
- `hardhat3-edr` — The simulation layer is EDR, a Rust rewrite of Hardhat Network first shipped in Hardhat 2.21 and central to Hardhat 3's performance claims. | requires: [hardhat3-solidity-tests]
- `hardhat3-esm-only` — Hardhat 3 dropped CommonJS config loading: `"type": "module"` in `package.json`, `export default`, `import` instead of `require`. This alone blocks many Hardhat 2 projects from upgrading. | requires: [hardhat-config-is-code]
- `hardhat3-explicit-plugins` — Plugins and tasks are registered explicitly in the config rather than by import side effects, so what a project does is readable from one file. | requires: [hardhat-config-is-code] | contrasts: [hardhat2-side-effect-plugins]
- `hardhat3-network-connections` — There is no single global `hre.network`; you call `await hre.network.create()` and can hold several concurrent connections in one process. | requires: [hardhat3-explicit-plugins]
- `hardhat3-multichain` — Concurrent connections plus chain-aware simulation (notably OP Stack / Base) are what "multichain" means here: testing cross-chain flows inside one test process. | requires: [hardhat3-network-connections] | contrasts: [fork-testing]
- `hardhat3-hooks` — `extendConfig` and subtask overriding were replaced by a hooks system; extension points are now declared rather than monkey-patched. | requires: [hardhat3-explicit-plugins]
- `hardhat3-build-profiles` — Named build profiles let one project compile differently for development versus production instead of juggling config branches. | requires: [hardhat-config-is-code] | contrasts: [foundry-profiles]
- `hardhat-ignition` — Ignition is Hardhat's declarative deployment system: you describe the desired deployment as modules and it handles ordering, resumption and reconciliation. | requires: [two-toolchain-world] | contrasts: [forge-script, broadcast-artifacts]
- `hardhat2-eol` — Hardhat 2 has an announced end-of-life policy, driven by the Node ecosystem moving off CommonJS; "stay on 2" is a decaying option. | requires: [hardhat3-esm-only]
- `ts-coupling-justification` — Hardhat earns its place when the contract system is inseparable from TypeScript: shared types with a frontend/backend, tests that drive app code and contracts together, an existing TS monorepo, or a plugin that only exists for Hardhat. | requires: [two-toolchain-world]
- `foundry-default-otherwise` — Absent that coupling, Foundry's Solidity-native tests, fuzzing and invariants are the faster loop; adding Hardhat costs a second dependency tree and a second mental model. | requires: [ts-coupling-justification] | contrasts: [ts-coupling-justification]
- `coexistence-pattern` — Many production repos run both: Foundry for unit/fuzz/invariant testing, Hardhat for TypeScript integration tests, deployment plugins and ecosystem tooling. | requires: [two-toolchain-world]
- `directory-translation` — Reading a Hardhat repo as a Foundry user is mostly a mapping exercise: `contracts/`≈`src/`, `artifacts/`+`cache/`≈`out/`, `test/*.ts`≈`test/*.t.sol`, `ignition/modules/`≈`script/`, npm deps ≈ git submodules in `lib/`. | requires: [two-toolchain-world]
- `remapping-vs-node-resolution` — Foundry resolves imports through `remappings.txt`; Hardhat resolves them through Node module resolution in `node_modules`. The same import string can mean different files in the two toolchains. | requires: [directory-translation]

### Primary sources

- [Hardhat 3 homepage](https://hardhat.org/) — tier: canonical-docs — the official feature list: Rust-powered runtime, Solidity **and** TypeScript testing, multi-chain including OP Stack/Base simulation, Network Manager, Hardhat Ignition, built-in gas statistics and coverage.
- [Migrate from Hardhat 2](https://hardhat.org/docs/migrate-from-hardhat2) — tier: canonical-docs — the authoritative breaking-change list: explicit plugin config, self-managed network connections, hooks replacing `extendConfig`/subtask overriding.
- [Migrate Mocha tests from Hardhat 2](https://hardhat.org/docs/migrate-from-hardhat2/guides/mocha-tests) — tier: canonical-docs — what happens to an existing TypeScript test suite.
- [Hardhat 3 beta status](https://hardhat.org/docs/learn-more/beta-status) — tier: canonical-docs — the project's own framing of stability.
- [Release: Hardhat 3 is now in beta, and ready for production use](https://github.com/NomicFoundation/hardhat/releases/tag/hardhat@3.0.0) — tier: canonical-docs — published: 2025-08 — the 3.0.0 tag and its unusual "beta but production-ready" framing.
- [Release Hardhat v3.3.0](https://github.com/NomicFoundation/hardhat/releases/tag/hardhat@3.3.0) — tier: canonical-docs — the current 3.x line; recent additions include `--grep-exclude` for both Solidity and Mocha tests and experimental Amsterdam EIP-7843 (SLOTNUM) support.
- [Rust-powered Hardhat: present & future](https://blog.nomic.foundation/rust-powered-hardhat-present-future/) — tier: primary-analysis — Nomic Foundation on EDR, why the simulation layer was rewritten in Rust, first shipped in Hardhat 2.21.
- [OpenZeppelin: migrating from Hardhat 2](https://docs.openzeppelin.com/upgrades-plugins/migrate-from-hardhat-2) — tier: canonical-docs (third-party maintainer) — what the migration costs a major plugin's users.
- [@openzeppelin/hardhat-upgrades@4.0.0 release](https://github.com/OpenZeppelin/openzeppelin-upgrades/releases/tag/@openzeppelin/hardhat-upgrades@4.0.0) — tier: canonical-docs — evidence of the ecosystem actually completing the port.
- [Hardhat 3 is ESM-only now](https://gembait.com/en/blog/hardhat-3-is-esm-only) — tier: secondary — a practitioner write-up of the single most disruptive change.

### Current state (Aug 2026)

- **Hardhat 3.0.0 was tagged in August 2025** with the wording "now in beta, and ready for production use"; the line has since reached **3.3.0**, and Nomic describes 3.x as stable and production ready. The exact date it stopped being called beta is unconfirmed.
- **Hardhat 2 has an announced end-of-life policy**, explicitly motivated by the Node ecosystem moving past CommonJS. Treat Hardhat 2 material as legacy.
- **ESM-only is the migration blocker in practice.** A Hardhat 2 project cannot upgrade without converting its config (and often its scripts) to ES modules.
- **Gas reporting and coverage are now first-party**, where Hardhat 2 needed `hardhat-gas-reporter` and `solidity-coverage`. Tutorials that install those plugins are Hardhat 2 material.
- **Hardhat tracks upcoming forks quickly**: recent 3.x releases carry experimental Amsterdam support including EIP-7843 (SLOTNUM). Note that "Amsterdam" is the EVM-version label that also appears in Solidity 0.8.36 — the network upgrade itself (Glamsterdam) has not shipped.
- **Ignition, not `hardhat-deploy`, is the current deployment story** — a declarative module system rather than an imperative script.
- Commonly taught and now wrong: "Hardhat is for JS tests, Foundry is for Solidity tests" (Hardhat 3 runs Solidity tests); "`hre.network` is the network" (it is a connection factory now); "use `module.exports` in `hardhat.config.js`" (ESM only); "install solidity-coverage" (built in).

### Misconceptions

- Belief: Hardhat 3 is a version bump. | Reality: it is a different program — ESM-only, explicit plugin registration, no global network, hooks instead of subtask overriding. Migration is a project, not an afternoon. | Why: the extension model itself changed. | Source: https://hardhat.org/docs/migrate-from-hardhat2
- Belief: Choosing Hardhat means writing tests in TypeScript. | Reality: Hardhat 3 treats Solidity tests as first-class and expects mixed suites. | Why: the two test styles have different strengths and the runner supports both. | Source: https://hardhat.org/
- Belief: Hardhat is slow because it's JavaScript. | Reality: the simulation layer (EDR) is Rust; the JS is orchestration. | Why: the bottleneck was moved out of Node. | Source: https://blog.nomic.foundation/rust-powered-hardhat-present-future/
- Belief: You must pick one toolchain. | Reality: running Foundry for fuzz/invariant work and Hardhat for TypeScript integration and deployment plugins is a common, supported setup. | Why: they read the same Solidity sources; only artifacts and resolution differ.
- Belief: `contracts/` and `src/` are interchangeable, so a Foundry test will just work in a Hardhat repo. | Reality: import resolution differs — remappings versus Node resolution — so the same import string can resolve to different files. | Why: two different resolvers over two different dependency layouts.
- Belief: "Multichain" means fork testing several chains. | Reality: in Hardhat 3 it means holding multiple live network connections in one process and simulating chain-specific behaviour such as OP Stack. | Why: connections became explicit objects. | Source: https://hardhat.org/docs/migrate-from-hardhat2
- Belief: Ignition is `forge script` with different syntax. | Reality: `forge script` is imperative and recovers via `broadcast/` artifacts; Ignition is declarative and reconciles a desired-state module against what is already deployed. | Why: different execution models, different failure modes.

### Practice ideas

- kind: read — Clone a well-known Hardhat 3 repo and produce a translation table mapping every top-level directory and config key to its Foundry equivalent. — Acceptance: the table covers sources, artifacts, tests, deployments, dependencies and import resolution.
- kind: implement — Take a small Foundry project and add a Hardhat 3 setup alongside it that compiles the same `src/`. — Acceptance: both `forge test` and the Hardhat test command pass on the same sources, with import resolution working in both.
- kind: implement — Write the same test twice: once as a Foundry `.t.sol` test, once as a Hardhat TypeScript test using viem. — Acceptance: learner names one thing that is materially easier in each version.
- kind: fix — Given a Hardhat 2 config using `module.exports` and side-effect plugin imports, port it to Hardhat 3. — Acceptance: ESM config with explicit plugin registration; project compiles and tests run.
- kind: write — Write a one-page decision memo for a team choosing a toolchain, with the specific conditions that would justify Hardhat. — Acceptance: the memo names concrete conditions (shared TS types, app-level integration tests, a required plugin), not preferences.
- kind: measure — Run the same test suite under both toolchains and time it. — Acceptance: reported numbers plus an explicit note on what differs beyond speed (fuzzing, invariants, cheatcodes, debugging).

### Visual opportunities

- Side-by-side project-tree diff: Foundry layout versus Hardhat 3 layout, with arrows between equivalents — the single most useful artefact for the stated audience.
- Import resolution as two pipelines: `remappings.txt` → `lib/` versus Node resolution → `node_modules/`, with the same import string ending in different files.
- Hardhat 2 → 3 breaking-change map, grouped by what breaks the config, what breaks plugins, and what breaks tests.
- Deployment model contrast: `forge script` (imperative, broadcast artifacts, `--resume`) versus Ignition (declarative module, reconciliation against deployed state).
- A decision tree for toolchain choice whose leaves are conditions, not opinions.

### Gaps & uncertainties

- **Exact date Hardhat 3 was declared stable is unconfirmed.** 3.0.0 was tagged Aug 2025 as "beta, ready for production use"; a separate stability announcement was not located. Do not publish a stable-GA date.
- **Hardhat 2 EOL date unknown.** The policy is announced; the actual end date was not retrieved.
- **Performance claims are unverified.** The "2–5x faster" figure comes from a secondary blog, not from a benchmark I could inspect. Do not publish a speed multiplier; several sources give different numbers and none show methodology. **Sources conflict and I am not picking one.**
- **Whether Hardhat 3 defaults to viem or ethers** was not confirmed; both are supported via plugins and the homepage lists both. Do not assert a default.
- **Build profiles**: named in secondary material and in the migration ecosystem, but not confirmed on the pages I read. Verify the exact config key before teaching it.
- **`chainType` / OP Stack simulation config key** not confirmed — the feature is documented in prose ("OP Stack and Base simulation") but I did not verify the configuration syntax.
- **EIP-7843 (SLOTNUM)** appears in a Hardhat release note as experimental Amsterdam support; its inclusion status in any network upgrade was not verified in this shard, and Glamsterdam itself has not shipped.
- Whether Foundry's EDR-equivalent (revm) and Hardhat's EDR share code was not checked; do not claim they do.

