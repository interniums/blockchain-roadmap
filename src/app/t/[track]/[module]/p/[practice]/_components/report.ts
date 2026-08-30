/**
 * What crosses the server-action boundary, and what each outcome means in words.
 *
 * No directive: read by the server action that produces a report and by the client leaf that
 * renders one. A RunResult holds up to 512KB of process output; only a tail of that is worth
 * shipping to a browser, so the wire shape is deliberately smaller than the runner's.
 */

import type { TestCase } from '@/lib/runner/run';

export type Outcome = 'passed' | 'failed' | 'compile-error' | 'could-not-run' | 'timeout' | 'refused';

export interface CheckReport {
  outcome: Outcome;
  cases: TestCase[];
  passed: number;
  failed: number;
  durationMs: number;
  /** the runner's own words for why this outcome happened. Never paraphrased away. */
  reason?: string;
  stdoutTail: string;
  stderrTail: string;
  /** the argv actually spawned, joined for display — not the YAML string */
  ran: string;
}

export interface RepoStatus {
  /** capability, not filesystem: is this the local install at all */
  canRun: boolean;
  /** a practice repo path is written in .chainpath/config.json */
  configured: boolean;
  root: string | null;
  /** the path exists and looks like a Foundry project, so a run would get as far as spawning */
  usable: boolean;
  /** why not usable, in the runner's words */
  problem: string | null;
  timeoutSec: number;
}

export type Tone = 'good' | 'bad' | 'warn' | 'neutral';

export interface OutcomeCopy {
  label: string;
  tone: Tone;
  headline: string;
  body: string;
  /** true when the result says something about the learner's code */
  graded: boolean;
}

/**
 * Six outcomes, six states. Collapsing "it did not build" into "you failed" is the specific lie
 * this table exists to prevent.
 */
export const OUTCOME: Record<Outcome, OutcomeCopy> = {
  passed: {
    label: 'Passed',
    tone: 'good',
    headline: 'Every test in the acceptance command passed.',
    body: 'That is the check, not the whole practice. The acceptance criteria above are still the bar — a green run against a test you wrote loosely proves only that the test was loose.',
    graded: true,
  },
  failed: {
    label: 'Tests failed',
    tone: 'bad',
    headline: 'The project built, the tests ran, and some of them did not pass.',
    body: 'Each failure below is an assertion that did not hold, with the message the test emitted. This is the useful kind of red — it tells you exactly which claim about your code is false.',
    graded: true,
  },
  'compile-error': {
    label: 'Did not build',
    tone: 'warn',
    headline: 'The project did not compile, so no test ran.',
    body: 'This is not a failed test. Nothing was graded and nothing about your solution has been judged — the compiler stopped before any assertion was reached. Fix the build error and run the check again.',
    graded: false,
  },
  'could-not-run': {
    label: 'Could not run',
    tone: 'neutral',
    headline: 'The check never got far enough to test anything.',
    body: 'Nothing about your code was measured. The usual causes: the test path in the command does not exist in your repo yet, or the binary is not on this machine’s PATH.',
    graded: false,
  },
  timeout: {
    label: 'Timed out',
    tone: 'warn',
    headline: 'The run was killed while it was still going.',
    body: 'Tests were still executing when the clock ran out, so there is no verdict either way. An unbounded fuzz or invariant campaign will do this; so will a test waiting on a network fork that never answers.',
    graded: false,
  },
  refused: {
    label: 'Refused',
    tone: 'neutral',
    headline: 'The safety parser would not turn this into something runnable.',
    body: 'No process was started. The command is only ever taken from the practice file and validated against a strict grammar — when it does not fit, the answer is no, not a shell.',
    graded: false,
  },
};

/**
 * Which outcomes are worth writing to the attempt history.
 *
 * A pass and a failure both say something about your code, so both are recorded. A build error is
 * an attempt you made that did not pass, so it is recorded too. The other three say something about
 * the environment, not about you — recording them would put noise in a record whose whole value is
 * that it is honest.
 */
export function recordsAttempt(outcome: Outcome): boolean {
  return outcome === 'passed' || outcome === 'failed' || outcome === 'compile-error';
}

/** The line stored alongside an attempt, so a row in the history can be traced back to a real run. */
export function attemptOutput(r: CheckReport): string {
  const head = `${r.outcome} · ${r.passed} passed, ${r.failed} failed · ${Math.round(r.durationMs / 1000)}s · ${r.ran}`;
  const why = r.reason ? `\n${r.reason}` : '';
  const fails = r.cases
    .filter((c) => !c.passed)
    .map((c) => `\n\n${c.classname ? `${c.classname}::` : ''}${c.name}\n${c.failure ?? '(no message)'}`)
    .join('');
  const err = r.stderrTail.trim() ? `\n\n--- stderr ---\n${r.stderrTail.trim()}` : '';
  return `${head}${why}${fails}${err}`.slice(0, 8000);
}

export function secs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = ms / 1000;
  return s < 10 ? `${s.toFixed(1)}s` : `${Math.round(s)}s`;
}

export const TONE_BORDER: Record<Tone, string> = {
  good: 'border-[var(--color-good)]',
  bad: 'border-[var(--color-danger)]',
  warn: 'border-[var(--color-warn)]',
  neutral: 'border-[var(--color-rule)]',
};

export const TONE_TEXT: Record<Tone, string> = {
  good: 'text-[var(--color-good)]',
  bad: 'text-[var(--color-danger)]',
  warn: 'text-[var(--color-warn)]',
  neutral: 'text-[var(--color-ink-2)]',
};
