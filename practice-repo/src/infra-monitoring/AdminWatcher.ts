/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: infra-monitoring-admin-watcher-and-heartbeat  (implement, difficulty 3)
 * Exercised by: tests/admin-watcher.test.ts
 * Run:      pnpm vitest run tests/admin-watcher --reporter=junit
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Build a watcher for a real mainnet protocol that subscribes to every privileged event on its
 *   contracts - ownership transfer, role granted and revoked, proxy upgraded, paused and
 *   unpaused - plus the queue event of its timelock, and decodes each into human-readable form
 *   including the new implementation or role holder. Extend it to the protocol's dependency set:
 *   enumerate the external contracts it trusts and watch the same events on each. Then add a
 *   heartbeat: the watcher writes a timestamp every block, and a separate process with its own
 *   RPC endpoint pages if the heartbeat goes stale, distinguishing "watcher down" from "RPC
 *   down". Verify everything by replaying historical blocks containing a real upgrade.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Every privileged action pages, regardless of amount — Role grants and revocations,
 *     ownership transfers, proxy upgrades, timelock queueing, pause toggles, oracle source
 *     changes and fee changes must alert unconditionally - they are both the exploit path and
 *     the insider path.
 *   - Alert on the queue, not the execution — For a timelocked system the actionable alert is
 *     the queue event, because the delay exists to give humans time and that time is only
 *     usable if queueing pages someone.
 *   - Watch the contracts you do not control — Oracle feeds, underlying vaults and staking
 *     tokens, bridges and the pools you price against are part of your risk surface, so their
 *     upgrades, pauses and depegs must be monitored as if they were yours.
 *   - Silence is ambiguous — The monitoring stack has its own failure modes, so it needs a
 *     heartbeat or dead-man's switch - a silent monitor is indistinguishable from a healthy
 *     protocol.
 *   - Not every incident is theft — A keeper that stopped running, an oracle gone stale, a
 *     relayer out of gas, a stalled sequencer, a stuck bridge message - liveness failures need
 *     their own inverted alerts, and they are easy to leave out.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const adminWatcherUnimplemented = true;
