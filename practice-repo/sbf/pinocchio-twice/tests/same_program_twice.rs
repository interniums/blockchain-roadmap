//! CHAINPATH-GENERATED-SCAFFOLD
//!
//!
//! Practice: altvm-pinocchio-same-program-twice  (implement, grain module, difficulty 4)
//! Run:      cargo test-sbf -p pinocchio-twice --test same_program_twice -- --nocapture
//!
//! THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
//! resolves and fails honestly, with one named case per acceptance criterion, instead of
//! reporting "the test path may not exist" — which is a broken harness, not a red test.
//!
//! Replace each placeholder with a real assertion as you go. A criterion you have actually
//! tested no longer needs its placeholder. Delete this notice when none remain.
//!
//! What the practice asks for:
//!   Write the same trivial program twice: increment a counter held in a PDA, owned by the
//!   caller. Version one is Anchor, using `seeds`/`bump` and `has_one`. Version two is Pinocchio,
//!   with a `#[repr(C)]` state struct cast onto the account data and every check written by hand
//!   - owner equals program id, account is writable, the authority signed, the PDA re-derives
//!   from the expected seeds, and the account is the caller's instance. Run both against the same
//!   test suite covering the happy path and each of the four attacker cases. Then record the
//!   compute units each version consumes for the same successful increment, taken from the
//!   program logs, and produce a table mapping every hand-written check in the Pinocchio version
//!   to the Anchor constraint that generated it.

/// Both programs pass an identical set of tests including the happy path and at least four
/// attacker cases
#[test]
fn criterion_01_both_programs_pass_an_identical_set_of() {
    panic!("Both programs pass an identical set of tests including the happy path and at least four attacker cases");
}

/// The test output prints the compute units consumed by each version for the same increment,
/// and the Pinocchio figure is the lower of the two
#[test]
fn criterion_02_the_test_output_prints_the_compute_units() {
    panic!("The test output prints the compute units consumed by each version for the same increment, and the Pinocchio figure is the lower of the two");
}

/// A committed table maps each hand-written Pinocchio check to its Anchor constraint, with no
/// unmatched rows in either direction
#[test]
fn criterion_03_a_committed_table_maps_each_hand_written() {
    panic!("A committed table maps each hand-written Pinocchio check to its Anchor constraint, with no unmatched rows in either direction");
}
