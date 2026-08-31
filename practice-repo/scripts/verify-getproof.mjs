/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: fundamentals-state-verify-a-real-getproof
 * Run:      node scripts/verify-getproof.mjs --address <address> --slot <slot> --block <block>
 *
 * This is the tool the exercise asks you to build. It exits non-zero on purpose: an empty
 * script that exited 0 would report success for work nobody has done.
 *
 * What it has to end up doing:
 *   1. The script recomputes the state root bottom-up from the returned account-proof nodes and
     asserts equality with the header's stateRoot
 *   2. Each node in both proofs is annotated as branch, extension or leaf, with the deciding
     evidence stated
 *   3. The nibble path of keccak256(address) is printed alongside the slot chosen at each branch
     node
 *   4. A third run against an unwritten slot is annotated to show where the path terminates and why
     that constitutes an exclusion proof
 */

const argv = process.argv.slice(2);
void argv;

console.error('TODO: scripts/verify-getproof.mjs is unimplemented (practice fundamentals-state-verify-a-real-getproof)');
process.exit(1);
