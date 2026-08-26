'use server';

/**
 * The only door between the practice page and a process.
 *
 * Two rules this file exists to hold:
 *   1. The browser sends a practice id and nothing else. The command is read out of the content
 *      graph by that id — it is never sent, never composed, never concatenated. If the id is not a
 *      practice we authored, the answer is a refusal.
 *   2. Capability is re-checked here. `can.runPractice` gating a button is a courtesy to the
 *      learner; gating it again on the server is the part that actually matters.
 *
 * Plan §17 governs everything downstream of this: argv array, no shell, cwd pinned to the
 * configured repo, timeout, output cap, --junit.
 */

import fs from 'node:fs';
import { getPractice } from '@/lib/content/load';
import { can } from '@/lib/capabilities';
import { runCheck, getRepoRoot, TIMEOUT_MS } from '@/lib/runner/run';
import { assertRepoRoot, classifyAcceptance, parseAcceptanceCommand, UnsafeCommand } from '@/lib/runner/safety';
import { asText } from './Prose';
import type { CheckReport, RepoStatus } from './report';

/** Process output is capped at 512KB by the runner. A browser needs the end of it, not all of it. */
const TAIL = 6_000;
const tail = (s: string) => (s.length > TAIL ? `…(truncated)…\n${s.slice(-TAIL)}` : s);

const BLANK = { cases: [], passed: 0, failed: 0, durationMs: 0, stdoutTail: '', stderrTail: '', ran: '' };

/**
 * Is a run possible right now, and if not, exactly what is missing.
 * Asked at mount rather than baked into the prerendered page, so configuring a repo in another tab
 * is reflected without a rebuild.
 */
export async function runnerStatus(): Promise<RepoStatus> {
  const timeoutSec = Math.round(TIMEOUT_MS / 1000);
  if (!can.runPractice) {
    return { canRun: false, configured: false, root: null, usable: false, problem: null, timeoutSec };
  }
  const root = getRepoRoot();
  if (!root) {
    return { canRun: true, configured: false, root: null, usable: false, problem: null, timeoutSec };
  }
  try {
    assertRepoRoot(root, (p) => fs.existsSync(p));
    return { canRun: true, configured: true, root, usable: true, problem: null, timeoutSec };
  } catch (e) {
    return {
      canRun: true, configured: true, root, usable: false,
      problem: e instanceof UnsafeCommand ? e.message : String(e),
      timeoutSec,
    };
  }
}

/**
 * Run one practice's acceptance command against the configured repo.
 * Every failure mode is a value, never a thrown error — the six outcomes are six UI states.
 */
export async function runPracticeCheck(practiceId: string): Promise<CheckReport> {
  if (!can.runPractice) {
    return {
      ...BLANK, outcome: 'refused',
      reason: 'this build has no filesystem or process access, so it cannot run a check',
    };
  }

  // The id is a lookup key into content we authored. Nothing from the browser goes further than this.
  const p = typeof practiceId === 'string' ? getPractice(practiceId) : undefined;
  if (!p) return { ...BLANK, outcome: 'refused', reason: `unknown practice id: ${String(practiceId).slice(0, 80)}` };

  const command = asText(p.acceptance?.command).trim();
  const tier = classifyAcceptance(command || undefined);
  if (tier.tier !== 'runnable') {
    return { ...BLANK, outcome: 'refused', reason: tier.reason ?? 'this practice is not runnable' };
  }

  let ran = command;
  try {
    const parsed = parseAcceptanceCommand(command);
    ran = [parsed.bin, ...parsed.args].join(' ');
  } catch {
    // classifyAcceptance already said runnable; if this disagrees, runCheck refuses anyway.
  }

  const r = await runCheck(command);
  return {
    outcome: r.outcome,
    cases: r.cases,
    passed: r.passed,
    failed: r.failed,
    durationMs: r.durationMs,
    reason: r.reason,
    stdoutTail: tail(r.stdout),
    stderrTail: tail(r.stderr),
    ran,
  };
}
