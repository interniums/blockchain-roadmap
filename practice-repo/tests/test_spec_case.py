"""
CHAINPATH-GENERATED-SCAFFOLD

Practice: protocol-contributing-write-a-spec-test  (implement, grain block, difficulty 3)
Run:      uv run pytest tests -k your_case_name -v --junitxml=out/results.xml

THIS IS A CHECKLIST, NOT A SPECIFICATION. It was generated so that the command above
resolves and fails honestly, with one named case per acceptance criterion, instead of
reporting "the test path may not exist" — which is a broken harness, not a red test.

Replace each placeholder with a real assertion as you go. A criterion you have actually
tested no longer needs its placeholder. Delete this notice when none remain.

What the practice asks for:
  Pick an execution-layer edge case you understand well — a transient storage interaction, a
  delegation edge case, a precompile boundary condition — and check whether the execution spec
  test repository already covers it. If it does, pick another until you find a genuine gap.
  Write the test case in that repository's own framework, run it against at least two
  execution clients through the repository's tooling, and confirm they agree. Then write down
  which client behaviours your test would catch a divergence in, and why that divergence would
  matter. Submit it.

The command selects with `-k your_case_name`, so one case below carries that
substring in its name. Rename it to whatever your case is actually about, and
change the command to match.
"""

# The new test case runs within the repository's own framework and passes against at least two
# execution clients
def test_criterion_01_the_new_test_case_runs_within_the_your_case_name():
    raise AssertionError("The new test case runs within the repository's own framework and passes against at least two execution clients")


# A search of the existing corpus is documented, showing the case was not already covered and
# naming what the nearest existing cases do cover
def test_criterion_02_a_search_of_the_existing_corpus_is():
    raise AssertionError("A search of the existing corpus is documented, showing the case was not already covered and naming what the nearest existing cases do cover")


# A written note states which class of client divergence the test would catch and what the
# consequence of that divergence would be on mainnet
def test_criterion_03_a_written_note_states_which_class_of():
    raise AssertionError("A written note states which class of client divergence the test would catch and what the consequence of that divergence would be on mainnet")


# The case is submitted as a pull request, or a written explanation is given for why it was
# withdrawn
def test_criterion_04_the_case_is_submitted_as_a_pull():
    raise AssertionError("The case is submitted as a pull request, or a written explanation is given for why it was withdrawn")
