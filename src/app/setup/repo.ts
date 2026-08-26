import 'server-only';
import fs from 'node:fs';
import { assertRepoRoot, UnsafeCommand } from '@/lib/runner/safety';
import { getRepoRoot, configPath } from '@/lib/runner/run';

/**
 * The configured practice repo, re-checked on every render.
 *
 * A path that passed validation in March can be gone in August — the directory moved, or
 * foundry.toml was renamed. So the verdict is not stored; it is recomputed by asking the same
 * gate the runner asks (assertRepoRoot), against the same filesystem.
 */
export interface RepoStatus {
  path: string | null;
  configured: boolean;
  /** would the runner accept this path right now */
  ok: boolean;
  /** the gate's own words when it would not */
  problem?: string;
  /** where the value is written, so it can be inspected or deleted by hand */
  configFile: string;
}

export function repoStatus(): RepoStatus {
  const configFile = configPath();
  const path = getRepoRoot();
  if (!path) return { path: null, configured: false, ok: false, configFile };
  try {
    assertRepoRoot(path, (p) => fs.existsSync(p));
    return { path, configured: true, ok: true, configFile };
  } catch (e) {
    return {
      path,
      configured: true,
      ok: false,
      problem: e instanceof UnsafeCommand ? e.message : String(e),
      configFile,
    };
  }
}

/** The gate in words, for the form. Mirrors §17 — the code of record is assertRepoRoot. */
export const REPO_RULES = [
  'Absolute — it must start with /. A ~ is not expanded; write the path out in full.',
  'No .. anywhere in it.',
  'The directory has to exist.',
  'It has to contain foundry.toml, which is how the app knows it is a practice repo and not your home folder.',
];
