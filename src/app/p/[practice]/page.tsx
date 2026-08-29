import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  graph, getPractice, getPracticesOf, getModule, getTrack, getConcept, crumbsFor,
} from '@/lib/content/load';
import { can, WEB_NOTICE } from '@/lib/capabilities';
import { classifyAcceptance, parseAcceptanceCommand } from '@/lib/runner/safety';
import type { Crumb, PracticeKind } from '@/lib/content/types';
import { Breadcrumb } from '@/components/nav/Breadcrumb';
import { TrackRail } from '@/components/nav/TrackRail';
import { Keyboard } from '@/components/nav/Keyboard';
import { Prose, asText } from './_components/Prose';
import { HintLadder } from './_components/HintLadder';
import { RunCheck } from './_components/RunCheck';
import { ManualCheck } from './_components/ManualCheck';
import { AttemptLog } from './_components/AttemptLog';
import { whyManual } from './_components/explain';
import { inventory } from '@/app/setup/inventory';

/** All 236 practices are prerendered; anything else falls through to notFound(). */
export function generateStaticParams() {
  return [...graph().practiceById.keys()].map((practice) => ({ practice }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ practice: string }> },
): Promise<Metadata> {
  const { practice } = await params;
  const p = getPractice(practice);
  if (!p) return { title: 'Practice · Chainpath' };
  return { title: `${p.title} · Practice · Chainpath`, description: asText(p.spec).slice(0, 160) || undefined };
}

const KIND_BLURB: Record<PracticeKind, string> = {
  implement: 'Build the thing from the spec. Passing means it works, not that it compiles.',
  break: 'Make the failure happen on purpose. You have not understood a vulnerability until you can trigger it.',
  fix: 'Repair something already broken, without breaking anything else.',
  read: 'Read real code or a real spec and report what it actually does — not what it is said to do.',
  measure: 'Produce a number from a live system and be able to defend how you got it.',
  write: 'Write it down in your own words. If you cannot explain it, you do not have it.',
};

function Difficulty({ level }: { level: number }) {
  const n = Math.max(1, Math.min(5, Math.round(level)));
  return (
    <span className="inline-flex items-center gap-1" role="img" aria-label={`${n} of 5`} title={`${n} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`inline-block h-2 w-2 rounded-full border ${
            i <= n
              ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
              : 'border-[var(--color-rule)]'
          }`}
        />
      ))}
    </span>
  );
}

export default async function PracticePage({ params }: { params: Promise<{ practice: string }> }) {
  const { practice: id } = await params;
  const p = getPractice(id);
  if (!p) notFound();

  const mod = getModule(p.moduleId);
  const track = mod ? getTrack(mod.trackId) : undefined;
  const moduleHref = track && mod ? `/t/${track.id}/${mod.id}` : '/m';

  const crumbs: Crumb[] = [
    ...crumbsFor({ trackId: mod?.trackId, moduleId: p.moduleId }),
    { href: `/p/${p.id}`, label: p.title },
  ];

  const family = [...getPracticesOf(p.moduleId)].sort((a, b) => a.id.localeCompare(b.id));
  const i = family.findIndex((x) => x.id === p.id);
  const prev = i > 0 ? family[i - 1] : null;
  const next = i >= 0 && i < family.length - 1 ? family[i + 1] : null;

  const concepts = (p.concepts ?? [])
    .map((cid) => getConcept(cid))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const criteria = p.acceptance?.criteria ?? [];
  const command = asText(p.acceptance?.command).trim() || null;
  const hints = p.hints ?? [];

  /**
   * The tier is a property of the authored command, decided here on the server by the same parser
   * the runner uses. Runnable: the app executes it and grades the JUnit. Manual: it needs a shell,
   * so it is handed to you instead. The split is a design decision, not a shortfall — and it is
   * counted from the content by `inventory()`, never asserted, because a hand-written figure here
   * was already wrong in both directions.
   */
  const tier = classifyAcceptance(command ?? undefined);
  const inv = inventory();
  const runnable = tier.tier === 'runnable' && Boolean(command);
  /** computed either way so the manual copy is always available; ignored on the runnable branch */
  const why = whyManual(tier.reason, command);
  let argv = '';
  if (runnable && command) {
    try {
      const parsed = parseAcceptanceCommand(command);
      argv = [parsed.bin, ...parsed.args].join(' ');
    } catch {
      // classifyAcceptance already parsed this; if the two ever disagree, show the raw command only.
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[1500px] gap-8 px-6 py-6">
      <Keyboard
        up={moduleHref}
        prev={prev ? `/p/${prev.id}` : undefined}
        next={next ? `/p/${next.id}` : undefined}
      />

      <aside className="hidden w-[210px] shrink-0 lg:block">
        <div className="sticky top-6">
          {mod ? <TrackRail trackId={mod.trackId} activeModuleId={mod.id} /> : (
            <Link href="/" className="text-[13px] text-[var(--color-accent)]">← Curriculum</Link>
          )}
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <Breadcrumb crumbs={crumbs} />

        <p className="mt-4 text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">Practice</p>
        <h1 className="mt-1 max-w-[30ch] text-[26px] font-semibold leading-tight tracking-tight">{p.title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
          <span className="rounded border border-[var(--color-accent)] bg-[var(--color-accent-soft)] px-1.5 py-px text-[11px] uppercase tracking-wider text-[var(--color-accent)]">
            {p.kind}
          </span>
          <span
            className={`rounded border px-1.5 py-px text-[11px] uppercase tracking-wider ${
              runnable
                ? 'border-[var(--color-good)] text-[var(--color-good)]'
                : 'border-[var(--color-rule)] text-[var(--color-ink-2)]'
            }`}
            title={runnable
              ? 'The acceptance command is a plain argument list, so the app can run it and grade the result.'
              : `Run in your own terminal — ${why.short}.`}
          >
            {runnable ? 'App runs the check' : 'You run the check'}
          </span>
          <span className="flex items-center gap-2 text-[var(--color-ink-2)]">
            Difficulty <Difficulty level={p.difficulty ?? 3} />
          </span>
          {mod && track && (
            <span className="text-[var(--color-ink-2)]">
              <Link href={moduleHref} className="hover:text-[var(--color-accent)]">{mod.title}</Link>
              {' · '}
              <Link href={`/t/${track.id}`} className="hover:text-[var(--color-accent)]">{track.title}</Link>
            </span>
          )}
          <span className="text-[var(--color-ink-2)]">
            {concepts.length} concept{concepts.length === 1 ? '' : 's'}
          </span>
        </div>

        <p className="mt-3 max-w-[74ch] text-[14px] text-[var(--color-ink-2)]">
          <strong className="font-semibold text-[var(--color-ink)]">{p.kind}</strong> — {KIND_BLURB[p.kind]}
        </p>

        <p className="mt-4 max-w-[74ch] rounded border border-[var(--color-rule)] bg-[var(--color-surface-2)] px-3 py-2 text-[13px] text-[var(--color-ink-2)]">
          The site holds the spec. Your repo holds the code.{' '}
          {runnable
            ? 'This check is one the app can run for you: it spawns the command in your configured repo and reads the results test by test.'
            : 'This check is one you run yourself — it needs a shell, and a page in a browser does not get one. The app hands you the command and keeps the record.'}
        </p>

        <section aria-labelledby="spec" className="mt-8">
          <h2 id="spec" className="text-[17px] font-semibold">Spec</h2>
          {p.spec ? (
            <p className="mt-2 max-w-[74ch] text-[15px] leading-relaxed whitespace-pre-line">
              <Prose text={asText(p.spec).trim()} />
            </p>
          ) : (
            <p className="mt-2 rounded border border-dashed border-[var(--color-rule)] px-3 py-2 text-[13px] text-[var(--color-ink-3)]">
              No spec authored for this practice yet.
            </p>
          )}
        </section>

        <section aria-labelledby="acceptance" className="mt-8">
          <h2 id="acceptance" className="text-[17px] font-semibold">Acceptance</h2>
          <p className="mt-1 max-w-[74ch] text-[13px] text-[var(--color-ink-2)]">
            Every criterion has to hold. They are written to be checkable by someone other than you, which is the
            point — &ldquo;it works on my machine&rdquo; is not a criterion.
          </p>

          {criteria.length > 0 ? (
            <ul className="mt-3 flex max-w-[74ch] flex-col gap-2">
              {criteria.map((c, n) => (
                <li key={n} className="flex gap-2 rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-2">
                  <span aria-hidden="true" className="mt-px font-mono text-[12px] text-[var(--color-ink-3)]">
                    {n + 1}
                  </span>
                  <span className="text-[14px]"><Prose text={c} /></span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 rounded border border-dashed border-[var(--color-rule)] px-3 py-2 text-[13px] text-[var(--color-ink-3)]">
              No acceptance criteria authored. Without them this practice cannot be graded — treat that as a content bug.
            </p>
          )}
        </section>

        <section id="check" aria-labelledby="check-heading" className="mt-8 max-w-[74ch] scroll-mt-6">
          <h2 id="check-heading" className="text-[17px] font-semibold">The check</h2>
          <div className="mt-3">
            {runnable && command ? (
              <RunCheck
                practiceId={p.id}
                command={command}
                argv={argv}
                canRun={can.runPractice}
                notice={WEB_NOTICE}
                rungs={hints.length}
              />
            ) : (
              <ManualCheck practiceId={p.id} command={command} why={why} rungs={hints.length} />
            )}
          </div>
        </section>

        <section aria-labelledby="hints" className="mt-8 max-w-[74ch]">
          <h2 id="hints" className="text-[17px] font-semibold">Hints</h2>
          <div className="mt-2">
            <HintLadder practiceId={p.id} hints={hints} />
          </div>
        </section>

        <section id="attempts" aria-labelledby="attempts-heading" className="mt-8 max-w-[74ch] scroll-mt-6">
          <h2 id="attempts-heading" className="text-[17px] font-semibold">Attempts</h2>
          <div className="mt-2">
            <AttemptLog practiceId={p.id} rungs={hints.length} />
          </div>
        </section>

        {concepts.length > 0 && (
          <section aria-labelledby="concepts" className="mt-8 max-w-[74ch]">
            <h2 id="concepts" className="text-[17px] font-semibold">What this proves</h2>
            <p className="mt-1 text-[13px] text-[var(--color-ink-2)]">
              Finishing this is evidence for these concepts. Failing it is evidence too.
            </p>
            <dl className="mt-3 flex flex-col gap-3">
              {concepts.map((c) => (
                <div key={c.id}>
                  <dt>
                    <Link href={`/c/${c.id}`} className="text-[14px] font-medium hover:text-[var(--color-accent)]">
                      {c.title}
                    </Link>
                  </dt>
                  <dd className="mt-0.5 text-[13px] text-[var(--color-ink-2)]">{c.oneLine}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <nav aria-label="Practice navigation" className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-rule)] pt-4 text-[13px]">
          <span>
            {prev ? (
              <Link href={`/p/${prev.id}`} className="text-[var(--color-accent)] hover:underline">
                ← {prev.title}
              </Link>
            ) : (
              <span className="text-[var(--color-ink-3)]">First practice in this module</span>
            )}
          </span>
          <Link href={moduleHref} className="text-[var(--color-ink-2)] hover:text-[var(--color-accent)]">
            Up to {mod?.title ?? 'module'}
          </Link>
          <span>
            {next ? (
              <Link href={`/p/${next.id}`} className="text-[var(--color-accent)] hover:underline">
                {next.title} →
              </Link>
            ) : (
              <span className="text-[var(--color-ink-3)]">Last practice in this module</span>
            )}
          </span>
        </nav>
      </main>

      <aside className="hidden w-[280px] shrink-0 xl:block">
        <div className="sticky top-6 flex flex-col gap-6 text-[13px]">
          {mod && (
            <section aria-labelledby="in-module">
              <h2 id="in-module" className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
                Practices in {mod.title}
              </h2>
              <ol className="mt-2 flex flex-col gap-1">
                {family.map((f) => (
                  <li key={f.id}>
                    <Link
                      href={`/p/${f.id}`}
                      aria-current={f.id === p.id ? 'page' : undefined}
                      className={`block rounded px-2 py-1 ${
                        f.id === p.id
                          ? 'bg-[var(--color-surface-2)] text-[var(--color-ink)]'
                          : 'text-[var(--color-ink-2)] hover:text-[var(--color-accent)]'
                      }`}
                    >
                      <span className="mr-1.5 font-mono text-[11px] text-[var(--color-ink-3)]">{f.kind}</span>
                      {f.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section aria-labelledby="mode">
            <h2 id="mode" className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
              What runs where
            </h2>
            <ul className="mt-2 flex flex-col gap-1.5 text-[var(--color-ink-2)]">
              <li>
                <strong className="font-medium text-[var(--color-ink)]">Spec, criteria, hints</strong> — here, in
                both modes.
              </li>
              <li>
                <strong className="font-medium text-[var(--color-ink)]">This check</strong> —{' '}
                {!runnable
                  ? `yours to run: ${why.short}. The app shows the command and keeps the record.`
                  : can.runPractice
                    ? 'the app can run it, in the repo you configured, with no shell and a 180-second ceiling.'
                    : WEB_NOTICE}
              </li>
              <li>
                <strong className="font-medium text-[var(--color-ink)]">Hint rungs and attempts</strong> —{' '}
                {can.persistProgress
                  ? 'recorded as you take them, in the local database.'
                  : 'recorded on this device only, in this browser, and not synced anywhere.'}
              </li>
              <li>
                <strong className="font-medium text-[var(--color-ink)]">Grading</strong> —{' '}
                {runnable
                  ? 'read from the JUnit the test binary emits. A project that fails to compile is its own state, not a failed test.'
                  : 'yours. Nothing on this page inspects your repo for this practice.'}
              </li>
            </ul>
          </section>

          <section aria-labelledby="tiers">
            <h2 id="tiers" className="text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
              Why two tiers
            </h2>
            <p className="mt-2 text-[var(--color-ink-2)]">
              {inv.runnable} of the {inv.total} acceptance commands reduce to a plain argument list; the app runs
              those and reads the results test by test. The other {inv.manual} need a shell — pipes,{' '}
              <code className="font-mono">&amp;&amp;</code> chains, globs, placeholders — and a page in a browser
              does not get a shell. Those are handed to your terminal, which is strictly more capable than the
              runner.
            </p>
          </section>

        </div>
      </aside>
    </div>
  );
}
