import 'server-only';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { parseAcceptanceCommand, assertRepoRoot, UnsafeCommand } from './safety';

export const TIMEOUT_MS = 180_000;
export const MAX_OUTPUT = 512_000;

export interface TestCase { name: string; classname: string; passed: boolean; time: number; failure?: string }
export interface RunResult {
  outcome: 'passed' | 'failed' | 'compile-error' | 'could-not-run' | 'timeout' | 'refused';
  cases: TestCase[];
  passed: number; failed: number;
  stderr: string; stdout: string;
  durationMs: number;
  reason?: string;
}

export function configPath() { return path.join(process.cwd(), '.chainpath', 'config.json'); }

export function getRepoRoot(): string | null {
  try {
    const c = JSON.parse(fs.readFileSync(configPath(), 'utf8'));
    return typeof c.practiceRepo === 'string' ? c.practiceRepo : null;
  } catch { return null; }
}

export function setRepoRoot(root: string) {
  assertRepoRoot(root, (p) => fs.existsSync(p));
  fs.mkdirSync(path.dirname(configPath()), { recursive: true });
  let cur: Record<string, unknown> = {};
  try { cur = JSON.parse(fs.readFileSync(configPath(), 'utf8')); } catch { /* first write */ }
  fs.writeFileSync(configPath(), JSON.stringify({ ...cur, practiceRepo: root }, null, 2));
}

/** Minimal JUnit XML reader. No XML library, no entity expansion — a fixed shape from a known tool. */
export function parseJUnit(xml: string): TestCase[] {
  const out: TestCase[] = [];
  // non-greedy, or [^>]* swallows the self-closing slash and the alternation never matches
  const re = /<testcase\b([^>]*?)\s*(?:\/>|>([\s\S]*?)<\/testcase>)/g;
  const attr = (s: string, k: string) => new RegExp(`${k}="([^"]*)"`).exec(s)?.[1] ?? '';
  const unesc = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#10;/g, '\n').replace(/&amp;/g, '&');
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) {
    const a = m[1], inner = m[2] ?? '';
    const fail = /<(failure|error)\b([^>]*?)\s*(?:\/>|>([\s\S]*?)<\/\1>)/.exec(inner);
    out.push({
      name: unesc(attr(a, 'name')),
      classname: unesc(attr(a, 'classname')),
      time: parseFloat(attr(a, 'time') || '0'),
      passed: !fail,
      failure: fail ? unesc(attr(fail[2], 'message') || fail[3] || '').trim().slice(0, 4000) : undefined,
    });
  }
  return out;
}

/**
 * Run one practice's acceptance command. Never throws for expected failure modes — every outcome is
 * a value, so the UI can distinguish "you failed" from "it could not run", which are different states.
 */
export async function runCheck(rawCommand: string): Promise<RunResult> {
  const started = Date.now();
  const empty = { cases: [], passed: 0, failed: 0, stdout: '', stderr: '', durationMs: 0 };

  const root = getRepoRoot();
  let parsed;
  try {
    assertRepoRoot(root ?? '', (p) => fs.existsSync(p));
    parsed = parseAcceptanceCommand(rawCommand);
  } catch (e) {
    return { ...empty, outcome: 'refused', reason: e instanceof UnsafeCommand ? e.message : String(e) };
  }

  return new Promise<RunResult>((resolve) => {
    let stdout = '', stderr = '', done = false;
    // argv array, cwd pinned to the configured repo, NO shell, inherited env stripped of surprises
    const child = spawn(parsed.bin, parsed.args, {
      cwd: root!,
      shell: false,
      env: { ...process.env, NO_COLOR: '1', FOUNDRY_PROFILE: process.env.FOUNDRY_PROFILE ?? 'default' },
    });
    const finish = (r: Omit<RunResult, 'durationMs'>) => {
      if (done) return; done = true;
      clearTimeout(timer);
      resolve({ ...r, durationMs: Date.now() - started });
    };
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      finish({ outcome: 'timeout', cases: [], passed: 0, failed: 0, stdout, stderr,
        reason: `killed after ${TIMEOUT_MS / 1000}s — an invariant or fuzz campaign may be unbounded` });
    }, TIMEOUT_MS);

    child.stdout.on('data', (d) => { if (stdout.length < MAX_OUTPUT) stdout += d.toString(); });
    child.stderr.on('data', (d) => { if (stderr.length < MAX_OUTPUT) stderr += d.toString(); });
    child.on('error', (e) => finish({ outcome: 'could-not-run', cases: [], passed: 0, failed: 0, stdout, stderr,
      reason: e.message.includes('ENOENT') ? 'forge not found on PATH' : e.message }));

    child.on('close', (code) => {
      const cases = parseJUnit(stdout);
      if (!cases.length) {
        const compile = /Compiler run failed|Error \(\d+\)|error\[|ParserError|DeclarationError/i.test(stdout + stderr);
        return finish({
          outcome: compile ? 'compile-error' : 'could-not-run',
          cases: [], passed: 0, failed: 0, stdout, stderr,
          reason: compile
            ? 'the project did not compile — this is not a failed test'
            : `no JUnit output (exit ${code}); the test path may not exist`,
        });
      }
      const passed = cases.filter((c) => c.passed).length;
      const failed = cases.length - passed;
      finish({ outcome: failed ? 'failed' : 'passed', cases, passed, failed, stdout, stderr });
    });
  });
}
