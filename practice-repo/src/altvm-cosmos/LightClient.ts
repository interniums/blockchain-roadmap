/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: altvm-cosmos-verify-a-header-yourself  (implement, difficulty 4)
 * Exercised by: test/light-client.test.ts
 * Run:      npx vitest run test/light-client.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   This is the idea in the ecosystem most worth taking with you: IBC is not a bridge with a
 *   committee. Chain A does not trust a multisig about chain B, and it does not re-run chain B
 *   either. It tracks chain B's validator set and verifies a commit against it, which is
 *   signature arithmetic rather than execution. Implement a validity predicate. Given a trusted
 *   header, a validator set with voting powers, and a new header carrying a commit, accept the
 *   new header only when signatures from more than two thirds of voting power support it. Reject
 *   a commit that reaches exactly two thirds, because more-than is the rule and off-by-one here
 *   is the whole security argument. Then implement the misbehaviour predicate, which is what
 *   separates this from a bridge. Two signed headers at the same height with different
 *   commitment roots is equivocation and must freeze the client, after which no subsequent
 *   consensus state can be generated. Show a frozen client refusing an update that would
 *   otherwise be valid. Last, show why the relayer needs no trust: have two independent relayers
 *   submit the same valid header and assert the outcome is identical, then have an untrusted
 *   relayer submit a forged one and assert it is refused on the arithmetic alone.
 *
 * The 2 concepts this has to end up demonstrating:
 *   - IBC trusts a light client, not a committee — Each chain verifies proofs of the
 *     counterparty's state with an on-chain light client of that chain.
 *   - Relayers are liveness, not trust — Relayers move packets and proofs between chains but
 *     cannot forge them, so anyone can run one.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const lightClientUnimplemented = true;
