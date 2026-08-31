/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-indexer-selection-migration-plan
 * Run:      pnpm tsx scripts/dual-run-diff.ts --range 10000 --fail-on-diff && test -f docs/migration-plan.md
 *
 * This is the tool the exercise asks you to build. It exits non-zero on purpose: an empty
 * script that exited 0 would report success for work nobody has done.
 *
 * What it has to end up doing:
 *   1. The diff script returns zero rows over the sampled range and exits non-zero if any row
     differs
 *   2. Backfill duration is extrapolated from a measured sample, with the sample size and measured
     rate stated
 *   3. The cutover criterion is numeric and time-bounded, not "when it looks right"
 *   4. A steward-risk section names the controlling entity for each candidate and gives a concrete
     exit path
 */

export {};

const argv: string[] = process.argv.slice(2);
void argv;

console.error('TODO: scripts/dual-run-diff.ts is unimplemented (practice infra-indexer-selection-migration-plan)');
process.exit(1);
