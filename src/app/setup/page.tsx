import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/nav/Breadcrumb';
import { can, MODE, WEB_NOTICE } from '@/lib/capabilities';
import { TIMEOUT_MS } from '@/lib/runner/run';
import { TOOLS } from './tools';
import { inventory, blockedBy } from './inventory';
import { runDoctor } from './doctor';
import { repoStatus, REPO_RULES } from './repo';
import { RepoForm } from './RepoForm';
import { Recheck } from './Recheck';
import { Callout, Mono, Pill, Section, Stat } from './ui';

/**
 * Setup. The screen a fresh install needs first.
 *
 * It spawns processes to see what is installed, so it can never be prerendered — the answer is a
 * property of this machine at this moment, not of the build.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Setup · Chainpath',
  description: 'Point the app at your practice repo, and see which toolchains this machine has.',
};

const n = (x: number) => x.toLocaleString('en-GB');

export default async function SetupPage() {
  const local = can.runPractice;
  const inv = inventory();
  const repo = local ? repoStatus() : null;
  const doctor = local ? await runDoctor() : null;

  const missing = new Set(doctor?.missing ?? []);
  const blocked = blockedBy(inv, missing);
  const needByBin = new Map(inv.byTool.map((t) => [t.bin, t]));

  return (
    <div className="mx-auto w-full max-w-[980px] px-6 py-6">
      <Breadcrumb crumbs={[{ href: '/', label: 'Curriculum' }, { href: '/setup', label: 'Setup' }]} />

      <p className="mt-4 text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
        {local ? 'This machine' : 'Read-only copy'}
      </p>
      <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-tight">Setup</h1>
      <p className="mt-3 max-w-[74ch] text-[15px] leading-relaxed text-[var(--color-ink-2)]">
        Two things live here: where your practice repo is, and which toolchains this machine actually
        has. Everything else in Chainpath — lessons, concepts, specs, hints, your notes — works whether
        or not you ever open this page. What is set here decides only whether the app can run a check
        for you instead of handing you the command.
      </p>

      {/* ---------------------------------------------------------------- practice repo */}
      <Section
        id="repo"
        title="Practice repo"
        lede={
          <>
            One directory, on this machine, holding the code you write. Runnable checks spawn with it as
            their working directory and never leave it.
          </>
        }
      >
        {!local ? (
          <div className="mt-4 flex flex-col gap-3">
            <Callout tone="warn" title="Configuration lives on the machine running the app.">
              <p className="max-w-[74ch]">
                {WEB_NOTICE} There is no repo to point at from here and nothing on this page to fill in —
                a hosted copy has no access to your filesystem, so a text box asking for a path would be
                a lie. Install locally and this section becomes a form.
              </p>
            </Callout>
            <p className="max-w-[74ch] text-[13px] text-[var(--color-ink-2)]">
              Everything below is still worth reading: the practice inventory is a property of the content,
              not of your machine, and it is identical in both modes.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-4">
              {!repo?.configured ? (
                <Callout tone="neutral" title="No repo configured yet.">
                  <p className="max-w-[74ch]">
                    This is what a fresh install looks like — it is the expected first-run state, not an
                    error and not something you broke. Until a path is set, the{' '}
                    {n(inv.runnable)} runnable practices have nowhere to run, and every practice page still
                    shows you its spec, its acceptance criteria, its hints and its command. Nothing is
                    gated behind this.
                  </p>
                </Callout>
              ) : repo.ok ? (
                <Callout tone="good" title="Configured, and the runner would accept it right now.">
                  <p className="flex flex-wrap items-center gap-2">
                    <Mono>{repo.path}</Mono>
                  </p>
                  <p className="mt-1.5 max-w-[74ch]">
                    Checks run here with no shell, and are killed at {TIMEOUT_MS / 1000}s.
                  </p>
                </Callout>
              ) : (
                <Callout tone="warn" title="Configured, but the runner would refuse it as it stands.">
                  <p className="flex flex-wrap items-center gap-2">
                    <Mono>{repo.path}</Mono>
                  </p>
                  <p className="mt-1.5 max-w-[74ch]">
                    The gate says: <strong className="font-semibold text-[var(--color-warn)]">{repo.problem}</strong>{' '}
                    The value is still on disk — it is checked again every time, so a directory that moved
                    or a renamed <Mono>foundry.toml</Mono> shows up here rather than at the moment you click
                    Run check. Fix the directory, or save a different path.
                  </p>
                </Callout>
              )}
            </div>

            <RepoForm current={repo?.path ?? null} rules={REPO_RULES} />

            <p className="mt-2 max-w-[74ch] text-[12px] text-[var(--color-ink-3)]">
              Written to <Mono>{repo?.configFile}</Mono>. It is a plain JSON file — you can read it, edit
              it or delete it by hand, and deleting it puts this screen back to its first-run state.
            </p>
          </>
        )}
      </Section>

      {/* ---------------------------------------------------------------- doctor */}
      <Section
        id="doctor"
        title="Toolchain doctor"
        aside={local ? <Recheck /> : <Pill tone="warn">not probed here</Pill>}
        lede={
          <>
            Seven binaries, each spawned once with a version flag from a fixed argument list written in
            the source. Nothing on this page composes a command from anything you type — same rule as
            the practice runner.
          </>
        }
      >
        {!local ? (
          <div className="mt-4 flex flex-col gap-3">
            <Callout tone="warn" title="The doctor cannot run in a hosted copy.">
              <p className="max-w-[74ch]">
                It answers its question by starting processes, which is exactly the thing a web copy must
                not do. Below is the roster it would probe and what each one is needed for, so the list is
                still useful as a shopping list before you install locally.
              </p>
            </Callout>
            <ul className="flex max-w-[74ch] flex-col gap-2">
              {TOOLS.map((t) => (
                <li key={t.bin} className="rounded border border-[var(--color-rule)] bg-[var(--color-surface)] px-3 py-2">
                  <p className="text-[13px] font-medium">
                    {t.label} <Mono>{t.bin}</Mono>
                  </p>
                  <p className="mt-0.5 text-[13px] text-[var(--color-ink-2)]">{t.what}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--color-ink-3)]">
                    Named by {n(needByBin.get(t.bin)?.total ?? 0)} practices · usually installed with{' '}
                    <Mono>{t.install}</Mono>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <div className="mt-4 overflow-x-auto rounded border border-[var(--color-rule)] bg-[var(--color-surface)]">
              <table className="w-full min-w-[680px] border-collapse text-left text-[13px]">
                <caption className="sr-only">
                  Each toolchain the app probes, whether it is on PATH, the version it reported, and how many
                  practices name it.
                </caption>
                <thead>
                  <tr className="border-b border-[var(--color-rule)] text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
                    <th scope="col" className="px-3 py-2 font-normal">Tool</th>
                    <th scope="col" className="px-3 py-2 font-normal">On PATH</th>
                    <th scope="col" className="px-3 py-2 font-normal">Reported version</th>
                    <th scope="col" className="px-3 py-2 font-normal">Practices naming it</th>
                  </tr>
                </thead>
                <tbody>
                  {doctor?.probes.map((p) => {
                    const need = needByBin.get(p.bin) ?? { runnable: 0, manual: 0, total: 0 };
                    return (
                      <tr key={p.bin} className="border-b border-[var(--color-rule)] last:border-0 align-top">
                        <th scope="row" className="px-3 py-2 font-normal">
                          <span className="font-medium">{p.label}</span>
                          <span className="mt-0.5 block text-[12px] text-[var(--color-ink-2)]">{p.what}</span>
                        </th>
                        <td className="px-3 py-2">
                          <Pill tone={p.present ? 'good' : 'danger'}>{p.present ? 'found' : 'missing'}</Pill>
                          {p.note && (
                            <span className="mt-1 block max-w-[24ch] text-[12px] text-[var(--color-ink-2)]">
                              {p.note}
                            </span>
                          )}
                          {!p.present && (
                            <span className="mt-1 block max-w-[26ch] text-[12px] text-[var(--color-ink-3)]">
                              install: <Mono>{p.install}</Mono>
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {p.version ? <Mono>{p.version}</Mono> : <span className="text-[var(--color-ink-3)]">—</span>}
                        </td>
                        <td className="px-3 py-2">
                          <span className="font-mono">{n(need.total)}</span>
                          <span className="mt-0.5 block text-[12px] text-[var(--color-ink-2)]">
                            {n(need.runnable)} runnable · {n(need.manual)} manual
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="mt-2 text-[12px] text-[var(--color-ink-3)]">
              Seven probes in {n(doctor?.durationMs ?? 0)} ms, each killed after 5s if it does not answer.
              A tool counts as found when the process starts at all — a non-zero exit is reported, not
              treated as absence.
            </p>

            <div className="mt-4">
              {missing.size === 0 ? (
                <Callout tone="good" title="Every tool on the roster answered.">
                  <p className="max-w-[74ch]">
                    Nothing in the curriculum is blocked by a missing toolchain from this list. The doctor
                    only knows about these seven; {n(inv.offRoster)} practices name none of them and reach
                    for other things — see below.
                  </p>
                </Callout>
              ) : (
                <Callout
                  tone="warn"
                  title={`${n(missing.size)} of ${TOOLS.length} missing: ${[...missing].join(', ')}`}
                >
                  <p className="max-w-[74ch]">
                    That takes <strong className="font-semibold">{n(blocked.runnable.length)}</strong> runnable
                    checks off the table — the app could otherwise run them and grade the result. It also
                    touches <strong className="font-semibold">{n(blocked.manual.length)}</strong> manual
                    practices, which you could not complete in your own terminal either until the tool is
                    installed. Everything else is unaffected.
                  </p>
                  {blocked.all.length > 0 && (
                    <>
                      <p className="mt-2 text-[12px] text-[var(--color-ink-3)]">
                        For instance:
                      </p>
                      <ul className="mt-1 flex flex-col gap-0.5">
                        {blocked.all.slice(0, 6).map((b) => (
                          <li key={b.id} className="text-[13px]">
                            <Link href={`/p/${b.id}`} className="text-[var(--color-accent)] hover:underline">
                              {b.title}
                            </Link>{' '}
                            <span className="text-[12px] text-[var(--color-ink-3)]">
                              — {b.tier}, needs {b.tools.filter((t) => missing.has(t)).join(' and ')}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {blocked.all.length > 6 && (
                        <p className="mt-1 text-[12px] text-[var(--color-ink-3)]">
                          …and {n(blocked.all.length - 6)} more.
                        </p>
                      )}
                    </>
                  )}
                </Callout>
              )}
            </div>
          </>
        )}
      </Section>

      {/* ---------------------------------------------------------------- inventory */}
      <Section
        id="inventory"
        title="What this app can run"
        lede={
          <>
            Counted by classifying every authored acceptance command, not asserted. Widen the safety
            grammar and these numbers move on their own.
          </>
        }
      >
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat n={n(inv.total)} label="practices authored" />
          <Stat n={n(inv.runnable)} label="runnable — the app executes and grades them" tone="accent" />
          <Stat n={n(inv.manual)} label="manual — you run them, you report back" tone="warn" />
          <Stat
            n={local ? n(blocked.all.length) : '—'}
            label={local ? 'blocked by a missing toolchain' : 'blocked — needs the local install to know'}
            tone={local && blocked.all.length > 0 ? 'danger' : 'neutral'}
          />
        </div>

        <div className="mt-4 max-w-[74ch] text-[14px] leading-relaxed text-[var(--color-ink-2)]">
          <p>
            The split is a design decision, not a shortfall. A command is runnable when its whole
            invocation can be expressed as an argument list: one binary from the allowlist, subcommands
            and flags that are known, paths that look like paths. Anything else needs a shell — a pipe, an{' '}
            <Mono>{'&&'}</Mono> chain, a loop, a glob, a variable — and handing a web page a shell is the one
            thing the execution layer will not do, whatever it costs in convenience.
          </p>
          <p className="mt-2">
            So the app runs what it can run safely and hands you the rest. A manual practice shows you the
            exact command, you run it in your own terminal, and you report the outcome yourself. The attempt
            is recorded either way — the difference is who did the grading, and the record says which.
          </p>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <h3 className="text-[13px] font-semibold">Why the {n(inv.manual)} are manual</h3>
            <ul className="mt-2 flex flex-col gap-1.5">
              {inv.reasons.map((r) => (
                <li key={r.key} className="flex gap-2 text-[13px]">
                  <span className="w-8 shrink-0 text-right font-mono text-[var(--color-ink-3)]">{n(r.count)}</span>
                  <span className="text-[var(--color-ink-2)]">{r.label}</span>
                </li>
              ))}
            </ul>
            {inv.refusedBins.length > 0 && (
              <p className="mt-2 max-w-[46ch] text-[12px] text-[var(--color-ink-3)]">
                What the parser read as the binary, and refused — a leading{' '}
                <Mono>VAR=value</Mono> counts, because that is a shell feature too:{' '}
                {inv.refusedBins.map((b, i) => (
                  <span key={b.bin}>
                    {i > 0 && ', '}
                    <Mono>{b.bin}</Mono> ({n(b.count)})
                  </span>
                ))}
                . Adding one to the allowlist is a deliberate edit to the safety layer, not a setting.
              </p>
            )}
          </div>

          <div>
            <h3 className="text-[13px] font-semibold">What the manual tier leads with</h3>
            <ul className="mt-2 flex flex-col gap-1.5">
              {inv.leads.slice(0, 7).map((l) => (
                <li key={l.lead} className="flex gap-2 text-[13px]">
                  <span className="w-8 shrink-0 text-right font-mono text-[var(--color-ink-3)]">{n(l.count)}</span>
                  <Mono>{l.lead}</Mono>
                </li>
              ))}
            </ul>
            <p className="mt-2 max-w-[46ch] text-[12px] text-[var(--color-ink-3)]">
              First token of each manual command, read straight off the content. {n(inv.offRoster)} practices
              name none of the seven tools above — the doctor does not probe{' '}
              <Mono>pnpm</Mono>, <Mono>npx</Mono> or <Mono>bash</Mono>, because the roster it spawns is fixed
              in source and only grows on purpose.
            </p>
          </div>
        </div>

        {inv.noCommand > 0 && (
          <p className="mt-4 max-w-[74ch] text-[13px] text-[var(--color-warn)]">
            {n(inv.noCommand)} practices have no acceptance command authored at all. That is a content gap,
            not a runner limitation.
          </p>
        )}
      </Section>

      {/* ---------------------------------------------------------------- footer */}
      <Section
        id="mode"
        title="What runs where"
        lede={<>Mode is read from one place and never sniffed per screen.</>}
      >
        <dl className="mt-3 flex max-w-[74ch] flex-col gap-2 text-[13px]">
          <div>
            <dt className="font-medium">Mode</dt>
            <dd className="text-[var(--color-ink-2)]">
              <Mono>{MODE}</Mono> —{' '}
              {local
                ? 'this copy has a filesystem and may spawn processes, so checks and the doctor both work.'
                : WEB_NOTICE}
            </dd>
          </div>
          <div>
            <dt className="font-medium">Specs, criteria, hints, notes</dt>
            <dd className="text-[var(--color-ink-2)]">Both modes, always. None of it depends on this page.</dd>
          </div>
          <div>
            <dt className="font-medium">Running a check for you</dt>
            <dd className="text-[var(--color-ink-2)]">
              Local only, and only for the {n(inv.runnable)} runnable practices, and only once a repo is
              configured here.
            </dd>
          </div>
        </dl>

        <nav aria-label="Setup navigation" className="mt-8 flex flex-wrap items-center gap-4 border-t border-[var(--color-rule)] pt-4 text-[13px]">
          <Link href="/" className="text-[var(--color-accent)] hover:underline">← Curriculum</Link>
          <Link href="/" className="text-[var(--color-ink-2)] hover:text-[var(--color-accent)]">Today</Link>
        </nav>
      </Section>
    </div>
  );
}
