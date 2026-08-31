/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-session-keys-measure-revocation-window
 * Run:      forge test --match-path test/RevocationWindow.t.sol --gas-report && pnpm tsx scripts/revocation-latency.ts --out latency.json
 *
 * This is the tool the exercise asks you to build. It exits non-zero on purpose: an empty
 * script that exited 0 would report success for work nobody has done.
 *
 * What it has to end up doing:
 *   1. The gas report contains a measured cost for the revocation path, quoted from the report
     rather than estimated
 *   2. latency.json records click-to-receipt seconds on a testnet and converts it into a window
     expressed in blocks
 *   3. The Anvil race test shows the session-key operation being included ahead of the revocation
     and asserts it succeeded
 */

export {};

const argv: string[] = process.argv.slice(2);
void argv;

console.error('TODO: scripts/revocation-latency.ts is unimplemented (practice app-session-keys-measure-revocation-window)');
process.exit(1);
