# Practice exercises: distributed, state, incentives

Starter scaffolding for three Track 01 modules. Every test in here **fails on
purpose**. The tests are the specification — read them first, then implement
against them. There are no solutions in this repository.

## What is here

| Module | Source | Tests | Prompts |
| --- | --- | --- | --- |
| `fundamentals-distributed` | `src/distributed/` | `test/distributed/` | `docs/distributed/`, `docs/incidents/` |
| `fundamentals-state` | `src/state/` | `test/compact-encoding.test.ts`, `test/state/` | `docs/state/` |
| `fundamentals-incentives` | `src/incentives/` | `test/slashing.test.ts`, `test/incentives/` | `docs/incentives/` |

Two test files sit at the repository root rather than in a module folder
(`test/compact-encoding.test.ts` and `test/slashing.test.ts`). That is not an
accident: those are the exact paths the practices' acceptance commands name.

## Before anything runs

This repository is a Foundry project. The three modules scaffolded here are
TypeScript, and there is no `package.json` yet — so nothing in `src/state`,
`src/distributed` or `src/incentives` can execute until you add one:

1. Add a `package.json` with `vitest` and `typescript` as devDependencies.
2. `npm install`.
3. Delete `test/_vitest-shim.d.ts` — it is a types-only placeholder that exists
   so the starter tests typecheck before vitest is installed, and it will
   shadow vitest's real types once the package is present.
4. Add a `tsconfig.json` for this repository. Set `"target": "ES2020"` or later
   so bigint literals (`32n`) work; the starter code uses `BigInt(...)` calls
   because it has to compile under an older target today.

## Every exercise here runs in your own terminal

The Chainpath app executes a practice's acceptance command for you only when
that command can be expressed as a plain argument list with no shell. All six
practices in these three modules fall on the other side of that line:

| Practice | Acceptance command | Why the app will not run it |
| --- | --- | --- |
| `measure-finality-lag` | `node scripts/finality-lag.mjs --minutes 60 …` | `--minutes` is not an allowed flag |
| `classify-three-incidents` | `npx markdownlint docs/incidents/*.md && node …` | shell chaining and a glob |
| `verify-a-real-getproof` | `node scripts/verify-getproof.mjs --address <address> …` | placeholder angle brackets |
| `compact-encoding-from-scratch` | `npx vitest run test/compact-encoding.test.ts` | `npx` is not an allowed binary |
| `price-the-attack-live` | `node scripts/attack-cost.mjs --source beacon …` | `--source` is not an allowed flag |
| `implement-the-slashing-formula` | `npx vitest run test/slashing.test.ts` | `npx` is not an allowed binary |

The app shows you the command and records your attempt; you run it and report
what happened. Nothing is lost — grading was always your reading of the
acceptance criteria, and half of these exercises are written analysis that no
test runner could grade anyway.

## Scripts you still have to write

Four acceptance commands invoke scripts under `scripts/`. The libraries they
need are here and specified by tests; the scripts themselves are thin I/O
wrappers you write:

- `scripts/finality-lag.mjs` → uses `src/distributed/finality-lag.ts`
- `scripts/verify-getproof.mjs` → uses `src/state/proof.ts`
- `scripts/attack-cost.mjs` → uses `src/incentives/attack-cost.ts`
- `scripts/check-incident-writeup.mjs` → checks `docs/incidents/`

Keep the network in the script and the judgement in `src/`. That split is why
the tests here run in a second instead of an hour.
