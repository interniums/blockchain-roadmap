/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-blocks-count-the-missed-slots  (measure, difficulty 3)
 * Exercised by: test/slot-sample.test.mjs
 * Run:      node scripts/sample-slots.mjs --slots 1000 && node --test test/slot-sample.test.mjs
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Sample 1,000 consecutive slots from a beacon API and, over the same range, the execution
 *   blocks they produced. Count the missed slots, and show that the slot delta and the
 *   block-number delta across the sample are different numbers. Then chart, for the same range,
 *   `gasUsed / gasLimit`, `baseFeePerGas`, `blobGasUsed` and the blob base fee derived from
 *   `excessBlobGas`. Report the observed gas limit and say whether it matches the current
 *   default. Write the collector so the numbers are reproducible: cache the raw responses, and
 *   emit a JSON summary at `out/slot-sample.json` containing the miss count, the two deltas, the
 *   observed gas limit, and the correlation between the execution base fee and the blob base fee
 *   over the sample. Assertions live in `test/slot-sample.test.mjs` and run against the emitted
 *   summary.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Slots tick, blocks do not — A slot happens every 12 seconds whether or not anyone
 *     proposes; a block exists only if the assigned proposer produced one.
 *   - How long finality actually takes — 32 slots make an epoch of 6.4 minutes, and Casper FFG
 *     justifies then finalises, so finality trails the head by about two epochs.
 *   - The block gas limit — A validator-adjustable ceiling on total gas per block, doubled to
 *     60M in Fusaka, with a separate per-transaction cap on top.
 *   - The second fee market — `blobGasUsed` and `excessBlobGas` run an EIP-1559 market for
 *     blob space that is entirely independent of the gas market.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const slotSampleUnimplemented = true;
