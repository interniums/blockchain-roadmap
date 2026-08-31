/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: altvm-cosmos-abci-in-one-file  (implement, difficulty 4)
 * Exercised by: test/abci-lifecycle.test.ts
 * Run:      npx vitest run test/abci-lifecycle.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   ABCI is a strict request/response interface between the consensus engine and the
 *   application. Three calls carry the work: CheckTx validates transactions before they enter
 *   the mempool, FinalizeBlock is invoked after consensus is reached and is where state
 *   transitions occur, and Commit persists the finalised state to local disk. Implement that
 *   seam. Write a consensus driver that calls those three in order and an application that
 *   implements them, with one SDK-style module owning a slice of state and its own message
 *   handler. Make the boundary real: the application must not be able to reach the mempool, and
 *   the driver must not know what a message means. Then show what instant finality is. A block
 *   that has been committed is final; there is no confirmation depth to wait for and no
 *   probabilistic reasoning to do. Assert that, and contrast it with a reorg test your driver
 *   should be unable to perform. Finally, add a second module that interprets a message as
 *   arbitrary bytecode rather than a typed message, and note in a comment why that layer is
 *   optional here when it is mandatory on a shared chain.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - CometBFT, ABCI, and the SDK — Consensus and networking below, an application framework
 *     above, and a defined interface between them.
 *   - Single-slot deterministic finality — A committed block is final immediately - no reorgs,
 *     no confirmation depth, but the chain halts rather than forks.
 *   - Modules, not contracts — A chain is assembled from modules compiled into its binary,
 *     each owning a slice of state and handling its own messages.
 *   - CosmWasm is a choice, not a property — Chains that want deployable contracts add a
 *     module that runs Rust-compiled WebAssembly.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const abciLifecycleUnimplemented = true;
