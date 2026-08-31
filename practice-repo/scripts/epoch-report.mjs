/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-pos-measure-an-epoch
 * Run:      node scripts/epoch-report.mjs --epoch finalized && node --test test/epoch-report.test.mjs
 *
 * This is the tool the exercise asks you to build. It exits non-zero on purpose: an empty
 * script that exited 0 would report success for work nobody has done.
 *
 * What it has to end up doing:
 *   1. The report contains participation rate, committee count, committee size, missed slots and
     slashings for one epoch
 *   2. A test asserts committee size times committees per slot times 32 is within rounding of the
     active validator count
 *   3. Total active stake is reported in ETH and is not derived by multiplying validator count by
     32
 *   4. A test asserts the epoch spans exactly 32 slots and that missed slots are counted as
     absences rather than as errors
 *   5. The report records which beacon endpoint answered, since participation figures are
     node-local until finalized
 */

const argv = process.argv.slice(2);
void argv;

console.error('TODO: scripts/epoch-report.mjs is unimplemented (practice ledgers-pos-measure-an-epoch)');
process.exit(1);
