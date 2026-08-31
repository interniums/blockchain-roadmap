//! CHAINPATH-GENERATED-SCAFFOLD
//!
//!
//! Practice: altvm-move-linear-by-construction  (implement, grain block, difficulty 3)
//! Run:      cargo test -p move-linearity --test abilities -- --nocapture
//!
//! THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
//! resolves and fails honestly, with one named case per acceptance criterion, instead of
//! reporting "the test path may not exist" — which is a broken harness, not a red test.
//!
//! Replace each placeholder with a real assertion as you go. A criterion you have actually
//! tested no longer needs its placeholder. Delete this notice when none remain.
//!
//! What the practice asks for:
//!   Move's claim is that a resource can never be copied or implicitly discarded, only moved
//!   between program storage locations. Rust makes a weaker version of the same claim with
//!   ownership. Build the comparison in the language you have. Define a Rust type representing a
//!   coin whose value cannot be duplicated or silently dropped. Rust gives you move semantics for
//!   free, so the copy half is easy; the drop half is not, because Rust runs Drop and Move simply
//!   refuses to compile a discard. Make discarding a compile-time error rather than a runtime
//!   one, and say in a comment which of Move's four abilities you have actually reproduced and
//!   which you have only approximated. Then do the part that matters more than the mechanism. The
//!   security track ranked vulnerability classes by realised loss. Re-run that ranking against
//!   this guarantee: write a test per class showing which ones linearity removes and which it
//!   leaves exactly as dangerous. Accidental double-credit and credit-without-debit should fall.
//!   Access control on a privileged mint should not.

/// A coin type is defined that cannot be duplicated, with a test asserting the duplicate cannot
/// be constructed rather than that it is rejected at runtime
#[test]
fn criterion_01_a_coin_type_is_defined_that_cannot() {
    panic!("A coin type is defined that cannot be duplicated, with a test asserting the duplicate cannot be constructed rather than that it is rejected at runtime");
}

/// Discarding a coin without settling it is a compile-time failure, shown by a commented-out
/// line and a note recording what the compiler said
#[test]
fn criterion_02_discarding_a_coin_without_settling_it_is() {
    panic!("Discarding a coin without settling it is a compile-time failure, shown by a commented-out line and a note recording what the compiler said");
}

/// A comment maps each of Move's four abilities onto what Rust does or does not give you,
/// naming copy, drop, store and key individually
#[test]
fn criterion_03_a_comment_maps_each_of_move_s() {
    panic!("A comment maps each of Move's four abilities onto what Rust does or does not give you, naming copy, drop, store and key individually");
}

/// A test shows an accidental double-credit being impossible to express against the linear type
#[test]
fn criterion_04_a_test_shows_an_accidental_double_credit() {
    panic!("A test shows an accidental double-credit being impossible to express against the linear type");
}

/// A test shows credit-without-debit being impossible to express against the linear type
#[test]
fn criterion_05_a_test_shows_credit_without_debit_being() {
    panic!("A test shows credit-without-debit being impossible to express against the linear type");
}

/// A test shows an access-control bug on a privileged mint remaining fully exploitable, with a
/// comment stating why linearity does not touch it
#[test]
fn criterion_06_a_test_shows_an_access_control_bug() {
    panic!("A test shows an access-control bug on a privileged mint remaining fully exploitable, with a comment stating why linearity does not touch it");
}
