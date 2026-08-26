# Shard A13 — Track 12: Alternative VMs (remainder)

Research shard covering Solana parallel execution, Anchor, Pinocchio, Token-2022,
Solana security, and stubs for Move and Cosmos. Compiled 25 August 2026.

## Status log
- [x] 12.2
- [x] 12.3
- [x] 12.4
- [x] 12.5
- [x] 12.6
- [x] 12.7
- [x] 12.8

## 12.2 — Parallel execution in depth: Sealevel, conflict detection, fee markets

### Concepts
- sealevel-declared-access — Every Solana transaction declares, up front, the complete list of accounts it will touch and whether each is read-only or writable, so the runtime knows the read/write set before executing a single instruction. | requires: [solana-account-model, solana-transaction-anatomy] | contrasts: [evm-implicit-state-access, block-stm-optimistic]
- account-lock-semantics — Scheduling conflict is decided by classic reader/writer locks on account keys: many transactions may hold a read lock on the same account concurrently, but a write lock is exclusive against all other locks. | requires: [sealevel-declared-access] | contrasts: [evm-serial-execution]
- conflict-is-static-not-dynamic — Because access is declared rather than discovered, Solana detects conflicts before execution and never has to abort-and-retry a transaction for a state conflict. | requires: [account-lock-semantics] | contrasts: [block-stm-optimistic, evm-access-list-hint]
- declared-access-is-a-tax — The price of static conflict detection is that programs cannot decide at runtime which account to touch; every possible account must be passed in, which forces client-side account resolution and makes dynamic data structures awkward. | requires: [sealevel-declared-access]
- banking-stage-pipeline — Only the current leader schedules: incoming transactions pass signature verification, land in the leader's banking stage buffer, are scheduled onto worker threads, and are recorded into Proof of History. | requires: [solana-leader-schedule] | contrasts: [evm-mempool-gossip]
- central-scheduler — Since Agave v1.18 the banking stage uses one dedicated scheduling thread that holds a global view of the buffered transactions and hands non-conflicting batches to a pool of execution workers, instead of N threads independently grabbing from a shared queue. | requires: [banking-stage-pipeline]
- greedy-scheduler-default — The original central scheduler ordered work with a "prio-graph" dependency structure; Agave later replaced the default with a simpler greedy scheduler that packs blocks with less scheduling overhead. | requires: [central-scheduler]
- compute-unit-budget — Compute units are Solana's gas: a transaction gets a default budget (200k CU per instruction) and can request up to 1.4M CU explicitly with a ComputeBudget instruction; exceeding the budget fails the transaction. | requires: [solana-transaction-anatomy] | contrasts: [evm-gas-metering]
- priority-fee-formula — The prioritization fee equals requested compute-unit price (micro-lamports per CU) times the requested compute-unit limit, so over-requesting CU costs real money even if the transaction consumes far less. | requires: [compute-unit-budget]
- fees-charged-on-failure — Base fee (5,000 lamports per signature) and priority fee are charged for any transaction the leader includes, including ones that revert; only transactions that never make it into a block cost nothing. | requires: [priority-fee-formula] | contrasts: [evm-revert-still-costs-gas]
- per-account-write-cu-cap — A single writable account may consume at most 12M CU inside one block, far below the block ceiling, which is the mechanical basis of "local" fee markets. | requires: [account-lock-semantics, compute-unit-budget]
- local-fee-market — Because contention is per-account, a bidding war over one hot account (a popular AMM pool, a mint) is supposed to raise fees only for transactions touching that account, leaving unrelated traffic cheap. | requires: [per-account-write-cu-cap, priority-fee-formula] | contrasts: [eip1559-global-basefee]
- local-fee-markets-are-leaky — Locality is imperfect: the scheduler orders a single global priority queue and worker threads and block space are shared, so heavy high-fee traffic on one account still delays and crowds out unrelated low-fee transactions. | requires: [local-fee-market, central-scheduler]
- contention-failure-modes — Under contention the visible symptoms are not reverts but drops: transactions sit in the leader's buffer, get forwarded or discarded, and eventually fail because their blockhash expired (~150 blocks) rather than because the program rejected them. | requires: [banking-stage-pipeline, local-fee-market]
- stake-weighted-qos — Leader ingress over QUIC is rationed by stake, so a large share of transaction capacity is reserved for connections from staked validators, which is why RPC provider choice materially changes landing rates. | requires: [banking-stage-pipeline]

### Primary sources
- [Introducing the Central Scheduler: An Optional Feature of Agave v1.18](https://www.anza.xyz/blog/introducing-the-central-scheduler-an-optional-feature-of-agave-v1-18) — tier: canonical-docs — published: 2024-03 — the client team's own description of how scheduling, buffering and account-lock conflict checks work; the mental model still applies even though the default algorithm changed.
- [Why Solana Transaction Costs and Compute Units Matter for Developers (Anza)](https://www.anza.xyz/blog/why-solana-transaction-costs-and-compute-units-matter-for-developers) — tier: canonical-docs — published: 2024 — authoritative on the CU budget, the priority-fee formula, and why requested-vs-consumed CU matters.
- [Solana docs: transaction fees / prioritization fees](https://solana.com/docs/core/fees) — tier: canonical-docs — published: continuously updated — base fee per signature, ComputeBudget instructions, fee burn split.
- [SIMD repository (solana-foundation/solana-improvement-documents)](https://github.com/solana-foundation/solana-improvement-documents) — tier: spec — published: continuously updated — the actual specs: SIMD-0096 (priority fee to leader), SIMD-0110 (dynamic write-lock fees), SIMD-0207/0256/0286 (block CU limit raises).
- [100M CU Blocks upgrade page](https://solana.com/upgrades/100m-cu-blocks) — tier: canonical-docs — published: 2026-07 — states the new 100M block limit and that the 12M per-writable-account cap and 100MB block account-data cap did NOT change.
- [The Truth about Solana Local Fee Markets (Helius)](https://www.helius.dev/blog/solana-local-fee-markets) — tier: primary-analysis (vendor) — published: 2024 — best explanation of why local fee markets are weaker than the marketing claim; Helius is an RPC vendor, treat framing accordingly.
- [Solana's Local Fee Markets Aren't Real — Eugene Chen (Lightspeed)](https://solanacompass.com/learn/Lightspeed/solanas-local-fee-markets-arent-real-eugene-chen) — tier: primary-analysis — published: 2024 — practitioner (OpenBook) argument that scheduler-level global ordering defeats locality.

### Current state (Aug 2026)
- Block compute limit is **100M CU**, activated by SIMD-0286 at epoch 1009 on **29 July 2026** (authored by Jito Labs). Prior values: 48M, then 50M (SIMD-0207), then 60M (SIMD-0256). Any course material citing 48M/50M/60M as "the block limit" is out of date.
- The **per-writable-account cap stayed at 12M CU** through the 100M raise, so the *ratio* of per-account capacity to block capacity fell from ~20% to 12%. Locality got relatively tighter, not looser.
- Per-transaction max is still 1.4M CU; default is 200k CU per instruction if no ComputeBudget instruction is present.
- The default scheduling algorithm is the **greedy scheduler** (shipped as default around Agave 2.3), which superseded the prio-graph algorithm that the original v1.18 central-scheduler blog describes. Teaching "Solana uses prio-graph" is now wrong-ish; teaching "one scheduler thread, workers, account-lock conflict checks" is still right.
- SIMD-0096 moved 100% of priority fees to the leader (previously half burned). Base fee is still 50% burned.
- Firedancer/Frankendancer is a second production client with its own scheduler implementation; "the scheduler" is now client-specific, not protocol-specified.

### Misconceptions
- Belief: Solana runs transactions in parallel by optimistically executing and re-running on conflict. | Reality: Solana is pessimistic — it takes reader/writer locks derived from the declared account list and simply does not co-schedule conflicting transactions. | Why: people port the Aptos Block-STM / optimistic-concurrency mental model onto Solana. | Source: https://www.anza.xyz/blog/introducing-the-central-scheduler-an-optional-feature-of-agave-v1-18
- Belief: Priority fee is charged on the compute units actually consumed. | Reality: It is charged on the *requested* CU limit times the CU price, so a lazily-set 1.4M limit costs 7x a tuned 200k limit at the same CU price. | Why: EVM refunds unused gas; Solana does not refund unused CU. | Source: https://www.anza.xyz/blog/why-solana-transaction-costs-and-compute-units-matter-for-developers
- Belief: Local fee markets mean congestion on one dApp never affects anyone else. | Reality: The scheduler orders one global priority queue over shared worker threads and shared block space; a fee war on one account measurably degrades unrelated traffic. | Why: marketing shorthand repeated without the scheduler detail. | Source: https://www.helius.dev/blog/solana-local-fee-markets
- Belief: A transaction that fails under congestion "reverted". | Reality: Most congestion failures are never included at all — they are dropped from the leader's buffer or expire when their blockhash ages out after ~150 blocks. | Why: EVM users equate "my tx failed" with "it executed and reverted". | Source: https://solana.com/docs/core/fees
- Belief: Raising the block CU limit raises how much a single hot program can do per block. | Reality: The 12M per-writable-account cap is independent of the block limit and was not raised with SIMD-0286. | Why: conflating block capacity with per-account capacity. | Source: https://solana.com/upgrades/100m-cu-blocks

### Practice ideas
- kind: measure — Pull 200 consecutive blocks from a public RPC (`getBlock` with `maxSupportedTransactionVersion:0`), extract each transaction's writable account keys, and compute the distribution of write-lock counts per account. Acceptance: you can name the top 5 most write-contended accounts in your sample and show what fraction of block CU they consumed.
- kind: measure — For one hot account (a major AMM pool) and one cold account, call `getRecentPrioritizationFees` on both and chart the spread over an hour. Acceptance: you can state, with numbers, whether the two accounts had materially different fee floors — evidence for or against local fee markets.
- kind: implement — Write a TypeScript script that builds the same transfer twice: once with no ComputeBudget instruction, once with `setComputeUnitLimit` tuned from a prior `simulateTransaction` CU reading plus a margin, both at the same CU price. Acceptance: you print the two prioritization fees and show the tuned one is strictly cheaper.
- kind: break — Construct two transactions that write the same account and two that write disjoint accounts. Submit each pair concurrently against a local validator under load. Acceptance: you demonstrate the conflicting pair serialized while the disjoint pair did not, using slot/ordering evidence.
- kind: read — Read SIMD-0286 and SIMD-0110 in the SIMD repo. Acceptance: you can state in two sentences what SIMD-0110 would change about fee markets that SIMD-0286 did not, and what its activation status is.

### Visual opportunities
- Two blocks side by side: same transaction set, one scheduled by naive FIFO threads with lock contention stalls, one packed by the central scheduler — showing wasted worker-thread time.
- A read/write lock compatibility matrix over three transactions and four accounts, with the resulting parallel batches highlighted.
- A capacity bar chart: 100M block CU with a 12M slice marked "any one writable account", to make the local-fee-market mechanism concrete.
- Lifecycle of a congested transaction: client -> RPC -> QUIC ingress (stake-weighted) -> leader buffer -> either scheduled, forwarded, dropped, or blockhash-expired. Four exits, only one of which is "reverted".

### Gaps & uncertainties
- **Greedy vs prio-graph default**: search results say the greedy scheduler became the shipped default "since Agave 2.3", but I did not open the Agave release notes to confirm the exact version and date. Treat the version pin as unverified; the *existence* of the switch is well supported.
- **SIMD-0110 status**: the dynamic write-lock fee proposal (EMA of per-account CU utilization, initial write-lock cost rate 1,000 micro-lamports/CU, 1% per-block adjustment) is described in sources as *proposed*. I could NOT confirm whether it has been activated on mainnet as of Aug 2026. Do not teach it as live.
- **Buffer capacity numbers**: I have seen figures for the leader's transaction buffer size quoted in secondary sources but did not verify any against Agave source. Omitted deliberately.
- **Alpenglow / consensus changes**: 2026 Solana consensus work may change leader timing and therefore scheduling pressure. Not researched in this module; out of scope but worth a cross-check before authoring.
- **Firedancer scheduler differences**: Firedancer's banking/scheduling design differs from Agave's. I did not research it. Any claim of the form "Solana's scheduler does X" is really "Agave's scheduler does X".
- Base fee is widely quoted as 5,000 lamports per signature; I did not re-verify this against current docs in this session and there have been SIMDs discussing base-fee changes.

## 12.3 — Anchor: framework model, constraints, IDL, testing

### Concepts
- anchor-purpose — Anchor is a Rust framework whose entire job is to remove the boilerplate that Solana's raw entrypoint forces on you: deserializing the instruction data, validating every account, and serializing state back. | requires: [solana-program-model, sealevel-declared-access] | contrasts: [pinocchio-zero-copy, raw-solana-program]
- anchor-three-macros — An Anchor program is three macro layers: `#[program]` turns a module of Rust functions into instruction handlers, `#[derive(Accounts)]` declares and validates the account list for one instruction, and `#[account]` marks a struct as on-chain state. | requires: [anchor-purpose]
- eight-byte-discriminator — Anchor prefixes every account and every instruction payload with an 8-byte discriminator derived from a hash of its name, so the program can refuse to interpret a `Vault` account as a `Config` account. | requires: [anchor-three-macros] | contrasts: [account-type-confusion]
- account-wrapper-does-three-checks — `Account<'info, T>` is not just a typed pointer: constructing it checks that the account's owner is this program, that the first 8 bytes match T's discriminator, and then deserializes the rest with Borsh. | requires: [eight-byte-discriminator, solana-account-owner] | contrasts: [missing-owner-check]
- typed-account-wrappers — Anchor's wrapper types encode the check you want in the type: `Signer` asserts is_signer, `Program<'info, System>` asserts the key and executable flag, `SystemAccount` asserts system-program ownership, and `UncheckedAccount`/`AccountInfo` assert nothing and require an explicit `/// CHECK:` comment. | requires: [account-wrapper-does-three-checks]
- constraints-are-generated-code — Attributes inside `#[account(...)]` — `mut`, `init`, `seeds`/`bump`, `has_one`, `close`, `constraint = expr`, `address`, `owner` — expand at compile time into ordinary runtime `if` checks that return a specific error code. Nothing magic runs off-chain. | requires: [anchor-three-macros]
- seeds-bump-constraint — `seeds = [...] , bump` makes Anchor re-derive the PDA and compare it to the passed key; storing and reusing a canonical bump (`bump = state.bump`) is cheaper than re-deriving and prevents non-canonical-bump ambiguity. | requires: [solana-pda, constraints-are-generated-code] | contrasts: [pda-seed-collision]
- has-one-links-accounts — `has_one = authority` asserts that a field stored inside the account's data equals the key of another account in the same instruction, which is the standard way to bind an object to its owner. | requires: [constraints-are-generated-code] | contrasts: [missing-signer-check]
- init-vs-init-if-needed — `init` creates and funds an account and fails if it already exists; `init_if_needed` silently continues when it exists, is gated behind a cargo feature, and is the classic re-initialization attack surface because you must add your own guard against resetting live state. | requires: [constraints-are-generated-code]
- anchor-error-codes — `#[error_code]` generates a Rust enum plus numeric codes; custom program errors start at 6000, while Anchor's own constraint failures occupy reserved lower ranges, so a raw error number tells you whether the framework or your logic rejected the transaction. | requires: [constraints-are-generated-code]
- idl-is-the-abi — Anchor emits an IDL: a JSON description of instructions, accounts, types, errors, discriminators and PDA seeds, which is Solana's answer to an EVM ABI and is what generates TypeScript and Rust clients. | requires: [eight-byte-discriminator] | contrasts: [evm-abi-json]
- idl-published-on-chain — The IDL can be written to an on-chain account derived from the program id, so an explorer or client can fetch a program's interface without a repo — an ABI registry built into the framework. | requires: [idl-is-the-abi] | contrasts: [etherscan-verified-source]
- anchor-zero-copy-escape-hatch — For accounts too big to Borsh-deserialize onto the 4KB BPF stack, Anchor offers `#[account(zero_copy)]` plus `AccountLoader`, which memory-maps the account with bytemuck instead of copying it — the same idea Pinocchio applies to the whole program. | requires: [account-wrapper-does-three-checks] | contrasts: [pinocchio-zero-copy]
- anchor-costs-compute — Every generated check costs compute units, and Borsh (de)serialization of large accounts costs more; Anchor's convenience is measured in CU, which is the entire argument for lower-level frameworks. | requires: [anchor-purpose, compute-unit-budget] | contrasts: [pinocchio-zero-copy]
- anchor-test-stack — Program tests can run against a full local validator (slow, realistic), a fork of mainnet state, or an in-process SVM harness (LiteSVM / Mollusk / bankrun) that skips consensus and networking entirely and runs in milliseconds. | requires: [anchor-purpose]

### Primary sources
- [Anchor documentation — Account Constraints reference](https://www.anchor-lang.com/docs/references/account-constraints) — tier: canonical-docs — published: continuously updated — the definitive table of every constraint and exactly what check it generates. This is the page to teach from.
- [Anchor docs home](https://www.anchor-lang.com/docs) — tier: canonical-docs — published: continuously updated — program structure, IDL, errors, CPI, testing.
- [solana-foundation/anchor releases](https://github.com/solana-foundation/anchor/releases) — tier: canonical-docs — published: 2026-06 (latest listed v1.1.2) — authoritative version and breaking-change history.
- [anchor-lang on docs.rs](https://docs.rs/anchor-lang/latest/anchor_lang/) — tier: canonical-docs — published: continuously updated — generated API docs; the fastest way to confirm what a wrapper type actually asserts.
- [Solana docs: Anchor program introduction](https://solana.com/docs/programs/anchor) — tier: canonical-docs — published: continuously updated — the officially-blessed on-ramp, aligned with current tooling.
- [Anchor issue #3947 — IDL generation fails with seeds constraints referencing account fields](https://github.com/solana-foundation/anchor/issues/3947) — tier: primary-analysis — published: 2025 — real, open sharp edge: program compiles but `anchor build` IDL emission fails; workaround is `--no-idl`.
- [Anchor issue #4057 — IDL omits PDA seeds for accounts with `init`](https://github.com/solana-foundation/anchor/issues/4057) — tier: primary-analysis — published: 2025 — the IDL can silently under-describe a PDA, so generated clients cannot derive the address.

### Current state (Aug 2026)
- **Anchor 1.0.0 shipped April 2026** — the framework left 0.x after roughly five years. Latest release listed on GitHub is **v1.1.2 (26 June 2026)**; `anchor-lang` 1.1.2 is the current crate on docs.rs. Anything teaching `0.29`/`0.30`/`0.31` idioms is a generation behind.
- Reported 1.0 breaking changes: the TypeScript client moved from **`@coral-xyz/anchor` to `@anchor-lang/core`**; **Surfpool** (mainnet-forking local validator) replaces `solana-test-validator` as the default local network; **LiteSVM** is the default test template instead of a validator-backed mocha run. Verify each against the 1.0.0 release notes before teaching — see gaps.
- The project namespace moved from `coral-xyz/anchor` to **`solana-foundation/anchor`**; old repo/package names in tutorials are stale.
- The IDL format changed substantially at 0.30 (new spec, discriminators carried explicitly, PDA seed descriptions). Pre-0.30 IDL examples do not match what current `anchor build` emits.
- Codama (formerly Kinobi) is the mainstream IDL-to-client generator, and generated `@solana/kit`-style clients are increasingly preferred over the Anchor TS client for production apps.
- Testing has genuinely shifted: LiteSVM / Mollusk (Rust) / bankrun run programs in-process against an SVM instance in milliseconds, versus seconds-to-minutes for a local validator. Course material that only teaches `anchor test` against `solana-test-validator` is teaching the slow path.

### Misconceptions
- Belief: `#[derive(Accounts)]` validation happens off-chain or in the client. | Reality: the macro expands into on-chain Rust checks that execute inside the program and burn compute units. | Why: the declarative syntax reads like configuration. | Source: https://www.anchor-lang.com/docs/references/account-constraints
- Belief: Using Anchor means you cannot write insecure programs. | Reality: Anchor removes *default-unsafe* patterns (owner, discriminator, signer) but `UncheckedAccount`, `init_if_needed`, missing `has_one`, and unvalidated CPI targets are all still your responsibility. | Why: "safe by default" is read as "safe". | Source: https://www.anchor-lang.com/docs/references/account-constraints
- Belief: The IDL is a complete, trustworthy description of the program. | Reality: known bugs let `anchor build` emit an IDL missing PDA seed information, or fail entirely on seeds that reference account fields, so a generated client can be silently wrong. | Why: people treat IDL like a compiler output that cannot be incomplete. | Source: https://github.com/solana-foundation/anchor/issues/4057
- Belief: An 8-byte discriminator is a security feature comparable to a type system. | Reality: it is an 8-byte hash prefix that prevents *accidental* type confusion; it does not prevent an attacker passing a legitimate account of the right type but the wrong instance — that is what `has_one` and seed constraints are for. | Why: conflating type safety with authorization. | Source: https://www.anchor-lang.com/docs/references/account-constraints
- Belief: `anchor test` needs a local validator. | Reality: since 1.0 the default template uses LiteSVM, and Surfpool is the validator-shaped option; both are dramatically faster. | Why: every pre-2026 tutorial says `solana-test-validator`. | Source: https://github.com/solana-foundation/anchor/releases

### Practice ideas
- kind: implement — Build a two-instruction Anchor program: `initialize` creates a PDA config with `seeds = [b"config", authority.key().as_ref()], bump`, and `update` mutates it. Acceptance: `update` fails with a specific Anchor error when called with a different authority, and the failing error code is 6000-range or a named constraint error you can identify.
- kind: break — Take a working program and delete the `has_one = authority` constraint from the update instruction. Write a test that, as attacker, passes the victim's config account and the attacker's signer. Acceptance: the test *passes* (exploit succeeds) before restoring the constraint, and fails after.
- kind: break — Enable `init_if_needed` on an account that holds a balance, then write a test that calls the initializing instruction a second time on a live account. Acceptance: you demonstrate state being reset, then fix it with an explicit `require!` guard on an `is_initialized`-style field.
- kind: read — Run `anchor build` on a program that uses `init` together with `seeds`, then open `target/idl/*.json` and check whether the `pda` field describing the seeds is present. Acceptance: you can say whether issue #4057 reproduces on your Anchor version and what it would break in a generated client.
- kind: measure — Run the same instruction under a validator-backed test and under LiteSVM/Mollusk. Acceptance: you report both wall-clock times and the CU consumed, and can state the speedup factor.
- kind: fix — Take an account struct large enough to blow the 4KB BPF stack with `Account<'info, T>` and convert it to `#[account(zero_copy)]` + `AccountLoader`. Acceptance: the program compiles and the instruction's CU consumption drops measurably.

### Visual opportunities
- Macro expansion diagram: one `#[derive(Accounts)]` struct on the left, the generated sequence of runtime checks on the right, in execution order (owner -> discriminator -> deserialize -> constraints).
- Account byte layout: 8-byte discriminator, then Borsh-encoded fields, with the owner field shown as account *metadata* outside the data buffer.
- Build pipeline: Rust source -> `anchor build` -> .so + IDL JSON -> Codama -> TypeScript client, with the on-chain IDL account branching off.
- Test-speed ladder: mainnet fork -> local validator -> LiteSVM/Mollusk, annotated with fidelity vs milliseconds.

### Gaps & uncertainties
- **1.0.0 breaking-change list is only partially verified.** The `@coral-xyz/anchor` -> `@anchor-lang/core` rename, Surfpool default, and LiteSVM default template come from a search summary of the release notes; the GitHub releases page I fetched did not render the 1.0.0 body. Confirm from the 1.0.0 release notes before publishing these as fact.
- **Anchor 1.0.0 release date** is stated as April 2026 by a secondary summary; I did not see a dated release entry for 1.0.0 itself (I saw 1.0.2 on 2 May 2026, 1.0.3 and 1.1.2 on 26 June 2026), which is *consistent with* an April 1.0.0 but does not prove it.
- **Custom error base 6000** and the reserved Anchor error ranges are from my prior knowledge, not re-verified this session. Check `anchor_lang::error::ErrorCode` on docs.rs before stating exact numeric boundaries.
- **4KB stack frame limit** for BPF/SBF is quoted from prior knowledge; confirm against current SBF docs, as the SBF v2/v3 work may have changed limits.
- I did not verify whether `init_if_needed` still requires the `init-if-needed` cargo feature flag in 1.x. Assume yes, verify before teaching.
- Whether the Anchor TS client or a Codama-generated `@solana/kit` client is the *recommended* default in 1.x docs is unconfirmed; sources point both ways.

## 12.4 — Pinocchio: zero-copy account parsing and when it is worth it

### Concepts
- pinocchio-what-it-is — Pinocchio is a zero-external-dependency Rust library from Anza that replaces the `solana-program` crate for on-chain code, trading every convenience for compute units and binary size. | requires: [solana-program-model] | contrasts: [anchor-purpose]
- runtime-input-buffer — The SVM hands a program a single flat serialized buffer containing the program id, the account metadata and data, and the instruction data; everything a framework does starts from parsing that buffer. | requires: [sealevel-declared-access]
- deserialize-vs-borrow — The standard entrypoint walks the input buffer and builds owned Rust values (`Vec<AccountInfo>` with `Rc<RefCell<..>>` interior mutability), copying data; Pinocchio instead constructs pointers into the buffer in place. | requires: [runtime-input-buffer] | contrasts: [anchor-purpose]
- pinocchio-zero-copy — Pinocchio's `AccountInfo` is essentially a typed pointer into the runtime's input buffer, so reading an account costs a pointer dereference rather than a copy plus allocation. | requires: [deserialize-vs-borrow]
- entrypoint-is-the-big-win — Roughly 70% of p-token's measured savings came from just two changes: replacing the standard entrypoint and reading accounts zero-copy — i.e. most of the cost was framework overhead, not program logic. | requires: [pinocchio-zero-copy]
- no-allocator-no-panic-handler — Pinocchio lets a program opt out of the default bump allocator and the standard panic handler (`no_allocator!`, `nostd_panic_handler!`), which shrinks the .so and removes per-invocation setup cost. | requires: [pinocchio-what-it-is]
- repr-c-state-casting — On-chain state in Pinocchio is a `#[repr(C)]` struct that you cast directly onto the account's data slice instead of Borsh-deserializing it, which means you own alignment, padding and endianness correctness. | requires: [pinocchio-zero-copy] | contrasts: [anchor-zero-copy-escape-hatch]
- no-automatic-validation — Pinocchio performs no owner check, no signer check, no discriminator check and no writability check for you; every guarantee Anchor generates from a constraint must be written by hand. | requires: [pinocchio-what-it-is] | contrasts: [constraints-are-generated-code, account-wrapper-does-three-checks]
- no-idl-by-default — Pinocchio emits no IDL, so client generation requires hand-writing an interface description (or annotating with a tool like Shank / Codama) rather than falling out of the build. | requires: [idl-is-the-abi] | contrasts: [idl-is-the-abi]
- when-pinocchio-pays — The framework overhead is a fixed per-invocation cost, so Pinocchio pays off exactly where a program is invoked constantly or via CPI inside other transactions — token primitives, DEX hot paths, oracles — and pays off least in low-frequency app logic. | requires: [entrypoint-is-the-big-win, compute-unit-budget]
- cu-headroom-is-the-real-prize — Cheaper instructions are not mainly about fee savings; they buy headroom under the 1.4M per-transaction and 12M per-writable-account limits, letting a single transaction do more or a hot account serve more users per block. | requires: [when-pinocchio-pays, per-account-write-cu-cap]
- p-token-case-study — p-token is SPL Token rewritten in Pinocchio: `transfer` dropped from about 4,645 CU to about 76 CU and `transfer_checked` from about 6,200 CU to about 105 CU, roughly 95-98% less compute for identical behaviour. | requires: [pinocchio-what-it-is]
- protocol-level-swap — p-token was adopted by SIMD-0266 as a replacement of the existing token program at the same address, so every wallet, dApp and token gets the savings without changing a line of their own code. | requires: [p-token-case-study] | contrasts: [erc20-per-token-deployment]
- pinocchio-maturity — Pinocchio remains a pre-1.0 crate (0.11.x line) with satellite crates for system/token/token-2022/ATA, but it is Anza-maintained and the code built on it has passed third-party audit and now runs the network's most-used program. | requires: [pinocchio-what-it-is]
- pinocchio-security-tradeoff — Choosing Pinocchio moves your program from "framework catches the standard account-validation bugs" to "an auditor must catch them", which is a budget decision, not just a style decision. | requires: [no-automatic-validation] | contrasts: [anchor-costs-compute]

### Primary sources
- [anza-xyz/pinocchio](https://github.com/anza-xyz/pinocchio) — tier: canonical-docs — published: continuously updated — the library itself; README explains the zero-copy `AccountInfo`, the entrypoint macros, and the no-dependency goal.
- [pinocchio releases](https://github.com/anza-xyz/pinocchio/releases) — tier: canonical-docs — published: 2026 — version truth; also shows the satellite crates (pinocchio-system, pinocchio-token, pinocchio-token-2022).
- [febo/p-token](https://github.com/febo/p-token) — tier: canonical-docs — published: continuously updated — the reference Pinocchio program; read it to see what hand-written validation actually looks like at production quality.
- [SIMD-0266: Efficient Token program (PR #266)](https://github.com/solana-foundation/solana-improvement-documents/pull/266) — tier: spec — published: 2025 — the actual proposal to swap the token program implementation; the discussion thread is the best record of the objections raised.
- [Optimized Token Program upgrade page](https://solana.com/upgrades/p-token) — tier: canonical-docs — published: 2026 — official activation description and claimed savings.
- [Neodyme audit thread on p-token](https://x.com/Neodyme/status/1958234163376717904) — tier: primary-analysis — published: 2025-08 — independent auditors on what the CU savings mean in practice; the audit itself is the strongest maturity evidence.
- [How to Build Solana Programs with Pinocchio (Helius)](https://www.helius.dev/blog/pinocchio) — tier: primary-analysis (vendor) — published: 2025 — the clearest hands-on walkthrough; vendor blog, so treat framing as promotional.
- [Pinocchio 101 (Blueshift course)](https://learn.blueshift.gg/en/courses/pinocchio-for-dummies/pinocchio-101) — tier: secondary — published: 2025 — structured teaching material, useful as a curriculum reference point.

### Current state (Aug 2026)
- **p-token is live on mainnet.** SIMD-0266 activated at **epoch 971** (spring 2026; wire reports around 13 May 2026). It requires validators to run at least **Agave v3.1.7** or **Firedancer v0.812.30108**. This is the headline fact for the module: the most-invoked program on Solana is now a Pinocchio program.
- Claimed effect: 95-98% fewer CU on token operations, and roughly 10% of total blockspace freed network-wide. One sampling window (3-11 Aug 2025) estimated 8.9-9.1 trillion CU saved, about 12% of all chain compute including votes.
- Pinocchio itself is **still pre-1.0** — latest published `pinocchio` crate is in the **0.11.x** line. Satellite crates version independently (pinocchio-system, pinocchio-token, pinocchio-token-2022, pinocchio-associated-token-account).
- Quoted comparison: Pinocchio ~84% CU savings versus equivalent Anchor code for near-identical program logic.
- Practical consequence for teaching: most developers should *benefit from* Pinocchio (via p-token) without *writing* Pinocchio. The "should I rewrite my program in Pinocchio?" question now has a much narrower yes.
- Anchor and Pinocchio are not mutually exclusive: Pinocchio CPI helper crates can be used from otherwise-Anchor programs to cut CPI cost.

### Misconceptions
- Belief: Pinocchio is a competing framework to Anchor. | Reality: it is a replacement for the `solana-program` crate — a lower layer. It has no account model, no constraint DSL, and no IDL; it is not framework-shaped at all. | Why: both are "the thing you write a Solana program with". | Source: https://github.com/anza-xyz/pinocchio
- Belief: The CU savings come from clever program logic. | Reality: about 70% of p-token's savings came from the entrypoint and zero-copy account reading — pure framework overhead, before any business logic runs. | Why: people assume the algorithm is where the cost is. | Source: https://www.helius.dev/blog/solana-p-token
- Belief: You need to migrate your program to Pinocchio to get token savings. | Reality: SIMD-0266 swapped the implementation behind the existing token program address, so the savings are automatic for every existing caller. | Why: normal software upgrades require callers to change. | Source: https://solana.com/upgrades/p-token
- Belief: Pinocchio is experimental and unproven. | Reality: pre-1.0 crate versioning, yes — but it is Anza-maintained, third-party audited, and executing the network's highest-volume program. | Why: 0.x version numbers read as alpha. | Source: https://github.com/anza-xyz/pinocchio/releases
- Belief: Zero-copy just means "faster". | Reality: it means you are reading raw bytes at pointers, so you inherit alignment, padding and lifetime correctness obligations that Borsh was handling for you. | Why: the term is marketed as a pure win. | Source: https://github.com/anza-xyz/pinocchio
- Belief: Fewer CU mainly saves users money. | Reality: Solana fees are already tiny; the meaningful gain is headroom under the 1.4M per-transaction and 12M per-account block limits, i.e. throughput and composability. | Why: gas-cost intuition imported from Ethereum. | Source: https://solana.com/upgrades/p-token

### Practice ideas
- kind: implement — Write the same trivial program (increment a counter in a PDA) twice: once in Anchor, once in Pinocchio with hand-written owner/signer/PDA checks. Acceptance: both pass the same test suite, and you report the CU delta from transaction logs.
- kind: measure — Fetch a recent mainnet SPL-token transfer transaction over public RPC and read the `consumed X of Y compute units` log line for the token program invocation. Acceptance: you show the observed CU is on the order of ~100, not ~4,600, and can explain why.
- kind: break — Take your Pinocchio counter program and remove the owner check on the state account. Write a test where the attacker passes a look-alike account owned by a different program. Acceptance: the exploit succeeds, and you can state which Anchor constraint would have prevented it for free.
- kind: read — Read `febo/p-token`'s transfer instruction and list every validation it performs by hand. Acceptance: you produce a checklist mapping each hand-written check to the Anchor constraint that would generate it.
- kind: measure — Build a minimal Pinocchio program with and without `no_allocator!`/`nostd_panic_handler!`. Acceptance: you report the `.so` size difference and the CU difference for the same instruction.
- kind: write — Write a one-page decision memo for a hypothetical team: "should our AMM's swap instruction be Pinocchio?" Acceptance: the memo cites invocation frequency, CU headroom against the 12M per-account cap, and audit budget — not "Pinocchio is faster".

### Visual opportunities
- The input buffer: one flat byte array, with the standard entrypoint drawing arrows into *copies* on the heap versus Pinocchio drawing arrows that stay as pointers into the buffer.
- A CU stacked bar for a token transfer: entrypoint/deserialization overhead vs actual logic, before and after p-token — showing that the overhead slice was the whole story.
- Layer diagram: SVM runtime -> pinocchio (or solana-program) -> Anchor -> your program, making clear that Pinocchio sits below Anchor, not beside it.
- Decision tree for framework choice: invocation frequency, CU headroom, team size, audit budget, need for an IDL.

### Gaps & uncertainties
- **Release dates from the GitHub releases page came back with implausible years (2024) from the fetch tool**, almost certainly a relative-date misparse. I trust the *version numbers* (pinocchio 0.11.2 latest, no 1.0) but NOT those dates. Re-verify dates before publishing.
- **p-token activation date**: sources say "epoch 971", "spring 2026", "expected April", and "reported live 13 May 2026". These are consistent but not identical. Do not publish a precise calendar date without checking the Anza announcement or an epoch-to-date calculator.
- **The 84% Anchor-vs-Pinocchio figure** comes from a conference talk/secondary summary with unstated methodology ("almost identical code"). Treat as directional, not a benchmark. The p-token numbers (4,645 -> 76 CU, 6,200 -> 105 CU) are much better attested.
- **"~10% of blockspace freed" vs "~12% of all chain compute"** are two different claims from two sources over different windows. They disagree in magnitude and definition; do not merge them into one number.
- I did not verify the exact current names/signatures of the Pinocchio entrypoint macros (`entrypoint!`, `no_allocator!`, `nostd_panic_handler!`) against the 0.11.x API. Check the README before writing code samples.
- Whether Shank or Codama is the recommended IDL path for Pinocchio programs in 2026 is unconfirmed.

## 12.5 — Token-2022: the extension model and its integration hazards

### Concepts
- token2022-is-a-separate-program — Token-2022 (the Token Extensions Program) is a *different deployed program* at a different address from the original SPL Token program, not an upgrade of it; the two coexist permanently. | requires: [solana-program-model, spl-token-basics] | contrasts: [erc20-is-an-interface]
- token-program-id-is-a-seed — Because the token program id is a seed of the Associated Token Account derivation, the same wallet and the same-looking mint produce a *different* ATA address under Token-2022, which is why hardcoding the legacy program id silently breaks. | requires: [token2022-is-a-separate-program, solana-pda]
- extensions-are-tlv-state — Extensions are extra state appended after the classic mint/account layout in a type-length-value region, with an account-type discriminator byte, so accounts are variable-sized rather than the fixed 165 bytes everyone memorised. | requires: [token2022-is-a-separate-program]
- extensions-are-set-at-creation — Most mint extensions must be enabled when the mint is initialized and cannot be bolted on afterwards, which makes "what can this token do" a property fixed at launch, discoverable by reading the mint. | requires: [extensions-are-tlv-state]
- transfer-fee-extension — A transfer fee is withheld *inside the recipient's token account*, so the sender's debit and the recipient's spendable credit differ, and a separate withdraw authority later harvests the withheld amounts. | requires: [extensions-are-tlv-state] | contrasts: [erc20-fee-on-transfer]
- amount-sent-is-not-amount-received — Any protocol that credits a user based on the amount it *asked to transfer* rather than the vault's measured balance delta is wrong the moment a fee-bearing mint is listed. | requires: [transfer-fee-extension]
- transfer-checked-is-mandatory — Plain `transfer` fails on mints with fee or hook extensions; integrators must use `transfer_checked` (or `transfer_checked_with_fee`), which forces the mint account and decimals to be passed and validated. | requires: [transfer-fee-extension]
- transfer-hook-extension — A transfer hook makes every transfer CPI into a third-party program chosen by the mint authority, enabling allowlists and royalties — and handing arbitrary code execution inside your transfer path. | requires: [extensions-are-tlv-state] | contrasts: [erc777-hooks]
- extra-account-meta-list — Transfer hooks need extra accounts, resolved off-chain from an `ExtraAccountMetaList` PDA; weak validation of that list lets an attacker inject accounts into the hook invocation. | requires: [transfer-hook-extension]
- hook-must-verify-transferring-flag — A hook program can be invoked directly, not only during a real transfer, so a hook that does not check the account's `transferring` flag (and that the caller is Token-2022) can be driven out of context. | requires: [transfer-hook-extension]
- permanent-delegate-extension — A permanent delegate is an address that can transfer or burn from *any* account of that mint forever, which means listing such a mint gives its issuer unilateral power to drain your vaults. | requires: [extensions-are-tlv-state] | contrasts: [erc20-approval-model]
- non-transferable-and-default-frozen — `NonTransferable` makes tokens soulbound, and `DefaultAccountState = Frozen` makes every newly created account frozen until an authority thaws it; both break protocols that assume a freshly created vault can receive and move tokens. | requires: [extensions-are-tlv-state]
- rebasing-extensions — `InterestBearing` and `ScaledUiAmount` change the *displayed* balance relative to the stored raw amount, so accounting that mixes UI amounts with raw amounts drifts over time. | requires: [extensions-are-tlv-state]
- mint-close-and-reinit-hazard — With a close authority a mint can be closed and a new mint reinitialized at the same address with different extensions, leaving old token accounts attached to a mint whose rules have changed — the sharpest Token-2022 foot-gun. | requires: [extensions-are-set-at-creation, transfer-fee-extension]
- confidential-transfer-extension — Confidential transfers hold balances as ElGamal ciphertexts and prove correctness with zero-knowledge proofs verified by a dedicated on-chain proof program; amounts are hidden, participants are not. | requires: [extensions-are-tlv-state] | contrasts: [zk-privacy-mixers]
- confidential-pending-balance-counter — Incoming confidential transfers land in a pending balance with a `maximum_pending_balance_credit_counter`; set it too low and an attacker can spam small deposits to lock the account out of receiving more. | requires: [confidential-transfer-extension]
- allowlist-mints-not-programs — The correct integration posture is to allowlist specific mints (and the specific extension sets you support), not to allowlist the Token-2022 program and accept whatever mint shows up. | requires: [permanent-delegate-extension, transfer-hook-extension, amount-sent-is-not-amount-received]

### Primary sources
- [Solana docs — Token Extensions](https://solana.com/docs/tokens/extensions) — tier: canonical-docs — published: continuously updated — the authoritative list of extensions and what each does.
- [solana-program.com — Token-2022](https://www.solana-program.com/docs/token-2022) — tier: canonical-docs — published: continuously updated — the program's own documentation, including account layout, TLV extension encoding, and per-extension instruction sets.
- [SPL Token-2022: Don't shoot yourself in the foot with extensions — Neodyme](https://neodyme.io/en/blog/token-2022/) — tier: primary-analysis — published: 2024 — the single best source for integration hazards; written by auditors, organised extension by extension with concrete attacker scenarios. Teach from this.
- [Token-2022 Security Best Practices Part 1: Mint & Token Account (Offside Labs)](https://blog.offside.io/p/token-2022-security-best-practices-part-1) — tier: primary-analysis — published: 2025 — audit-firm checklist for validating mint and token account state before trusting it.
- [The Solana Token 2022 Specification (RareSkills)](https://rareskills.io/post/token-2022) — tier: secondary — published: 2025 — clear byte-level walkthrough of the layout and TLV encoding; good for the "how is this actually stored" lesson.
- [Solana Token-2022: Transfer Hooks and Fee-on-Transfer (Chainstack)](https://chainstack.com/solana-token-2022-fee-transfer-hooks/) — tier: secondary (vendor) — published: 2025 — practical walkthrough with code; vendor blog.
- [How to use Token Extensions to Collect Transfer Fees (QuickNode)](https://www.quicknode.com/guides/solana-development/spl-tokens/token-2022/transfer-fees) — tier: secondary (vendor) — published: 2024 — end-to-end fee lifecycle including withdrawal of withheld fees.

### Current state (Aug 2026)
- Token-2022 is positioned as the standard for institutional and stablecoin issuance on Solana, and the extension set has kept growing. The current mint-extension list spans: confidential transfers, confidential mint-burn, transfer fees, close mint, interest-bearing, non-transferable, permanent delegate, transfer hook, metadata pointer, metadata, group pointer, group, group member pointer, group member, **scaled UI amount**, **permissioned burn**, **pausable**.
- `ScaledUiAmount`, `Pausable`, `PermissionedBurn` and `ConfidentialMintBurn` are the newer additions and are exactly the ones existing tutorials omit. Any course listing "the Token-2022 extensions" from a 2023-2024 source is incomplete.
- The metadata pointer + metadata extensions let a mint carry its own name/symbol/URI on the mint account, which reduces the need for a separate Metaplex metadata account. Teaching "Solana token metadata means Metaplex" is now only half true.
- The Neodyme foot-gun catalogue from 2024 has aged well — the hazards it names (fee accounting, permanent delegate, mint reinit, default-frozen, hook validation) are still the live ones and still appear in 2026 audit checklists.
- Integration reality: many DeFi protocols still support only a curated allowlist of Token-2022 mints rather than the program generically, precisely because of the permanent-delegate and transfer-hook risks.

### Misconceptions
- Belief: Token-2022 is "SPL Token v2" and replaces the old program. | Reality: it is a separate program at a separate address; the original SPL Token program still holds the overwhelming majority of tokens and is not going away. | Why: version-number naming implies succession. | Source: https://www.solana-program.com/docs/token-2022
- Belief: If my code handles SPL tokens it handles Token-2022 tokens. | Reality: the program id differs, the ATA derivation differs, account sizes are variable, and `transfer` fails on several extension sets. | Why: the instruction interface is *mostly* compatible, which is worse than being obviously incompatible. | Source: https://neodyme.io/en/blog/token-2022/
- Belief: An account is a token account if it is 165 bytes. | Reality: Token-2022 accounts are variable-length because of TLV extensions; length-based type detection misclassifies or panics. Unpack and check the account type byte instead. | Why: a decade of legacy code did exactly this. | Source: https://neodyme.io/en/blog/token-2022/
- Belief: Checking a mint's current extensions is enough to know its rules. | Reality: a mint with a close authority can be closed and reinitialized at the same address with a different extension set, leaving pre-existing token accounts under stale assumptions — e.g. accounts created before a transfer fee existed can transfer fee-free. | Why: addresses feel immutable. | Source: https://neodyme.io/en/blog/token-2022/
- Belief: Transfer fees are paid by the sender, so my vault receives what was sent. | Reality: fees are withheld inside the recipient account; you must measure the balance delta, not trust the requested amount. | Why: the ERC-20 fee-on-transfer bug class, re-imported. | Source: https://neodyme.io/en/blog/token-2022/
- Belief: A transfer hook only runs during transfers. | Reality: a hook program is an ordinary program and can be invoked directly; it must verify the `transferring` flag and its caller. | Why: the name implies the runtime enforces the context. | Source: https://neodyme.io/en/blog/token-2022/
- Belief: Confidential transfers make Solana transactions anonymous. | Reality: they encrypt *amounts*; sender and recipient accounts are still public, and naive usage patterns (receive one transfer, immediately withdraw all) leak the amount to chain analysis anyway. | Why: "ZK" is read as "anonymous". | Source: https://neodyme.io/en/blog/token-2022/
- Belief: A frozen-by-default mint is a niche edge case. | Reality: it is the standard configuration for KYC-gated and regulated tokens, so any protocol that creates vault or escrow accounts on demand must handle it. | Why: developers test with permissionless mints only. | Source: https://solana.com/docs/tokens/extensions

### Practice ideas
- kind: implement — Create a Token-2022 mint with the transfer-fee extension, mint to two accounts, transfer between them, and then harvest and withdraw the withheld fees. Acceptance: you can print, for one transfer, the sender's debit, the recipient's spendable credit, and the withheld amount, and show all three differ as expected.
- kind: break — Write a naive "vault" program that credits a depositor with the amount named in the instruction. Deposit a fee-bearing Token-2022 mint into it. Acceptance: the vault becomes insolvent by exactly the fee, and you demonstrate the fix (measure `balance_after - balance_before`).
- kind: break — Create a mint with a permanent delegate, deposit it into your own test lending vault, then use the delegate to drain the vault. Acceptance: the drain succeeds, and you write the mint-validation check that would have rejected the listing.
- kind: implement — Write a transfer-hook program that maintains an allowlist, then attempt to invoke the hook directly outside a transfer. Acceptance: your first version is exploitable; after adding the `transferring`-flag and caller checks, the direct invocation fails.
- kind: fix — Take code that detects token accounts by `data.len() == 165` and rewrite it to unpack and inspect the account-type discriminator. Acceptance: it correctly classifies a legacy account, a Token-2022 account with two extensions, and a Token-2022 mint.
- kind: read — Read the Neodyme extension foot-gun post and produce a mint-onboarding checklist for a hypothetical DEX: which extensions you reject outright, which you support with extra handling, which are harmless. Acceptance: every extension in the current docs list appears in exactly one bucket with a stated reason.
- kind: measure — For a handful of real Token-2022 mints on mainnet, fetch the mint account over public RPC and decode which extensions are enabled. Acceptance: you report the extension distribution across your sample.

### Visual opportunities
- Byte-layout diagram: legacy 165-byte token account vs a Token-2022 account — base layout, account-type byte, then a chain of TLV extension records.
- Transfer-fee money flow: sender balance -> transfer_checked -> recipient spendable balance + withheld bucket -> harvest -> withdraw authority. Makes the "sent != received" point unavoidable.
- Transfer-hook call graph: user tx -> Token-2022 transfer_checked -> CPI into hook program -> extra accounts from ExtraAccountMetaList, with the two validation gates marked.
- Risk matrix: extensions on one axis, protocol types (DEX, lending, escrow, bridge, NFT marketplace) on the other, cells marked safe / needs-handling / reject.
- Mint close-and-reinit timeline showing old token accounts surviving a rule change.

### Gaps & uncertainties
- I did **not** verify the two program addresses in this session. The legacy SPL Token and Token-2022 program ids should be copied from the official docs, not from memory, before publishing.
- **Which extensions can be added after mint creation** varies by extension (metadata, for instance, behaves differently from transfer fee). I asserted the general rule "set at creation"; verify the per-extension truth table against solana-program.com before teaching it as absolute.
- **Confidential transfers**: the ZK proof verification program has had its own availability history (I recall a period where the proof program was disabled following a vulnerability, then re-enabled via a SIMD). I could not confirm its current status or name in this session. Do not teach confidential transfers as "available today" without checking.
- **Adoption claims** (e.g. that specific major stablecoins use Token-2022 with confidential transfers) are widely repeated but I did not verify any of them. Omit or verify individually.
- **Exact fixed sizes** (165-byte legacy token account, 82-byte mint, 355-byte multisig) come from prior knowledge plus one secondary mention; verify against the program docs.
- The Neodyme post predates several newer extensions (scaled UI amount, pausable, permissioned burn, confidential mint-burn), so its hazard catalogue is not exhaustive for 2026. There may be integration hazards specific to those newer extensions that no one has written up yet — flag this as genuinely open.
- Whether `transfer` is merely deprecated or hard-fails differs by extension; one source says a `MintRequiredForTransfer` error is returned when fee or hook extensions are present. I did not confirm the exact error name and conditions.

## 12.6 — Solana security: account-validation vulnerability classes and post-mortems

### Concepts
- accounts-are-untrusted-input — Every account in a Solana instruction is attacker-chosen data; the runtime guarantees only that the signatures on the transaction are valid and that the program owns what it writes. Everything else is the program's job to check. | requires: [sealevel-declared-access, solana-account-model] | contrasts: [evm-implicit-state-access]
- three-questions-per-account — For each account a program touches it must answer: who owns it, did it sign, and is it the *specific* account this operation is about. Nearly every Solana exploit class is a missing answer to one of those three. | requires: [accounts-are-untrusted-input]
- missing-owner-check — Reading and trusting an account's data without checking `account.owner == program_id` lets an attacker fabricate an account with any contents and pass it in. | requires: [three-questions-per-account, solana-account-owner] | contrasts: [account-wrapper-does-three-checks]
- missing-signer-check — Treating an account as an authority without checking `is_signer` lets anyone name the victim as the authority and act on their behalf. | requires: [three-questions-per-account] | contrasts: [typed-account-wrappers]
- account-type-confusion — Two account types with compatible byte layouts, both owned by the program, can be substituted for one another unless a discriminator distinguishes them; this is "type cosplay". | requires: [missing-owner-check, eight-byte-discriminator]
- account-substitution — Distinct from type confusion: the attacker passes a legitimate account of the *correct type* but the *wrong instance* (someone else's vault). Owner and discriminator checks both pass; only a relational check (`has_one`, seed derivation) catches it. | requires: [three-questions-per-account, has-one-links-accounts]
- arbitrary-cpi — Passing the "token program" as an account and CPI-ing into whatever was passed lets an attacker substitute a malicious program that reports success without moving anything. | requires: [accounts-are-untrusted-input] | contrasts: [typed-account-wrappers]
- pda-seed-collision — Concatenating variable-length seeds without delimiters or fixed widths makes distinct logical inputs derive the same PDA — ("ab","c") and ("a","bc") collide — letting one user's account be reached through another user's parameters. | requires: [solana-pda, seeds-bump-constraint]
- canonical-bump-matters — For one seed set there can be several valid bumps; only the canonical (highest) bump is what `find_program_address` returns, so a program that accepts a user-supplied bump admits multiple distinct PDAs for the same logical key. | requires: [solana-pda] | contrasts: [seeds-bump-constraint]
- reinitialization-attack — An account that can be initialized twice can have its state reset — balances zeroed, authority replaced — which is why `init_if_needed` needs an explicit already-initialized guard. | requires: [init-vs-init-if-needed]
- account-revival-attack — Closing an account by draining lamports is insufficient: within the same transaction an attacker can refund the rent and keep the stale data alive, so closing must also zero the data and write a closed-discriminator. | requires: [solana-rent-exemption]
- duplicate-mutable-accounts — Passing the same account for two different parameters creates aliasing, so a "transfer from A to B" can be turned into a self-transfer that credits without debiting unless the program checks the keys differ. | requires: [accounts-are-untrusted-input]
- sysvar-address-must-be-checked — Reading a sysvar (especially the instructions sysvar, used for introspection) without verifying the account's address lets an attacker supply a forged sysvar with fabricated contents. | requires: [missing-owner-check]
- rust-overflow-not-automatic — Rust's release profile wraps integer arithmetic silently unless `overflow-checks` is enabled or checked arithmetic is used; "Rust is safe" does not mean arithmetic is checked. | requires: [accounts-are-untrusted-input]
- not-all-exploits-are-code — The largest Solana losses increasingly come from oracle/collateral design and from operational compromise of privileged signers, not from account-validation bugs in audited code. | requires: [three-questions-per-account] | contrasts: [missing-owner-check]
- durable-nonce-as-attack-surface — Durable nonce accounts let a transaction be signed now and executed indefinitely later, so a signature obtained by deception never expires — the mechanism behind the largest 2026 Solana loss. | requires: [contention-failure-modes]

### Primary sources
- [coral-xyz/sealevel-attacks](https://github.com/coral-xyz/sealevel-attacks) — tier: canonical-docs — published: 2022, still the reference — the canonical taxonomy: each vulnerability class with an `insecure`, `secure`, and `recommended` (Anchor) program. This is the backbone the module should be built on.
- [Neodyme Solana Security Workshop](https://workshop.neodyme.io/) — tier: primary-analysis — published: 2022-2023 — hands-on capture-the-flag style walkthrough of the same classes from a professional audit firm.
- [A Hitchhiker's Guide to Solana Program Security (Helius)](https://www.helius.dev/blog/a-hitchhikers-guide-to-solana-program-security) — tier: primary-analysis (vendor) — published: 2024 — the best single narrative overview of the classes with Anchor mappings.
- [Solana Hacks, Bugs, and Exploits: A Complete History (Helius)](https://www.helius.dev/blog/solana-hacks) — tier: primary-analysis (vendor) — published: continuously updated — the running incident catalogue; use it as an index, then read each incident's own post-mortem.
- [sannykim/solsec](https://github.com/sannykim/solsec) — tier: secondary — published: continuously updated — curated link collection to audits, post-mortems and tooling.
- [Securing Solana: a developer's guide (Cantina)](https://cantina.xyz/blog/securing-solana-a-developers-guide) — tier: primary-analysis — published: 2025 — audit-firm guide, more current than sealevel-attacks on Anchor idioms.
- [Fuzz on the Beach: Fuzzing Solana Smart Contracts (arXiv 2309.03006)](https://arxiv.org/pdf/2309.03006) — tier: primary-analysis — published: 2023-09 — peer-reviewable definitions of missing-signer-check and missing-owner-check plus an empirical study; the citable academic source.
- [Explained: The Loopscale Hack (Halborn)](https://www.halborn.com/blog/post/explained-the-loopscale-hack-april-2025) — tier: primary-analysis — published: 2025-04 — clean write-up of a pricing/collateral-logic exploit rather than an account-validation one.
- [Lessons from the Drift hack (Chainalysis)](https://www.chainalysis.com/blog/lessons-from-the-drift-hack/) — tier: primary-analysis — published: 2026 — the 2026 headline incident; privileged-access and social-engineering failure, not a contract bug.
- [North Korean hackers attack Drift Protocol (TRM Labs)](https://www.trmlabs.com/resources/blog/north-korean-hackers-attack-drift-protocol-in-285-million-heist) — tier: primary-analysis — published: 2026-04 — attribution and attack-chain detail.

### Current state (Aug 2026)
- **Drift Protocol, ~1 April 2026, roughly $270-285M** — the largest Solana DeFi loss to date and the defining 2026 case study. The smart contracts were *not* compromised and had passed audits. The chain was: months of social engineering of Drift contributors, device compromise via a malicious repository and a fake TestFlight app, then inducing Security Council multisig signers to pre-sign **durable-nonce** transactions that looked routine but carried hidden admin authorizations. A fabricated asset ("CarbonVote Token") with a few thousand dollars of wash-traded liquidity was then accepted by the protocol's oracles as hundreds of millions in collateral. Attributed by TRM Labs to North Korean actors.
- The Solana Foundation announced a **security overhaul** within days of the Drift incident (early April 2026).
- **DefiTuna, 16 July 2026, ~$580K** — lending pools drained, leaving a matching USDC deficit. Smaller but recent; a leveraged-LP/lending protocol.
- **Loopscale, 26 April 2025, ~$5.8M** (5,726,725 USDC + 1,211 SOL) — manipulation of the internal pricing of RateX Principal Token collateral to take undercollateralised loans; ~12% of a ~$40M TVL. All funds returned by 29 April 2025 after a 10% bounty and immunity offer; patched with Sec3; vault withdrawals resumed 8 May 2025.
- The teaching implication for 2026: the classic account-validation classes are largely *solved by Anchor for people who use Anchor*, and the money is now leaving through (a) collateral and oracle design, and (b) privileged-key operations. A curriculum that stops at "check the owner" is teaching 2022.
- Counter-pressure: Pinocchio adoption (module 12.4) re-opens the classic classes for programs that leave Anchor, because none of those checks are generated for you.

### Canonical post-mortems worth teaching (oldest first)
- **Wormhole, 2 Feb 2022, ~$326M (120,000 wETH)** — account confusion / unvalidated sysvar. `verify_signatures` used a deprecated instruction-sysvar loader that did not verify the sysvar account's address, so a spoofed account supplied fabricated data that looked like a successful secp256k1 precompile verification. Fix: the `_checked` loader variant. Teaches: sysvar-address-must-be-checked, account-type-confusion.
- **Cashio, March 2022, ~$48-53M** — a chain of accounts where one link's `mint` field was never validated, letting worthless collateral mint the CASH stablecoin without limit; CASH depegged to effectively zero. Teaches: account-substitution, validating *every* link in an account chain, not just the first.
- **Crema Finance, July 2022, ~$8.8M** — a forged tick account passed to the program supplied fake price data, combined with a flash loan. Teaches: missing-owner-check.
- **Mango Markets, Oct 2022, ~$114M** — deliberately included as a *contrast*: no account-validation bug at all. The attacker moved the MNGO perp price on thin liquidity and borrowed against the inflated collateral. Teaches: not-all-exploits-are-code.
- **Slope wallet, Aug 2022, ~$4.1M across ~9,231 wallets** — also a contrast: seed phrases leaked through a wallet's logging pipeline. Frequently miscited as "Solana was hacked". Teaches: key management is not protocol security.
- **Loopscale, April 2025** and **Drift, April 2026** — the modern pair: collateral-pricing logic, then privileged-signer compromise.

### Misconceptions
- Belief: Solana programs cannot have reentrancy, so they are safer than Solidity. | Reality: self-recursive CPI is restricted, but the entire account-validation class has no EVM equivalent and has cost more money on Solana than reentrancy ever did on Ethereum. | Why: people compare against the vulnerability list they already know. | Source: https://github.com/coral-xyz/sealevel-attacks
- Belief: Using Anchor makes account-validation bugs impossible. | Reality: Anchor prevents the *default-unsafe* cases; `UncheckedAccount`, missing `has_one`, `init_if_needed`, unvalidated CPI program ids, and user-supplied bumps are all still live. | Why: "safe defaults" read as "safe". | Source: https://www.helius.dev/blog/a-hitchhikers-guide-to-solana-program-security
- Belief: An 8-byte discriminator plus an owner check means the right account was passed. | Reality: those prove the *type* and the *owner*; they say nothing about whether it is the caller's account. That needs a relational check. | Why: two of the three questions feel like all three. | Source: https://github.com/coral-xyz/sealevel-attacks
- Belief: Closing an account by transferring out its lamports deletes it. | Reality: the data survives until the runtime garbage-collects at end of transaction, so an attacker can refund rent in the same transaction and revive it with stale state. | Why: "no lamports = gone" is intuitive and wrong. | Source: https://github.com/coral-xyz/sealevel-attacks
- Belief: Rust prevents integer overflow. | Reality: release builds wrap silently unless `overflow-checks = true` is set or checked arithmetic is used. | Why: Rust's debug-build panic behaviour is what people remember. | Source: https://cantina.xyz/blog/securing-solana-a-developers-guide
- Belief: An audited protocol with no code bug cannot lose $285M. | Reality: Drift's contracts were audited and uncompromised; the loss came from socially engineered pre-signed durable-nonce transactions and a fabricated collateral asset. | Why: audits are sold as the security boundary. | Source: https://www.chainalysis.com/blog/lessons-from-the-drift-hack/
- Belief: A signed transaction that was not broadcast expires harmlessly. | Reality: with a durable nonce it does not expire; a signature obtained under false pretences stays executable indefinitely. | Why: the ~150-block blockhash expiry is taught as universal. | Source: https://www.coindesk.com/tech/2026/04/02/how-a-solana-feature-designed-for-convenience-let-an-attacker-drain-usd270-million-from-drift

### Practice ideas
- kind: break — Clone `coral-xyz/sealevel-attacks` and, for the owner-check, signer-check and type-cosplay lessons, write the attacking client for the `insecure` program yourself. Acceptance: three passing exploit tests, each of which fails against the `secure` version.
- kind: implement — Write a program with `seeds = [user_name.as_bytes(), pool_name.as_bytes()]` where both are variable-length strings. Then find a colliding pair. Acceptance: you produce two distinct (user, pool) inputs that derive the same PDA, and then fix it with length-prefixed or fixed-width seeds.
- kind: break — Write a vault program that accepts a `bump: u8` argument and passes it to `create_program_address`. Acceptance: you find a non-canonical bump that yields a second valid vault PDA for the same logical owner, and demonstrate double-accounting.
- kind: break — Implement an insecure close: drain lamports only. In one transaction, call close and then transfer rent back. Acceptance: the account still holds its old data after the transaction, and the fix (zero data + closed discriminator, or Anchor's `close =`) prevents it.
- kind: break — Write a "transfer between two of the user's accounts" instruction without checking `from.key() != to.key()`. Acceptance: you pass the same account twice and inflate a balance.
- kind: fix — Take a program that CPIs into an account-supplied "token program". Acceptance: you demonstrate a malicious program returning Ok without moving tokens, then fix it with an explicit program-id check (or `Program<'info, Token>`).
- kind: read — Read the Wormhole post-mortem and the Cashio post-mortem, then map each to a class in sealevel-attacks. Acceptance: for each, you can name the single missing check in one sentence.
- kind: write — Write an incident memo on Drift for a hypothetical protocol's security council: what operational controls (transaction simulation before signing, durable-nonce policy, collateral listing process) would have broken the chain. Acceptance: at least three controls, each tied to a specific step in the attack.

### Visual opportunities
- The "three questions" decision flow applied to a single account: owner? signer? correct instance? — with the Anchor construct that answers each, and the exploit that follows from skipping it.
- Side-by-side account structs showing type cosplay: identical byte layouts, same owner, no discriminator.
- PDA seed collision illustrated as string concatenation: two different seed tuples producing one identical byte string.
- Attack-chain timeline for Drift: months of social engineering -> device compromise -> durable nonce accounts created -> multisig signers pre-sign -> fake collateral listed -> drain. Emphasises that no code step exists in the chain.
- Loss-by-root-cause chart across Solana incidents: account validation vs oracle/collateral design vs key/operational compromise, to show where the money actually goes.

### Gaps & uncertainties
- **Cashio loss figure conflicts**: sources in this session say **$52.8M**, while the widely repeated figure elsewhere is **~$48M**. I did not resolve this. Do not publish a single number without checking the original post-mortem.
- **Drift loss figure conflicts**: reported as **~$270M** (CoinDesk) and **~$285M** (Crowdfund Insider, PYMNTS, TRM, Chainalysis). Different sources, different valuation snapshots. State the range, not a point estimate.
- **Mango Markets figure** (~$114M vs ~$116M) and **Wormhole** ($326M at the time; 120,000 wETH is the invariant figure) — prefer the token amount over the dollar amount where possible.
- I did not open the Wormhole or Cashio primary post-mortems in this session; the root-cause descriptions above come from secondary summaries that are consistent with my prior knowledge. Verify the specific function names (`load_instruction_at` vs `load_instruction_at_checked`, the `saber_swap.arrow` mint field) against the original write-ups before quoting them.
- **`sealevel-attacks` maintenance status** is unverified — it dates from 2022 and its Anchor examples may not compile against Anchor 1.x. Check before assigning it as a practice repo; the classes it teaches remain correct regardless.
- **Solana Foundation's April 2026 "security overhaul"** — I have the headline only. What it actually consists of (funding, audit programme, standards) is unresearched.
- I did not verify the DefiTuna root cause beyond "lending pools drained"; treat it as a data point, not a case study, until a post-mortem is read.
- No verified 2026 aggregate loss statistics for Solana specifically. The shared baseline's 2025 numbers are cross-chain, not Solana-specific — do not present them as Solana figures.

## 12.7 — Move (stub): resource model, Sui vs Aptos object models

> Stub node. Enough to orient an engineer and hand off to a dedicated track later; not a full treatment.

### Concepts
- move-origin — Move is a Rust-influenced smart contract language created at Meta for the Diem/Libra project and now the basis of Aptos and Sui after Diem was wound down. | requires: [] | contrasts: [solidity-origin, rust-on-solana]
- move-resources-are-linear — Move's central idea is the *resource*: a value the type system forbids from being copied or silently discarded, so "an asset" is enforced by the compiler rather than by a balance mapping the developer must maintain correctly. | requires: [move-origin] | contrasts: [erc20-balance-mapping]
- move-abilities — Instead of one resource keyword, Move types carry four abilities — `copy`, `drop`, `store`, `key` — and omitting `copy` and `drop` is what makes a type asset-like; `key` makes it storable at top level. | requires: [move-resources-are-linear]
- move-bytecode-verifier — Move ships a bytecode verifier that enforces resource, type and reference safety at deployment, so the guarantees survive even if someone hand-writes bytecode. | requires: [move-resources-are-linear] | contrasts: [evm-no-verifier]
- move-two-dialects — There is no single "Move": Aptos Move keeps Diem's account-rooted global storage, while Sui Move removed global storage entirely and replaced it with an object model. Code does not port between them. | requires: [move-origin]
- aptos-global-storage — In Aptos Move, resources live *inside accounts* and are addressed by (account address, type); `move_to`, `borrow_global` and `move_from` are the storage primitives, and a type can appear at most once per account. | requires: [move-two-dialects]
- sui-object-model — In Sui Move, every stateful thing is an object with a globally unique `UID`; objects are passed explicitly into transactions rather than fetched from global storage, which makes the read/write set statically visible. | requires: [move-two-dialects] | contrasts: [aptos-global-storage, sealevel-declared-access]
- sui-owned-vs-shared — A Sui object is address-owned, shared, immutable, or child-owned; transactions touching only owned objects skip full consensus and settle on a fast path, while shared objects require consensus ordering. | requires: [sui-object-model] | contrasts: [account-lock-semantics]
- aptos-block-stm — Aptos gets parallelism from Block-STM: execute optimistically, detect read/write conflicts, re-execute the losers — the opposite strategy to Solana's declared-access locking and to Sui's ownership-based fast path. | requires: [aptos-global-storage] | contrasts: [conflict-is-static-not-dynamic, sui-owned-vs-shared]
- three-parallelism-strategies — The clean comparison for a curriculum: Solana declares access statically and locks, Aptos executes optimistically and retries, Sui partitions by object ownership and skips consensus where it can. | requires: [aptos-block-stm, sui-owned-vs-shared, conflict-is-static-not-dynamic]
- sui-ptb — Sui's Programmable Transaction Blocks let one transaction chain many Move calls, passing outputs of one call as inputs to the next, which is closer to a script than to a single contract call. | requires: [sui-object-model] | contrasts: [evm-single-entrypoint]

### Primary sources
- [The Move Book](https://move-book.com/) — tier: canonical-docs — published: continuously updated — the standard language reference (Sui-flavoured in its current form); start here for abilities, resources and the module system.
- [Move: A Language With Programmable Resources (Diem whitepaper, Blackshear et al.)](https://developers.diem.com/docs/technical-papers/move-paper/) — tier: spec — published: 2019 — the original design paper; the clearest statement of *why* linear resources.
- [Aptos developer docs — Move on Aptos](https://aptos.dev/en/build/smart-contracts) — tier: canonical-docs — published: continuously updated — account-rooted global storage, resource groups, the Aptos Object model, and Move language extensions.
- [Sui documentation — Concepts: object model and transactions](https://docs.sui.io/concepts) — tier: canonical-docs — published: continuously updated — objects, ownership kinds, PTBs, and how Sui Move diverges from core Move.
- [Sui Lutris: A Blockchain Combining Broadcast and Consensus (arXiv 2310.18042)](https://arxiv.org/abs/2310.18042) — tier: primary-analysis — published: 2023-10 — the peer-reviewable account of why owned-object transactions can bypass consensus.
- [move-language/move (and aptos-labs / MystenLabs forks)](https://github.com/move-language/move) — tier: spec — published: continuously updated — the reference implementation, bytecode verifier and prover.

### Current state (Aug 2026)
- Both chains have moved their dialects forward independently. Aptos shipped "Move 2" language features (enums, receiver-style `x.method()` calls, index notation) and an Object model layered on account storage; Sui ships editioned Move (a "2024" edition and later) with its own additions. The divergence is widening, not converging.
- Practical takeaway for a curriculum: teach the *resource model* as the transferable idea and treat the storage model as chain-specific. Do not promise portability.
- I did **not** verify current mainnet versions, TPS claims, or 2026 release specifics for either chain in this session.

### Misconceptions
- Belief: Move is one language, so a Move contract runs on both Aptos and Sui. | Reality: Sui Move removed global storage and added the object model; storage-facing code is not portable. | Why: shared name and shared origin. | Source: https://docs.sui.io/concepts
- Belief: Linear types make Move contracts unhackable. | Reality: they eliminate accidental duplication and loss of assets; authorization logic, oracle design, and economic bugs are untouched. | Why: "resource safety" is oversold. | Source: https://move-book.com/
- Belief: Sui and Aptos both parallelise the same way because both are Move chains. | Reality: Aptos uses optimistic Block-STM with re-execution; Sui partitions by object ownership and bypasses consensus for owned objects. | Why: language and execution engine are conflated. | Source: https://arxiv.org/abs/2310.18042

### Practice ideas
- kind: implement — Write a Move module defining a `Coin`-like resource with no `copy` and no `drop` ability. Acceptance: the compiler rejects an attempt to duplicate it and an attempt to let it go out of scope, and you can quote both error messages.
- kind: read — Take one simple concept (a counter owned by a user) and write it twice: once as an Aptos resource under an account, once as a Sui owned object. Acceptance: you can articulate in three bullets what changed and why the transaction signature differs.
- kind: write — Produce a one-page comparison of the three parallel-execution strategies (Solana declared locks, Aptos Block-STM, Sui ownership fast path) naming, for each, what happens under heavy contention on a single hot piece of state. Acceptance: each row cites a primary source.

### Visual opportunities
- Same logical asset drawn three ways: an EVM balance mapping entry, an Aptos resource inside an account, a Sui object with a UID — showing where "ownership" physically lives.
- Sui transaction routing: owned-objects-only path (broadcast, no consensus) vs shared-object path (consensus), as a fork in one diagram.
- Ability matrix (copy/drop/store/key) with example types in each cell.

### Gaps & uncertainties
- **No version pins verified.** Aptos and Sui mainnet versions, current Move editions, and any 2026 language releases are unresearched. Do not publish version claims from this stub.
- The "sub-400ms settlement for the majority of transactions" figure came from a secondary tutorial site, not from Sui docs or the Lutris paper. Unverified — do not publish.
- I did not verify whether the Diem whitepaper URL still resolves; if not, the paper is mirrored on arXiv and in the move-language repo.
- Aptos "Move 2" feature list is from prior knowledge, not verified this session.
- Move Prover (formal verification) exists and is a genuine differentiator, but I did not research its current state on either chain.

## 12.8 — Cosmos (stub): appchain thesis, SDK, IBC v2

> Stub node. Orientation only; a dedicated track would need its own research pass.

### Concepts
- appchain-thesis — The Cosmos argument is that an application should get its own sovereign blockchain rather than rent block space on a shared one, so it controls its fee token, its validator set, its upgrade schedule and its full block space. | requires: [] | contrasts: [shared-l1-blockspace, rollup-thesis]
- appchain-tradeoff — Sovereignty costs you a validator set: an appchain must bootstrap and pay for its own security, which is the structural weakness that rollups (borrowed security) and shared-security schemes exist to fix. | requires: [appchain-thesis] | contrasts: [rollup-inherits-l1-security]
- cosmos-three-layers — The stack separates concerns cleanly: CometBFT (formerly Tendermint) is consensus + networking, the Cosmos SDK is the application framework, and ABCI is the interface between them — so you write state-machine logic, not a consensus engine. | requires: [appchain-thesis] | contrasts: [evm-as-shared-runtime]
- cometbft-instant-finality — CometBFT is a BFT protocol with single-slot deterministic finality: once a block commits it is final, with no reorgs and no probabilistic confirmation depth — but it halts rather than forks if more than a third of voting power is faulty. | requires: [cosmos-three-layers] | contrasts: [nakamoto-probabilistic-finality]
- sdk-modules — A Cosmos SDK chain is assembled from modules (bank, staking, gov, auth, and custom ones), each owning a slice of state in a key-value store and handling its own messages; a "smart contract" is optional, not the unit of deployment. | requires: [cosmos-three-layers] | contrasts: [evm-contract-deployment]
- cosmwasm-is-optional — Chains that do want deployable contracts add the CosmWasm module, which runs WebAssembly contracts written in Rust — a per-chain choice, not a property of Cosmos. | requires: [sdk-modules]
- ibc-light-client-trust — IBC is not a bridge with a multisig: each chain runs a *light client* of its counterparty and verifies proofs of the other chain's state, so the trust assumption is the counterparty's consensus, not a third-party committee. | requires: [cometbft-instant-finality] | contrasts: [multisig-bridge, optimistic-bridge]
- ibc-relayers-are-permissionless — Relayers move packets between chains but cannot forge them; they are liveness providers, not trust anchors, so anyone can run one. | requires: [ibc-light-client-trust]
- ibc-classic-vs-v2 — IBC Classic required a multi-step connection and channel handshake per application; IBC v2 (Eureka) collapses that model to reduce complexity and make it feasible to speak IBC from chains that are not Cosmos SDK chains. | requires: [ibc-light-client-trust]
- ibc-beyond-cosmos — The strategic point of IBC v2 is reach: light-client verification of Ethereum (and, on the roadmap, Solana and L2s) via Solidity IBC implementations, turning IBC from an intra-Cosmos protocol into a general interoperability protocol. | requires: [ibc-classic-vs-v2]
- interchain-security-and-shared-security — Because bootstrapping validators is the appchain thesis's weak point, Cosmos added shared-security arrangements letting a consumer chain rent security from a provider chain's validator set. | requires: [appchain-tradeoff]

### Primary sources
- [The Cosmos Stack Roadmap for 2026](https://cosmos.network/blog/the-cosmos-stack-roadmap-2026) — tier: canonical-docs — published: 2026 — the current, dated statement of SDK/CometBFT versions and what ships when. The single most useful source for "what is true now".
- [Cosmos SDK documentation](https://docs.cosmos.network/) — tier: canonical-docs — published: continuously updated — module system, ABCI, state stores, and the actual version matrix.
- [IBC protocol specification (cosmos/ibc)](https://github.com/cosmos/ibc) — tier: spec — published: continuously updated — the ICS specs themselves (ICS-20 token transfer, ICS-02 client, ICS-04 channel); this is the citable primary source, not a blog.
- [IBC documentation / ibc-go](https://ibc.cosmos.network/) — tier: canonical-docs — published: continuously updated — the reference Go implementation and the v2 migration material.
- [IBC Eureka Technical Walkthrough (Cosmos Labs)](https://www.cosmoslabs.io/blog/ibc-eureka-technical-walkthrough) — tier: primary-analysis — published: 2025 — what changed from Classic to v2 and why, at protocol level.
- [CosmWasm documentation](https://docs.cosmwasm.com/) — tier: canonical-docs — published: continuously updated — the Rust/Wasm contract layer for chains that want deployable contracts.

### Current state (Aug 2026)
- **Cosmos SDK v0.53 is the current recommended version**, with **v0.54 targeted for early Q2 2026** (verify whether it has actually shipped by now — the roadmap is a forward-looking document).
- **CometBFT v0.38 is the production standard.** Development of CometBFT **v1 and v2 was retracted** because of breaking changes; work refocused on the v0.38 line, with a **v0.39** planned carrying BLS signing and libp2p networking. Teaching "upgrade to CometBFT v1" is now wrong.
- Likewise, the previously-promoted **"Cosmos SDK v2"** direction was abandoned in favour of continuing the v0.5x line. Any 2024-era material describing SDK v2 as the future is stale.
- **IBC v2 (Eureka) was released in 2025.** The first release was compatible with Cosmos SDK v0.50 and CometBFT v0.38 — deliberately, so chains could adopt it without a disruptive upgrade. IBC Solidity implementations exist; **Solana and L2/EVM support is a Q2 2026 roadmap item**. Whether IBC Eureka is fully live for Ethereum mainnet transfers is something I could not confirm — see gaps.
- IBC network size is quoted at **over 115 IBC-supporting chains** as of 2026 (Cosmos Hub, Osmosis, Injective, Celestia, Stride, Axelar among them).
- 2026 roadmap headline items: native Proof-of-Authority, BLS signing, **Block-STM parallelisation** (the same optimistic-execution technique Aptos uses — see 12.7), IBC GMP/IFT, an IAVLx storage rewrite, and a stated Q4 target of "5,000 TPS and 500ms block times sustained in production".

### Misconceptions
- Belief: IBC is a bridge, so it carries bridge risk. | Reality: IBC verifies counterparty state with an on-chain light client; there is no external signer set to compromise. The historical bridge hacks were multisig/committee bridges, a different design. | Why: "cross-chain transfer" is assumed to mean "bridge". | Source: https://github.com/cosmos/ibc
- Belief: Cosmos chains all run smart contracts. | Reality: the default unit of deployment is a *module compiled into the chain binary*; CosmWasm is an opt-in module some chains add and many do not. | Why: every other ecosystem's unit of deployment is a contract. | Source: https://docs.cosmos.network/
- Belief: CometBFT v1 is the version to target. | Reality: v1 and v2 development was retracted; v0.38 is the production standard with v0.39 next. | Why: higher version numbers exist and look newer. | Source: https://cosmos.network/blog/the-cosmos-stack-roadmap-2026
- Belief: Cosmos SDK v2 is coming. | Reality: that direction was dropped in favour of continuing the v0.5x line (v0.53, v0.54). | Why: it was publicly roadmapped for a while. | Source: https://cosmos.network/blog/the-cosmos-stack-roadmap-2026
- Belief: Instant finality means the chain cannot fail. | Reality: CometBFT trades liveness for safety — with more than a third of voting power faulty or offline the chain *halts* rather than reorging. Cosmos chains have halted in practice. | Why: "finality" is read as "robustness". | Source: https://docs.cosmos.network/

### Practice ideas
- kind: implement — Scaffold a minimal Cosmos SDK chain and add one custom module with a single message type and one piece of state. Acceptance: you can submit the message via CLI on a single-node local chain and query the resulting state.
- kind: measure — Start two local chains and run a relayer to open an IBC v2 path, then transfer a token. Acceptance: you can point to the light-client update transaction on the receiving chain and explain what it proved.
- kind: read — Read ICS-20 (fungible token transfer) in the cosmos/ibc spec repo and trace what happens to a token's denom as it hops two chains. Acceptance: you can explain the ibc/<hash> denom trace and why a token that has crossed twice is not fungible with the original.
- kind: write — Write a one-page comparison for a product team: appchain vs L2 rollup vs contract on a shared L1, along the axes of security bootstrapping, upgrade control, fee token, and time to launch. Acceptance: each axis names the concrete mechanism, not a slogan.

### Visual opportunities
- The three-layer stack (CometBFT / ABCI / SDK modules) beside the equivalent EVM picture (client / EVM / contracts), making clear that a Cosmos "app" sits where the EVM would sit.
- IBC packet lifecycle: send on chain A -> relayer submits proof -> light client of A on chain B verifies -> receive -> acknowledgement back. With the relayer explicitly marked "cannot forge".
- Trust-model comparison: multisig bridge (trust a committee) vs optimistic bridge (trust a watcher plus a delay) vs IBC (trust the counterparty's consensus).
- Security-bootstrapping spectrum: sovereign appchain -> shared/interchain security -> rollup on a shared L1.

### Gaps & uncertainties
- **Is IBC Eureka live for Ethereum mainnet transfers today?** The roadmap document I read describes IBC v2 and IBC Solidity as *enabling* Ethereum connectivity and lists Solana/L2 support as Q2 2026, but does not state mainnet-live status. Secondary sources imply it is live. **Unresolved — do not assert either way.**
- **Cosmos SDK v0.54**: described as "coming early Q2 2026" in a roadmap published in 2026. Since it is now August 2026 it has probably shipped, but I did not verify. Check the SDK release page.
- The **"over 115 IBC chains"** figure comes from a single secondary source. Chain counts vary wildly by counting method (connected vs merely IBC-enabled). Do not publish as precise.
- The **Q4 2026 "5,000 TPS / 500ms"** figure is a stated *target* in a roadmap, not a measurement. Never present it as current performance.
- I did not research **Interchain Security / shared security** current status, naming, or adoption; the roadmap document I read did not mention Interchain Labs at all, though other sources do. The organisational picture (Interchain Foundation vs Interchain Labs vs Cosmos Labs) is unclear and should be checked before naming entities.
- **ATOM tokenomics, the Cosmos Hub's role, and the "Hub vs sovereign chains" politics** are unresearched and are a live source of ecosystem disagreement.
- No CosmWasm version pins verified.

