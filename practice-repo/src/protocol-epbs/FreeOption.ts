/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: protocol-epbs-price-the-free-option  (implement, difficulty 4)
 * Exercised by: test/free-option.test.ts
 * Run:      npx vitest run test/free-option.test.ts && npx tsx src/sweep-option.ts --out out/withholding.json
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Model the builder's decision after signing a bid. The builder has committed to pay a value V
 *   and holds a block whose realised profit depends on prices that keep moving during the reveal
 *   window. Simulate price movement over that window with a volatility parameter, and at the
 *   reveal deadline compare the payoff of revealing against the payoff of withholding —
 *   remembering that V is paid either way. Sweep volatility and bid size, and produce the
 *   withholding rate for each combination. State the break-even condition in closed form and
 *   check your simulation agrees with it. Then answer: at what withholding rate does the
 *   availability bitvector stop being an edge case for downstream tooling?
 *
 * The 3 concepts this has to end up demonstrating:
 *   - The builder's free option — Having committed to a bid, the builder can still choose not
 *     to reveal — it forfeits the payment but keeps the choice, which is a short-dated option
 *     on the payload.
 *   - Payment is unconditional once the bid is signed — The proposer is paid whether or not
 *     the builder ever reveals the payload — which is exactly what removes the need for relay
 *     escrow.
 *   - A slot can have a block and no payload — Beacon state gains a payload-availability
 *     bitvector, because a valid beacon block whose payload was never revealed is now a legal
 *     chain state.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const freeOptionUnimplemented = true;
