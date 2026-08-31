/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-blocks-rebuild-the-block-hash  (implement, grain module, difficulty 4)
 * Run:      node --test test/header-hash.test.mjs
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested should no longer contain a fail() call. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Fetch a recent mainnet block with `eth_getBlockByNumber`, take every header field,
 *   RLP-encode them in the order the execution specs declare them, keccak-256 the encoding, and
 *   assert the result equals the block's reported `hash`. Take the field order from the `Header`
 *   dataclass in ethereum/execution-specs for the fork your block belongs to — not from a blog
 *   post and not from this exercise, because the ordering is the thing being tested and an RLP
 *   list is order-sensitive. Then make the exercise teach its own lesson: add a test that omits
 *   one field and asserts the hash no longer matches, and a test that swaps two adjacent fields
 *   and asserts the same. Finally, print the three post-Merge fossil fields and assert their
 *   values are the constants they are frozen at. Tests go in `test/header-hash.test.mjs`.
 */
import { test } from 'node:test';

  // The recomputed hash equals the reported block hash for a post-Pectra mainnet block
  test('01 — The recomputed hash equals the reported block hash for a post-Pectra…', () => {
    throw new Error('The recomputed hash equals the reported block hash for a post-Pectra mainnet block');
  });

  // A negative test omits one field and asserts the hash differs
  test('02 — A negative test omits one field and asserts the hash differs', () => {
    throw new Error('A negative test omits one field and asserts the hash differs');
  });

  // A negative test swaps two adjacent fields and asserts the hash differs
  test('03 — A negative test swaps two adjacent fields and asserts the hash differs', () => {
    throw new Error('A negative test swaps two adjacent fields and asserts the hash differs');
  });

  // `difficulty` and the header `nonce` are asserted to be their frozen post-Merge values
  test('04 — `difficulty` and the header `nonce` are asserted to be their frozen…', () => {
    throw new Error('`difficulty` and the header `nonce` are asserted to be their frozen post-Merge values');
  });

  // A comment records the execution-specs path and fork the field order was read from
  test('05 — A comment records the execution-specs path and fork the field order was…', () => {
    throw new Error('A comment records the execution-specs path and fork the field order was read from');
  });
