/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: altvm-cosmos-capstone-a-packet-that-cannot-lie  (implement, difficulty 5)
 * Exercised by: test/ibc-packet.test.ts
 * Run:      npx vitest run test/ibc-packet.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Put the whole module under load at once: an application that is its own chain, the seam it
 *   runs on, and a packet crossing to a counterparty whose consensus you verify rather than
 *   trust. Build two chains as state machines, each with the ABCI-shaped seam and one SDK-style
 *   module. Give each a light client of the other, with the validity and misbehaviour predicates
 *   from earlier in this module. Then move a packet: update the client, prove the packet
 *   commitment against the tracked root, receive it on the counterparty, and write an
 *   acknowledgement back. Now attack it. Have two permissionless relayers race to deliver the
 *   same packet and assert it is received exactly once. Let a packet time out and assert the
 *   sender can reclaim without the counterparty cooperating. Submit a packet whose commitment
 *   proof does not match the tracked root and assert refusal. Freeze one client with an
 *   equivocation proof and assert in-flight packets on that path stop while the other path keeps
 *   working. Finally, the two things that make this transferable. Implement the same path twice,
 *   once with a handshake establishing the channel and once without one, and record what the
 *   second removes. Then point the client at a counterparty that is not a Cosmos chain at all,
 *   with a different consensus rule behind the same predicate interface, and say which part of
 *   your code had to change.
 *
 * The 11 concepts this has to end up demonstrating:
 *   - The appchain thesis — An application should get its own sovereign chain rather than rent
 *     block space on a shared one.
 *   - Sovereignty costs you a validator set — An appchain must bootstrap and pay for its own
 *     security - the structural weakness rollups exist to avoid.
 *   - Renting a validator set — Shared-security arrangements let a consumer chain borrow a
 *     provider chain's validators.
 *   - CometBFT, ABCI, and the SDK — Consensus and networking below, an application framework
 *     above, and a defined interface between them.
 *   - Single-slot deterministic finality — A committed block is final immediately - no reorgs,
 *     no confirmation depth, but the chain halts rather than forks.
 *   - Modules, not contracts — A chain is assembled from modules compiled into its binary,
 *     each owning a slice of state and handling its own messages.
 *   - CosmWasm is a choice, not a property — Chains that want deployable contracts add a
 *     module that runs Rust-compiled WebAssembly.
 *   - IBC trusts a light client, not a committee — Each chain verifies proofs of the
 *     counterparty's state with an on-chain light client of that chain.
 *   - Relayers are liveness, not trust — Relayers move packets and proofs between chains but
 *     cannot forge them, so anyone can run one.
 *   - IBC Classic and IBC v2 — The multi-step connection and channel handshake collapses into
 *     a simpler model in v2, released in 2025.
 *   - IBC outside Cosmos — Light-client verification implemented in Solidity turns IBC from an
 *     intra-Cosmos protocol into a general one.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const ibcPacketUnimplemented = true;
