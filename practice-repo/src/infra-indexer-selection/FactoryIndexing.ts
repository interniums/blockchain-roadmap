/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-indexer-selection-factory-blind-spot  (break, difficulty 4)
 * Exercised by: tests/factory-indexing.test.ts
 * Run:      forge script script/DeployFactory.s.sol --broadcast && pnpm vitest run tests/factory-indexing --reporter=junit
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Deploy a factory contract and several child contracts created by it on a local chain, and
 *   have the children emit swap-like events. Write an indexer that registers only the factory's
 *   creation event and not the children, so the child events are never subscribed to. Show
 *   exactly which events go missing and quantify them. Then fix it with the platform's
 *   dynamic-contract or template mechanism so children created at runtime are indexed from their
 *   creation block. Finally, add a value transfer that moves ETH through an internal call
 *   emitting no event, and demonstrate whether your chosen platform can see it at all.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Selection is usually decided on capability — Whether a platform can index traces, make
 *     contract reads inside handlers, follow factory-created contracts and cover your chains
 *     eliminates candidates before speed is ever consulted.
 *   - Logs are not everything that happened — Log-based indexing cannot see value moved by
 *     internal calls, and the tracing path that would see it is unavailable on several major
 *     networks - so any product that must account for that value needs a trace-capable
 *     indexer.
 *   - The self-hosted TypeScript model — Ponder is an open-source framework where you write
 *     handlers in plain TypeScript against a Postgres-backed schema and get GraphQL and SQL
 *     over the result.
 *   - The purpose-built data source model — Envio HyperIndex pairs TypeScript-family handlers
 *     with HyperSync, a columnar data source that replaces JSON-RPC during backfill.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const factoryIndexingUnimplemented = true;
