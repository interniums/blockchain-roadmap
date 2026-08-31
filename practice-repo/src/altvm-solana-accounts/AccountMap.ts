/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: altvm-solana-accounts-map-a-token-balance  (measure, difficulty 2)
 * Exercised by: test/account-map.test.ts
 * Run:      pnpm vitest run test/account-map.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Pick any wallet with a token balance on Solana mainnet. Write a TypeScript script that, over
 *   a public RPC, fetches the wallet account itself and then the associated token account
 *   holding that balance. For each of the two accounts print the address, the owner program, the
 *   lamport balance, the data length, and the rent-exempt minimum for that data length. Then
 *   derive the associated token account address locally from the wallet, the mint and the token
 *   program id, and assert it equals the address you fetched - proving the address is a
 *   deterministic function of its inputs and not a registry lookup. Finally, print the token
 *   program's own account and show that its data is executable code and that it holds none of
 *   the balances it governs. Write a four-line comment at the top of the file stating where the
 *   equivalent state would live on Ethereum and which of these five printed values would have no
 *   Ethereum counterpart.
 *
 * The 5 concepts this has to end up demonstrating:
 *   - Solana account — The single unit of state - an addressed record holding lamports, a data
 *     blob, and the program id that owns it.
 *   - State lives outside the program — Where Ethereum keeps storage inside a contract, Solana
 *     makes each piece of state its own addressable account.
 *   - Programs are stateless — A Solana program holds no state of its own; every byte it reads
 *     or writes arrives as an account in the instruction.
 *   - Program Derived Address — An address with no private key, derived from seeds plus a
 *     program id, that only that program can sign for.
 *   - Rent exemption — Storing data costs a refundable lamport deposit sized to the data;
 *     funded accounts are never purged.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const accountMapUnimplemented = true;
