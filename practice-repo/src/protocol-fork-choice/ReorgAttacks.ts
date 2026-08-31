/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: protocol-fork-choice-run-an-ex-ante-reorg  (break, difficulty 4)
 * Exercised by: test/reorg-attacks.test.ts
 * Run:      npx vitest run test/reorg-attacks.test.ts && npx tsx src/sweep.ts --out out/thresholds.json
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Using the LMD-GHOST implementation you built, script both reorg attacks against it. For the
 *   ex-ante attack, have the adversary withhold a block and a chosen number of attestations, let
 *   an honest block be published and attested, then release the withheld fork and check whether
 *   the head moves. For the ex-post attack, have the adversary propose in the following slot on
 *   the honest block's parent, with its own proposer boost and any withheld votes. For each
 *   attack, sweep the adversarial stake fraction and the boost value and record the minimum
 *   fraction that succeeds. Plot both curves on one chart against boost value. The two curves
 *   must move in opposite directions; if they do not, your simulation is wrong.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Ex-ante reorg — The attacker withholds its own block and votes, lets an honest block be
 *     published, then releases the hidden fork with enough accumulated weight to displace it.
 *   - Ex-post reorg — The attacker sees an honest block already published, then uses its own
 *     proposer boost plus withheld attestations to build a sibling that outweighs it.
 *   - The boost is a dial with two failure modes — Too low and ex-ante reorgs and balancing
 *     attacks get cheap; too high and a malicious proposer can cheaply reorg the block before
 *     it.
 *   - Balancing attack — A small adversary with control over message timing splits honest
 *     validators into two roughly equal views and keeps the chain from converging.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const reorgAttacksUnimplemented = true;
