//! CHAINPATH-GENERATED-SCAFFOLD
//!
//!
//! Practice: altvm-move-verify-the-bytecode  (implement, grain block, difficulty 4)
//! Run:      cargo test -p move-linearity --test verifier -- --nocapture
//!
//! THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
//! resolves and fails honestly, with one named case per acceptance criterion, instead of
//! reporting "the test path may not exist" — which is a broken harness, not a red test.
//!
//! Replace each placeholder with a real assertion as you go. A criterion you have actually
//! tested no longer needs its placeholder. Delete this notice when none remain.
//!
//! What the practice asks for:
//!   Move's guarantee does not rest on its compiler. Bytecode is re-checked at publication by a
//!   verifier that trusts no source language, because the source language is not what gets
//!   deployed. Build a small version of that argument. Define a stack machine with perhaps eight
//!   instructions, one of which duplicates the top of the stack and two of which move a resource
//!   handle. Write a verifier that walks the instruction list and rejects any program in which a
//!   resource handle is consumed twice or left on the stack at return. Then write the attack: a
//!   hand-assembled instruction list that a well-behaved compiler would never emit, and show your
//!   verifier refusing it. Finally, state the property your verifier actually establishes and the
//!   one it does not. A linear-use check is not a proof of functional correctness, and being
//!   clear about that boundary is most of the value here.

/// A stack machine is defined with at least one instruction that duplicates the top of the
/// stack and at least two that move a resource handle
#[test]
fn criterion_01_a_stack_machine_is_defined_with_at() {
    panic!("A stack machine is defined with at least one instruction that duplicates the top of the stack and at least two that move a resource handle");
}

/// A verifier walks a program and rejects double-consumption of a resource handle, reporting
/// the offending instruction index
#[test]
fn criterion_02_a_verifier_walks_a_program_and_rejects() {
    panic!("A verifier walks a program and rejects double-consumption of a resource handle, reporting the offending instruction index");
}

/// The verifier rejects a program that returns with an unconsumed resource handle still on the
/// stack
#[test]
fn criterion_03_the_verifier_rejects_a_program_that_returns() {
    panic!("The verifier rejects a program that returns with an unconsumed resource handle still on the stack");
}

/// A hand-assembled program no compiler would emit is shown being refused, demonstrating the
/// check does not depend on the source language
#[test]
fn criterion_04_a_hand_assembled_program_no_compiler_would() {
    panic!("A hand-assembled program no compiler would emit is shown being refused, demonstrating the check does not depend on the source language");
}

/// At least one well-formed program is accepted, so the verifier is not simply refusing
/// everything
#[test]
fn criterion_05_at_least_one_well_formed_program_is() {
    panic!("At least one well-formed program is accepted, so the verifier is not simply refusing everything");
}

/// A comment states the property the verifier establishes and names one class of bug it cannot
/// see
#[test]
fn criterion_06_a_comment_states_the_property_the_verifier() {
    panic!("A comment states the property the verifier establishes and names one class of bug it cannot see");
}
