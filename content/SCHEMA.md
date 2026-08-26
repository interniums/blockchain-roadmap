# Content schema — the authoring contract

Every agent emits YAML matching these shapes exactly. `content:lint` fails the build on any deviation.
IDs are **kebab-case, globally unique, and immutable once written** (see plan §17 — renames are
`formerIds`, never edits).

## File layout

```
content/
  tracks/<track-id>.yaml            # 13 files
  modules/<module-id>.yaml          # 106 files
  concepts/<module-id>.yaml         # one file per module, holding that module's concepts
  sources/<track-id>.yaml           # one file per track, holding that track's sources
  practices/<practice-id>.yaml
```

## Track

```yaml
id: evm                        # kebab-case, no number prefix
number: 3
kind: core                     # core | elective
title: The Ethereum Machine
tagline: The state transition function, opened up.
capabilities:                  # plain English, what you can DO after. Not topics.
  - Read any mainnet transaction and explain what it cost and why
layout: { lane: spine, row: 3 }   # lane: spine | left | right
entersFrom: [ledgers]          # track ids
feedsInto: [solidity, scaling, protocol]
modules: [evm-accounts, evm-state-tries]   # ordered
```

## Module

```yaml
id: evm-accounts
trackId: evm
order: 1
title: Accounts & delegation
summary: One paragraph. What this module is for.
layout: { lane: spine, row: 1 }
teaches: [account, eoa, delegation-designator]     # concept ids introduced here
lessons:
  - id: evm-accounts-what-is-an-account
    order: 1
    title: What an account actually is
    teaches: [account, eoa]        # subset of the module's teaches
    assumes: [key-value-state]     # concept ids from elsewhere
    readingMin: 12                 # 8-20. If >20, split the lesson.
    status: outlined               # outlined | drafted | reviewed | published
practices: [evm-accounts-delegate-takeover]
reflectionPrompt: >
  An open question the learner answers in writing at the end of the module.
```

## Concepts (one file per module)

```yaml
moduleId: evm-accounts
concepts:
  - id: delegation-designator
    title: Delegation designator
    oneLine: The 23-byte value written into an EOA's code slot that points at delegate code.
    statement: >
      Multi-sentence precise statement. This is what the learner is tested on and what
      the concept page shows. Be exact.
    volatility: evolving           # stable (365d) | evolving (120d) | hot (45d)
    edges:
      - { to: eoa, type: requires }
      - { to: eoa-vs-contract-binary, type: supersedes }
    sources: [eip-7702]            # source ids
    misconceptions:
      - belief: An account with code is a contract.
        reality: A delegated EOA has code and is still key-controlled.
        why: EIP-7702 broke the binary.
        source: eip-7702
    paysOffIn: [solidity-delegatecall]    # REQUIRED for Track 01 concepts
```

**Edge types:** `requires` (hard prereq, gates readiness) · `recommends` (soft) · `deepens` ·
`contrasts` · `applies` · `supersedes`. Only `requires` gates.

## Sources (one file per track)

```yaml
trackId: evm
sources:
  - id: eip-7702
    tier: spec                   # spec | canonical-docs | primary-analysis | secondary
    title: "EIP-7702: Set Code for EOAs"
    url: https://eips.ethereum.org/EIPS/eip-7702
    publishedAt: "2025-05"
    retrievedAt: "2026-08-25"
    verifiedAt: "2026-08-25"
    vendor: false                # true if published by a party selling the thing
    internal: false              # true ONLY for a citation to a file in this repo (e.g. constants
                                 # measured on this machine). Exempts it from URL checking. Never
                                 # use it to dodge sourcing — an invented external source is worse,
                                 # but so is an internal one that could have been a real citation.
```

## Practice

```yaml
id: evm-accounts-delegate-takeover
moduleId: evm-accounts
kind: break                      # implement | break | fix | read | measure | write
title: Take over a naively delegated EOA
concepts: [delegation-designator, delegate-is-total-control]
spec: >
  What to build, precisely enough to start without further questions.
acceptance:
  command: forge test --junit --match-path test/DelegateTakeover.t.sol
  criteria:
    - A test proves a third party can drain the delegated account
    - A second test proves the fixed delegate resists it
hints:                           # exactly 3, escalating
  - Nudge.
  - Approach.
  - Near-solution.
difficulty: 3                    # 1-5
```

## Hard rules the linter enforces

1. Every `to:` in an edge resolves to a real concept id.
2. No cycle in `requires`.
3. Every concept has >=1 source at tier `spec` or `canonical-docs` — **unless** it declares
   `claimKind: empirical`, in which case `primary-analysis` is sufficient. Use this only for claims
   about markets or observed behaviour, where no specification exists to cite (e.g. "exclusive order
   flow drives builder concentration"). The declaration makes the exemption visible; it can never be
   taken silently.
4. Every Track 01 concept has a non-empty `paysOffIn`.
5. Every module in Tracks 03-13 has >=1 practice.
6. No two tracks or modules share a `layout` lane+row.
7. No concept id defined twice.
8. A claim listed in `docs/research/CONFLICTS.md` may not be stated as fact.
