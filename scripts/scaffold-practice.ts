/**
 * Generate the missing files in `practice-repo/` so that every acceptance command runs.
 *
 * THE PROBLEM THIS SOLVES, precisely. Only Track 01 was ever scaffolded. For every other practice
 * the acceptance command names a path that does not exist, so the runner reports
 *
 *     could-not-run: no JUnit output (exit 0); the test path may not exist
 *
 * before the learner has written a line. That message is indistinguishable from a broken app. The
 * learner cannot tell "I have not done this yet" from "Chainpath is not working", and the practice
 * screen's whole premise — that a red result is information — collapses.
 *
 * WHAT IS AND IS NOT GENERATED. A generator cannot write the exercise. Look at
 * `practice-repo/test/state/node-types.test.ts`: it invents an API (`classifyNode`,
 * `BRANCH_ITEM_COUNT`, `readPathNode`) and asserts real behaviour against it. That is a
 * specification, it took judgement about the material, and no template produces it.
 *
 * So what is generated is deliberately one rung lower and says so on its face: the file exists at
 * the right path, it compiles, and it fails with one named failing case per acceptance criterion.
 * That converts a harness error into a real test failure whose message is the requirement. The
 * runner's per-test grading then works — each criterion is a row that goes green as you meet it —
 * and the learner replaces the placeholder with a genuine assertion as they go. The header of every
 * generated file says this, so nobody mistakes a checklist for a specification.
 *
 * WHAT IS DELIBERATELY LEFT ABSENT:
 *   - Learner deliverables. 45 commands check a file the learner writes (`docs/*.md`,
 *     `answers/*.md`, `results/*.json`). Creating those would make `test -s` pass against an empty
 *     template, which is worse than the honest failure of a missing file.
 *   - `src/` stubs. The generated tests import nothing, because a fabricated API would be a lie
 *     about the shape of the answer. Where a real stub is wanted it is hand-written.
 *   - Foreign toolchains. 16 commands are `cargo`, `anchor`, `nargo` or `pytest`; each needs a
 *     whole project (Cargo workspace, Anchor program, Nargo package) rather than a file, and
 *     guessing at those layouts would produce something that fails to build. Reported, not faked.
 *
 * SAFETY. A file is only ever written if it does not exist, or if it exists and carries this
 * script's marker. A hand-authored file is never touched, and the run reports every one it skipped
 * for that reason. Idempotent: running twice writes nothing the second time.
 *
 *   tsx --import ./scripts/_stub-server-only.cjs scripts/scaffold-practice.ts --dry
 *   tsx --import ./scripts/_stub-server-only.cjs scripts/scaffold-practice.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { allTracks, getModulesOf, getPracticesOf } from '../src/lib/content/load';
import type { Practice } from '../src/lib/content/types';

const REPO = path.join(process.cwd(), 'practice-repo');
const apply = !process.argv.includes('--dry');

/** Every generated file carries this. It is the only thing that authorises an overwrite. */
const MARKER = 'CHAINPATH-GENERATED-SCAFFOLD';

// ---------------------------------------------------------------------------------------------
// What each acceptance command needs to pre-exist
// ---------------------------------------------------------------------------------------------

type Need =
  | { kind: 'sol-test'; file: string }
  | { kind: 'sol-script'; file: string }
  | { kind: 'ts-test'; file: string }
  | { kind: 'harness'; file: string }
  | { kind: 'rust-test'; file: string }
  | { kind: 'rust-bin'; file: string }
  | { kind: 'noir-test'; file: string }
  | { kind: 'py-test'; file: string }
  | { kind: 'py-script'; file: string }
  | { kind: 'foreign'; tool: string };

/**
 * The foreign-toolchain practices, mapped by hand — and it has to be by hand.
 *
 * Everywhere else the target file is read out of the command, because the command names it:
 * `--match-path test/X.t.sol` says where the file goes. These commands do not — `anchor test` and
 * `nargo test --show-output` name no path at all, they build whatever the workspace holds — so the
 * mapping is a judgement recorded here rather than guessed by a regex.
 *
 * The five `cargo test-sbf` practices used to share the single string `cargo test-sbf -- --nocapture`.
 * That string cannot identify a practice: cargo picked the alphabetically first workspace member and
 * fail-fast stopped there, so four of the five ran somebody else's tests and never reached their own.
 * Their commands now carry `-p <package> --test <target>`, which is the same move `--match-path` is
 * for forge. The package and target names below are the other half of that pair — change one and you
 * must change the other.
 *
 * The layout the three roots imply:
 *   programs/*   Anchor programs. Anchor discovers them by scanning this directory.
 *   sbf/*        raw solana-program exercises, built by `cargo test-sbf`.
 *   rust/*       host-only Rust, no Solana runtime.
 *   circuits/*   Noir packages, members of the Nargo workspace.
 */
const FOREIGN_TARGETS: Record<string, Need[]> = {
  // --- cargo test-sbf. One package per subject; the three Sealevel exploits share a package
  //     because they are three readings of the same program, which is the point of that practice.
  'altvm-pinocchio-same-program-twice': [
    { kind: 'rust-test', file: 'sbf/pinocchio-twice/tests/same_program_twice.rs' },
  ],
  'altvm-token-2022-break-the-naive-vault': [
    { kind: 'rust-test', file: 'sbf/token-2022-vault/tests/break_the_naive_vault.rs' },
  ],
  'altvm-solana-security-collide-two-pdas': [
    { kind: 'rust-test', file: 'sbf/sealevel-attacks/tests/collide_two_pdas.rs' },
  ],
  'altvm-solana-security-revive-a-closed-account': [
    { kind: 'rust-test', file: 'sbf/sealevel-attacks/tests/revive_a_closed_account.rs' },
  ],
  'altvm-solana-security-three-exploits-from-sealevel-attacks': [
    { kind: 'rust-test', file: 'sbf/sealevel-attacks/tests/three_exploits.rs' },
  ],

  // --- anchor test, which in Anchor 1.x runs `cargo test` after building. Two practices share the
  //     bare command; they get separate programs so each one's tests can be run alone with -p.
  'altvm-anchor-delete-the-has-one': [
    { kind: 'rust-test', file: 'programs/anchor-has-one/tests/delete_the_has_one.rs' },
  ],
  'altvm-anchor-pda-config-and-authority': [
    { kind: 'rust-test', file: 'programs/anchor-pda-config/tests/pda_config_and_authority.rs' },
  ],
  // The IDL audit runs `anchor build` then a node script; the script itself is already generated
  // from the command, so only the program it builds is needed here.
  'altvm-anchor-idl-seed-audit': [
    { kind: 'rust-test', file: 'programs/anchor-idl-audit/tests/idl_seed_audit.rs' },
  ],

  // --- host-only Rust.
  'zk-proof-systems-forge-a-fiat-shamir-proof': [
    { kind: 'rust-test', file: 'rust/fiat-shamir/tests/fiat_shamir.rs' },
  ],
  'zk-zkvms-bench-two-provers': [
    { kind: 'rust-bin', file: 'rust/zkvm-bench/src/main.rs' },
    { kind: 'py-script', file: 'scripts/check_results.py' },
  ],
  'protocol-contributing-first-issue': [
    { kind: 'rust-test', file: 'rust/first-issue/tests/first_issue.rs' },
  ],
  // scaling-stylus-compute-versus-storage takes no entry here. Its criteria are already scaffolded
  // on the Solidity side — the command's second half is
  // `forge test --match-path test/StylusGas.t.sol` — and a Rust criterion file in the Stylus crate
  // could not run anyway: a Stylus cdylib does not link for the host, because its hostio symbols
  // exist only inside the Stylus runtime. It would also land in the deployment hash, which is
  // computed over every .rs in the crate.

  // --- Noir.
  'zk-noir-circuits-unconstrained-hint-forgery': [
    { kind: 'noir-test', file: 'circuits/hint-forgery/src/main.nr' },
  ],

  // --- Python. Paths come from the commands, which do name them, but the toolchain does not fit
  //     any of the emitters above.
  'defi-oracles-twap-attack-cost': [
    { kind: 'py-test', file: 'tests/test_twap_attack_cost.py' },
  ],
  'protocol-consensus-specs-mutate-and-see-what-fails': [
    { kind: 'py-test', file: 'tests/core/pyspec/test_mutate_and_see_what_fails.py' },
  ],
  'protocol-consensus-specs-run-the-spec': [
    { kind: 'py-script', file: 'solutions/advance_state.py' },
  ],
  'protocol-contributing-write-a-spec-test': [
    { kind: 'py-test', file: 'tests/test_spec_case.py' },
  ],

  // scaling-op-stack-derive-it-yourself is deliberately absent. `make devnet-up` brings up the
  // Optimism devnet from the upstream monorepo; there is no file that stands in for cloning it,
  // and a Makefile target that pretended otherwise would be worse than the honest error. The
  // Makefile written for it says what to clone instead.
};

/**
 * Clean a path token as the shell would hand it to the binary.
 *
 * Three shapes turn up in the corpus and each needs a decision rather than a regex:
 *
 *   1. `test/FixReview.t.sol;` — the command is wrapped in `bash -c 'set -e; …; …'`, so a token can
 *      carry the statement separator and the closing quote. Stripped.
 *   2. `test/poc/*.t.sol` — a glob. A glob cannot be created, and `--match-path` with a glob that
 *      matches nothing is the same silent nothing we are trying to remove. So the glob is seeded
 *      with one concrete file it matches; the generated header says to add the rest.
 *   3. `tests/finality-gate` — vitest's positional argument is a filename *filter*, not a path, so
 *      the corpus writes it without an extension. The filter has to match something, and the file it
 *      obviously means is `tests/finality-gate.test.ts`.
 */
function cleanPath(raw: string): string | null {
  const t = raw.trim().replace(/[;,]+$/, '').replace(/^['"]|['"]$/g, '').replace(/[;,]+$/, '');
  if (!t || t.startsWith('-') || t.startsWith('$')) return null;

  if (t.includes('*')) {
    const dir = path.posix.dirname(t);
    const ext = /\.t\.sol$/.test(t) ? '.t.sol' : path.extname(t);
    // A seed named for the directory, so `test/poc/*.t.sol` gets `test/poc/Poc01.t.sol`.
    const stem = path.basename(dir).replace(/[^A-Za-z0-9]+/g, '');
    const head = stem.charAt(0).toUpperCase() + stem.slice(1);
    return path.posix.join(dir, `${head || 'Case'}01${ext}`);
  }

  return t;
}

/** vitest/playwright take a filter, not a path. Give the filter a file to match. */
function asTestFile(t: string): string {
  if (path.extname(t)) return t;
  return `${t}.test.ts`;
}

/**
 * Read the command, not the practice. The command is the contract the runner executes, so the paths
 * that must exist are exactly the ones it names in a position that is *read* rather than written.
 *
 * Output positions are excluded by construction: anything after `--out`, `--report` or `--record` is
 * something the exercise produces. So is any `docs/`, `answers/` or `results/` path — those are the
 * write-up practices, whose deliverable is the learner's to create.
 */
function needsOf(cmd: string): Need[] {
  const c = cmd.replace(/\s+/g, ' ').trim();
  const out: Need[] = [];

  const foreign = /(?:^|&& )(cargo|anchor|nargo|make)\b/.exec(c);
  if (foreign) out.push({ kind: 'foreign', tool: foreign[1] });
  if (/\bpytest\b|\bpython3? -m\b|\buv run python\b/.test(c)) out.push({ kind: 'foreign', tool: 'python' });

  // Strip output positions so a path named there is never mistaken for an input.
  const readable = c.replace(/--(?:out|report|record)\s+\S+/g, ' ');

  const deliverable = (p: string) => /^(?:docs|answers|results)\//.test(p) || /\.(?:md|csv|json)$/.test(p);

  const add = (kind: Need['kind'], raw: string, viaFilter = false) => {
    const cleaned = cleanPath(raw);
    if (!cleaned || deliverable(cleaned)) return;
    const file = viaFilter ? asTestFile(cleaned) : cleaned;
    out.push({ kind, file } as Need);
  };

  for (const m of readable.matchAll(/--match-path\s+(\S+)/g)) add('sol-test', m[1]);
  for (const m of readable.matchAll(/\bforge script\s+(\S+)/g)) add('sol-script', m[1]);
  for (const m of readable.matchAll(/\b(?:vitest run|node --test|playwright test)\s+(\S+)/g)) {
    add('ts-test', m[1], true);
  }
  // A script invoked directly is the learner's tool, and it has to exist for the command to reach it.
  for (const m of readable.matchAll(/(?:^|&& |\| )(?:node|bash|npx tsx|pnpm tsx)\s+((?:scripts?|drills)\/\S+)/g)) {
    add('harness', m[1]);
  }

  return out;
}

// ---------------------------------------------------------------------------------------------
// Naming
// ---------------------------------------------------------------------------------------------

/** A criterion is a sentence. This turns it into a stable, unique, readable test identifier. */
function caseName(criterion: string, index: number): string {
  const words = criterion
    .toLowerCase()
    .replace(/`[^`]*`/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 9);
  const camel = words
    .map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join('');
  // The index prefix guarantees uniqueness without needing to inspect the other criteria, and it
  // makes the JUnit rows sort in the order the criteria are written.
  return `criterion${String(index + 1).padStart(2, '0')}_${camel || 'unnamed'}`;
}

function solContractName(file: string): string {
  const base = path.basename(file).replace(/\.t\.sol$|\.s\.sol$|\.sol$/, '');
  const camel = base.replace(/[^A-Za-z0-9]+(.)?/g, (_, ch) => (ch ? ch.toUpperCase() : ''));
  const head = camel.charAt(0).toUpperCase() + camel.slice(1);
  return /\.s\.sol$/.test(file) ? `${head}Script` : `${head}Test`;
}

/**
 * A Solidity string literal for a criterion.
 *
 * solc rejects a non-ASCII byte in a plain `"..."` literal — the criteria are full of em dashes,
 * and three of them carry `·` or `²` from a formula. The fix is the `unicode"..."` literal rather
 * than transliteration: the failure message is the requirement, and rewriting the requirement to
 * suit the compiler is the wrong way round. The prefix is only added where it is needed, so the
 * ASCII majority stays plain.
 */
function solLiteral(s: string): string {
  const body = s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\s+/g, ' ').trim();
  // eslint-disable-next-line no-control-regex
  const ascii = /^[\x20-\x7E]*$/.test(body);
  return ascii ? `"${body}"` : `unicode"${body}"`;
}

function tsString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\s+/g, ' ').trim();
}

/**
 * A criterion is a whole sentence and some run past 140 characters. The JUnit `name` becomes a row
 * in the practice screen's results table, so it is truncated here; the full criterion is still the
 * failure message, which is what the learner reads when the row is red.
 */
function shortName(s: string, width = 72): string {
  const one = s.replace(/\s+/g, ' ').trim();
  if (one.length <= width) return one;
  const cut = one.slice(0, width);
  const at = cut.lastIndexOf(' ');
  return `${(at > width * 0.6 ? cut.slice(0, at) : cut).trimEnd()}…`;
}

/** Wrap a sentence into comment lines so no generated file has a 300-character row. */
function wrap(s: string, width = 96): string[] {
  const words = s.replace(/\s+/g, ' ').trim().split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (cur && (cur + ' ' + w).length > width) { lines.push(cur); cur = w; } else { cur = cur ? `${cur} ${w}` : w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

// ---------------------------------------------------------------------------------------------
// The bodies
// ---------------------------------------------------------------------------------------------

function header(p: Practice, cmd: string, comment: '//' | ' *'): string[] {
  const lead = comment === '//' ? '//' : ' *';
  const lines = [
    `${lead} ${MARKER}`,
    `${lead}`,
    `${lead} Practice: ${p.id}  (${p.kind}, grain ${p.grain ?? 'block'}, difficulty ${p.difficulty ?? '?'})`,
    `${lead} Run:      ${cmd}`,
    `${lead}`,
    `${lead} THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above`,
    `${lead} resolves and fails honestly, with one named case per acceptance criterion, instead of`,
    `${lead} reporting "the test path may not exist" — which is a broken harness, not a red test.`,
    `${lead}`,
    `${lead} Replace each placeholder with a real assertion as you go. A criterion you have actually`,
    `${lead} tested no longer needs its placeholder. Delete this notice when none remain.`,
    `${lead}`,
    `${lead} What the practice asks for:`,
  ];
  for (const l of wrap(p.spec ?? '', 92)) lines.push(`${lead}   ${l}`);
  return lines;
}

function solTest(p: Practice, cmd: string, file: string): string {
  const criteria = p.acceptance?.criteria ?? [];
  const body = criteria.map((c, i) => {
    const doc = wrap(c, 92).map((l) => `    /// ${l}`).join('\n');
    return `${doc}\n    function test_${caseName(c, i)}() public {\n        fail(${solLiteral(c)});\n    }`;
  });
  return [
    '// SPDX-License-Identifier: MIT',
    'pragma solidity 0.8.36;',
    '',
    'import {Test, console2} from "forge-std/Test.sol";',
    '',
    '/*',
    ...header(p, cmd, ' *'),
    ' */',
    `contract ${solContractName(file)} is Test {`,
    '    function setUp() public {',
    '        // Deploy what the exercise needs. Nothing is deployed yet because nothing is written yet.',
    '    }',
    '',
    body.join('\n\n'),
    '',
    '    /// Keeps console2 referenced: the exercises want you to print evidence, not just assert.',
    '    function _note(string memory what) internal pure {',
    '        console2.log(what);',
    '    }',
    '}',
    '',
  ].join('\n');
}

function solScript(p: Practice, cmd: string, file: string): string {
  return [
    '// SPDX-License-Identifier: MIT',
    'pragma solidity 0.8.36;',
    '',
    'import {Script, console2} from "forge-std/Script.sol";',
    '',
    '/*',
    ...header(p, cmd, ' *'),
    ' *',
    ' * A script, not a test: it is run for its effects. The acceptance criteria are listed below',
    ' * because they are what the run has to demonstrate; there is nothing here to assert them with.',
    ' */',
    `contract ${solContractName(file)} is Script {`,
    '    function run() external {',
    '        // What a script opens with, and what stops solc suggesting this be `pure`: the',
    '        // broadcast is the reason a script exists rather than a test.',
    '        vm.startBroadcast();',
    '        revert("TODO: this script is unimplemented");',
    '    }',
    '',
    ...(p.acceptance?.criteria ?? []).flatMap((c, i) => [
      `    // ${i + 1}. ${wrap(c, 92).join('\n    //    ')}`,
    ]),
    '}',
    '',
  ].join('\n');
}

function tsTest(p: Practice, cmd: string): string {
  const criteria = p.acceptance?.criteria ?? [];
  const isNodeTest = /node --test/.test(cmd);
  const isPlaywright = /playwright test/.test(cmd);

  const imports = isPlaywright
    ? "import { test } from '@playwright/test';"
    : isNodeTest
      ? "import { test } from 'node:test';"
      : "import { describe, it, expect } from 'vitest';";

  const cases = criteria.map((c, i) => {
    const doc = wrap(c, 92).map((l) => `  // ${l}`).join('\n');
    const name = `${String(i + 1).padStart(2, '0')} — ${tsString(shortName(c))}`;
    if (isNodeTest) {
      return `${doc}\n  test('${name}', () => {\n    throw new Error('${tsString(c)}');\n  });`;
    }
    if (isPlaywright) {
      // `expect.fail` is vitest's, not Playwright's; and `test.fail()` means "expected to fail",
      // which is the opposite of what an unmet criterion is. A thrown Error is the honest signal.
      return `${doc}\n  test('${name}', async ({ page }) => {\n    void page;\n    throw new Error('${tsString(c)}');\n  });`;
    }
    return `${doc}\n  it('${name}', () => {\n    expect.fail('${tsString(c)}');\n  });`;
  });

  // node:test has no describe worth using here, and Playwright's is `test.describe` — a bare
  // `describe` is undefined in a .spec.ts and every one of the five failed to typecheck on it.
  const openWith = isPlaywright ? 'test.describe' : 'describe';
  const open = isNodeTest ? '' : `${openWith}('${tsString(p.title)}', () => {\n`;
  const close = isNodeTest ? '' : '});\n';

  return [
    '/**',
    ...header(p, cmd, ' *'),
    ' */',
    imports,
    '',
    open + cases.join('\n\n') + (isNodeTest ? '\n' : '\n') + close,
  ].join('\n');
}

/** Rust identifiers: snake_case, and unique by the criterion index. */
function rustCaseName(criterion: string, index: number): string {
  const words = criterion.toLowerCase().replace(/`[^`]*`/g, ' ').replace(/[^a-z0-9]+/g, ' ')
    .trim().split(' ').filter(Boolean).slice(0, 7).join('_');
  return `criterion_${String(index + 1).padStart(2, '0')}_${words || 'unnamed'}`;
}

function rustString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\s+/g, ' ').trim();
}

function rustTest(p: Practice, cmd: string): string {
  const criteria = p.acceptance?.criteria ?? [];
  const cases = criteria.map((c, i) => [
    ...wrap(c, 92).map((l) => `/// ${l}`),
    '#[test]',
    `fn ${rustCaseName(c, i)}() {`,
    `    panic!("${rustString(c)}");`,
    '}',
  ].join('\n'));
  return [
    '//! ' + MARKER,
    '//!',
    ...header(p, cmd, '//').slice(1).map((l) => l.replace(/^\/\//, '//!')),
    '',
    cases.join('\n\n'),
    '',
  ].join('\n');
}

/** A `cargo run --bin` target. It must exit non-zero, or the exercise reports success for nothing. */
function rustBin(p: Practice, cmd: string): string {
  const criteria = p.acceptance?.criteria ?? [];
  return [
    '//! ' + MARKER,
    '//!',
    ...header(p, cmd, '//').slice(1).map((l) => l.replace(/^\/\//, '//!')),
    '//!',
    '//! What this has to end up doing:',
    ...criteria.flatMap((c, i) => wrap(`${i + 1}. ${c}`, 92).map((l) => `//!   ${l}`)),
    '',
    'fn main() {',
    '    let args: Vec<String> = std::env::args().skip(1).collect();',
    '    let _ = &args;',
    `    eprintln!("TODO: this binary is unimplemented (practice ${p.id})");`,
    '    std::process::exit(1);',
    '}',
    '',
  ].join('\n');
}

/**
 * A Noir circuit's tests.
 *
 * ASCII-folded, unlike every other emitter: Noir string literals are `str<N>` over ASCII bytes and
 * the criteria carry em dashes. The full criterion is still above each test as a comment.
 */
function noirTest(p: Practice, cmd: string): string {
  const criteria = p.acceptance?.criteria ?? [];
  const fold = (x: string) => x
    .replace(/[\u2014\u2013]/g, '-').replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"')
    .replace(/\u00b7/g, '.').replace(/[^\x20-\x7E]/g, '?')
    .replace(/"/g, "'").replace(/\s+/g, ' ').trim();
  const cases = criteria.map((c, i) => [
    ...wrap(c, 92).map((l) => `// ${l}`),
    '#[test]',
    `fn ${rustCaseName(c, i)}() {`,
    `    assert(false, "${fold(c)}");`,
    '}',
  ].join('\n'));
  return [
    '// ' + MARKER,
    ...header(p, cmd, '//').slice(1),
    '',
    '// The circuit itself. `main` is what gets proved; the tests below are what tell you whether it',
    '// constrains anything.',
    '//',
    '// The signature is the one the spec dictates and nothing more: a public input, and a hint the',
    '// prover computes outside the circuit. Parameter names are not underscore-prefixed because',
    '// `nargo check` writes them into Prover.toml, and `_x = 0` is a worse thing to hand someone',
    '// than `x = 0`.',
    'fn main(x: pub Field) {',
    '    // TODO: take the hint, then decide what has to be true of it. That decision is the',
    '    // practice: the unsound version constrains nothing about the hint, and still verifies.',
    '    let _ = x;',
    '    assert(false, "TODO: main is unimplemented");',
    '}',
    '',
    '// Next: an `unconstrained fn` returning the hint. It is not stubbed here on purpose — an',
    '// uncalled one warns, and calling it means writing the unsound circuit, which is the exercise.',
    '// `unconstrained` means the prover computes it outside the circuit, so nothing it returns is',
    '// proved by itself. Reaching it from `main` needs an `unsafe` block, and that block is the',
    '// thing to be suspicious of: it is where a false statement gets in.',
    '',
    cases.join('\n\n'),
    '',
  ].join('\n');
}

/** Python identifiers, and pytest collects on the `test_` prefix. */
function pyCaseName(criterion: string, index: number): string {
  const words = criterion.toLowerCase().replace(/`[^`]*`/g, ' ').replace(/[^a-z0-9]+/g, ' ')
    .trim().split(' ').filter(Boolean).slice(0, 7).join('_');
  return `test_criterion_${String(index + 1).padStart(2, '0')}_${words || 'unnamed'}`;
}

function pyString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\s+/g, ' ').trim();
}

function pyTest(p: Practice, cmd: string): string {
  const criteria = p.acceptance?.criteria ?? [];
  // `-k your_case_name` selects by substring, so the name it names has to exist.
  const selector = /-k\s+(\w+)/.exec(cmd)?.[1];
  const cases = criteria.map((c, i) => {
    const name = pyCaseName(c, i);
    const named = selector && i === 0 ? `${name}_${selector}` : name;
    return [
      ...wrap(c, 92).map((l) => `# ${l}`),
      `def ${named}():`,
      `    raise AssertionError("${pyString(c)}")`,
    ].join('\n');
  });
  return [
    '"""',
    MARKER,
    ...header(p, cmd, '//').slice(1).map((l) => l.replace(/^\/\/ ?/, '')),
    ...(selector ? ['', `The command selects with \`-k ${selector}\`, so one case below carries that`,
                   'substring in its name. Rename it to whatever your case is actually about, and',
                   'change the command to match.'] : []),
    '"""',
    '',
    cases.join('\n\n\n'),
    '',
  ].join('\n');
}

/** A Python entry point, run for its effects. Exits non-zero while unimplemented. */
function pyScript(p: Practice, cmd: string): string {
  const criteria = p.acceptance?.criteria ?? [];
  return [
    '"""',
    MARKER,
    ...header(p, cmd, '//').slice(1).map((l) => l.replace(/^\/\/ ?/, '')),
    '',
    'What this has to end up doing:',
    ...criteria.flatMap((c, i) => wrap(`${i + 1}. ${c}`, 92)),
    '"""',
    '',
    'import sys',
    '',
    '',
    'def main(argv: list) -> int:',
    '    del argv',
    `    print("TODO: this script is unimplemented (practice ${p.id})", file=sys.stderr)`,
    '    return 1',
    '',
    '',
    'if __name__ == "__main__":',
    '    sys.exit(main(sys.argv[1:]))',
    '',
  ].join('\n');
}

function harness(p: Practice, cmd: string, file: string): string {
  const ext = path.extname(file);
  const criteria = (p.acceptance?.criteria ?? []).map((c, i) => `  ${i + 1}. ${wrap(c, 92).join('\n     ')}`);

  if (ext === '.sh') {
    return [
      '#!/usr/bin/env bash',
      '# ' + MARKER,
      `# Practice: ${p.id}`,
      `# Run:      ${cmd}`,
      '#',
      '# This is the tool the exercise asks you to build. It exits non-zero on purpose: an empty',
      '# script that exited 0 would report success for work nobody has done.',
      '#',
      '# What it has to end up doing:',
      ...criteria.map((l) => `# ${l}`),
      '',
      'set -euo pipefail',
      '',
      `echo "TODO: ${file} is unimplemented (practice ${p.id})" >&2`,
      'exit 1',
      '',
    ].join('\n');
  }

  const isTs = ext === '.ts' || ext === '.tsx';
  return [
    '/**',
    ` * ${MARKER}`,
    ' *',
    ` * Practice: ${p.id}`,
    ` * Run:      ${cmd}`,
    ' *',
    ' * This is the tool the exercise asks you to build. It exits non-zero on purpose: an empty',
    ' * script that exited 0 would report success for work nobody has done.',
    ' *',
    ' * What it has to end up doing:',
    ...criteria.map((l) => ` * ${l}`),
    ' */',
    '',
    // Without an import or export a .ts file is a global script, not a module, so every one of
    // these would redeclare `argv` in one shared scope. Nine of them did.
    ...(isTs ? ['export {};', ''] : []),
    isTs ? 'const argv: string[] = process.argv.slice(2);' : 'const argv = process.argv.slice(2);',
    'void argv;',
    '',
    `console.error('TODO: ${file} is unimplemented (practice ${p.id})');`,
    'process.exit(1);',
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------------------------

const written: string[] = [];
const refreshed: string[] = [];
const keptHandWritten: string[] = [];
const foreignBy = new Map<string, string[]>();
const shared: { file: string; ids: string[] }[] = [];

/**
 * Two practices can legitimately name one file. `infra-monitoring-invariant-to-production` is
 * titled "Ship the *same* invariant to your test suite and to mainnet" and runs the invariant test
 * from `toolchain-invariant-testing-vault-solvency` on purpose — the reuse is the exercise.
 *
 * So the first claimant in curriculum order writes the file and the later one inherits it. What
 * would be wrong is silently overwriting, which is why the sharing is recorded and reported.
 */
const claimedBy = new Map<string, string[]>();

function put(rel: string, contents: string, practiceId: string) {
  const abs = path.join(REPO, rel);

  const prior = claimedBy.get(rel);
  if (prior) {
    if (!prior.includes(practiceId)) {
      prior.push(practiceId);
      const entry = shared.find((s) => s.file === rel);
      if (entry) entry.ids = prior;
      else shared.push({ file: rel, ids: prior });
    }
    return; // the first claimant's content stands
  }
  claimedBy.set(rel, [practiceId]);

  if (fs.existsSync(abs)) {
    const existing = fs.readFileSync(abs, 'utf8');
    if (!existing.includes(MARKER)) { keptHandWritten.push(rel); return; }
    if (existing === contents) return;
    refreshed.push(rel);
  } else {
    written.push(rel);
  }

  if (!apply) return;
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, contents);
  if (rel.endsWith('.sh')) fs.chmodSync(abs, 0o755);
}

for (const t of allTracks()) {
  for (const m of getModulesOf(t.id)) {
    for (const p of getPracticesOf(m.id)) {
      const cmd = p.acceptance?.command?.replace(/\s+/g, ' ').trim();
      if (!cmd) continue;
      const criteria = p.acceptance?.criteria ?? [];
      if (criteria.length === 0) continue;

      // A foreign-toolchain practice contributes its hand-mapped targets on top of anything the
      // command itself named (the Stylus one has a Solidity half; the IDL audit has a node script).
      const needs = [...needsOf(cmd), ...(FOREIGN_TARGETS[p.id] ?? [])];

      for (const need of needs) {
        if (need.kind === 'foreign') {
          const list = foreignBy.get(need.tool) ?? [];
          list.push(p.id);
          foreignBy.set(need.tool, list);
          continue;
        }
        if (need.kind === 'sol-test') put(need.file, solTest(p, cmd, need.file), p.id);
        else if (need.kind === 'sol-script') put(need.file, solScript(p, cmd, need.file), p.id);
        else if (need.kind === 'ts-test') put(need.file, tsTest(p, cmd), p.id);
        else if (need.kind === 'harness') put(need.file, harness(p, cmd, need.file), p.id);
        else if (need.kind === 'rust-test') put(need.file, rustTest(p, cmd), p.id);
        else if (need.kind === 'rust-bin') put(need.file, rustBin(p, cmd), p.id);
        else if (need.kind === 'noir-test') put(need.file, noirTest(p, cmd), p.id);
        else if (need.kind === 'py-test') put(need.file, pyTest(p, cmd), p.id);
        else if (need.kind === 'py-script') put(need.file, pyScript(p, cmd), p.id);
      }
    }
  }
}

// ---------------------------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------------------------

const group = (xs: string[]) => {
  const by = new Map<string, number>();
  for (const x of xs) {
    const k = x.split('/')[0] + (x.endsWith('.t.sol') ? '/*.t.sol' : x.endsWith('.s.sol') ? '/*.s.sol' : path.extname(x) ? `/*${path.extname(x)}` : '');
    by.set(k, (by.get(k) ?? 0) + 1);
  }
  return [...by].sort((a, b) => b[1] - a[1]);
};

console.log(`${apply ? 'WROTE' : 'WOULD WRITE'} ${written.length} new files`);
for (const [k, n] of group(written)) console.log(`  ${String(n).padStart(4)}  ${k}`);

if (refreshed.length) {
  console.log(`\n${apply ? 'REFRESHED' : 'WOULD REFRESH'} ${refreshed.length} previously generated files`);
  for (const [k, n] of group(refreshed)) console.log(`  ${String(n).padStart(4)}  ${k}`);
}

if (keptHandWritten.length) {
  console.log(`\nKEPT ${keptHandWritten.length} hand-authored files, untouched`);
  for (const f of keptHandWritten.sort()) console.log(`      ${f}`);
}

if (shared.length) {
  console.log(`\nSHARED — ${shared.length} file(s) named by more than one practice; the first writes it:`);
  for (const s of shared) console.log(`      ${s.file}\n        ${s.ids.join('\n        ')}`);
}

if (foreignBy.size) {
  const all = [...foreignBy.values()].flat();
  const mapped = all.filter((id) => FOREIGN_TARGETS[id]);
  const unmapped = [...new Set(all.filter((id) => !FOREIGN_TARGETS[id]))];
  console.log(`\nFOREIGN TOOLCHAINS — ${new Set(all).size} practices, of which ${new Set(mapped).size} are scaffolded:`);
  for (const [tool, ids] of [...foreignBy].sort((a, b) => b[1].length - a[1].length)) {
    const done = ids.filter((id) => FOREIGN_TARGETS[id]).length;
    console.log(`  ${tool.padEnd(8)} ${String(ids.length).padStart(3)} practices, ${done} scaffolded`);
  }
  if (unmapped.length) {
    console.log(`\n  NOT SCAFFOLDED, deliberately — ${unmapped.length}:`);
    for (const id of unmapped) console.log(`    ${id}`);
  }
}

if (!apply) console.log('\n--dry: nothing was written.');
