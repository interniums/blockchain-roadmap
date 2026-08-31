//! CHAINPATH-GENERATED-SCAFFOLD
//!
//!
//! Practice: altvm-anchor-delete-the-has-one  (break, grain block, difficulty 2)
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
//!   Start from a working Anchor program whose `update` instruction is guarded by `has_one =
//!   authority` and a `Signer` authority. Remove the `has_one` constraint and nothing else. Write
//!   an attacker test that passes the victim's config account together with the attacker's own
//!   signer, and takes over the config. The test must pass - the exploit must genuinely succeed -
//!   and it must assert on the resulting state, not merely that the transaction confirmed. Then
//!   restore the constraint and show the same test now fails at the constraint. Finally, write a
//!   short note in the test file explaining why the owner check and the discriminator check both
//!   passed during the successful exploit, and what class of bug that makes this.

/// With the constraint removed, the exploit test passes and asserts the attacker's key is now
/// stored as the config's authority
#[test]
fn criterion_01_with_the_constraint_removed_the_exploit_test() {
    panic!("With the constraint removed, the exploit test passes and asserts the attacker's key is now stored as the config's authority");
}

/// With the constraint restored, the same test fails with a constraint error and the assertion
/// is never reached
#[test]
fn criterion_02_with_the_constraint_restored_the_same_test() {
    panic!("With the constraint restored, the same test fails with a constraint error and the assertion is never reached");
}

/// A test-file comment states that the owner and discriminator checks passed throughout, and
/// names the vulnerability class
#[test]
fn criterion_03_a_test_file_comment_states_that_the() {
    panic!("A test-file comment states that the owner and discriminator checks passed throughout, and names the vulnerability class");
}
