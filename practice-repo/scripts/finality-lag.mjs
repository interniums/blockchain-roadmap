/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: fundamentals-distributed-measure-finality-lag
 * Run:      node scripts/finality-lag.mjs --minutes 60 --out results/finality-lag.json
 *
 * This is the tool the exercise asks you to build. It exits non-zero on purpose: an empty
 * script that exited 0 would report success for work nobody has done.
 *
 * What it has to end up doing:
 *   1. At least 250 samples of (latest, safe, finalized) with local timestamps are recorded
 *   2. Head-to-finalized lag is reported as a distribution in both blocks and seconds, not a single
     mean
 *   3. Any sample exceeding the nominal two-epoch expectation is flagged with its timestamp
 *   4. A written recommendation gates three product actions on named markers, each justified by a
     number from the data
 */

const argv = process.argv.slice(2);
void argv;

console.error('TODO: scripts/finality-lag.mjs is unimplemented (practice fundamentals-distributed-measure-finality-lag)');
process.exit(1);
