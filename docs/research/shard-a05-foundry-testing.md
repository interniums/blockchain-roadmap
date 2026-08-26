# Shard A05 — Track 05: Foundry core and testing

Research shard for a blockchain learning system. Raw curriculum material, not lesson prose.
Compiled 25 August 2026.

## Status log
- [x] 05.1 — forge/cast/anvil/chisel: tooling, project layout, remappings, foundry.toml profiles, foundryup install/pin
- [x] 05.2 — unit testing: naming conventions, setUp semantics, cheatcode families, common cheatcode mistakes
- [x] 05.3 — fuzzing: stateless property fuzzing, bound vs assume, fuzz run configuration, counterexamples
- [x] 05.5 — fork testing: forking mainnet, fork caching, real protocol state, block pinning, RPC cost/rate limits

---

## 05.1 — forge / cast / anvil / chisel: tools, layout, remappings, profiles, foundryup

### Concepts
- foundry-toolchain — Foundry is a Rust-native EVM toolchain of four binaries (forge, cast, anvil, chisel) installed and version-managed together by foundryup. | requires: [] | contrasts: [hardhat-toolchain]
- forge-role — forge is the build-and-test driver: it compiles Solidity, runs tests written in Solidity, formats, and produces gas/coverage reports. | requires: [foundry-toolchain] | contrasts: [cast-role, anvil-role, chisel-role]
- cast-role — cast is a stateless CLI for talking to a chain and encoding/decoding data: calls, sends, storage reads, selector lookups, ABI encode/decode, tx replay traces. | requires: [foundry-toolchain] | contrasts: [forge-role]
- anvil-role — anvil is a local EVM node that instant-mines, funds ten deterministic dev accounts, and exposes a non-standard RPC namespace for state manipulation. | requires: [foundry-toolchain] | contrasts: [forge-role, fork-mode-in-tests]
- chisel-role — chisel is a Solidity REPL for evaluating snippets and inspecting expression results without creating a project or writing a test. | requires: [foundry-toolchain] | contrasts: [forge-role]
- tests-in-solidity — Foundry's defining choice is that tests are Solidity contracts run inside the EVM, so no JS/TS test harness or RPC round-trip sits between the test and the code under test. | requires: [forge-role] | contrasts: [hardhat-toolchain]
- foundry-project-layout — The conventional project is src/ (contracts), test/ (*.t.sol), script/ (*.s.sol), lib/ (dependencies), with generated out/ (artifacts), cache/ and broadcast/ (deployment records). | requires: [forge-role] | contrasts: []
- remappings — A remapping rewrites an import prefix to a filesystem path (e.g. `@openzeppelin/=lib/openzeppelin-contracts/`) so Solidity imports do not encode the vendoring layout. | requires: [foundry-project-layout] | contrasts: [npm-module-resolution]
- remapping-resolution-order — Remappings come from three places at once: auto-detected lib/ contents (auto_detect_remappings, default true), an optional remappings.txt, and the `remappings` key in foundry.toml; `forge remappings` prints the resolved set. | requires: [remappings, foundry-toml] | contrasts: []
- foundry-toml — foundry.toml is the single config file, discovered by walking up from the cwd to the filesystem root, with ~/.foundry/foundry.toml as a global fallback and FOUNDRY_CONFIG to override the search. | requires: [foundry-project-layout] | contrasts: []
- config-precedence — Resolution order is built-in defaults, then foundry.toml, then FOUNDRY_/DAPP_ environment variables (highest); `forge config` prints the fully merged result. | requires: [foundry-toml] | contrasts: []
- foundry-profiles — Every config lives under a profile; `[profile.default]` is the base and every other profile inherits from it, selected at runtime with FOUNDRY_PROFILE. | requires: [foundry-toml] | contrasts: [config-precedence]
- profile-use-cases — Profiles exist to make the same repo cheap locally and thorough in CI: a low optimizer/low fuzz-run default profile plus a `ci` profile with more fuzz runs and via_ir enabled. | requires: [foundry-profiles] | contrasts: []
- solc-pinning — Setting `solc` (or solc_version) in foundry.toml disables version auto-detection and forces one compiler for the whole project, which is what makes builds reproducible across machines. | requires: [foundry-toml] | contrasts: [solc-autodetect]
- evm-version-config — `evm_version` selects the target hardfork ruleset for compilation and for the test EVM, and must be pinned deliberately when deploying to chains behind mainnet. | requires: [foundry-toml] | contrasts: [solc-pinning]
- dependency-management-choice — Foundry supports git-submodule dependencies (`forge install`, vendored under lib/) and the Soldeer registry (`forge soldeer install`); submodules stay the default and produce the lib/-shaped remappings. | requires: [remappings] | contrasts: [npm-module-resolution]
- foundryup-channels — foundryup defaults to the latest *stable* release; nightlies and exact versions are opt-in via `foundryup --install <nightly|1.x.y|nightly-<sha>>`, and `--branch`/`--commit` build from source. | requires: [foundry-toolchain] | contrasts: [rolling-nightly-only]
- toolchain-pinning-in-ci — Because cheatcode behaviour and default config change between versions, CI should install one explicit Foundry version rather than "latest", the same way solc is pinned. | requires: [foundryup-channels, solc-pinning] | contrasts: []

### Primary sources
- [Foundry — Installation](https://getfoundry.sh/introduction/installation) — tier: canonical-docs — published: 2026-08 (living) — authoritative foundryup flags: `--install <version|nightly|nightly-sha>`, `--branch`, install root ~/.foundry, FOUNDRY_DIR override.
- [Foundry — Config Overview](https://getfoundry.sh/config/reference/overview) — tier: canonical-docs — published: 2026-08 (living) — foundry.toml discovery walk-up, ~/.foundry/foundry.toml global, FOUNDRY_CONFIG, precedence (defaults < file < FOUNDRY_/DAPP_ env), profile inheritance from default, FOUNDRY_PROFILE, `forge config`.
- [Foundry — Solidity compiler config reference](https://www.getfoundry.sh/config/reference/solidity-compiler) — tier: canonical-docs — published: 2026-08 (living) — `solc`/auto-detect, `evm_version` pinning advice, optimizer and via_ir keys, `auto_detect_remappings` default true and empty `remappings` default.
- [Foundry — Dependencies](https://www.getfoundry.sh/projects/dependencies) — tier: canonical-docs — published: 2026-08 (living) — git submodules vs Soldeer, how lib/ maps to remappings.
- [Foundry v1.0 migration guide](https://book.getfoundry.sh/guides/v1.0-migration) — tier: canonical-docs — published: 2025-02 — the break point where Foundry moved from nightly-only to versioned stable releases; still the reference for behaviour that changed under people's feet.
- [foundry-rs/foundry releases](https://github.com/foundry-rs/foundry/releases) — tier: canonical-docs — published: 2026-08 — nightly builds are cut daily (nightlies observed for every day 2026-08-15 through 2026-08-25); use to resolve an exact pin.
- [issue #5258 — default to remappings specified in foundry.toml](https://github.com/foundry-rs/foundry/issues/5258) — tier: primary-analysis — published: 2023 (long-lived) — documents the auto-detect vs explicit-remapping tension students actually hit.

### Current state (Aug 2026)
- Docs have MOVED: the canonical site is `getfoundry.sh` (v2 docs). `book.getfoundry.sh` still resolves for some legacy guides but most tutorials/blog posts link to dead or stale book URLs. Anything teaching "read the Foundry Book at book.getfoundry.sh" needs updating.
- Since Foundry v1.0 (Feb 2025) there is a real stable channel. Before that, every Foundry install was a nightly and "pin your toolchain" was impossible in practice. Teaching material written pre-2025 assumes nightly-only.
- Nightlies are cut daily and are still where new cheatcodes land first; observed nightly tags include 2026-08-25.
- `forge soldeer` ships in-tree as a registry-based alternative to git submodules; submodules remain the default and what almost all public repos use.
- Version pin UNRESOLVED: the shared baseline says stable v1.5.1 (supporting solc 0.8.31) with nightly reporting 1.8.0-nightly. I could confirm daily nightlies exist through 2026-08-25 but could NOT confirm the current stable tag from the releases/tags pages (they render nightlies only). Resolve with `foundryup --list` / `forge --version` on a real machine before publishing a number.
- Practical consequence if the baseline pin is right: solc 0.8.36 (Jul 2026) may be NEWER than what the current stable forge will download; a project pinning `solc = "0.8.36"` might need a nightly Foundry. Verify before teaching.

### Misconceptions
- Belief: forge, cast, anvil and chisel are separate projects you install separately. | Reality: one toolchain, one installer; foundryup installs and versions all four together. | Why: they have distinct names and distinct docs sections. | Source: https://getfoundry.sh/introduction/installation
- Belief: `foundryup` gives you the newest code. | Reality: bare `foundryup` installs the latest *stable*; the newest code is `foundryup --install nightly`. | Why: pre-v1.0 Foundry was nightly-only, so the old mental model was "foundryup == latest master". | Source: https://getfoundry.sh/introduction/installation
- Belief: remappings live in remappings.txt. | Reality: they can come from auto-detection of lib/, remappings.txt, or foundry.toml, merged; `forge remappings` shows what actually applies. | Why: remappings.txt is the dapptools inheritance and is what editors/LSPs read. | Source: https://www.getfoundry.sh/config/reference/solidity-compiler
- Belief: a profile is an isolated config block. | Reality: non-default profiles INHERIT `[profile.default]`, so a `ci` profile only needs the deltas — and silently picks up default changes. | Why: TOML tables look independent. | Source: https://getfoundry.sh/config/reference/overview
- Belief: settings in foundry.toml win. | Reality: `FOUNDRY_*`/`DAPP_*` environment variables override the file, which is how CI images silently change behaviour. | Why: config files usually beat defaults, so people assume they beat everything. | Source: https://getfoundry.sh/config/reference/overview
- Belief: not pinning solc is fine because Foundry auto-detects. | Reality: auto-detect resolves per-file from pragmas and can pick a different compiler on a different machine, changing bytecode and gas. | Why: auto-detect is the default and usually "works". | Source: https://www.getfoundry.sh/config/reference/solidity-compiler

### Practice ideas
- kind: measure — Run `forge config` in a fresh `forge init` project, then re-run with `FOUNDRY_PROFILE=ci` and with `FOUNDRY_OPTIMIZER_RUNS=1000000` set in the shell. — Acceptance: learner produces a three-column diff and can state which layer won for each changed key.
- kind: break — Delete the `remappings` key and set `auto_detect_remappings = false`, then rebuild a project that imports OpenZeppelin. — Acceptance: build fails with a source-not-found error, and the learner fixes it by writing the minimal explicit remapping (not by re-enabling auto-detect).
- kind: implement — Add a `[profile.ci]` that raises optimizer runs and fuzz runs and enables via_ir, and a GitHub Action that runs `FOUNDRY_PROFILE=ci forge test` with an exact `foundryup --install <version>`. — Acceptance: CI log shows the pinned version string and the ci-profile fuzz run count, not the defaults.
- kind: read — Open `out/<Contract>.sol/<Contract>.json` and locate the compiler version, settings hash, and the ABI. — Acceptance: learner can explain why changing optimizer runs invalidates cache/ and changes deployed bytecode.
- kind: implement — Use chisel to compute the same expression three ways (`type(uint256).max`, `keccak256(abi.encodePacked("a"))`, an unchecked overflow) and confirm against `cast` equivalents (`cast max-uint`, `cast keccak`). — Acceptance: outputs agree; learner articulates when a REPL beats writing a throwaway test.

### Visual opportunities
- Config resolution waterfall: defaults -> ~/.foundry/foundry.toml -> nearest foundry.toml walking up -> selected profile (inheriting default) -> FOUNDRY_*/DAPP_* env, with a worked example key changing value at each step.
- Four-quadrant tool map: forge (build/test, in-process EVM) / cast (talk to a chain, stateless) / anvil (be a chain) / chisel (evaluate an expression), annotated with "does it need an RPC?" and "does it hold state?".
- Import-to-file resolution: a Solidity `import "@openzeppelin/contracts/token/ERC20/ERC20.sol"` traced through the merged remapping set down to lib/openzeppelin-contracts/contracts/....
- Project-tree diagram distinguishing committed (src, test, script, foundry.toml, lib as submodule pointers) from generated (out, cache, broadcast).

### Gaps & uncertainties
- Exact current STABLE Foundry version is UNVERIFIED. The GitHub releases and tags pages returned only nightly tags (plus v1.4.0-rc2/rc3 from Oct 2025). The baseline's "v1.5.1 stable" is plausible but I could not source it; do not print a stable version number without checking `foundryup --list` on a machine.
- Which solc versions the current stable forge can download is therefore also unverified. The baseline claim "v1.5.1 supports solc 0.8.31" conflicts with solc 0.8.36 being current (Jul 2026); flag this rather than resolving it.
- EVM version naming for post-Fusaka targets: I did not verify the exact `evm_version` string Foundry accepts for the Fusaka ruleset (likely "osaka") or for Glamsterdam ("amsterdam", which solc 0.8.36 reportedly added). Confirm against the solidity-compiler config reference before teaching a literal string.
- `foundryup --list` / per-project toolchain pinning (a `.foundryrc`-style file) is NOT documented on the installation page I read. If a per-project pin mechanism exists in 2026, it needs separate confirmation; otherwise the honest advice is "pin in CI, document in README".
- Soldeer's adoption level vs git submodules in mid-2026 is unmeasured here; I only confirmed it exists as a first-class subcommand.
---

## 05.2 — Unit testing: naming, setUp semantics, cheatcode families, cheatcode mistakes

### Concepts
- test-discovery-by-prefix — forge discovers tests by FUNCTION-NAME PREFIX, not annotations: `test`/`test_` (unit), `testFuzz` (fuzzed), `invariant*`/`statefulFuzz*` (stateful), `table*` (table-driven), `check*`/`prove*` (symbolic, only under `--symbolic`). | requires: [tests-in-solidity] | contrasts: [annotation-based-test-discovery]
- test-contract-is-the-fixture — A test file is a contract inheriting forge-std `Test`; its state variables are the fixture and its public/external prefixed functions are the cases. | requires: [test-discovery-by-prefix] | contrasts: []
- setup-runs-per-test — `setUp()` runs before EACH test function, and state changes made by one test are not visible to the next; there is no shared mutable state between cases. | requires: [test-contract-is-the-fixture] | contrasts: [jest-beforeall]
- setup-snapshot-model — Isolation is achieved by re-establishing the post-setUp state for every case, so an expensive setUp is paid once conceptually but its effects are what each test starts from — including any prank or warp left active in setUp. | requires: [setup-runs-per-test] | contrasts: []
- call-isolation-default — Forge runs with call isolation ON by default: each top-level external call from a test executes as a separate transaction in a separate EVM context, which is what makes gas numbers realistic; disable with `--no-isolate` or `isolate = false`. | requires: [setup-runs-per-test] | contrasts: [single-context-execution]
- test-filtering — `--match-test`, `--match-contract`, `--match-path` (and their `--no-match-*` inverses) select which tests run; they are the fast inner loop, not `-vvvv` on everything. | requires: [test-discovery-by-prefix] | contrasts: []
- vm-cheatcode-mechanism — Cheatcodes are ordinary CALLs to the magic address 0x7109709ECfa91a80626fF3989D68f67F5b1DD12D that the Foundry EVM intercepts; `vm` is just a typed interface to that address. | requires: [tests-in-solidity] | contrasts: [rpc-based-test-helpers]
- cheatcode-families — Cheatcodes group into environment (warp/roll/prank/deal/store), assertions (expectRevert/expectEmit/expectCall), fuzzer (assume/bound), forking, external (ffi/env/JSON/TOML), signing, files, RPC, state snapshots, and utilities (label/addr/makeAddr). | requires: [vm-cheatcode-mechanism] | contrasts: []
- prank-scope — `vm.prank(x)` overrides msg.sender for exactly the NEXT external call; `vm.startPrank(x)` overrides it for all subsequent calls until `vm.stopPrank()`. | requires: [cheatcode-families] | contrasts: [start-prank-scope]
- prank-tx-origin-form — The two-argument `vm.prank(sender, origin)` sets tx.origin as well, which is the only way to test code that compares msg.sender to tx.origin. | requires: [prank-scope] | contrasts: [eip-7702-origin-assumption]
- prank-delegatecall-form — A boolean `delegateCall` variant lets a prank apply to delegate calls, but a delegate call cannot be pranked from an EOA — the prank source must be a contract. | requires: [prank-scope] | contrasts: []
- deal-cheatcode — `vm.deal(addr, amount)` SETS (not adds) an address's ETH balance; forge-std's `deal(token, to, amount)` writes an ERC-20 balance by finding and overwriting the storage slot. | requires: [cheatcode-families] | contrasts: [erc20-transfer-funding]
- warp-and-roll — `vm.warp(ts)` sets block.timestamp and `vm.roll(n)` sets block.number; they are INDEPENDENT, so advancing blocks does not advance time and vice versa. | requires: [cheatcode-families] | contrasts: [real-chain-time-block-coupling]
- expect-revert-next-call — `vm.expectRevert` applies to the next call only, and by default only to EXTERNAL calls; internal reverts need `/// forge-config: default.allow_internal_expect_revert = true`. | requires: [cheatcode-families] | contrasts: [try-catch-testing]
- expect-revert-argument-nesting — In `target.f(other.g())` the "next call" is `other.g()`, not `f`, so the assertion silently attaches to the wrong call unless the inner call is hoisted to a local variable. | requires: [expect-revert-next-call] | contrasts: []
- expect-revert-selector-vs-data — Overloads match a bare revert, a `bytes4` selector, full ABI-encoded revert data, a specific reverter address, or a `uint64` count (count 0 asserts NO revert); `expectPartialRevert` matches only the selector of a parameterised custom error. | requires: [expect-revert-next-call] | contrasts: []
- expect-emit-ordering — `vm.expectEmit(...)` must be followed by an `emit` of the expected event and then the call under test; expected events must appear in the same relative order as actual ones (skipping allowed, reordering not). | requires: [cheatcode-families] | contrasts: []
- expect-emit-topic-flags — The four booleans are checkTopic1/2/3 (the indexed params) and checkData (the non-indexed body); topic0, the event signature, is ALWAYS checked, and an address overload pins the emitter. | requires: [expect-emit-ordering] | contrasts: []
- low-level-call-status-trap — When `expectRevert` wraps a low-level `.call()`, the returned `success` boolean reports whether the EXPECTATION was met, not whether the call reverted — so `assertFalse(success)` is wrong. | requires: [expect-revert-next-call] | contrasts: []
- cheatcode-address-in-fuzzing — A fuzzed address can land on the cheatcode address 0x7109...D12D and produce nonsense; exclude it explicitly. | requires: [vm-cheatcode-mechanism] | contrasts: []

### Primary sources
- [Foundry — Cheatcodes overview](https://getfoundry.sh/forge/tests/cheatcodes) — tier: canonical-docs — published: 2026-08 (living) — cheatcode address 0x7109709ECfa91a80626fF3989D68f67F5b1DD12D, the ten families, and the explicit warning to `vm.assume` fuzzed addresses away from the cheatcode address.
- [Foundry — Writing tests](https://getfoundry.sh/forge/tests/writing-tests) — tier: canonical-docs — published: 2026-08 (living) — recognised prefixes (test/test_, testFuzz, invariant*/statefulFuzz*, table*, check*/prove* under --symbolic), setUp runs before each test, isolation default, --match-* filters.
- [Foundry — vm.prank reference](https://getfoundry.sh/reference/cheatcodes/prank) — tier: canonical-docs — published: 2026-08 (living) — next-call vs until-stopPrank scope, (sender, origin) and (sender, delegateCall) overloads, "delegate calls cannot be pranked from an EOA".
- [Foundry — vm.expectRevert reference](https://getfoundry.sh/reference/cheatcodes/expect-revert) — tier: canonical-docs — published: 2026-08 (living) — next-call semantics, the nested-argument gotcha, allow_internal_expect_revert config comment, count overload, low-level call status trap, expectPartialRevert.
- [Foundry — vm.expectEmit reference](https://getfoundry.sh/reference/cheatcodes/expect-emit) — tier: canonical-docs — published: 2026-08 (living) — four overloads, topic0 always checked, ordering rules, caught-revert leakage gotcha.
- [forge-std (Vm.sol interface)](https://github.com/foundry-rs/forge-std) — tier: canonical-docs — published: 2026 (living) — the authoritative Solidity signatures for every cheatcode; the docs site is generated from it.

### Current state (Aug 2026)
- `testFail*` is GONE from the documented prefix list. The modern idiom is `test_RevertWhen_<Condition>` plus an explicit `vm.expectRevert(SomeError.selector)`. Any tutorial teaching `testFail` is teaching a pattern that hid *which* revert happened and is no longer the documented path.
- Call isolation is ON by default (`isolate = true` behaviour), so each top-level external call is metered as its own transaction. Gas numbers printed by modern forge are therefore NOT comparable to numbers from pre-isolation-era blog posts, and warm/cold storage accounting differs.
- `table*` test functions (data-driven cases from a dataset) are a newer documented prefix worth mentioning alongside fuzz/invariant.
- Symbolic execution prefixes `check*`/`prove*` exist but only run under `--symbolic`, i.e. Foundry now ships a symbolic path in-tree rather than requiring halmos as an external tool. (Depth of that integration not verified here.)
- `vm.expectRevert` gained a reverter-address overload and a `uint64 count` overload; `count = 0` is the documented way to assert something does NOT revert.
- Internal-call expectRevert now requires an opt-in config comment (`/// forge-config: default.allow_internal_expect_revert = true`) — older material claiming "expectRevert just works on internal functions" is wrong.
- EIP-7702 interaction (baseline): since a delegated EOA can have code, `vm.prank(sender, sender)` no longer proves "caller is an EOA" in tests any more than it does on chain. Tests asserting `msg.sender == tx.origin` as an EOA check are testing a broken invariant.

### Misconceptions
- Belief: `setUp()` runs once for the whole test contract. | Reality: it runs before every test function; tests cannot share mutated state. | Why: JS/JUnit `beforeAll` habits. | Source: https://getfoundry.sh/forge/tests/writing-tests
- Belief: `vm.startPrank` and `vm.prank` differ only in style. | Reality: `prank` covers exactly one external call and then expires; `startPrank` covers everything until `stopPrank`, so a forgotten `stopPrank` silently changes msg.sender for later assertions. | Why: both "set msg.sender". | Source: https://getfoundry.sh/reference/cheatcodes/prank
- Belief: `vm.prank` also changes tx.origin. | Reality: only the two-argument overload does; the single-argument form leaves tx.origin as the default test origin. | Why: on a real chain an EOA sets both. | Source: https://getfoundry.sh/reference/cheatcodes/prank
- Belief: `vm.expectRevert(); target.f(other.g());` tests that `f` reverts. | Reality: the next call is `other.g()`; the expectation binds there. | Why: people read the statement outside-in, the EVM evaluates arguments first. | Source: https://getfoundry.sh/reference/cheatcodes/expect-revert
- Belief: after `vm.expectRevert()` around a low-level call, `success == false` confirms the revert. | Reality: `success` reports whether the expectation was satisfied, so it comes back TRUE; asserting false makes the test fail for the wrong reason. | Why: normally `.call` returns the callee's success. | Source: https://getfoundry.sh/reference/cheatcodes/expect-revert
- Belief: `vm.expectRevert` catches reverts anywhere inside the next call tree. | Reality: it matches the revert that propagates out of the next call; internal-function reverts need `allow_internal_expect_revert`, and a revert caught by try/catch inside is not observed. | Why: it reads like a try/catch. | Source: https://getfoundry.sh/reference/cheatcodes/expect-revert
- Belief: `vm.expectEmit(true, true, true, true)` checks everything including the emitter. | Reality: the booleans cover topics 1-3 and the data; the emitter is only checked in the overload that takes an address. So a *different contract* emitting an identical event can satisfy the assertion. | Why: "all true" reads as "strict". | Source: https://getfoundry.sh/reference/cheatcodes/expect-emit
- Belief: you can register several `expectEmit`s up front and let the call satisfy them in any order. | Reality: expected events must appear in the actual order (skips allowed, reversals not), and an intervening unrelated call can consume or void the expectation. | Why: assertions usually commute. | Source: https://getfoundry.sh/reference/cheatcodes/expect-emit
- Belief: `vm.deal(alice, 1 ether)` tops Alice up by 1 ether. | Reality: it SETS the balance to 1 ether, discarding what was there. | Why: "deal" sounds additive. | Source: https://getfoundry.sh/forge/tests/cheatcodes
- Belief: `vm.roll(block.number + 100)` also moves time forward. | Reality: warp and roll are independent; rolling 100 blocks with no warp leaves block.timestamp unchanged, which breaks any test of time-based accrual. | Why: on a real chain blocks imply ~12s each. | Source: https://getfoundry.sh/forge/tests/cheatcodes
- Belief: gas numbers in the gas report match what the old Foundry blog posts show. | Reality: call isolation is on by default and changes gas accounting; comparisons across Foundry versions are invalid. | Why: gas feels like a property of the contract, not the harness. | Source: https://getfoundry.sh/forge/tests/writing-tests

### Practice ideas
- kind: break — Write a test with `vm.startPrank(alice)` and no `vm.stopPrank()`, followed by an assertion that only passes when msg.sender is the test contract. — Acceptance: learner explains the failure from the `-vvvv` trace by pointing at the caller column, then fixes it two ways (stopPrank, or single-shot prank).
- kind: fix — Given `vm.expectRevert(Vault.InsufficientBalance.selector); vault.withdraw(token.balanceOf(user));`, make the test actually assert on `withdraw`. — Acceptance: hoisting the inner call to a local variable turns a passing-for-the-wrong-reason test into a genuine one; learner can demonstrate the original passed even when `withdraw` was correct.
- kind: implement — Write an ERC-20 transfer test using `vm.expectEmit` with the emitter overload, then deploy a decoy contract that emits an identical `Transfer` event and show the non-emitter version of the assertion passes against the wrong contract. — Acceptance: two tests, one strict and one demonstrably fooled.
- kind: measure — Run a storage-writing test with and without `--no-isolate` and diff the gas report. — Acceptance: learner can explain the delta in terms of warm vs cold access and separate transaction contexts.
- kind: write — Convert a legacy `testFail_Withdraw()` into `test_RevertWhen_CallerNotOwner()` with a specific custom-error selector. — Acceptance: the new test fails if the contract starts reverting with a *different* error; the old one did not.
- kind: implement — Test a linear vesting cliff using `vm.warp` only, then repeat using `vm.roll` only, and observe which one moves the accrual. — Acceptance: learner states which of block.timestamp/block.number the contract depends on before running it, and is right.

### Visual opportunities
- Timeline strip for prank scope: a row of external calls with `vm.prank` shading exactly one cell versus `vm.startPrank`/`stopPrank` shading a span, with the msg.sender value annotated per call.
- Evaluation-order diagram for `target.f(other.g())`: argument evaluation happens first, so the "next call" arrow points at `g` — the single clearest way to teach the expectRevert nesting trap.
- Event-matching lane diagram: expected-event queue vs actual-log stream, showing an allowed skip, a disallowed reversal, and topic0/topic1-3/data columns coloured by which boolean governs them.
- Per-test lifecycle: constructor -> setUp -> test_A -> revert to post-setUp state -> setUp -> test_B, making it obvious that setUp's leftover pranks/warps are inherited but test_A's are not.
- Cheatcode call flow: test contract -> CALL to 0x7109...D12D -> intercepted by Foundry's EVM (never touches real state) -> mutated environment.

### Gaps & uncertainties
- Whether a prank applies to *internal* function calls is NOT stated in the prank reference I read; the wording ("next call", "subsequent calls") implies external only. Do not teach a definite answer without checking Vm.sol / a live experiment.
- The exact interaction of `vm.expectRevert` with an active `vm.startPrank` (ordering, whether the prank is consumed) is not documented on the expectRevert page beyond "calls to other cheatcodes before the reverting call are ignored". Verify empirically before writing a rule.
- `table*` test functions and the `--symbolic` `check*`/`prove*` path are documented as prefixes but I did not read their reference pages; scope, syntax and maturity unverified.
- `deal` for ERC-20 (the forge-std StdCheats helper that overwrites a balance slot) is distinct from the `vm.deal` cheatcode for ETH. I did not re-verify the current forge-std signature or its behaviour with non-standard balance layouts (rebasing tokens, proxies) — flag as needing a source.
- I did not confirm the default `isolate` value from the config reference directly; the writing-tests page describes isolation as the default and names `--no-isolate`/`isolate = false` as the opt-out. Confirm in the config reference before stating it as a config default.
- The `allow_internal_expect_revert` inline config-comment syntax was read from the docs summary; verify the exact comment string against a live run before putting it in a lesson.
---

## 05.3 — Fuzzing: stateless property testing, bound vs assume, configuration, counterexamples

### Concepts
- property-vs-example-testing — A fuzz test asserts a PROPERTY that must hold for all inputs, whereas a unit test asserts an outcome for one hand-picked input; the fuzzer supplies the inputs. | requires: [test-discovery-by-prefix] | contrasts: [example-based-unit-test]
- stateless-fuzzing — Stateless (`testFuzz*`) fuzzing calls ONE function with randomised arguments from a fresh post-setUp state each run; it cannot find bugs that need a particular sequence of transactions. | requires: [property-vs-example-testing, setup-runs-per-test] | contrasts: [stateful-invariant-fuzzing]
- fuzz-parameters-are-the-trigger — Any test function that takes parameters is fuzzed; the `testFuzz` prefix is a naming convention for humans, the parameter list is what actually makes forge fuzz it. | requires: [stateless-fuzzing] | contrasts: [test-discovery-by-prefix]
- fuzz-runs-default — The default is 256 runs per fuzz test (`[fuzz] runs = 256`); 256 random samples over a 2^256 input space is a smoke test, not a proof. | requires: [stateless-fuzzing] | contrasts: [formal-verification]
- fuzz-output-line — A passing fuzz test prints `(runs: N, μ: mean-gas, ~: median-gas)`; μ and ~ are gas statistics across runs, not correctness information. | requires: [fuzz-runs-default] | contrasts: []
- fuzz-dictionary — Foundry does not sample uniformly: a dictionary of "interesting" values (boundary numbers, values scraped from contract storage and PUSH bytes in the bytecode) is mixed in, weighted by `dictionary_weight` (default 40) with `include_storage` and `include_push_bytes` both true by default. | requires: [stateless-fuzzing] | contrasts: [uniform-random-sampling]
- vm-assume-rejection — `vm.assume(cond)` DISCARDS the current run when cond is false and starts a new one; it filters by retrying, so it costs runs. | requires: [stateless-fuzzing] | contrasts: [bound-remapping]
- max-test-rejects — Rejections are capped by `max_test_rejects` (default 65536) across the whole test; exceeding it fails the test with a rejection error rather than a property violation. | requires: [vm-assume-rejection] | contrasts: []
- bound-remapping — `bound(x, min, max)` from forge-std MAPS any input into the range instead of rejecting it, so every generated value produces a real run. | requires: [stateless-fuzzing] | contrasts: [vm-assume-rejection]
- bound-preferred-over-assume — The docs explicitly recommend `bound` (or modulo) for range constraints and reserve `assume` for narrow exclusions, because rejection sampling wastes runs and can abort the test. | requires: [bound-remapping, vm-assume-rejection] | contrasts: []
- assume-legitimate-uses — `assume` remains correct for excluding a handful of specific values — address(0), the cheatcode address 0x7109...D12D, the test contract itself, already-deployed addresses — where the rejection rate is negligible. | requires: [vm-assume-rejection, cheatcode-address-in-fuzzing] | contrasts: [bound-preferred-over-assume]
- naive-bound-bias — Hand-rolled clamping (`if (x > max) x = max;`) piles probability mass on the endpoint; `bound` distributes across the range, and modulo is biased but cheap. | requires: [bound-remapping] | contrasts: []
- overconstraining-hazard — Every assume/bound narrows the search space, so an aggressively constrained fuzz test can pass while never exercising the region where the bug lives; constraints are part of what a reviewer must check. | requires: [bound-remapping, vm-assume-rejection] | contrasts: []
- fuzz-fixtures — Fixtures let you force specific values into a fuzzed parameter's candidate set, so known-nasty inputs are always tried alongside random ones. | requires: [fuzz-dictionary] | contrasts: []
- fuzz-seed-reproducibility — Fuzzing is nondeterministic across runs unless `[fuzz] seed` is set; pinning a seed makes CI reproducible but also freezes the search, so it trades flakiness for coverage. | requires: [fuzz-runs-default] | contrasts: []
- failure-persistence — Failing fuzz inputs are persisted (default `./cache/fuzz`, file `failures`) and replayed on later runs, so a fixed bug stays regression-tested and a "flaky" failure is reproducible locally. | requires: [fuzz-seed-reproducibility] | contrasts: []
- counterexample-reading — A failure prints the concrete arguments (the counterexample) plus the assertion that broke; the workflow is to copy those args into a deterministic unit test, then fix. | requires: [stateless-fuzzing] | contrasts: []
- inline-fuzz-config — Per-test overrides use a `/// forge-config: <profile>.fuzz.runs = N` comment above the function, with keys runs, max-test-rejects, show-logs, inheriting everything else from the profile. | requires: [foundry-profiles, fuzz-runs-default] | contrasts: []

### Primary sources
- [Foundry — Testing config reference ([fuzz] / [invariant])](https://getfoundry.sh/config/reference/testing) — tier: canonical-docs — published: 2026-08 (living) — the authoritative default table: runs 256, max_test_rejects 65536, dictionary_weight 40, include_storage true, include_push_bytes true, failure_persist_dir ./cache/fuzz, failure_persist_file "failures", show_logs false; invariant depth 500, fail_on_revert false, shrink_run_limit 5000.
- [Foundry — vm.assume reference](https://getfoundry.sh/reference/cheatcodes/assume) — tier: canonical-docs — published: 2026-08 (living) — assume discards the run; broad checks "slow down tests significantly"; explicit recommendation to prefer `bound` or modulo for range constraints.
- [Foundry — In-line test configuration](https://www.getfoundry.sh/config/reference/inline-test-config) — tier: canonical-docs — published: 2026-08 (living) — `forge-config: ${PROFILE}.{fuzz|invariant}.${KEY}` comment syntax and the per-test key list.
- [Foundry — Fuzz testing guide](https://getfoundry.sh/forge/advanced-testing/fuzz-testing/) — tier: canonical-docs — published: 2026-08 (living) — runs/μ/~ output line, fixtures, counterexample reporting. NOTE: this page 404'd on direct fetch during this research; content above came via search snippets, treat page-level details as second-hand.
- [Foundry — Invariant testing](https://getfoundry.sh/forge/invariant-testing) — tier: canonical-docs — published: 2026-08 (living) — the stateful counterpart; needed to explain what stateless fuzzing cannot reach.
- [forge-std StdUtils.bound](https://github.com/foundry-rs/forge-std) — tier: canonical-docs — published: 2026 (living) — the actual `bound` implementation; read it to see how it maps rather than clamps.

### Current state (Aug 2026)
- Defaults confirmed for Aug 2026: fuzz runs 256, max_test_rejects 65536, dictionary_weight 40, include_storage true, include_push_bytes true, show_logs false, failures persisted to ./cache/fuzz/failures.
- `bound` over `assume` is now an explicit documented recommendation, not folklore. Material that teaches `vm.assume(x > 0 && x < 1e18)` as the standard idiom is teaching the discouraged pattern.
- Failure persistence + replay is default-on, which changes the workflow taught pre-2023: you no longer have to manually copy a counterexample into a unit test to keep it covered (though doing so is still better practice for readability).
- Per-test inline `forge-config` comments are profile-scoped, so `/// forge-config: default.fuzz.runs = 10000` does nothing when CI runs with FOUNDRY_PROFILE=ci. This is a real and easy-to-miss trap.
- Foundry ships stateless fuzzing, stateful/invariant fuzzing, table tests, and a `--symbolic` path (`check*`/`prove*`) in one binary; the old "use Echidna for fuzzing, Foundry for units" split is much weaker in 2026, though Echidna/Medusa still differ in campaign style and corpus handling.
- Docs URL churn: several fuzz pages moved under `/forge/advanced-testing/...`; older `book.getfoundry.sh/forge/fuzz-testing` links still float around and some new-site paths 404. Verify every link before shipping a lesson.

### Misconceptions
- Belief: a passing fuzz test proves the property. | Reality: 256 pseudo-random samples over a 2^256 space; passing means "no counterexample found at this budget/seed". | Why: the output says PASS with no confidence qualifier. | Source: https://getfoundry.sh/config/reference/testing
- Belief: `vm.assume` is the way to constrain a fuzzed input to a range. | Reality: the docs recommend `bound`/modulo for ranges and assume only for narrow exclusions, because assume rejects and re-rolls. | Why: `assume` reads like a precondition and is the first cheatcode people meet. | Source: https://getfoundry.sh/reference/cheatcodes/assume
- Belief: an assume that rejects a lot just makes the test slower. | Reality: past `max_test_rejects` (65536) the test FAILS — reported as a rejection error, which reads like a bug in your contract. | Why: rejection is invisible in the passing case. | Source: https://getfoundry.sh/config/reference/testing
- Belief: `if (x > max) x = max;` is equivalent to bound. | Reality: clamping concentrates a large share of inputs exactly on `max` and never tests the interior distribution; bound maps across the range. | Why: both "keep x in range". | Source: https://github.com/foundry-rs/forge-std
- Belief: the fuzzer picks uniformly random values. | Reality: a weighted dictionary injects boundary values plus constants scraped from storage and the contract's PUSH bytes (dictionary_weight 40, include_storage/include_push_bytes true). | Why: "random input" is the textbook description of fuzzing. | Source: https://getfoundry.sh/config/reference/testing
- Belief: a fuzz test that passed in CI will pass again. | Reality: without a pinned `seed` each run draws fresh inputs, so fuzz failures legitimately appear on unchanged code — that is the fuzzer working, not flakiness to be suppressed. | Why: CI is expected to be deterministic. | Source: https://getfoundry.sh/config/reference/testing
- Belief: `/// forge-config: default.fuzz.runs = 10000` raises runs everywhere. | Reality: it applies to the `default` profile only; a `ci` profile run ignores it. | Why: `default` reads as "always". | Source: https://www.getfoundry.sh/config/reference/inline-test-config
- Belief: stateless fuzzing would have caught the big protocol hacks. | Reality: most require an ordered multi-call sequence (deposit, manipulate, withdraw) across state; that is invariant/stateful territory, and stateless fuzz starts every run from the same post-setUp state. | Why: "fuzzing found it" is the headline, the kind of fuzzing is not. | Source: https://getfoundry.sh/forge/invariant-testing
- Belief: μ in the output tells you something about correctness. | Reality: μ and ~ are mean and median GAS across runs. | Why: Greek letters look statistical. | Source: https://getfoundry.sh/forge/advanced-testing/fuzz-testing/

### Practice ideas
- kind: measure — Write the same constraint two ways (`vm.assume(x >= 1 && x <= 100)` vs `x = bound(x, 1, 100)`) over a uint256 parameter and time `forge test` for both. — Acceptance: learner reports wall-clock and observed run counts, and can explain the assume version's rejection rate from the 1e-75-ish acceptance probability, or shows it hitting max_test_rejects.
- kind: break — Set `max_test_rejects = 100` and write an assume that rejects ~99% of inputs. — Acceptance: learner produces the rejection failure output and can distinguish it from a property violation at a glance.
- kind: implement — Fuzz an ERC-20-ish `transfer(address to, uint256 amount)` for the property "sum of balances is conserved", excluding only address(0), the token itself and the cheatcode address with assume, and bounding amount. — Acceptance: property holds; then introduce a deliberate rounding bug (e.g. a fee that truncates) and show the fuzzer produces a counterexample with concrete args.
- kind: fix — Take a failing fuzz counterexample, copy the args into a plain `test_` case, confirm it fails deterministically, fix the contract, and verify BOTH the unit test and the persisted `cache/fuzz/failures` replay pass. — Acceptance: deleting the cache file does not resurrect the failure.
- kind: measure — Run one fuzz test with three different `seed` values and record whether the bug is found each time. — Acceptance: learner can state, with numbers, that seed choice changes bug discovery and therefore that "passes on CI" is seed-conditional.
- kind: read — Read `bound` in forge-std StdUtils and describe how it maps out-of-range inputs. — Acceptance: learner can explain why bound is not just `min + x % (max - min + 1)` and where residual bias remains.

### Visual opportunities
- Rejection vs remapping: two funnels over the same input stream — `assume` drops non-matching samples (with a counter ticking toward max_test_rejects), `bound` bends every sample into the target interval. This single image carries the whole module.
- Input-space diagram: the full uint256 line, the region a property is actually tested over after constraints, and a bug sitting just outside it — the overconstraining hazard made visible.
- Dictionary composition bar: share of inputs from pure random vs boundary values vs storage-scraped vs PUSH-bytes constants, keyed to dictionary_weight = 40.
- Fuzz failure lifecycle: random run -> counterexample -> persisted to cache/fuzz/failures -> replayed first on every subsequent run -> promoted to a named unit test.
- Coverage ladder: unit test (one point) -> stateless fuzz (one call, many inputs) -> invariant fuzz (many calls, many inputs, depth 500) -> symbolic, with the class of bug each can and cannot reach.

### Gaps & uncertainties
- The fuzz-testing guide page at `/forge/advanced-testing/fuzz-testing/` returned 404 on direct fetch while appearing in search results. Details attributed to it (the exact runs/μ/~ format, fixture syntax such as a `fixture_` prefix or fixture storage arrays, and the exact counterexample output format) are from search snippets and were NOT read at source. Re-verify before quoting.
- Whether Foundry SHRINKS stateless fuzz counterexamples to a minimal failing input is unconfirmed. `shrink_run_limit = 5000` is documented under `[invariant]`; I found no equivalent documented for `[fuzz]`. Do not claim stateless shrinking without checking.
- Exact `bound` semantics (how it maps values outside the range, and how it treats min == max) were not read from source in this pass — the recommendation to prefer it is sourced, the implementation detail is not.
- Fixture mechanics (naming convention, supported types, interaction with the dictionary) are unverified.
- The relationship between `[fuzz] runs` and `[invariant] runs` inheritance is stated in the config table as "inherits from [fuzz] if unset" — worth a direct confirmation before teaching.
- No source found quantifying how often stateless fuzzing catches real bugs vs invariant testing; any such claim in a lesson would be unsupported.
---

## 05.5 — Fork testing: mainnet forks, caching, real protocol state, block pinning, RPC realities

### Concepts
- fork-testing-purpose — Fork testing runs your contracts against the REAL deployed state of a live chain, so integrations are tested against actual Uniswap/Aave/USDC bytecode and balances rather than hand-written mocks. | requires: [tests-in-solidity] | contrasts: [mock-based-integration-testing]
- lazy-state-fetch — A fork is not a download of the chain: the local EVM starts empty and fetches accounts, code and storage slots over RPC on first touch, caching them thereafter. | requires: [fork-testing-purpose] | contrasts: [full-node-sync]
- fork-mode-cli — Whole-suite forking: `forge test --fork-url <rpc> --fork-block-number <n>`, or `eth_rpc_url` / `fork_block_number` in foundry.toml — every test in the run sees the same forked state. | requires: [fork-testing-purpose] | contrasts: [fork-cheatcodes]
- fork-cheatcodes — Per-test forking: `vm.createFork(url[, block])` returns a fork id, `vm.selectFork(id)` activates one, `vm.createSelectFork(...)` does both, `vm.activeFork()` reports the current one. | requires: [fork-mode-cli] | contrasts: []
- multi-fork-testing — Multiple forks can coexist in one test with independent state, letting a single test compare or coordinate across chains (e.g. mainnet vs an L2) by switching the active fork. | requires: [fork-cheatcodes] | contrasts: [fork-mode-cli]
- fork-state-isolation — Each fork id carries its own state; switching forks switches the entire world, so a contract deployed while fork A was active does not exist under fork B. | requires: [multi-fork-testing] | contrasts: []
- make-persistent — `vm.makePersistent(addr)` marks accounts whose state survives fork switches; by default only the test contract and the caller are persistent. | requires: [fork-state-isolation] | contrasts: []
- create-select-fork-duplicates — `vm.createSelectFork` creates a NEW fork every call, so calling it twice with the same URL yields two independent forks each starting clean — reuse the returned id instead. | requires: [fork-cheatcodes] | contrasts: []
- roll-fork — `vm.rollFork(n)` moves a fork to another block; given a tx hash it rolls to that transaction's block and replays the transactions before it, which is how you reproduce state immediately preceding a specific on-chain event. | requires: [fork-cheatcodes] | contrasts: [warp-and-roll]
- vm-transact — `vm.transact(txHash)` executes a real historical transaction inside the fork, letting a test reproduce an exploit or a user's failing tx verbatim. | requires: [roll-fork] | contrasts: []
- block-pinning — Pinning `--fork-block-number` is what makes a fork test reproducible: unpinned forks track `latest`, so the same test runs against different state every hour and fails for reasons unrelated to your code. | requires: [fork-mode-cli] | contrasts: []
- fork-cache-keying — The RPC cache is keyed by chain id AND block number, so an unpinned ("latest") fork can essentially never hit cache — pinning is a performance and cost decision, not only a determinism one. | requires: [block-pinning, lazy-state-fetch] | contrasts: []
- fork-cache-location — Fetched fork data persists under `~/.foundry/cache/rpc/<chain>/<block>/`; deleting that tree forces a refetch and is the fix for stale or corrupt cache. | requires: [fork-cache-keying] | contrasts: [build-cache]
- storage-caching-config — Caching is controlled by `no_storage_caching` (disable entirely) and the `[rpc_storage_caching]` block (which chains and which endpoints); by default all chains are cached and only REMOTE endpoints are cached. | requires: [fork-cache-location] | contrasts: []
- rpc-endpoints-aliases — `[rpc_endpoints]` in foundry.toml maps aliases to URLs (with `${ENV_VAR}` interpolation), so tests and CI reference `mainnet` rather than embedding a keyed URL in source. | requires: [foundry-toml, fork-mode-cli] | contrasts: []
- archive-node-requirement — Reading state at a block older than a full node's retention window requires an ARCHIVE node; pinning to an old block against a pruned or free public endpoint fails with missing-trie-node style errors. | requires: [block-pinning] | contrasts: []
- rpc-cost-model — Fork tests are billed as many small state reads, not one request, so a broad forked suite can burn a free-tier compute-unit budget or trip 429 rate limits; the cache is the primary mitigation. | requires: [lazy-state-fetch, fork-cache-keying] | contrasts: []
- ci-cache-restore — Restoring `~/.foundry/cache/rpc` in CI, keyed on the pinned block, turns a fork suite from a per-run RPC bill into a near-offline run. | requires: [fork-cache-keying, rpc-cost-model] | contrasts: []
- fork-tests-are-slow — Even cached, forked tests are dramatically slower than local ones, so the practical pattern is a fast local unit/fuzz suite plus a small, separately-tagged forked integration suite. | requires: [rpc-cost-model, test-filtering] | contrasts: []

### Primary sources
- [Foundry — Fork testing](https://getfoundry.sh/forge/tests/fork-testing/) — tier: canonical-docs — published: 2026-08 (living) — both modes, `--fork-url`/`--fork-block-number`, eth_rpc_url/fork_block_number config keys, lazy RPC state fetch, multi-fork via createFork/selectFork, cache at ~/.foundry/cache/rpc/<chain>/<block>/, "pin to a specific block for reproducible tests".
- [Foundry — vm.createSelectFork](https://www.getfoundry.sh/reference/cheatcodes/create-select-fork) — tier: canonical-docs — published: 2026-08 (living) — each call creates an independent fork from a clean state; returns the fork id.
- [Foundry — vm.createFork](https://www.getfoundry.sh/reference/cheatcodes/create-fork) — tier: canonical-docs — published: 2026-08 (living) — fork id creation without activation.
- [Foundry — vm.rollFork](https://book.getfoundry.sh/cheatcodes/roll-fork) — tier: canonical-docs — published: 2026 (living) — sets block.number for a fork; with a tx hash, rolls to that tx's block and replays preceding transactions.
- [Foundry — vm.makePersistent](https://book.getfoundry.sh/cheatcodes/make-persistent) — tier: canonical-docs — published: 2026 (living) — persistent accounts across forks; only the test contract and caller are persistent by default.
- [Foundry — vm.transact](https://www.getfoundry.sh/reference/cheatcodes/transact) — tier: canonical-docs — published: 2026-08 (living) — execute a real historical transaction inside the fork.
- [Foundry — config reference (rpc_storage_caching / no_storage_caching)](https://www.getfoundry.sh/config/reference/overview) — tier: canonical-docs — published: 2026-08 (living) — no_storage_caching disables RPC block-data caching; [rpc_storage_caching] selects chains (all by default) and endpoints (remote only by default).
- [Foundry — Troubleshooting](https://www.getfoundry.sh/help/troubleshooting) — tier: canonical-docs — published: 2026-08 (living) — practical guidance including clearing the RPC cache.

### Current state (Aug 2026)
- Two forking modes coexist and are taught interchangeably in old material; the cheatcode API (createFork/selectFork/rollFork/makePersistent/transact) is the flexible one and the only way to do multi-chain in a single test.
- Cache path: the current docs say `~/.foundry/cache/rpc/<chain>/<block>/`. Older docs and search snippets say `$HOME/.foundry/cache/<chain id>/<block number>` (no `rpc/` segment). These CONFLICT — see gaps. Verify on a real machine before writing a CI cache key.
- Post-Fusaka (Dec 2025) forks of recent mainnet blocks run under the raised 60M block gas limit with a ~16.78M single-transaction cap (EIP-7825). A forked test that constructs an enormous transaction can now hit a per-tx cap that did not exist when most fork-testing tutorials were written.
- EIP-7702 (May 2025) changes what forked mainnet accounts look like: an EOA can carry a 23-byte `0xef0100||address` delegation designator, so a forked "user" address may have non-empty code. Tests that branch on `addr.code.length == 0` to detect an EOA will behave differently against real 2026 mainnet state than against a synthetic local account.
- Free-tier RPC economics have tightened across providers over the last 18 months and public endpoints increasingly reject archive-range queries. Assume a learner will hit 429s or missing-state errors on their first unpinned fork run.
- Reth-backed public endpoints (e.g. the `ethereum.reth.rs` endpoint used in the current docs example) now appear in official examples, replacing the older Alchemy/Infura-keyed examples.

### Misconceptions
- Belief: forking downloads the chain locally. | Reality: state is fetched lazily per account/slot on first access and cached; the initial "fork" is nearly free. | Why: "fork the chain" sounds like a clone. | Source: https://getfoundry.sh/forge/tests/fork-testing/
- Belief: not pinning a block just means "test against the newest state", which is better. | Reality: it makes the test non-reproducible AND defeats the block-keyed cache, so every run re-fetches over RPC and a green suite can go red overnight with no code change. | Why: "latest" sounds more realistic. | Source: https://getfoundry.sh/forge/tests/fork-testing/
- Belief: pinning to any old block works with any RPC provider. | Reality: state at a block outside a node's retention window needs an archive node; pruned/public endpoints error out. | Why: the RPC accepts the request and fails deep in the call. | Source: (see gaps — not sourced this session)
- Belief: calling `vm.createSelectFork(url)` twice gives you the same fork back. | Reality: it creates a second, independent fork with clean state; you must keep and reuse the fork id. | Why: it looks idempotent, like "connect to mainnet". | Source: https://www.getfoundry.sh/reference/cheatcodes/create-select-fork
- Belief: contracts you deployed in the test are visible after `vm.selectFork` to another fork. | Reality: each fork has its own state; only persistent accounts (by default the test contract and the caller) survive the switch. | Why: the test contract itself does survive, so it looks like everything does. | Source: https://book.getfoundry.sh/cheatcodes/make-persistent
- Belief: `vm.roll` and `vm.rollFork` are the same thing. | Reality: `vm.roll` only sets block.number in the local EVM; `vm.rollFork` moves the FORK to a different block, changing the underlying real state it reads. | Why: near-identical names. | Source: https://book.getfoundry.sh/cheatcodes/roll-fork
- Belief: fork tests hit the RPC once. | Reality: they issue a request per uncached account/code/slot touched, which is why a broad forked suite exhausts free-tier budgets and trips rate limits. | Why: it feels like one "connect". | Source: https://getfoundry.sh/forge/tests/fork-testing/
- Belief: a stale or broken fork test means the contract changed on chain. | Reality: it is often a poisoned RPC cache; `rm -rf ~/.foundry/cache/rpc` is the documented first move. | Why: caching is invisible until it is wrong. | Source: https://www.getfoundry.sh/help/troubleshooting
- Belief: fork tests replace unit tests because they are "more real". | Reality: they are slow, network-dependent and hard to make exhaustive; they complement a fast local suite rather than replacing it. | Why: realism is seductive. | Source: https://getfoundry.sh/forge/tests/fork-testing/

### Practice ideas
- kind: measure — Run the same forked test twice with a pinned block, timing both, then delete `~/.foundry/cache/rpc` and run again. — Acceptance: learner reports three wall-clock numbers and explains the cold/warm gap in terms of per-slot RPC fetches.
- kind: implement — Write a test that forks mainnet at a pinned block, reads a real USDC balance of a known whale via the live token contract, and `vm.deal`s/prank-transfers from that whale into your contract. — Acceptance: passes offline on a second run (cache warm), and the block number is in foundry.toml or the command, never `latest`.
- kind: break — Run the same test with no `--fork-block-number` twice, hours apart or against two endpoints. — Acceptance: learner demonstrates differing results or a cache miss and can articulate why CI would be flaky.
- kind: fix — Take a two-fork test that deploys a helper contract on fork A and then fails after `vm.selectFork(B)`, and repair it with `vm.makePersistent`. — Acceptance: the fix is a persistence declaration, not a redeploy, and the learner can say which accounts were persistent by default.
- kind: read — Use `vm.rollFork(txHash)` plus `vm.transact(txHash)` to reproduce a documented historical exploit transaction and assert on the resulting balance change. — Acceptance: the test reproduces the exploit's effect from real chain state with no mocks.
- kind: implement — Add a CI job that caches `~/.foundry/cache/rpc` keyed on the pinned fork block and runs only the forked tests via `--match-path test/fork/**`. — Acceptance: second CI run shows a cache hit and a materially lower RPC call count or runtime.
- kind: measure — Point a fork suite at a free-tier provider and count requests or watch the dashboard until a 429 appears. — Acceptance: learner produces a concrete request count for their suite and can predict the cost of running it per commit.

### Visual opportunities
- Lazy-fetch sequence diagram: test calls `token.balanceOf(whale)` -> local EVM misses -> eth_getCode / eth_getStorageAt to the RPC -> value cached under `~/.foundry/cache/rpc/1/<block>/` -> second run served entirely locally.
- Pinned vs latest cache-hit matrix: rows = runs over time, columns = cache key (chain, block); pinned collapses to one key with hits, `latest` produces a new key every run and never hits.
- Multi-fork state diagram: two labelled worlds (mainnet@block, optimism@block), the active-fork pointer moving between them, and a small persistent set (test contract, caller, anything makePersistent'd) drawn as floating above both.
- Testing pyramid for EVM work: many local unit tests, a layer of stateless fuzz, a layer of invariant, and a deliberately thin, pinned forked-integration cap — annotated with runtime and RPC cost per layer.
- Naming-collision card: `vm.roll` (local block.number) vs `vm.rollFork` (move the fork) vs `vm.warp` (timestamp), side by side with what each does and does not change.

### Gaps & uncertainties
- CACHE PATH CONFLICT, unresolved: the current fork-testing page states `~/.foundry/cache/rpc/<chain>/<block>/` while other Foundry documentation (surfaced via search) states `$HOME/.foundry/cache/<chain id>/<block number>` with no `rpc/` segment. I did not resolve which is correct in Aug 2026 — check on a real machine before publishing a CI cache key. Both are quoted here rather than picking one.
- The archive-node requirement and the commonly cited ~128-block state-retention window for a default full node were NOT sourced in this session. The claim is standard but should be attributed to client docs (geth/reth) before being taught as a number.
- No source obtained for current RPC provider free-tier limits, compute-unit pricing, or the request count a typical fork suite generates. Do NOT publish provider-specific numbers from this shard; they change and were not verified.
- Whether the persistent-account default set is exactly {test contract, caller} in the current version, and whether `makePersistent` has a revoke counterpart, was read from a book.getfoundry.sh page and not cross-checked on the new docs site.
- Exact `[rpc_storage_caching]` key names and defaults (`chains`, `endpoints`, the meaning of "remote only") came from a search snippet, not from a directly fetched config reference page — the project/overview config pages I fetched did not surface them. Re-verify.
- `forge test --fork-url` interaction with the fork cheatcodes (whether a CLI fork becomes fork id 0, and precedence when both are used) is undocumented in what I read.
- Whether Foundry's forked EVM automatically selects the right `evm_version` for the forked chain's current hardfork, or whether it must be set manually (relevant post-Fusaka and for L2s behind mainnet), is unverified and matters in practice.
