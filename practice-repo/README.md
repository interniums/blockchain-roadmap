# Chainpath practice repo

The working copy Chainpath points at. Every exercise here is unsolved on purpose: `forge build`
succeeds, `forge test` fails, and closing that gap is the practice.

Nothing in this repo is a solution. The tests are the specification, the `src/` files are stubs with
TODOs, and the failure messages are written to tell you what is missing rather than that something
is missing.

---

## Setup

```sh
curl -L https://foundry.paradigm.xyz | bash && foundryup   # if you do not have forge
cd practice-repo
forge build                                                 # must succeed
forge test                                                  # must fail - that is the starting state
```

The TypeScript and browser exercises need their own install:

```sh
pnpm install                                                # vitest, playwright, tsx, typescript
pnpm vitest run                                             # must fail - same starting state
pnpm playwright install chromium                            # only for the five tests/*.spec.ts
```

`forge-std` is vendored under `lib/`, so the Solidity half has no install step — a fresh clone builds as it
stands. Everything else the exercises need is in the standard library or already here.

`foundry.toml` is deliberately plain: solc 0.8.36, optimizer off, one remapping. The exercises are
about semantics, and a build profile that does anything clever would only add a variable.

### Pointing Chainpath at it

Give Chainpath the absolute path to this directory. It checks for `foundry.toml` and refuses
anything that is not a Foundry project.

---

## Two tiers, and why

Chainpath executes an acceptance command by parsing it into an argv array and spawning it with no
shell. A command that needs a shell — a pipe, an `&&` chain, a loop, a glob, a variable — cannot be
expressed that way, and handing a web page a shell is not a trade the project makes. So commands
split in two:

- **runnable** — the app runs it and grades the result from the test output.
- **manual** — the app shows you the command and you run it in this repo yourself, then say how it
  went. The attempt is recorded either way.

Manual is not a downgrade. It is the app being explicit about which of its claims it can check.

---

## What is in here

All 220 acceptance commands that name a path in this repo now resolve; the section below covers the
three Track 01 modules that are hand-authored in full. Three more — `fundamentals-distributed`,
`fundamentals-state` and `fundamentals-incentives` — live alongside them under `src/state/`,
`src/distributed/`, `src/incentives/` and `docs/`; see `docs/README.md` for that half.

### Track 01 · fundamentals-crypto

| Practice | Command | Tier |
| --- | --- | --- |
| Authorise yourself as an owner who was never set | `forge test --match-path test/EcrecoverZero.t.sol -vvv` | runnable |
| Claim an airdrop for an address that was never in the tree | `forge test --match-path test/MerkleForgery.t.sol -vvv` | runnable |
| Spend one approval twice by mirroring its signature | `forge test --match-path test/Malleability.t.sol -vvv` | runnable |

- `src/crypto/EcrecoverVault.sol` — the vault as written, plus your hardened copy.
- `src/crypto/MerkleAirdrop.sol` — a sorted-pair airdrop. The proof loop is shared between both
  airdrops so that the fix cannot land anywhere except the leaf encoding.
- `src/crypto/Payout.sol` — three payout contracts: the original, low-s rejection alone, and low-s
  plus a nonce-keyed replay guard.
- `test/crypto/` — fixtures shared by those suites: a mock token, the tree builder an airdrop
  operator would publish alongside the root.

### Track 01 · fundamentals-encoding

| Practice | Command | Tier |
| --- | --- | --- |
| Pass an authorisation check with the wrong arguments | `forge test --match-path test/PackedCollision.t.sol -vvv --gas-report` | runnable |
| Write RLP from scratch and round-trip a real mainnet transaction | `npx vitest run test/rlp.test.ts` | manual |

- `src/encoding/PermissionRegistry.sol` — the packed registry, your hardened copy, and a small
  measurement harness so the cost of the fix is a number you can quote.
- `src/encoding/rlp.ts` — an RLP codec stub. TypeScript, not Solidity.

### Track 01 · fundamentals-networks

| Practice | Command | Tier |
| --- | --- | --- |
| Measure how much later one node learns things than another | `node scripts/propagation-delta.mjs --blocks 200 --out results/propagation.json` | manual |
| Prove the mempool is a local opinion by diffing two of them | `node scripts/mempool-diff.mjs --samples 20 --out results/mempool-diff.json` | manual |

Both scripts run against live endpoints, so both need configuration before they do anything:

```sh
export CHAINPATH_RPC_A="wss://..."   # a provider, or your own node
export CHAINPATH_RPC_B="wss://..."   # a genuinely independent second view
```

Two URLs from the same provider will produce deltas near zero. That is a finding about the provider,
not about the network, and the scripts say so rather than pretending otherwise. Keep the URLs in the
environment: `.env` is gitignored and an RPC key does not belong in a shell history.

Results go to `results/`, which is gitignored. Each script also asks for a written conclusion in a
`WRITE_UP` constant at the top of the file, and exits non-zero while it is empty — the numbers are
half of these two practices, and the half that is easy to skip.

---

## Five toolchains, and what each one needs installed

The corpus is not one language. Foundry covers most of it, but 18 practices are Rust, Solana,
Anchor, Noir or Python, and each wants its own toolchain present before its command does anything.

| Practices | Command shape | Needs | Verified here |
| --- | --- | --- | --- |
| 4 | `cargo test` / `cargo run --bin bench` | rustc, cargo | yes |
| 1 | `cargo stylus check` | `cargo-stylus`, wasm32 target | yes, cargo-stylus 0.10.9 |
| 5 | `cargo test-sbf -p … --test …` | `solana` + `cargo-build-sbf` | yes |
| 3 | `anchor test` / `anchor build` | `anchor` CLI | yes |
| 4 | `pytest` / `uv run python` | Python 3.9+, pytest (or `uv`) | yes, with pytest |
| 1 | `nargo test --show-output` | `nargo` (Noir) | yes, nargo 1.0.0-beta.26 |
| 1 | `make devnet-up` | the Optimism monorepo | n/a, see the Makefile |

```sh
# Solana and Anchor
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
cargo install --git https://github.com/coral-xyz/anchor avm --force && avm install latest

# Stylus
rustup target add wasm32-unknown-unknown && cargo install cargo-stylus

# Noir
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash && noirup

# Python
uv sync                       # or: python3 -m venv .venv && .venv/bin/pip install pytest
```

Every command in the table has been run. Two are worth knowing the detail of.

**Noir**: `nargo compile`, `nargo check` and `nargo test` on 1.0.0-beta.26 — no warnings, and the
four criteria fail by name.

**Stylus**: `cargo stylus check` does two things, and only the first is local. It compiles the
contract to WASM and reports its size, then *simulates activation against a chain* — defaulting to
a local Nitro devnode on `:8547`, which is why it fails with a connection error out of the box. The
command therefore passes `-e $ARB_SEPOLIA_RPC_URL`, the same endpoint its `forge test` half already
uses. Verified against Arbitrum Sepolia: 4.7 KB, and a wasm data fee of 0.000067 ETH. That fee is
a gift to the practice — criterion 3 asks you to record activation cost as a measured number, and
this is where the first one comes from.

### Where the Rust lives

```
Cargo.toml         one virtual workspace, three member groups
  programs/*       Anchor programs. Anchor finds them by scanning this directory.
  sbf/*            raw solana-program exercises, built for SBF, exercised with litesvm
  rust/*           host-only Rust. No Solana runtime, so these test in seconds.
```

`default-members` scopes bare `cargo` commands to `sbf/*` and `rust/*`, so a plain `cargo test` does
not spend minutes building Anchor programs you were not asking about.

`rust/stylus-gas` is **excluded** from that workspace and is its own package, which is not a style
choice. A Stylus contract is a `cdylib` referencing WASM hostio symbols — `_msg_reentrant` and
friends — that exist only inside the Stylus runtime, so it cannot link for the host at all. As a
workspace member it broke `cargo test --workspace`, which is another practice's acceptance command.
It carries its own `Cargo.lock` and `rust-toolchain.toml` because cargo-stylus requires both: the
toolchain and the lockfile are part of the deployment hash, so `cargo stylus verify` can only
reproduce your bytes if it can reproduce your compiler.

---

## Two kinds of file in here, and how to tell them apart

Every exercise file falls into one of two classes, and the difference matters when you open one.

**Hand-authored** — nine files. A real specification: it invents the API the exercise needs and
asserts actual behaviour against it. `test/state/node-types.test.ts` is the reference: it names
`classifyNode`, `BRANCH_ITEM_COUNT` and `readPathNode`, and its assertions are about tries rather
than about the criteria. Paired with a `src/` stub whose TODOs tell you what to write.

**Generated** — 438 files, each carrying the line `CHAINPATH-GENERATED-SCAFFOLD` near the top.
Two halves:

- **A test** with one failing case per acceptance criterion, the criterion as the failure message.
  A checklist, not a specification, and the header of each file says so.
- **A `src/` stub** where the answer goes: named after its test, carrying the practice's spec and
  the concepts it covers by title with a one-line gloss each — a mean of 4.9 of them, taken from
  the content graph rather than invented.

A Solidity test imports its stub and deploys it in `setUp`, so the first function you write there is
callable from the test without touching its plumbing. `new Subject()` needs the contract to exist
and nothing more, which is why that wiring names no method.

TypeScript stubs are not imported, and that is the honest answer rather than a missing feature: a
module is its named exports, so exporting a class or a function to make the wiring look symmetrical
would be inventing your API. The test header says which file to write in.

No stub is generated for `read` or `write` practices — one reads code that lives elsewhere, the
other produces a document — nor opposite a hand-authored test, which already has its own pair.

The generated ones exist because of what the alternative was. Before them, every acceptance command
outside Track 01 named a path that did not exist, so the app reported

```
could-not-run: no JUnit output (exit 0); the test path may not exist
```

which is indistinguishable from a broken app. Now the same command fails with your six criteria
listed by name, and each row goes green as you meet it. Replacing a `fail(...)` with a real
assertion is the first move in every one of these.

Regenerate from the content with:

```sh
npm run scaffold:practice --dry     # from the Chainpath root, not here
npm run audit:scaffold              # does every command have something to run?
```

A hand-authored file is never overwritten — the marker is the only thing that authorises a rewrite,
and the generator lists everything it left alone.

Not generated, on purpose:

- **Your write-ups.** 42 commands check a file you write (`docs/*.md`, `answers/*.md`). A template
  with the right headings would pass `grep -qF "## Findings"` while saying nothing.
- **Function signatures in a stub.** The hand-authored pairs invent an API — `src/state/node.ts`
  declares `classifyNode`, `BRANCH_ITEM_COUNT` and `readPathNode` — and that took judgement about
  the material. A generated guess at the same thing would be worse than an empty file, because you
  would build to it.
- **The Optimism devnet.** One practice runs `make devnet-up`, which brings up a dozen services
  from the upstream monorepo. No file stands in for cloning it; the `Makefile` says so and exits 1.

---

## Layout

```
foundry.toml            solc 0.8.36, optimizer off, forge-std only
src/crypto/             contracts for the fundamentals-crypto practices
src/encoding/           contracts and the RLP codec for fundamentals-encoding
src/<module-id>/        generated stubs, one per generated test. The full module id, not the
                        short suffix the hand-authored dirs use: three suffixes collide across
                        tracks (accounts, fuzzing, proof-systems), so the short form cannot
                        be a path.
package.json            vitest, playwright, tsx, typescript
vitest.config.ts        two test roots: test/ and tests/; .spec.ts left to playwright
playwright.config.ts    the five browser exercises, two named projects
test/*.t.sol            one suite per practice, named to match its acceptance command
test/**/*.test.ts       vitest suites
tests/*.spec.ts         playwright suites - .spec.ts is playwright's by convention here
test/crypto/            shared fixtures - mock token, tree builder
script/*.s.sol          forge script targets
scripts/                entry points named to match the acceptance commands
scripts/networks/       the measurements themselves, plus their shared plumbing
drills/                 one red-team drill and its report
sbf/                    raw solana-program exercises (cargo test-sbf)
programs/               Anchor programs (anchor test)
rust/                   host-only Rust exercises
circuits/               Noir packages (nargo test)
solutions/              Python entry points
results/                measurement output (gitignored)
docs/                   written-exercise prompts, and where your write-ups go
```

Test files sit directly in `test/` because `forge --match-path` matches the literal path in each
practice's acceptance command, and those paths are flat.

---

## How to read a failing suite

The starting state is failures, so the useful question is which kind.

- An acceptance criterion, word for word — a generated placeholder you have not replaced yet. It is
  telling you the requirement, not diagnosing your code. Its `src/` stub is where the answer goes;
  the test names it.
- `TODO: <function> is unimplemented` — a stub you have not written yet. The message names the file.
- `Error != expected error` — the contract reverted, but for a different reason than the
  specification asks for. Usually a missing check, not a wrong one.
- `next call did not revert as expected` — a guard you have not added.
- An assertion message — read it; each one states what should have been true.

Tests named `test_evidence_` and `test_fixture_` pass from the start. They document the defect or
set the scene, and they are meant to keep passing. If one of them starts failing, you have changed
something that was not yours to change.
