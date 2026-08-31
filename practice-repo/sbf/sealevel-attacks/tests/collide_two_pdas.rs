//! CHAINPATH-GENERATED-SCAFFOLD
//!
//!
//! Practice: altvm-solana-security-collide-two-pdas  (implement, grain block, difficulty 3)
//! Run:      cargo test-sbf -p sealevel-attacks --test collide_two_pdas -- --nocapture
//!
//! THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
//! resolves and fails honestly, with one named case per acceptance criterion, instead of
//! reporting "the test path may not exist" — which is a broken harness, not a red test.
//!
//! Replace each placeholder with a real assertion as you go. A criterion you have actually
//! tested no longer needs its placeholder. Delete this notice when none remain.
//!
//! What the practice asks for:
//!   Write a program whose PDA is derived from two variable-length string seeds concatenated
//!   without delimiters - for example a user name and a pool name. Then find a colliding pair:
//!   two distinct (user, pool) inputs whose concatenation is byte-identical, so both derive the
//!   same address. Demonstrate the consequence with a test in which one user's state is written
//!   through the other user's parameters. Fix it with fixed-width or length-prefixed seeds and
//!   show the collision is no longer constructible. In the same program, add an instruction that
//!   takes the bump as a user-supplied argument and derives from it, and show you can find a
//!   non-canonical bump that yields a second valid address for the same logical key - then fix
//!   that by storing and using the canonical bump.

/// A test produces two distinct seed tuples that derive an identical address and asserts
/// equality of the two derived keys
#[test]
fn criterion_01_a_test_produces_two_distinct_seed_tuples() {
    panic!("A test produces two distinct seed tuples that derive an identical address and asserts equality of the two derived keys");
}

/// A test writes state through the colliding tuple and asserts the victim's account was
/// modified
#[test]
fn criterion_02_a_test_writes_state_through_the_colliding() {
    panic!("A test writes state through the colliding tuple and asserts the victim's account was modified");
}

/// After the length-prefixed fix, a search over the same input space finds no collision and the
/// test asserts that
#[test]
fn criterion_03_after_the_length_prefixed_fix_a_search() {
    panic!("After the length-prefixed fix, a search over the same input space finds no collision and the test asserts that");
}

/// A test finds a non-canonical bump producing a second valid address for one logical key, and
/// the fixed version rejects it
#[test]
fn criterion_04_a_test_finds_a_non_canonical_bump() {
    panic!("A test finds a non-canonical bump producing a second valid address for one logical key, and the fixed version rejects it");
}
