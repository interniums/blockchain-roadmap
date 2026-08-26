'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { REVIEW_RECORDED_EVENT } from '@/components/lesson/Check';
import { store } from '@/lib/state/client';
import type { Mastery } from '@/lib/state/store';
import { Notice } from './bits';
import { useLessonProgress } from './progress';

/**
 * What this lesson puts into the review system, and where each of those concepts actually stands.
 *
 * Marking a lesson read is the act that introduces its concepts — unproven. A concept that has only
 * ever been credited by descendants says so: a high credited share means you have never once been
 * asked to produce it.
 */

export interface TaughtConcept { id: string; title: string }

function due(at: number): string {
  const now = new Date();
  if (at <= now.getTime()) return 'due now';
  const d = new Date(at);
  if (d.toDateString() === now.toDateString()) return 'due later today';
  return `next due ${d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`;
}

function describe(m: Mastery | undefined): { text: string; tone: 'ink3' | 'warn' } {
  if (!m || (m.reps === 0 && m.due === null)) {
    return { text: 'not in review yet', tone: 'ink3' };
  }
  if (m.reps === 0) {
    return { text: 'in review, unproven — never tested against you', tone: 'warn' };
  }
  const parts = [
    `mastery ${Math.round(m.mastery * 100)}%`,
    `${m.reps} direct review${m.reps === 1 ? '' : 's'}`,
  ];
  if (m.due !== null) parts.push(due(m.due));
  if (m.creditedShare > 0.05) {
    return {
      text: `${parts.join(' · ')} · ${Math.round(m.creditedShare * 100)}% of its stability is prerequisite credit, not retrieval`,
      tone: 'warn',
    };
  }
  return { text: parts.join(' · '), tone: 'ink3' };
}

export function ReviewEntry({ concepts }: { concepts: TaughtConcept[] }) {
  const p = useLessonProgress();
  const [rows, setRows] = useState<Mastery[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [version, setVersion] = useState(0);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  const idKey = concepts.map((c) => c.id).join(',');

  useEffect(() => {
    let alive = true;
    const ids = idKey ? idKey.split(',') : [];
    if (!ids.length) { setRows([]); return () => { alive = false; }; }
    (async () => {
      try {
        const m = await store.masteryFor(ids);
        if (alive) { setRows(m); setFailed(false); }
      } catch {
        if (alive) { setRows(null); setFailed(true); }
      }
    })();
    return () => { alive = false; };
  }, [idKey, version]);

  // An inline check that recorded something changes these numbers under us.
  useEffect(() => {
    const bump = () => setVersion((v) => v + 1);
    window.addEventListener(REVIEW_RECORDED_EVENT, bump);
    return () => window.removeEventListener(REVIEW_RECORDED_EVENT, bump);
  }, []);

  if (!p) {
    return <Notice tone="warn">This page is not tracking progress, so nothing here is recorded.</Notice>;
  }

  const byId = new Map((rows ?? []).map((m) => [m.conceptId, m]));
  const read = p.state?.status === 'read';
  const one = concepts.length === 1;

  /** Concepts marking-as-read would actually introduce — the rest are already in the system. */
  const newToReview = rows === null
    ? null
    : concepts.filter((c) => {
      const m = byId.get(c.id);
      return !m || (m.reps === 0 && m.due === null);
    }).length;

  async function onMarkRead() {
    if (!p) return;
    const introduced = newToReview;
    await p.markRead();
    setVersion((v) => v + 1);
    setAnnouncement(
      concepts.length === 0
        ? 'Marked read. This lesson teaches no concepts, so nothing entered review.'
        : introduced === null
          ? 'Marked read.'
          : introduced === 0
            ? 'Marked read. Nothing new entered review — every concept it teaches was already there.'
            : `Marked read. ${introduced} concept${introduced === 1 ? '' : 's'} entered review, unproven until a check tests you on ${introduced === 1 ? 'it' : 'them'}.`,
    );
  }

  return (
    <div>
      {concepts.length === 0 ? (
        <Notice>Nothing — this lesson teaches no concepts.</Notice>
      ) : (
        <ul className="mt-1.5 flex flex-col gap-1">
          {concepts.map((c) => {
            const d = describe(byId.get(c.id));
            return (
              <li key={c.id} className="text-[13px]">
                <Link href={`/c/${c.id}`} className="hover:text-[var(--color-accent)]">{c.title}</Link>
                <span className={d.tone === 'warn' ? 'text-[var(--color-warn)]' : 'text-[var(--color-ink-3)]'}>
                  {' — '}
                  {rows === null ? (failed ? 'state unavailable' : 'checking…') : d.text}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {failed && (
        <Notice tone="danger">
          Could not read your review state. The list above is names only — treat the numbers as
          missing, not as zero.
        </Notice>
      )}

      <div className="mt-2.5 border-t border-[var(--color-rule)] pt-2.5">
        {p.loading ? (
          <p className="m-0 text-[12px] text-[var(--color-ink-3)]" aria-live="polite">checking your progress…</p>
        ) : read ? (
          <p className="m-0 text-[12.5px] text-[var(--color-good)]">
            Marked read.{' '}
            <span className="text-[var(--color-ink-3)]">
              {concepts.length === 0
                ? 'It taught no concepts, so the queue is unchanged.'
                : `Its ${one ? 'concept is' : `${concepts.length} concepts are`} in the review system — what the queue knows about ${one ? 'it is the line' : 'them is the lines'} above, not this button.`}
            </span>
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={() => void onMarkRead()}
              disabled={p.marking}
              className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-1.5 text-[13px] hover:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:text-[var(--color-ink-3)] disabled:hover:border-[var(--color-rule)]"
            >
              {p.marking ? 'Recording…' : 'Mark this lesson as read'}
            </button>
            <Notice>
              {concepts.length === 0
                ? 'Records the lesson as read. It teaches no concepts, so nothing enters the queue.'
                : newToReview === null
                  ? 'Records the lesson as read, and puts any concept it teaches that is not already in the review queue there, unproven.'
                  : newToReview === 0
                    ? `Records the lesson as read. ${one ? 'Its concept is' : 'Its concepts are'} already in the review queue, so nothing new is introduced.`
                    : `Puts ${newToReview === 1 ? 'one concept' : `${newToReview} concepts`} into the review queue unproven — read is not the same as known, and the queue will treat ${newToReview === 1 ? 'it' : 'them'} that way until a check tests you.`}
            </Notice>
          </>
        )}

        {!p.durable && (
          <Notice tone="warn">
            This is the web copy: what you record lives in this browser, is not synced to any other
            device, and goes when you clear site data.
          </Notice>
        )}

        <p className="sr-only" aria-live="polite">{announcement ?? ''}</p>
      </div>
    </div>
  );
}
