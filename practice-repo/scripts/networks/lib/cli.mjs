/**
 * Argument and endpoint handling shared by the two network measurements.
 * Support code - not part of either exercise.
 */

/** Parse `--flag value` and `--flag=value` into a plain object. Bare `--flag` becomes `true`. */
export function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const eq = token.indexOf('=');
    if (eq !== -1) {
      out[token.slice(2, eq)] = token.slice(eq + 1);
      continue;
    }
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      out[token.slice(2)] = true;
    } else {
      out[token.slice(2)] = next;
      i++;
    }
  }
  return out;
}

export function intArg(args, name, fallback) {
  const raw = args[name];
  if (raw === undefined) return fallback;
  const value = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(value) || value <= 0) throw new UsageError(`--${name} must be a positive integer`);
  return value;
}

export class UsageError extends Error {}

/**
 * The two endpoints under comparison.
 *
 * The acceptance command passes no URLs, so they come from the environment. Keep them there: an RPC
 * URL with a key in the path does not belong in a shell history or in this repo.
 *
 *   export CHAINPATH_RPC_A="wss://..."   # provider one, or your own node
 *   export CHAINPATH_RPC_B="wss://..."   # a genuinely independent second view
 */
export function endpoints({ requireWebsocket = false } = {}) {
  const a = process.env.CHAINPATH_RPC_A;
  const b = process.env.CHAINPATH_RPC_B;

  if (!a || !b) {
    throw new UsageError(
      'CHAINPATH_RPC_A and CHAINPATH_RPC_B must both be set.\n' +
        '  Two independent endpoints, not two URLs from the same provider - if both sit behind the\n' +
        '  same infrastructure the deltas collapse to near zero, which measures the provider rather\n' +
        '  than the network.',
    );
  }
  if (requireWebsocket && !(a.startsWith('ws') && b.startsWith('ws'))) {
    throw new UsageError('this measurement subscribes, so both endpoints must be ws:// or wss:// URLs');
  }
  if (a === b) throw new UsageError('CHAINPATH_RPC_A and CHAINPATH_RPC_B are the same endpoint');

  return { a, b };
}

/** Print a usage error the way a CLI should, and exit non-zero. */
export function reportUsageError(error, usage) {
  process.stderr.write(`${error.message}\n\n${usage}\n`);
  process.exitCode = 2;
}
