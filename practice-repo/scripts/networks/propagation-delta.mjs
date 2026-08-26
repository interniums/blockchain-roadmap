/*
 * Practice: fundamentals-networks-measure-propagation-delta  (kind: measure)
 * Run:      node scripts/propagation-delta.mjs --blocks 200 --out results/propagation.json
 *
 * This practice is MANUAL in Chainpath: the acceptance command carries flags the runner's grammar
 * does not accept, so the app shows you the command and you run it yourself. Set the two endpoints
 * first:
 *
 *   export CHAINPATH_RPC_A="wss://..."
 *   export CHAINPATH_RPC_B="wss://..."
 *
 * Your work is the three functions marked TODO. Everything else - argument handling, the RPC
 * plumbing, the statistics, the output file - is written for you, and the shape of the output
 * object below is the specification for what the measurement has to produce.
 */
import { endpoints, intArg, parseArgs, reportUsageError, UsageError } from './lib/cli.mjs';
import { subscribe, redact } from './lib/rpc.mjs';
import { summarise } from './lib/stats.mjs';
import { checkWriteUp, writeResult } from './lib/output.mjs';

export const USAGE = `usage: node scripts/propagation-delta.mjs --blocks 200 --out results/propagation.json

  --blocks <n>   how many distinct block hashes to observe on BOTH endpoints (default 200)
  --out <path>   where to write the results JSON

  environment:
    CHAINPATH_RPC_A, CHAINPATH_RPC_B - two independent ws:// or wss:// endpoints`;

/*
 * TODO (write-up). At least a few sentences, and it has to say something the numbers do not say
 * on their own:
 *
 *   - what the observed spread means for a product that shows "confirmed" the instant its own
 *     provider reports a block, and
 *   - what it means for any action whose timing is keyed off block arrival.
 *
 * State a concrete product consequence. "Blocks arrive at different times" is a restatement, not a
 * conclusion.
 */
const WRITE_UP = '';

/**
 * TODO: collect one arrival record per block hash.
 *
 * Subscribe to `newHeads` on both endpoints at once and record, for each block hash, the local
 * time at which each connection delivered it. `subscribe(url, ['newHeads'], onNotification)` from
 * ./lib/rpc.mjs is already wired; timestamp inside the callback, at the moment of receipt.
 *
 * Two things the practice is explicit about, and both are easy to get wrong:
 *   - key on the block hash, not the block number;
 *   - use your own clock at receipt, not any timestamp inside the block payload. You are measuring
 *     delivery, not block time.
 *
 * Resolve once `blocks` distinct hashes have been seen on both connections.
 *
 * @returns {Promise<Array<{ hash: string, a: number, b: number }>>} `a` and `b` are local arrival
 *          times in milliseconds.
 */
async function collectArrivals(_urls, _blocks) {
  throw new Error('TODO: collectArrivals is unimplemented - see scripts/networks/propagation-delta.mjs');
}

/**
 * TODO: turn arrival records into per-block deltas.
 *
 * Decide, and write down in your answer, which sign convention you are using and why.
 *
 * @returns {Array<{ hash: string, deltaMs: number, winner: 'a' | 'b' | 'tie' }>}
 */
function toDeltas(_arrivals) {
  throw new Error('TODO: toDeltas is unimplemented - see scripts/networks/propagation-delta.mjs');
}

/**
 * TODO: how often did each endpoint deliver a block first?
 *
 * @returns {{ a: number, b: number, tie: number }} fractions that sum to 1.
 */
function winRates(_deltas) {
  throw new Error('TODO: winRates is unimplemented - see scripts/networks/propagation-delta.mjs');
}

export async function main(argv) {
  const args = parseArgs(argv);
  const blocks = intArg(args, 'blocks', 200);
  const out = typeof args.out === 'string' ? args.out : null;
  if (!out) throw new UsageError('--out <path> is required');

  const urls = endpoints({ requireWebsocket: true });
  process.stderr.write(`observing ${blocks} blocks on ${redact(urls.a)} and ${redact(urls.b)}\n`);

  const startedAt = new Date().toISOString();
  const arrivals = await collectArrivals(urls, blocks);
  const deltas = toDeltas(arrivals);
  const absolute = deltas.map((d) => Math.abs(d.deltaMs));

  const payload = {
    practice: 'fundamentals-networks-measure-propagation-delta',
    startedAt,
    finishedAt: new Date().toISOString(),
    endpoints: { a: redact(urls.a), b: redact(urls.b) },
    requestedBlocks: blocks,
    observedBlocks: deltas.length,
    // One record per block hash, each carrying a timestamp from each endpoint.
    blocks: deltas.map((d) => {
      const arrival = arrivals.find((x) => x.hash === d.hash);
      return { hash: d.hash, aMs: arrival?.a ?? null, bMs: arrival?.b ?? null, deltaMs: d.deltaMs, winner: d.winner };
    }),
    deltaMs: summarise(absolute),
    winRate: winRates(deltas),
    writeUp: WRITE_UP,
  };

  const target = await writeResult(out, payload);
  process.stderr.write(`wrote ${payload.observedBlocks} block records to ${target}\n`);

  if (payload.observedBlocks < blocks) {
    process.stderr.write(`\nIncomplete: asked for ${blocks} blocks on both endpoints, observed ${payload.observedBlocks}.\n`);
    process.exitCode = 1;
  }
  checkWriteUp(WRITE_UP, 'name a concrete product consequence of the spread you measured.');
}

export async function run(argv) {
  try {
    await main(argv);
  } catch (error) {
    if (error instanceof UsageError) return reportUsageError(error, USAGE);
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
