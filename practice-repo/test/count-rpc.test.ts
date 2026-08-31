/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: app-wagmi-count-the-requests  (measure, grain block, difficulty 2)
 * Run:      pnpm tsx scripts/count-rpc.ts --report report.json && pnpm vitest run test/count-rpc.test.ts
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Render the same `useReadContract` call in five separate components on one page against a
 *   local Anvil node. Count the RPC requests Anvil actually receives. Then change one argument
 *   in one of the five components and count again. Finally, remove the explicit `chainId` from
 *   all five while the wallet is on a different chain than the config's default, and record what
 *   the components display. Write down the request counts and what changed the answer.
 *
 * Your code goes in src/app-wagmi/CountRpc.ts. Nothing here imports it yet — a TypeScript
 * module is its named exports, and this scaffold does not invent them. Export what the
 * exercise needs, then import it above.
 */
import { describe, it, expect } from 'vitest';

describe('Five components, how many requests', () => {
  // report.json records the request count for the identical-args case and for the varied-args
  // case, and the test asserts the first is strictly smaller
  it('01 — report.json records the request count for the identical-args case and…', () => {
    expect.fail('report.json records the request count for the identical-args case and for the varied-args case, and the test asserts the first is strictly smaller');
  });

  // The report states which fields of the query key changed between the two runs
  it('02 — The report states which fields of the query key changed between the two…', () => {
    expect.fail('The report states which fields of the query key changed between the two runs');
  });

  // The report records what the five components displayed in the chain-mismatch case and whether
  // any error was surfaced
  it('03 — The report records what the five components displayed in the…', () => {
    expect.fail('The report records what the five components displayed in the chain-mismatch case and whether any error was surfaced');
  });
});
