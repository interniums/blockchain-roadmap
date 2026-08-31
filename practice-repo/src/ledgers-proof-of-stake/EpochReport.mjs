/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-pos-measure-an-epoch  (measure, difficulty 3)
 * Exercised by: test/epoch-report.test.mjs
 * Run:      node scripts/epoch-report.mjs --epoch finalized && node --test test/epoch-report.test.mjs
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Query a beacon API for one recent finalized epoch and report what actually happened in it:
 *   the participation rate, the number of distinct committees, the committee size, how many
 *   slots were missed, and any slashings recorded. Then do the arithmetic that makes the design
 *   visible — multiply committee size by committees per slot by slots per epoch and check it
 *   against the active validator count, so you can see for yourself that each validator attests
 *   exactly once per epoch. Report the total active stake in ETH rather than in validator count,
 *   and state why those two numbers no longer track each other. Emit `out/epoch-report.json` and
 *   assert its contents in `test/epoch-report.test.mjs`.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Slots and epochs — Time is divided into 12-second slots, grouped into epochs of 32
 *     slots, or 6.4 minutes.
 *   - Committees keep voting affordable — Only a sampled subset of validators attests in any
 *     given slot, so not everyone votes on everything.
 *   - An attestation is three votes in one — A committee member's signed vote on the head of
 *     the chain plus the source and target checkpoints.
 *   - What a validator is — A deposit of at least 32 ETH that buys the right and the duty to
 *     propose blocks and attest to them.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const epochReportUnimplemented = true;
