'use server';

import fs from 'node:fs';
import { revalidatePath } from 'next/cache';
import { assertRepoRoot, UnsafeCommand } from '@/lib/runner/safety';
import { setRepoRoot } from '@/lib/runner/run';
import { can, WEB_NOTICE } from '@/lib/capabilities';

export type SaveState =
  | { status: 'idle' }
  | { status: 'saved'; path: string }
  | { status: 'error'; message: string; attempted: string };

/**
 * Write the practice repo path.
 *
 * A server action is reachable by POST directly, not only through this form, so the mode check and
 * the validation both live in here rather than in the UI. Validation runs BEFORE the write: an
 * invalid path never lands in the config file, so the runner can never be handed one.
 *
 * setRepoRoot() re-validates on its own — that is deliberate belt-and-braces, not a mistake. This
 * call exists so the learner gets the gate's specific complaint back instead of a thrown error.
 */
export async function saveRepoRoot(_prev: SaveState, form: FormData): Promise<SaveState> {
  if (!can.runPractice) {
    return { status: 'error', attempted: '', message: `Configuration is not writable here. ${WEB_NOTICE}` };
  }

  const raw = form.get('path');
  if (typeof raw !== 'string') {
    return { status: 'error', attempted: '', message: 'No path was submitted.' };
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return { status: 'error', attempted: '', message: 'Enter the absolute path to your practice repo.' };
  }
  // Tidy trailing slashes without inventing a path: "/" survives as "/".
  const candidate = trimmed.replace(/\/+$/, '') || '/';

  try {
    assertRepoRoot(candidate, (p) => fs.existsSync(p));
  } catch (e) {
    return {
      status: 'error',
      attempted: candidate,
      message: e instanceof UnsafeCommand ? e.message : String(e),
    };
  }

  try {
    setRepoRoot(candidate);
  } catch (e) {
    return {
      status: 'error',
      attempted: candidate,
      message: `the path is valid but the config file could not be written: ${
        e instanceof Error ? e.message : String(e)
      }`,
    };
  }

  revalidatePath('/setup');
  return { status: 'saved', path: candidate };
}
