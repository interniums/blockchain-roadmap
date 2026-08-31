// CHAINPATH-GENERATED-SCAFFOLD
//
// Practice: zk-noir-circuits-unconstrained-hint-forgery  (break, grain block, difficulty 3)
// Run:      nargo test --show-output
//
// THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
// resolves and fails honestly, with one named case per acceptance criterion, instead of
// reporting "the test path may not exist" — which is a broken harness, not a red test.
//
// Replace each placeholder with a real assertion as you go. A criterion you have actually
// tested no longer needs its placeholder. Delete this notice when none remain.
//
// What the practice asks for:
//   Write a Noir circuit that takes a public input x and proves the prover knows its square
//   root. Compute the root in an unconstrained function and — deliberately — return it without
//   constraining result * result == x. Then supply a witness where the unconstrained function
//   returns an arbitrary value of your choosing and show the circuit still satisfies and a proof
//   still verifies, meaning you have proved a false statement. Add the single missing constraint
//   and show the same witness now fails. Keep both circuit versions in the repository. Record
//   the gate count of each version so you can see what the missing check actually cost. Pin both
//   the compiler and the backend versions in the README.

// The circuit itself. `main` is what gets proved; the tests below are what tell you whether it
// constrains anything.
//
// The signature is the one the spec dictates and nothing more: a public input, and a hint the
// prover computes outside the circuit. Parameter names are not underscore-prefixed because
// `nargo check` writes them into Prover.toml, and `_x = 0` is a worse thing to hand someone
// than `x = 0`.
fn main(x: pub Field) {
    // TODO: take the hint, then decide what has to be true of it. That decision is the
    // practice: the unsound version constrains nothing about the hint, and still verifies.
    let _ = x;
    assert(false, "TODO: main is unimplemented");
}

// Next: an `unconstrained fn` returning the hint. It is not stubbed here on purpose — an
// uncalled one warns, and calling it means writing the unsound circuit, which is the exercise.
// `unconstrained` means the prover computes it outside the circuit, so nothing it returns is
// proved by itself. Reaching it from `main` needs an `unsafe` block, and that block is the
// thing to be suspicious of: it is where a false statement gets in.

// A test against the unsound circuit passes with a hint value that is not a square root of the
// public input
#[test]
fn criterion_01_a_test_against_the_unsound_circuit_passes() {
    assert(false, "A test against the unsound circuit passes with a hint value that is not a square root of the public input");
}

// A test against the fixed circuit asserts the same witness fails
#[test]
fn criterion_02_a_test_against_the_fixed_circuit_asserts() {
    assert(false, "A test against the fixed circuit asserts the same witness fails");
}

// A test asserts the fixed circuit still accepts a genuine square root, so the fix did not
// simply break the circuit
#[test]
fn criterion_03_a_test_asserts_the_fixed_circuit_still() {
    assert(false, "A test asserts the fixed circuit still accepts a genuine square root, so the fix did not simply break the circuit");
}

// The README records the gate count of both versions and the pinned compiler and backend
// versions
#[test]
fn criterion_04_the_readme_records_the_gate_count_of() {
    assert(false, "The README records the gate count of both versions and the pinned compiler and backend versions");
}
