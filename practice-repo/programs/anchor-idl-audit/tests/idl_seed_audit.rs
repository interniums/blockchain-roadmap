//! CHAINPATH-GENERATED-SCAFFOLD
//!
//!
//! Practice: altvm-anchor-idl-seed-audit  (read, grain block, difficulty 3)
//! Run:      anchor build && node scripts/idl-seed-audit.mjs target/idl
//!
//! THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
//! resolves and fails honestly, with one named case per acceptance criterion, instead of
//! reporting "the test path may not exist" — which is a broken harness, not a red test.
//!
//! Replace each placeholder with a real assertion as you go. A criterion you have actually
//! tested no longer needs its placeholder. Delete this notice when none remain.
//!
//! What the practice asks for:
//!   Take a program with at least two PDA accounts - one declared with `seeds` plus `bump` alone,
//!   and one declared with `init` together with `seeds` - and build it. Open the emitted IDL and,
//!   for every account in every instruction, record whether a PDA description with its seeds is
//!   present. Then write a generator check: a script that reads the IDL and, for each account the
//!   program declares as a PDA, attempts to derive the address from the IDL's own seed
//!   description and compares it with the address your client derives from the source. Report
//!   which accounts the IDL describes completely, which it under-describes, and what a generated
//!   client would do wrong in each under-described case. Record the Anchor version you used,
//!   because this behaviour is version-dependent.

/// The script exits non-zero and names each account for which the program declares seeds but
/// the IDL carries no derivable seed description
#[test]
fn criterion_01_the_script_exits_non_zero_and_names() {
    panic!("The script exits non-zero and names each account for which the program declares seeds but the IDL carries no derivable seed description");
}

/// The report states, per under-described account, whether a generated client could derive the
/// address at all
#[test]
fn criterion_02_the_report_states_per_under_described_account() {
    panic!("The report states, per under-described account, whether a generated client could derive the address at all");
}

/// The report records the exact Anchor version, since the presence of the defect depends on it
#[test]
fn criterion_03_the_report_records_the_exact_anchor_version() {
    panic!("The report records the exact Anchor version, since the presence of the defect depends on it");
}
