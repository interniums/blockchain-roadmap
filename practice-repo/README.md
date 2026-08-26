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
forge install foundry-rs/forge-std                          # only if lib/ is absent
forge build                                                 # must succeed
forge test                                                  # must fail - that is the starting state
```

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

Three Track 01 modules are scaffolded below. Three more — `fundamentals-distributed`,
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

## The TypeScript exercises need one thing this repo does not ship

`test/rlp.test.ts` is a vitest suite, and this repo has no `package.json` — it is a Foundry project
that also carries a handful of TypeScript exercises. Before running any of them:

```sh
npm init -y && npm pkg set type=module
npm install -D vitest typescript
npx vitest run test/rlp.test.ts
```

The Solidity exercises do not care whether you do it.

---

## Layout

```
foundry.toml            solc 0.8.36, optimizer off, forge-std only
src/crypto/             contracts for the fundamentals-crypto practices
src/encoding/           contracts and the RLP codec for fundamentals-encoding
test/*.t.sol            one suite per practice, named to match its acceptance command
test/rlp.test.ts        the RLP specification
test/crypto/            shared fixtures - mock token, tree builder
scripts/*.mjs           entry points named to match the acceptance commands
scripts/networks/       the measurements themselves, plus their shared plumbing
results/                measurement output (gitignored)
docs/                   written-exercise prompts for the other Track 01 modules
```

Test files sit directly in `test/` because `forge --match-path` matches the literal path in each
practice's acceptance command, and those paths are flat.

---

## How to read a failing suite

The starting state is failures, so the useful question is which kind.

- `TODO: <function> is unimplemented` — a stub you have not written yet. The message names the file.
- `Error != expected error` — the contract reverted, but for a different reason than the
  specification asks for. Usually a missing check, not a wrong one.
- `next call did not revert as expected` — a guard you have not added.
- An assertion message — read it; each one states what should have been true.

Tests named `test_evidence_` and `test_fixture_` pass from the start. They document the defect or
set the scene, and they are meant to keep passing. If one of them starts failing, you have changed
something that was not yours to change.
