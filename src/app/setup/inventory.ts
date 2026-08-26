import { graph } from '@/lib/content/load';
import {
  classifyAcceptance, parseAcceptanceCommand, type AcceptanceTier,
} from '@/lib/runner/safety';
import { TOOL_NAMES } from './tools';

/**
 * What the app can actually run, counted from the content rather than asserted.
 *
 * Every number on the setup screen comes from here, and every number here comes from calling
 * classifyAcceptance over all 236 authored practices. If someone widens the safety grammar, these
 * counts move on their own — nothing is hard-coded.
 */

export interface PracticeNeed {
  id: string;
  title: string;
  moduleId: string;
  tier: AcceptanceTier;
  /** why it is manual, straight from the safety parser */
  reason?: string;
  command: string | null;
  /** doctor-roster tools this command names. Attribution for reporting only — never spawned. */
  tools: string[];
  /** first real token of the command, so the manual tier can be described honestly */
  lead: string | null;
}

export interface Inventory {
  items: PracticeNeed[];
  total: number;
  runnable: number;
  manual: number;
  noCommand: number;
  /** per doctor tool, how many practices name it */
  byTool: { bin: string; runnable: number; manual: number; total: number }[];
  /** practices naming none of the seven — they lean on pnpm, npx, bash and friends */
  offRoster: number;
  /** why the manual tier is manual, grouped */
  reasons: { key: string; label: string; count: number }[];
  /** binaries the safety parser refuses, with counts */
  refusedBins: { bin: string; count: number }[];
  /** leading command across the manual tier, derived from the text, not from a hand list */
  leads: { lead: string; count: number }[];
}

/** Token boundaries for attribution. `_` stays inside a word so `node_modules` is not `node`. */
const WORD = /[^A-Za-z0-9_.-]+/;

/** Which roster tools a command names. Reporting only: this string never reaches a process. */
function toolsNamed(command: string): string[] {
  const out = new Set<string>();
  for (const w of command.split(WORD)) if (TOOL_NAMES.includes(w)) out.add(w);
  return [...out];
}

/** First token that is not an environment assignment, for describing the manual tier. */
function leadOf(command: string): string | null {
  const first = command.split('\n')[0] ?? '';
  const tok = first.trim().split(/\s+/).filter((t) => t && !t.includes('='));
  const lead = (tok[0] ?? '').replace(/^['"]+|['"]+$/g, '');
  return lead || null;
}

const REASON_LABEL: Record<string, string> = {
  'shell metacharacter in command':
    'Needs a shell — a pipe, an && chain, a loop, a glob or a variable.',
  'binary not allowed': 'Runs a binary the runner will not execute.',
  'flag not allowed': 'Uses a flag outside the per-binary allowlist.',
  'unsafe argument': 'Has an argument outside the strict path grammar.',
  'unsafe value for': 'Has a flag value outside the strict path grammar.',
  'command too long': 'Longer than the 400-character limit the parser accepts.',
  'no acceptance command authored': 'No acceptance command was authored for it.',
};

function bump<T extends string>(m: Map<T, number>, k: T) {
  m.set(k, (m.get(k) ?? 0) + 1);
}

let cache: Inventory | null = null;

export function inventory(): Inventory {
  if (cache) return cache;

  const g = graph();
  const items: PracticeNeed[] = [];
  const reasons = new Map<string, number>();
  const refusedBins = new Map<string, number>();
  const leads = new Map<string, number>();
  const tools = new Map<string, { runnable: number; manual: number }>();

  for (const [id, p] of g.practiceById) {
    const command = p.acceptance?.command?.trim() || null;
    const c = classifyAcceptance(command ?? undefined);

    const named = new Set(command ? toolsNamed(command) : []);
    // For a runnable command the parser has already told us the exact binary. Trust that over
    // the text scan, which is only a heuristic for commands we will never execute.
    if (c.tier === 'runnable' && command) named.add(parseAcceptanceCommand(command).bin);

    const need: PracticeNeed = {
      id,
      title: p.title,
      moduleId: p.moduleId,
      tier: c.tier,
      reason: c.reason,
      command,
      tools: [...named],
      lead: command ? leadOf(command) : null,
    };
    items.push(need);

    for (const t of need.tools) {
      const e = tools.get(t) ?? { runnable: 0, manual: 0 };
      if (need.tier === 'runnable') e.runnable++; else e.manual++;
      tools.set(t, e);
    }

    if (need.tier === 'manual') {
      const key = (need.reason ?? 'unclassified').replace(/:.*/, '');
      bump(reasons, key);
      const m = /^binary not allowed: (\S+)/.exec(need.reason ?? '');
      if (m) bump(refusedBins, m[1]);
      if (need.lead) bump(leads, need.lead);
    }
  }

  items.sort((a, b) => a.id.localeCompare(b.id));

  cache = {
    items,
    total: items.length,
    runnable: items.filter((i) => i.tier === 'runnable').length,
    manual: items.filter((i) => i.tier === 'manual').length,
    noCommand: items.filter((i) => !i.command).length,
    byTool: TOOL_NAMES.map((bin) => {
      const e = tools.get(bin) ?? { runnable: 0, manual: 0 };
      return { bin, ...e, total: e.runnable + e.manual };
    }),
    offRoster: items.filter((i) => i.tools.length === 0).length,
    reasons: [...reasons]
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({ key, label: REASON_LABEL[key] ?? key, count })),
    refusedBins: [...refusedBins].sort((a, b) => b[1] - a[1]).map(([bin, count]) => ({ bin, count })),
    leads: [...leads].sort((a, b) => b[1] - a[1]).map(([lead, count]) => ({ lead, count })),
  };
  return cache;
}

/** Which practices a set of missing binaries takes off the table. */
export function blockedBy(inv: Inventory, missing: Set<string>) {
  const hit = missing.size ? inv.items.filter((i) => i.tools.some((t) => missing.has(t))) : [];
  return {
    all: hit,
    runnable: hit.filter((i) => i.tier === 'runnable'),
    manual: hit.filter((i) => i.tier === 'manual'),
  };
}
