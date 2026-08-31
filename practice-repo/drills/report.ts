/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-incident-response-red-team-drill
 * Run:      bash drills/red-team.sh --fork $RPC_URL --record drills/timeline.json && pnpm tsx drills/report.ts
 *
 * This is the tool the exercise asks you to build. It exits non-zero on purpose: an empty
 * script that exited 0 would report success for work nobody has done.
 *
 * What it has to end up doing:
 *   1. The recorded timeline contains all six hops with wall-clock timestamps and block numbers for
     the on-chain ones
 *   2. Value lost during the window is reported as an absolute figure and as a percentage of the
     protocol's value at drill start
 *   3. The second run shows a measurably shorter time to inclusion, and the report names the
     bottleneck hop in each run
 *   4. The report names at least one preparedness item the drill revealed as missing, which was not
     in the runbook beforehand
 */

export {};

const argv: string[] = process.argv.slice(2);
void argv;

console.error('TODO: drills/report.ts is unimplemented (practice infra-incident-response-red-team-drill)');
process.exit(1);
