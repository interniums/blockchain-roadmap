# Measured gas constants — empirical, not sourced

Resolves a block of conflicts in `CONFLICTS.md` that no amount of further reading would have settled.

## Environment (record this — the numbers are environment-dependent)

| | |
|---|---|
| forge / cast | **1.7.1**, commit `4072e48705af9d93e3c0f6e29e93b5e9a40caed8`, built 2026-05-08 |
| solc | **0.8.36** (`+commit.8a079791`) |
| optimizer | **off** |
| EVM version | solc default (`osaka` since 0.8.31) |
| measured | 2026-08-25 |

## Method

Each operation is wrapped in `gasleft()` deltas inside inline assembly. **Harness overhead is ~16-17 gas**
(two `GAS` opcodes plus the stack/assignment work); subtract it to recover the opcode constant.

⚠ **First attempt produced garbage** — every *read* measured 9 gas, because `pop(sload(0))` has no
observable effect and was eliminated as dead code even with the optimizer off. The fix was to assign
each read into a storage `sink` so it cannot be removed. **Any future gas probe must do the same** —
this is a trap worth teaching directly in Track 05.

## Results

| Operation | Measured | Constant | Conflict resolved |
|---|---|---|---|
| SLOAD cold | 2116 | **2100** | ✅ Settles 2100-vs-800. **800 was an early EIP-2929 draft value.** |
| SLOAD warm | 118 | **100** | ✅ |
| BALANCE cold | 2617 | **2600** | ✅ |
| BALANCE warm | 117 | **100** | ✅ |
| EXTCODESIZE cold | 2617 | **2600** | ✅ Same account-access cost as BALANCE |
| EXTCODESIZE warm | 117 | **100** | ✅ |
| TSTORE | 114 | **100** | ✅ |
| TLOAD | 116 | **100** | ✅ |
| SSTORE zero→non-zero (cold slot) | 22113 | **20000 + 2100 cold** | ✅ |
| SSTORE non-zero→non-zero (cold slot) | 5012 | **2900 + 2100 cold** | ✅ |
| SSTORE warm no-op (same value) | 112 | **100** | ✅ |
| LOG per-topic increment | 378 (LOG0 784 → LOG1 1162 → LOG2 1540) | **375 per topic** | ✅ |

## Reentrancy guard: the headline conflict, settled

Circulating figures were ~7,100 (storage) vs ~5,000 (storage) vs ~200 (transient). **None matched.**

| Guard | Guarded call | Unguarded call | **Overhead** |
|---|---|---|---|
| Storage (`uint256` lock, warm) | 4312 | 1208 | **3104** |
| Transient (`TSTORE`/`TLOAD`) | 1490 | 1206 | **284** |

**Transient is ~11× cheaper here, not ~35× as the 7100/200 pairing implied.**

The ~7,100 figure assumes a **cold** lock slot — true on the first guarded call in a transaction, false
on every subsequent one. The honest teaching point is that the storage guard's cost is
**cold/warm-dependent and ranges from ~3,100 to ~7,100**, while the transient guard is flat at ~284.

**Do not publish a single number for the storage guard.** Teach the range and the reason.

## Still unmeasured

Recalled but not yet verified: EIP-3529 refund caps (4800/slot, gasUsed/5), the 2300 stipend,
9000 value-transfer, 25000 new-account, 200/byte code deposit, memory expansion coefficients,
and the EIP-7623 calldata floor price. Each is measurable with the same harness.

## Reproduce

Probe project: `scratchpad/gasprobe`. Two suites — `Probe.t.sol` (writes, logs, guards) and
`Probe2.t.sol` (reads, with sinks). `forge test -vv`.

---

# Foundry documentation link audit — 2026-08-25

An agent warned that `book.getfoundry.sh` links were stale and that "every doc link needs
re-verification before shipping." **Verified: directionally right, factually inverted.**

- **37 unique Foundry doc links** across the corpus.
- **35 return 200. 2 are broken — and both are on the NEW domain**, not the old one.
- All three `book.getfoundry.sh` links flagged as stale **still return 200**.

| URL | Status |
|---|---|
| `https://getfoundry.sh/forge/advanced-testing/fuzz-testing/` | **404** |
| `https://getfoundry.sh/releases/stable/` | **404** |
| `book.getfoundry.sh/cheatcodes/roll-fork` | 200 |
| `book.getfoundry.sh/cheatcodes/make-persistent` | 200 |
| `book.getfoundry.sh/guides/v1.0-migration` | 200 |

**Correction to the sweep's finding:** `book.getfoundry.sh` is not dead — it still serves. The migration
to `getfoundry.sh` left some *new-domain* paths broken, the opposite of what search results implied.
Notably `/releases/stable/` 404s, which is very likely why no agent could resolve the Foundry stable
version from the web. `forge --version` answered it in one second.

**Rule for the content pipeline:** link-check in CI against live HTTP, and never trust a search-result
claim that a domain has moved. Both broken links here would have shipped.
