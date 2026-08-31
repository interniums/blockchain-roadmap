//! CHAINPATH-GENERATED-SCAFFOLD
//!
//!
//! Practice: altvm-token-2022-break-the-naive-vault  (break, grain module, difficulty 4)
//! Run:      cargo test-sbf -p token-2022-vault --test break_the_naive_vault -- --nocapture
//!
//! THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
//! resolves and fails honestly, with one named case per acceptance criterion, instead of
//! reporting "the test path may not exist" — which is a broken harness, not a red test.
//!
//! Replace each placeholder with a real assertion as you go. A criterion you have actually
//! tested no longer needs its placeholder. Delete this notice when none remain.
//!
//! What the practice asks for:
//!   Write a deliberately naive vault program that credits a depositor with the amount named in
//!   the deposit instruction and lets depositors withdraw their credited balance. Run two attacks
//!   against it. First, deposit a fee-bearing Token-2022 mint and show the vault is insolvent by
//!   exactly the accumulated fees - the last withdrawer cannot be paid. Fix it by crediting the
//!   vault's measured balance delta and prove the same attack now fails. Second, create a mint
//!   with a permanent delegate, deposit it, and use the delegate to move the tokens out of the
//!   vault's own token account, leaving credited balances backed by nothing. Then write the
//!   mint-validation function you would run before listing any mint, and show it rejects the
//!   permanent-delegate mint and accepts a plain one.

/// Against the naive vault, the fee test proves a shortfall equal to the total fees withheld
/// and the final withdrawal fails
#[test]
fn criterion_01_against_the_naive_vault_the_fee_test() {
    panic!("Against the naive vault, the fee test proves a shortfall equal to the total fees withheld and the final withdrawal fails");
}

/// After the delta-measurement fix, the same fee test passes with every depositor able to
/// withdraw
#[test]
fn criterion_02_after_the_delta_measurement_fix_the_same() {
    panic!("After the delta-measurement fix, the same fee test passes with every depositor able to withdraw");
}

/// The permanent-delegate test drains the vault's token account while credited balances remain
/// nonzero
#[test]
fn criterion_03_the_permanent_delegate_test_drains_the_vault() {
    panic!("The permanent-delegate test drains the vault's token account while credited balances remain nonzero");
}

/// The mint-validation function rejects the permanent-delegate mint and accepts a mint with no
/// hazardous extensions, with both cases asserted
#[test]
fn criterion_04_the_mint_validation_function_rejects_the_permanent() {
    panic!("The mint-validation function rejects the permanent-delegate mint and accepts a mint with no hazardous extensions, with both cases asserted");
}
