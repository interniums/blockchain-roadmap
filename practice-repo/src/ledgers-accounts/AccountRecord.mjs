/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: ledgers-accounts-rebuild-the-account-record  (implement, difficulty 3)
 * Exercised by: test/account-record.test.mjs
 * Run:      node --test test/account-record.test.mjs
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
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
 *
 * The 4 concepts this has to end up demonstrating:
 *   - The four-field account record — An Ethereum account is exactly `[nonce, balance,
 *     storageRoot, codeHash]`, RLP-encoded, and nothing more.
 *   - The address is the key, not a field — An account does not store its own address; the
 *     address is the trie key under which the record sits.
 *   - Storage is a separate trie, pointed at — Each account commits to a private 32-byte-key
 *     to 32-byte-value trie by a single root inside its record.
 *   - Code is content-addressed, not embedded — `codeHash` is the keccak of the bytecode; the
 *     bytecode itself is fetched by hash from outside the record.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const accountRecordUnimplemented = true;
