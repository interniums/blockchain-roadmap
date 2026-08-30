'use client';
/**
 * Questions raised against this concept. Captured here, resolved on the questions board.
 *
 * They age visibly and are never auto-closed: a three-month-old open loop is the signal,
 * and hiding it would be the point of the feature thrown away.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { can } from '@/lib/capabilities';
import { store } from '@/lib/state/client';
import type { QuestionRow } from '@/lib/state/store';

const DAY = 86_400_000;

function age(raisedAt: number, now: number): string {
  const days = Math.floor((now - raisedAt) / DAY);
  if (days <= 0) return 'raised today';
  if (days === 1) return 'raised yesterday';
  if (days < 60) return `open ${days} days`;
  return `open ${Math.floor(days / 30)} months`;
}

export function QuestionsPanel({
  conceptId, conceptTitle,
}: { conceptId: string; conceptTitle: string }) {
  const [rows, setRows] = useState<QuestionRow[] | null>(null);
  /** Ages are measured from when the list was read, never from render time. */
  const [readAt, setReadAt] = useState(0);
  const [failed, setFailed] = useState(false);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    store.questions()
      .then((all) => {
        if (!alive) return;
        setRows(all.filter((q) => q.conceptIds.includes(conceptId)));
        setReadAt(Date.now());
      })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, [conceptId]);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setSaving(true);
    setError(null);
    try {
      const row = await store.askQuestion(body, [conceptId], `/c/${conceptId}`);
      setRows((prev) => [row, ...(prev ?? [])]);
      setText('');
      setSaved('Saved against this concept. It is on the questions board until you answer it.');
    } catch {
      setError('Not saved — the state store rejected the write. Your text is still in the box.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h3 className="text-[13.5px] font-semibold text-[var(--color-ink)]">Your questions here</h3>

      {failed ? (
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-danger)]">
          Your questions could not be read. None are shown rather than none existing.
        </p>
      ) : rows === null ? (
        <p className="mt-2 text-[13px] text-[var(--color-ink-3)]" role="status" aria-live="polite">
          Reading your questions…
        </p>
      ) : rows.length === 0 ? (
        <p className="mt-2 rounded border border-dashed border-[var(--color-rule)] px-3 py-2.5 text-[13px] leading-relaxed text-[var(--color-ink-3)]">
          None recorded. Anything you raise against &ldquo;{conceptTitle}&rdquo; collects here and on the{' '}
          <Link href="/questions" className="hover:text-[var(--color-accent)]">questions board</Link>, and
          ages visibly — a three-month-old open loop reads as the signal it is.
        </p>
      ) : (
        <ul className="mt-2 flex flex-col divide-y divide-[var(--color-rule)]">
          {rows.map((q) => (
            <li key={q.id} className="py-2">
              <p className="text-[13px] leading-relaxed text-[var(--color-ink)]">{q.text}</p>
              <p className="mt-0.5 text-[11.5px] text-[var(--color-ink-3)]">
                {q.status === 'open' ? age(q.raisedAt, Math.max(readAt, q.raisedAt)) : q.status}
                {q.raisedFrom && q.raisedFrom !== `/c/${conceptId}` && <> · from {q.raisedFrom}</>}
              </p>
              {q.answer && (
                <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--color-ink-2)]">{q.answer}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={ask} className="mt-3">
        <label htmlFor={`ask-${conceptId}`} className="text-[12px] text-[var(--color-ink-2)]">
          Ask a question about this concept
        </label>
        <textarea
          id={`ask-${conceptId}`}
          value={text}
          onChange={(e) => { setText(e.target.value); setSaved(null); }}
          rows={3}
          className="mt-1 w-full rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-2.5 py-2 text-[13px] text-[var(--color-ink)]"
          placeholder="What is still not clear?"
        />
        <button
          type="submit"
          disabled={saving || text.trim().length === 0}
          className="mt-2 rounded border border-[var(--color-rule)] px-3 py-1.5 text-[13px] text-[var(--color-ink-2)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save question'}
        </button>
        <p className="mt-1 text-[12px] leading-snug text-[var(--color-ink-3)]">
          Recorded, not answered. You answer it yourself on the questions board when the answer arrives.
        </p>
      </form>

      <div role="status" aria-live="polite" className="mt-2">
        {error && <p className="text-[12.5px] text-[var(--color-danger)]">{error}</p>}
        {saved && !error && <p className="text-[12.5px] text-[var(--color-ink-2)]">{saved}</p>}
      </div>

      {!can.persistProgress && (
        <p className="mt-2 max-w-[52ch] text-[12px] leading-snug text-[var(--color-ink-3)]">
          On this hosted copy the question is kept in this browser only. It will not follow you to another
          device, and clearing site data removes it.
        </p>
      )}
    </div>
  );
}
