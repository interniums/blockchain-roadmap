/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-blocks-count-the-missed-slots
 * Run:      node scripts/sample-slots.mjs --slots 1000 && node --test test/slot-sample.test.mjs
 *
 * This is the tool the exercise asks you to build. It exits non-zero on purpose: an empty
 * script that exited 0 would report success for work nobody has done.
 *
 * What it has to end up doing:
 *   1. The summary reports a missed-slot count and the sample covers at least 1,000 consecutive
     slots
 *   2. A test asserts the slot delta and the block-number delta across the sample are not equal
 *   3. The observed `gasLimit` is reported and compared against the current default rather than
     assumed
 *   4. Both fee series are present per block, and the reported correlation between them is close to
     zero rather than close to one
 *   5. Raw API responses are cached so a rerun produces an identical summary without new network
     calls
 */

const argv = process.argv.slice(2);
void argv;

console.error('TODO: scripts/sample-slots.mjs is unimplemented (practice ledgers-blocks-count-the-missed-slots)');
process.exit(1);
