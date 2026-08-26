/**
 * Dual-mode capability flags. Read from ONE place — never sniff per component.
 * Web mode must never degrade silently: surfaces that need the local install say so in words.
 */
export type Mode = 'local' | 'web';

export const MODE: Mode =
  (process.env.NEXT_PUBLIC_CHAINPATH_MODE as Mode | undefined) ??
  (process.env.NODE_ENV === 'production' && process.env.VERCEL ? 'web' : 'local');

export const can = {
  runPractice: MODE === 'local',
  writeProgress: true,               // local: SQLite. web: localStorage, not synced.
  persistProgress: MODE === 'local', // web progress is device-only
  composeNotes: MODE === 'local',
  reverifySources: MODE === 'local',
} as const;

export const WEB_NOTICE =
  'This needs the local install — it runs tests in your repo, which a hosted copy cannot do.';
