/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: protocol-fork-choice-count-real-reorgs  (measure, difficulty 3)
 * Exercised by: test/reorgs.test.ts
 * Run:      npx tsx src/scan-reorgs.ts --days 7 --out out/reorgs.json && npx vitest run test/reorgs.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Using a public beacon API, walk at least one week of slots and reconstruct the canonical
 *   chain by parent root. Detect reorgs by finding slots whose block was later replaced, and
 *   record the depth of each. Separately, sample the head and finalized checkpoints at regular
 *   intervals and record the gap between them over the same period. Produce two outputs: a table
 *   of reorg depths with counts, and a time series of head-minus-finalized distance. Then write
 *   the decision note an exchange would use: given your measured reorg depth distribution, how
 *   many slots would you wait before crediting a deposit, and what does the confirmation rule
 *   change about that answer compared with picking a depth from your histogram?
 *
 * The 3 concepts this has to end up demonstrating:
 *   - The honest late-block reorg rule — An optional client rule lets a proposer legitimately
 *     reorg the previous block if it arrived too late, gated on head weight, parent weight and
 *     epochs since finalization.
 *   - The fast confirmation rule — A fork-choice-derived rule that says a block cannot be
 *     reorged unless more than a stated fraction of stake is adversarial, giving strong
 *     confidence in seconds rather than minutes.
 *   - What fork choice decides — Given every block and vote a node has seen, which block is
 *     the head — a tie-breaker for the unfinalized tip, not a finality mechanism.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const reorgsUnimplemented = true;
