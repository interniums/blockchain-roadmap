'use client';

import { useActionState } from 'react';
import { saveRepoRoot, type SaveState } from './actions';

/**
 * The one interactive leaf on this screen. It submits a path and reports back exactly what the
 * safety gate said — no reinterpretation, because a vague "invalid path" is useless when the real
 * answer is "that directory has no foundry.toml".
 */
export function RepoForm({ current, rules }: { current: string | null; rules: string[] }) {
  const [state, formAction, pending] = useActionState<SaveState, FormData>(
    saveRepoRoot,
    { status: 'idle' },
  );

  return (
    <form action={formAction} className="mt-4 rounded border border-[var(--color-rule)] bg-[var(--color-surface)] p-4">
      <label htmlFor="repo-path" className="block text-[13px] font-medium">
        Absolute path to your practice repo
      </label>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          id="repo-path"
          name="path"
          type="text"
          inputMode="text"
          defaultValue={current ?? ''}
          placeholder="/Users/you/code/chainpath-practice"
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          aria-describedby="repo-rules repo-save-status"
          className="min-w-0 flex-1 rounded border border-[var(--color-rule)] bg-[var(--color-surface-2)] px-2 py-1.5 font-mono text-[13px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-3)]"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded border border-[var(--color-accent)] px-3 py-1.5 text-[13px] font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] disabled:cursor-not-allowed disabled:border-[var(--color-rule)] disabled:text-[var(--color-ink-3)] disabled:hover:bg-transparent"
        >
          {pending ? 'Checking…' : current ? 'Save new path' : 'Save path'}
        </button>
      </div>

      <p id="repo-save-status" aria-live="polite" className="mt-2 min-h-[1.25rem] text-[13px]">
        {pending && <span className="text-[var(--color-ink-2)]">Checking the path before writing anything…</span>}
        {!pending && state.status === 'saved' && (
          <span className="text-[var(--color-good)]">
            Saved. Runnable checks will spawn with{' '}
            <code className="rounded bg-[var(--color-surface-2)] px-1 font-mono text-[12px]">{state.path}</code> as
            their working directory.
          </span>
        )}
        {!pending && state.status === 'error' && (
          <span className="text-[var(--color-danger)]">
            <strong className="font-semibold">Not saved</strong> — {state.message}
            {state.attempted && (
              <>
                {' '}Nothing was written; the previous value, if any, still stands.
              </>
            )}
          </span>
        )}
      </p>

      <details className="mt-3">
        <summary className="cursor-pointer text-[12px] text-[var(--color-ink-2)]">
          What the path has to satisfy
        </summary>
        <ul id="repo-rules" className="mt-2 flex list-disc flex-col gap-1 pl-5 text-[12px] text-[var(--color-ink-2)]">
          {rules.map((r) => <li key={r}>{r}</li>)}
        </ul>
        <p className="mt-2 max-w-[70ch] text-[12px] text-[var(--color-ink-3)]">
          These are checked before the value is written, not when a check is run, so a path that saves
          is a path the runner will accept. It is re-checked on every visit to this page as well —
          directories move.
        </p>
      </details>
    </form>
  );
}
