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
  | { kind: 'foreign'; tool: string };

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
    `${lead} tested should no longer contain a fail() call. Delete this notice when none remain.`,
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

      for (const need of needsOf(cmd)) {
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
  const total = [...foreignBy.values()].reduce((a, b) => a + b.length, 0);
  console.log(`\nNOT SCAFFOLDED — ${total} practices on a foreign toolchain, each needing a whole project:`);
  for (const [tool, ids] of [...foreignBy].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${tool.padEnd(8)} ${String(ids.length).padStart(3)}   ${ids.slice(0, 3).join(', ')}${ids.length > 3 ? ', …' : ''}`);
  }
}

if (!apply) console.log('\n--dry: nothing was written.');
