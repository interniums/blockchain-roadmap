/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-accounts-rebuild-the-account-record  (implement, grain block, difficulty 3)
 * Run:      node --test test/account-record.test.mjs
 *
 * THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
 * resolves and fails honestly, with one named case per acceptance criterion, instead of
 * reporting "the test path may not exist" — which is a broken harness, not a red test.
 *
 * Replace each placeholder with a real assertion as you go. A criterion you have actually
 * tested no longer needs its placeholder. Delete this notice when none remain.
 *
 * What the practice asks for:
 *   Write a script that, given any mainnet address, calls `eth_getProof` for it, pulls `nonce`,
 *   `balance`, `storageHash` and `codeHash` out of the response, RLP-encodes those four values
 *   in spec order yourself, keccak-256s the result, and compares that hash against the account
 *   leaf value carried inside the returned `accountProof`. Do the RLP encoding by hand rather
 *   than by calling a library helper that takes an account object — the point is to discover
 *   that the record really is four fields and that nothing else is in it. Run it against three
 *   targets: a plain EOA that has sent transactions, a deployed contract with non-empty storage,
 *   and an address that has never been touched. Report what the third one returns and why. Write
 *   the tests in `test/account-record.test.mjs` so all three cases are asserted.
 */
import { test } from 'node:test';

  // The computed hash matches the account leaf in `accountProof` for the EOA case
  test('01 — The computed hash matches the account leaf in `accountProof` for the…', () => {
    throw new Error('The computed hash matches the account leaf in `accountProof` for the EOA case');
  });

  // The computed hash matches for the contract case, and the test asserts `storageHash` differs
  // from the empty-trie root
  test('02 — The computed hash matches for the contract case, and the test asserts…', () => {
    throw new Error('The computed hash matches for the contract case, and the test asserts `storageHash` differs from the empty-trie root');
  });

  // The never-touched address case is asserted explicitly, and the test states in a message what
  // the node returned for it
  test('03 — The never-touched address case is asserted explicitly, and the test…', () => {
    throw new Error('The never-touched address case is asserted explicitly, and the test states in a message what the node returned for it');
  });

  // The RLP encoding is written in the exercise's own code, not delegated to a library function
  // that accepts an account struct
  test('04 — The RLP encoding is written in the exercise\'s own code, not delegated…', () => {
    throw new Error('The RLP encoding is written in the exercise\'s own code, not delegated to a library function that accepts an account struct');
  });

  // No test hard-codes an expected hash literal; every expectation is derived from the proof
  // response
  test('05 — No test hard-codes an expected hash literal; every expectation is…', () => {
    throw new Error('No test hard-codes an expected hash literal; every expectation is derived from the proof response');
  });
