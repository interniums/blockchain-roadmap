/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: evm-blobs-data-lane-cost-comparison
 * Run:      npx tsx scripts/blobVsCalldata.ts --bytes 102400 --samples 20
 *
 * This is the tool the exercise asks you to build. It exits non-zero on purpose: an empty
 * script that exited 0 would report success for work nobody has done.
 *
 * What it has to end up doing:
 *   1. Three computed costs per sample, using live base fees rather than hardcoded values
 *   2. At least twenty samples showing the ratio between the two markets changing over time
 *   3. The calldata calculation distinguishes the standard rate from the EIP-7623 floor and states
     which applies to a data-dominated transaction
 *   4. A written note naming the retention window as a reason to choose calldata even when blobs
     are cheaper
 */

export {};

const argv: string[] = process.argv.slice(2);
void argv;

console.error('TODO: scripts/blobVsCalldata.ts is unimplemented (practice evm-blobs-data-lane-cost-comparison)');
process.exit(1);
