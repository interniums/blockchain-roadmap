/*
 * Practice: fundamentals-networks-diff-two-mempools  (kind: measure)
 * Run:      node scripts/mempool-diff.mjs --samples 20 --out results/mempool-diff.json
 *
 * This practice is MANUAL in Chainpath: the acceptance command carries flags the runner's grammar
 * does not accept, so the app shows you the command and you run it yourself. Set the two endpoints
 * first:
 *
 *   export CHAINPATH_RPC_A="..."
 *   export CHAINPATH_RPC_B="..."
 *
 * Your work is the four functions marked TODO. Everything else - argument handling, the RPC
 * plumbing, the statistics, the output file - is written for you, and the shape of the output
 * object below is the specification for what the measurement has to produce.
 */
import { endpoints, intArg, parseArgs, reportUsageError, UsageError } from './lib/cli.mjs';
import { redact } from './lib/rpc.mjs';
import { difference, jaccard, summarise } from './lib/stats.mjs';
import { checkWriteUp, writeResult } from './lib/output.mjs';

export const USAGE = `usage: node scripts/mempool-diff.mjs --samples 20 --out results/mempool-diff.json

  --samples <n>  how many paired snapshots to take (default 20, minimum 20 for the criteria)
  --out <path>   where to write the results JSON

  environment:
    CHAINPATH_RPC_A, CHAINPATH_RPC_B - two independent endpoints`;

/*
 * TODO (write-up). At least a few sentences:
 *
 *   - what the numbers say about the phrase "the mempool", and
 *   - one specific behaviour change for a product that currently treats a single provider's
 *     pending set as the truth. Name the behaviour, not the principle.
 */
const WRITE_UP = '';

/*
 * TODO (method note). `txpool_content` is not available on every endpoint. A pending-transaction
 * subscription plus a rolling window is a workable substitute. Say which you used and why, because
 * the two answer slightly different questions and your numbers are not comparable to someone
 * else's without it.
 */
const METHOD_NOTE = '';

/**
 * TODO: take one snapshot of an endpoint's pending set.
 *
 * @returns {Promise<Set<string>>} transaction hashes, lowercased.
 */
async function snapshot(_url) {
  throw new Error('TODO: snapshot is unimplemented - see scripts/networks/mempool-diff.mjs');
}

/**
 * TODO: take one PAIRED sample - a snapshot from each endpoint, as close to the same instant as
 * you can manage.
 *
 * The two snapshots will never be truly simultaneous. Bound the skew and report it in `skewMs`
 * rather than pretending it is zero; a comparison whose skew is larger than the propagation delay
 * it is trying to measure has not measured anything.
 *
 * @returns {Promise<{ takenAt: string, skewMs: number, a: Set<string>, b: Set<string> }>}
 */
async function pairedSample(_urls) {
  throw new Error('TODO: pairedSample is unimplemented - see scripts/networks/mempool-diff.mjs');
}

/**
 * TODO: for the transactions that appeared in only one pool, how long did they take to be included
 * once they landed, compared with those seen by both?
 *
 * Segment by fee as well as by group - the practice warns that the disjoint sets will be dominated
 * by low-fee and recently-arrived transactions, and a comparison that does not control for that is
 * mostly measuring fee.
 *
 * @returns {Promise<{ seenByBoth: object, seenByOne: object, byFeeBucket: object }>} each summary
 *          from `summarise()` over inclusion latency in milliseconds.
 */
async function inclusionLatency(_urls, _samples) {
  throw new Error('TODO: inclusionLatency is unimplemented - see scripts/networks/mempool-diff.mjs');
}

export async function main(argv) {
  const args = parseArgs(argv);
  const samples = intArg(args, 'samples', 20);
  const out = typeof args.out === 'string' ? args.out : null;
  if (!out) throw new UsageError('--out <path> is required');
  if (samples < 20) throw new UsageError('the practice asks for at least twenty paired snapshots');

  const urls = endpoints();
  process.stderr.write(`sampling ${samples} paired snapshots from ${redact(urls.a)} and ${redact(urls.b)}\n`);

  const startedAt = new Date().toISOString();
  const records = [];

  for (let i = 0; i < samples; i++) {
    const sample = await pairedSample(urls);
    const onlyA = difference(sample.a, sample.b);
    const onlyB = difference(sample.b, sample.a);
    records.push({
      index: i,
      takenAt: sample.takenAt,
      skewMs: sample.skewMs,
      sizeA: sample.a.size,
      sizeB: sample.b.size,
      intersection: sample.a.size - onlyA.size,
      onlyA: onlyA.size,
      onlyB: onlyB.size,
      jaccard: jaccard(sample.a, sample.b),
    });
    process.stderr.write(`sample ${i + 1}/${samples}: overlap ${records[i].jaccard.toFixed(3)}\n`);
  }

  const payload = {
    practice: 'fundamentals-networks-diff-two-mempools',
    startedAt,
    finishedAt: new Date().toISOString(),
    endpoints: { a: redact(urls.a), b: redact(urls.b) },
    methodNote: METHOD_NOTE,
    samples: records,
    jaccardSummary: summarise(records.map((r) => r.jaccard)),
    skewMsSummary: summarise(records.map((r) => r.skewMs)),
    inclusionLatencyMs: await inclusionLatency(urls, records),
    writeUp: WRITE_UP,
  };

  const target = await writeResult(out, payload);
  process.stderr.write(`wrote ${records.length} paired samples to ${target}\n`);

  if (!METHOD_NOTE.trim()) {
    process.stderr.write('\nIncomplete: METHOD_NOTE is empty - say which pending-set method you used and why.\n');
    process.exitCode = 1;
  }
  checkWriteUp(WRITE_UP, 'name one behaviour a product should change if it trusts a single pending view.');
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
