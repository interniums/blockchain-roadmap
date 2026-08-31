/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-mempool-watch-the-nonce-gap
 * Run:      node scripts/nonce-gap.mjs && node --test test/nonce-gap.test.mjs
 *
 * This is the tool the exercise asks you to build. It exits non-zero on purpose: an empty
 * script that exited 0 would report success for work nobody has done.
 *
 * What it has to end up doing:
 *   1. The timeline shows the transaction in the queued bucket for at least ten consecutive polls
     before N is sent
 *   2. A test asserts the fee increase did not move the transaction out of the queued bucket
 *   3. The timeline records at least one poll where the two endpoints disagree about the
     transaction's state
 *   4. The promotion from queued to pending is captured in the timeline within one block of N being
     sent
 *   5. The write-up states, in one sentence, why the wallet UI would have said "pending" for the
     entire run
 */

const argv = process.argv.slice(2);
void argv;

console.error('TODO: scripts/nonce-gap.mjs is unimplemented (practice ledgers-mempool-watch-the-nonce-gap)');
process.exit(1);
