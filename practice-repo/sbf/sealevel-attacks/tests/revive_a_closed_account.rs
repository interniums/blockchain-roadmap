//! CHAINPATH-GENERATED-SCAFFOLD
//!
//!
//! Practice: altvm-solana-security-revive-a-closed-account  (break, grain block, difficulty 4)
//! Run:      cargo test-sbf -p sealevel-attacks --test revive_a_closed_account -- --nocapture
//!
//! THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
//! resolves and fails honestly, with one named case per acceptance criterion, instead of
//! reporting "the test path may not exist" — which is a broken harness, not a red test.
//!
//! Replace each placeholder with a real assertion as you go. A criterion you have actually
//! tested no longer needs its placeholder. Delete this notice when none remain.
//!
//! What the practice asks for:
//!   Implement a close instruction the naive way - transfer the account's lamports out and
//!   return. In a single transaction, call it and then transfer rent back into the same account,
//!   and show that after the transaction the account still exists and still holds its old data.
//!   Fix it by zeroing the data and writing a closed discriminator, and show the revival now
//!   fails. In the same program, add two more defects and their tests: an instruction using
//!   `init_if_needed` on an account holding a balance, called twice to reset live state; and a
//!   transfer instruction that does not check that its source and destination differ, driven with
//!   the same account passed twice to inflate a balance. Finally, build the program with overflow
//!   checks disabled and show a subtraction wrapping, then enable them and show it aborting.

/// The revival test asserts the account's stale data is readable after the transaction that
/// closed it
#[test]
fn criterion_01_the_revival_test_asserts_the_account_s() {
    panic!("The revival test asserts the account's stale data is readable after the transaction that closed it");
}

/// The fixed close makes the same revival test fail, and the test asserts the data is zeroed
#[test]
fn criterion_02_the_fixed_close_makes_the_same_revival() {
    panic!("The fixed close makes the same revival test fail, and the test asserts the data is zeroed");
}

/// The reinitialization test asserts a live balance was reset, and the guarded version rejects
/// the second call
#[test]
fn criterion_03_the_reinitialization_test_asserts_a_live_balance() {
    panic!("The reinitialization test asserts a live balance was reset, and the guarded version rejects the second call");
}

/// The aliasing test asserts a balance increased with no corresponding decrease, and the fixed
/// version rejects equal keys
#[test]
fn criterion_04_the_aliasing_test_asserts_a_balance_increased() {
    panic!("The aliasing test asserts a balance increased with no corresponding decrease, and the fixed version rejects equal keys");
}

/// One test demonstrates a wrapping subtraction with overflow checks off and the same operation
/// aborting with them on
#[test]
fn criterion_05_one_test_demonstrates_a_wrapping_subtraction_with() {
    panic!("One test demonstrates a wrapping subtraction with overflow checks off and the same operation aborting with them on");
}
