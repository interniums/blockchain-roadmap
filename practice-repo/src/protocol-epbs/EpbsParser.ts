/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: protocol-epbs-break-a-block-parser  (break, difficulty 3)
 * Exercised by: test/epbs-parser.test.ts
 * Run:      npx vitest run test/epbs-parser.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Write or take a beacon-block parser that works against the current fork — something that
 *   pulls a block from a beacon API and extracts its transactions, blob commitments, fee
 *   recipient and gas used. Then build a fixture of a post-ePBS block shape from the EIP's
 *   container definitions: a beacon block body with the payload bid and payload attestations,
 *   and no execution payload, blob commitments or execution requests. Run the parser against it
 *   and enumerate every field access that raises or silently returns the wrong thing. Add a
 *   second fixture representing a slot whose payload was never revealed, and check what your
 *   parser reports for it. Deliver the migration note an indexing team would act on.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - The signed payload bid — The beacon block body no longer carries the execution payload —
 *     it carries a signed commitment to a block hash, a builder index and a promised value.
 *   - The payload envelope — The builder broadcasts the actual payload separately, later in
 *     the same slot, carrying the execution requests and blob commitments the block no longer
 *     holds.
 *   - A slot can have a block and no payload — Beacon state gains a payload-availability
 *     bitvector, because a valid beacon block whose payload was never revealed is now a legal
 *     chain state.
 *   - The payload timeliness committee — A per-slot committee of 512 validators that votes
 *     only on whether the payload was revealed on time and its data was available — never on
 *     whether it is valid.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const epbsParserUnimplemented = true;
