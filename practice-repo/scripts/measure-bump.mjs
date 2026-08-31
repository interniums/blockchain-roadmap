/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-mempool-find-the-bump-threshold
 * Run:      node scripts/measure-bump.mjs && node --test test/bump-threshold.test.mjs
 *
 * This is the tool the exercise asks you to build. It exits non-zero on purpose: an empty
 * script that exited 0 would report success for work nobody has done.
 *
 * What it has to end up doing:
 *   1. The measured legacy-pool threshold is derived from observed accept/reject boundaries, not
     from a constant in the source
 *   2. At least one attempt below the measured threshold is recorded with the node's verbatim
     rejection error
 *   3. The blob-transaction threshold is measured on the same endpoint and asserted to be strictly
     larger than the legacy one
 *   4. The output records the endpoint and, where obtainable, the client name and version
 *   5. A test asserts the helper raises both `maxFeePerGas` and `maxPriorityFeePerGas`, not only
     one of them
 */

const argv = process.argv.slice(2);
void argv;

console.error('TODO: scripts/measure-bump.mjs is unimplemented (practice ledgers-mempool-find-the-bump-threshold)');
process.exit(1);
