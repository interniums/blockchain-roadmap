"""
CHAINPATH-GENERATED-SCAFFOLD

Practice: protocol-consensus-specs-run-the-spec  (implement, grain module, difficulty 4)
Run:      uv run python solutions/advance_state.py --preset minimal --slots 40 --out out/trace.json

THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
resolves and fails honestly, with one named case per acceptance criterion, instead of
reporting "the test path may not exist" — which is a broken harness, not a red test.

Replace each placeholder with a real assertion as you go. A criterion you have actually
tested no longer needs its placeholder. Delete this notice when none remain.

What the practice asks for:
  Clone ethereum/consensus-specs, build the pyspec with the repository's current tooling, and
  then write a Python script that imports the built module for the latest stable fork under
  the minimal preset. In that script: construct a genesis state, advance it several slots with
  the per-slot processing function, apply at least one empty block through the state
  transition, and run far enough to cross an epoch boundary so epoch processing fires. Print,
  at each step, the slot, the latest block header, and the justified and finalized
  checkpoints. Then repeat the epoch crossing under the mainnet preset and record how long
  each takes. Write down, for every printed field, which specification document and which
  function produced it.

What this has to end up doing:
1. out/trace.json records slot, latest block header root, and the justified and finalized
checkpoint epochs at every step
2. The trace crosses at least one epoch boundary and shows the justified checkpoint
advancing, proving epoch processing ran
3. The script imports the built spec module rather than reimplementing any rule, and a
written note names the spec function behind each printed field
4. A recorded timing comparison shows the same epoch crossing under the minimal and mainnet
presets, with the ratio stated
"""

import sys


def main(argv: list) -> int:
    del argv
    print("TODO: this script is unimplemented (practice protocol-consensus-specs-run-the-spec)", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
