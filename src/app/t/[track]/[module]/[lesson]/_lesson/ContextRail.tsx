import Link from 'next/link';
import { can, WEB_NOTICE } from '@/lib/capabilities';
import { Notice, Panel, TierBadge } from './bits';
import type { SourceEntry } from './graph';

/**
 * Right rail: where the claims come from, and the two things a reader wants to do while reading —
 * write something down, and ask something. Web mode never degrades silently: a control that needs
 * the local install is disabled and says why in words.
 */

const BTN =
  'w-full rounded border border-[var(--color-rule)] px-2 py-1.5 text-[12.5px] text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:border-[var(--color-rule)] disabled:text-[var(--color-ink-3)] disabled:hover:border-[var(--color-rule)] disabled:hover:text-[var(--color-ink-3)]';

function SourcesPanel({ entries, unresolved }: { entries: SourceEntry[]; unresolved: string[] }) {
  return (
    <Panel
      id="rail-sources"
      title="Sources"
      aside={entries.length ? `${entries.length}` : undefined}
      tone={entries.length === 0 ? 'danger' : 'neutral'}
    >
      {entries.length === 0 ? (
        <Notice tone="danger">
          No source is attached to any concept in this lesson. The sources rail is never allowed to be
          empty — this is a content bug the linter should fail on, not a gap you should read past.
        </Notice>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {entries.map(({ source, cited, host }) => (
            <li key={source.id}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[12.5px] leading-snug text-[var(--color-ink)] hover:text-[var(--color-accent)]"
              >
                {source.title} <span aria-hidden="true">↗</span>
              </a>
              <span className="mt-1 flex flex-wrap items-center gap-1.5">
                <TierBadge tier={source.tier} />
                {source.vendor && (
                  <span className="text-[11px] text-[var(--color-warn)]" title="Published by a party with an interest in the claim.">
                    vendor
                  </span>
                )}
                <span className="text-[11px] text-[var(--color-ink-3)]">{host}</span>
              </span>
              <span className="mt-0.5 block text-[11px] text-[var(--color-ink-3)]">
                Cited by: {cited.join(', ')}
              </span>
            </li>
          ))}
        </ul>
      )}

      {unresolved.length > 0 && (
        <Notice tone="danger">
          Unresolved source ids: {unresolved.join(', ')}. A concept cites a source that is not in the
          library.
        </Notice>
      )}

    </Panel>
  );
}

function NotesPanel({ lessonTitle }: { lessonTitle: string }) {
  return (
    <Panel id="rail-notes" title="Notes">
      <details>
        <summary className="cursor-pointer text-[12.5px] text-[var(--color-ink-2)]">
          Write a note on this lesson
        </summary>
        <div className="mt-2">
          <label htmlFor="lesson-note" className="sr-only">
            Note on {lessonTitle}
          </label>
          <textarea
            id="lesson-note"
            name="note"
            rows={5}
            disabled={!can.composeNotes}
            placeholder={can.composeNotes ? 'What you want to remember, in your own words…' : 'Unavailable in the web copy'}
            className="w-full rounded border border-[var(--color-rule)] bg-[var(--color-surface-2)] p-2 text-[12.5px] text-[var(--color-ink)] disabled:cursor-not-allowed disabled:text-[var(--color-ink-3)]"
          />
          <Notice tone={can.composeNotes ? 'neutral' : 'warn'}>
            {can.composeNotes
              ? 'Held in this tab only. Saving notes against a concept arrives with the notes store — nothing here is persisted yet.'
              : WEB_NOTICE}
          </Notice>
        </div>
      </details>
    </Panel>
  );
}

function AskPanel() {
  return (
    <Panel id="rail-ask" title="Ask a question">
      {can.persistProgress ? (
        <Link href="/questions" className={`${BTN} block text-center`}>
          Open your questions
        </Link>
      ) : (
        <>
          <button type="button" className={BTN} disabled aria-describedby="ask-note">
            Record a question
          </button>
          <Notice id="ask-note" tone="warn">
            {WEB_NOTICE} You can still read questions already recorded.
          </Notice>
          <p className="mt-1">
            <Link href="/questions" className="text-[12px] text-[var(--color-ink-3)] hover:text-[var(--color-accent)]">
              Browse questions →
            </Link>
          </p>
        </>
      )}
      <Notice>
        Asking in place — select a sentence, press ? — is captured against the concept you selected.
        That capture lands with the question store; today the questions screen is the way in.
      </Notice>
    </Panel>
  );
}

export function ContextRail({
  entries, unresolved, lessonTitle,
}: { entries: SourceEntry[]; unresolved: string[]; lessonTitle: string }) {
  return (
    <div className="flex flex-col gap-4">
      <SourcesPanel entries={entries} unresolved={unresolved} />
      <NotesPanel lessonTitle={lessonTitle} />
      <AskPanel />
      <Panel id="rail-library" title="Look up">
        <ul className="flex flex-col gap-1 text-[12.5px]">
          <li>
            <Link href="/glossary" className="hover:text-[var(--color-accent)]">Glossary →</Link>
          </li>
          <li>
            <Link href="/review" className="hover:text-[var(--color-accent)]">Review queue →</Link>
          </li>
        </ul>
      </Panel>
    </div>
  );
}
