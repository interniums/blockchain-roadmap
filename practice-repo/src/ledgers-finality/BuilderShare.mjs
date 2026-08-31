/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-finality-measure-builder-share  (measure, difficulty 3)
 * Exercised by: test/builder-share.test.mjs
 * Run:      node scripts/builder-share.mjs --blocks 1000 && node --test test/builder-share.test.mjs
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Do not take a published builder-share figure on faith — the two most-cited 2026 numbers name
 *   different builder pairs and cannot both be current. Measure it. Over the last 1,000 mainnet
 *   blocks, identify the builder for each block and compute the share held by the top one, top
 *   two and top four. For the same sample, determine how many blocks were delivered through a
 *   relay at all, which gives you the MEV-Boost share. Then take one block and trace its value
 *   flow end to end: find it on a relay, identify the builder, and identify the payment from the
 *   builder to the proposer, stating where in the block that payment appears. Emit
 *   `out/builder-share.json` with the distribution, the sample range, and the source you
 *   measured from, and record how your top-two figure compares with the two published claims.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Block building is extremely concentrated — A very small number of builders produce the
 *     large majority of Ethereum blocks, and this is the central argument for enshrining PBS.
 *   - MEV-Boost — The out-of-protocol implementation of proposer-builder separation through
 *     which the large majority of Ethereum blocks are built.
 *   - The four roles — Searchers find opportunities, builders assemble blocks, relays escrow
 *     and validate them, and proposers sign headers.
 *   - The relay holds the payload — The proposer sees only the header and must sign it before
 *     the relay releases the block body.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const builderShareUnimplemented = true;
