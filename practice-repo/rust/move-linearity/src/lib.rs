//! Move's linear resources and its bytecode verifier, rebuilt in the language you have.
//!
//! Two exercises live here and they are two readings of one claim. `tests/abilities.rs` asks what
//! Rust's ownership model does and does not give you of Move's four abilities. `tests/verifier.rs`
//! asks the harder question: if the guarantee cannot rest on the compiler — because the source
//! language is not what gets deployed — what does a checker over bytecode actually establish?
//!
//! Nothing is written yet. Both test files are checklists of their acceptance criteria.

/// Remove this once there is something real to export.
pub fn unimplemented_marker() -> &'static str {
    "TODO: nothing in this crate is implemented yet"
}
