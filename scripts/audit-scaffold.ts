/**
 * Does every acceptance command have something to run?
 *
 * This is the metric the audit put at 7–9 of 236: the fraction of practices whose command names a
 * path that actually exists in `practice-repo/`. Below that number the app cannot tell a learner
 * "you have not done this yet" — it can only say "no JUnit output; the test path may not exist",
 * which reads as a broken app.
 *
 * Two passes, because static and dynamic answer different questions:
 *
 *   STATIC   For all 280 commands: do the paths they read exist? Cheap, total coverage, and it is
 *            the thing that regresses silently when someone authors a new practice.
 *   DYNAMIC  For a sample, spawn the command exactly as the app does and confirm the verdict is
 *            `failed` (a red test) rather than `could-not-run` (a broken harness). This is the only
 *            pass that proves the whole path, parser included.
 *
 *            It must spawn `parseAcceptanceCommand(cmd)`, never the raw string split on spaces. The
 *            parser is not a tokeniser — it appends `--junit` for forge, because the authored YAML
 *            is not trusted to carry it. An earlier version of this script split the string itself
 *            and reported six false "could-not-run"s, which read as an app bug and was not one.
 *
 *   tsx --import ./scripts/_stub-server-only.cjs scripts/audit-scaffold.ts
 *   tsx --import ./scripts/_stub-server-only.cjs scripts/audit-scaffold.ts --dynamic 24
 */
import fs from 'node:fs';
import path from 'node:path';
import { allTracks, getModulesOf, getPracticesOf } from '../src/lib/content/load';
import { classifyAcceptance, parseAcceptanceCommand } from '../src/lib/runner/safety';
import { parseJUnit } from '../src/lib/runner/run';
import { spawnSync } from 'node:child_process';

const REPO = path.join(process.cwd(), 'practice-repo');

/** Kept in step with `scaffold-practice.ts` deliberately: both answer "what must pre-exist". */
function readPaths(cmd: string): string[] {
  const c = cmd.replace(/\s+/g, ' ').trim();
  if (/(?:^|&& )(?:cargo|anchor|nargo|make)\b/.test(c) || /\bpytest\b|\buv run python\b/.test(c)) return [];
  const readable = c.replace(/--(?:out|report|record)\s+\S+/g, ' ');
  const out: string[] = [];

  const clean = (raw: string): string | null => {
    let t = raw.trim().replace(/[;,]+$/, '').replace(/^['"]|['"]$/g, '').replace(/[;,]+$/, '');
    if (!t || t.startsWith('-') || t.startsWith('$')) return null;
    if (t.includes('*')) {
      const dir = path.posix.dirname(t);
      const ext = /\.t\.sol$/.test(t) ? '.t.sol' : path.extname(t);
      const stem = path.basename(dir).replace(/[^A-Za-z0-9]+/g, '');
      t = path.posix.join(dir, `${(stem.charAt(0).toUpperCase() + stem.slice(1)) || 'Case'}01${ext}`);
    }
    if (/^(?:docs|answers|results)\//.test(t) || /\.(?:md|csv|json)$/.test(t)) return null;
    return t;
  };

  for (const m of readable.matchAll(/--match-path\s+(\S+)/g)) { const p = clean(m[1]); if (p) out.push(p); }
  for (const m of readable.matchAll(/\bforge script\s+(\S+)/g)) { const p = clean(m[1]); if (p) out.push(p); }
  for (const m of readable.matchAll(/\b(?:vitest run|node --test|playwright test)\s+(\S+)/g)) {
    const p = clean(m[1]);
    if (p) out.push(path.extname(p) ? p : `${p}.test.ts`);
  }
  for (const m of readable.matchAll(/(?:^|&& |\| )(?:node|bash|npx tsx|pnpm tsx)\s+((?:scripts?|drills)\/\S+)/g)) {
    const p = clean(m[1]); if (p) out.push(p);
  }
  return out;
}

interface Row { id: string; cmd: string; tier: string; needs: string[]; missing: string[]; foreign: boolean }

const rows: Row[] = [];
for (const t of allTracks()) {
  for (const m of getModulesOf(t.id)) {
    for (const p of getPracticesOf(m.id)) {
      const cmd = p.acceptance?.command?.replace(/\s+/g, ' ').trim();
      if (!cmd) continue;
      const foreign = /(?:^|&& )(?:cargo|anchor|nargo|make)\b/.test(cmd) || /\bpytest\b|\buv run python\b/.test(cmd);
      const needs = readPaths(cmd);
      rows.push({
        id: p.id, cmd, tier: classifyAcceptance(cmd).tier, foreign, needs,
        missing: needs.filter((n) => !fs.existsSync(path.join(REPO, n))),
      });
    }
  }
}

// ------------------------------------------------------------------ static
const foreign = rows.filter((r) => r.foreign);
const local = rows.filter((r) => !r.foreign);
const noPaths = local.filter((r) => r.needs.length === 0);
const withPaths = local.filter((r) => r.needs.length > 0);
const resolving = withPaths.filter((r) => r.missing.length === 0);
const broken = withPaths.filter((r) => r.missing.length > 0);

console.log('STATIC — do the paths each command reads exist?\n');
console.log(`  commands with an acceptance command   ${rows.length}`);
console.log(`    on a foreign toolchain (not scaffolded)  ${foreign.length}`);
console.log(`    self-contained, name no input path       ${noPaths.length}`);
console.log(`    name at least one input path             ${withPaths.length}`);
console.log(`      RESOLVE fully                          ${resolving.length}`);
console.log(`      still missing a path                   ${broken.length}`);

if (broken.length) {
  console.log('\n  unresolved:');
  for (const r of broken.slice(0, 20)) {
    console.log(`    ${r.id}\n      missing: ${r.missing.join(', ')}`);
  }
  if (broken.length > 20) console.log(`    … and ${broken.length - 20} more`);
}

// ------------------------------------------------------------------ dynamic
const arg = process.argv.indexOf('--dynamic');
if (arg !== -1) {
  const n = Number(process.argv[arg + 1] ?? '12');
  // Only the runnable tier can be spawned without a shell, which is exactly what the app does.
  const candidates = resolving.filter((r) => r.tier === 'runnable');
  const step = Math.max(1, Math.floor(candidates.length / n));
  const sample = candidates.filter((_, i) => i % step === 0).slice(0, n);

  console.log(`\n\nDYNAMIC — spawning ${sample.length} of ${candidates.length} runnable commands\n`);
  let redTest = 0, couldNotRun = 0, passed = 0;

  for (const r of sample) {
    // Exactly what the app spawns — argv from the safety parser, no shell.
    const { bin, args } = parseAcceptanceCommand(r.cmd);
    const res = spawnSync(bin, args, { cwd: REPO, encoding: 'utf8', timeout: 120_000 });
    const cases = parseJUnit(res.stdout ?? '');
    const failed = cases.filter((c) => !c.passed).length;

    let verdict: string;
    if (cases.length === 0) { verdict = 'COULD-NOT-RUN'; couldNotRun += 1; }
    else if (failed > 0) { verdict = `failed (${failed}/${cases.length} red)`; redTest += 1; }
    else { verdict = `passed (${cases.length})`; passed += 1; }

    console.log(`  ${verdict.padEnd(22)} ${r.id.slice(0, 58)}`);
  }

  console.log(`\n  red test (correct)   ${redTest}`);
  console.log(`  already passing      ${passed}`);
  console.log(`  COULD-NOT-RUN        ${couldNotRun}`);
  console.log(couldNotRun === 0
    ? '\n  Every sampled command produced real per-test results. No harness errors.'
    : `\n  ${couldNotRun} command(s) still report a harness error rather than a test result.`);
}

if (foreign.length) {
  console.log(`\n\nOUT OF SCOPE — ${foreign.length} practices need a whole foreign project:`);
  for (const r of foreign) console.log(`  ${r.cmd.split(' ')[0].padEnd(8)} ${r.id}`);
}
