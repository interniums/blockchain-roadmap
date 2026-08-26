/**
 * The doctor's fixed roster.
 *
 * Plan §17: THE COMMAND IS NEVER COMPOSED FROM INPUT. Every argv below is a literal written in
 * this file. Nothing here is ever built from a form field, a query string, a config value or
 * practice YAML — the doctor spawns exactly these seven invocations and nothing else. Adding a
 * tool means editing this array by hand, which is the point.
 */
export interface ToolSpec {
  bin: string;
  /** literal argv, never assembled at runtime */
  argv: readonly string[];
  label: string;
  /** what stops working without it, in the learner's terms */
  what: string;
  /** how it is normally installed — text only, the app never runs this */
  install: string;
}

export const TOOLS: readonly ToolSpec[] = [
  {
    bin: 'forge',
    argv: ['--version'],
    label: 'Foundry — forge',
    what: 'Solidity tests. Nearly every check this app can run is a scoped forge test.',
    install: 'foundryup',
  },
  {
    bin: 'cast',
    argv: ['--version'],
    label: 'Foundry — cast',
    what: 'Reading live chain state from the command line.',
    install: 'foundryup — ships alongside forge',
  },
  {
    bin: 'cargo',
    argv: ['--version'],
    label: 'Rust — cargo',
    what: 'Rust crates and Solana program tests.',
    install: 'rustup',
  },
  {
    bin: 'anchor',
    argv: ['--version'],
    label: 'Anchor',
    what: 'Anchor workspace builds and tests on Solana.',
    install: 'avm install latest && avm use latest',
  },
  {
    bin: 'node',
    argv: ['--version'],
    label: 'Node',
    what: 'Script-driven checks — and this app itself, so a missing answer here is strange.',
    install: 'nodejs.org, or a version manager such as fnm or nvm',
  },
  {
    bin: 'python3',
    argv: ['--version'],
    label: 'Python 3',
    what: 'A handful of analysis and plotting scripts.',
    install: 'python.org, or your system package manager',
  },
  {
    bin: 'nargo',
    argv: ['--version'],
    label: 'Noir — nargo',
    what: 'Noir circuit tests.',
    install: 'noirup',
  },
] as const;

/** Names only. Used for attributing practices to a toolchain — never for spawning. */
export const TOOL_NAMES: readonly string[] = TOOLS.map((t) => t.bin);
