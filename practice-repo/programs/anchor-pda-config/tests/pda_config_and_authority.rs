//! CHAINPATH-GENERATED-SCAFFOLD
//!
//!
//! Practice: altvm-anchor-pda-config-and-authority  (implement, grain block, difficulty 2)
//! Run:      anchor test
//!
//! THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
//! resolves and fails honestly, with one named case per acceptance criterion, instead of
//! reporting "the test path may not exist" — which is a broken harness, not a red test.
//!
//! Replace each placeholder with a real assertion as you go. A criterion you have actually
//! tested no longer needs its placeholder. Delete this notice when none remain.
//!
//! What the practice asks for:
//!   Build a two-instruction Anchor program. `initialize` creates a config account at a PDA
//!   derived from `seeds = [b"config", authority.key().as_ref()]` with `bump`, storing the
//!   authority pubkey and the canonical bump inside the account. `update` mutates a value in that
//!   config and must accept it only from the stored authority - enforced by the `seeds` and
//!   `bump` constraints plus `has_one = authority` together with a `Signer` authority, and by
//!   nothing you wrote by hand inside the handler body. Write tests for four cases: the happy
//!   path, a second user calling `update` with the victim's config and their own signer, a caller
//!   passing a config account at a non-canonical bump, and a caller passing an account of the
//!   right size owned by a different program. For each failing case, assert on the specific
//!   error, and record in a comment which of the three questions - owner, signer, correct
//!   instance - that error answers.

/// The happy-path test confirms the update and reads back the new value
#[test]
fn criterion_01_the_happy_path_test_confirms_the_update() {
    panic!("The happy-path test confirms the update and reads back the new value");
}

/// The wrong-authority test fails with a constraint error identifiable by name or code, and the
/// handler body contains no manual authority comparison
#[test]
fn criterion_02_the_wrong_authority_test_fails_with_a() {
    panic!("The wrong-authority test fails with a constraint error identifiable by name or code, and the handler body contains no manual authority comparison");
}

/// The non-canonical-bump test fails at the seeds constraint rather than succeeding against a
/// second valid address
#[test]
fn criterion_03_the_non_canonical_bump_test_fails_at() {
    panic!("The non-canonical-bump test fails at the seeds constraint rather than succeeding against a second valid address");
}

/// The foreign-owned-account test fails before deserialization, and the test comment names
/// which check rejected it
#[test]
fn criterion_04_the_foreign_owned_account_test_fails_before() {
    panic!("The foreign-owned-account test fails before deserialization, and the test comment names which check rejected it");
}
