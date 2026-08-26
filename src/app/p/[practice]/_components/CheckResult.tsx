'use client';

import { useState } from 'react';
import { OUTCOME, TONE_BORDER, TONE_TEXT, recordsAttempt, secs } from './report';
import type { CheckReport } from './report';

/**
 * One run, rendered. Six outcomes, six states — the point of this component is that
 * `compile-error` never wears the clothes of `failed`, and that "could not run" never
 * looks like a verdict on your code.
 */
export function CheckResult({ report }: { report: CheckReport }) {
  const [showLog, setShowLog] = useState(false);
  const copy = OUTCOME[report.outcome];
  const fails = report.cases.filter((c) => !c.passed);
  const passes = report.cases.filter((c) => c.passed);
  const log = [report.stderrTail.trim(), report.stdoutTail.trim()].filter(Boolean).join('\n\n--- stdout ---\n');

  return (
    <div className={`rounded border ${TONE_BORDER[copy.tone]} bg-[var(--color-surface)] p-4`}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span
          className={`rounded border px-1.5 py-px text-[11px] uppercase tracking-wider ${TONE_BORDER[copy.tone]} ${TONE_TEXT[copy.tone]}`}
        >
          {copy.label}
        </span>
        <span className="text-[13px] text-[var(--color-ink-3)] tabular-nums">
          {secs(report.durationMs)}
          {report.cases.length > 0 && ` · ${report.passed} of ${report.cases.length} passed`}
        </span>
      </div>

      <p className="mt-2 max-w-[70ch] text-[14px] font-medium">{copy.headline}</p>
      <p className="mt-1 max-w-[70ch] text-[13px] text-[var(--color-ink-2)]">{copy.body}</p>

      {report.reason && (
        <p className="mt-2 max-w-[70ch] rounded border border-dashed border-[var(--color-rule)] bg-[var(--color-surface-2)] px-3 py-2 text-[13px]">
          <span className="text-[var(--color-ink-3)]">The runner said: </span>
          <span className="font-mono text-[12.5px] text-[var(--color-ink)]">{report.reason}</span>
        </p>
      )}

      {report.ran && (
        <p className="mt-2 text-[12px] text-[var(--color-ink-3)]">
          Ran <code className="rounded bg-[var(--color-surface-2)] px-1 font-mono">{report.ran}</code>
          {report.outcome === 'refused' ? ' — or would have, had it parsed.' : ' in your configured repo.'}
        </p>
      )}

      {fails.length > 0 && (
        <section className="mt-4" aria-label="Failing tests">
          <h4 className="text-[12px] uppercase tracking-wider text-[var(--color-ink-3)]">
            {fails.length} failing test{fails.length === 1 ? '' : 's'}
          </h4>
          <ul className="mt-2 flex flex-col gap-2">
            {fails.map((c, i) => (
              <li key={`${c.classname}-${c.name}-${i}`} className="rounded border border-[var(--color-danger)] bg-[var(--color-surface-2)] px-3 py-2">
                <p className="font-mono text-[13px] text-[var(--color-ink)]">
                  {c.classname && <span className="text-[var(--color-ink-3)]">{c.classname}::</span>}
                  {c.name}
                </p>
                <pre className="mt-1 max-w-full overflow-x-auto whitespace-pre-wrap break-words font-mono text-[12.5px] text-[var(--color-danger)]">
                  {c.failure?.trim() || 'The test reported a failure with no message.'}
                </pre>
              </li>
            ))}
          </ul>
        </section>
      )}

      {passes.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-[13px] text-[var(--color-ink-2)] hover:text-[var(--color-accent)]">
            {passes.length} passing test{passes.length === 1 ? '' : 's'}
          </summary>
          <ul className="mt-2 flex flex-col gap-1">
            {passes.map((c, i) => (
              <li key={`${c.classname}-${c.name}-${i}`} className="flex flex-wrap items-baseline gap-x-2 font-mono text-[12.5px]">
                <span aria-hidden="true" className="text-[var(--color-good)]">✓</span>
                <span className="text-[var(--color-ink-2)]">
                  {c.classname && <span className="text-[var(--color-ink-3)]">{c.classname}::</span>}
                  {c.name}
                </span>
                <span className="text-[var(--color-ink-3)] tabular-nums">{c.time ? `${c.time.toFixed(2)}s` : ''}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      {log && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowLog((v) => !v)}
            aria-expanded={showLog}
            className="text-[13px] text-[var(--color-ink-2)] underline-offset-2 hover:text-[var(--color-accent)] hover:underline"
          >
            {showLog ? 'Hide the raw output' : 'Show the raw output'}
          </button>
          {showLog && (
            <pre className="mt-2 max-h-[24rem] overflow-auto rounded border border-[var(--color-rule)] bg-[var(--color-surface-2)] p-3 font-mono text-[12px] leading-relaxed whitespace-pre-wrap break-words">
              {log}
            </pre>
          )}
        </div>
      )}

      <p className="mt-3 border-t border-[var(--color-rule)] pt-2 text-[12px] text-[var(--color-ink-3)]">
        {recordsAttempt(report.outcome)
          ? report.outcome === 'compile-error'
            ? 'Recorded as an attempt that did not pass. The history keeps pass or not-pass only, so this row will read the same as a failing test — the distinction lives here, in the run.'
            : `Recorded as an attempt that ${report.outcome === 'passed' ? 'passed' : 'did not pass'}, with the run’s output attached.`
          : 'Not recorded as an attempt. Nothing about your code was measured, so there is nothing honest to write down.'}
      </p>
    </div>
  );
}
