//! CHAINPATH-GENERATED-SCAFFOLD
//!
//!
//! Practice: zk-zkvms-bench-two-provers  (measure, grain block, difficulty 3)
//! Run:      cargo run --release --bin bench -- --out results.csv && python3 scripts/check_results.py results.csv
//!
//! THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
//! resolves and fails honestly, with one named case per acceptance criterion, instead of
//! reporting "the test path may not exist" — which is a broken harness, not a red test.
//!
//! Replace each placeholder with a real assertion as you go. A criterion you have actually
//! tested no longer needs its placeholder. Delete this notice when none remain.
//!
//! What the practice asks for:
//!   Take one non-trivial guest program — a fixed-iteration hash chain is a good choice because
//!   it scales cleanly — and implement it for both SP1 and RISC Zero. Run each at three workload
//!   sizes on the same machine. Record, for every run: proving wall-clock in seconds, peak
//!   resident memory in gigabytes, proof size in bytes, and the native execution time of the same
//!   computation in milliseconds. Record the machine: CPU model, core count, RAM, and whether a
//!   GPU was used. Emit the results as a CSV plus a short written recommendation naming which
//!   system you would use for a stated product requirement and why. Every number in the output
//!   must carry its unit; a table cell reading "12" is a failed run.
//!
//! What this has to end up doing:
//!   1. results.csv contains one row per (system, workload size) with columns for prove_seconds,
//!   peak_mem_gb, proof_bytes, native_exec_ms
//!   2. The checker script fails if any cell is empty, if any column header lacks a unit suffix,
//!   or if the hardware block is missing
//!   3. A README section states the CPU, core count, RAM, and GPU presence for the machine that
//!   produced the numbers
//!   4. A written recommendation names one product requirement and the system it selects, with
//!   the measured figure that decided it

fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();
    let _ = &args;
    eprintln!("TODO: this binary is unimplemented (practice zk-zkvms-bench-two-provers)");
    std::process::exit(1);
}
