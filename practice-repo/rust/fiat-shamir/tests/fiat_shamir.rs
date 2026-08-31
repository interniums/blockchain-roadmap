//! CHAINPATH-GENERATED-SCAFFOLD
//!
//!
//! Practice: zk-proof-systems-forge-a-fiat-shamir-proof  (break, grain module, difficulty 4)
//! Run:      cargo test --test fiat_shamir -- --nocapture
//!
//! THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
//! resolves and fails honestly, with one named case per acceptance criterion, instead of
//! reporting "the test path may not exist" — which is a broken harness, not a red test.
//!
//! Replace each placeholder with a real assertion as you go. A criterion you have actually
//! tested no longer needs its placeholder. Delete this notice when none remain.
//!
//! What the practice asks for:
//!   Start from a toy interactive sigma protocol — knowledge of a discrete log is enough —
//!   implemented in Rust with a deliberately weak Fiat–Shamir transform that derives the
//!   challenge by hashing only the public statement and omitting the prover's first message.
//!   Write a forger that exploits the omission: because the challenge no longer depends on the
//!   commitment, the forger can pick the challenge first and construct a transcript backwards for
//!   a statement it does not know a witness for. Show the verifier accepting it. Then fix the
//!   transform so the challenge hashes the full transcript including the prover's first message
//!   and any domain separator, and show the same forger now fails. Keep both transforms in the
//!   codebase behind a flag so the tests can exercise each.

/// A test named for forgery constructs a transcript for a statement with no known witness and
/// asserts the weak verifier accepts it
#[test]
fn criterion_01_a_test_named_for_forgery_constructs_a() {
    panic!("A test named for forgery constructs a transcript for a statement with no known witness and asserts the weak verifier accepts it");
}

/// The same forged transcript is asserted to be rejected by the fixed verifier
#[test]
fn criterion_02_the_same_forged_transcript_is_asserted_to() {
    panic!("The same forged transcript is asserted to be rejected by the fixed verifier");
}

/// An honest proof is asserted to be accepted by both verifiers, proving the fix did not simply
/// break verification
#[test]
fn criterion_03_an_honest_proof_is_asserted_to_be() {
    panic!("An honest proof is asserted to be accepted by both verifiers, proving the fix did not simply break verification");
}

/// A comment or test name states which value was missing from the hashed transcript
#[test]
fn criterion_04_a_comment_or_test_name_states_which() {
    panic!("A comment or test name states which value was missing from the hashed transcript");
}
