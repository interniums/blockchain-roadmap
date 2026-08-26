'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CommandBlock } from './CommandBlock';
import { CheckResult } from './CheckResult';
import { SelfReport } from './SelfReport';
import { usePracticeRecord } from './record';
import { runPracticeCheck, runnerStatus } from './actions';
import { attemptOutput, recordsAttempt } from './report';
import type { CheckReport, RepoStatus } from './report';

/** What a build with no filesystem knows about itself without asking anyone. */
const NO_RUNNER: RepoStatus = {
  canRun: false, configured: false, root: null, usable: false, problem: null, timeoutSec: 180,
};

/**
 * Runnable tier. This practice's acceptance command parses into a plain argument list, so the app
 * can spawn it against your repo and grade the JUnit it emits.
 *
 * Three reasons that might still not happen, each said out loud rather than discovered at click
 * time: this build has no filesystem (web copy), no repo is configured yet, or the configured path
 * is not usable. In all three the command is still here to copy, and you can still record what
 * happened — never a dead button, never a dead end.
 */
export function RunCheck({
  practiceId, command, argv, canRun, notice, rungs,
}: {
  practiceId: string;
  /** the command exactly as authored */
  command: string;
  /** what the safety parser turns it into — this is what actually gets spawned */
  argv: string;
  canRun: boolean;
  notice: string;
  rungs: number;
}) {
  const { logAttempt } = usePracticeRecord(practiceId);
  // Web mode already knows the answer at build time; only the local install has a filesystem to ask.
  const [repo, setRepo] = useState<RepoStatus | null>(canRun ? null : NO_RUNNER);
  const [asking, setAsking] = useState(canRun);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [report, setReport] = useState<CheckReport | null>(null);
  const [crashed, setCrashed] = useState<string | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    if (!canRun) return () => { alive.current = false; };
    runnerStatus()
      .then((s) => { if (alive.current) setRepo(s); })
      .catch(() => {
        if (alive.current) {
          setRepo(null);
          setCrashed('Could not ask the local install whether a repo is configured.');
        }
      })
      .finally(() => { if (alive.current) setAsking(false); });
    return () => { alive.current = false; };
  }, [canRun]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const timeoutSec = repo?.timeoutSec ?? 180;
  const ready = Boolean(repo?.canRun && repo.usable);

  async function run() {
    setRunning(true);
    setElapsed(0);
    setReport(null);
    setCrashed(null);
    try {
      const r = await runPracticeCheck(practiceId);
      if (!alive.current) return;
      setReport(r);
      if (recordsAttempt(r.outcome)) await logAttempt(r.outcome === 'passed', attemptOutput(r));
    } catch (e) {
      if (alive.current) {
        setCrashed(
          `The run never came back: ${e instanceof Error ? e.message : String(e)}. ` +
          'Nothing was graded, and nothing was recorded.',
        );
      }
    } finally {
      if (alive.current) setRunning(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] p-4">
        <p className="mb-3 flex flex-wrap items-center gap-2 text-[13px]">
          <span className="rounded border border-[var(--color-accent)] bg-[var(--color-accent-soft)] px-1.5 py-px text-[11px] uppercase tracking-wider text-[var(--color-accent)]">
            Runnable
          </span>
          <span className="text-[var(--color-ink-2)]">
            This command is a plain argument list, so the app can run it and read the results per test.
          </span>
        </p>

        <CommandBlock command={command} label="Acceptance command" />

        {argv && argv !== command && (
          <p className="-mt-1 mb-2 max-w-[70ch] text-[12px] text-[var(--color-ink-3)]">
            Spawned as{' '}
            <code className="rounded bg-[var(--color-surface-2)] px-1 font-mono">{argv}</code> — no shell, cwd pinned
            to your repo. <code className="rounded bg-[var(--color-surface-2)] px-1 font-mono">--junit</code> is added
            by the runner rather than trusted from the file, because the results are parsed from it.
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void run()}
            disabled={!ready || running || asking}
            aria-describedby={ready ? undefined : 'run-blocked'}
            className="rounded border border-[var(--color-accent)] px-3 py-1.5 text-[13px] font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] disabled:cursor-not-allowed disabled:border-[var(--color-rule)] disabled:text-[var(--color-ink-3)] disabled:hover:bg-transparent"
          >
            {running ? 'Running…' : 'Run check'}
          </button>

          <span className="text-[13px] text-[var(--color-ink-3)]">
            {asking
              ? 'Checking whether a repo is configured…'
              : running
                ? `Elapsed ${elapsed}s. Killed at ${timeoutSec}s if it has not finished.`
                : ready
                  ? `Runs in your repo. Up to ${timeoutSec}s — compiling a cold project is most of that.`
                  : ''}
          </span>
        </div>

        <p aria-live="polite" className="mt-2 min-h-[1.25rem] text-[12px] text-[var(--color-ink-2)]">
          {running
            ? `Running the acceptance command in your repo. ${elapsed} seconds so far; this page will say what happened when it finishes.`
            : report
              ? `Finished: ${report.outcome}.`
              : ''}
        </p>

        {!asking && !ready && (
          <div id="run-blocked" className="mt-2 max-w-[70ch] rounded border border-[var(--color-warn)] bg-[var(--color-warn-soft)] px-3 py-2 text-[13px]">
            {!repo?.canRun ? (
              <>
                <p className="font-semibold text-[var(--color-warn)]">Not runnable in this copy.</p>
                <p className="mt-1 text-[var(--color-ink-2)]">
                  {notice} The command above is the same one the local install would run — copy it, run it in your
                  repo, and record what happened below.
                </p>
              </>
            ) : !repo.configured ? (
              <>
                <p className="font-semibold text-[var(--color-warn)]">No practice repo is configured yet.</p>
                <p className="mt-1 text-[var(--color-ink-2)]">
                  The check needs to know which directory to run in, and nothing has told it.{' '}
                  <Link href="/setup" className="text-[var(--color-accent)] underline underline-offset-2">
                    Point it at your repo in Setup
                  </Link>{' '}
                  and this button starts working. Until then you can run the command yourself.
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-[var(--color-warn)]">The configured repo cannot be used.</p>
                <p className="mt-1 text-[var(--color-ink-2)]">
                  {repo.root && (
                    <>
                      It points at <code className="rounded bg-[var(--color-surface-2)] px-1 font-mono text-[12px]">{repo.root}</code>.{' '}
                    </>
                  )}
                  <span className="font-mono text-[12.5px]">{repo.problem ?? 'unknown problem'}</span>{' '}
                  <Link href="/setup" className="text-[var(--color-accent)] underline underline-offset-2">
                    Fix it in Setup
                  </Link>
                  .
                </p>
              </>
            )}
          </div>
        )}

        {ready && repo?.root && (
          <p className="mt-2 text-[12px] text-[var(--color-ink-3)]">
            Working directory: <code className="rounded bg-[var(--color-surface-2)] px-1 font-mono">{repo.root}</code>
          </p>
        )}

        {crashed && (
          <p role="note" className="mt-2 max-w-[70ch] text-[13px] text-[var(--color-danger)]">{crashed}</p>
        )}
      </div>

      {report && <CheckResult report={report} />}

      {!asking && !ready && (
        <div className="rounded border border-dashed border-[var(--color-rule)] p-4">
          <SelfReport
            practiceId={practiceId}
            rungs={rungs}
            intro="Ran it in your own terminal instead? Say what happened — a self-reported attempt is kept exactly like a runner-produced one, including the failures."
          />
        </div>
      )}
    </div>
  );
}
