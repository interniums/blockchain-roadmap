'use client';

import Link from 'next/link';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { store } from '@/lib/state/client';
import type { QuestionRow } from '@/lib/state/store';
import { composeQuestion, trimSelection } from './text';

/**
 * One keystroke to ask. Mount this anywhere a learner is reading: select a line, press ?,
 * type the question, keep reading. The question is stamped with the concept in scope and with
 * where it was raised, so the inbox can lead you back to it months later.
 *
 * Owned by the question surface. Other screens mount it; they do not reimplement it.
 *
 *   <AskQuestion
 *     conceptIds={lesson.teaches}
 *     conceptTitles={{ 'solana-account': 'Everything is an account' }}
 *     raisedFrom={`/t/${trackId}/${moduleId}/${lessonId}`}
 *     where="this lesson"
 *   />
 *
 * The control is always live: both backends accept writes. What changes between them is
 * durability, and that is stated in words rather than by disabling the button.
 */
export interface AskQuestionProps {
  /** Concepts in scope where this is mounted. The first is the default the question is filed under. */
  conceptIds?: string[];
  /** Optional id -> title, so the picker reads as prose rather than as slugs. */
  conceptTitles?: Record<string, string>;
  /** Where the question was raised — an app path is best, a lesson id also resolves. */
  raisedFrom?: string;
  /** Human name of this place, used in the dialog: "raised in this lesson". */
  where?: string;
  /** Bind the global ? key. Default true. Turn it off if the host screen owns that key. */
  hotkey?: boolean;
  /** Structural placement hint only — 'rail' stacks, 'inline' sits on one line. */
  variant?: 'inline' | 'rail';
  /** Called after a successful capture, so a host list can refresh without a reload. */
  onCaptured?: (row: QuestionRow) => void;
  className?: string;
}

function selectionText(): string {
  if (typeof window === 'undefined') return '';
  const sel = window.getSelection();
  return sel ? trimSelection(sel.toString()) : '';
}

export function AskQuestion({
  conceptIds = [],
  conceptTitles,
  raisedFrom,
  where,
  hotkey = true,
  variant = 'inline',
  onCaptured,
  className,
}: AskQuestionProps) {
  const uid = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  const [quote, setQuote] = useState('');
  const [keepQuote, setKeepQuote] = useState(true);
  const [body, setBody] = useState('');
  const [concept, setConcept] = useState(conceptIds[0] ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captured, setCaptured] = useState<{ text: string; conceptId: string } | null>(null);

  const start = useCallback(() => {
    setQuote(selectionText());
    setKeepQuote(true);
    setError(null);
    setOpen(true);
  }, []);

  // ? opens the composer. Ignored inside fields, and with any modifier held, so it never
  // steals a character you were typing.
  useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '?') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      e.preventDefault();
      start();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hotkey, start]);

  // Native <dialog> gives modal focus containment and Esc-to-close for free — no hand-rolled trap.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      fieldRef.current?.focus();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  /**
   * Focus goes back to the trigger from the dialog's own close event, which fires for every
   * route out — the Cancel button, a successful capture, and Esc. Restoring it any earlier
   * would try to focus a button the open modal still holds inert, and focus would land on the
   * document instead.
   */
  function onClosed() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const asked = body.trim();
    if (!asked || busy) return;
    setBusy(true);
    setError(null);
    try {
      const ids = concept ? [concept, ...conceptIds.filter((c) => c !== concept)] : conceptIds;
      const text = composeQuestion(asked, keepQuote && quote ? quote : null);
      const row = await store.askQuestion(text, ids, raisedFrom);
      setCaptured({ text: asked, conceptId: concept });
      setBody('');
      setQuote('');
      setOpen(false);
      onCaptured?.(row);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not record the question.');
    } finally {
      setBusy(false);
    }
  }

  const conceptLabel = (id: string) => conceptTitles?.[id] ?? id;
  const layout = variant === 'rail' ? 'flex flex-col items-start gap-1.5' : 'flex flex-wrap items-center gap-x-3 gap-y-1.5';

  return (
    <div className={`${layout} ${className ?? ''}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={start}
        className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-2.5 py-1 text-[13px] text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
      >
        Ask a question
        {hotkey && (
          <kbd className="ml-2 rounded border border-[var(--color-rule)] bg-[var(--color-surface-2)] px-1 font-mono text-[11px] text-[var(--color-ink-3)]">
            ?
          </kbd>
        )}
      </button>

      <p aria-live="polite" className="text-[12.5px] leading-relaxed text-[var(--color-ink-3)]">
        {captured ? (
          <>
            Captured{captured.conceptId ? <> against <span className="text-[var(--color-ink-2)]">{conceptLabel(captured.conceptId)}</span></> : null}.{' '}
            <Link href="/questions" className="text-[var(--color-accent)] hover:underline">
              Open the inbox
            </Link>
            .
          </>
        ) : (
          'Select a line first and it is quoted with the question.'
        )}
      </p>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${uid}-title`}
        onClose={onClosed}
        className="m-auto w-[min(92vw,620px)] rounded-lg border border-[var(--color-rule)] bg-[var(--color-surface)] p-0 text-[var(--color-ink)] backdrop:bg-[color-mix(in_srgb,var(--color-ink)_45%,transparent)]"
      >
        <form onSubmit={submit} className="flex flex-col gap-3 p-5">
          <div>
            <h2 id={`${uid}-title`} className="text-[16px] font-semibold">
              Ask a question
            </h2>
            <p className="mt-1 text-[13px] text-[var(--color-ink-2)]">
              It goes to the inbox as an open loop{where ? <> raised in {where}</> : null}. You do not have to
              answer it now — that is the point of writing it down.
            </p>
          </div>

          {quote && (
            <div className="rounded border border-[var(--color-rule)] bg-[var(--color-surface-2)] p-3">
              <p className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">The line you selected</p>
              <blockquote className="mt-1 border-l-2 border-[var(--color-rule)] pl-3 text-[13px] leading-6 text-[var(--color-ink-2)]">
                {quote}
              </blockquote>
              <label className="mt-2 flex items-center gap-2 text-[12.5px] text-[var(--color-ink-2)]">
                <input
                  type="checkbox"
                  checked={keepQuote}
                  onChange={(e) => setKeepQuote(e.target.checked)}
                  className="h-3.5 w-3.5 accent-[var(--color-accent)]"
                />
                Keep it with the question
              </label>
            </div>
          )}

          <div>
            <label htmlFor={`${uid}-body`} className="mb-1 block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
              Your question, in your own words
            </label>
            <textarea
              id={`${uid}-body`}
              ref={fieldRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              required
              placeholder="Wait, why…"
              className="block w-full resize-y rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-2 text-[14px] leading-6 text-[var(--color-ink)] placeholder:text-[var(--color-ink-3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-accent)]"
            />
          </div>

          {conceptIds.length > 1 ? (
            <div>
              <label htmlFor={`${uid}-concept`} className="mb-1 block text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
                File it under
              </label>
              <select
                id={`${uid}-concept`}
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                className="w-full rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-2 py-1.5 text-[13px] text-[var(--color-ink)]"
              >
                {conceptIds.map((id) => (
                  <option key={id} value={id}>
                    {conceptLabel(id)}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[12px] text-[var(--color-ink-3)]">
                The other {conceptIds.length - 1} concepts in scope stay attached as context.
              </p>
            </div>
          ) : (
            <p className="text-[12.5px] text-[var(--color-ink-3)]">
              {concept ? (
                <>Filed under <span className="text-[var(--color-ink-2)]">{conceptLabel(concept)}</span>.</>
              ) : (
                'No concept in scope here, so it lands in the inbox under “not tied to a concept”.'
              )}
            </p>
          )}

          {!store.durable && (
            <p className="rounded border border-[var(--color-rule)] bg-[var(--color-warn-soft)] px-3 py-2 text-[12.5px] leading-relaxed text-[var(--color-warn)]">
              This copy keeps questions in this browser only. They are real and they persist here, but they do
              not follow you to another device, and clearing site data erases them.
            </p>
          )}

          {error && (
            <p role="alert" className="text-[12.5px] text-[var(--color-danger)]">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={busy || !body.trim()}
              className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-1.5 text-[13px] text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:text-[var(--color-ink-3)] disabled:hover:border-[var(--color-rule)] disabled:hover:text-[var(--color-ink-3)]"
            >
              {busy ? 'Recording…' : 'Capture and keep reading'}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded px-2 py-1.5 text-[13px] text-[var(--color-ink-2)] hover:text-[var(--color-accent)]"
            >
              Cancel
            </button>
            <span className="text-[12px] text-[var(--color-ink-3)]">Esc closes without recording.</span>
          </div>
        </form>
      </dialog>
    </div>
  );
}
