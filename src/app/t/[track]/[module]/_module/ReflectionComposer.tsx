'use client';

import { useEffect, useId, useState } from 'react';
import { store } from '@/lib/state/client';
import type { ReflectionRow } from '@/lib/state/store';
import { whenLong } from './fmt';

/**
 * The reflection is the one place you write instead of read, so it is append-only:
 * every answer is kept with its date and with the prompt as it was worded that day.
 * Re-reading what you thought three months ago is the point — an editable single field
 * would quietly destroy the only evidence that your understanding moved.
 *
 * The store decides where the text lands (local database or this device's browser);
 * this component only states which of the two happened, in words.
 */
export function ReflectionComposer({
  moduleId, prompt, deviceOnlyNotice,
}: {
  moduleId: string;
  prompt: string;
  /** set when the mode cannot keep composed text beyond this device */
  deviceOnlyNotice: string | null;
}) {
  const fieldId = useId();
  const [body, setBody] = useState('');
  const [rows, setRows] = useState<ReflectionRow[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [said, setSaid] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    store.reflectionsFor(moduleId)
      .then((r) => { if (live) setRows(r); })
      .catch(() => { if (live) { setRows([]); setFailed(true); } });
    return () => { live = false; };
  }, [moduleId]);

  async function save() {
    const text = body.trim();
    if (!text) return;
    setBusy(true);
    setSaid(null);
    try {
      const row = await store.saveReflection(moduleId, prompt, text);
      setRows((prev) => [row, ...(prev ?? [])]);
      setBody('');
      setFailed(false);
      setSaid(
        store.durable
          ? 'Saved. It is kept by the local install and listed below.'
          : 'Saved in this browser only — this device, not synced. It is listed below.',
      );
    } catch {
      setFailed(true);
      setSaid(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3">
      <label htmlFor={fieldId} className="block text-[12px] text-[var(--color-ink-3)]">
        Your answer, in your own words. Nothing checks it; recalling it is the exercise.
      </label>
      <textarea
        id={fieldId}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={5}
        placeholder="Write the answer in your own words."
        aria-describedby={`${fieldId}-status`}
        className="mt-1 block w-full resize-y rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-2 text-[13px] leading-6 text-[var(--color-ink)] placeholder:text-[var(--color-ink-3)]"
      />

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy || body.trim().length === 0}
          className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-1.5 text-[12.5px] text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:border-dashed disabled:text-[var(--color-ink-3)] disabled:hover:border-dashed disabled:hover:text-[var(--color-ink-3)]"
        >
          {busy ? 'Saving…' : 'Save this answer'}
        </button>
        <p id={`${fieldId}-status`} className="text-[12px] text-[var(--color-ink-3)]" aria-live="polite">
          {failed
            ? 'That answer did not reach the store. It is still in the box above — copy it somewhere before you leave.'
            : said
              ? said
              : body.trim().length === 0
                ? 'Answers are kept with their date and never overwritten.'
                : 'Not saved yet.'}
        </p>
      </div>

      {deviceOnlyNotice && (
        <p role="note" className="mt-2 max-w-[68ch] text-[12px] text-[var(--color-warn)]">
          {deviceOnlyNotice}
        </p>
      )}

      <section aria-labelledby={`${fieldId}-past`} className="mt-5">
        <h3 id={`${fieldId}-past`} className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-3)]">
          What you wrote before
        </h3>
        {rows === null ? (
          <p className="mt-2 text-[12.5px] text-[var(--color-ink-3)]">Reading your earlier answers…</p>
        ) : rows.length === 0 ? (
          <p className="mt-2 max-w-[68ch] rounded border border-dashed border-[var(--color-rule)] px-3 py-2 text-[12.5px] text-[var(--color-ink-3)]">
            Nothing recorded yet — you have not answered this prompt. The second answer is the useful one, so the
            first is worth writing badly.
          </p>
        ) : (
          <ol className="mt-2 flex flex-col gap-2">
            {rows.map((r) => (
              <li key={r.id} className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-2">
                <p className="text-[11px] tabular-nums text-[var(--color-ink-3)]">{whenLong(r.writtenAt)}</p>
                {r.prompt !== prompt && (
                  <p className="mt-1 max-w-[68ch] text-[11.5px] italic text-[var(--color-warn)]">
                    Answered a different wording of this prompt: &ldquo;{r.prompt}&rdquo;
                  </p>
                )}
                <p className="mt-1 max-w-[68ch] whitespace-pre-wrap text-[13px] leading-6 text-[var(--color-ink)]">
                  {r.body}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
