/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: protocol-client-architecture-engine-handshake  (implement, difficulty 3)
 * Exercised by: test/engine-handshake.test.ts
 * Run:      npx vitest run test/engine-handshake.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Stand up an execution client in dev mode locally (Reth or Geth, both expose the Engine API
 *   on 8551) with a jwt.hex secret you generate yourself. Then write a small TypeScript client
 *   that does what a consensus client does, without a consensus client: mint an HS256 JWT from
 *   that secret with a current iat claim, call engine_forkchoiceUpdatedVn with payload
 *   attributes to start a build, take the returned payloadId, wait, call engine_getPayloadVn,
 *   and feed the result back in with engine_newPayloadVn. Assert the status you get. Then add
 *   two failure tests: one that signs the JWT with a different secret, and one that signs with a
 *   correct secret but an iat skewed far into the past. Record which HTTP status and which error
 *   body each produces, and what the execution client logs in each case. Finally, call
 *   engine_getPayloadVn twice for the same payloadId with a delay between the calls and compare
 *   the block values.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - The Engine API — A private, authenticated engine_* JSON-RPC namespace that is the only
 *     interface between the consensus and execution clients.
 *   - The JWT secret both clients read — A shared HS256 secret in a jwt.hex file authenticates
 *     the Engine API, and a mismatch is the classic "my node will not sync" failure.
 *   - engine_newPayload — "here is a block, is it good?" — The consensus client hands the
 *     execution client a block body to execute and validate, and gets back VALID, INVALID,
 *     SYNCING or ACCEPTED.
 *   - engine_forkchoiceUpdated — "this is the chain, and maybe start building" — Tells the
 *     execution client the new head, safe and finalized hashes, and optionally starts a block
 *     build that returns a payloadId.
 *   - engine_getPayload — collecting the block you asked for — Retrieves the block the
 *     execution client has been assembling for a payloadId, and calling later yields a fuller,
 *     higher-value block.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const engineHandshakeUnimplemented = true;
