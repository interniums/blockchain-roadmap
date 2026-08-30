/**
 * Manual tier: why this command is not run for you.
 *
 * classifyAcceptance() answers in the parser's vocabulary ("shell metacharacter in command: …").
 * That sentence is true and it is quoted verbatim on the page, but it is not an explanation.
 * This turns it into one, without softening it into an apology — the two tiers are a design
 * decision, and a practice we hand you is not a lesser practice.
 *
 * Of 236 authored acceptance commands, 101 parse into a plain argument list and 135 do not.
 * The 135 need a shell, and a web page does not get a shell.
 */

export interface ManualReason {
  /** short badge-sized noun phrase */
  short: string;
  /** one sentence, plain English, the page leads with */
  plain: string;
  /** the parser's exact words, quoted so nothing is hidden behind the paraphrase */
  raw: string | null;
  /** whether there is a command at all to hand over */
  hasCommand: boolean;
}

function subject(reason: string): string {
  const i = reason.indexOf(': ');
  return i === -1 ? '' : reason.slice(i + 2).trim();
}

export function whyManual(reason: string | undefined, command: string | null): ManualReason {
  const hasCommand = Boolean(command);

  if (!hasCommand || reason === 'no acceptance command authored') {
    return {
      short: 'nothing to run',
      plain:
        'No acceptance command was authored for this practice, so there is nothing for anything to execute — here or in your terminal. Grade yourself against the criteria above.',
      raw: reason ?? null,
      hasCommand: false,
    };
  }

  const r = reason ?? '';
  const what = subject(r);

  if (r.startsWith('shell metacharacter')) {
    return {
      short: 'needs a shell',
      plain:
        'It needs a shell — a pipe, an && chain, a redirect, a glob, or a placeholder you fill in yourself. Your terminal has one. A page in a browser does not get one, and that is the line the runner will not cross.',
      raw: r,
      hasCommand: true,
    };
  }

  if (r.startsWith('binary not allowed')) {
    return {
      short: `runs ${what || 'an unlisted binary'}`,
      plain:
        `It runs ${what ? `\`${what}\`` : 'a binary'}, which is not on the runner's allowlist. The allowlist holds the test runners whose whole invocation can be expressed as a plain argument list and whose output can be parsed into per-test results. Everything else is yours to run.`,
      raw: r,
      hasCommand: true,
    };
  }

  if (r.startsWith('subcommand not allowed')) {
    return {
      short: 'unlisted subcommand',
      plain:
        `The subcommand \`${what}\` is outside the grammar the runner knows for that binary. It only executes shapes it can also grade.`,
      raw: r,
      hasCommand: true,
    };
  }

  if (r.startsWith('flag not allowed')) {
    return {
      short: 'unlisted flag',
      plain:
        `It passes \`${what}\`, a flag the runner's grammar for that binary does not cover. The grammar is an allowlist, so an unknown flag is a refusal rather than a guess.`,
      raw: r,
      hasCommand: true,
    };
  }

  if (r.startsWith('command too long')) {
    return {
      short: 'too long to parse',
      plain:
        'The command is longer than the parser accepts. A length cap is a blunt instrument, but an unbounded string is an invitation to smuggle a second command inside the first.',
      raw: r,
      hasCommand: true,
    };
  }

  if (r.startsWith('path traversal') || r.startsWith('absolute path') || r.startsWith('unsafe argument') || r.startsWith('unsafe value')) {
    return {
      short: 'argument outside the path grammar',
      plain:
        `An argument (${what || 'one of them'}) does not fit the strict relative-path grammar the runner requires, so it will not hand it to a process.`,
      raw: r,
      hasCommand: true,
    };
  }

  return {
    short: 'not expressible as argv',
    plain:
      'The safety parser did not recognise this as something expressible as a plain argument list, so it declined to run it rather than improvising.',
    raw: r || null,
    hasCommand: true,
  };
}
