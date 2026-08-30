/**
 * Practice checks execute a process on the learner's machine, triggered from a web page.
 * Even on localhost, any page in any other tab can POST to 127.0.0.1. Plan §17 governs this file.
 *
 * The rule that matters most: THE COMMAND IS NEVER COMPOSED FROM INPUT. It is parsed out of the
 * practice YAML, validated against a strict grammar, and turned into an argv array. Nothing the
 * browser sends ever reaches a process argument.
 */

export class UnsafeCommand extends Error {}

/**
 * Per-binary grammars. A binary is only runnable if its whole invocation can be expressed as argv
 * with no shell. Anything needing pipes, loops, globs or variable expansion is NOT made runnable —
 * it becomes a `manual` practice instead (see classifyAcceptance). We widen the allowlist; we never
 * widen to a shell.
 */
interface BinSpec { subs: Set<string> | null; flagsWithValue: Set<string>; flagsBare: Set<string>; junit?: boolean }

const BINS: Record<string, BinSpec> = {
  forge: {
    subs: new Set(['test']),
    flagsWithValue: new Set(['--match-path', '--match-contract', '--match-test', '--fork-url', '--fork-block-number']),
    // NOTE: --gas-report is deliberately NOT allowed. forge rejects it alongside --junit
    // ("the argument '--junit' cannot be used with '--gas-report'"), and we force --junit to read
    // results. A practice wanting a gas report is a `manual` practice — the learner runs it and reads
    // the table themselves, which is what a gas report is for anyway.
    flagsBare: new Set(['--junit', '-v', '-vv', '-vvv', '-vvvv', '--fail-fast']),
    junit: true,
  },
  cargo: {
    subs: new Set(['test', 'test-sbf', 'clippy', 'build']),
    flagsWithValue: new Set(['--package', '--test', '--features']),
    flagsBare: new Set(['--release', '--all-features', '--nocapture', '--']),
  },
  anchor: { subs: new Set(['test', 'build']), flagsWithValue: new Set(['--program-name']), flagsBare: new Set(['--skip-local-validator', '--skip-deploy']) },
  nargo: { subs: new Set(['test', 'check', 'compile']), flagsWithValue: new Set(['--package']), flagsBare: new Set(['--show-output']) },
  node:  { subs: null, flagsWithValue: new Set(['--doc', '--out', '--file']), flagsBare: new Set(['--test']) },
  python3: { subs: null, flagsWithValue: new Set(['-m']), flagsBare: new Set() },
};

/** A bare argument (a script or test path) is allowed for binaries whose subs is null. */
const ALLOWED_BIN = new Set(Object.keys(BINS));

/** A test path may only look like a path. No spaces, no shell metacharacters, no traversal. */
const SAFE_VALUE = /^[A-Za-z0-9._/-]+$/;

export interface ParsedCommand { bin: string; args: string[] }

/**
 * Parse an acceptance command from practice YAML into a safe argv.
 * Throws UnsafeCommand on anything not explicitly permitted — allowlist, never denylist.
 */
export function parseAcceptanceCommand(raw: string): ParsedCommand {
  if (typeof raw !== 'string') throw new UnsafeCommand('command must be a string');
  if (raw.length > 400) throw new UnsafeCommand('command too long');

  // Reject shell metacharacters outright before tokenising, so nothing can smuggle a second command.
  if (/[;&|`$(){}<>\\!*?~\n\r"']/.test(raw)) throw new UnsafeCommand(`shell metacharacter in command: ${raw}`);

  const tok = raw.trim().split(/\s+/).filter(Boolean);
  if (!tok.length) throw new UnsafeCommand('empty command');

  const [bin, sub, ...rest] = tok;
  if (!ALLOWED_BIN.has(bin)) throw new UnsafeCommand(`binary not allowed: ${bin}`);
  const spec = BINS[bin];
  if (spec.subs && !spec.subs.has(sub)) throw new UnsafeCommand(`subcommand not allowed: ${bin} ${sub}`);

  const args: string[] = [];
  const all = spec.subs ? [sub, ...rest] : [sub, ...rest];
  if (spec.subs) args.push(sub);
  const scan = spec.subs ? rest : all;
  const { flagsBare: FLAGS_BARE, flagsWithValue: FLAGS_WITH_VALUE } = spec;
  for (let i = 0; i < scan.length; i++) {
    const a = scan[i];
    if (a === undefined) continue;
    if (FLAGS_BARE.has(a)) { args.push(a); continue; }
    if (!a.startsWith('-')) {
      // a bare path argument: script or test file, same strict grammar as a flag value
      if (!SAFE_VALUE.test(a)) throw new UnsafeCommand(`unsafe argument: ${a}`);
      if (a.includes('..')) throw new UnsafeCommand(`path traversal: ${a}`);
      if (a.startsWith('/')) throw new UnsafeCommand(`absolute path: ${a}`);
      args.push(a); continue;
    }
    if (FLAGS_WITH_VALUE.has(a)) {
      const v = scan[++i];
      if (v === undefined) throw new UnsafeCommand(`${a} needs a value`);
      if (!SAFE_VALUE.test(v)) throw new UnsafeCommand(`unsafe value for ${a}: ${v}`);
      if (v.includes('..')) throw new UnsafeCommand(`path traversal in ${a}: ${v}`);
      if (v.startsWith('/')) throw new UnsafeCommand(`absolute path in ${a}: ${v}`);
      args.push(a, v);
      continue;
    }
    throw new UnsafeCommand(`flag not allowed: ${a}`);
  }
  // --junit is how forge results are parsed. Force it rather than trusting the YAML to include it.
  if (spec.junit && !args.includes('--junit')) args.push('--junit');
  return { bin, args };
}

export type AcceptanceTier = 'runnable' | 'manual';

/**
 * Whether a binary's output can actually be graded. `runCheck` reads JUnit from stdout and nothing
 * else, so a command the parser accepts but whose tool emits no JUnit can only ever come back as
 * `could-not-run` — which the recorder refuses to store. Under gating that made whole modules
 * uncompletable, so the check is derived here rather than discovered at run time.
 *
 * Only `forge` qualifies today, and the parser force-adds `--junit` for it. `node --test` could
 * qualify with `--test-reporter=junit --test-reporter-destination=stdout`, but `--test-reporter`
 * is not in the grammar and `=` is not a SAFE_VALUE character; `cargo`'s JSON output is
 * nightly-only, and `anchor`'s mocha reporter writes a file rather than stdout.
 */
export function emitsJUnit(bin: string): boolean {
  return BINS[bin]?.junit === true;
}

/**
 * Classify a practice's acceptance command.
 *
 * `runnable` — expressible as argv AND gradeable from its output, so the app can run it and say
 *              whether you passed.
 * `manual`   — needs a shell (pipes, chains, loops, globs, variable expansion), a binary we will
 *              not run, or a tool whose results we cannot read. The app shows the command, the
 *              learner runs it in their own terminal, and self-reports. This is deliberate: the
 *              alternative is handing a web page a shell.
 */
export function classifyAcceptance(raw: string | undefined): { tier: AcceptanceTier; reason?: string } {
  if (!raw) return { tier: 'manual', reason: 'no acceptance command authored' };
  try {
    const { bin } = parseAcceptanceCommand(raw);
    if (!emitsJUnit(bin)) {
      return { tier: 'manual', reason: `no machine-readable results: ${bin} emits no JUnit on stdout` };
    }
    return { tier: 'runnable' };
  } catch (e) {
    return { tier: 'manual', reason: e instanceof UnsafeCommand ? e.message : String(e) };
  }
}

/** The repo must be a real directory the learner configured, and the command runs with cwd there. */
export function assertRepoRoot(root: string, exists: (p: string) => boolean): void {
  if (!root || typeof root !== 'string') throw new UnsafeCommand('no practice repo configured');
  if (!root.startsWith('/')) throw new UnsafeCommand('repo path must be absolute');
  if (root.includes('..')) throw new UnsafeCommand('repo path must not contain ..');
  if (!exists(root)) throw new UnsafeCommand(`repo path does not exist: ${root}`);
  if (!exists(`${root}/foundry.toml`)) throw new UnsafeCommand(`not a Foundry project (no foundry.toml): ${root}`);
}

/** Origin allowlist. A cross-origin page must never reach the runner. */
export function originAllowed(origin: string | null, host: string | null): boolean {
  if (!origin) return true;                       // same-origin fetches may omit it
  try {
    const u = new URL(origin);
    if (!['localhost', '127.0.0.1', '[::1]'].includes(u.hostname)) return false;
    return host ? u.host === host : true;
  } catch { return false; }
}
