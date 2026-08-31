/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-simulation-bundle-with-overrides
 * Run:      pnpm tsx scripts/simulate-bundle.ts --assert-isolated-call-reverts --report-gas
 *
 * This is the tool the exercise asks you to build. It exits non-zero on purpose: an empty
 * script that exited 0 would report success for work nobody has done.
 *
 * What it has to end up doing:
 *   1. The bundled run succeeds and prints decoded logs plus per-address balance deltas
 *   2. The same swap simulated without the preceding approval reverts, and the captured revert
     reason is reported
 *   3. The state override is shown to be what supplies the token balance, by rerunning without it
     and capturing that failure too
 *   4. All three gas figures are reported side by side with a written explanation of the divergence
     referencing cold versus warm access
 */

export {};

const argv: string[] = process.argv.slice(2);
void argv;

console.error('TODO: scripts/simulate-bundle.ts is unimplemented (practice infra-simulation-bundle-with-overrides)');
process.exit(1);
