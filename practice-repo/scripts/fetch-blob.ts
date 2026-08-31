/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: scaling-data-availability-retrieve-a-blob-and-fail-to
 * Run:      npx tsx scripts/fetch-blob.ts --tx $RECENT_BLOB_TX && npx tsx scripts/fetch-blob.ts --tx $OLD_BLOB_TX
 *
 * This is the tool the exercise asks you to build. It exits non-zero on purpose: an empty
 * script that exited 0 would report success for work nobody has done.
 *
 * What it has to end up doing:
 *   1. One blob retrieved, with the recomputed versioned hash matching the one read from the
     execution layer
 *   2. One blob demonstrably unavailable, with the exact beacon API response captured
 *   3. The write-up states that the old transaction still exists on the execution layer while its
     sidecar does not
 *   4. The write-up names the 1-of-N archiver assumption as the thing being relied on after the
     retention window
 */

export {};

const argv: string[] = process.argv.slice(2);
void argv;

console.error('TODO: scripts/fetch-blob.ts is unimplemented (practice scaling-data-availability-retrieve-a-blob-and-fail-to)');
process.exit(1);
