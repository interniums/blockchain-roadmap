/**
 * CHAINPATH-GENERATED-SCAFFOLD
 *
 * Practice: altvm-token-2022-fee-lifecycle  (implement, difficulty 3)
 * Exercised by: test/transfer-fee-lifecycle.test.ts
 * Run:      pnpm vitest run test/transfer-fee-lifecycle.test.ts
 *
 * THE ANSWER GOES HERE. This file is named and empty on purpose — no signatures are
 * suggested, because guessing them would be guessing the shape of your answer. What is
 * below is the practice's own description and the concepts it covers.
 *
 * What the practice asks for:
 *   Against a local validator or an in-process SVM, create a Token-2022 mint with the transfer
 *   fee extension, create token accounts for two holders, mint a supply, and transfer between
 *   them with `transfer_checked`. Print, for that one transfer, four numbers: the sender's
 *   debit, the amount named in the instruction, the recipient's spendable credit, and the amount
 *   withheld inside the recipient's account. Then harvest the withheld amounts and withdraw them
 *   to the withdraw authority, printing the balance movement at each step. Separately, derive
 *   the associated token account address for one holder twice - once with the Token-2022 program
 *   id as a seed and once with the legacy token program id - and print both, showing they
 *   differ. Also attempt the same transfer with plain `transfer` and record what happens.
 *
 * The 4 concepts this has to end up demonstrating:
 *   - Transfer fee — A fee is withheld inside the recipient's token account, so the debit and
 *     the spendable credit differ.
 *   - transfer_checked, not transfer — Plain transfer fails on mints with fee or hook
 *     extensions, so integrators must pass the mint and decimals.
 *   - Extensions are TLV state — Extra state is appended after the classic layout as
 *     type-length-value records, so accounts are variable-sized.
 *   - The program id is a seed of the ATA — The same wallet and a same-looking mint derive a
 *     different associated token account under Token-2022.
 *
 * Unlike the Solidity stubs, the test does not import this one. A TypeScript module is its
 * named exports and there is no neutral unit to stand in for them, so exporting a class or a
 * function here would be inventing your API rather than holding a place for it. Export what the
 * exercise actually needs, then import it from the test.
 */

export const transferFeeLifecycleUnimplemented = true;
